import type { Preview } from '@storybook/react-vite';
import { Theme } from '../packages/react/src/Theme';
import './fonts/abc-areal.css';
import '@agency/tokens/css';
import '../stories/workbench.css';
// Stories are components, not pages: page-level landmark and h1 rules belong to consuming apps (Storybook already disables `region`).
const preview: Preview = {
  globalTypes: { theme: { description: 'Color mode', toolbar: { icon: 'paintbrush', items: ['light', 'dark'] } } },
  initialGlobals: { theme: 'light' },
  decorators: [(Story, context) => <Theme mode={context.globals.theme === 'dark' ? 'dark' : 'light'} className="workbench"><Story /></Theme>],
  parameters: { controls: { expanded: true }, a11y: { test: 'error', config: { rules: [{ id: 'landmark-one-main', enabled: false }, { id: 'page-has-heading-one', enabled: false }] } }, options: { storySort: { order: ['Start here', 'Foundations', 'Components', 'Patterns'] } } },
};
export default preview;
