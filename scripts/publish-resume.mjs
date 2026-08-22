import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { list, put } from "@vercel/blob";

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  throw new Error("BLOB_READ_WRITE_TOKEN is required to publish the resume.");
}

const pdfPath = path.resolve(process.argv[2] || ".resume-build/source/main.pdf");
const bytes = await readFile(pdfPath);
const hash = createHash("sha256").update(bytes).digest("hex");
const pathname = `resumes/yash-resume-${hash}.pdf`;
const existing = await list({ prefix: pathname, limit: 1 });

if (existing.blobs.some((blob) => blob.pathname === pathname)) {
  console.log(`Resume ${hash.slice(0, 12)} is already published.`);
  process.exit(0);
}

await put(pathname, bytes, {
  access: "public",
  addRandomSuffix: false,
  cacheControlMaxAge: 31_536_000,
  contentType: "application/pdf",
});
console.log(`Published immutable resume ${hash.slice(0, 12)}.`);
