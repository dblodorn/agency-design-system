import type { Meta, StoryObj } from '@storybook/react-vite';
import catalog from '../packages/tokens/dist/catalog.json';

const meta = { title: 'Foundations/Tokens' } satisfies Meta;
export default meta;

type CatalogToken = (typeof catalog.tokens)[number];
type ColorValue = { colorSpace: string; components: number[]; alpha: number };

function colorLabel(value: unknown) {
  const color = value as ColorValue;
  if (color.colorSpace !== 'srgb') return JSON.stringify(value);
  const hex = color.components.map(component => Math.round(component * 255).toString(16).padStart(2, '0')).join('');
  const alpha = color.alpha < 1 ? Math.round(color.alpha * 255).toString(16).padStart(2, '0') : '';
  return `#${hex}${alpha}`.toUpperCase();
}

function ColorTokens({ tokens }: { tokens: CatalogToken[] }) {
  return <div className="token-colors">{tokens.map(token => <article className="token-color" key={token.id}>
    {/* Each half scopes its own theme, so both modes show real values whatever the toolbar says. */}
    <div className="token-color-swatch" aria-hidden="true">
      {(['light', 'dark'] as const).map(mode => <div key={mode} data-agency-theme={mode} className="token-color-mode" style={{ backgroundColor: `var(${token.cssVariable})` }} />)}
    </div>
    <div className="token-color-details">
      <h3><code>{token.id}</code></h3>
      <p>{token.description}</p>
      <dl className="token-color-values">
        <div><dt>Light</dt><dd><code>{colorLabel(token.resolved.light)}</code></dd></div>
        <div><dt>Dark</dt><dd><code>{colorLabel(token.resolved.dark)}</code></dd></div>
      </dl>
      {typeof token.value === 'string' && token.value.startsWith('{') ? <p className="token-alias">Alias: <code>{token.value.slice(1, -1)}</code></p> : null}
    </div>
  </article>)}</div>;
}

export const Catalog: StoryObj = { render: () => {
  const colors = catalog.tokens.filter(token => token.type === 'color');
  const otherTokens = catalog.tokens.filter(token => token.type !== 'color' && !token.id.startsWith('reference.'));
  return <main className="token-catalog">
    <h1>Token reference</h1>
    <p>Generated from typed source. Each swatch shows the light value on the left and the dark value on the right; the checkerboard shows through translucent colours.</p>
    <section aria-labelledby="semantic-colors"><h2 id="semantic-colors">Semantic colors</h2><p>Use these roles in interfaces. Their values adapt to the active theme.</p>
      <ColorTokens tokens={colors.filter(token => !token.id.startsWith('reference.'))} />
    </section>
    <details className="token-reference"><summary>Reference palette · internal building blocks</summary><p>These raw colors define the palette. Use semantic roles when building interfaces.</p>
      <ColorTokens tokens={colors.filter(token => token.id.startsWith('reference.'))} />
    </details>
    <section aria-labelledby="other-tokens"><h2 id="other-tokens">Type, space and motion</h2><div className="token-table-scroll"><table><thead><tr><th scope="col">Token</th><th scope="col">Type</th><th scope="col">Value</th><th scope="col">Purpose</th></tr></thead><tbody>{otherTokens.map(token => <tr key={token.id}><th scope="row"><code>{token.id}</code></th><td>{token.type}</td><td><code>{JSON.stringify(token.value)}</code></td><td>{token.description}</td></tr>)}</tbody></table></div></section>
  </main>;
} };
