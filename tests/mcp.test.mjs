import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
test('MCP handshake, discovery, exact contracts and release isolation', async () => {
  const client=new Client({name:'design-system-test',version:'0.1.0'});
  const transport=new StdioClientTransport({command:process.execPath,args:[fileURLToPath(new URL('../packages/mcp/src/server.mjs',import.meta.url))]});
  try {
    await client.connect(transport);
    const {tools}=await client.listTools(); assert.equal(tools.length,3);
    const get=async(name,args)=>client.callTool({name,arguments:args});
    const button=await get('get_component',{id:'Button',release:'0.1.0'});
    assert.equal(JSON.parse(button.content[0].text).component.imports[0],'Button');
    assert.equal((await get('get_component',{id:'Combobox'})).isError,true);
    assert.equal((await get('get_system',{release:'9.0.0'})).isError,true);
    const result=await get('find_tokens',{query:'color',limit:100});
    assert.ok(JSON.parse(result.content[0].text).tokens.every(t=>!t.id.startsWith('reference.')));
    const resources=await client.listResources(); assert.equal(resources.resources.length,2);
    const rules=await client.readResource({uri:'agency://system/0.1.0/rules'}); assert.ok(rules.contents.length);
  } finally { await client.close(); }
});
