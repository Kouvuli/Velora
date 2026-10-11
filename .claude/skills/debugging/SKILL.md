---
name: debugging
description: Finds the root cause of a bug, failing test, crash, or unexpected behaviour through reproduction, evidence gathering, and hypothesis testing before changing any code. Use when something is broken, a test fails, an error or stack trace appears, or behaviour differs from what is expected.
license: MIT
---

# Debugging

## Purpose
Fix causes, not symptoms. No code change until the root cause is supported by evidence.

## When to use
- Errors, stack traces, failing tests or CI, wrong output, performance regressions, "it used to work".

## When NOT to use
- Building new behaviour with no defect involved: `implementation`.

## Procedure
1. **Build a feedback loop first.** One command you have already run that goes red on *this* bug: a failing test, an HTTP request script, a CLI run diffed against a known-good output, a replayed captured request, a bisection harness. It must assert the user's exact symptom (not "it didn't crash"), give the same verdict every run, and take seconds. Spend effort here: with a tight red loop the rest is mechanical; without one, stop and say what you tried and what you need (access, a redacted log or capture). Ways to build one, flaky bugs, and tightening: [references/feedback-loops.md](references/feedback-loops.md).
2. **Reproduce and minimise.** Confirm the loop shows the failure the user described, not a nearby one. Cut inputs, steps and config one at a time while it stays red; what remains is load-bearing.
3. **Read the evidence completely**: the whole error and stack trace, logs around the time, recent changes (`git log`, `git diff` against the last good state), config and environment differences. Keep **observed symptom** apart from **inferred cause** in your notes.
4. **Check knowledge** (`.ai/knowledge/issues/`, decisions, architecture) for known issues and constraints in this area.
5. **Say your hypotheses before the first experiment** - required even when the cause looks obvious, because it is what stops shotgun fixes and lets a reviewer check your reasoning. Post 2-5 ranked, falsifiable ones *before* running probes or editing code, each with its prediction: `H1: float rounding in gross_total -> predicts 1.50 x 1.19 rounds to 1.78` / `H2: discount applied twice -> predicts orders without coupons are correct`. A hypothesis without a prediction is a guess: sharpen or drop it.
6. **Test one hypothesis at a time** with the cheapest decisive experiment: a debugger breakpoint, a targeted log at the boundary that separates two hypotheses (tag it, e.g. `[DEBUG-a4f2]`, so cleanup is one grep), a narrower input, `git bisect run` on the loop. Change one variable per experiment and say which prediction held. Performance: measure a baseline and bisect; logs mislead.
7. **Confirm root cause**: explain the full causal chain from trigger to symptom; trace backwards through callers to where the bad value or state *originates*, not where it surfaces ([references/techniques.md](references/techniques.md)). The loop flips when you change the cause.
8. **Fix minimally at the cause**: turn the minimised repro into a failing regression test at a seam that exercises the real bug pattern, watch it fail, fix, watch it pass, re-run the original loop. If no seam can reach the bug, say so: that is an architecture finding. Check for the same defect pattern elsewhere.
9. **After 3 failed fix attempts, stop**: re-examine assumptions and the architecture instead of trying a fourth patch.
10. **Clean up and record**: remove tagged debug output and throwaway harnesses; record non-obvious causes in `.ai/knowledge/issues/` (symptom, cause, fix, evidence) and state the confirmed hypothesis in the commit message.

## Output
```markdown
Symptom / Feedback loop (command + red output) / Hypotheses (prediction -> result of each experiment) / Root cause (with evidence) / Fix / Regression test / Related risks
```

## Failure modes
- Theorising from code before a red loop exists; a loop that cannot catch this specific bug.
- Shotgun changes ("try this") without a hypothesis; several changes at once.
- Fixing where the error surfaces instead of where it originates.
- Suppressing the error (catch-all, retries, longer timeouts, sleeps) and calling it fixed.
- Leaving debug logging or harnesses behind. Red flags and the excuses that precede them: [references/techniques.md](references/techniques.md).
