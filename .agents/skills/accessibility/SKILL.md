---
name: accessibility
description: Audits and fixes web accessibility against WCAG 2.2 AA - semantic HTML, keyboard access and visible focus, labels and accessible names, alt text, colour contrast, ARIA used correctly, screen reader announcements, motion and zoom - with each issue tied to a WCAG criterion and verified with tools. Use when asked about accessibility, a11y, WCAG, screen readers or keyboard navigation, or when building or reviewing UI that must be usable by everyone.
license: MIT
---

# Accessibility

## Purpose
Everyone can perceive, operate and understand the interface, including keyboard and screen reader users. Target WCAG 2.2 level AA unless the project states otherwise.

## When to use
- a11y audits, WCAG compliance, keyboard or screen reader problems, building forms, dialogs, menus or custom widgets.

## When NOT to use
- General usability and responsive layout: `web-design-guidelines`. Visual polish: `frontend-design`.
- React-specific code conventions: `react` (it lists the basics; this skill is the full audit).

## Procedure
1. **Semantics first**: correct elements (`button` for actions, `a href` for navigation, headings in order, landmarks `header/nav/main/footer`, lists, tables with headers), `<html lang>`. Replace clickable `div`s instead of patching them with ARIA.
2. **Keyboard**: everything reachable and operable with Tab/Shift+Tab/Enter/Space/Escape; logical order; no traps; visible focus indicator (never `outline: none` without a replacement); focus moved into and back from dialogs.
3. **Names and labels**: every control has an accessible name (`<label for>`, `aria-label` only when no visible label is possible); images have meaningful `alt` or `alt=""` if decorative; icon buttons named.
4. **Contrast and colour**: text 4.5:1 (large text 3:1), UI components and focus indicators 3:1; information never conveyed by colour alone.
5. **Dynamic content**: errors announced (`aria-live`/`role="alert"`, `aria-invalid`, `aria-describedby` linking the message), loading states announced, no unexpected context changes.
6. **Motion and zoom**: respect `prefers-reduced-motion`; usable at 200% zoom and 320 px width; no content only on hover.
7. **Verify**: run an automated checker if available (axe, Lighthouse, Pa11y, eslint-plugin-jsx-a11y), then check manually with keyboard (and a screen reader if possible). Automated tools find only part of the issues; say what was checked manually.

## Output
Issues table: element, WCAG criterion (e.g. 1.4.3 Contrast), severity, fix; then the fixes made and how they were verified.

## Failure modes
- ARIA added on top of the wrong element instead of using the right element.
- Claiming compliance from an automated scan alone.
- Removing focus outlines for looks; colour-only error states.
- Making up WCAG criterion numbers: cite only ones you are sure of.
