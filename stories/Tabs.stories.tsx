import type { Meta, StoryObj } from '@storybook/react-vite';
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '../packages/react/src/Tabs';
const meta = { title: 'Components/Tabs', parameters: { docs: { description: { component: 'Radix-backed tabs. Arrow keys move between tabs, Home and End jump, disabled tabs are skipped. Activation follows focus unless activationMode="manual".' } } } } satisfies Meta;
export default meta;
const panels = <>
  <TabsContent value="overview"><p>Budget, schedule and owners for the current phase.</p></TabsContent>
  <TabsContent value="invoices"><p>Twelve invoices, three awaiting approval.</p></TabsContent>
  <TabsContent value="files"><p>Contracts and delivery files.</p></TabsContent>
  <TabsContent value="archive"><p>Archived.</p></TabsContent>
</>;
const list = (label: string) => <TabsList aria-label={label}><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="invoices">Invoices</TabsTrigger><TabsTrigger value="archive" disabled>Archive</TabsTrigger><TabsTrigger value="files">Files</TabsTrigger></TabsList>;
export const Default: StoryObj = { render: () => <TabsRoot defaultValue="overview">{list('Project sections')}{panels}</TabsRoot> };
export const Manual: StoryObj = { render: () => <TabsRoot defaultValue="overview" activationMode="manual">{list('Project sections, manual')}{panels}</TabsRoot> };
export const Vertical: StoryObj = { render: () => <TabsRoot defaultValue="overview" orientation="vertical">{list('Project sections, vertical')}{panels}</TabsRoot> };
