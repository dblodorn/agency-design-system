import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../packages/react/src/Button';
import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRoot, DropdownMenuSeparator, DropdownMenuTrigger } from '../packages/react/src/DropdownMenu';
const meta = { title: 'Components/DropdownMenu', parameters: { docs: { description: { component: 'Radix-backed action menu. Use it for commands on the current context, not for navigation or form values. Mark destructive items with tone="danger".' } } } } satisfies Meta;
export default meta;
export const Actions: StoryObj = { render: function Actions() {
  const [log, setLog] = useState<string[]>([]);
  const setLast = (action: string) => setLog((entries) => [...entries, action]);
  const last = log.length ? `${log.at(-1)} (${log.length} call${log.length === 1 ? '' : 's'})` : 'none';
  return <div className="stack">
    <div className="row"><DropdownMenuRoot>
      <DropdownMenuTrigger asChild><Button variant="secondary">Invoice actions</Button></DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Invoice INV-1042</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => setLast('duplicate')}>Duplicate</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setLast('download')}>Download PDF</DropdownMenuItem>
          <DropdownMenuItem disabled onSelect={() => setLast('send')}>Send reminder</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem tone="danger" onSelect={() => setLast('void')}>Void invoice</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot></div>
    <p>Last action: <output aria-label="Last action">{last}</output></p>
  </div>;
} };
export const Modal: StoryObj = { render: () => <div className="row"><DropdownMenuRoot modal>
  <DropdownMenuTrigger asChild><Button variant="secondary">Bulk actions</Button></DropdownMenuTrigger>
  <DropdownMenuContent><DropdownMenuItem>Export selected</DropdownMenuItem><DropdownMenuItem tone="danger">Delete selected</DropdownMenuItem></DropdownMenuContent>
</DropdownMenuRoot></div> };
