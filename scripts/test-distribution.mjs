import { mkdtemp, mkdir, writeFile, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
const root = process.cwd();
const temp = await mkdtemp(join(tmpdir(), 'agency-consumer-'));
const env = { ...process.env, npm_config_cache: join(tmpdir(), 'agency-design-system-npm-cache') };
const run = (args, cwd=root) => execFileSync('npm', args, { cwd, env, encoding:'utf8', stdio:['ignore','pipe','inherit'] });
try {
  const packs=join(temp,'packs'); await mkdir(packs);
  const files=[];
  for(const name of ['tokens','catalog','react','mcp']) {
    run(['pack','--workspace',`@agency/${name}`,'--pack-destination',packs]);
    const filename=(await readdir(packs)).find(file=>file.startsWith(`agency-${name}-`) && file.endsWith('.tgz'));
    if(!filename) throw Error(`Missing packed ${name}`); files.push(join(packs,filename));
  }
  const consumer=join(temp,'app'); await mkdir(consumer);
  await writeFile(join(consumer,'package.json'),JSON.stringify({name:'agency-independent-consumer',private:true,type:'module'}));
  run(['install','--ignore-scripts','--no-audit','--no-fund',...files],consumer);
  const fixture=`import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button } from '@agency/react';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require=createRequire(import.meta.url);
const html=renderToStaticMarkup(createElement(Button,null,'Save changes'));
if(!/class="[^\"]+"/.test(html)) throw Error('Missing compiled component classes');
const css=readFileSync(require.resolve('@agency/react/styles.css'),'utf8');
const className=html.match(/class="([^\"]+)"/)[1];
if(!css.includes('.'+className)) throw Error('CSS mapping missing from package');
if(!readFileSync(require.resolve('@agency/tokens/css'),'utf8').includes('--agency-color')) throw Error('Missing token stylesheet');
console.log('Independent package render and CSS resolution passed.');`;
  await writeFile(join(consumer,'verify.mjs'),fixture);
  console.log(execFileSync(process.execPath,['verify.mjs'],{cwd:consumer,encoding:'utf8'}).trim());
  const client=new Client({name:'packed-consumer-test',version:'0.1.0'});
  try {
    await client.connect(new StdioClientTransport({command:process.execPath,args:[join(consumer,'node_modules/@agency/mcp/src/server.mjs')],cwd:consumer}));
    const result=await client.callTool({name:'get_component',arguments:{id:'Button',release:'0.1.0'}});
    if(result.isError || JSON.parse(result.content[0].text).component.id!=='Button') throw Error('Packed MCP failed');
    console.log('Packed MCP handshake and catalog resolution passed outside repository.');
  } finally { await client.close(); }
} finally { await rm(temp,{recursive:true,force:true}); }
