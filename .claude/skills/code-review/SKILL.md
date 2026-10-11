---
name: code-review
description: Reviews a code change (diff, patch, branch or pull request) against its requirement, finding correctness bugs, security problems, missing tests and maintainability issues, each backed by file and line evidence and a concrete failure scenario, ranked by severity with a verdict. Also handles review feedback received on your own change - verifying each comment before acting on it. Use when asked to review code, a PR, a patch or someone else's change, before merging, or when addressing reviewer comments.
license: MIT
---

# Code review

## Purpose
Find what is wrong with a change before it ships, with evidence, without rewriting it. And when the review is of your change, act on what is right in it and push back on what is not.

## When to use
- "Review this PR / diff / patch / branch", "is this ready to merge?", reviewing an agent's or colleague's change.
- Review comments arrived on your change ("address the review", "fix comments 1-6"): see *Receiving review*.

## When NOT to use
- Checking your own finished work against acceptance criteria: use `verification`.
- A deep security audit: use `security` (code review applies it to the diff only).
- Fixing the problems you find: report them; change code only if asked, then use `implementation`.

## Procedure
1. **Pin the change and its goal**: the base it is compared with (`git diff <base>...HEAD`, three dots = from the merge-base; confirm the ref resolves and the diff is not empty) and the requirement, ticket or acceptance criteria. If no requirement exists, say the review can only cover generic quality.
2. **Read the whole change**, then the code it relies on (callers, data model, config). Never review a diff line in isolation.
3. **Spec axis**: each acceptance criterion met / not met / not verifiable, with `path:line`; behaviour the requirement never asked for (scope creep); things that look implemented but are wrong.
4. **Run what covers the change**: the project's tests, type checks and linters. Report the real output. A change with no test for new behaviour is a finding.
5. **Look for, in this order**:
   - correctness: edge cases, error paths, null/empty input, concurrency, off-by-one, money/rounding, time zones, errors swallowed or silently defaulted;
   - data: migrations, backwards compatibility, data loss;
   - security: input validation, authorization, secrets, injection (apply `security`);
   - tests: missing cases, tests that cannot fail;
   - **standards axis**: the project's documented conventions (cite the rule), then common code smells as judgement calls (a documented project rule overrides them; skip what tooling enforces): [references/smells.md](references/smells.md).
6. **Keep only what you verified.** Report a finding when you can show the failure, not when it "might be" a problem; label judgement calls as such. Pre-existing problems outside the change are a separate note.
7. **Write each finding** on one line where possible: `path:line: severity: problem. Scenario: input -> wrong result. Fix: ...` (severity: blocker / risk / nit / question). Security and architecture findings get a full paragraph with the reasoning.
8. **Give a verdict**: ready / ready after fixes / not ready, plus what you could not verify. Report the two axes separately: a change can follow every standard and implement the wrong thing.

## Receiving review
Comments on your change are claims to check, not orders. Read them all first; restate each in your own words; check it against the code; then answer with a technical acknowledgement or reasoned pushback - never performative agreement. If any item is unclear, ask about it before implementing *any* item (they are often related). Implement blockers first, then simple fixes, then complex ones, testing each. Details, when to push back, and the "implement it properly" check: [references/receiving-review.md](references/receiving-review.md).

## Output
```markdown
## Review: <change> (base: <ref>)
Goal: <one line>
### Spec
| Criterion | Status | Evidence |
- scope creep / wrong implementation findings
### Findings
1. `path:line`: blocker: problem. Scenario: input -> wrong result. Fix: ...
### Standards (judgement calls marked)
### Checks run
### Verdict
```

## Failure modes
- Findings without a location or a failure scenario ("this might be a problem").
- Inventing problems to look thorough; padding with style nits; smells presented as violations.
- Approving because tests pass when no test covers the new behaviour.
- Rewriting the change instead of reviewing it.
- On received review: "You're absolutely right!" followed by blind implementation; implementing the clear items while silently skipping the unclear ones.
