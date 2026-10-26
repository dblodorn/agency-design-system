# Sketch first, Figma later

Status: planned; no live connection or synchronized assets.

## Authority

Approved token/component contracts live in the repository. Design-tool exploration can propose changes. Adapters never silently overwrite unreviewed design work. Symbols/variables use stable tool IDs mapped to canonical system IDs, not names alone. Each mapping includes release, supported props/overrides, and unsupported differences. Empty schema placeholders live in packages/catalog/src/design-mappings.json.

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
