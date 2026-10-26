import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
const readJson = (path) => JSON.parse(readFileSync(new URL(path, root), 'utf8'));
const mappingsPath = 'packages/catalog/src/design-mappings.json';

// Raw values in component CSS that no token covers. Neither design tool can map them until tokens exist.
export const rawValuesInComponentCss = [
  'Button font-weight: 600 (no font.weight token)',
  'Dialog overlay background rgb(0 0 0 / .45) (no scrim token)',
  'Dialog box-shadow 0 24px 80px rgb(0 0 0 / .2) (no elevation token)',
  'focus outline-offset: 3px (no token; not representable in Sketch)',
];

const hex = (v) => '#' + v.components.map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('') + Math.round(v.alpha * 255).toString(16).padStart(2, '0');
const splitMode = (name) => { const [mode, ...rest] = name.split('/'); return { mode, rest: rest.join('/') }; };
const tokensOf = (mapping) => (mapping.token ? [mapping.token] : mapping.tokens);
// reference.* is the internal palette; consumers never use it, so an unmapped reference token is not a gap.
const unmapped = (catalog, mappings) => { const mapped = new Set(mappings.flatMap(tokensOf)); return catalog.tokens.map((t) => t.id).filter((id) => !id.startsWith('reference.') && !mapped.has(id)); };

const sketchFontNote = 'Sketch takes the first family from the token fallback stack (ABC Areal / ABC Areal Mono), which must be installed locally';
const sketchTextRoles = {
  body: { tokens: ['font.family.interface', 'font.size.body', 'font.lineHeight.body', 'color.text.primary'] },
  'body-secondary': { tokens: ['font.family.interface', 'font.size.body', 'font.lineHeight.body', 'color.text.secondary'] },
  small: { tokens: ['font.family.interface', 'font.size.small', 'color.text.secondary'], notes: ['no line-height token for small; Sketch uses font default'] },
  title: { tokens: ['font.family.interface', 'font.size.title', 'color.text.primary'], notes: ['no line-height or weight token for title'] },
  display: { tokens: ['font.family.display', 'font.size.display', 'color.text.primary'], notes: ['no line-height or weight token for display'] },
  numeric: { tokens: ['font.family.numeric', 'font.size.body', 'font.lineHeight.body', 'color.text.primary'] },
};
const sketchLayerRoles = {
  'surface/canvas': { tokens: ['color.surface.canvas'] },
  'surface/panel': { tokens: ['color.surface.raised', 'color.border.default'], radius: 'radius.large', source: 'Dialog.content' },
  'control/field': { tokens: ['color.surface.raised', 'color.border.control'], radius: 'radius.small', source: 'TextField.input' },
  'control/field-invalid': { tokens: ['color.surface.raised', 'color.status.danger'], radius: 'radius.small', source: "TextField.input[aria-invalid='true']" },
  'action/primary': { tokens: ['color.action.primary.background'], radius: 'radius.small', source: "Button[data-variant='primary']" },
  'action/primary-hover': { tokens: ['color.action.primary.hover'], radius: 'radius.small', source: "Button[data-variant='primary']:hover" },
  'action/secondary': { tokens: ['color.surface.raised', 'color.border.control'], radius: 'radius.small', source: "Button[data-variant='secondary']" },
  'focus/ring': { tokens: ['color.focus.ring'], radius: 'radius.small', source: ':focus-visible outline', notes: ['outline-offset 3px has no Sketch equivalent; drawn as a 2px outside border'] },
};

// Joins a Sketch inventory (exported through the Sketch MCP) with the token catalog. Throws on unknown assets or colour drift.
export function mapSketch(inventory, catalog) {
  const byId = new Map(catalog.tokens.map((t) => [t.id, t]));
  const problems = [];
  const swatches = inventory.swatches.map((s) => {
    const { mode, rest } = splitMode(s.name);
    const token = rest.replace(/\//g, '.');
    const t = byId.get(token);
    if (!t) { problems.push(`unknown Sketch swatch ${s.name}`); return null; }
    if (hex(t.resolved[mode]) !== s.hex) problems.push(`${token} (${mode}) drifted: expected ${hex(t.resolved[mode])}, Sketch has ${s.hex}`);
    return { kind: 'swatch', sketchId: s.id, sketchName: s.name, token, mode };
  });
  const textStyles = inventory.textStyles.map((s) => {
    const { mode, rest } = splitMode(s.name);
    const role = sketchTextRoles[rest.replace(/^type\//, '')];
    if (!role) { problems.push(`unknown Sketch text style ${s.name}`); return null; }
    return { kind: 'textStyle', sketchId: s.id, sketchName: s.name, mode, tokens: role.tokens, notes: [sketchFontNote, ...(role.notes ?? [])] };
  });
  const layerStyles = inventory.layerStyles.map((s) => {
    const { mode, rest } = splitMode(s.name);
    const role = sketchLayerRoles[rest];
    if (!role) { problems.push(`unknown Sketch layer style ${s.name}`); return null; }
    const notes = [...(role.notes ?? [])];
    if (role.radius) notes.push(`${role.radius} is applied per layer; Sketch shared layer styles do not carry corner radii`);
    return { kind: 'layerStyle', sketchId: s.id, sketchName: s.name, mode, tokens: role.tokens, cssSource: role.source ?? null, notes };
  });
  if (problems.length) throw new Error(`Sketch mapping failed:\n${problems.join('\n')}`);
  const mappings = [...swatches, ...textStyles, ...layerStyles];
  return {
    document: inventory.document,
    documentId: null,
    libraryId: null,
    sketchVersion: inventory.sketchVersion,
    modeStrategy: 'Sketch Color Variables have no modes; each semantic token is duplicated per mode under a light/ or dark/ name prefix. The Sketch ID, not the name, is the identity.',
    mappings,
    unsupported: { tokens: unmapped(catalog, mappings), rawValuesInComponentCss },
  };
}

// Joins a Figma inventory (IDs returned by use_figma when the variables and styles were created) with the token catalog.
export function mapFigma(inventory, catalog) {
  const toToken = (name) => name.replace(/\//g, '.');
  const mappings = [
    ...Object.entries(inventory.refIds).map(([k, id]) => ({ kind: 'variable', figmaId: id, figmaName: 'color/' + k, collection: 'Reference', token: 'reference.color.' + k, modes: ['Value'] })),
    ...Object.entries(inventory.semIds).map(([k, id]) => ({ kind: 'variable', figmaId: id, figmaName: k, collection: 'Color', token: toToken(k), modes: ['Light', 'Dark'] })),
    ...Object.entries(inventory.dimIds).map(([k, id]) => ({ kind: 'variable', figmaId: id, figmaName: k, collection: 'Dimension', token: toToken(k), modes: ['Value'], ...(k === 'font/lineHeight/body' ? { notes: ['Figma binds pixels: 22.5 = font.size.body x 1.5; the code token is unitless'] } : {}) })),
    ...Object.entries(inventory.typIds).map(([k, id]) => ({ kind: 'variable', figmaId: id, figmaName: k, collection: 'Typography', token: toToken(k), modes: ['Value'], notes: ['First family of the code fallback stack'] })),
    ...inventory.textStyles.map((s) => ({ kind: 'textStyle', figmaKey: s.key, figmaName: s.name, tokens: s.tokens, notes: ['Typography only; text colour comes from color/text/* variables'] })),
  ];
  const known = new Set(catalog.tokens.map((t) => t.id));
  const unknown = mappings.flatMap(tokensOf).filter((t) => !known.has(t));
  if (unknown.length) throw new Error(`Figma mapping references unknown tokens: ${unknown.join(', ')}`);
  return {
    fileKey: inventory.fileKey,
    fileUrl: 'https://www.figma.com/design/' + inventory.fileKey,
    plan: 'professional',
    modeStrategy: 'Semantic colours are one Color collection with Light and Dark modes aliasing a hidden Reference collection, mirroring tokens.json and modes.json. Every variable carries WEB code syntax var(--agency-...).',
    mappings,
    unsupported: {
      tokens: unmapped(catalog, mappings),
      fonts: 'ABC Areal and ABC Areal Mono are not in the Figma cloud font set. Remote use_figma can bind text styles to the font variables (the first bind fails, a retry succeeds) but cannot create or edit text layers in them. Text renders only where the fonts are installed locally.',
      rawValuesInComponentCss,
    },
  };
}

export function mapDesignTools() {
  const catalog = readJson('packages/tokens/dist/catalog.json');
  const current = readJson(mappingsPath);
  return {
    schemaVersion: 1,
    release: catalog.release,
    status: current.status,
    sketch: mapSketch(readJson('design/sketch/inventory.json'), catalog),
    figma: mapFigma(readJson('design/figma/inventory.json'), catalog),
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = mapDesignTools();
  writeFileSync(new URL(mappingsPath, root), JSON.stringify(result, null, 2) + '\n');
  console.log(`Mapped ${result.sketch.mappings.length} Sketch and ${result.figma.mappings.length} Figma assets for release ${result.release}.`);
}
