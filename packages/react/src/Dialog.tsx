'use client';
import * as Primitive from '@radix-ui/react-dialog';
import type { ComponentPropsWithRef } from 'react';
import { usePortalTheme } from './ThemeContext';
import styles from './Dialog.module.css';
export { ThemeContext } from './ThemeContext';
export const DialogRoot = Primitive.Root;
export const DialogTrigger = Primitive.Trigger;
export const DialogClose = Primitive.Close;
export function DialogContent({ className, ...props }: ComponentPropsWithRef<typeof Primitive.Content>) {
  const theme = usePortalTheme();
  return <Primitive.Portal><Primitive.Overlay {...theme} className={styles.overlay} />
    <Primitive.Content {...props} {...theme} className={[styles.content, className].filter(Boolean).join(' ')} />
  </Primitive.Portal>;
}
export function DialogTitle({ className, ...props }: ComponentPropsWithRef<typeof Primitive.Title>) {
  return <Primitive.Title {...props} className={[styles.title,className].filter(Boolean).join(' ')} />;
}
export function DialogDescription({ className, ...props }: ComponentPropsWithRef<typeof Primitive.Description>) {
  return <Primitive.Description {...props} className={[styles.description,className].filter(Boolean).join(' ')} />;
}
