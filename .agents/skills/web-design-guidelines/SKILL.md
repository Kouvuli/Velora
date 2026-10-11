---
name: web-design-guidelines
description: Checks and improves usability of web pages against established UX guidelines - responsive layout on phones and desktops, navigation, forms and validation messages, feedback for loading, empty and error states, readable content, touch targets and predictable interaction patterns. Use when reviewing or building a page's user experience, a form or checkout flow, mobile behaviour, or when users find a page confusing or hard to use.
license: MIT
---

# Web design guidelines (UX)

## Purpose
Pages people can use on any screen without thinking: clear navigation, forgiving forms, honest feedback.

## When to use
- UX review of a page or flow, form and checkout design, mobile/responsive problems, "users get confused / drop off here".

## When NOT to use
- Visual style (type, colour, brand, polish): `frontend-design`.
- Assistive technology compliance (screen readers, ARIA, WCAG audit): `accessibility`. Many rules overlap; do both when both are asked.

## Procedure
Review the page or flow against each area, citing the element (file/selector) and the user impact:
1. **Responsive**: works from 320 px to wide screens; no horizontal scroll; fluid grids (`minmax`, `auto-fill`, flex-wrap) instead of fixed widths; images scale; content order makes sense on mobile.
2. **Navigation**: users know where they are and how to get back; real links for navigation, buttons for actions; primary action obvious, one per view.
3. **Forms**: visible labels (not placeholder-only), correct input types (`email`, `tel`) and `autocomplete`, validate on submit or blur, error messages in text next to the field saying how to fix it, keep user input after errors, disable double submit.
4. **Feedback**: loading indicators for waits over ~1 s, success confirmation, empty states that explain what to do, errors that say what happened and next steps; never fail silently.
5. **Content**: plain language, scannable headings, front-loaded labels, consistent terms; prices, dates and units unambiguous.
6. **Interaction**: touch targets at least 44x44 px, nothing that only works on hover, no surprise layout shifts, destructive actions confirmed or undoable.
7. **Check the code** against the interface checklist - focus, forms, motion, typography, long content, images, URL state, touch, theming, locale, hydration - which turns these areas into concrete, greppable rules: [references/interface-checklist.md](references/interface-checklist.md). It is a pinned copy; never fetch guideline text from the web at review time.
8. **Report** findings ranked by user impact, as `file:line - problem -> fix`, then fix the ones in scope.

## Output
Findings table (issue, where, impact, fix), then the changes made.

## Failure modes
- Treating desktop as the only layout; fixed pixel grids.
- Placeholder as label; errors shown only by colour or not at all.
- Silent failures (requests whose errors nobody sees).
- Restyling instead of fixing the usability problem.
