---
name: verification
description: Confirms a change is actually done before claiming success by running builds, tests, linters and checks, comparing results against every acceptance criterion, and reporting evidence honestly. Use before saying a task is complete, before committing or opening a pull request, and before handing work to a client.
license: MIT
---

# Verification

## Purpose
"Done" means proven, not believed. Every completion claim is backed by fresh evidence from this session.

## When to use
- At the end of any implementation or fix; before commit, PR, delivery or status report.

## Procedure
1. **Collect the acceptance criteria** (from `requirements`/the ticket). If none exist, state what you are verifying against.
2. **Run the project's checks fresh** (do not rely on earlier runs unless nothing changed since, on the same commit): build/compile, type-check, lint/format, unit and integration tests for affected areas, and any project-specific checks (migrations, contract tests). Use the commands the project documents. Focused checks first, then the wider suite. Read the full output: exit code and failure count, not the last line.
3. **Verify each criterion** with evidence: test name and result, command output, screenshot or manual reproduction steps for UI behaviour. Each kind of claim needs its own proof (a passing linter does not prove the build; passing tests do not prove the requirements): [references/evidence.md](references/evidence.md). A new regression test counts only if it fails with the fix reverted. Work done by a subagent counts only after you have read its diff.
4. **Review the diff yourself**: unintended changes, leftover debug code, TODOs, secrets, commented-out code, missing migrations, missing docs.
5. **Check knowledge consistency**: if the change altered APIs, schema, infrastructure or decisions, update `.ai/knowledge/` and run `ai-skills knowledge check`.
6. **Report honestly** using the template below, with each result as exactly one of PASS, FAIL, NOT RUN (unavailable) or BLOCKED. A failing or skipped check is reported as such, never rounded up to success. Words like "should work", "probably fixed" or "looks good" are not results.
7. **Stop when proven.** If the task was only to verify, do not edit product code, add polish or unrelated tests; report and stop.

## Output
```markdown
## Verification
| Criterion | Evidence | Result |
|---|---|---|
| ... | `npm test -- orders` (12 passed) | PASS |
Checks run: <commands + results>
Not verified / known gaps: ...
```

When the work belongs to a feature in `.ai/knowledge/requirements/`, the Criterion column uses its IDs
(`AC-01`), the tests that prove a criterion name it (`<feature ID>/AC-01`), and the ticket in `.ai/knowledge/work/`
moves to `state: done` only with this table filled.

## Failure modes
- Claiming success from code reading alone.
- Running only the new test and not the surrounding suite.
- Reporting "tests pass" when some were skipped or the suite did not run.
- Treating a green CI on a different commit as evidence for this one.
