---
name: testing
description: Designs and writes focused automated tests (unit, integration, end-to-end) that prove acceptance criteria and guard against regressions, using the project's existing test framework and conventions. Use when adding tests, doing test-first development, reproducing a bug with a failing test, or assessing test coverage.
license: MIT
---

# Testing

## Purpose
Tests are executable evidence that the requirements are met. Write the fewest tests that would catch a real regression.

## When to use
- Implementing a feature or fix; reproducing a bug; reviewing coverage of a change.

## When NOT to use
- Finding why something fails: `debugging`. Confirming a whole change is done: `verification`.

## Procedure
1. **Find the existing test setup**: framework, folder layout, naming, fixtures/factories, how tests are run (check `.ai/knowledge/` and the build files). Reuse it; do not introduce a second framework.
2. **Map acceptance criteria to tests.** One behaviour per test; name tests after the behaviour ("rejects expired token"), not the method.
3. **Pick the lowest level that proves the behaviour**:
   - unit: pure logic, branching, calculations
   - integration: database queries, HTTP handlers, message consumers (use real dependencies via containers where the project already does)
   - end-to-end: a few critical user journeys only
4. **For bugs: write the failing test first**, watch it fail for the right reason, then fix.
5. **Arrange / Act / Assert**, deterministic: no real network, no sleeps, fixed clocks and seeds, isolated data.
6. **Assert on behaviour** (outputs, state, emitted events), not on implementation details or private methods. Avoid mocking what you own when a real collaborator is cheap.
7. **Cover the edges the requirements care about**: empty, boundary, invalid, unauthorized, failure of a dependency.
8. **Run** the new tests and the surrounding suite; report the exact command and result.

## Output
- Tests in the project's conventions, plus the command used to run them and the result.
- Gaps you noticed but did not cover, stated explicitly.

## Failure modes
- Tests that pass without the change (assert nothing meaningful): check they fail when the code is broken.
- Snapshot or mock-heavy tests that freeze implementation details.
- Flaky tests (time, ordering, shared state): fix or quarantine with a note; never just retry.
- Deleting or weakening a failing test to get green.
