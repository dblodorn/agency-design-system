# Project plan

## Outcome

A branded, agent-friendly application design system for an agency moving into software: precise enough for accounting, expressive enough for creative media. Independent React applications consume versioned packages. Storybook is the visual reference; MCP and offline catalogs expose the same release-specific contracts.

## Decisions

- Radix Primitives plus native HTML; selected specialist engines fill actual gaps.
- CSS Modules and semantic custom properties. Consumers need no Tailwind tooling.
- Reshaped is a coverage and quality benchmark, not a source-code donor or dependency.
- DTCG token source plus separately documented agency metadata and mode mappings.
- Sketch first; Figma later. Explicit design/code identity mappings and controlled change proposals.
- Working name and @agency namespace are provisional. Brand direction, fonts and licensing remain open.

## Stage 0 — Working foundation (verified)

Implemented: npm workspaces; token generator; four experimental component contracts; Storybook; read-only stdio MCP; project instructions; tests. Verified: TypeScript, static Storybook, four source/protocol/package tests, three browser checks, and installation of all four packed packages in an independent temporary app. Keep theme provisional.

## Stage 1 — Prove the design language

Obtain agency identity, licensed fonts and 3–5 visual references. Approve interface, display, reading, numeric and mono roles. Expand status, chart, material, density and component tokens. Add density/viewport/motion workbench controls and visual regression baselines.

Deliver three comparable art-direction specimens: dense reporting, media controls, expressive editorial. Exit: recognizable shared identity with real content in light/dark, keyboard and reduced-motion modes.

## Stage 2 — Core catalog

Implement docs/COVERAGE.md core rows in functional groups. Evaluate combobox, date/number input and resizable engines before locking public APIs. Complete component states, controlled/uncontrolled behavior, slots and accessible compositions. Add application shell and form recipes.

Exit: all target core components documented and tested; two independent consumer apps use packed packages; SSR/hydration and React compatibility verified.

## Stage 3 — Data and media

Evaluate chart and data-table engines using real reports; separate spreadsheet-grid requirements. Build branded charts, filters, date ranges and financial display/entry. Build media controls with captions, seeking and keyboard support; evaluate waveform/timeline engine separately.

Exit: functional reporting and media prototypes, accessible data alternatives, explicit formatting/precision boundaries, measured package sizes.

## Stage 4 — Sketch integration

Connect the local Sketch MCP; author a Library and map symbols/styles to system IDs. Prove tokens + Button + TextField + Dialog + a screen. Adapter handles only supported values; emits drift reports for changes and unsupported mappings. Changes are proposed and reviewed, not silently overwritten.

Exit: repeatable synchronization, stable identities, version metadata and visual comparison. See DESIGN_INTEGRATIONS.md.

## Stage 5 — Distribution and agent reliability

Choose private registry, package scope and ownership. Automate synchronized releases, changelogs, migrations, CI preview Storybooks and packed-package consumer checks. Publish MCP/offline catalogs with matching releases. Validate schemas, contract drift, deprecated imports and restricted raw values; support scoped exceptions.

Exit: two independently deployed apps can upgrade separately; agents retrieve matching APIs and refuse unsupported capabilities. Initial packed installation and MCP handshake are verified outside the monorepo; add persistent consumer fixtures and upgrade coverage.

## Stage 6 — Expression and Figma

Develop curated signature motion and layout recipes. Add Figma Variables/components mapping and Code Connect, checking account/API eligibility first. Keep runtime motion reference in Storybook.

## Next implementation slice

1. Approve brand input and token vocabulary.
2. Add automated contract/token schemas and generated API validation.
3. Expand foundations, Checkbox, Select, Tabs, Popover, menus and field composition.
4. Establish two packed-package consumer fixtures.
5. Connect Sketch and prove the smallest mapped library.

## Open decisions

Agency name/identity; registry/GitHub owner; font licenses; consumer React versions; dense-grid requirements; charts beyond standard SVG; media streaming formats; supported languages; public vs proprietary licensing.

## Risks and controls

Broad scope: implement in vertical slices and expose honest statuses. Creative drift: shared semantic roles plus explicit expression briefs. Agent hallucination: exact catalogs, unknown-component errors and local checks. Sync loss: stable mappings and reviewed proposals. Dependency weight: optional data/media packages. Accessibility: primitive behavior plus application-level manual testing.
