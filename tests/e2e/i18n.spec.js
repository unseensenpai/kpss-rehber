import { expect, test } from '@playwright/test';

/** Collects console errors (CSP violations included) on a page. */
function collectErrors(page) {
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(e.message));
  return errors;
}

test('English pages render in English', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('./en/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Which exam are you preparing for?');
  await page.getByRole('link', { name: /KPSS Bachelor's General Ability/ }).click();
  await expect(page.getByText('Total questions')).toBeVisible();
  await page.getByRole('link', { name: 'History', exact: true }).click();
  await page.getByRole('link', { name: 'Ottoman History' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ottoman History');
  await expect(page.getByText('Official scope:')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Report a mistake' })).toHaveAttribute('href', /title=%5BBug%5D\+Ottoman/);
  expect(errors).toEqual([]);
});

test('English prompts use English templates and names', async ({ page }) => {
  await page.goto('./en/topic/tarih/osmanli-tarihi/');
  const text = await page.locator('[data-template="explain-topic"] [data-preview]').textContent();
  expect(text).toContain("Exam: KPSS Bachelor's General Ability – General Culture");
  expect(text).toContain('Subject: History');
  expect(text).toContain('Topic: Ottoman History');
  expect(text).toContain('Level (Medium)');
  await page.locator('[data-template="solve-step-by-step"] summary').click();
  await expect(page.locator('[data-template="solve-step-by-step"] mark.student-field')).toHaveText('[PASTE THE QUESTION HERE]');
});

test('the language switcher keeps the same page and is remembered', async ({ page }) => {
  await page.goto('./tr/exam/dhbt/');
  await page.getByRole('link', { name: 'English' }).click();
  await expect(page).toHaveURL(/\/kpss-rehber\/en\/exam\/dhbt\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Religious Services Field Knowledge Test (DHBT)');
  await page.goto('./');
  await expect(page).toHaveURL(/\/kpss-rehber\/en\/$/);
  await page.getByRole('link', { name: 'Türkçe' }).click();
  await expect(page).toHaveURL(/\/kpss-rehber\/tr\/$/);
});

test('the root page follows the browser language', async ({ browser }, testInfo) => {
  const context = await browser.newContext({ baseURL: testInfo.project.use.baseURL, locale: 'en-US' });
  const page = await context.newPage();
  await page.goto('./');
  await expect(page).toHaveURL(/\/kpss-rehber\/en\/$/);
  await context.close();
});

test('progress is shared across languages', async ({ page }) => {
  await page.goto('./tr/topic/tarih/osmanli-tarihi/');
  await page.getByRole('radio', { name: 'Tamamlandı' }).check();
  await page.goto('./en/topic/tarih/osmanli-tarihi/');
  await expect(page.getByRole('radio', { name: 'Done' })).toBeChecked();
});

test('English search finds English pages', async ({ page }) => {
  await page.goto('./en/');
  await page.getByLabel('Search for a topic, subject or exam').fill('ottoman');
  const result = page.locator('.search-results a').first();
  await expect(result).toHaveText(/Ottoman/);
  await expect(result).toHaveAttribute('href', /\/en\//);
});
