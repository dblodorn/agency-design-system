import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { Button, TextField, Field, useFieldControl, Checkbox, Select, SelectItem, TabsRoot, TabsList, TabsTrigger, TabsContent, PopoverRoot, PopoverTrigger, DropdownMenuRoot, DropdownMenuTrigger } from '@agency/react';
test('slice-1 components render from the published export', () => {
  const box=renderToStaticMarkup(createElement(Checkbox,{id:'terms',label:'Terms',error:'Required',defaultChecked:true}));
  assert.match(box,/role="checkbox"/); assert.match(box,/aria-checked="true"/); assert.match(box,/aria-labelledby="terms-label"/); assert.match(box,/aria-describedby="terms-error"/);
  const select=renderToStaticMarkup(createElement(Select,{id:'currency',label:'Currency',placeholder:'Choose'},createElement(SelectItem,{value:'EUR'},'Euro')));
  assert.match(select,/role="combobox"/); assert.match(select,/aria-labelledby="currency-label"/); assert.match(select,/Choose/);
  const tabs=renderToStaticMarkup(createElement(TabsRoot,{defaultValue:'a'},createElement(TabsList,{'aria-label':'Sections'},createElement(TabsTrigger,{value:'a'},'A')),createElement(TabsContent,{value:'a'},'Panel')));
  assert.match(tabs,/role="tablist"/); assert.match(tabs,/aria-selected="true"/); assert.match(tabs,/role="tabpanel"/);
  assert.match(renderToStaticMarkup(createElement(PopoverRoot,null,createElement(PopoverTrigger,null,'Filter'))),/aria-expanded="false"/);
  assert.match(renderToStaticMarkup(createElement(DropdownMenuRoot,null,createElement(DropdownMenuTrigger,null,'Actions'))),/aria-haspopup="menu"/);
});
const FieldInput=()=>{ const field=useFieldControl(); return createElement('input',field.control); };
test('Field associates label, description and error in a stable order', () => {
  const full=renderToStaticMarkup(createElement(Field,{id:'budget',label:'Budget',description:'Help',error:'Too high','aria-describedby':'external'},createElement(FieldInput)));
  assert.match(full,/<label id="budget-label"[^>]*for="budget"/); assert.match(full,/aria-describedby="external budget-description budget-error"/); assert.match(full,/aria-invalid="true"/);
  const bare=renderToStaticMarkup(createElement(Field,{label:'Budget'},createElement(FieldInput)));
  assert.doesNotMatch(bare,/aria-describedby|aria-invalid|<p/);
  const generated=bare.match(/<input id="([^"]+)"/)[1]; assert.match(bare,new RegExp(`for="${generated}"`));
});
test('published React export renders native semantics and associated field messages', () => {
  const button=renderToStaticMarkup(createElement(Button,null,'Save'));
  assert.match(button,/type="button"/); assert.match(button,/class="[^"]+"/);
  const field=renderToStaticMarkup(createElement(TextField,{id:'project',label:'Project',description:'Help',error:'Required','aria-describedby':'external'}));
  assert.match(field,/for="project"/); assert.match(field,/aria-describedby="external project-description project-error"/); assert.match(field,/aria-invalid="true"/);
  const css=readFileSync(new URL('../packages/react/dist/index.css',import.meta.url),'utf8'); assert.match(css,/--agency-color/);
});
