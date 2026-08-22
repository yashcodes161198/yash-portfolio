# Portfolio working notes

## Goal

Maintain a concise, visual portfolio for Yash, a senior software engineer. The
design reference is https://tedawf.com/. Do not add a blog.

## Design rules

- Keep the narrow editorial layout, lowercase navigation, Calistoga headings,
  Inter body text, light/dark theme, and restrained card styling.
- Let project visuals and measured outcomes carry the page. Avoid long blocks
  of biography or generic marketing copy.
- Preserve responsive, keyboard, touch, print, and reduced-motion behavior.

## Public details

- Email: yashk.code@gmail.com
- Phone: +91 91133 58078. Yash explicitly wants this visible.
- LinkedIn: https://linkedin.com/in/yash-5a56a4234
- GitHub: https://github.com/yashcodes161198
- Google DSA: https://github.com/yashcodes161198/GoogleDSA

## Technical rules

- Keep this a standard Next.js App Router project for Vercel.
- Do not add Vinext, Wrangler, Cloudflare Worker, ChatGPT Sites, D1, or Drizzle
  dependencies unless Yash explicitly changes the hosting plan.
- Run `npm run typecheck`, `npm run lint`, and `npm run build` before handing
  off a change.
- Do not deploy or publish without Yash's explicit approval.
- Never restore the older uploaded resume whose heading says "Aditi Raj".
  `public/resume/Yash-Resume.pdf` is the user-approved fallback headed "Yash".

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
