---
name: frontend-design
description: Improves the visual design of a web interface - visual hierarchy, typography, colour, spacing and layout, consistent design tokens and brand application, and the polish states that make a UI feel finished - while avoiding the generic look of template or AI-generated pages. Use when asked to make a page or component look better, more professional or more distinctive, to apply a brand or design system, to design a new screen, or to critique, audit or polish a UI before shipping.
license: MIT AND Apache-2.0
---

# Frontend design

## Purpose
Interfaces that look deliberate: a point of view that fits this product and its users, a clear hierarchy, a consistent system of type, colour and spacing, and the brand applied everywhere - not the default look every generated page shares.

## When to use
- "Make this look better / more professional / modern / less generic", "apply our brand", "design the pricing page", visual polish, design tokens, "critique / audit / polish this UI".

## When NOT to use
- Usability rules, content, forms, responsive behaviour and UX patterns: `web-design-guidelines`.
- Keyboard, screen reader and contrast compliance: `accessibility` (design must still meet its contrast rules).
- Component code conventions: `react` or the framework pack.

## Procedure
1. **Know the product and the visitor.** Who uses this, where, and for which job; what the subject's own world looks like (its materials, vocabulary, industry). Read the project's design context if it exists (`PRODUCT.md` for product truth, `DESIGN.md` for the visual system, `.ai/knowledge/`); otherwise propose the subject, audience and primary job and confirm them. Name the surface's mode: **persuade** (landing, pricing: earn attention and action), **operate** (app, dashboard, settings: scanability and consistency outrank expression), **read** (docs, articles: comprehension first), **experience** (portfolio, gallery: the work leads).
2. **Find the existing system**: brand guide, design tokens, CSS variables, Tailwind config, component library. Use them; never invent a second palette or type scale. **Refinement preserves** the incumbent look, copy and behaviour; **redesign replaces** the look but keeps content, function and constraints - never polish a look you were asked to replace. The brief's explicit choices always win over your taste.
3. **Plan before code** when creating or redesigning: a compact token system (4-6 named colours, typefaces and their roles, a type and spacing scale, a layout concept with a text wireframe, two or three principles specific to this product). Then check the plan against the brief: any part you would have produced for any similar page is a default, not a choice - revise it and say why. The common defaults ("tells") to avoid when the brief leaves an axis free: [references/anti-patterns.md](references/anti-patterns.md).
4. **Hierarchy**: one clear focal point per screen; size, weight and colour signal importance in that order; group related items tightly and separate groups generously with space, not borders everywhere. Spend boldness in one place and keep the rest quiet.
5. **Typography**: one or two families, chosen for this product (if two, clearly distinct); a modular scale (e.g. 12/14/16/20/24/32); body 16 px with 1.4-1.6 line height; 45-75 characters per line.
6. **Colour**: brand primary for primary actions only; neutrals for text and surfaces; semantic colours for success/warning/error; contrast 4.5:1 for text, 3:1 for large text and UI. Light or dark from where and how the product is used, not by category.
7. **Spacing and layout**: every margin, padding and gap from the spacing scale; align to a grid; consistent component sizes and radii; more space above a heading than below it.
8. **States, motion and words**: hover, visible focus, active, disabled, loading, empty, error and success states; one purposeful motion moment rather than an entrance on every section; the browser's own surfaces themed too (selection, focus rings, scrollbars, tabular numerals). Buttons name their action and keep that name through the flow ("Publish" -> "Published"); errors say what happened and how to recover.
9. **Verify in bounded passes**: build, inspect once at desktop and mobile together, fix everything found in one batch, confirm with at most one more round, stop. The quality floor checklist and the critique / audit / polish modes: [references/modes.md](references/modes.md). If the project runs a design detector (e.g. `impeccable detect`), act on its findings; a clean scan does not replace looking.
10. **Replace magic values with tokens** and report what changed and why, before/after.

## Output
The changed styles/components using tokens, the design plan (for new work), a list of design decisions, and any brand values that were missing and assumed.

## Failure modes
- Ignoring the existing brand or tokens and introducing new colours, fonts or one-off spacing values.
- Generic output: the defaults in the anti-patterns list chosen by habit when the brief left the choice open.
- Decoration over hierarchy (gradients, shadows, borders, cards inside cards).
- Pretty but inaccessible: low-contrast text, focus outlines removed.
- Redesigning layout or content the user did not ask to change; open-ended self-review loops instead of bounded passes.
