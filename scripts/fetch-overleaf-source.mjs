import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const MAX_ZIP_BYTES = 25 * 1024 * 1024;
const outputPath = path.resolve(process.argv[2] || ".resume-build/project.zip");

function requiredViewUrl() {
  const raw = process.env.OVERLEAF_VIEW_URL?.trim();
  if (!raw) throw new Error("OVERLEAF_VIEW_URL is required.");

  const url = new URL(raw);
  if (url.protocol !== "https:" || url.hostname !== "www.overleaf.com") {
    throw new Error("OVERLEAF_VIEW_URL must use https://www.overleaf.com.");
  }
  if (!/^\/read\/[a-z]+$/.test(url.pathname) || !/^#[a-f0-9]+$/i.test(url.hash)) {
    throw new Error("OVERLEAF_VIEW_URL must be a complete read-only link, including its fragment.");
  }
  return url;
}

function updateCookies(response, jar) {
  const values = typeof response.headers.getSetCookie === "function"
    ? response.headers.getSetCookie()
    : [response.headers.get("set-cookie")].filter(Boolean);

  for (const value of values) {
    const pair = value.split(";", 1)[0];
    const separator = pair.indexOf("=");
    if (separator > 0) jar.set(pair.slice(0, separator), pair.slice(separator + 1));
  }
}

function cookieHeader(jar) {
  return [...jar].map(([name, value]) => `${name}=${value}`).join("; ");
}

async function checkedFetch(url, options, jar) {
  const headers = new Headers(options?.headers);
  const cookies = cookieHeader(jar);
  if (cookies) headers.set("Cookie", cookies);

  const response = await fetch(url, {
    ...options,
    headers,
    redirect: "follow",
    signal: AbortSignal.timeout(30_000),
  });
  updateCookies(response, jar);
  return response;
}

function metaContent(html, name) {
  for (const tag of html.matchAll(/<meta\b[^>]*>/gi)) {
    const tagName = tag[0].match(/\bname=["']([^"']+)["']/i)?.[1];
    if (tagName !== name) continue;
    return tag[0].match(/\bcontent=["']([^"']*)["']/i)?.[1]?.replaceAll("&amp;", "&") ?? null;
  }
  return null;
}

async function main() {
  const viewUrl = requiredViewUrl();
  const jar = new Map();
  const pageUrl = new URL(viewUrl);
  pageUrl.hash = "";

  const pageResponse = await checkedFetch(pageUrl, {}, jar);
  if (!pageResponse.ok) throw new Error(`Overleaf view page returned ${pageResponse.status}.`);
  const html = await pageResponse.text();
  const csrf = metaContent(html, "ol-csrfToken");
  const postPath = metaContent(html, "ol-postUrl");
  if (!csrf || !postPath?.startsWith("/read/") || !postPath.endsWith("/grant")) {
    throw new Error("Overleaf did not expose the expected read-only grant flow.");
  }

  const grantResponse = await checkedFetch(
    new URL(postPath, pageUrl.origin),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrf,
      },
      body: JSON.stringify({ confirmedByUser: false, tokenHashPrefix: viewUrl.hash }),
    },
    jar,
  );
  if (!grantResponse.ok) throw new Error(`Overleaf access grant returned ${grantResponse.status}.`);
  const grant = await grantResponse.json();
  if (typeof grant.redirect !== "string" || !/^\/project\/[a-f0-9]{24}$/.test(grant.redirect)) {
    throw new Error("Overleaf did not grant anonymous read-only project access.");
  }

  const zipResponse = await checkedFetch(
    new URL(`${grant.redirect}/download/zip`, pageUrl.origin),
    {},
    jar,
  );
  if (!zipResponse.ok) throw new Error(`Overleaf source download returned ${zipResponse.status}.`);
  const zip = new Uint8Array(await zipResponse.arrayBuffer());
  if (zip.byteLength > MAX_ZIP_BYTES || zip[0] !== 0x50 || zip[1] !== 0x4b) {
    throw new Error("Overleaf source download was not a safe-sized ZIP archive.");
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, zip);
  console.log(`Downloaded ${zip.byteLength} bytes of Overleaf source.`);
}

await main();
