const LOCAL_URL = "http://localhost:3000";

function normalizeSiteUrl(value?: string) {
  const candidate = value?.trim();

  if (!candidate) return undefined;

  const urlWithProtocol = /^https?:\/\//i.test(candidate)
    ? candidate
    : `https://${candidate}`;

  try {
    const url = new URL(urlWithProtocol);
    return url.toString().replace(/\/$/, "");
  } catch {
    return undefined;
  }
}

export const siteUrl =
  normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
  normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
  normalizeSiteUrl(process.env.VERCEL_URL) ??
  LOCAL_URL;
