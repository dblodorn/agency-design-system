'use client';
import * as Primitive from '@radix-ui/react-tabs';
import type { ComponentPropsWithRef } from 'react';
import styles from './Tabs.module.css';
const cx = (base: string, className?: string) => [base, className].filter(Boolean).join(' ');
export function TabsRoot({ className, ...props }: ComponentPropsWithRef<typeof Primitive.Root>) {
  return <Primitive.Root {...props} className={cx(styles.root, className)} />;
}
export function TabsList({ className, ...props }: ComponentPropsWithRef<typeof Primitive.List>) {
  return <Primitive.List {...props} className={cx(styles.list, className)} />;
}
export function TabsTrigger({ className, ...props }: ComponentPropsWithRef<typeof Primitive.Trigger>) {
  return <Primitive.Trigger {...props} className={cx(styles.trigger, className)} />;
}
export function TabsContent({ className, ...props }: ComponentPropsWithRef<typeof Primitive.Content>) {
  return <Primitive.Content {...props} className={cx(styles.content, className)} />;
}
