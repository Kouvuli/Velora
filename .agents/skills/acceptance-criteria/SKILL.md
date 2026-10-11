---
name: acceptance-criteria
description: Writes acceptance criteria for a user story or ticket as concrete Given/When/Then examples - happy path, edge cases, errors and non-functional limits - each one testable and agreed, so developers, testers and the client share one definition of done. Use when asked for acceptance criteria, Given/When/Then scenarios, a definition of done or sign-off conditions for a story.
license: MIT
---

# Acceptance criteria

## Purpose
Turn "it should work" into examples nobody can misread, that become tests and the client's sign-off checklist.

## When to use
- "Write acceptance criteria / Given-When-Then / definition of done for this story"; preparing a story for estimation, development or client sign-off.

## When NOT to use
- The request itself is still vague or contradictory: `requirements` first (scope, open questions). This skill makes an agreed requirement precise.
- Writing the automated tests: `tdd` / `testing` turn these criteria into tests.

## Procedure
1. **Anchor on the story**: who wants what and why (`As a <role> I want <capability> so that <value>`). Quote the source (ticket, brief, `.ai/knowledge/`).
2. **Write examples, not prose**: one criterion per behaviour, as `Given <state> When <action> Then <observable result>`. Use real values (amounts, dates, roles), not "valid input".
3. **Cover the edges deliberately**: happy path, boundaries (zero, max, exactly-at-limit), invalid input and its message, permissions (other users' data), empty states, concurrency or duplicates where relevant.
4. **Add the non-functional limits that matter** with numbers only when known (response time, file size, accessibility level); unknown numbers are open questions.
5. **Check each criterion**: testable (a test could pass or fail on it), unambiguous, independent of implementation details, and traceable to the requirement. Remove anything nobody asked for.
6. **List open questions and assumptions** separately; never fill a business rule gap with a guess.

## Output
```markdown
## Story
## Acceptance criteria
- AC-01 (US-01): Given ..., when ..., then ...
## Out of scope
## Open questions / assumptions
```

In a feature item (`.ai/knowledge/requirements/<ID>.md`, see the `requirements` skill's
`references/spec-item.md`) criteria keep stable IDs; never renumber an approved one. Tests that prove a criterion name
it (`<feature ID>/AC-01`) so the knowledge graph links criterion to test.

## Failure modes
- Vague criteria ("works correctly", "user-friendly", "fast").
- Only the happy path; missing permission and error cases.
- Criteria that prescribe implementation (tables, classes) instead of behaviour.
- Invented business rules or numbers presented as agreed.
