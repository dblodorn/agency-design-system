# Proposal

## Why

Stage 2 of `docs/PROJECT_PLAN.md` builds the core component catalog. The system currently ships four experimental components, and their CSS still hardcodes four values that no token covers: Button's `font-weight: 600`, the Dialog scrim, the Dialog shadow and the 3px focus offset. A stylistic pass applied on top of these components can only work through tokens, so the raw values have to become tokens before more components copy them. This change is the first vertical slice from the plan's "Next implementation slice": foundations, field composition, Checkbox, Select, Tabs, Popover and menus.

## What Changes

- **Foundation tokens.** Add semantic tokens for font weight (regular, medium, strong), focus ring width and offset, the overlay scrim (light and dark), and the elevation used by floating surfaces. Replace every raw value in the existing component CSS with these tokens.
- **Shared portal theming.** Move the theme context out of `Dialog.tsx` into its own module. Every portaled surface, the Dialog overlay included, re-applies the trigger tree's theme so that the scrim and floating surfaces resolve in the correct mode.
- **Field composition.** Add a `Field` component that owns label, description, error and their ID associations for any control. TextField is re-implemented on Field, and its public API and markup contract stay unchanged.
- **New experimental components:**
  - `Checkbox` (Radix Checkbox, with label and description through Field, and an indeterminate state)
  - `Select` (Radix Select, labelled through Field)
  - `Tabs` (Radix Tabs)
  - `Popover` (Radix Popover)
  - `DropdownMenu` (Radix Dropdown Menu, covering items, separators, labels and a disabled state)
- **Contracts, stories, tests and docs.** Update `components.json`, the rules limitations, `docs/COVERAGE.md`, Storybook stories, the server-render tests, the browser tests (keyboard, portal theme and axe) and the design-mapping generator's list of raw values.
- **Not BREAKING.** The existing component APIs do not change. `ThemeContext` keeps being re-exported from its current module path.

## Capabilities

### New Capabilities
- `tokens/foundations`: semantic tokens for font weight, focus ring geometry, scrim and elevation, and the rule that component CSS may not use raw values for these roles
- `components/portal-theming`: portaled content (Dialog, Popover, Select, DropdownMenu) carries the scoped theme of its trigger tree
- `components/field`: label, description and error composition with ID associations for any form control
- `components/checkbox`: checkbox behavior, states and field association
- `components/select`: single-value select behavior, keyboard support and field association
- `components/tabs`: tab list and panel behavior with keyboard navigation
- `components/popover`: anchored non-modal floating content with dismissal and focus management
- `components/dropdown-menu`: action menu behavior, keyboard navigation and item states

### Modified Capabilities
- None. `openspec/specs/` is empty; existing behavior was never captured as specs.

## Impact

- **Tokens** (`packages/tokens/src/tokens.json`, `modes.json`): new token IDs and a dark override for the scrim. These are additive, but the catalog changes, so the design-tool inventories are regenerated and the Sketch/Figma unsupported lists shrink.
- **React** (`packages/react`):
  - Dependencies: adds `@radix-ui/react-checkbox`, `react-select`, `react-tabs`, `react-popover` and `react-dropdown-menu`.
  - Build: `build.mjs` externals move to an `@radix-ui/*` pattern.
  - Package size: grows, so measure it in `test:distribution`.
- **Catalog and MCP:** `components.json` gains six contracts. `rules.json` limitations update. The MCP tests still pass, because the tool and resource counts don't change.
- **Storybook:** a story file per new component.
- **Tests:**
  - Server-render tests: new assertions.
  - Browser tests: new specs for keyboard, theme and axe.
  - Distribution: the fixture keeps rendering Button and stays unchanged.
- **Out of scope:** the remaining Stage 2 rows of `docs/COVERAGE.md` (Radio, Switch, TextArea, Tooltip, Toast and the rest), Context Menu, combobox/date/number engine evaluations, application shell and form recipes, and the variable-font `DRKM` axis.
