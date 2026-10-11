---
id: VEL-WEB-landing
kind: feature
title: "Landing page"
summary: "Public company website that explains Velora with a minimal 3D hero and an interactive graph demo, and collects early-access sign-ups"
owner: landing
lifecycle: approved
revision: 6
approved_revision: 6
approval_evidence: "user chose 'only repoint references' in chat, 2026-10-11 (revision 6)"
updated: "2026-10-11"
related: []
status: CONFIRMED
---

# Landing page

## Problem
Velora needs a live company website on its own domain, with a same-domain contact email, to apply to Anthropic's
Claude Startups program and to start collecting early users. The page must explain the product in seconds and turn
visitors (small businesses, data teams, consultants) into early-access sign-ups.
Source of truth for content: `../Velora — Product Vision v2.md` (since 2026-10-11; the retired "Strategy & Plan" was the
source up to revision 5).

## Scope
In: one-page site (`/`), privacy page (`/privacy`), interactive graph demo, early-access form, Open Graph image,
site config in one file, a launch check that blocks placeholder values. Revision 2 adds: a minimal 3D hero scene,
story-moment animations in three sections, Lucide icons, and shorter copy. Revision 3 adds: the petrol palette in light
and dark themes with a toggle, an interactive hero, a scroll-driven how-it-works, a richer demo, micro-interactions and
cursor effects. Revision 4 restyles it after scale.com's motion patterns (inspiration only, no code or assets copied):
a pure black-and-white palette, dark by default, Geist type, a full-bleed hero, smooth scrolling, line-by-line heading
reveals, hover zoom and a "Connects to" marquee.

## Assumptions
- ASSUMPTION: English only.
- ASSUMPTION: no legal entity yet; the privacy page names the operator from site config ("Velora, company registration in progress") until one exists.
- ASSUMPTION: hosting on Vercel; form processor is Formspree (free tier).
- ASSUMPTION: demo data (4,812 orders, 312 unmatched, 94% confidence) is illustrative and labelled as a demo.

## User Stories
### US-01 — Understand Velora in seconds
### US-02 — Join early access
### US-03 — Try the graph demo
### US-04 — Learn how it works, what it costs and whether to trust it
### US-05 — Read the privacy policy
### US-06 — Founders change brand details in one place and never launch with placeholders
### US-07 — Shared links look right
### US-08 — See the product story in the hero: messy records pulling together into a clean graph
### US-09 — Sections that show a sequence or a change animate once, so the story is easier to follow
### US-10 — Scan the page quickly through icons and shorter text
### US-11 — Read the page in a light or dark theme with a distinctive Velora palette
### US-12 — Play with the hero graph: rotate it, inspect records, approve the last suggested link
### US-13 — Follow Connect → See → Send step by step while scrolling
### US-14 — Fix a realistic mess in the demo: a missing link, a duplicate and a date format, then run a dry run
### US-15 — Feel that controls respond: press, hover, open and success feedback
### US-16 — See the hero graph react to the cursor
### US-17 — Feel a calm, premium page: full-bleed hero, smooth scrolling, headings that reveal, cards that respond
### US-18 — See at a glance which systems Velora connects

## Decisions and Contracts
Decided with the user in chat, 2026-10-10:
- Readiness Report: sign-up option only, **no file uploads** on the site.
- Form: POST to `NEXT_PUBLIC_WAITLIST_ENDPOINT` (Formspree); `mailto:` fallback when unset.
- About: founder **roles, no names** yet.
- Look: **light & calm**; trust colours on the graph (grey observed, amber suggested, green approved).
- Domain and email: **placeholders** (`velora.example`, `hello@velora.example`) until real ones exist.
- Pricing: **"from" prices**, labelled early-access.
- Demo on phones: **tap to accept**; dragging optional.
- **No analytics**, no cookies. Tests: Vitest + Testing Library, plus one Playwright journey.

Added for revision 2, decided with the user in chat, 2026-10-10:
- 3D hero: **chaos → clean graph**, **beside the headline, restrained**: about 40 small grey points and thin lines on the page
  background, trust colours (amber → green) as the only accents; no glow, bloom, gradients or textures. The 2D demo moves
  to its own section directly below the hero.
- Playback: **once (~4 s) when visible, then a gentle idle, plus a Replay button**; slight pointer response on desktop.
- Fallbacks: **lighter 3D on phones**; a **still image of the final graph** for reduced motion and browsers without WebGL.
- Elsewhere: **story moments only** (how-it-works steps in sequence, trust states amber → green, dashboard numbers count up).
- Libraries: **React Three Fiber + drei** for 3D, **Motion** for 2D; icons: **Lucide**, **generic icons** for systems
  (no brand logos).
- Copy: **icons plus about one third less text**.
- Workflow: built with the `web-motion-3d` skill created in ai-skills-os for this.

Added for revision 3, decided with the user in chat, 2026-10-10:
- Palette **A: Petrol** (chosen from three mocked directions in `../design-mocks/`), light and dark, all pairs WCAG AA:
  light paper #f2f5f5, surface #ffffff, ink #0f1f22, muted #4c5f63, line #d3dde0, accent #0d5f73, accent-strong #094a5a,
  on-accent #ffffff; dark paper #0b1517, surface #112024, ink #e4eef0, muted #9fb4b8, line #23383d, accent #5cc3d6,
  accent-strong #8ad6e4, on-accent #062027. Trust colours: light observed #6e7a76, suggested #b26b00 / ink #7f4d00 / soft
  #fff3dc, approved #1c7347 / soft #e3f2e9, danger #b42318; dark observed #83918c, suggested #f0a73a / ink #f6c06a / soft
  #33270f, approved #4cc38a / soft #10301f, danger #f97066.
- Dark mode: **follows the system, plus a header toggle** remembered on the device, with no flash of the wrong theme.
- Interaction: **all of hero play, scroll-driven story, richer demo, micro-interactions and cursor effects**, in a
  **quiet style**: short eased motion, no bounce or parallax layers, reduced motion respected, simpler on phones.
- Design review uses the Impeccable-derived critique, audit and polish modes merged into `frontend-design`; the external
  Impeccable package is not run (the Skill OS scanner rejected it on 2026-10-07).

Added for revision 4, decided with the user in chat, 2026-10-11 (reference: scale.com, studied for patterns only — Lenis
smooth scroll, full-bleed dark hero, line-masked heading reveals, hover zoom inside frames, quiet button hovers, an
infinite marquee; no code, copy or assets are taken from it):
- Palette **1: Pure mono** (chosen from three mocks in `../design-mocks/v2-palette-*.png`), replacing petrol:
  dark paper #000000, surface #111111, ink #ffffff, muted #a3a3a3, line #262626, accent #ffffff, accent-strong #e0e0e0,
  on-accent #000000; light paper #ffffff, surface #f5f5f5, ink #0a0a0a, muted #5c5c5c, line #e5e5e5, accent #0a0a0a,
  accent-strong #2a2a2a, on-accent #ffffff. Trust colours stay (dark observed becomes #8a8f8d, suggested-soft #2e2410,
  approved-soft #0f2a1c; the rest unchanged).
- **Dark for every first-time visitor**, regardless of the system setting; the toggle switches to light and is remembered.
- Typeface **Geist** with **Geist Mono** for labels and data (replacing IBM Plex).
- Hero: **full-bleed**, the 3D graph behind a centred headline with a legibility scrim, CTAs and "Scroll to explore".
- Effects: **smooth inertial scroll**, **line-by-line heading reveals**, **hover zoom on cards and visuals**, and an
  **infinite "Connects to" marquee of sources and destinations** with generic icons (no customer logos: there are none).

Form contract: `POST <endpoint>`, headers `Content-Type: application/json`, `Accept: application/json`, body
`{ "email": string, "segment": "business" | "data-team" | "consultant", "readinessReport": boolean, "source": "landing" }`.

## High-Level Design
Next.js 16 (App Router, TypeScript), Tailwind CSS 4, React Flow 12 (`@xyflow/react`) for the demo only. The page is
server-rendered; only the form, the demo, the 3D hero and the story-moment animations are client components. All brand
values come from `src/config/site.ts`. Three.js (via React Three Fiber) is loaded in its own chunk only after the page is
usable and the hero scene is visible; the server HTML always contains the still fallback.

## Low-Level Design
Decided in planning.

## Acceptance Criteria
- AC-01 (US-01): Given a visitor opens `/` at 1440×900 or 375×812, when the page loads, then the H1 "Connect messy data. See how it fits. Send it clean anywhere.", the subhead and a "Get early access" button are visible without scrolling.
- AC-02 (US-02): Given the endpoint is set, when a visitor submits a valid email, a segment and the Readiness Report choice, then exactly one request matching the form contract is sent, the button shows "Joining…" and is disabled while pending, and on a 2xx response "You're on the list" is shown.
- AC-03 (US-02): Given an invalid or empty email, when the visitor submits, then no request is sent and an inline error linked to the field (`aria-describedby`) is shown.
- AC-04 (US-02): Given the endpoint returns a non-2xx status or the network fails, when the visitor submits, then an error message with a mailto link to the site email is shown and the entered values are kept.
- AC-05 (US-02): Given the endpoint is not set, when the visitor submits a valid form, then no network request is sent and the browser is pointed to a `mailto:` link to the site email whose body contains the email, segment and Readiness Report choice.
- AC-06 (US-03): Given the demo loads, then it shows an Orders source and a Customers source, the warning "312 orders have no matching customer", and an amber suggested link "cust_no → customer_id (94%)".
- AC-07 (US-03): Given the initial demo, when the visitor presses "Accept suggestion", then the link turns green (approved), the warning is replaced by "All 4,812 orders matched to a customer", and the Send destinations (Odoo, Files, Cloud storage, Warehouse) become enabled.
- AC-08 (US-03): Given the initial demo on a pointer device, when the visitor drags from Orders `cust_no` to Customers `customer_id`, then the same resolved state as AC-07 appears; when they connect any other pair, then a hint to try `cust_no → customer_id` is shown and the state stays unresolved.
- AC-09 (US-03): Given the demo is resolved, when the visitor presses "Reset demo", then the initial state returns.
- AC-10 (US-03): Given a keyboard-only visitor, when they Tab to the demo, then "Accept suggestion" and "Reset demo" are reachable and operable, and each state change is announced through a polite live region.
- AC-11 (US-04): Given `/`, then these sections exist in order with these ids: `connects`, `demo`, `problem`, `how-it-works`, `views`, `destinations`, `trust`, `who`, `compare`, `pricing`, `security`, `about`, `faq`, `early-access`; the header links to How it works, Pricing, Security, FAQ and the early-access form.
- AC-12 (US-04): Given the pricing section, then it shows Free Readiness Report, Project pass from $299 and Subscription from $99/month, labelled as early-access pricing.
- AC-13 (US-04): Given the security section, then it states encryption in transit and at rest, deletion on request, metadata-only AI mode and "local engine on request", and the site never claims that data never leaves the visitor's environment.
- AC-14 (US-04): Given the FAQ, then it includes "Why not just use ChatGPT?" and "Does my data leave my environment?" as expandable items that work without JavaScript.
- AC-15 (US-05): Given `/privacy`, then it lists what the form collects, the processor (Formspree), retention, how to request deletion (site email), and states there is no analytics or tracking cookies; it is linked from the footer and from the form.
- AC-16 (US-06): Given the source, then the brand name, domain, contact email and company details are defined only in `src/config/site.ts`, and no component hard-codes them.
- AC-17 (US-06): Given `site.ts` still contains a `.example` domain or email, when `npm run check:launch` runs, then it exits non-zero and names each placeholder; with real values it exits zero.
- AC-18 (US-07): Given any page, then its title and description come from site config, and `/opengraph-image` returns a 1200×630 PNG showing the headline.
- AC-19 (US-08): Given any visitor, when the server HTML for `/` arrives, then the hero (beside the headline on desktop, below it on phones) contains a still image of the clean graph with a text alternative, and no three.js code is in the server HTML or the initial page scripts.
- AC-20 (US-08): Given a desktop visitor without reduced motion and with WebGL, when the hero scene is visible, then a 3D canvas replaces the still image and points move from scattered positions into the linked graph within about 4 seconds, then idle gently; the hero stays the same size (no layout shift).
- AC-21 (US-08): Given the 3D scene has played, when the visitor presses "Replay" (a real button, reachable by keyboard), then the assembly plays again.
- AC-22 (US-08): Given `prefers-reduced-motion: reduce` or a browser without WebGL, then the still image stays, no canvas mounts and no Replay button is shown.
- AC-23 (US-08): Given a phone-sized viewport (under 768 px) or a coarse pointer, then the scene uses the light tier: at most 24 points, device pixel ratio at most 1.5, and no pointer response.
- AC-24 (US-08): Given the 3D scene is running, when it scrolls out of view, then it stops rendering, and it resumes when visible again.
- AC-25 (US-09): Given motion is allowed, when `how-it-works`, `trust` and the dashboard preview in `views` first scroll into view, then the steps appear in sequence, the trust states light up in order, and the dashboard numbers count up to their final values, each once; with reduced motion, all of them show their final state immediately.
- AC-26 (US-10): Given `/`, then each problem item, how-it-works step, destination, trust state, audience, pricing plan and security point shows a Lucide icon that is hidden from screen readers (`aria-hidden`); systems use generic icons, never brand logos.
- AC-27 (US-10): Given `/`, then the visible words in `problem`, `how-it-works`, `views`, `destinations`, `trust`, `who`, `pricing`, `security`, `about` and `early-access` total at most 680 (revision 1 baseline: 975, measured 2026-10-10).
- AC-28 (US-11): Given a first-time visitor (no stored choice), whatever their system setting, when `/` or `/privacy` first paints, then the dark theme is applied before any content is shown (no flash), also without JavaScript, and form controls and scrollbars follow it (`color-scheme`). (Revision 4: was "follows the system".)
- AC-29 (US-11): Given the header theme toggle (a real button whose label names the theme it switches to), when the visitor presses it, then the theme switches, the choice is remembered on that device across reloads, and the 3D hero and demo pick up the new colours.
- AC-30 (US-11): Given the colour tokens (pure mono since revision 4), then every text/background pair used on the page meets WCAG AA (4.5:1 text, 3:1 large text and UI) in both themes, and text selection, focus rings, scrollbars and link underlines are themed from the tokens.
- AC-31 (US-12): Given the 3D hero on a pointer or touch device, when the visitor drags across it, then the graph rotates with the drag (limited range) and eases back when released; page scrolling on phones still works with vertical swipes.
- AC-32 (US-12): Given the settled 3D hero, when the visitor hovers or taps a hub, then a label shows its name and record count (e.g. "Customers, 1,204 records"); when they hover or tap a record point, then a sample shows (e.g. "ACME, Inc. → matched to Acme Inc.").
- AC-33 (US-12): Given the settled 3D hero, then one hub link stays amber as "Suggested"; when the visitor clicks it, or presses the "Approve suggested link" button below the scene, then it turns green and the caption confirms it; Replay resets it.
- AC-34 (US-13): Given a desktop visitor (1024 px or wider) with motion allowed, when they scroll through `how-it-works`, then the section stays pinned while Connect, See and Send become active in order, each with its own small illustration, and releases after Send; on smaller screens or with reduced motion, all three steps show at once without pinning.
- AC-35 (US-14): Given the demo, then it lists three issues (312 orders without a customer, a duplicate customer "Acme Inc." / "ACME, Inc.", dates in mixed formats) with a progress count; each is fixed by its own action (accept or draw the link, Merge, Convert dates), and the count updates.
- AC-36 (US-14): Given all three issues are fixed, when the visitor presses "Run dry run", then a short report animates in (records checked, issues fixed, 0 violations) and only then do the Send destinations become enabled; "Reset demo" restores every issue. (Supersedes the destination part of AC-07.)
- AC-37 (US-15): Given motion is allowed, then buttons give press feedback, links and cards give hover feedback, FAQ answers open and close with a short height transition, and a successful sign-up shows an animated check; with reduced motion all of these change instantly.
- AC-38 (US-16): Given a desktop visitor with a fine pointer and motion allowed, when the cursor moves over the settled hero graph, then nearby points ease slightly away from it and return when it leaves; there is no effect on touch devices or with reduced motion.
- AC-39 (US-17): Given `/` at 640 px or wider, then the hero spans the full width and at least the viewport height below the header, with the 3D graph (or its still image) behind a centred H1, the subhead, both CTAs and a "Scroll to explore" link to `#demo`; text stays legible over the scene (a scrim behind the text block), and drag, hover and approve still work on desktop outside the text and buttons. Under 640 px, the text, subhead and CTAs come first and the graph sits full-width in its own block below them with its controls, then "Scroll to explore"; nothing overlaps. (Revision 5.)
- AC-40 (US-17): Given a desktop visitor with a fine pointer and motion allowed, then scrolling (wheel and anchor links) is smooth and inertial, anchor links land below the sticky header, and keyboard scrolling still works; on touch devices or with reduced motion, native scrolling is used.
- AC-41 (US-17): Given motion is allowed, when a section heading first scrolls into view, then its lines slide up out of a mask one after another, once; headings already on screen, and all headings with reduced motion, show immediately; the heading text stays whole for screen readers and search.
- AC-42 (US-17): Given motion is allowed, when the visitor hovers a view preview, pricing plan or destination, then its inner visual or surface responds (preview zooms slightly inside its frame, surfaces lighten) within about 300 ms, easing out; with reduced motion there is no zoom.
- AC-43 (US-18): Given `/`, then a "Connects to" strip after the hero scrolls an endless row of sources (Excel, CSV, Google Sheets, Postgres, MySQL, SQL Server, REST APIs) and destinations (Odoo, CSV/XLSX/Parquet, cloud storage, cloud warehouse) with generic icons; it pauses on hover or keyboard focus, duplicate items are hidden from screen readers, and with reduced motion it shows as a still, wrapped list.
- AC-44 (US-17): Given any page, then text uses Geist and data labels use Geist Mono, self-hosted (no requests to font services from the visitor's browser).

## Non-functional
- No horizontal scroll at 320 px width; body text contrast ≥ 4.5:1; visible focus on every interactive element.
- React Flow is loaded only by the demo (client component); the rest of the page is server-rendered.
- Revision 3 keeps the same budget: interaction code for the hero lives in the lazy 3D chunk; the theme script is inline and
  tiny; no new dependency unless a step needs it.
- 3D budget (from the `web-motion-3d` skill): the H1 remains the largest content on first paint; three.js loads in a
  separate chunk after the page is usable; desktop DPR at most 2, phones at most 1.5; animation is time-based; no
  per-frame allocations; hand-made GPU resources are disposed on unmount.
- `next build` passes; no secrets in `NEXT_PUBLIC_*` (the form endpoint is public by design).

## Verification
`npm run lint`, `npm run typecheck`, `npm test` (Vitest), `npm run test:e2e` (Playwright journey: load → demo accept → submit form with a mocked endpoint; 3D: reduced-motion fallback, canvas mount, Replay, light tier, pause off-screen; story moments; icons; word budget), `npm run build` (3D in a separate chunk), `npm run check:launch` (expected to fail until real values are set).

## Dependencies
Formspree form (founders create it); domain + mailbox; Vercel project.

## Out of Scope
File uploads, accounts, analytics, dark mode, translations, blog/SEO guides, founder names and photos, real legal entity details.

## Open Questions
None blocking.

## Revision History
- Revision 1: Initial draft from strategy §19 and the user's answers on 2026-10-10; approved by the user in chat, 2026-10-10.
- Revision 2: Adds US-08..US-10 and AC-19..AC-27 (3D hero, story motion, icons, shorter copy) and moves the demo into its own `demo` section (AC-11), from the user's answers on 2026-10-10; approved by the user in chat, 2026-10-10.
- Revision 3: Adds US-11..US-16 and AC-28..AC-38 (petrol palette with dark mode, interactive hero, scroll-driven story, richer demo, micro-interactions, cursor effects); AC-36 supersedes the destination part of AC-07. From the user's answers on 2026-10-10; approved by the user in chat, 2026-10-10.
- Revision 4: Pure mono palette, dark by default (AC-28 changed), Geist type, full-bleed hero, smooth scroll, heading reveals, hover zoom and a "Connects to" marquee (US-17, US-18, AC-39..AC-44; AC-11 gains `connects`), from the user's answers on 2026-10-11 after studying scale.com; approved by the user in chat, 2026-10-11.
- Revision 5: AC-39 on phones (under 640 px): text first, graph in its own block below, after the phone screenshot showed text overlapping the graph and controls; chosen by the user in chat, 2026-10-11.
- Revision 6: Reference-only change: the source of truth moves from the retired "Velora — Strategy & Plan.md" to "Velora — Product Vision v2.md"; no criteria changed. Approved by the user's "only repoint references" choice in chat, 2026-10-11.
