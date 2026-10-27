import { expect, test } from '@playwright/test';

const KONU = './konu/tarih/osmanli-tarihi/';

test.beforeEach(async ({ context, page }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  // Dış siteye gitmeden açılan adresi yakala.
  await page.addInitScript(() => {
    window.__acilan = [];
    window.open = (url) => { window.__acilan.push(String(url)); return null; };
  });
});

// Windows panosu satır sonlarını CRLF'ye çevirir.
const pano = (page) => page.evaluate(async () => (await navigator.clipboard.readText()).replace(/\r\n/g, '\n'));
const kart = (page, id) => page.locator(`[data-sablon="${id}"]`);
const onizleme = (page, id) => kart(page, id).locator('[data-onizleme]').textContent();

test('konu sayfasında 6 genel prompt kartı; öğrenci alanı vurgulu', async ({ page }) => {
  await page.goto(KONU);
  await expect(page.locator('[data-sablon]:visible')).toHaveCount(6);
  await expect(kart(page, 'guncel-olaylar')).toBeHidden();
  await kart(page, 'cozum-adim-adim').getByText('Promptu gör').click();
  await expect(kart(page, 'cozum-adim-adim').locator('mark.ogrenci-alani')).toHaveText('[SORUYU BURAYA YAPIŞTIR]');
  expect(await onizleme(page, 'konu-anlat')).toContain('Konu: Osmanlı Tarihi');
  expect(await onizleme(page, 'konu-anlat')).not.toMatch(/\{\{|\}\}/);
});

test('Güncel Bilgiler konusunda özel güncel olaylar promptu da var', async ({ page }) => {
  await page.goto('./konu/guncel-bilgiler/turkiye-dunya-guncel/');
  await expect(page.locator('[data-sablon]:visible')).toHaveCount(7);
  await expect(kart(page, 'guncel-olaylar')).toBeVisible();
});

test('kopyala panoya tam metni yazar', async ({ page }) => {
  await page.goto(KONU);
  await kart(page, 'konu-anlat').getByRole('button', { name: /Kopyala/ }).click();
  await expect(kart(page, 'konu-anlat').locator('[data-bildirim]')).toHaveText(/Kopyalandı/);
  expect(await pano(page)).toBe(await onizleme(page, 'konu-anlat'));
});

for (const [ad, host, parametre] of [
  ["ChatGPT'de aç", 'https://chatgpt.com/', 'prompt'],
  ["Claude'da aç", 'https://claude.ai/new', 'q'],
]) {
  test(`${ad}: doğru adres + panoya kopya`, async ({ page }) => {
    await page.goto(KONU);
    await kart(page, 'ornek-soru-uret').getByRole('button', { name: ad }).click();
    await expect(kart(page, 'ornek-soru-uret').locator('[data-bildirim]')).toHaveText(/panoya da kopyalandı/);
    const [acilan] = await page.evaluate(() => window.__acilan);
    const url = new URL(acilan);
    const metin = await onizleme(page, 'ornek-soru-uret');
    expect(url.origin + url.pathname).toBe(host);
    expect(url.searchParams.get(parametre)).toBe(metin);
    expect(await pano(page)).toBe(metin);
  });
}

test('geri bildirim seviyeyi uyarlar ve konu için saklanır', async ({ page }) => {
  await page.goto(KONU);
  const seviye = page.locator('[data-seviye]');
  await expect(seviye).toHaveValue('3');
  await page.getByRole('button', { name: 'Çok basitti' }).click();
  await expect(seviye).toHaveValue('4');
  await expect(page.locator('[data-uyarlama-mesaji]')).toHaveText(/Orta → Zor/);
  // Art arda aynı yön: bir kademe daha (4 → 5'te sınırlanır).
  await page.getByRole('button', { name: 'Çok basitti' }).click();
  await expect(seviye).toHaveValue('5');
  await page.getByRole('button', { name: 'Çok uzundu' }).click();
  await expect(page.locator('[data-uzunluk]')).toHaveValue('ozet');
  expect(await onizleme(page, 'konu-anlat')).toContain('Seviye (İleri)');

  await page.reload();
  await expect(seviye).toHaveValue('5');
  // Aynı dersteki yeni konu bu ayarla başlar.
  await page.goto('./konu/tarih/cagdas-turk-dunya-tarihi/');
  await expect(page.locator('[data-seviye]')).toHaveValue('5');
  await expect(page.locator('[data-uzunluk]')).toHaveValue('ozet');
});

test('manuel seçim her zaman uygulanır ve saklanır', async ({ page }) => {
  await page.goto(KONU);
  await page.locator('[data-uzunluk]').selectOption('detayli');
  expect(await onizleme(page, 'konu-anlat')).toContain('Ayrıntılı anlat');
  await page.reload();
  await expect(page.locator('[data-uzunluk]')).toHaveValue('detayli');
});

test('prompt kütüphanesi: sınav ve konu seçimi promptu doldurur', async ({ page }) => {
  const hatalar = [];
  page.on('console', (m) => { if (m.type() === 'error') hatalar.push(m.text()); });
  await page.goto('./promptlar/');
  const sinav = page.locator('[data-sinav-sec]');
  await expect(sinav).toHaveValue('lisans-gygk');
  expect(await onizleme(page, 'konu-anlat')).toContain('Sınav: KPSS Lisans Genel Yetenek – Genel Kültür');

  await sinav.selectOption('meb-ags');
  await page.locator('[data-konu-sec]').selectOption('egitim-bilimleri/maarif-modeli');
  const metin = await onizleme(page, 'konu-anlat');
  expect(metin).toContain('Sınav: MEB Akademi Giriş Sınavı (AGS)');
  expect(metin).toContain('Ders: Eğitim Bilimleri ve Türk Millî Eğitim Sistemi');
  expect(metin).toContain('Konu: Türkiye Yüzyılı Maarif Modeli');
  expect(hatalar).toEqual([]);
});

test('depolama kapalıysa uyarı gösterir, promptlar yine çalışır', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('engelli'); } });
  });
  await page.goto(KONU);
  await page.locator('[data-seviye]').selectOption('2');
  await expect(page.locator('[data-kayit-uyari]')).toBeVisible();
  expect(await onizleme(page, 'konu-anlat')).toContain('Seviye (Kolay)');
});
