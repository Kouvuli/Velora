---
name: architecture
description: Shapes how a system is structured - module and service boundaries, dependencies between components, data ownership, integration patterns (sync calls, queues, events), and the quality attributes they trade off - and records significant decisions as ADRs with context, decision and consequences. Use when deciding where new functionality belongs, splitting or merging modules or services, introducing a new component or integration, or documenting an architectural decision.
license: MIT
---

# Architecture

## Purpose
Keep the structure of the system deliberate: each decision fits the existing architecture or changes it on purpose, and is written down so the next person knows why.

## When to use
- "Where should this live?", "should this be a separate service?", "how should X talk to Y?", introducing a queue, cache, new datastore or external integration, writing an ADR.

## When NOT to use
- Comparing open-ended product/solution ideas: `brainstorm` (architecture works on a chosen direction).
- Step-by-step implementation tasks: `planning`. API shape details: `api`.

## Procedure
1. **Map what exists** before proposing anything: modules/services, their dependencies, data ownership and integrations. Use `.ai/knowledge/` (architecture, decisions, `ai-skills knowledge graph <component>`) and verify against the code.
2. **Name the drivers**: functional need plus the quality attributes that matter here (consistency, latency, availability, scalability, security, operability, team ownership) and hard constraints (stack, budget, compliance). Mark assumptions.
3. **Prefer the smallest structural change** that meets the drivers: a new module inside the existing service before a new service; a direct call before a queue; an existing datastore before a new one. Add complexity only for a stated driver.
4. **Define boundaries**: what the component owns (data, rules), its public interface, who may depend on it, and what it must not depend on. Avoid shared databases across boundaries and cyclic dependencies. Aim for deep modules: a lot of behaviour behind a small interface (everything a caller must know: signature, invariants, ordering, errors, config). Apply the deletion test (would deleting it move complexity into every caller, or just remove a pass-through?) and add a seam only where something really varies across it - one adapter is a hypothetical seam, two make a real one. For an important interface, design it two or three radically different ways before choosing. Vocabulary and techniques: [references/deep-modules.md](references/deep-modules.md).
5. **Check failure and change**: what happens when a dependency is slow or down (timeouts, retries, idempotency, outbox/transactions for events), how data migrates, how it is deployed and observed.
6. **Challenge it before committing**: does every new boundary match a real domain seam? What is the simplest design that meets the drivers, and how does this compare? Trace one failure end to end; "we'll figure out the data migration later" is a finding. If you could change only one thing, what would it be?
7. **Record the decision** as an ADR when it is hard to reverse or constrains future work: `docs/adr/NNNN-title.md` (or the project's location) with Status, Context, Decision, Alternatives considered, Consequences. Superseded ADRs are marked, not deleted.

## Output
A short design (diagram in text or Mermaid if useful): components, responsibilities, interactions, data ownership, failure handling; plus the ADR.

## Failure modes
- Designing a target architecture that ignores the current code.
- Microservices, events or new infrastructure without a driver that needs them.
- Decisions with no recorded context, so nobody knows if they still apply.
- Presenting assumed load or scale numbers as facts.
