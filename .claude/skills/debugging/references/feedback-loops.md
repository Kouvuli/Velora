# Feedback loops for debugging

Adapted from Matt Pocock's `diagnosing-bugs` skill (mattpocock/skills, MIT, see `../licenses/matt-pocock.LICENSE`),
condensed and reworded for this Skill OS.

A tight pass/fail signal that goes red on *this* bug is most of the work. Bisection, hypothesis testing and
instrumentation all consume it; without it, reading code produces theories, not causes.

## Ways to build one (try roughly in this order)
1. **Failing test** at whatever seam reaches the bug: unit, integration, end-to-end.
2. **HTTP request script** against a running dev server.
3. **CLI run** with a fixture input, diffing output against a known-good snapshot.
4. **Headless browser script** (Playwright, Puppeteer) asserting on DOM, console or network.
5. **Replay a captured trace**: save a real request, payload or event log to disk and replay it through the code path in isolation.
6. **Throwaway harness**: start the smallest subset of the system (one service, mocked dependencies) that reaches the bug with one call.
7. **Property / fuzz loop** for "sometimes wrong output": many random inputs, look for the failure mode.
8. **Bisection harness** when the bug appeared between two known states (commit, dataset, version): automate "set up state X, check" and drive it with `git bisect run`.
9. **Differential loop**: the same input through old vs new version (or two configs), diff the outputs.
10. **Human in the loop**, last resort: if a person must click, script the steps for them and capture their output so the loop is still structured.

## Tighten it
- Faster: cache setup, skip unrelated initialisation, narrow the test scope.
- Sharper: assert the specific symptom, not "did not crash".
- Deterministic: pin time, seed randomness, isolate the filesystem, freeze the network.

A slow flaky loop is barely better than none; a two-second deterministic one makes the rest mechanical.

## Non-deterministic bugs
Aim for a higher reproduction rate, not a clean repro: run the trigger 100 times, parallelise, add load, narrow
timing windows. A bug that fails half the time is debuggable; one that fails 1% of the time is not yet.

## When no loop can be built
Stop and say so. List what you tried and ask for one of: access to an environment that reproduces it, a
redacted captured artifact (HAR file, log dump, core dump, timestamped screen recording), or permission for
temporary production instrumentation. Do not move on to hypotheses without a loop.

## Done when
You can name one command, already run (show it and its output, secrets redacted), that is:
- **red-capable**: drives the real code path and asserts the user's exact symptom;
- **deterministic**: same verdict every run (flaky bugs: a pinned, high reproduction rate);
- **fast**: seconds, not minutes;
- **agent-runnable**: runs unattended.

## Minimise
Once red, cut inputs, callers, config, data and steps one at a time, re-running after each cut. Stop when removing
anything turns it green. The minimal repro shrinks the hypothesis space and becomes the regression test.

## Redaction
Commands, outputs and captures often carry credentials or auth headers. Replace secrets with `<REDACTED>`, keep
credentials in environment variables rather than in commands you show, and quote only the lines that carry the
signal.

## Regression test seam
Write the regression test before the fix only at a seam that reproduces the real pattern (for example several
callers, or the whole chain that triggered it). A shallow unit test that cannot reproduce the chain gives false
confidence; if no correct seam exists, report it as an architecture finding.
