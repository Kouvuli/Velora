# Tests worth keeping

Adapted from Matt Pocock's `tdd` skill and its `tests.md` / `mocking.md` (mattpocock/skills, MIT,
`../licenses/matt-pocock.LICENSE`) and Superpowers' `test-driven-development` / `writing-good-tests.md`
(obra/superpowers, MIT, `../licenses/superpowers.LICENSE`), condensed and reworded.

## A good test
- Verifies behaviour through the public interface (the seam); the code behind it can change completely and the
  test still passes. Its name says WHAT capability exists ("rejects an empty email"), not HOW.
- One behaviour per test: an "and" in the name means split it.
- **Name the break first**: which production change would make this test fail? If you cannot name one, the test
  checks nothing.
- Expected values come from an independent source: a literal, a worked example, the spec. An assertion that
  recomputes the value the way the code does (`expect(add(a, b)).toBe(a + b)`) passes by construction.
- It fails on accidental breakage, not on every intentional change ("change detectors" such as asserting source
  text, exact log lines or a snapshot nobody reviews).
- It tests your code's contract, not the framework's.

## Mocking
Mock at **system boundaries** only: external APIs (payment, email), time and randomness, sometimes the database
(prefer a real test database) or the filesystem. Do not mock your own modules or internal collaborators.
- A mock earns no assertions: asserting that the mock was called checks the mock, not your code.
- Know the real dependency's side effects before replacing it; mirror real data shapes completely.
- Make boundary interfaces mockable: pass dependencies in instead of constructing them inside; prefer one
  function per external operation (`getUser`, `createOrder`) over one generic request function taking any endpoint, so each
  double returns one shape with no conditional logic.
- Production classes carry production methods only; test-only cleanup belongs in test utilities.
- When mock setup is more than half the test, prefer the real component or a simpler design.

## Mutation check
Before calling a test done, ask whether it would catch: a wrong constant or argument, the wrong branch, a missing
state change or side effect, an empty or default return, missing validation for zero / empty / null /
unauthorised / malformed input.

## Warning signs
- Setup and assertion share the same object, guaranteeing equality.
- The test can only fail by crashing.
- Expected values hidden behind loops, builders or helpers.
- A method called only from tests.
- The test exists for coverage and checks no outcome.

## Slices, not layers
Work in vertical slices: one test, one minimal implementation, repeat, each test responding to what the last
cycle taught you. Writing all tests first tests imagined behaviour and the shape of things, and locks in test
structure before the implementation is understood.

## Where sources differ
Matt Pocock keeps refactoring out of the red-green loop and moves it to review; Superpowers and this OS keep a
short refactor step on green, run after every change. Both agree: never refactor while red.
