# React and Next.js performance, by impact

Written for this Skill OS from the rule catalogue in Vercel's `react-best-practices` skill (vercel-labs/agent-skills;
ideas only, in our own words - that repository ships no license file). Work top-down: the first two groups usually
dominate; the last ones rarely matter until measured.

## 1. Request waterfalls (critical)
- Start independent requests together (`Promise.all`) instead of awaiting them one after another; when only some
  depend on others, start each as soon as its own inputs are ready.
- Check cheap synchronous conditions before awaiting anything remote; move an `await` into the branch that uses it.
- In API routes and server components, start promises early and await late.
- Stream slow parts behind `Suspense` boundaries instead of blocking the whole page.

## 2. Bundle size (critical)
- Import from the module that defines a thing, not from a barrel `index` that pulls in everything.
- Keep import paths and file-system paths statically analysable so bundlers can trim them.
- Load heavy components lazily (`next/dynamic`, `React.lazy`) and feature code only when the feature is used.
- Load analytics and logging after hydration; preload on hover or focus for perceived speed.

## 3. Server rendering (high)
- Authenticate and authorise server actions exactly like API routes.
- Deduplicate per-request work (`React.cache`); use a bounded cache for cross-request reuse.
- Pass client components only the data they render; avoid serialising the same data twice.
- No mutable module-level state that could leak between requests.
- Restructure so sibling fetches run in parallel; do non-blocking follow-up work after the response (`after()`).

## 4. Client data (medium-high)
- Use the project's data library for deduplication and caching instead of hand-rolled effect caches.
- One global listener per event type; passive listeners for scroll and touch.
- Version and keep small anything stored in `localStorage`.

## 5. Re-renders (medium)
- Derive values during render instead of syncing them into state with effects; subscribe to derived booleans, not
  whole objects.
- Do not read state only to use it inside a callback; use functional `setState` for stable callbacks.
- Expensive initial state: pass a function to `useState`.
- Primitive effect dependencies; split hooks whose dependencies are independent.
- Interaction logic belongs in event handlers, not effects.
- `startTransition` / `useDeferredValue` keep input responsive during expensive updates.
- Refs for values that change often but do not affect output.
- Never define a component inside another component.
- Memoise only measured hot paths; memoising a cheap primitive costs more than it saves.

## 6. Rendering (medium)
- `content-visibility` or virtualisation for long lists; hoist static JSX out of components.
- Animate a wrapper element rather than an SVG; reduce SVG coordinate precision.
- Avoid hydration flicker for client-only values (an inline script, or a deliberate suppression for an expected
  mismatch); prefer `useTransition` for loading states; `defer` or `async` on scripts; resource hints for preloading.
- Use a ternary rather than `&&` when the left side can be `0` or another renderable falsy value.

## 7. JavaScript hot paths (low-medium, measure first)
- `Map` / `Set` for repeated lookups; build an index once instead of searching in a loop.
- Combine passes over the same array; return early; hoist regular expressions and property reads out of loops.
- A single loop for min / max instead of sorting; `toSorted()` when immutability matters.
- Batch DOM style changes; defer non-critical work to idle time; cache storage reads.

## 8. Rare patterns (low)
- Keep event handlers in refs when a stable identity is needed; initialise app-wide singletons once; keep
  `useEffectEvent` results out of effect dependencies.
