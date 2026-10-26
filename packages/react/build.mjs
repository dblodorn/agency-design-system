import { build } from 'esbuild';
import { rm } from 'node:fs/promises';
await rm(new URL('./dist/', import.meta.url), { recursive: true, force: true });
await build({ entryPoints: ['src/index.ts'], bundle: true, format: 'esm', platform: 'browser', target: 'es2022', outfile: 'dist/index.js', loader: { '.css': 'local-css' }, external: ['react', 'react/*', 'react-dom', 'react-dom/*', '@radix-ui/*'], banner: { js: '"use client";' }, logLevel: 'info' });
