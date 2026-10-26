#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
const require = createRequire(import.meta.url);
const load = name => JSON.parse(readFileSync(require.resolve(name), 'utf8'));
const tokens = load('@agency/tokens/catalog');
const catalog = load('@agency/catalog/components');
const rules = load('@agency/catalog/rules');
if (catalog.release !== tokens.release || rules.release !== catalog.release) throw new Error('Release mismatch between installed catalogs');
const release = catalog.release;
const server = new McpServer({ name: 'agency-design-system', version: release });
const respond = data => ({ content: [{ type:'text', text:JSON.stringify({ release, ...data }, null, 2) }] });
const annotations = { readOnlyHint:true, destructiveHint:false, idempotentHint:true, openWorldHint:false };
const versionSchema = z.string().optional().describe('Exact installed release; omitted means this server release.');
function mismatch(version) {
  return version && version !== release ? { ...respond({ error:'unsupported_release', requested:version, available:[release], guidance:'Launch the MCP package matching your installed design-system release.' }), isError:true } : null;
}
server.registerTool('get_system', { description:'Read release, agent rules and actual implementation limitations.', inputSchema:{ release:versionSchema }, annotations }, async ({release:version}) => mismatch(version) ?? respond({ rules, components:catalog.components.map(({id,status})=>({id,status})) }));
server.registerTool('get_component', { description:'Get exact component imports, props, examples and constraints. Unknown components are not fabricated.', inputSchema:{ id:z.string(), release:versionSchema }, annotations }, async ({id,release:version}) => {
  const error = mismatch(version); if (error) return error;
  const component = catalog.components.find(c=>c.id.toLowerCase()===id.toLowerCase());
  return component ? respond({ component }) : { ...respond({ error:'unknown_component', available:catalog.components.map(c=>c.id), extensionOrder:rules.extensionOrder }), isError:true };
});
server.registerTool('find_tokens', { description:'Search public semantic tokens by ID or purpose, including resolved light/dark values.', inputSchema:{ query:z.string().max(200), includeReference:z.boolean().default(false), limit:z.number().int().min(1).max(100).default(20), release:versionSchema }, annotations }, async ({query,includeReference,limit,release:version}) => {
  const error=mismatch(version); if(error) return error;
  const matches=tokens.tokens.filter(t=>(includeReference || !t.id.startsWith('reference.')) && `${t.id} ${t.description}`.toLowerCase().includes(query.toLowerCase()));
  return respond({ total:matches.length, tokens:matches.slice(0,limit) });
});
for (const [name,path,data] of [['rules','rules',rules],['components','components',catalog]]) {
  server.registerResource(name, `agency://system/${release}/${path}`, { mimeType:'application/json', description:`Release ${release} ${name}` }, async uri => ({ contents:[{ uri:uri.href, mimeType:'application/json', text:JSON.stringify(data) }] }));
}
await server.connect(new StdioServerTransport());
