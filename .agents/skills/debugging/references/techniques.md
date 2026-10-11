# Debugging techniques, red flags and rationalizations

Adapted from Superpowers' `systematic-debugging` skill and its references `root-cause-tracing.md`,
`condition-based-waiting.md` and `defense-in-depth.md` (obra/superpowers, MIT, see `../licenses/superpowers.LICENSE`),
condensed and reworded for this Skill OS.

## Root-cause tracing
Bugs often surface deep in a call stack (a command run in the wrong directory, a file written to the wrong
place, a database opened with the wrong path). Fixing where it appears treats a symptom.
1. Observe the symptom (`git init failed in packages/core`).
2. Find the code that directly causes it.
3. Ask what called it, and with which values. Keep walking up the callers.
4. Stop at the **original trigger** (for example a test reading a temp-dir variable before setup ran, so an empty
   string became "the current directory"). Fix there.

When manual tracing stalls, capture context **before** the risky operation: the arguments, the working directory,
relevant environment, and a stack trace (`new Error().stack`, `traceback.format_stack()`). In tests write to
stderr; loggers are often silenced there.

**Which test pollutes shared state?** Run the suspect test files one by one (or bisect the list) and check after
each whether the artefact appeared; the first that creates it is the polluter.

## Flaky timing: wait for conditions, not durations
Arbitrary sleeps pass on fast machines and fail under load or in CI. Wait for the condition you actually need
(an event arrived, a state reached, a file exists, a count reached) with a poll interval of about 10 ms and a
timeout that fails with a clear message. Call the getter inside the loop so data is fresh. A fixed delay is
only right when the behaviour under test *is* timing (debounce, ticks); then first wait for the triggering
condition, derive the delay from the known interval, and comment why.

## Defense in depth, after the root cause is fixed
One check where the bug was found can be bypassed by another code path, a refactor or a mock. When invalid data
caused the bug, consider validating at each layer it crosses: the entry point (reject obviously bad input), the
business operation (does this make sense here), an environment guard for dangerous operations (for example
refuse destructive filesystem work outside a temp dir in tests), and context logging before the risky call.
Keep it proportionate: add layers where the failure was costly, not everywhere (`simplicity-guard`).

## Red flags: stop and go back to the feedback loop
- "Quick fix for now, investigate later." / "Just try changing X and see."
- Several changes before re-running the loop.
- "It's probably X" without a prediction that could prove it wrong.
- Proposing fixes before tracing where the data comes from.
- Skipping the regression test "to verify manually".
- One more attempt after two or more failed fixes, or each fix revealing a new problem elsewhere: question the
  architecture instead.

Signals from the human that you are guessing: "is that actually happening?", "will that show us?", "stop
guessing", "we're stuck?".

## Rationalizations
| Excuse | Reality |
|---|---|
| The issue is simple, no process needed | Simple bugs have causes too, and the process is fast for them |
| No time, it's an emergency | Guess-and-check thrashing is slower than finding the cause |
| Try this first, investigate after | The first fix sets the pattern for the session |
| I'll write the test once the fix works | Untested fixes don't stick; the failing test proves the cause |
| Several fixes at once save time | You can't tell which one worked, and they cause new bugs |
| I see the problem | Seeing the symptom is not understanding the cause |
