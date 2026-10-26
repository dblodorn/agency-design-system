import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../packages/react/src/Button';
import { Select, SelectGroup, SelectItem, SelectSeparator } from '../packages/react/src/Select';
const meta = { title: 'Components/Select', parameters: { docs: { description: { component: 'Radix-backed single-value select with a required visible label, placeholder, groups and disabled options. The listbox keeps the scoped theme.' } } } } satisfies Meta;
export default meta;
const options = <>
  <SelectGroup label="Common"><SelectItem value="EUR">Euro (EUR)</SelectItem><SelectItem value="USD">US dollar (USD)</SelectItem><SelectItem value="GBP" disabled>Pound sterling (GBP)</SelectItem></SelectGroup>
  <SelectSeparator />
  <SelectGroup label="Other"><SelectItem value="JPY">Japanese yen (JPY)</SelectItem><SelectItem value="KRW">South Korean won (KRW)</SelectItem></SelectGroup>
</>;
export const Default: StoryObj = { render: () => <div className="stack"><Select label="Currency" placeholder="Choose a currency" description="Used for new invoices.">{options}</Select></div> };
export const Invalid: StoryObj = { render: () => <div className="stack"><Select label="Currency" placeholder="Choose a currency" description="Used for new invoices." error="Choose a currency.">{options}</Select></div> };
export const InForm: StoryObj = { render: function InForm() {
  const [submitted, setSubmitted] = useState('');
  return <form className="stack" onSubmit={(e) => { e.preventDefault(); setSubmitted(new URLSearchParams(new FormData(e.currentTarget) as unknown as Record<string, string>).toString() || '(empty)'); }}>
    <Select name="currency" label="Currency" placeholder="Choose a currency">{options}</Select>
    <div className="row"><Button type="submit">Submit</Button></div>
    <output aria-label="Submitted data">{submitted}</output>
  </form>;
} };
