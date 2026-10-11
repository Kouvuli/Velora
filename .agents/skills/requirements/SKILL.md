---
name: requirements
description: Turns a vague feature request, ticket, or client message into clear, testable requirements with acceptance criteria, open questions, and explicit assumptions - figuring out what is actually needed. Use when starting a feature or change, when a request is ambiguous or contradictory, or before estimating or planning work.
license: MIT
---

# Requirements

## Purpose
Make sure the team builds the right thing. Output is a short requirements brief that a planner, an implementer and a tester can all work from without re-asking the client.

## When to use
- A new feature, bug report, ticket or client message arrives.
- The request mixes goals and solutions ("add a button that...") and the goal is unclear.
- Before `planning` or freelance estimation.

## When NOT to use
- The change is a one-line fix with an obvious, verifiable outcome: go straight to `implementation`.
- Breaking work into steps: that is `planning`.

## Procedure
1. **Load context first.** Search `.ai/knowledge/` (domain, api, database, decisions) for anything the request touches. Read the relevant code only where knowledge is missing or the change is correctness-critical.
2. **Restate the goal** in one sentence from the user's point of view: who, what outcome, why.
3. **Separate** what was asked into:
   - *Problem / goal* (why)
   - *Requirements* (what must be true when done)
   - *Proposed solution* (how the requester imagines it: treat as a suggestion, not a requirement)
4. **Write acceptance criteria** as observable, testable statements (Given/When/Then or a checklist). Each criterion must be checkable by a test or a demo.
5. **List non-functional requirements** only if they apply: performance budget, security/privacy, accessibility, compatibility, data migration, observability.
6. **Mark scope**: in scope, out of scope, later.
7. **Surface unknowns.** For every gap, either ask a question or record an explicit assumption labelled `ASSUMPTION`. Never fill a gap silently.
8. **Check against reality.** Flag requirements that conflict with existing code, data, API contracts or recorded decisions, and cite the file/decision.
9. **Ask in rounds.** Ask the questions you can ask now - those that do not depend on another open answer - numbered, highest-impact first (at most ~5), each with your recommended answer so the user can just confirm. Look up facts yourself (code, config, knowledge); only decisions go to the user. After each round, ask the questions the answers unblocked. Stop when nothing is silently assumed; non-blocking ones go in the brief. Format and rules: [references/interview.md](references/interview.md).

## Output
```markdown
## Goal
## Acceptance criteria
- [ ] ...
## Non-functional
## Scope (in / out / later)
## Assumptions (ASSUMPTION: ...)
## Open questions (blocking first)
## Conflicts with current system (with evidence)
```
Save a feature as `.ai/knowledge/requirements/<ID>.md` in the item format of
[references/spec-item.md](references/spec-item.md): stable ID, stories `### US-01 — ...`, criteria
`- AC-01 (US-01): Given ... when ... then ...`, `lifecycle: draft` until the requester approves this exact revision
(then `approved_revision` + `approval_evidence`). Any later change bumps `revision` and returns it to draft. Run
`ai-skills knowledge check` (validates the item) and `ai-skills knowledge discover` (graph). Smaller asks that are
not a feature go into the ticket or `.ai/knowledge/domain/` as `INFERRED` until confirmed.

## Failure modes
- Copying the requested solution as the requirement: ask "what problem does this solve?".
- Untestable criteria ("fast", "user-friendly"): attach a number or an observable behaviour.
- Inventing business rules: if it is not in the request, the code or the knowledge base, it is a question or an ASSUMPTION.
- Over-specifying: requirements say *what*, not *how*.
