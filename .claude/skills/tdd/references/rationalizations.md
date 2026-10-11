# Skipping a TDD step: excuses and answers

Adapted from Superpowers' `test-driven-development` skill (obra/superpowers, MIT, `../licenses/superpowers.LICENSE`),
condensed and reworded.

| Excuse | Answer |
|---|---|
| Too simple to test | Simple code breaks; the test takes seconds |
| I'll test after | A test written after passes immediately, so it never proved it can catch the bug, and it checks the cases you remembered rather than the ones you would have discovered |
| I already tested it manually | Manual checks leave no record and are not re-run when the code changes |
| Deleting the code I wrote is wasteful | The time is spent either way; code you cannot trust is the waste. Set it aside and drive it again from tests |
| I'll keep it as a reference | You will adapt it, which is testing after |
| I need to explore first | Fine: explore, throw the exploration away, then start with a test |
| It's hard to test | Hard to test usually means hard to use: simplify the interface |
| I have to mock everything | The code is too coupled: pass dependencies in |
| TDD slows me down | It is faster than debugging regressions later |

## Red flags: stop and restart the cycle
- Production code written before its test.
- A new test that passes immediately, or a failure you cannot explain.
- "Just this once", "spirit not ritual", "this case is different".

## When stuck
| Problem | Try |
|---|---|
| Don't know how to test it | Write the call you wish existed and the assertion first; ask the user |
| Test too complicated | The design is too complicated: simplify the interface |
| Huge setup | Extract test helpers; if still large, simplify the design |
| A bug was found | Reproduce it as a failing test first, then fix (`debugging`) |
