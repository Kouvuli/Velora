# What proves a claim

Adapted from Superpowers' `verification-before-completion` skill (obra/superpowers, MIT,
`../licenses/superpowers.LICENSE`), with result states from Caveman's `verify-and-stop` (Apache-2.0; ideas only),
condensed and reworded.

## The gate
Before stating any status or expressing satisfaction:
1. Which command proves this claim?
2. Run it, complete and fresh.
3. Read the whole output: exit code, number of failures, skipped tests.
4. Does it confirm the claim? If not, state the actual status with the evidence.
5. Only then make the claim, quoting the evidence.

## Claim -> required evidence
| Claim | Proof | Not proof |
|---|---|---|
| Tests pass | the test command's output with 0 failures | an earlier run, "should pass" |
| Lint is clean | linter output with 0 errors | a partial run |
| It builds | the build command exiting 0 | the linter passing |
| The bug is fixed | the original symptom no longer reproduces | the code was changed |
| The regression test works | it fails with the fix reverted, passes with it restored | it passed once |
| The subagent finished | its diff, read and checked | its own success message |
| The requirements are met | each criterion checked line by line | the tests pass |

## Red flags
- "Should", "probably", "seems to", or "Done!" / "Perfect!" before anything was run.
- Committing, pushing or opening a PR before the checks ran.
- Partial verification presented as complete; "just this once"; fatigue.

## Result states
Report each check as exactly one of: **PASS**, **FAIL**, **NOT RUN** (the tool or environment was unavailable),
**BLOCKED** (something outside the change prevents it). Never fold NOT RUN or BLOCKED into PASS.
