import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { build, resolve, cssValue } from '../scripts/build-tokens.mjs';
test('aliases reject missing targets, cycles and incompatible types', () => {
  assert.throws(()=>resolve('a',{a:{$type:'color',$value:'{b}'},b:{$type:'color',$value:'{a}'}}),/cycle/);
  assert.throws(()=>resolve('absent',{}),/Unknown token/);
  assert.throws(()=>resolve('a',{a:{$type:'color',$value:'{b}'},b:{$type:'number',$value:2}}),/type mismatch/);
});
test('shadow colours resolve through aliases per mode and font weights emit bare numbers', () => {
  const px=v=>({value:v,unit:'px'}); const rgb=c=>({colorSpace:'srgb',components:[c,c,c],alpha:0.2});
  const tokens={light:{$type:'color',$value:rgb(0)},dark:{$type:'color',$value:rgb(1)},size:{$type:'dimension',$value:px(4)},
    lift:{$type:'shadow',$value:{color:'{light}',offsetX:px(0),offsetY:px(24),blur:px(80),spread:px(0)}}};
  const darkLift={lift:{color:'{dark}',offsetX:px(0),offsetY:px(24),blur:px(80),spread:px(0)}};
  assert.deepEqual(resolve('lift',tokens).color,rgb(0)); assert.deepEqual(resolve('lift',tokens,darkLift).color,rgb(1));
  assert.equal(cssValue('shadow',resolve('lift',tokens)),'0px 24px 80px 0px color(srgb 0 0 0 / 0.2)');
  assert.throws(()=>resolve('lift',{...tokens,lift:{...tokens.lift,$value:{...tokens.lift.$value,color:'{size}'}}}),/type mismatch/);
  assert.equal(cssValue('fontWeight',600),'600');
});
test('every token resolves across themes and has agent metadata', () => {
  const result=build(); assert.ok(result.tokens.length>50);
  for(const token of result.tokens) { assert.ok(token.description); assert.ok(token.metadata.status); assert.ok(token.resolved.light !== undefined); assert.ok(token.resolved.dark !== undefined); }
  const action=result.tokens.find(t=>t.id==='color.action.primary.background');
  assert.notDeepEqual(action.resolved.light,action.resolved.dark);
  const css=readFileSync(new URL('../packages/tokens/dist/tokens.css',import.meta.url),'utf8');
  assert.match(css,/prefers-reduced-motion/); assert.match(css,/data-agency-theme="dark"/);
});
