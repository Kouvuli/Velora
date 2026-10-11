---
name: web-motion-3d
description: Adds purposeful animation and 3D to web pages - Three.js scenes through React Three Fiber, UI and scroll
  motion with Motion or GSAP - with lazy loading, reduced-motion and no-WebGL fallbacks, lighter quality
  on phones, a performance budget and browser tests. Use when asked to add animation, motion, transitions,
  a 3D hero or background, Three.js, WebGL, React Three Fiber, parallax or scroll effects, or when a page's
  animation is janky, drains battery, blocks first paint or breaks on phones.
license: MIT
---

# Web motion and 3D

## Purpose
Motion and 3D that explain something, without costing speed, accessibility or trust.

## When to use
- "Add animation / a 3D hero / Three.js / React Three Fiber / scroll effects / parallax", a landing or product page that should feel alive.
- Existing motion that stutters, heats phones, delays first paint, or ignores reduced-motion settings.
- `three`, `@react-three/fiber`, `motion` / `framer-motion` or `gsap` appear in `package.json`.

## When NOT to use
- Colour, type, layout, icons and visual polish without motion: `frontend-design`.
- Usability rules for forms, navigation, responsive layout: `web-design-guidelines`.
- Full accessibility audits: `accessibility` (this skill applies its motion rules).
- Slow code that is not rendering or animation (APIs, queries, bundles in general): `performance`.
- Games and real-time 3D applications: this skill targets marketing and product pages.

## Procedure
1. **Give every motion a job.** For each proposed animation write one line: what it explains (a state change, a sequence, a relationship, feedback to the user), its trigger and its duration. Cut what only decorates. Keep at most one hero moment per page. *Done when* the list exists and each item has a job.
2. **Read the installed versions**, not memory: `package.json` and the packages' own types or docs. React Three Fiber's major must match React's (v9 for React 19); check peer ranges before installing. *Done when* versions are confirmed and installs report no peer conflicts.
3. **Set a budget before code**: 3D and animation libraries load after the page is usable and only when the element is near the viewport; the largest content on first paint is text or an image, never a canvas; device pixel ratio capped (≤ 2 desktop, ≤ 1.5 phones); object counts small (instanced points and line segments for many items); target 60 fps desktop, 30+ on phones. Write the budget down with the plan.
4. **Load lazily with a fallback.** Put the canvas in its own client component imported dynamically without server rendering (Next.js: `dynamic(() => import(...), { ssr: false })` from a client component), mounted when an `IntersectionObserver` reports it visible. Until then, and permanently when needed (step 5), render a static image or SVG of the scene's final state at the same size, so nothing shifts. *Done when* the build puts three.js in a separate chunk and the server HTML contains the fallback.
5. **Fallbacks and quality tiers.** `prefers-reduced-motion: reduce` → the still final state, no animation. No WebGL (`canvas.getContext("webgl2") ?? getContext("webgl")` is null) → the fallback. Small screens or coarse pointers → fewer objects, no pointer effects, lower DPR. Stop rendering when off-screen or the tab is hidden (R3F `frameloop="demand"` with `invalidate()`, or pause the loop). *Done when* each branch is reachable and tested (step 8).
6. **Animate with time, damping and restraint.** Drive 3D in `useFrame` with `delta` (time-based, not frame-based) and damped interpolation; one-shot sequences end within ~5 s or get a pause control; offer replay rather than loops. DOM motion animates `transform` and `opacity` only; with Motion use `useReducedMotion`, `whileInView` with `once: true`, and `LazyMotion` + `m` to keep the bundle small. Take colours from the design tokens (CSS variables) instead of new hex values; no post-processing, glow or textures unless the design asks for them.
7. **Accessible by default.** A decorative canvas gets `aria-hidden` and nearby text says what it shows; a meaningful one gets `role="img"` with a label that describes the final state. Controls (replay, pause) are real buttons. Nothing essential exists only inside the canvas. Free GPU resources you create by hand on unmount (`dispose()`).
8. **Verify in a real browser.** Build and confirm the separate 3D chunk. With Playwright: emulate `reducedMotion: "reduce"` and assert the still fallback is shown and no canvas mounts; without it, assert the canvas mounts after scrolling into view and the replay control works; check the console has no WebGL errors; screenshot desktop and phone once. Assert DOM and state, not GPU pixels (headless GPUs differ). Report what was measured and what was not.

## Output
The motion list (job, trigger, duration), the budget, the components with their fallbacks, and the verification evidence, with anything NOT RUN named.

## Failure modes
- `three` imported by a server-rendered module (`window is not defined`) or in the first-paint bundle.
- A canvas that keeps rendering off-screen or in a hidden tab, draining battery.
- Reduced-motion ignored, or a "fallback" that is an empty box.
- Everything animated the same way (fade-and-slide on every section): motion stops meaning anything.
- DPR left at the device maximum on phones; per-frame allocations in `useFrame` (new vectors, materials).
- Text placed over moving 3D without checking contrast in every frame.
- Claiming smooth performance without measuring it on a throttled or phone-sized run.
