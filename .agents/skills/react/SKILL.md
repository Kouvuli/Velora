---
name: react
description: Conventions for building React components and apps - component structure, state and data fetching, hooks rules, forms, accessibility, performance, and testing with React Testing Library. Use when working on React or Next.js UI code (package.json depends on react).
license: MIT
---

# React

Applies on top of the core skills. UI concerns only; backend/API rules live in their own skills.

## Orientation (do first)
- Check React version, framework (Next.js app/pages router, Vite, CRA, React Native), TypeScript, styling approach (CSS modules, Tailwind, styled-components) and state/data libraries (React Query, Redux, Zustand, SWR) in `package.json`. Use what is there.
- Look at two existing components in the same area and match structure, naming and file layout.

## Conventions
- **Components**: function components, small and single-purpose; props typed (TypeScript) and minimal. Derive values during render instead of duplicating them in state.
- **State**: keep it as local as possible; lift only when shared. Server data belongs in the project's data-fetching layer (e.g. React Query), not hand-rolled `useEffect` + `useState` caches.
- **Effects**: only for synchronizing with external systems. Complete dependency arrays; clean up subscriptions/timers. No effects for derived state or event handling.
- **Hooks rules**: called unconditionally at the top level; custom hooks start with `use`.
- **Lists**: stable, unique `key`s (never array index for reorderable lists).
- **Forms**: controlled or the project's form library; validate on submit and show accessible error messages.
- **Accessibility**: semantic elements first (`button`, `label`, `nav`), every input labelled, keyboard reachable, visible focus, images with `alt`. ARIA only when semantics are not enough.
- **Performance**: fix the big things first - request waterfalls (start independent requests together, stream slow parts behind `Suspense`) and bundle size (direct imports instead of barrel files, lazy-load heavy and feature-only code) - before re-render tuning. Measure before memoizing; `useMemo`/`useCallback`/`memo` only for proven hot paths or referential stability needs. Never define components inside components. The full list by impact: [references/performance.md](references/performance.md).
- **Component APIs**: variants as explicit components or compound components, not piles of boolean props; the provider owns shared state: [references/composition.md](references/composition.md).
- **Security**: no `dangerouslySetInnerHTML` with unsanitized data; no secrets in client bundles.

## Testing
- React Testing Library: query by role/label/text the way users do; assert visible behaviour, not internal state.
- Mock the network at the boundary (e.g. MSW) rather than mocking hooks.
- Run with the project's runner (`npm test`, `vitest`, `jest`).

## Failure modes
- Stale closures and missing effect dependencies.
- Fetch waterfalls and duplicated server state.
- Div soup with click handlers instead of buttons.
