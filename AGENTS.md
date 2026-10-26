# Agent instructions

Read README.md and docs/PROJECT_PLAN.md first. Use npm and the committed lockfile.

## Source of truth

- Tokens: packages/tokens/src/tokens.json (DTCG-style typed tokens); modes.json is our adapter-specific override format.
- Contracts: packages/catalog/src/components.json and rules.json.
- Implementation: packages/react/src. Stories are examples, not an alternative component library.
- All current components are experimental. Never import or describe planned components as implemented.

## Working rules

1. Inspect contracts and existing components before implementing. Use semantic CSS variables; reference palette tokens are internal.
2. Radix owns applicable interaction semantics. Native HTML is preferred for simple controls. No required Tailwind or Reshaped dependency.
3. Keep component props small, typed and composable. Refs must reach the appropriate element. No business logic or currency arithmetic in UI components.
4. CSS Modules own component styles. className attaches only at documented roots. Internal selectors are private; add explicit slots when needed.
5. Themes must survive portals; motion must respect reduced-motion preferences. Preserve labels, descriptions, keyboard behavior and focus restoration.
6. Do not add or redistribute font files without an established license. Starter font roles and palette are provisional.
7. Update contracts, stories, tests and docs with behavior changes. Do not hand-edit generated dist files.
8. Bespoke work requires a short brief: purpose, permitted departures, reduced-motion behavior and extension rationale. Shared additions need repeatable use.
9. Do not edit arbitrary consuming apps or connect design tools as a side effect of work in this repo.

## Checks

Run npm run check. For interaction changes run npm run test:browser as well. Add tests for behavior and integration boundaries, not implementation mirroring.

## Release contract

Keep workspace package versions, catalog release fields and token catalog release aligned. Publishing is not configured. Packages are UNLICENSED/private-use until an owner chooses terms; do not publish without authorization. Agent metadata and design mappings are release artifacts.
