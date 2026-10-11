# Web interface checklist (pinned)

Adapted from Vercel Labs' Web Interface Guidelines (`command.md` in vercel-labs/web-interface-guidelines at commit
434b7f91364665f2f733b310ec54809bf8f37937, MIT, `../licenses/vercel.LICENSE`). Regrouped, condensed and reworded.

This is a **pinned snapshot**. Vercel's own skill fetches the latest rules from GitHub on every run; this OS never
loads instructions from the network at runtime. `ai-skills upstream check --sources` reports when the upstream
rules change, and a human decides what to absorb.

## Accessibility and focus
- Icon-only buttons and unlabeled form controls get an accessible name (`<label>`, `aria-label`).
- `<button>` for actions, `<a>` / router `<Link>` for navigation; no clickable `<div>` / `<span>`.
- Images have `alt` (empty for decorative); decorative icons `aria-hidden="true"`.
- Async updates (toasts, validation) announced with `aria-live="polite"`.
- Semantic HTML before ARIA; headings in order; a skip link to main content; `scroll-margin-top` on anchored headings.
- Visible focus on every interactive element (`:focus-visible`), never `outline: none` without a replacement;
  `:focus-within` for compound controls; sticky headers and overlays never cover the focused element.
- Captions or transcripts for meaningful media; media controls usable by keyboard.

## Forms
- Meaningful `name`, correct `type` and `inputmode`, `autocomplete` on fields the browser can fill (and
  `autocomplete="off"` on non-auth fields that would trigger password managers).
- Never block paste. Labels are clickable; checkbox / radio and label share one hit target.
- Spellcheck off for emails, codes and usernames.
- Submit stays enabled until the request starts, then shows progress; errors inline next to the field, focus moves
  to the first error on submit.
- Placeholders show an example pattern; warn before leaving with unsaved changes.

## Motion
- Respect `prefers-reduced-motion`; animate `transform` and `opacity` only; never `transition: all`.
- Correct `transform-origin` (SVG: transform a `<g>` wrapper with `transform-box: fill-box`).
- Animations are interruptible; autoplaying motion over ~5 s next to content gets pause / stop controls.

## Typography and content
- Real ellipsis `…` (also in "Loading…"), curly quotes, non-breaking spaces in `10 MB`-style units and shortcuts.
- `font-variant-numeric: tabular-nums` for numbers that are compared; balanced or pretty wrapping on headings.
- Text containers survive long content (truncate, clamp or break words; `min-width: 0` on flex children); empty
  strings and arrays render an empty state, not broken UI; plan for short, average and very long user content.

## Images and performance
- Explicit `width` / `height` on images; lazy-load below the fold; prioritise the critical above-the-fold image.
- Virtualise lists over ~50 items; no layout reads (`getBoundingClientRect`, `offsetHeight`) during render; batch DOM
  reads and writes.
- Cheap controlled inputs (or uncontrolled ones); `preconnect` to asset domains; preload critical fonts with
  `font-display: swap`; muted looping video instead of animated GIFs, with a still fallback.

## Navigation and state
- The URL reflects state: filters, tabs, pagination and expanded panels are deep-linkable.
- Real links so Cmd/Ctrl-click and middle-click work.
- Destructive actions get a confirmation or an undo window, never immediate.

## Touch, layout and theming
- `touch-action: manipulation`; deliberate tap highlight; `overscroll-behavior: contain` in modals and drawers.
- During drags, disable text selection; every drag / swipe / pinch has a tap or keyboard alternative.
- `autoFocus` only for a single primary input on desktop.
- Safe-area insets for full-bleed layouts; no accidental horizontal scrollbars; flex / grid instead of JavaScript
  measurement.
- Dark themes set `color-scheme: dark`; `theme-color` matches the background; native `<select>` gets explicit
  colours.

## Locale
- Dates, times, numbers and currency through `Intl.*`, never hard-coded formats.
- Language from `Accept-Language` / `navigator.languages`, not IP; `translate="no"` on brand names and code tokens.

## Hydration (SSR frameworks)
- An input with `value` has `onChange` (or use `defaultValue`); guard date / time rendering against server-client
  mismatch; `suppressHydrationWarning` only where truly needed.

## States and copy
- Hover feedback on buttons and links; interactive states raise contrast.
- Active voice, second person, specific button labels ("Save API key", not "Continue"), numerals for counts, errors
  that include the fix.
- Vercel's house style also asks for Title Case headings and buttons and `&` where space is short. These are style
  choices: the project's own style guide wins, and `frontend-design` recommends sentence case when none exists.

## Flag on sight
Zoom disabled (`user-scalable=no`, `maximum-scale=1`); paste blocked; `transition: all`; focus outline removed
without replacement; navigation by `onClick` without a link; clickable `<div>`; images without dimensions; long
unvirtualised lists; unlabeled inputs and icon buttons; hard-coded date / number formats; unjustified `autoFocus`;
animated GIFs; gesture-only actions.

## Reporting
Group by file, one line per finding with `file:line` and the fix when it is not obvious; files with no findings get
`✓ pass`.
