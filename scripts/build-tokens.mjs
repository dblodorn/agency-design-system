import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
export function flatten(tree, prefix = '', result = {}) {
  for (const [key, value] of Object.entries(tree)) {
    if (key.startsWith('$')) continue;
    const id = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && '$value' in value) result[id] = value;
    else flatten(value, id, result);
  }
  return result;
}
export function resolve(id, tokens, overrides = {}, seen = []) {
  if (seen.includes(id)) throw new Error(`Token cycle: ${[...seen, id].join(' -> ')}`);
  const token = tokens[id];
  if (!token) throw new Error(`Unknown token: ${id}`);
  const value = overrides[id] ?? token.$value;
  if (typeof value === 'string' && /^\{[^{}]+\}$/.test(value)) {
    const target = value.slice(1, -1);
    if (tokens[target]?.$type !== token.$type) throw new Error(`Alias type mismatch: ${id} -> ${target}`);
    return resolve(target, tokens, overrides, [...seen, id]);
  }
  return value;
}
export function cssValue(type, value) {
  if (type === 'color') return `color(srgb ${value.components.join(' ')} / ${value.alpha ?? 1})`;
  if (type === 'dimension' || type === 'duration') return `${value.value}${value.unit}`;
  if (type === 'fontFamily') return value.map(v => v.includes(' ') ? JSON.stringify(v) : v).join(', ');
  if (type === 'cubicBezier') return `cubic-bezier(${value.join(', ')})`;
  if (type === 'number') return String(value);
  throw new Error(`Unsupported CSS token type: ${type}`);
}
export function build() {
  const tokens = flatten(JSON.parse(readFileSync(new URL('packages/tokens/src/tokens.json', root))));
  const modes = JSON.parse(readFileSync(new URL('packages/tokens/src/modes.json', root)));
  const variable = id => '--agency-' + id.replaceAll('.', '-');
  const declarations = ids => ids.map(id => `  ${variable(id)}: ${cssValue(tokens[id].$type, resolve(id, tokens))};`).join('\n');
  let css = `/* Generated. Edit src/tokens.json and src/modes.json. */\n:root, [data-agency-theme="light"] {\n  color-scheme: light;\n${declarations(Object.keys(tokens))}\n}\n`;
  for (const [mode, overrides] of Object.entries(modes)) {
    for (const id of Object.keys(overrides)) if (!tokens[id]) throw new Error(`Unknown override: ${id}`);
    // Resolve all values under each mode so aliases cannot retain stale light values.
    css += `[data-agency-theme="${mode}"] {\n  color-scheme: ${mode};\n` + Object.keys(tokens).map(id => `  ${variable(id)}: ${cssValue(tokens[id].$type, resolve(id, tokens, overrides))};`).join('\n') + '\n}\n';
  }
  css += '@media (prefers-reduced-motion: reduce) {\n  :root, [data-agency-theme] {\n' + Object.keys(tokens).filter(id => tokens[id].$type === 'duration').map(id => `    ${variable(id)}: 0ms;`).join('\n') + '\n  }\n}\n';
  const dir = new URL('packages/tokens/dist/', root); mkdirSync(dir, { recursive: true });
  writeFileSync(new URL('tokens.css', dir), css);
  const catalog = { schemaVersion: 1, release: '0.1.0', themeStatus: 'provisional', tokens: Object.entries(tokens).map(([id,t]) => ({ id, type:t.$type, value:t.$value, description:t.$description, cssVariable:variable(id), metadata:t.$extensions['org.agency'], resolved:Object.fromEntries([['light', resolve(id,tokens)],...Object.entries(modes).map(([m,o]) => [m,resolve(id,tokens,o)])]) })) };
  writeFileSync(new URL('catalog.json', dir), JSON.stringify(catalog, null, 2) + '\n');
  return catalog;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) { const result = build(); console.log(`Generated ${result.tokens.length} tokens in light and dark modes.`); }
