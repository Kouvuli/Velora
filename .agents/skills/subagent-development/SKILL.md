---
name: subagent-development
description: Splits a larger change into independent tasks and delegates them to subagents with self-contained briefs (goal, files, constraints, acceptance check), runs independent tasks in parallel and dependent ones in order, then reviews and integrates each result before trusting it. Use when a plan has several separable parts, when work can run in parallel, or when the user asks to use subagents or agents.
license: MIT
---

# Subagent development

## Purpose
Use helpers without losing control: each subagent gets exactly the context it needs, and nothing it returns is accepted unreviewed.

## When to use
- A plan with several parts that touch different files or concerns; broad searches; parallel investigation; "use subagents".

## When NOT to use
- Small or tightly coupled changes: doing them yourself is cheaper than briefing someone. Use `implementation`.
- Producing the plan itself: `planning`. Parallel branches of the repository: `worktrees`.

## Procedure
1. **Start from a plan** (`planning`). Mark which steps are independent (different files, no shared state, each understandable without the others' context) and which depend on others. Related failures (fixing one may fix the others) are one task, not several.
2. **Write a brief per task** that stands alone: the goal, the files and interfaces involved, project conventions and relevant `.ai/knowledge/` items, what not to touch, and the acceptance check (tests or commands that prove it is done). A subagent has none of your context; anything not in the brief does not exist for it.
3. **Pick the right worker**: read-only exploration or review for questions (the `explorer` and `reviewer` agents), write access only for implementation tasks with clear boundaries. Choose the model by task, not by habit: 1-2 files with a complete spec -> a cheap model; multi-file integration -> a standard one; design judgement or broad understanding -> the most capable (`ai-skills route`).
4. **Dispatch**: independent tasks in parallel, dependent ones in order. Never let two subagents edit the same file at the same time.
5. **Handle the report**: ask every worker to end with a status - DONE, DONE WITH CONCERNS, NEEDS CONTEXT or BLOCKED - and act on it: read concerns before review; supply missing context and re-dispatch; for a blocker change something (more context, a more capable model, a smaller task, or a ruling that corrects the plan) instead of retrying unchanged. See [references/task-loop.md](references/task-loop.md).
6. **Review every result in two passes** (`code-review`): first *spec compliance* (does it do what the brief asked, nothing more?), then *quality*. Read the diff, run the acceptance check yourself, send findings back for a bounded number of fix rounds, then escalate or park. A subagent's "done" is a claim, not evidence.
7. **Integrate and verify** the whole change together (`verification`), then report what each subagent did and what you changed after review. Keep a short progress log (task, commits, review outcome, parked findings) so the work can resume after an interruption.

## Output
The task split (with dependencies), the briefs, each result's review outcome, and the final verification.

## Failure modes
- Vague briefs ("fix the API") that force the subagent to guess.
- Parallel subagents editing the same files.
- Pasting subagent output into the codebase without reading or testing it.
- Delegating tiny tasks where the briefing costs more than the work.
