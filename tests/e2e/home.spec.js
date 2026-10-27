import { expect, test } from '@playwright/test';

test('the root page sends a Turkish browser to Turkish', async ({ browser }, testInfo) => {
  const context = await browser.newContext({ baseURL: testInfo.project.use.baseURL, locale: 'tr-TR' });
  const page = await context.newPage();
  await page.goto('./');
  await expect(page).toHaveURL(/\/kpss-rehber\/tr\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
  await context.close();
});

test('home page opens with a Turkish heading', async ({ page }) => {
  await page.goto('./tr/');
  await expect(page).toHaveTitle(/KPSS Rehber/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hangi sınava hazırlanıyorsun?');
});

test('theme toggle switches dark/light and remembers it', async ({ page }) => {
  await page.goto('./tr/');
  const html = page.locator('html');
  const before = await html.getAttribute('data-theme');
  await page.getByRole('button', { name: /tema/i }).click();
  const after = await html.getAttribute('data-theme');
  expect(after).not.toBe(before);
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', after);
});

test('loads without CSP violations', async ({ page }) => {
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('./tr/');
  await page.getByRole('button', { name: /tema/i }).click();
  expect(errors).toEqual([]);
});
