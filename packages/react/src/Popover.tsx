'use client';
import * as Primitive from '@radix-ui/react-popover';
import type { ComponentPropsWithRef } from 'react';
import { usePortalTheme } from './ThemeContext';
import styles from './Popover.module.css';
export const PopoverRoot = Primitive.Root;
export const PopoverTrigger = Primitive.Trigger;
export const PopoverAnchor = Primitive.Anchor;
export const PopoverClose = Primitive.Close;
export function PopoverContent({ className, sideOffset = 8, collisionPadding = 8, ...props }: ComponentPropsWithRef<typeof Primitive.Content>) {
  const theme = usePortalTheme();
  return <Primitive.Portal><Primitive.Content {...props} {...theme} sideOffset={sideOffset} collisionPadding={collisionPadding} className={[styles.content, className].filter(Boolean).join(' ')} /></Primitive.Portal>;
}
