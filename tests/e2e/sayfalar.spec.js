import { expect, test } from '@playwright/test';

/** Sayfadaki konsol hatalarını (CSP ihlalleri dahil) toplar. */
function hatalariTopla(page) {
  const hatalar = [];
  page.on('console', (m) => { if (m.type() === 'error') hatalar.push(m.text()); });
  page.on('pageerror', (e) => hatalar.push(e.message));
  return hatalar;
}

test('sınav → ders → konu gezinmesi', async ({ page }) => {
  const hatalar = hatalariTopla(page);
  await page.goto('./');
  await page.getByRole('link', { name: /KPSS Lisans Genel Yetenek/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('KPSS Lisans Genel Yetenek – Genel Kültür');
  await expect(page.getByText('Toplam soru')).toBeVisible();

  await page.getByRole('link', { name: 'Tarih', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tarih');
  await expect(page.getByRole('link', { name: 'Osmanlı Tarihi' })).toBeVisible();

  await page.getByRole('link', { name: 'Osmanlı Tarihi' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Osmanlı Tarihi');
  // Konu hem KPSS GK'da hem AGS'de geçer.
  const sinavlar = page.getByRole('table').first();
  await expect(sinavlar.getByRole('link', { name: 'KPSS Lisans' })).toBeVisible();
  await expect(sinavlar.getByRole('link', { name: 'MEB-AGS' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Soru Kitapçığı/ }).first()).toHaveAttribute('href', /dokuman\.osym\.gov\.tr/);

  const bildir = page.getByRole('link', { name: 'Hata bildir' });
  await expect(bildir).toHaveAttribute('href', /issues\/new\?.*title=%5BHata%5D\+Osman/);
  expect(hatalar).toEqual([]);
});

test('ÖABT branşları açılır kutularda listelenir', async ({ page }) => {
  await page.goto('./sinav/meb-oabt/');
  // "Fen Bilimleri" kutusunda da Fizik dersi var; başlığa göre seç.
  const fizik = page.locator('details').filter({ has: page.locator('summary span', { hasText: /^Fizik$/ }) });
  await expect(fizik.getByRole('link', { name: 'Mekanik', exact: true })).toBeHidden();
  await fizik.locator('summary').click();
  await expect(fizik.getByRole('link', { name: 'Mekanik', exact: true })).toBeVisible();
});

test('kaynaklar sayfası resmi belgeleri listeler', async ({ page }) => {
  await page.goto('./kaynaklar/');
  await expect(page.getByRole('link', { name: /2026 KPSS Kılavuzu \(Lisans/ })).toHaveAttribute(
    'href',
    'https://dokuman.osym.gov.tr/pdfdokuman/2026/KPSS/LISANS/kilavuz_Ld01072026.pdf',
  );
});

test('son bakılan sınav ana sayfada hatırlanır', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByText('Kaldığın yer')).toBeHidden();
  await page.goto('./sinav/dhbt/');
  await page.goto('./');
  await expect(page.getByText('Kaldığın yer')).toBeVisible();
  await expect(page.locator('[data-devam] a')).toHaveText('DHBT');
});

test('arama sonuç getirir ve CSP ihlali olmaz', async ({ page }) => {
  const hatalar = hatalariTopla(page);
  await page.goto('./');
  await page.getByLabel('Konu, ders ya da sınav ara').fill('maarif');
  const sonuc = page.locator('.arama-sonuclari a').first();
  await expect(sonuc).toHaveText(/Türkiye Yüzyılı Maarif Modeli/);
  await sonuc.click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Türkiye Yüzyılı Maarif Modeli');
  expect(hatalar).toEqual([]);
});

test('dar ekranda yatay kaydırma yok', async ({ page }) => {
  // En dar yaygın telefon genişliği.
  await page.setViewportSize({ width: 320, height: 640 });
  for (const yolu of ['./', './sinav/lisans-alan-bilgisi/', './sinav/meb-oabt/', './konu/tarih/osmanli-tarihi/', './kaynaklar/', './promptlar/', './profil/']) {
    await page.goto(yolu);
    const tasma = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(tasma, yolu).toBeLessThanOrEqual(0);
  }
});
