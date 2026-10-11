# Deep modules: vocabulary and techniques

Adapted from Matt Pocock's `codebase-design` skill and its `DESIGN-IT-TWICE.md` (mattpocock/skills, MIT,
`../licenses/matt-pocock.LICENSE`), which build on John Ousterhout's *A Philosophy of Software Design* and Michael
Feathers' seams. Condensed and reworded.

## Vocabulary (use the words consistently)
- **Module**: anything with an interface and an implementation, at any scale: a function, class, package or a
  slice across tiers.
- **Interface**: everything a caller must know to use the module correctly: the signature *and* invariants,
  ordering constraints, error modes, required configuration, performance characteristics.
- **Implementation**: what is inside.
- **Depth**: behaviour a caller or test gets per unit of interface it has to learn. Deep = a lot behind a small
  interface; shallow = an interface nearly as complex as what it hides.
- **Seam**: the place where behaviour can be changed without editing that place; where an interface lives.
  Choosing the seam is its own decision.
- **Adapter**: a concrete thing that fills the slot at a seam (a Postgres repository, an in-memory fake).
- **Leverage** (for callers): more capability per thing learned. **Locality** (for maintainers): change, bugs and
  knowledge concentrate in one place.

## Principles
- Depth is a property of the interface. A deep module may be built from small internal parts with their own
  internal seams for its own tests; they are just not part of the interface.
- **Deletion test**: imagine deleting the module. If complexity vanishes, it was a pass-through. If it reappears
  in every caller, it earned its keep.
- **The interface is the test surface**: callers and tests cross the same seam. Wanting to test past it means the
  module has the wrong shape.
- **One adapter = a hypothetical seam; two adapters = a real one.** Do not add a seam for variation nobody has.
- When shaping an interface ask: fewer methods? simpler parameters? more hidden inside?

## Designing for testability
1. Accept dependencies instead of constructing them inside.
2. Return results instead of mutating arguments or producing side effects where possible.
3. Keep the surface small: fewer methods and parameters mean fewer tests and simpler setup.

## Design it twice
For an interface that many callers will depend on, produce three or more radically different designs before
choosing (in parallel with subagents if available, each given one constraint):
- minimise the interface (1-3 entry points, maximum leverage each);
- maximise flexibility (many use cases, extension);
- make the most common caller trivial;
- ports and adapters for dependencies that cross the seam.
For each: the interface (types, invariants, errors), a usage example, what it hides, its dependency strategy and
its trade-offs. Compare on depth, locality and seam placement, recommend one (or a hybrid), and say why.

## Words to avoid
"Boundary" (collides with DDD's bounded context: say seam or interface); "interface" meaning only a language
keyword or a class's public methods (too narrow); depth as a ratio of implementation lines to interface lines
(rewards padding).
