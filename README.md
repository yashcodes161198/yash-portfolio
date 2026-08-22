# Yash's portfolio

A multi-page portfolio for Yash, a senior software engineer. It uses the
Next.js App Router, TypeScript, plain CSS, and Vercel Blob for an automatically
refreshed resume download.

## Run locally

Use Node.js 20.9 or newer and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Changes update in the browser automatically while the development server is
running. To test from another device on the same Wi-Fi network, open the
`Network` address printed by `npm run dev`.

## Checks

```bash
npm run check
```

This runs the TypeScript, lint, and production-build checks in sequence.

## Deploy to Vercel

### 1. Create the GitHub repository

1. Create an empty repository named `yash-portfolio` in Yash's GitHub account.
2. From this folder, initialize Git and push the current code:

```bash
git init
git add .
git commit -m "Build portfolio and automated resume refresh"
git branch -M main
git remote add origin https://github.com/yashcodes161198/yash-portfolio.git
git push -u origin main
```

### 2. Create the Vercel project and Blob store

1. In Vercel, choose **Add New > Project**, import `yash-portfolio`, and keep
   the detected framework as **Next.js**.
2. Deploy once, then set `NEXT_PUBLIC_SITE_URL` to the production `https://...`
   URL in **Project Settings > Environment Variables**.
3. In the project's **Storage** area, create and connect a Blob store. Vercel
   adds `BLOB_READ_WRITE_TOKEN` to the project automatically.

### 3. Connect the download click to GitHub Actions

1. In GitHub, create a fine-grained personal access token restricted to the
   `yash-portfolio` repository with **Actions: Read and write** permission.
2. Add these Vercel environment variables:
   - `GITHUB_ACTIONS_TOKEN`: the fine-grained token.
   - `GITHUB_REPOSITORY`: `yashcodes161198/yash-portfolio`.
   - `GITHUB_REF`: `main`.
3. Redeploy so the resume refresh endpoint receives those values.

### 4. Give the workflow its two secrets

In the GitHub repository, open **Settings > Secrets and variables > Actions**
and add:

- `OVERLEAF_VIEW_URL`: the complete read-only Overleaf link, including the
  `#...` fragment.
- `BLOB_READ_WRITE_TOKEN`: the token from the connected Vercel Blob store.

Never commit either value. Use `vercel env pull .env.local` if you need to copy
the Blob token from Vercel locally, and keep `.env.local` untracked.

### 5. Correct and test Overleaf once

The shared source currently contains `\newcommand{\name}{Yash Yash}`. Change it
to `\newcommand{\name}{Yash}` and recompile in Overleaf. Then open **Actions >
Refresh resume > Run workflow** in GitHub. A valid PDF is published to Blob;
invalid identity, email, size, page count, ZIP, or compile output leaves the
previous resume untouched.

After this setup, normal maintenance is only: edit and recompile in Overleaf.
A visitor immediately receives the last known-good PDF, while the same click
starts a background refresh for the next download.

You can also deploy from this folder with the Vercel CLI:

```bash
npx vercel
```

## Main content files

- `lib/portfolio-data.ts` contains work history and project cards.
- `app/globals.css` contains the complete visual system.
- `public/img/` contains Yash's portrait and project images.
- `public/resume/Yash-Resume.pdf` is the always-available fallback resume.
- `.github/workflows/refresh-resume.yml` compiles and publishes Overleaf updates.

The contact form opens the visitor's email application. It does not store or
send data through a third-party form service.
