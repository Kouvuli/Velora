# The delegated task loop

Adapted from Superpowers' `subagent-driven-development` and `dispatching-parallel-agents` skills
(obra/superpowers, MIT, `../licenses/superpowers.LICENSE`), condensed and reworded, without its scripts.

## A good brief
- **Focused**: one problem domain (one test file, one subsystem, one plan task).
- **Self-contained**: goal, files and interfaces, the exact errors or test names, conventions, relevant knowledge,
  what not to touch. Never the session's history: the worker gets only what you write.
- **Specific about output**: what to return, ending with a status line.
- **Constraints stated**: "do not just raise timeouts", "do not edit files outside src/billing/".

Too broad ("fix all the tests") and context-free ("fix the race condition") briefs are the usual failures.

## Status and what to do
| Status | Meaning | Your move |
|---|---|---|
| DONE | finished | review it |
| DONE WITH CONCERNS | finished, with doubts | read the concerns; correctness or scope doubts are settled before review, observations are noted |
| NEEDS CONTEXT | missing information | provide it and re-dispatch |
| BLOCKED | cannot finish | change something: more context; a more capable model; split the task; or rule on a plan error, record the ruling, re-dispatch with it |

Never retry a blocked task unchanged.

## Review per task
1. **Spec compliance**: does the diff do what the brief asked - all of it and nothing extra?
2. **Quality**: correctness, tests, conventions (`code-review`).
Give the reviewer the brief and the diff from the commit recorded *before* dispatch (not `HEAD~1`, which drops
all but the last commit of a multi-commit task). Do not pre-judge findings for the reviewer.

## Fix rounds
- Rounds 1-3: send the open findings back to the same worker; it fixes, re-runs the tests, reports.
- Rounds 4-5: a fresh worker on a more capable model.
- Still open after that: stop. A contestable or non-load-bearing finding is parked in the progress log with a
  reason; a real one that later tasks build on goes to the human.
Each re-review covers only the fix, not the whole task again.

## Parallel or sequential
Parallel only for independent domains (different files, no shared state, understandable alone). Implementation
workers never edit the same file concurrently; when in doubt, run them one after another. After parallel work:
read each summary, check the changes do not conflict, run the full suite, integrate.

## Progress log
One line per task: `Task 3: complete (commits a1b2c3d..e4f5a6b, review clean)` or `..., 1 parked`. It is the
recovery map after an interruption: the commits exist in git even if the session does not.

## Do not stall a running plan
Once the user asked for the plan to be executed, do not stop between tasks to ask "should I continue?". Stop only
for a blocker, a contradiction in the plan, a decision only the user can make, or completion.
