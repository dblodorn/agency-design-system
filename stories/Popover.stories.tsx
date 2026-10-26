import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../packages/react/src/Button';
import { PopoverClose, PopoverContent, PopoverRoot, PopoverTrigger } from '../packages/react/src/Popover';
import { TextField } from '../packages/react/src/TextField';
const meta = { title: 'Components/Popover', parameters: { docs: { description: { component: 'Radix-backed non-modal popover. Focus moves in on open and back to the trigger on close; Escape and outside clicks dismiss it. Content keeps the scoped theme.' } } } } satisfies Meta;
export default meta;
export const Filter: StoryObj = { render: () => <PopoverRoot>
  <PopoverTrigger asChild><Button variant="secondary">Filter invoices</Button></PopoverTrigger>
  <PopoverContent aria-label="Invoice filter">
    {/* Portaled content sits outside the workbench, so layout utilities are inline here. */}
    <div style={{ display: 'grid', gap: 'var(--agency-space-4)', justifyItems: 'start' }}><TextField label="Client" placeholder="Any client" /><PopoverClose asChild><Button size="small">Apply</Button></PopoverClose></div>
  </PopoverContent>
</PopoverRoot> };
