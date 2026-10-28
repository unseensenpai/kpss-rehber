import { expect, test } from '@playwright/test';

/** Collects console errors (CSP violations included) on a page. */
function collectErrors(page) {
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(e.message));
  return errors;
}

test('exam → subject → topic navigation', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('./tr/');
  await page.getByRole('link', { name: /KPSS Lisans Genel Yetenek/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('KPSS Lisans Genel Yetenek – Genel Kültür');
  await expect(page.getByText('Toplam soru')).toBeVisible();

  await page.getByRole('link', { name: 'Tarih', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tarih');
  await expect(page.getByRole('link', { name: 'Osmanlı Tarihi' })).toBeVisible();

  await page.getByRole('link', { name: 'Osmanlı Tarihi' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Osmanlı Tarihi');
  // The topic is used by both KPSS GK and AGS.
  const usages = page.getByRole('table').first();
  await expect(usages.getByRole('link', { name: 'KPSS Lisans' })).toBeVisible();
  await expect(usages.getByRole('link', { name: 'MEB-AGS' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Soru Kitapçığı/ }).first()).toHaveAttribute('href', /dokuman\.osym\.gov\.tr/);

  const report = page.getByRole('link', { name: 'Hata bildir' });
  await expect(report).toHaveAttribute('href', /issues\/new\?template=bug-report\.yml&title=%5BHata%5D\+Osman/);
  expect(errors).toEqual([]);
});

test('a draft topic invites review in each language', async ({ page }) => {
  await page.goto('./tr/topic/tarih/osmanli-tarihi/');
  await expect(page.getByText('Taslak', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'İncelemeye katıl' })).toHaveAttribute('href', /docs\/REVIEW\.tr\.md$/);
  await page.goto('./en/topic/tarih/osmanli-tarihi/');
  await expect(page.getByRole('link', { name: 'Help review' })).toHaveAttribute('href', /docs\/REVIEW\.md$/);
});

test('ÖABT fields are listed in expandable boxes', async ({ page }) => {
  await page.goto('./tr/exam/meb-oabt/');
  // "Fen Bilimleri" also has a Fizik subject; select by the summary title.
  const physics = page.locator('details').filter({ has: page.locator('summary span', { hasText: /^Fizik$/ }) });
  await expect(physics.getByRole('link', { name: 'Mekanik', exact: true })).toBeHidden();
  await physics.locator('summary').click();
  await expect(physics.getByRole('link', { name: 'Mekanik', exact: true })).toBeVisible();
});

test('the sources page lists the official documents', async ({ page }) => {
  await page.goto('./tr/sources/');
  await expect(page.getByRole('link', { name: /2026 KPSS Kılavuzu \(Lisans/ })).toHaveAttribute(
    'href',
    'https://dokuman.osym.gov.tr/pdfdokuman/2026/KPSS/LISANS/kilavuz_Ld01072026.pdf',
  );
});

test('the last viewed exam is remembered on the home page', async ({ page }) => {
  await page.goto('./tr/');
  await expect(page.getByText('Kaldığın yer')).toBeHidden();
  await page.goto('./tr/exam/dhbt/');
  await page.goto('./tr/');
  await expect(page.getByText('Kaldığın yer')).toBeVisible();
  await expect(page.locator('[data-continue] a')).toHaveText('DHBT');
});

test('search returns results without CSP violations', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('./tr/');
  await page.getByLabel('Konu, ders ya da sınav ara').fill('maarif');
  const result = page.locator('.search-results a').first();
  await expect(result).toHaveText(/Türkiye Yüzyılı Maarif Modeli/);
  await result.click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Türkiye Yüzyılı Maarif Modeli');
  expect(errors).toEqual([]);
});

test('no horizontal scrolling on narrow screens', async ({ page }) => {
  // The narrowest common phone width.
  await page.setViewportSize({ width: 320, height: 640 });
  for (const path of ['./tr/', './tr/exam/lisans-alan-bilgisi/', './tr/exam/meb-oabt/', './tr/topic/tarih/osmanli-tarihi/', './tr/sources/', './tr/prompts/', './tr/profile/']) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});
