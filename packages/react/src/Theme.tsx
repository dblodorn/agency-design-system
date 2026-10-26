'use client';
import type { ComponentPropsWithoutRef } from 'react';
import { ThemeContext } from './Dialog';
export function Theme({ mode = 'light', children, ...props }: ComponentPropsWithoutRef<'div'> & { mode?: 'light' | 'dark' }) {
  return <ThemeContext.Provider value={mode}><div {...props} data-agency-theme={mode}>{children}</div></ThemeContext.Provider>;
}
