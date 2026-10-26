import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
const dir = new URL('../packages/react/src/', import.meta.url);
// Properties whose values a theme must be able to reach. Keywords that carry no design value are allowed.
const guarded = /^(font-weight|outline|outline-offset|outline-width|box-shadow)$/;
const allowed = /^(none|inherit|0)$/;
function rawValues(css) {
  const found = [];
  for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    for (const declaration of body.split(';')) {
      const [prop, ...rest] = declaration.split(':'); const name = prop?.trim(); const value = rest.join(':').trim();
      if (!name || !value) continue;
      const tokenized = name === 'outline' ? /^var\(--agency-[^)]+\) /.test(value) || allowed.test(value) : value.includes('var(--agency-') || allowed.test(value);
      const overlayBackground = /overlay/.test(selector) && /^background(-color)?$/.test(name) && !value.includes('var(--agency-');
      if ((guarded.test(name) && !tokenized) || overlayBackground) found.push(`${selector.trim()} { ${name}: ${value} }`);
    }
  }
  return found;
}
test('raw-value scan flags literal values in tokenized roles', () => {
  assert.deepEqual(rawValues('.a { font-weight:600; outline:2px solid red; } .overlay { background:rgb(0 0 0 / .4); }').length, 3);
  assert.deepEqual(rawValues('.a { font-weight:var(--agency-font-weight-strong); outline:var(--agency-focus-ring-width) solid var(--agency-color-focus-ring); outline:none; }'), []);
});
test('component CSS uses tokens for weight, focus ring, scrim and elevation', () => {
  const files = readdirSync(dir).filter((f) => f.endsWith('.module.css'));
  assert.ok(files.length >= 3);
  const found = files.flatMap((f) => rawValues(readFileSync(new URL(f, dir), 'utf8')).map((v) => `${f}: ${v}`));
  assert.deepEqual(found, []);
});
