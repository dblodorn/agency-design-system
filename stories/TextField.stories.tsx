import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextField } from '../packages/react/src/TextField';
const meta = { title: 'Components/TextField', component: TextField, tags: ['autodocs'], args: { label:'Project name', description:'Use a name your team will recognize.', placeholder:'Studio archive' } } satisfies Meta<typeof TextField>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
export const Invalid: StoryObj<typeof meta> = { args: { error: 'Enter a project name.' } };
