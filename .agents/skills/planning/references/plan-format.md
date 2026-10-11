# Plan format and self-review

Adapted from Superpowers' `writing-plans` skill (obra/superpowers, MIT, `../licenses/superpowers.LICENSE`),
condensed and reworded. Use it when a plan will be executed by someone (or a subagent) who has not seen the code
or the conversation.

A plan records the decisions the implementer cannot make alone: which files, which names and signatures, which
values from the requirements, which tests prove each task. It does not write the code for them.

## Header
```markdown
# <Feature> plan
Goal: <one sentence>
Approach: <2-3 sentences, and the options rejected>
Requirements: <path or ticket the plan implements; executors read both>
Global constraints: <project-wide rules copied verbatim: versions, dependency limits, naming, copy>
Review focus: <the few inputs or failure modes the requirements imply but no task tests yet, most likely first>
```

## File structure first
Before tasks, list the files to create or modify and the one responsibility each has. Files that change
together live together; split by responsibility, not by technical layer; in existing codebases follow the
established layout even if you would design it differently.

## Task
```markdown
### Task N: <component>
Files: create `exact/path.py` · modify `exact/other.py` · test `tests/exact/test_path.py`
Interfaces: consumes <signature from task M> · produces <exact name(params) -> type>
- [ ] Write the failing test `test_rejects_empty_email` asserting <exact values from the requirements>
- [ ] Run `pytest tests/exact/test_path.py::test_rejects_empty_email`: expect FAIL (function missing)
- [ ] Implement `validate(email: str) -> Result` in `exact/path.py` (one line on approach if the test leaves a choice)
- [ ] Run the test: expect PASS; run the suite
- [ ] Commit
```

## Right-sizing
- A task is the smallest unit with its own test cycle that a reviewer could reject while approving its neighbour.
- Fold setup, configuration and docs into the task whose deliverable needs them.
- Each step is one action with a checkable result.

## Self-review checklist
1. **Coverage**: every requirement points to a task; add tasks for gaps.
2. **Precision**: no step decides nothing ("TBD", "appropriate validation", "tests for the above", a type no task
   defines); no step contains a body the signature and tests already determine.
3. **Consistency**: names, signatures and properties match between the task that defines them and the tasks that
   use them.
4. **Review focus**: the inputs a real user will hit that no test covers (empty, huge, malformed, concurrent,
   unauthorised) are listed, and each gets a test in the task that owns the code.
5. **Proportion**: a plan several times longer than the requirements is a transcript of the program; replace
   bodies with signatures, test names and assertions.

## Handing over
Ask the human to review the plan before implementation and say how it will be executed: inline
(`implementation`) or one subagent per task with a review after each (`subagent-development`). Recommend one,
with the reason (how coupled the tasks are, how many, what a shipped mistake would cost).
