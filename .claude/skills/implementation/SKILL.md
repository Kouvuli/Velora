---
name: implementation
description: Implements a planned change in small, verified increments that follow the codebase's existing conventions, with the minimum code needed and no speculative abstractions. Use when writing or modifying production code for a feature, fix, or refactor.
license: MIT
---

# Implementation

## Purpose
Write correct, minimal, conventional code, one verifiable step at a time.

## When to use
- Executing a plan step (see `planning`) or a small, well-understood change.

## When NOT to use
- The cause of a failure is unknown: use `debugging` first.
- Scope or acceptance criteria are unclear: use `requirements`.

## Procedure
1. **Read before writing.** Open the code you will change and one or two neighbours that do something similar. Match their patterns: structure, naming, error handling, logging, dependency injection, test style.
2. **Check knowledge** in `.ai/knowledge/` for API contracts, schema and decisions that constrain the change. If knowledge and code disagree, the code wins; record the conflict.
3. **Smallest change that satisfies the step.** No new dependency, abstraction, config option or layer unless the step requires it. Prefer the standard library and existing utilities.
4. **Tests with the change.** Add or update the test that proves the step (write it first when the behaviour is clear: see `testing`).
5. **Run the fast feedback loop** after each step: compile/type-check, lint, the relevant tests. Do not stack unverified steps.
6. **Handle the edges the requirements name**: invalid input, empty/large data, concurrency, permissions, failure of dependencies. Do not invent edge-case behaviour; ask or note an ASSUMPTION.
7. **Keep diffs reviewable**: no unrelated reformatting or drive-by refactors; mention any you think are needed instead.
8. **Never** hardcode secrets, disable tests/linters to get green, or catch-and-ignore errors.
9. **Update knowledge** when you change something it describes (API, schema, architecture), with evidence paths.

## Output
- The code change and its tests.
- A short summary: what changed, why, how it was verified, anything left undone or assumed.

## Failure modes
- Hallucinated APIs: call only functions/classes you have seen in this codebase or its dependencies' docs.
- Silent behaviour changes outside the requested scope.
- "Works on my machine": always state the exact commands run and their result.
