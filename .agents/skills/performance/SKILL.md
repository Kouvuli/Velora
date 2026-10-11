---
name: performance
description: Makes slow code fast - latency, throughput, memory, CPU, N+1 queries, unbounded loads, missing pagination and caching - by measuring first, locating the real bottleneck, changing one thing, and proving the speed-up with numbers. Use when a request, page, query or job is slow or takes seconds, hits timeouts, uses too much memory or CPU, or must handle more load.
license: MIT
---

# Performance

## Purpose
Make the slow thing fast with evidence. Most time is lost in a few places; find them by measurement, not intuition.

## When to use
- "This endpoint/page/job is slow", timeouts, high memory or CPU, load or scale targets, performance regressions.

## When NOT to use
- Wrong results (not slow ones): `debugging`.
- Tuning a specific SQL query or index in PostgreSQL: `postgres` (performance finds that the database is the bottleneck; postgres fixes the query).
- Frontend rendering details in React: `react` covers memoization; this skill covers measuring and finding the bottleneck.

## Procedure
1. **Define the target**: what is slow, for whom, how slow now, and what is good enough (p95 latency, throughput, memory). Ask if unknown; do not optimise without a goal.
2. **Measure before changing**: reproduce with realistic data volume (production sizes from `.ai/knowledge/` or the README), then profile or time it (profiler, query log, `EXPLAIN ANALYZE`, browser performance panel). Record the baseline.
3. **Find the bottleneck** in the measurement. Usual suspects in order: loading too much data (unbounded queries, no pagination, filtering in application code), N+1 queries, missing indexes, repeated work that could be cached or batched, synchronous calls that could be parallel, then algorithmic complexity, and only last micro-optimisations.
4. **Change one thing at a time**, the biggest bottleneck first. Keep behaviour identical; add or keep tests that prove it.
5. **Measure again** with the same method and compare against the baseline. Keep the change only if it helps; report the numbers.
6. **Watch the trade-offs**: caches need invalidation and memory limits; pagination changes the API contract (coordinate with `api`); indexes slow writes and need migrations safe for large tables.

## Output
Baseline, bottleneck with evidence, change made, new measurement, trade-offs and remaining risks.

## Failure modes
- Optimising without measuring, or claiming a speed-up without numbers.
- Testing with tiny data that hides the real problem.
- Caching wrong or stale data to hide a slow query.
- Micro-optimising code that is not on the hot path.
