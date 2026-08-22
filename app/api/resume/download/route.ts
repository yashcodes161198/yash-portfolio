import { list } from "@vercel/blob";

const RESUME_PREFIX = "resumes/yash-resume-";
const DOWNLOAD_NAME = "Yash-Resume.pdf";

function isPdf(bytes: Uint8Array) {
  return bytes.length >= 5 && new TextDecoder().decode(bytes.slice(0, 5)) === "%PDF-";
}

async function newestBlobUrl() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;

  try {
    const result = await list({ prefix: RESUME_PREFIX, limit: 100 });
    const newest = [...result.blobs].sort(
      (left, right) => right.uploadedAt.getTime() - left.uploadedAt.getTime(),
    )[0];
    return newest?.downloadUrl ?? newest?.url ?? null;
  } catch (error) {
    console.error("Unable to read the resume store; using the bundled fallback.", error);
    return null;
  }
}

async function fetchPdf(url: URL | string) {
  const response = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`Resume fetch returned ${response.status}.`);

  const bytes = new Uint8Array(await response.arrayBuffer());
  if (!isPdf(bytes)) throw new Error("Resume fetch did not return a PDF.");
  return bytes;
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const storedUrl = await newestBlobUrl();
  let source = storedUrl ? "blob" : "bundled";
  let bytes: Uint8Array;

  if (!storedUrl) {
    bytes = await fetchPdf(new URL(`/resume/${DOWNLOAD_NAME}`, request.url));
  } else {
    try {
      bytes = await fetchPdf(storedUrl);
    } catch (error) {
      source = "bundled";
      console.error("Unable to serve the stored resume; using the bundled fallback.", error);
      bytes = await fetchPdf(new URL(`/resume/${DOWNLOAD_NAME}`, request.url));
    }
  }

  const body = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  return new Response(body, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "Content-Disposition": `attachment; filename="${DOWNLOAD_NAME}"`,
      "Content-Length": String(bytes.byteLength),
      "Content-Type": "application/pdf",
      "X-Resume-Source": source,
    },
  });
}
