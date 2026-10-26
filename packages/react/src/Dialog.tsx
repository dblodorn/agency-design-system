'use client';
import * as Primitive from '@radix-ui/react-dialog';
import { createContext, useContext, type ComponentPropsWithRef } from 'react';
import styles from './Dialog.module.css';
// Portal content must retain the explicit scoped theme of its trigger tree.
export const ThemeContext = createContext<'light' | 'dark'>('light');
export const DialogRoot = Primitive.Root;
export const DialogTrigger = Primitive.Trigger;
export const DialogClose = Primitive.Close;
export function DialogContent({ className, ...props }: ComponentPropsWithRef<typeof Primitive.Content>) {
  const theme = useContext(ThemeContext);
  return <Primitive.Portal><Primitive.Overlay className={styles.overlay} />
    <Primitive.Content {...props} data-agency-theme={theme} className={[styles.content, className].filter(Boolean).join(' ')} />
  </Primitive.Portal>;
}
export function DialogTitle({ className, ...props }: ComponentPropsWithRef<typeof Primitive.Title>) {
  return <Primitive.Title {...props} className={[styles.title,className].filter(Boolean).join(' ')} />;
}
export function DialogDescription({ className, ...props }: ComponentPropsWithRef<typeof Primitive.Description>) {
  return <Primitive.Description {...props} className={[styles.description,className].filter(Boolean).join(' ')} />;
}
