import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mapDesignTools, mapSketch } from '../scripts/map-design-tools.mjs';
const read = (path) => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'));
test('committed design mappings match the inventories and current token catalog', () => {
  assert.deepEqual(read('packages/catalog/src/design-mappings.json'), mapDesignTools(), 'run npm run design:map and review the diff');
});
test('Sketch mapping rejects colour drift and unknown assets', () => {
  const catalog = read('packages/tokens/dist/catalog.json');
  const inventory = read('design/sketch/inventory.json');
  const drifted = { ...inventory, swatches: inventory.swatches.map((s, i) => (i === 0 ? { ...s, hex: '#000000ff' } : s)) };
  assert.throws(() => mapSketch(drifted, catalog), /drifted/);
  const unknown = { ...inventory, textStyles: [...inventory.textStyles, { id: 'X', name: 'light/type/caption' }] };
  assert.throws(() => mapSketch(unknown, catalog), /unknown Sketch text style/);
});
