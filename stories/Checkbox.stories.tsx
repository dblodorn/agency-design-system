import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../packages/react/src/Button';
import { Checkbox } from '../packages/react/src/Checkbox';
const meta = { title: 'Components/Checkbox', component: Checkbox, tags: ['autodocs'], args: { label: 'Send weekly summary' }, parameters: { docs: { description: { component: 'Radix-backed checkbox with a required visible label. Description and error follow Field associations; clicking the label toggles it.' } } } } satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const States: Story = { render: () => <div className="stack">
  <Checkbox label="Unchecked" />
  <Checkbox label="Checked" defaultChecked />
  <Checkbox label="Some invoices selected" checked="indeterminate" />
  <Checkbox label="Disabled" disabled />
  <Checkbox label="Accept the licence terms" description="Required before export." error="Accept the terms to continue." />
</div> };
export const InForm: Story = { render: function InForm() {
  const [submitted, setSubmitted] = useState('');
  return <form className="stack" onSubmit={(e) => { e.preventDefault(); setSubmitted(new URLSearchParams(new FormData(e.currentTarget) as unknown as Record<string, string>).toString() || '(empty)'); }}>
    <Checkbox name="terms" label="I agree to the terms" />
    <div className="row"><Button type="submit">Submit</Button></div>
    <output aria-label="Submitted data">{submitted}</output>
  </form>;
} };
