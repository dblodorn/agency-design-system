import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir:'tests/browser', fullyParallel:true, use:{ baseURL:'http://127.0.0.1:6006', headless:true }, webServer:{ command:'node scripts/serve-storybook.mjs', url:'http://127.0.0.1:6006', reuseExistingServer:!process.env.CI }, reporter:'list' });
