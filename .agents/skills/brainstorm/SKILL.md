---
name: brainstorm
description: Explores several different approaches to a problem before committing to one, comparing each option's trade-offs (effort, risk, cost, reversibility) against the project's constraints and recommending one with reasons. Use when a request is open-ended, when there are multiple plausible designs or products, or when someone asks for options, ideas or alternatives before deciding what to build.
license: MIT
---

# Brainstorm

## Purpose
Avoid locking in the first idea. Produce a small set of genuinely different options, judged against real constraints, so the decision is deliberate and cheap to make.

## When to use
- "What are our options for...", "how could we...", "ideas for...", "should we build or buy...".
- A request that admits several designs (sync vs async, library vs custom, new service vs extend existing).
- Before `requirements` fixes scope, when the problem itself is still open.

## When NOT to use
- The approach is already decided or obvious: go to `requirements` (scope) or `planning` (steps).
- A bug: use `debugging`. An architecture document for a chosen design: use `architecture`.

## Procedure
1. **Restate the problem** in one or two lines, and the goal it serves. If the goal is unclear, ask before generating options. Size it: a **feasibility question** ("can we...") needs a cheap probe and a recommendation; a **bounded change** to existing code needs a short design the user approves in chat; a **new system or cross-cutting change** needs a written design reviewed before planning. A request that is several independent systems gets split first; brainstorm the first piece.
2. **List the constraints you actually know** from the request, the codebase and `.ai/knowledge/` (stack, data volume, deadline, budget, team skills, compliance). Mark anything you assumed as an assumption.
3. **Generate 3-5 options that differ in kind**, not variations of one idea. Always include the simplest thing that could work, and "do nothing / defer" when that is viable.
4. **Compare them** on the same criteria: effort, risk, operating cost, reversibility, fit with the existing code and stack, and what each makes harder later. Say where a claim needs a spike or measurement to be trusted.
5. **Recommend one** and say why it wins under these constraints, what would change the choice, and the cheapest way to validate it (spike, prototype, benchmark). When options cannot be judged on paper (does this state model hold up, what should this screen look like), build a throwaway prototype that answers exactly that question: [references/prototypes.md](references/prototypes.md).
6. **Get an explicit yes** on the chosen option before any implementation; presenting a design and starting to build in the same message skips the decision.
7. **List the open questions** that block the decision. Hand off to `requirements` once an option is chosen.

## Output
```markdown
## Problem
## Constraints (known / assumed)
## Options
| Option | How it works | Effort | Risk | Reversible? | Fits stack? |
## Recommendation
<option> because ... Would change if ... Validate by ...
## Open questions
```

## Failure modes
- Three variants of the same idea presented as options.
- Inventing constraints, numbers or library capabilities instead of marking them unknown.
- Recommending the most sophisticated option by default; ignoring the existing stack.
- Writing a plan or code before an option is chosen.
