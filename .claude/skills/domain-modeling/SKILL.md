---
name: domain-modeling
description: Models the business domain - entities and value objects, their relationships and lifecycles, invariants (rules that must always hold), aggregates and their boundaries, and a shared glossary of business terms - from the requirements and the existing code, and records it in .ai/knowledge/domain/. Use when designing new business features or data structures, when terms or rules are unclear or used inconsistently, or when asked to model the domain or write a glossary.
license: MIT
---

# Domain modeling

## Purpose
Make the business rules explicit and named, so code, tests, conversations and the database all mean the same thing.

## When to use
- New business areas (orders, billing, bookings); confusing or conflicting terms; rules scattered across the code; "model the domain", "write a glossary", "what are the invariants?".

## When NOT to use
- Module/service structure and integrations: `architecture`. Table design and migrations: `database-engineer` / `postgres`.
- Collecting what the client wants: `requirements`.

## Procedure
1. **Collect the language**: nouns and verbs from requirements, tickets, UI text, code and the existing glossary (`GLOSSARY.md`, or `.ai/knowledge/domain/glossary-index.md` after `ai-skills knowledge discover`). Note synonyms (customer/user/account) and choose one term per concept with the user. While talking, challenge a term the moment it conflicts with the glossary ("the glossary says cancellation means X; you seem to mean Y - which?") and replace fuzzy words with precise ones.
2. **Identify concepts**: entities (identity over time: Order), value objects (defined by value: Money, Address), and their relationships and cardinalities.
3. **Stress-test with concrete scenarios**: invent edge cases that force the boundaries between concepts to be precise (an order with one item cancelled, a refund after the coupon expired).
4. **Write the invariants** as testable statements ("an order's total never goes below zero", "a coupon applies at most once per order"). Mark each as stated in requirements, enforced in code (`file:line`), or assumed.
5. **Describe lifecycles**: states and allowed transitions (e.g. draft -> paid -> shipped -> cancelled?) and who may trigger them.
6. **Draw boundaries**: which concepts change together and must stay consistent in one transaction (aggregates), and which only reference each other by id.
7. **Compare with the code**: where the code disagrees with the model, list it as a finding; do not silently pick one.
8. **Record as terms resolve**, not in a batch at the end: the glossary in the project's `GLOSSARY.md` if it keeps one (one per bounded context, created only when the first term is settled; definitions only, no implementation details), otherwise `.ai/knowledge/domain/`; model and invariants in `.ai/knowledge/domain/` with status and evidence (`knowledge-update` conventions). Propose an ADR only when a decision is hard to reverse, surprising without context, and the result of a real trade-off.

## Output
Glossary table, concept list with relationships, invariants with their source, lifecycle per entity, and code-vs-model findings.

## Failure modes
- Mirroring the database tables instead of the business rules.
- Inventing rules or states the business never stated, presented as facts.
- Several names for one concept, or one name for several.
