import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { build, resolve } from '../scripts/build-tokens.mjs';
test('aliases reject missing targets, cycles and incompatible types', () => {
  assert.throws(()=>resolve('a',{a:{$type:'color',$value:'{b}'},b:{$type:'color',$value:'{a}'}}),/cycle/);
  assert.throws(()=>resolve('absent',{}),/Unknown token/);
  assert.throws(()=>resolve('a',{a:{$type:'color',$value:'{b}'},b:{$type:'number',$value:2}}),/type mismatch/);
});
test('every token resolves across themes and has agent metadata', () => {
  const result=build(); assert.ok(result.tokens.length>50);
  for(const token of result.tokens) { assert.ok(token.description); assert.ok(token.metadata.status); assert.ok(token.resolved.light !== undefined); assert.ok(token.resolved.dark !== undefined); }
  const action=result.tokens.find(t=>t.id==='color.action.primary.background');
  assert.notDeepEqual(action.resolved.light,action.resolved.dark);
  const css=readFileSync(new URL('../packages/tokens/dist/tokens.css',import.meta.url),'utf8');
  assert.match(css,/prefers-reduced-motion/); assert.match(css,/data-agency-theme="dark"/);
});
