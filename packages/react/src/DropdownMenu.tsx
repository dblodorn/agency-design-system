'use client';
import * as Primitive from '@radix-ui/react-dropdown-menu';
import type { ComponentPropsWithRef } from 'react';
import { usePortalTheme } from './ThemeContext';
import styles from './DropdownMenu.module.css';
const cx = (base: string, className?: string) => [base, className].filter(Boolean).join(' ');
// Non-modal by default, per the WAI-ARIA menu button pattern: the page stays in the accessibility tree
// (Radix's modal mode aria-hides it) while focus still stays in the menu and Escape still closes it.
export function DropdownMenuRoot({ modal = false, ...props }: ComponentPropsWithRef<typeof Primitive.Root>) {
  return <Primitive.Root {...props} modal={modal} />;
}
export const DropdownMenuTrigger = Primitive.Trigger;
export const DropdownMenuGroup = Primitive.Group;
export function DropdownMenuContent({ className, sideOffset = 4, align = 'start', collisionPadding = 8, ...props }: ComponentPropsWithRef<typeof Primitive.Content>) {
  const theme = usePortalTheme();
  return <Primitive.Portal><Primitive.Content {...props} {...theme} sideOffset={sideOffset} align={align} collisionPadding={collisionPadding} className={cx(styles.content, className)} /></Primitive.Portal>;
}
export type DropdownMenuItemProps = ComponentPropsWithRef<typeof Primitive.Item> & { tone?: 'neutral' | 'danger' };
export function DropdownMenuItem({ className, tone = 'neutral', ...props }: DropdownMenuItemProps) {
  return <Primitive.Item {...props} data-tone={tone} className={cx(styles.item, className)} />;
}
export function DropdownMenuLabel({ className, ...props }: ComponentPropsWithRef<typeof Primitive.Label>) {
  return <Primitive.Label {...props} className={cx(styles.label, className)} />;
}
export function DropdownMenuSeparator({ className, ...props }: ComponentPropsWithRef<typeof Primitive.Separator>) {
  return <Primitive.Separator {...props} className={cx(styles.separator, className)} />;
}
