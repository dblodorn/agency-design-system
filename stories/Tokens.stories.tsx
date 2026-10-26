import type { Meta, StoryObj } from '@storybook/react-vite';
import catalog from '../packages/tokens/dist/catalog.json';
const meta = { title:'Foundations/Tokens' } satisfies Meta;
export default meta;
export const Catalog: StoryObj = { render: () => <main><h1>Token reference</h1><p>Generated from typed source. Reference colors are internal; semantic roles are public.</p><table><thead><tr><th>Token</th><th>Type</th><th>Purpose</th></tr></thead><tbody>{catalog.tokens.filter(t => !t.id.startsWith('reference.')).map(t => <tr key={t.id}><td><code>{t.id}</code></td><td>{t.type}</td><td>{t.description}</td></tr>)}</tbody></table></main> };
