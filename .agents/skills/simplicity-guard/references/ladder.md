# The simplicity ladder and review tags

Adapted from Ponytail's `ponytail`, `ponytail-review`, `ponytail-audit` and `ponytail-debt` skills
(DietrichGebert/ponytail, MIT, `../licenses/ponytail.LICENSE`), balanced with Anthropic's `code-simplifier`
(Apache-2.0; ideas: clarity over brevity) and Caveman's `lean-build` (Apache-2.0; ideas: a complete narrow path,
not a local patch). Condensed and reworded.

## The ladder
Understand the problem first: read the task and the code it touches, trace the real flow end to end. Then, for
each thing you are about to add, stop at the first rung that holds:
1. **Does it need to exist at all?** A speculative need is skipped, with one line saying so.
2. **Is it already in this codebase?** A helper, type or pattern a few files away. Re-implementing it is the most
   common waste.
3. **Does the standard library do it?**
4. **Does the platform do it?** `<input type="date">` before a date-picker library, CSS before JavaScript, a
   database constraint before application code.
5. **Does an already-installed dependency do it?** Never add a dependency for what a few lines can do.
6. **Can it be small?** The least code that is still clear.
7. **Only then** write the minimum new code that works.

A bug fix follows the same rule at the root: one guard in the shared function all callers go through is a smaller
change than a guard in every caller, and patching only the path a ticket names leaves the others broken.

## Rules
- No interface with one implementation, factory with one product, or configuration for a value that never changes.
- No scaffolding "for later": later can scaffold for itself.
- Deletion over addition; boring over clever.
- Of two equally small options, take the one that is correct on edge cases: less code, not a flimsier algorithm.
- Explanation the user did not ask for is complexity in prose. Say what was skipped and when to add it:
  `skipped: X, add when Y`.

## Tags
| Tag | Meaning | Replacement |
|---|---|---|
| `delete` | dead code, unused flexibility, speculative feature | nothing |
| `reuse` | an equivalent already lives in this repo | the existing one (name the path) |
| `stdlib` | hand-rolled standard-library function | the function (name it) |
| `native` | dependency or code doing what the platform does | the platform feature |
| `yagni` | one implementation, config nobody sets, a layer with one caller | inline until a second need exists |
| `shrink` | same logic, more to read than needed | the shorter clear form |

## Where the sources pull apart
Ponytail optimises for the shortest working diff. Anthropic's simplifier warns that dense one-liners and nested
ternaries make code harder to read and debug, and Caveman's lean-build warns against forcing work into one file or
a local patch that duplicates behaviour or hides the root cause. This OS takes the ladder from Ponytail and the
limit from the others: the goal is the least to *understand*.

## Deliberate shortcuts
When you knowingly accept a ceiling, mark it where it lives with the ceiling and the upgrade path, so it is not
forgotten: `# simplify: O(n^2) scan; index by customer id past ~10k rows`. Ponytail's own marker `ponytail:` is
recognised too. `ai-skills knowledge discover` harvests both into `.ai/knowledge/issues/deliberate-shortcuts.md`.
