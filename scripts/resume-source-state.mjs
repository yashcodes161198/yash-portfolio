import { createHash } from "node:crypto";
import { appendFile, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { list, put } from "@vercel/blob";

const SOURCE_DIRECTORY = path.resolve(process.env.RESUME_SOURCE_DIRECTORY || ".resume-build/source");
const MARKER_PREFIX = "resume-source-hashes/";

async function sourceFiles(directory, root = directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await sourceFiles(absolutePath, root));
    } else if (entry.isFile()) {
      files.push({
        absolutePath,
        relativePath: path.relative(root, absolutePath).split(path.sep).join("/"),
      });
    }
  }

  return files.sort((left, right) => left.relativePath.localeCompare(right.relativePath));
}

async function calculateSourceHash() {
  const files = await sourceFiles(SOURCE_DIRECTORY);
  if (!files.some((file) => file.relativePath === "main.tex")) {
    throw new Error("Extracted Overleaf source does not contain main.tex.");
  }

  const hash = createHash("sha256");
  for (const file of files) {
    const bytes = await readFile(file.absolutePath);
    hash.update(file.relativePath);
    hash.update("\0");
    hash.update(bytes);
    hash.update("\0");
  }
  return hash.digest("hex");
}

function requireBlobToken() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is required to track the resume source state.");
  }
}

function markerPath(hash) {
  if (!/^[a-f0-9]{64}$/.test(hash)) throw new Error("Invalid resume source hash.");
  return `${MARKER_PREFIX}${hash}.txt`;
}

async function writeOutput(name, value) {
  if (process.env.GITHUB_OUTPUT) {
    await appendFile(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
  }
}

async function check() {
  requireBlobToken();
  const hash = await calculateSourceHash();
  const pathname = markerPath(hash);
  const result = await list({ prefix: pathname, limit: 1 });
  const changed = !result.blobs.some((blob) => blob.pathname === pathname);

  await writeOutput("changed", String(changed));
  await writeOutput("source_hash", hash);
  console.log(changed
    ? `Resume source ${hash.slice(0, 12)} has changed.`
    : `Resume source ${hash.slice(0, 12)} is already published; skipping compilation.`);
}

async function record() {
  requireBlobToken();
  const hash = process.env.RESUME_SOURCE_HASH?.trim() || "";
  const pathname = markerPath(hash);
  const existing = await list({ prefix: pathname, limit: 1 });

  if (!existing.blobs.some((blob) => blob.pathname === pathname)) {
    await put(pathname, `${hash}\n`, {
      access: "public",
      addRandomSuffix: false,
      cacheControlMaxAge: 31_536_000,
      contentType: "text/plain",
    });
  }
  console.log(`Recorded published resume source ${hash.slice(0, 12)}.`);
}

async function hashOnly() {
  console.log(await calculateSourceHash());
}

const command = process.argv[2] || "check";
if (command === "check") await check();
else if (command === "record") await record();
else if (command === "hash") await hashOnly();
else throw new Error(`Unknown resume source state command: ${command}`);
