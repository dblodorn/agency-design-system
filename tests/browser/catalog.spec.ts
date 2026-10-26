import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const story = (page: Page, id: string, theme = 'light') => page.goto(`/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`);
// Contrast is only meaningful once entry fades have finished; mid-animation colours are blends.
const axe = async (page: Page, selector: string) => {
  await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== 'running'));
  expect((await new AxeBuilder({ page }).include(selector).analyze()).violations).toEqual([]);
};
// Resolves a CSS custom property to a computed colour in the same theme scope as `el`.
const tokenColor = (el: Element, variable: string) => { const probe = document.createElement('span'); probe.style.color = `var(${variable})`; el.appendChild(probe); const value = getComputedStyle(probe).color; probe.remove(); return value; };

const stories = ['checkbox--default', 'checkbox--states', 'checkbox--in-form', 'select--default', 'select--invalid', 'select--in-form', 'tabs--default', 'tabs--manual', 'tabs--vertical', 'popover--filter', 'dropdownmenu--actions'];
for (const theme of ['light', 'dark']) test(`slice-1 stories have no axe violations in ${theme}`, async ({ page }) => {
  for (const id of stories) { await story(page, `components-${id}`, theme); await page.locator('#storybook-root > *').first().waitFor(); await axe(page, '#storybook-root'); }
});

test.describe('Checkbox', () => {
  test('toggles with Space and with its label', async ({ page }) => {
    await story(page, 'components-checkbox--default');
    const box = page.getByRole('checkbox', { name: 'Send weekly summary' });
    await box.focus(); await page.keyboard.press('Space');
    await expect(box).toHaveAttribute('aria-checked', 'true');
    await page.getByText('Send weekly summary').click();
    await expect(box).toHaveAttribute('aria-checked', 'false');
  });
  test('exposes mixed, disabled and error states', async ({ page }) => {
    await story(page, 'components-checkbox--states');
    await expect(page.getByRole('checkbox', { name: 'Some invoices selected' })).toHaveAttribute('aria-checked', 'mixed');
    await expect(page.getByRole('checkbox', { name: 'Disabled' })).toBeDisabled();
    const terms = page.getByRole('checkbox', { name: 'Accept the licence terms' });
    await expect(terms).toHaveAttribute('aria-invalid', 'true');
    await expect(terms).toHaveAccessibleDescription('Required before export. Accept the terms to continue.');
    await axe(page, '#storybook-root');
  });
  test('submits its value only when checked', async ({ page }) => {
    await story(page, 'components-checkbox--in-form');
    const output = page.getByRole('status').or(page.getByLabel('Submitted data'));
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(output).toHaveText('(empty)');
    await page.getByRole('checkbox', { name: 'I agree to the terms' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(output).toHaveText('terms=on');
  });
});

test.describe('Select', () => {
  test('chooses with the keyboard and skips disabled options', async ({ page }) => {
    await story(page, 'components-select--default');
    const trigger = page.getByRole('combobox', { name: 'Currency' });
    await trigger.focus(); await page.keyboard.press('Enter');
    await expect(page.getByRole('listbox')).toBeVisible();
    // Radix moves focus in a timeout after each key, so wait for each step before the next key.
    await expect(page.getByRole('option', { name: 'Euro (EUR)' })).toBeFocused();
    await page.keyboard.press('ArrowDown'); await expect(page.getByRole('option', { name: 'US dollar (USD)' })).toBeFocused();
    await page.keyboard.press('ArrowDown'); await expect(page.getByRole('option', { name: 'Japanese yen (JPY)' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('listbox')).toBeHidden();
    await expect(trigger).toHaveText('Japanese yen (JPY)');
  });
  test('Escape closes without changing the value', async ({ page }) => {
    await story(page, 'components-select--default');
    const trigger = page.getByRole('combobox', { name: 'Currency' });
    await trigger.focus(); await page.keyboard.press('Enter'); await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('listbox')).toBeHidden();
    await expect(trigger).toBeFocused(); await expect(trigger).toHaveText('Choose a currency');
  });
  test('is labelled, described and invalid', async ({ page }) => {
    await story(page, 'components-select--invalid');
    const trigger = page.getByRole('combobox', { name: 'Currency' });
    await expect(trigger).toHaveAttribute('aria-invalid', 'true');
    await expect(trigger).toHaveAccessibleDescription('Used for new invoices. Choose a currency.');
    await axe(page, '#storybook-root');
  });
  test('listbox keeps the dark theme and passes axe', async ({ page }) => {
    await story(page, 'components-select--default', 'dark');
    await page.getByRole('combobox', { name: 'Currency' }).click();
    const listbox = page.getByRole('listbox');
    await expect(listbox).toHaveAttribute('data-agency-theme', 'dark');
    await axe(page, '[role="listbox"]');
  });
  test('submits its value with the form', async ({ page }) => {
    await story(page, 'components-select--in-form');
    await page.getByRole('combobox', { name: 'Currency' }).click();
    await page.getByRole('option', { name: 'Euro (EUR)' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByLabel('Submitted data')).toHaveText('currency=EUR');
  });
});

test.describe('Tabs', () => {
  test('arrow, Home and End move selection and skip disabled tabs', async ({ page }) => {
    await story(page, 'components-tabs--default');
    const tab = (name: string) => page.getByRole('tab', { name });
    await tab('Overview').focus();
    await page.keyboard.press('ArrowRight');
    await expect(tab('Invoices')).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel')).toHaveText('Twelve invoices, three awaiting approval.');
    await page.keyboard.press('ArrowRight');
    await expect(tab('Files')).toBeFocused();
    await page.keyboard.press('Home'); await expect(tab('Overview')).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('End'); await expect(tab('Files')).toHaveAttribute('aria-selected', 'true');
    await expect(tab('Overview')).toHaveAttribute('aria-selected', 'false');
    await expect(tab('Files')).toHaveCSS('outline-width', '2px');
    await axe(page, '#storybook-root');
  });
  test('manual activation waits for Enter', async ({ page }) => {
    await story(page, 'components-tabs--manual');
    await page.getByRole('tab', { name: 'Overview' }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', { name: 'Invoices' })).toBeFocused();
    await expect(page.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('tab', { name: 'Invoices' })).toHaveAttribute('aria-selected', 'true');
  });
  test('vertical tabs use Up and Down', async ({ page }) => {
    await story(page, 'components-tabs--vertical');
    await page.getByRole('tab', { name: 'Overview' }).focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('tab', { name: 'Invoices' })).toHaveAttribute('aria-selected', 'true');
  });
});

test.describe('Popover', () => {
  test('opens with focus inside, closes with Escape and restores focus', async ({ page }) => {
    await story(page, 'components-popover--filter');
    const trigger = page.getByRole('button', { name: 'Filter invoices' });
    await trigger.click();
    const content = page.getByRole('dialog', { name: 'Invoice filter' });
    await expect(content).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(trigger).toHaveAttribute('aria-controls', (await content.getAttribute('id'))!);
    expect(await content.evaluate((el) => el.contains(document.activeElement))).toBe(true);
    await axe(page, '[role="dialog"]');
    await page.keyboard.press('Escape');
    await expect(content).toBeHidden(); await expect(trigger).toBeFocused();
  });
  test('closes on outside click', async ({ page }) => {
    await story(page, 'components-popover--filter');
    await page.getByRole('button', { name: 'Filter invoices' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    // Radix ignores outside pointers briefly after opening so the opening click cannot dismiss it.
    await expect(async () => { await page.mouse.click(600, 60); await expect(page.getByRole('dialog')).toBeHidden({ timeout: 250 }); }).toPass();
  });
  test('keeps the dark theme and drops motion when reduced', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await story(page, 'components-popover--filter', 'dark');
    await page.getByRole('button', { name: 'Filter invoices' }).click();
    const content = page.getByRole('dialog');
    await expect(content).toHaveAttribute('data-agency-theme', 'dark');
    await expect(content).toHaveCSS('animation-name', 'none');
  });
});

test.describe('DropdownMenu', () => {
  test('opens from the keyboard, navigates, and runs one action', async ({ page }) => {
    await story(page, 'components-dropdownmenu--actions');
    const trigger = page.getByRole('button', { name: 'Invoice actions' });
    await expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    await trigger.focus(); await page.keyboard.press('Enter');
    const item = (name: string) => page.getByRole('menuitem', { name });
    await expect(item('Duplicate')).toBeFocused();
    await page.keyboard.press('ArrowDown'); await expect(item('Download PDF')).toBeFocused();
    await page.keyboard.press('ArrowDown'); await expect(item('Void invoice')).toBeFocused();
    await page.keyboard.press('Home'); await expect(item('Duplicate')).toBeFocused();
    await page.keyboard.press('End'); await expect(item('Void invoice')).toBeFocused();
    await page.keyboard.press('d'); await expect(item('Duplicate')).toBeFocused();
    await page.keyboard.press('d'); await expect(item('Download PDF')).toBeFocused();
    await expect(item('Send reminder')).toHaveAttribute('aria-disabled', 'true');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('menu')).toBeHidden(); await expect(trigger).toBeFocused();
    await expect(page.getByLabel('Last action')).toHaveText('download (1 call)');
  });
  test('Escape closes without an action', async ({ page }) => {
    await story(page, 'components-dropdownmenu--actions');
    const trigger = page.getByRole('button', { name: 'Invoice actions' });
    await trigger.focus(); await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu')).toBeHidden(); await expect(trigger).toBeFocused();
    await expect(page.getByLabel('Last action')).toHaveText('none');
  });
  test('danger tone, dark theme and axe', async ({ page }) => {
    await story(page, 'components-dropdownmenu--actions', 'dark');
    await page.getByRole('button', { name: 'Invoice actions' }).click();
    const menu = page.getByRole('menu');
    await expect(menu).toHaveAttribute('data-agency-theme', 'dark');
    const voidItem = page.getByRole('menuitem', { name: 'Void invoice' });
    const [actual, expected] = await voidItem.evaluate((el, fn) => [getComputedStyle(el).color, new Function(`return (${fn})`)()(el, '--agency-color-status-danger')], tokenColor.toString());
    expect(actual).toBe(expected);
    await axe(page, '[role="menu"]');
  });
});
