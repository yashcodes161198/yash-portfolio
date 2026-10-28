import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

test("downloads only the configured Overleaf project", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "overleaf-source-"));
  const projectPath = "/project/6a703af2e3ab13b78d682cfc";
  const script = new URL("./fetch-overleaf-source.mjs", import.meta.url).href;
  const mock = `
    import assert from "node:assert/strict";
    process.argv[2] = process.argv[1];
    const responses = [
      new Response('<meta name="ol-csrfToken" content="csrf"><meta name="ol-postUrl" content="/read/example/grant">'),
      Response.json({ redirect: ${JSON.stringify(projectPath)} }),
      new Response(new Uint8Array([0x50, 0x4b, 0x03, 0x04])),
    ];
    globalThis.fetch = async (url) => {
      assert.ok(responses.length, "Unexpected download request");
      if (responses.length === 1) {
        assert.equal(String(url), "https://www.overleaf.com${projectPath}/download/zip");
      }
      return responses.shift();
    };
    await import(${JSON.stringify(script)});
  `;

  try {
    for (const [projectUrl, error] of [
      [`https://www.overleaf.com${projectPath}`, null],
      ["https://www.overleaf.com/project/000000000000000000000000", /different project/],
      [`https://example.com${projectPath}`, /OVERLEAF_PROJECT_URL must be/],
    ]) {
      const output = path.join(directory, error ? "rejected.zip" : "project.zip");
      const result = spawnSync(process.execPath, ["--input-type=module", "-e", mock, output], {
        encoding: "utf8",
        env: {
          ...process.env,
          OVERLEAF_VIEW_URL: "https://www.overleaf.com/read/example#abcdef",
          OVERLEAF_PROJECT_URL: projectUrl,
        },
      });
      if (error) {
        assert.notEqual(result.status, 0);
        assert.match(result.stderr, error);
        await assert.rejects(readFile(output), { code: "ENOENT" });
      } else {
        assert.equal(result.status, 0, result.stderr);
        assert.deepEqual(await readFile(output), Buffer.from([0x50, 0x4b, 0x03, 0x04]));
      }
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
