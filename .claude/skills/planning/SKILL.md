---
name: planning
description: Breaks agreed requirements into a small, ordered implementation plan with verifiable steps, affected files, risks, and a test strategy. Use when a change touches more than one file or component, before starting implementation, or when asked for a plan, approach, or design.
license: MIT
---

# Planning

## Purpose
Produce the smallest plan that gets from the current code to the acceptance criteria safely, where every step ends in a verifiable state.

## When to use
- Requirements exist (see `requirements`) and the change spans several files, layers or services.
- The user asks "how would you approach...", "plan", "design".

## When NOT to use
- Requirements are unclear: run `requirements` first.
- Trivial single-file change: implement directly, still verify.

## Procedure
1. **Ground the plan in evidence.** Search `.ai/knowledge/` (architecture, api, database, decisions), then open the actual entry points, modules and tests you will touch. List the files with one line each on why. Look for a small prefactoring that makes the change easy, and plan it first.
2. **Choose the approach.** If there is a real design choice, write 2-3 options with trade-offs (complexity, risk, reversibility) and pick one. Prefer the option that fits existing patterns in this codebase over a "better" new pattern. Record significant choices as a decision in `.ai/knowledge/decisions/`.
3. **Slice vertically.** Order steps so each one leaves the system working and testable (thin end-to-end slice first, then widen). No step should be "write everything, then test".
4. **For each step** write: goal, exact files, change summary, the interfaces it produces or consumes when other steps depend on them (exact names and signatures), and how to verify (test name and assertion, command and expected result). A step is right-sized when it carries its own test cycle and a reviewer could reject it alone; it is precise enough when the implementer can write exactly one reasonable thing from it. Lines that decide nothing ("handle edge cases", "add validation") are gaps; full function bodies the tests already determine are a transcript. Format and examples: [references/plan-format.md](references/plan-format.md).
5. **Test strategy**: which acceptance criteria map to which tests (unit / integration / e2e); what existing tests must keep passing.
6. **Risks and rollback**: data migrations, API compatibility, feature flags, irreversible operations. Irreversible steps get an explicit confirmation point.
7. **Out of scope**: list tempting refactors you are deliberately not doing.
8. **Too big for one session?** Split into tracer-bullet tickets, each a thin complete path through every layer with its blocking tickets named; sequence wide mechanical refactors as expand - migrate in batches - contract. See [references/tickets.md](references/tickets.md).
9. **Self-review before handing over**: every requirement maps to a step; names and signatures match across steps; the inputs most likely to break the feature that no step tests are listed and given a test; the plan is shorter than the code it describes.

## Output
```markdown
## Approach (and rejected options)
## Steps
1. <goal> - files: ... - verify: ...
## Test strategy
## Risks / rollback
## Out of scope
```

For work bigger than one session, cut tickets from an approved feature into `.ai/knowledge/work/`
([references/tickets.md](references/tickets.md)).

## Failure modes
- Plans that reference files or functions that do not exist: every file in the plan must have been seen.
- Big-bang steps that cannot be verified independently.
- Gold-plating: adding abstractions "for later" (YAGNI).
- Ignoring existing conventions (error handling, naming, layering) found in neighbouring code.
