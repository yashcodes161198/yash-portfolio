import { after } from "next/server";

type DispatchConfig = {
  repository: string;
  ref: string;
  token: string;
};

function dispatchConfig(): DispatchConfig | null {
  const repository = process.env.GITHUB_REPOSITORY?.trim();
  const ref = process.env.GITHUB_REF?.trim() || "main";
  const token = process.env.GITHUB_ACTIONS_TOKEN?.trim();

  if (!repository || !token || !/^[\w.-]+\/[\w.-]+$/.test(repository)) return null;
  return { repository, ref, token };
}

async function dispatchRefresh({ repository, ref, token }: DispatchConfig) {
  const response = await fetch(
    `https://api.github.com/repos/${repository}/actions/workflows/refresh-resume.yml/dispatches`,
    {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({ ref }),
      signal: AbortSignal.timeout(10_000),
    },
  );

  if (!response.ok) {
    throw new Error(`GitHub workflow dispatch returned ${response.status}.`);
  }
}

export const runtime = "nodejs";
export const maxDuration = 15;

export async function POST() {
  const config = dispatchConfig();
  if (!config) {
    return Response.json(
      { accepted: false, reason: "refresh-not-configured" },
      { status: 202, headers: { "Cache-Control": "no-store" } },
    );
  }

  after(async () => {
    try {
      await dispatchRefresh(config);
    } catch (error) {
      console.error("Resume refresh dispatch failed.", error);
    }
  });

  return Response.json(
    { accepted: true },
    { status: 202, headers: { "Cache-Control": "no-store" } },
  );
}
