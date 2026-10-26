# Tasks

## 1. Token generator and foundation tokens

- [x] 1.1 Add `fontWeight` and `shadow` types to `scripts/build-tokens.mjs`. Shadow colour aliases resolve per mode, and the token is emitted as a `box-shadow` value. Verify with new cases in `tests/tokens.test.mjs`: a shadow with an aliased colour resolves differently in light and dark, and a type mismatch on the shadow colour throws.
- [x] 1.2 Add `font.weight.regular|medium|strong`, `focus.ring.width|offset`, `color.overlay.scrim` and `elevation.floating`. Add their reference colours, the dark overrides in `modes.json`, and descriptions and metadata. Verify that `npm run tokens` emits the `--agency-font-weight-*`, `--agency-focus-ring-*`, `--agency-color-overlay-scrim` and `--agency-elevation-floating` custom properties in both modes, and that the token metadata test passes.
- [x] 1.3 Update `docs/ARCHITECTURE.md` (supported token types, shadows now supported) and run `npm run design:map`. Verify that `tests/design-mappings.test.mjs` passes and that the new tokens appear in both tools' `unsupported.tokens`.

## 2. Remove raw values from existing components

- [x] 2.1 Replace Button's `font-weight: 600`, every focus `outline`/`outline-offset`, the Dialog overlay background and the Dialog box-shadow with the new tokens. Verify there are no visual changes in the light and dark Storybook screenshots of Button, TextField and Dialog compared with `main`.
- [x] 2.2 Add a Node test that scans `packages/react/src/*.module.css` for literal `font-weight`, `outline` width/offset, `box-shadow` and overlay `background` values. Verify that it fails on a temporary literal and passes on the cleaned CSS.
- [x] 2.3 Remove the four raw-value entries from `rawValuesInComponentCss` in `scripts/map-design-tools.mjs` and regenerate the mappings. Verify that `npm test` passes.

## 3. Portal theming

- [x] 3.1 Move `ThemeContext` into `ThemeContext.tsx` with a `usePortalTheme` helper, re-export it from `Dialog.tsx`, and update `Theme.tsx`. Verify that `npm run typecheck` passes and that the existing dialog browser test still passes.
- [x] 3.2 Apply the portal theme to the Dialog overlay. Verify with a browser test that the overlay has `data-agency-theme="dark"` and the dark scrim colour inside a dark Theme.

## 4. Build and dependencies

- [x] 4.1 Change `packages/react/build.mjs` externals to `@radix-ui/*`, and add `@radix-ui/react-checkbox`, `react-select`, `react-tabs`, `react-popover` and `react-dropdown-menu` to `@agency/react` dependencies. Verify that `npm ci` and `npm run build` succeed and that `dist/index.js` contains no inlined Radix code.

## 5. Field composition

- [x] 5.1 Implement `Field` and its context (label, description, error, generated or caller IDs, `aria-labelledby` support for non-labelable controls). Verify with server-render assertions for full association, label-only output and a caller-supplied `id`.
- [x] 5.2 Re-implement TextField on Field. Verify that the existing TextField server-render assertion and the "invalid field" browser test pass unchanged.

## 6. Components

- [x] 6.1 Checkbox: checked, unchecked and indeterminate; disabled; label, description and error through Field; form value. Verify with browser tests for Space toggle, label click, `aria-checked="mixed"`, the error description and FormData `terms=on`, plus axe.
- [x] 6.2 Select: Field labelling, placeholder, groups, disabled options, portal theme and elevation. Verify with browser tests for keyboard selection, Escape restoring focus, skipping a disabled option, the dark listbox theme and FormData `currency=EUR`, plus axe.
- [x] 6.3 Tabs: horizontal and vertical orientation, automatic and manual activation, disabled tab. Verify with browser tests for arrow, Home and End navigation, manual activation and ARIA selection state, plus axe.
- [x] 6.4 Popover: trigger ARIA, focus in and out, Escape and outside dismissal, portal theme, elevation and reduced motion. Verify with browser tests for each behaviour, plus axe.
- [x] 6.5 DropdownMenu: items, labels, separators, disabled and `tone="danger"`, portal theme and elevation. Verify with browser tests for keyboard open, arrow and typeahead navigation, a single onSelect call, Escape, the disabled item and the danger colour, plus axe.
- [x] 6.6 Export all new parts from `packages/react/src/index.ts`. Verify with server-render tests that import each component from the built `@agency/react` and render its static markup.

## 7. Contracts, stories and docs

- [x] 7.1 Add Field, Checkbox, Select, Tabs, Popover and DropdownMenu contracts to `packages/catalog/src/components.json` (imports, props, example, rules, slots, styles, status experimental). Verify that the MCP test passes and that `get_component` returns each new ID.
- [x] 7.2 Update `rules.json` limitations and `docs/COVERAGE.md` (Checkbox, Select, Tabs, Popover and Dropdown menu become Experimental; Field becomes an experimental supporting utility). Verify by reviewing the diff; no planned component is described as implemented.
- [x] 7.3 Add a Storybook story file per new component, covering light and dark and each spec scenario's state. Verify that `npm run build:storybook` succeeds with the a11y addon reporting no violations.

## 8. Integration

- [ ] 8.1 Run `npm run check`, `npm run test:browser` and `npm run test:distribution` and record the packed `@agency/react` size. Verify that all three pass locally and in CI on the PR.
