import { execFileSync } from "node:child_process";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const MAX_PDF_BYTES = 5 * 1024 * 1024;
const pdfPath = path.resolve(process.argv[2] || ".resume-build/source/main.pdf");
const details = await stat(pdfPath);
if (details.size <= 5 || details.size > MAX_PDF_BYTES) {
  throw new Error(`Resume PDF size ${details.size} is outside the allowed range.`);
}

const bytes = await readFile(pdfPath);
if (bytes.subarray(0, 5).toString("ascii") !== "%PDF-") {
  throw new Error("Compiled resume does not have a valid PDF signature.");
}

const info = execFileSync("pdfinfo", [pdfPath], { encoding: "utf8" });
const pages = Number(info.match(/^Pages:\s+(\d+)$/m)?.[1]);
if (!Number.isInteger(pages) || pages < 1 || pages > 4) {
  throw new Error(`Compiled resume has an unexpected page count: ${pages || "unknown"}.`);
}

const text = execFileSync("pdftotext", ["-layout", pdfPath, "-"], { encoding: "utf8" });
const firstLine = text.split(/\r?\n/).map((line) => line.trim()).find(Boolean);
if (firstLine !== "Yash") {
  throw new Error(`Compiled resume identity check failed: expected "Yash", found ${JSON.stringify(firstLine)}.`);
}
if (!text.includes("yashk.code@gmail.com")) {
  throw new Error("Compiled resume does not contain the expected email address.");
}

console.log(`Validated ${pages}-page resume (${details.size} bytes).`);
