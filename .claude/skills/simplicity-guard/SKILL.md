---
name: simplicity-guard
description: Challenges unnecessary complexity in a plan, design, change or whole codebase - speculative abstractions, layers, configuration, plugin systems, premature generalisation, hand-rolled code the standard library or platform already provides, and extra dependencies - by asking what concrete requirement each piece serves and proposing the smallest solution that meets today's needs. Use when a plan or diff feels over-engineered, before committing to a framework or abstraction, or when asked to simplify, apply YAGNI, keep it minimal or audit a repository for bloat.
license: MIT
---

# Simplicity guard

## Purpose
Every abstraction, layer and dependency must pay for itself today. Complexity added for imagined futures is a cost now and usually wrong later. Simple means less to understand, not fewer characters.

## When to use
- Reviewing a plan or design before building; a diff that adds interfaces, factories, configs or new infrastructure; "simplify this", "is this over-engineered?", YAGNI; "audit this repo for bloat".

## When NOT to use
- Making slow code fast: `performance`. Structural rules between modules: `architecture`.
- Finding existing code to reuse before writing: `search-first`. Correctness and security bugs: `code-review`.

## Procedure
1. **List the concrete requirements** the change must satisfy now (from the ticket, acceptance criteria, recorded decisions). Unknown future needs are not requirements.
2. **For each element of the plan, diff or codebase** (abstraction, interface with one implementation, config option, layer, service, queue, dependency, generic parameter, helper), ask: which requirement needs it today? What breaks if it is removed?
3. **Climb the ladder** for each piece and stop at the first rung that holds: does it need to exist at all? is it already in this codebase? does the standard library do it? does the platform (browser, database, OS, framework) do it? does an already-installed dependency do it? only then, the minimum code. Details: [references/ladder.md](references/ladder.md).
4. **Classify and tag** each finding: `delete` (dead or speculative), `reuse` (an equivalent exists here: name the path), `stdlib` / `native` (name the function or feature), `yagni` (one implementation, config nobody sets, a layer with one caller), `shrink` (same logic, less to read). Before proposing `delete`, search the whole tree including tests, fixtures and string or dynamic references.
5. **Propose the smallest version** that meets the requirements: inline the single implementation, a function instead of a class hierarchy, a constant instead of configuration, the existing datastore instead of a new one. Keep seams only where the project already varies (e.g. two real payment providers). Do not trade clarity for brevity: no nested ternaries or dense one-liners, no cramming a feature into one file or a local patch that duplicates behaviour.
6. **Protect real quality**: simplicity never means skipping validation, error handling, security checks or tests. A smoke test or a self-check is never bloat.
7. **State the trade-off**: what would justify adding the complexity later, so the decision is reversible on evidence. When you knowingly cut a corner with a ceiling (a global lock, an O(n^2) scan), mark it in the code: `# simplify: global lock; per-account locks if throughput matters`. `ai-skills knowledge discover` lists these markers in `.ai/knowledge/issues/deliberate-shortcuts.md`.

## Modes
- **Plan / design**: before building, on the proposal.
- **Diff**: one numbered line per finding, `3. path:line: yagni: AbstractRepository with one implementation. Inline it until a second exists.`, ending with `net: -N lines possible` (or "lean already").
- **Repository audit**: the same tags over the whole tree, ranked biggest cut first, ending with `net: -N lines, -M dependencies possible`. Lists findings; applies nothing unless asked.

## Output
Table of elements (needed / premature / accidental, with the reason) or the numbered tagged findings, the simplified plan or diff, and the trigger that would justify revisiting.

## Failure modes
- Removing necessary safeguards in the name of simplicity.
- Keeping an abstraction "because we might need it".
- Arguing taste instead of naming the requirement each element serves.
- "Simplifying" into clever, dense code that is shorter but harder to read.
- Deleting something still referenced from tests, config or dynamic lookups.
