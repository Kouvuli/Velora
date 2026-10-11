# Quality floor, critique, audit and polish

Adapted from Impeccable's `craft-floor.md`, `polish.md`, `critique.md` and `audit.md` (pbakaus/impeccable,
Apache-2.0, `../licenses/impeccable.LICENSE`, `../licenses/impeccable.NOTICE`) and Anthropic's `frontend-design`
(anthropics/skills, Apache-2.0, `../licenses/anthropic.LICENSE`). Condensed and reworded; changed from the originals.

## Quality floor (checks on the built result, not intentions)
- **Contrast**: body and placeholder text >= 4.5:1, large text >= 3:1; on coloured surfaces tint secondary text from
  the surface hue, never plain grey.
- **Depth**: shadows have an offset and a soft blur; a zero-offset coloured glow is decoration.
- **Spacing**: tight groups, generous separation, more space above a heading than below; read computed values.
- **Type**: body measure 65-75 characters, sensible display maximum, no extreme negative tracking, balanced
  headings, obvious steps in size and weight; run the real copy at every breakpoint and fix overflow.
- **Motion**: one authored moment; ease-out from an already-visible default; respect reduced motion.
- **States**: hover, focus, active, disabled, loading, error, empty, success; real content and working controls.
- **Browser surfaces**: text selection, caret, scrollbars, focus rings, link underline offset and tabular numerals
  themed from the palette - the cheapest sign a page was built rather than assembled.
- **Copy**: the product's own words; controls name their action; errors name the problem and the recovery.
- **Coverage**: every requirement of the brief present and findable within seconds.
- **CSS hygiene**: watch selector specificity, especially section padding and margins cancelling each other.

## Bounded verification
Build fully; inspect once in a batched round (desktop and mobile together on the web; the shipped device classes on
native); fix everything it shows in one batch; confirm with at most one more round; stop. Open-ended self-review
costs more and finds less.

## Critique (design review)
Review the experience, not the code: is the primary task obvious; does hierarchy match importance; is the
cognitive load reasonable (choices per screen, jargon, steps); does it match neighbouring flows; would the target
user understand every label? Score or rank findings P0 (blocks the task) to P3 (polish), each with where, why it
matters and a concrete change. Name what works too, so it is preserved.

## Audit (technical quality)
Accessibility (contrast, focus order, names, semantics, target sizes), responsiveness (each supported width,
zoom, long and localised text), performance (layout shift, image sizes, interaction latency, console errors) and
theming (tokens used consistently, dark mode if supported). Report each as PASS / FAIL / NOT CHECKED with evidence.

## Polish (before shipping)
Polish is refinement, never a hidden redesign: keep the incumbent look, content and behaviour; if the concept is
wrong, say so and recommend a redesign instead.
1. **Establish the system** and classify each drift: a missing token, a one-off that should use the shared
   component, a conceptual mismatch with comparable screens, or a local defect. Fix at the narrowest correct level.
2. **Use the feature yourself** at representative sizes with realistic content, roles and input methods.
3. **Triage in this order**: broken tasks, data loss, misleading state, inaccessible paths; missing loading /
   empty / error / success / disabled / permission states; flow, hierarchy, responsive and design-system drift;
   visual and motion inconsistency; code and asset clean-up.
4. **Finish the whole path**, not one corner: arrival, transitions, empty and recovery paths connect.
5. **Verify** with mouse, keyboard and touch; remove debug output, dead styles and polish-created duplication;
   promote only genuinely reusable values to tokens.

## Harden (edge cases)
Long, missing and localised content; slow, offline and failed requests; permission-limited users; double
submission; very large lists; right-to-left text if supported. Each gets a defined state, not a broken layout.
