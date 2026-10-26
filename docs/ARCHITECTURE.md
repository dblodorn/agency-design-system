# Architecture

## Packages

- @agency/tokens: typed source, generated CSS and resolved machine catalog.
- @agency/react: native/Radix components, declarations and compiled CSS.
- @agency/catalog: release-specific contracts, rules and planned design mappings.
- @agency/mcp: read-only stdio discovery of installed contracts. Does not depend on the checkout layout.

Future @agency/charts, @agency/media and @agency/expression remain separate to isolate heavy dependencies. A root Storybook demonstrates the packages.

## Tokens

DTCG leaf fields: $type, $value, $description, $extensions. Color values use srgb components; dimensions and durations have explicit units. Aliases use brace references. Current generator supports color, dimension, duration, fontFamily, fontWeight, cubicBezier, number and shadow (a shadow's color may alias a color token and resolves per mode); composite typography is not supported yet. Alias cycles, type mismatches and missing references fail the build. Full DTCG schema validation is planned.

org.agency metadata contains status, public/internal use, constraints and reduced-motion guidance. modes.json is a separate internal adapter format keyed by exact token ID. It is not represented as standardized DTCG modes. Every token resolves under each mode; CSS variables are generated with the agency prefix. Density, recipes and complete font-role contracts are future work.

## Versioning

0.1.0 is an experimental local baseline. Packages and catalog release values move together. MCP serves one installed release and rejects other requested versions. Static catalog is the offline fallback. No remote registry, authentication, write tools or release automation is implemented.

## React and styling

Initial React support is 19+. esbuild and TypeScript emit ESM, declarations and compiled CSS Modules. Consumers import tokens and styles explicitly. The entry carries use client to preserve interactive safety in RSC apps; server-only exports are future work. Theme context propagates explicit light/dark mode into portaled dialogs. The system does not load fonts or inject resets globally. Consumers load their own ABC Areal / ABC Areal Mono files; Storybook's preview loads WOFF2 copies from .storybook/fonts/.

## Quality

Node tests validate token resolution, built package semantics and MCP handshake/resources/tools. Playwright exercises real Storybook interactions and axe checks for the dialog. Packed tokens, React, catalog and MCP are verified in a separate temporary application, including CSS mapping and protocol startup. Next: schema checks, contract drift, visual baselines and an SSR/hydration fixture.
