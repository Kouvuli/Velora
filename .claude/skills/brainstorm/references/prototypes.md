# Throwaway prototypes

Adapted from Matt Pocock's `prototype` skill (mattpocock/skills, MIT, `../licenses/matt-pocock.LICENSE`), condensed
and reworded.

A prototype is throwaway code that answers one question. The question decides its shape:
- **"Does this logic / state model hold up?"** - a single self-contained page or script that pushes the model
  through the hard cases (free-play controls plus guided walkthroughs) and that a non-developer can drive.
- **"What should this look like?"** - several radically different variants on one route, switchable by a URL
  parameter or a small toolbar, built with the project's own components.

If the question is ambiguous and nobody can be asked, pick the branch that matches the surrounding code (backend
module -> logic, page or component -> UI) and state the assumption at the top of the prototype.

## Rules
1. **Throwaway from the start and named so**: next to where it would be used, obviously marked as a prototype,
   following the project's routing and file conventions.
2. **One command to run** (the project's task runner, or a file to double-click).
3. **No persistence** unless persistence is the question; then a scratch database or file named as disposable.
4. **No polish**: no tests, no error handling beyond what makes it run, no abstractions.
5. **Show the state** after every action or variant switch, so the user sees what changed.
6. **Keep the verdict, not the code**: record the question and the answer (ticket, decision record in
   `.ai/knowledge/decisions/`), keep the prototype on a throwaway branch if it is worth referring to, and let only
   the validated decision reach the main branch.
