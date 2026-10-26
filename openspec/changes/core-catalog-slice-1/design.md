# Design

## Context

- **Token generator types.** `scripts/build-tokens.mjs` resolves aliases into final per-mode values and supports these types: `color` (with alpha), `dimension`, `duration`, `fontFamily`, `cubicBezier` and `number`. It has no font-weight or shadow types, and `docs/ARCHITECTURE.md` lists composite shadows as unsupported.
- **Theme context.** `ThemeContext` is defined in `Dialog.tsx` and provided by `Theme.tsx`. `DialogContent` re-applies the theme on the portaled content but not on the overlay. The overlay therefore resolves custom properties from `:root` (light) even inside a dark Theme. A tokenized scrim would always be light unless the overlay is themed too.
- **Field wiring.** `TextField.tsx` builds its own label, description and error IDs inline. Field composition can be extracted from that, and `tests/package.test.mjs` pins TextField's markup.
- **Build externals.** `packages/react/build.mjs` lists each Radix package by name, and each new one would need adding by hand.
- **Design mappings.** `tests/design-mappings.test.mjs` compares the committed `design-mappings.json` against a regeneration from the catalog. Any token addition makes that test fail until `npm run design:map` runs.
- **Fonts.** Storybook loads the ABC Areal variable font (wght 400–700), so intermediate weights render correctly there.

## Goals / Non-Goals

**Goals:**
- Every value a theme or brand pass would change reaches components through a semantic token.
- Field composition is shared, so later controls (Radio, Switch, TextArea and the rest) reuse it without new wiring.
- Portaled surfaces have a single, reusable way to stay themed.

**Non-Goals:**
- No visual redesign: new components use the current provisional palette and geometry.
- No mapping of the new tokens into Sketch or Figma. They appear in each tool's `unsupported.tokens` list until a later sync.
- No static lint for raw values beyond the targeted test described below.

## Decisions

### Generator gains `fontWeight` and `shadow` types
- **`fontWeight`.** Add DTCG `fontWeight` (numeric 1–1000) and emit it as a bare number. Using `number` would lose the type in the catalog, and agents and design tools key off `$type`.
- **`shadow`.** Add DTCG `shadow`: an object with `color`, `offsetX`, `offsetY`, `blur` and `spread`. The colour may be an alias, resolved per mode like any other alias, and the token is emitted as a CSS `box-shadow` value. This removes the documented "shadows not supported" gap.
- **Alternative rejected:** a raw-string `boxShadow` token, because it can't alias the palette or vary by mode.

### Token vocabulary
- **Font weight:** `font.weight.regular` (400), `font.weight.medium` (500), `font.weight.strong` (600).
- **Focus ring:** `focus.ring.width` (2px) and `focus.ring.offset` (3px). The colour stays `color.focus.ring`.
- **Scrim:** `color.overlay.scrim`, ink at 45% alpha for light. The dark mode override is near-black at 60%, so the scrim still reads against a dark canvas. These need new reference colours with alpha, because `modes.json` overrides by alias.
- **Elevation:** `elevation.floating`, a shadow whose colour aliases a new reference shadow colour per mode.
- **Values:** today's raw values are kept wherever they exist (600, 2px, 3px, 0.45 and the existing shadow), so light mode is unchanged. Two dark-mode values change on purpose: the floating shadow deepens to 0.5 alpha, and the scrim becomes 0.6 once the overlay is themed.

### Theme context moves to `ThemeContext.tsx` with a `usePortalTheme` helper
- `Dialog.tsx` re-exports `ThemeContext` for compatibility.
- Each portaled component spreads `data-agency-theme` onto its portaled root through the helper. Dialog gets it on the overlay as well as the content.
- **Alternative rejected:** a Theme-owned portal container. It changes where portals mount, which Radix handles well today and consumers may rely on.

### Field is a component with context, not a hook-only API
- `Field` renders the label, description and error and generates the IDs. It provides `{ controlId, labelId, describedBy, invalid }` through a context.
- Controls consume that context: native inputs get `id`, while button-based triggers (Select, Checkbox) get `aria-labelledby`, because a `<label for>` doesn't name a `<button>` reliably across assistive technology.
- TextField becomes `Field` plus a native input. Its rendered IDs (`<id>-description`, `<id>-error`) and class entry point on the root stay the same.
- **Alternative rejected:** a hook-only API. Consumers would then have to place label and description markup themselves, which is the drift the shared component is meant to prevent.

### Component APIs follow the Dialog pattern: thin wrappers over Radix parts
- **What is exported:** each component exports named parts, e.g. `SelectRoot`/`Select` and `TabsRoot`, `TabsList`, `TabsTrigger`, `TabsContent`.
- **Prop surface:** the parts keep Radix's prop surface plus the agency-specific props.
- **Field integration:** Checkbox and Select also get a labelled convenience form (`<Checkbox label=… />`, `<Select label=… options=…>`) built on Field, because that is the common case and it keeps contracts small.
- **Variants:** DropdownMenu items accept `tone="danger"`. No other variants are added in this slice.
- **className:** it attaches only at documented roots and parts, as with the existing components.

### Externals become a pattern
`build.mjs` marks `@radix-ui/*` as external, so new primitives don't need a build edit.

### Raw-value guard is a focused test
A Node test scans `packages/react/src/*.module.css` for literal values in the tokenized properties named in the foundations spec. The broader static enforcement listed in `rules.json` stays planned.

## Risks / Trade-offs

- **[Package size]** Five new Radix packages and their shared dependencies grow the install. → Radix is external and tree-shaken by consumers. Record the packed size in `test:distribution` output and revisit in Stage 3's size budget.
- **[Composite token support in tools]** Sketch and Figma can't map `shadow` directly. → The new tokens appear in each tool's unsupported list. Figma effect styles can map later.
- **[ID stability]** Field must use `useId`, so IDs match between server and client renders. → Covered by the existing server-render test plus a Field assertion.
- **[Select in forms]** Radix Select renders a hidden native select for form submission. Older Radix versions had autofill quirks. → Pin a current version and assert `FormData` in a browser test.
- **[Weights without the variable font]** Weight 500 or 600 falls back to synthetic or nearest weights where consumers load static files. → Documented in the token description; consumers decide what to load.

## Migration Plan

- **Additive for consumers.** Existing imports and props are unchanged.
- **Inside the repo:**
  1. Ship the tokens and generator first, then theme context, then Field, then the components.
  2. Run `npm run design:map` after the token change so the mapping test passes.
- **Rollback:** revert the change. No consumer data or persisted state is involved.
