import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../packages/react/src/Button';
const meta = { title: 'Components/Button', component: Button, tags: ['autodocs'], args: { children: 'Save changes' }, argTypes: { variant: { control: 'select', options: ['primary','secondary','quiet'] }, size: { control:'select', options:['small','medium'] } } } satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = {};
export const Variants: Story = { render: () => <div className="row"><Button>Save changes</Button><Button variant="secondary">Preview</Button><Button variant="quiet">Cancel</Button><Button disabled>Unavailable</Button></div> };
