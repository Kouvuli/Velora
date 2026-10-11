# Component APIs that scale

Written for this Skill OS from the ideas in Vercel's `composition-patterns` skill (vercel-labs/agent-skills; ideas
only, in our own words - that repository ships no license file).

- **No boolean props for variants.** `isCompact`, `isPrimary`, `hideHeader` multiply into combinations nobody
  tests. Make explicit variant components (`<CompactCard>`, `<PrimaryButton>`) or composable parts.
- **Compound components** for complex widgets: `<Tabs>`, `<Tabs.List>`, `<Tabs.Panel>` sharing state through
  context, so callers arrange the parts instead of passing configuration.
- **The provider owns the state.** Only the provider knows how state is stored; consumers see a small interface
  (state, actions, metadata). Lift state into a provider when siblings need it.
- **Children over render props** for composition; render props only when the child genuinely needs the parent's
  data at render time.
- **React 19**: `ref` is an ordinary prop (no `forwardRef`); `use(Context)` can replace `useContext`.

Use these when building a component library or refactoring a component that has grown a long list of flags; for a
one-off component the simplest props are fine (`simplicity-guard`).
