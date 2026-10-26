import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('dialog supports keyboard dismissal, restores focus and retains dark theme', async ({page}) => {
  await page.goto('/iframe.html?id=components-dialog--project&viewMode=story&globals=theme:dark');
  const trigger=page.getByRole('button',{name:'Edit project'}); await trigger.click();
  const dialog=page.getByRole('dialog'); await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('data-agency-theme','dark');
  await expect(page.getByRole('textbox',{name:'Project name'})).toBeFocused();
  await expect(page.locator(':focus')).toBeVisible();
  const results=await new AxeBuilder({page}).include('[role="dialog"]').analyze(); expect(results.violations).toEqual([]);
  await page.keyboard.press('Escape'); await expect(dialog).toBeHidden(); await expect(trigger).toBeFocused();
});
test('dialog overlay carries the dark theme and dark scrim', async ({page}) => {
  await page.goto('/iframe.html?id=components-dialog--project&viewMode=story&globals=theme:dark');
  await page.getByRole('button',{name:'Edit project'}).click();
  const overlay=page.locator('[data-state="open"][data-agency-theme]:not([role="dialog"])');
  await expect(overlay).toHaveAttribute('data-agency-theme','dark');
  await expect(overlay).toHaveCSS('background-color','color(srgb 0 0 0 / 0.6)');
});
test('invalid field exposes its name, description and error', async ({page}) => {
  await page.goto('/iframe.html?id=components-textfield--invalid&viewMode=story');
  const input=page.getByRole('textbox',{name:'Project name'}); await expect(input).toHaveAttribute('aria-invalid','true');
  await expect(input).toHaveAccessibleDescription('Use a name your team will recognize. Enter a project name.');
});
test('reduced motion removes dialog entry animation', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/iframe.html?id=components-dialog--project&viewMode=story');
  await page.getByRole('button',{name:'Edit project'}).click();
  await expect(page.getByRole('dialog')).toHaveCSS('animation-name','none');
});
