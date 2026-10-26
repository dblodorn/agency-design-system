import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../packages/react/src/Button';
import { TextField } from '../packages/react/src/TextField';
import { DialogRoot, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '../packages/react/src/Dialog';
const meta = { title:'Components/Dialog', parameters:{ docs:{ description:{ component:'Radix-backed dialog. Supply a title, description, and visible close action. Scoped themes follow portal content.' } } } } satisfies Meta;
export default meta;
export const Project: StoryObj = { render: () => <DialogRoot><DialogTrigger asChild><Button>Edit project</Button></DialogTrigger><DialogContent><DialogTitle>Edit project</DialogTitle><DialogDescription>Update the name shown throughout the workspace.</DialogDescription><form className="stack" onSubmit={e => e.preventDefault()}><TextField label="Project name" defaultValue="Studio archive" /><div className="row"><DialogClose asChild><Button>Done</Button></DialogClose><DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose></div></form></DialogContent></DialogRoot> };
