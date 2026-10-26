import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { Button, TextField } from '@agency/react';
test('published React export renders native semantics and associated field messages', () => {
  const button=renderToStaticMarkup(createElement(Button,null,'Save'));
  assert.match(button,/type="button"/); assert.match(button,/class="[^"]+"/);
  const field=renderToStaticMarkup(createElement(TextField,{id:'project',label:'Project',description:'Help',error:'Required','aria-describedby':'external'}));
  assert.match(field,/for="project"/); assert.match(field,/aria-describedby="external project-description project-error"/); assert.match(field,/aria-invalid="true"/);
  const css=readFileSync(new URL('../packages/react/dist/index.css',import.meta.url),'utf8'); assert.match(css,/--agency-color/);
});
