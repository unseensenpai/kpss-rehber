import { expect, test } from '@playwright/test';

test('ana sayfa açılır ve Türkçe başlık gösterir', async ({ page }) => {
  await page.goto('./');
  await expect(page).toHaveTitle(/KPSS Rehber/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('tema düğmesi koyu/açık arasında geçiş yapar ve hatırlar', async ({ page }) => {
  await page.goto('./');
  const html = page.locator('html');
  const once = await html.getAttribute('data-theme');
  await page.getByRole('button', { name: /tema/i }).click();
  const sonra = await html.getAttribute('data-theme');
  expect(sonra).not.toBe(once);
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', sonra);
});

test('CSP ihlali olmadan yüklenir', async ({ page }) => {
  const hatalar = [];
  page.on('console', (m) => { if (m.type() === 'error') hatalar.push(m.text()); });
  await page.goto('./');
  await page.getByRole('button', { name: /tema/i }).click();
  expect(hatalar).toEqual([]);
});
