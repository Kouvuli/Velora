---
name: nextjs
description: Next.js application conventions - App Router vs Pages Router, Server and Client Components, data fetching and caching, route handlers and server actions, environment variables, metadata, and testing. Use when a project depends on next (package.json) or a task touches Next.js pages, routes, rendering or deployment.
license: MIT
---

# Next.js

Builds on the `react` skill (component, hooks and accessibility rules live there). Next.js changes quickly between major versions: the project's installed version is the authority, not memory.

## Orientation (do first)
- Read the `next` version in `package.json` and check whether the project uses the App Router (`app/`), the Pages Router (`pages/`), or both. Do not mix patterns from the other router.
- Check `next.config.*`, the deployment target (Vercel, Node server, static export, container) and existing data-fetching patterns before adding new ones.
- When unsure about an API's behaviour in this version, read the installed docs/types (`node_modules/next`) rather than guessing.

## App Router
- Components are Server Components by default. Add `"use client"` only to the smallest component that needs state, effects, or browser APIs; keep data fetching on the server.
- Never import server-only code (database clients, secrets) into a client component; use the `server-only` package to enforce it where the project does.
- Fetch data in Server Components or route handlers; be explicit about caching and revalidation for this version (caching defaults changed across majors).
- Server Actions and route handlers are public endpoints: validate input and check authorization in every one.
- Use `loading.tsx`, `error.tsx` and `not-found.tsx` for route states; `generateMetadata`/`metadata` for SEO.

## Pages Router
- Data fetching via `getServerSideProps` / `getStaticProps` / `getStaticPaths` per existing pages; API routes in `pages/api/` with the same validation and auth rules.

## Configuration and security
- Only variables prefixed `NEXT_PUBLIC_` reach the browser; everything else stays server-side. Never put secrets in `NEXT_PUBLIC_*`.
- Use `next/image`, `next/link` and `next/font` per project convention.

## Verification
- `next build` must pass (it type-checks and catches server/client boundary errors that `dev` may not).
- Run the project's tests (unit with Vitest/Jest + Testing Library, end-to-end with Playwright/Cypress if present).

## Failure modes
- `"use client"` at the top of a page, shipping the whole tree to the browser.
- Leaking secrets through `NEXT_PUBLIC_` or by importing a server module into a client component.
- Unvalidated, unauthorized Server Actions.
- Assuming caching behaviour from a different Next.js major version.
