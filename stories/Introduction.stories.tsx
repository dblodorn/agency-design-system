import type { Meta, StoryObj } from '@storybook/react-vite';
const meta = { title: 'Start here/Overview', parameters: { layout: 'fullscreen' } } satisfies Meta;
export default meta;
export const Overview: StoryObj = { render: () => <main><h1>A shared language.<br />Room to experiment.</h1><p>An agency application system for precise tools and expressive experiences. This workbench is the executable reference.</p><h2>Foundation preview · 0.1.0</h2><p>Button, TextField, Dialog and Theme are experimental. Typography and colors are provisional, pending agency art direction. Charts, media, accounting patterns and design-tool synchronization are planned.</p><p>Use the theme toolbar to inspect light and dark modes. Open component documentation for controls and usage.</p></main> };
