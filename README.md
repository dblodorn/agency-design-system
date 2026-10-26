# Agency design system

Working name. A React system for precise application interfaces and expressive agency experiences. Radix Primitives, CSS Modules, semantic tokens, Storybook and a release-scoped MCP interface. No Tailwind requirement.

## Start

Requires Node 22.12+ and npm. Use `npm ci` after cloning.

```sh
npm install
npm run build
npm run storybook
```

Storybook: http://localhost:6006. Tokens and component CSS are explicit imports. Typography and color are provisional, not approved agency branding.

## Current implementation

- Typed token source with alias validation, light/dark generation and reduced-motion durations.
- Experimental Button, TextField, Radix Dialog and scoped Theme.
- Storybook overview, tokens, controls, variants and dialog interaction.
- Read-only MCP: get_system, get_component, find_tokens; versioned rules/component resources.
- Agent contracts, source tests, built-package rendering test, MCP protocol test and browser checks.

Charts, media, full component coverage, publishing automation, static design-rule linting, Figma and Sketch synchronization are planned. No design-tool connection or remote repository has been created.

## Independent application usage

Packages are local workspaces today. For a registry-independent test, run `npm run build`, then `npm pack --workspace @agency/tokens` and `npm pack --workspace @agency/react`. Install both tarballs in a React 19 application. Tokens and React package versions must match.

```tsx
import '@agency/tokens/css';
import '@agency/react/styles.css';
import { Button, Theme } from '@agency/react';

export function App() {
  return <Theme mode="light"><Button>Save changes</Button></Theme>;
}
```

Consumers receive compiled JS, declarations and CSS; they do not need CSS Modules or the library's build tooling. The initial package is client-marked as a whole. Splitting static and interactive exports is a later RSC optimization.

## Verification

```sh
npm run check
npx playwright install chromium
npm run test:browser
npm run test:distribution
```

`check` validates TypeScript, tokens, installed package exports, the real MCP protocol, and the static Storybook build. Browser checks run against the static Storybook output from `check`. They cover keyboard focus restoration, dark dialog portals, field associations, reduced motion and dialog accessibility scanning. Automated checks do not replace manual assistive-technology review.

## MCP

Build tokens first. Launch `node /absolute/path/to/agency-design-system/packages/mcp/src/server.mjs` in an MCP client's stdio configuration. stdout is reserved for protocol messages. This server handles only its installed release; mismatches return an error. It does not modify files or manipulate Sketch.

See [project plan](docs/PROJECT_PLAN.md), [coverage](docs/COVERAGE.md), [architecture](docs/ARCHITECTURE.md), [design integrations](docs/DESIGN_INTEGRATIONS.md), and [agent instructions](AGENTS.md).
