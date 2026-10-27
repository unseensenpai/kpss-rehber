import { expect, test } from '@playwright/test';

const TOPIC = './tr/topic/tarih/osmanli-tarihi/';

test.beforeEach(async ({ context, page }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  // Capture the opened address instead of leaving the site.
  await page.addInitScript(() => {
    window.__opened = [];
    window.open = (url) => { window.__opened.push(String(url)); return null; };
  });
});

// The Windows clipboard turns line endings into CRLF.
const clipboard = (page) => page.evaluate(async () => (await navigator.clipboard.readText()).replace(/\r\n/g, '\n'));
const card = (page, id) => page.locator(`[data-template="${id}"]`);
const preview = (page, id) => card(page, id).locator('[data-preview]').textContent();

test('a topic page shows 6 general prompt cards with highlighted student fields', async ({ page }) => {
  await page.goto(TOPIC);
  await expect(page.locator('[data-template]:visible')).toHaveCount(6);
  await expect(card(page, 'current-events')).toBeHidden();
  await card(page, 'solve-step-by-step').getByText('Promptu gör').click();
  await expect(card(page, 'solve-step-by-step').locator('mark.student-field')).toHaveText('[SORUYU BURAYA YAPIŞTIR]');
  expect(await preview(page, 'explain-topic')).toContain('Konu: Osmanlı Tarihi');
  expect(await preview(page, 'explain-topic')).not.toMatch(/\{\{|\}\}/);
});

test('the Güncel Bilgiler topic also has the current events prompt', async ({ page }) => {
  await page.goto('./tr/topic/guncel-bilgiler/turkiye-dunya-guncel/');
  await expect(page.locator('[data-template]:visible')).toHaveCount(7);
  await expect(card(page, 'current-events')).toBeVisible();
});

test('copy writes the full text to the clipboard', async ({ page }) => {
  await page.goto(TOPIC);
  await card(page, 'explain-topic').getByRole('button', { name: /Kopyala/ }).click();
  await expect(card(page, 'explain-topic').locator('[data-notice]')).toHaveText(/Kopyalandı/);
  expect(await clipboard(page)).toBe(await preview(page, 'explain-topic'));
});

for (const [label, base, param] of [
  ["ChatGPT'de aç", 'https://chatgpt.com/', 'prompt'],
  ["Claude'da aç", 'https://claude.ai/new', 'q'],
]) {
  test(`${label}: correct address and a clipboard copy`, async ({ page }) => {
    await page.goto(TOPIC);
    await card(page, 'generate-questions').getByRole('button', { name: label }).click();
    await expect(card(page, 'generate-questions').locator('[data-notice]')).toHaveText(/panoya da kopyalandı/);
    const [opened] = await page.evaluate(() => window.__opened);
    const url = new URL(opened);
    const text = await preview(page, 'generate-questions');
    expect(url.origin + url.pathname).toBe(base);
    expect(url.searchParams.get(param)).toBe(text);
    expect(await clipboard(page)).toBe(text);
  });
}

test('feedback adapts the level and is saved for the topic', async ({ page }) => {
  await page.goto(TOPIC);
  const level = page.locator('[data-level]');
  await expect(level).toHaveValue('3');
  await page.getByRole('button', { name: 'Çok basitti' }).click();
  await expect(level).toHaveValue('4');
  await expect(page.locator('[data-adapt-message]')).toHaveText(/Orta → Zor/);
  // Same direction twice: one extra step (capped at 5).
  await page.getByRole('button', { name: 'Çok basitti' }).click();
  await expect(level).toHaveValue('5');
  await page.getByRole('button', { name: 'Çok uzundu' }).click();
  await expect(page.locator('[data-length]')).toHaveValue('brief');
  expect(await preview(page, 'explain-topic')).toContain('Seviye (İleri)');

  await page.reload();
  await expect(level).toHaveValue('5');
  // A new topic in the same subject starts with these settings.
  await page.goto('./tr/topic/tarih/cagdas-turk-dunya-tarihi/');
  await expect(page.locator('[data-level]')).toHaveValue('5');
  await expect(page.locator('[data-length]')).toHaveValue('brief');
});

test('a manual choice always applies and is saved', async ({ page }) => {
  await page.goto(TOPIC);
  await page.locator('[data-length]').selectOption('detailed');
  expect(await preview(page, 'explain-topic')).toContain('Ayrıntılı anlat');
  await page.reload();
  await expect(page.locator('[data-length]')).toHaveValue('detailed');
});

test('prompt library: exam and topic choice fill the prompt', async ({ page }) => {
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('./tr/prompts/');
  const exam = page.locator('[data-exam-select]');
  await expect(exam).toHaveValue('lisans-gygk');
  expect(await preview(page, 'explain-topic')).toContain('Sınav: KPSS Lisans Genel Yetenek – Genel Kültür');

  await exam.selectOption('meb-ags');
  await page.locator('[data-topic-select]').selectOption('egitim-bilimleri/maarif-modeli');
  const text = await preview(page, 'explain-topic');
  expect(text).toContain('Sınav: MEB Akademi Giriş Sınavı (AGS)');
  expect(text).toContain('Ders: Eğitim Bilimleri ve Türk Millî Eğitim Sistemi');
  expect(text).toContain('Konu: Türkiye Yüzyılı Maarif Modeli');
  expect(errors).toEqual([]);
});

test('without storage a warning shows and prompts still work', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } });
  });
  await page.goto(TOPIC);
  await page.locator('[data-level]').selectOption('2');
  await expect(page.locator('[data-save-warning]')).toBeVisible();
  expect(await preview(page, 'explain-topic')).toContain('Seviye (Kolay)');
});
