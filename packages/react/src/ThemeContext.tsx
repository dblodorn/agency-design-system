'use client';
import { createContext, useContext } from 'react';
// Portal content leaves the Theme subtree, so it must re-apply the scoped theme of its trigger tree.
export const ThemeContext = createContext<'light' | 'dark'>('light');
export function usePortalTheme() {
  return { 'data-agency-theme': useContext(ThemeContext) } as const;
}
