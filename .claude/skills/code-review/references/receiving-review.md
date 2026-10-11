# Receiving review feedback

Adapted from Superpowers' `receiving-code-review` skill (obra/superpowers, MIT, `../licenses/superpowers.LICENSE`),
condensed and reworded.

## The pattern
1. **Read** all the feedback before reacting.
2. **Restate** each item as a technical requirement, or ask what it means.
3. **Verify** it against the code as it is.
4. **Evaluate**: is it right for *this* codebase, stack and set of decisions?
5. **Respond** with a technical acknowledgement or reasoned pushback.
6. **Implement** one item at a time, testing each.

No performative agreement ("You're absolutely right!", "Great point!") and no "implementing now" before step 3.
Often the best acknowledgement is the fix itself, with what changed.

## Unclear items
If any item is unclear, stop and ask about the unclear ones before implementing anything: items are often
related, and partial understanding produces the wrong change. "I understand 1, 2, 3 and 6; I need clarification
on 4 and 5 before I start."

## Who said it
- **The user / project owner**: trusted; implement once understood, still ask when scope is unclear.
- **External reviewers (or another agent)**: check before implementing: is it correct here, does it break
  existing behaviour, is there a reason for the current code, does it hold on all supported platforms and
  versions, did the reviewer have the full context? If you cannot verify, say what you would need. If it
  conflicts with a decision the owner made, raise it with the owner first.

## "Implement it properly"
When a reviewer asks to make something complete or "production-grade", first check whether it is used at all
(search for callers). Unused: propose removing it instead. Used: then do it properly.

## Order of work
Clarify everything unclear first, then: blocking issues (breakage, security), simple fixes, complex fixes
(refactoring, logic). Test after each; check for regressions at the end.

## When to push back
The suggestion breaks existing behaviour, the reviewer lacks context, it adds an unused feature, it is wrong
for this stack, compatibility or legacy reasons exist, or it contradicts a recorded architectural decision. Push
back with evidence (code, tests, the decision record) and specific questions, not defensiveness. If you were
wrong, say so plainly and fix it.
