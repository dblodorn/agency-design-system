# Sketch first, Figma later

Status: experimental token spike in both tools; no components mapped yet.

## Authority

Approved token/component contracts live in the repository. Design-tool exploration can propose changes. Adapters never silently overwrite unreviewed design work. Symbols/variables use stable tool IDs mapped to canonical system IDs, not names alone. Each mapping includes release, supported props/overrides, and unsupported differences.

## Mapping workflow

Assets are created in each tool through its MCP (Sketch `run_code`, Figma `use_figma`). The IDs they return are recorded as inventories: design/sketch/inventory.json (with the tool file design/sketch/agency.sketch) and design/figma/inventory.json (the file lives in Figma). `npm run design:map` joins the inventories with the built token catalog and regenerates packages/catalog/src/design-mappings.json. It fails on unknown assets or Sketch colour drift. tests/design-mappings.test.mjs fails when the committed mappings no longer match, so a token change must be mirrored in the tools and re-inventoried.

Findings from the spike:

- Sketch Color Variables have no modes, so each semantic colour exists once per mode under a light/ or dark/ prefix. Shared layer styles do not carry corner radii, and spacing, radius and size tokens have no Sketch equivalent. The document ID changes on Save As; asset IDs are stable.
- Figma Variables carry Light/Dark modes, number variables for spacing, radius and sizes, and WEB code syntax. On the Professional plan Code Connect and the REST Variables API are unavailable.
- ABC Areal is not in Figma's cloud font set. Remote writes can bind text styles to font variables (the first bind fails; a retry succeeds) but cannot create text layers in it. Sketch runs locally and uses the installed fonts.

## Sketch milestone

1. Confirm installed Sketch edition/version and font rights. Built-in MCP requires 2025.2.4+ outside the Mac App Store distribution.
2. Enable Sketch's local MCP and connect it separately from our read-only system MCP.
3. Inspect an explicitly selected document/Library; create a new agency Library when authorized.
4. Map colors, text/layer styles and Symbols. Normalize supported exports; do not assume native JSON equals our DTCG schema.
5. Prove Button, TextField, Dialog and a representative screen against Storybook.
6. Report unknown styles, detached assets, unsupported values and release drift.

Sketch MCP: https://www.sketch.com/docs/mcp-server/
Token exports: https://www.sketch.com/docs/developer-handoff/export/
Sketch API: https://developer.sketch.com/reference/api/

## Figma milestone

Map canonical tokens into Variables and styles, components into stable node identities, and props into Code Connect. Confirm plan and API access before selecting write automation. Both tools share canonical IDs, but each retains its own adapter and identity mapping.

Code Connect: https://developers.figma.com/docs/code-connect/

## Fidelity boundary

Storybook owns executable keyboard, responsive and motion behavior. Design tools communicate visual composition and intended states. A static symbol cannot fully encode runtime accessibility, media playback or bespoke motion. Unsupported behavior must be documented, not silently approximated.
