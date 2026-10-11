# Code smell baseline for the standards axis

Adapted from the smell baseline in Matt Pocock's `code-review` skill (mattpocock/skills, MIT,
`../licenses/matt-pocock.LICENSE`), itself a selection from Martin Fowler's *Refactoring*, chapter 3. Condensed
and reworded.

Two rules bind every smell:
- **The project overrides.** A documented project standard always wins; where it endorses something listed here,
  do not flag it.
- **Always a judgement call.** Write "possible Feature Envy", never "violation". Skip anything a formatter or
  linter already enforces.

| Smell | What it looks like | Usual fix |
|---|---|---|
| Mysterious name | a name that does not say what the thing does or holds | rename; if no honest name comes, the design is murky |
| Duplicated code | the same logic shape in several hunks or files of the change | extract the shared shape and call it from both |
| Feature envy | a function that uses another object's data more than its own | move it next to the data it uses |
| Data clumps | the same few fields or parameters always travel together | bundle them into one type |
| Primitive obsession | a string or number standing in for a domain concept | give the concept a small type |
| Repeated switches | the same `switch` / `if` cascade on the same type in several places | one shared map, or polymorphism |
| Shotgun surgery | one logical change forces scattered edits across many files | gather what changes together |
| Divergent change | one module edited for several unrelated reasons | split it by reason to change |
| Speculative generality | parameters, hooks or layers for needs nobody has | delete and inline until a real need appears (`simplicity-guard`) |
| Message chains | `a.b().c().d()` navigation the caller should not depend on | one method on the first object |
| Middle man | something that only forwards calls | call the real target |
| Refused bequest | a subclass that ignores or overrides most of what it inherits | composition instead of inheritance |

Other lenses worth a pass on a large change (from Anthropic's `pr-review-toolkit`, ideas): errors that are
caught and silently ignored or replaced by defaults; comments that no longer match the code; types that allow
invalid states; tests that cannot fail.
