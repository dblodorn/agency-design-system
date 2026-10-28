# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Read `AGENTS.md` before changing anything. It holds the binding working rules: Radix/native HTML only, CSS Modules, no Tailwind or Reshaped dependency, semantic tokens only, no font files without a license, and keep contracts, stories, tests and docs in step with behavior. `docs/PROJECT_PLAN.md` sets the current stage. The other docs are `docs/ARCHITECTURE.md`, `docs/COVERAGE.md` (planned vs. experimental components) and `docs/DESIGN_INTEGRATIONS.md` (Sketch/Figma plans; nothing is connected).

## Commands

Use npm (npm workspaces, committed `package-lock.json`) and Node 22.12 or later. CI runs on Node 24.

```sh
npm ci
npm run tokens            # regenerate packages/tokens/dist (tokens.css, catalog.json)
npm run build             # tokens + @agency/react (esbuild bundle + tsc declarations)
npm run storybook         # dev server on :6006
npm run typecheck         # root tsc --noEmit
npm test                  # build, then node --test tests/*.test.mjs
npm run check             # typecheck + test + static Storybook build (the required gate)
npm run test:browser      # Playwright against storybook-static/ (run `check` first)
npm run test:distribution # npm pack all four packages, install them in a temp app, render + MCP handshake
npm run mcp               # start the stdio MCP server (stdout is protocol only)
```

- Single Node test file: `npm run build && node --test tests/tokens.test.mjs`. Add `--test-name-pattern "<name>"` to run one test.
- Single browser test: `npx playwright test tests/browser/components.spec.ts -g "<title>"`. Run `npx playwright install chromium` once first. Playwright serves the **built** `storybook-static/` through `scripts/serve-storybook.mjs`, not the dev server, so rebuild Storybook after changing components.
- CI (`.github/workflows/check.yml`) runs `check`, then `test:browser`, then `test:distribution`. Run `test:browser` too for any interaction change.

## Architecture

Four workspace packages under `packages/`. All are versioned `0.1.0` and must stay in step:

- **`@agency/tokens`**: `src/tokens.json` holds DTCG-style tokens (`$type/$value/$description/$extensions["org.agency"]`), and `src/modes.json` holds per-mode overrides keyed by exact token ID. This is an internal format, not DTCG modes. `scripts/build-tokens.mjs` (at the repo root, not in the package) flattens the tree, resolves `{alias}` references (and fails on cycles, missing targets or type mismatches), then writes:
  - `dist/tokens.css`: `--agency-<id-with-dashes>` variables on `:root`/`[data-agency-theme="light"]`, a fully re-resolved block for each mode, and a `prefers-reduced-motion` block that sets every duration to 0ms.
  - `dist/catalog.json`: the machine catalog, with resolved values for each mode. Its `release` is hardcoded in the build script.
  `reference.*` tokens are the internal palette. Components and consumers use only semantic tokens.
- **`@agency/react`**: `src/*.tsx` plus `*.module.css`. `build.mjs` bundles with esbuild (`local-css` loader, `"use client"` banner, React and Radix external) into `dist/index.js` + `dist/index.css`, and `tsc -p tsconfig.build.json` emits the declarations. Consumers import `@agency/tokens/css` and `@agency/react/styles.css` explicitly. Nothing injects fonts or resets.
  - Theming: `<Theme mode>` sets `data-agency-theme` and provides `ThemeContext` (defined in `Dialog.tsx`). `DialogContent` reads that context and re-applies the theme inside its Radix Portal, because portaled content would otherwise lose the scoped theme. Any new portaled component needs the same treatment.
- **`@agency/catalog`**: `components.json` holds the per-component contract (imports, allowed props, example, rules, slots, required styles, status), `rules.json` holds agent and design rules, and `design-mappings.json` holds empty placeholders for Sketch/Figma. These are release artifacts. Update them when component APIs change.
- **`@agency/mcp`**: `src/server.mjs`, a read-only stdio MCP. It loads the catalogs through package resolution (`require.resolve('@agency/...')`), not checkout paths, so it works when installed elsewhere. It throws on startup if the release values in the tokens, components and rules catalogs disagree, and it rejects requests for any other release. It exposes the tools `get_system`, `get_component` and `find_tokens`, and the resources `agency://system/<release>/{rules,components}`. It needs `npm run tokens` first.

The root `stories/` folder and `.storybook/` are the demo and visual reference. `preview.tsx` imports components from **source** (`packages/react/src`), wraps every story in `<Theme>` with a light/dark toolbar toggle, and sets the a11y addon to fail on violations. Stories show the components; they are not a second implementation.

Tests in `tests/*.test.mjs` cover token resolution, the **built** `@agency/react` export rendered through `react-dom/server` (which is why `npm test` builds first), and the MCP protocol through the SDK client. `tests/browser/` covers keyboard focus, portal theming, field associations, reduced motion, and axe checks on the dialog.

## Gotchas

- `dist/` and `storybook-static/` are generated and gitignored. Never hand-edit them.
- A release bump touches every workspace `package.json`, inter-package dependency versions, `release` in each catalog JSON, and the hardcoded `release` in `scripts/build-tokens.mjs`.
- Packages are `UNLICENSED`, and publishing is not configured. Don't publish, and don't connect design tools or edit consuming apps from this repo.
- All components are `experimental`. Planned components (see `docs/COVERAGE.md`) must never be imported or described as implemented.
