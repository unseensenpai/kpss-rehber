import { expect, test } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';

const KONU = './konu/tarih/osmanli-tarihi/';
const DERS = './sinav/lisans-gygk/tarih/';

/** Konu sayfasında durumu işaretler ve kaydı bekler. */
async function durumSec(page, yol, durum) {
  await page.goto(yol);
  await page.getByRole('radio', { name: durum }).check();
  await expect(page.locator('[data-durum-mesaji]')).toHaveText('Kaydedildi.');
}

/** Profil sayfasında yedeği indirir; dosya yolunu döner. */
async function yedekIndir(page, testInfo) {
  await page.goto('./profil/');
  const [indirme] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: /Yedeği indir/ }).click()]);
  expect(indirme.suggestedFilename()).toMatch(/^kpss-rehber-yedek-\d{4}-\d{2}-\d{2}\.json$/);
  const yol = testInfo.outputPath('yedek.json');
  await indirme.saveAs(yol);
  return yol;
}

async function yedekYukle(page, dosya, kip = 'Birleştir') {
  await page.goto('./profil/');
  await page.locator('[data-yedek-dosyasi]').setInputFiles(dosya);
  await page.getByRole('radio', { name: new RegExp(kip) }).check();
  await page.getByRole('button', { name: /Yedeği yükle/ }).click();
}

test('tamamla → yedekle → temiz profilde yükle → ilerleme geri gelir', async ({ page, browser }, testInfo) => {
  await durumSec(page, KONU, 'Tamamlandı');
  await page.getByLabel(/Notun/).fill('Tımar sistemini tekrar et');
  await expect(page.locator('[data-durum-mesaji]')).toHaveText('Kaydedildi.');
  await durumSec(page, './konu/tarih/cagdas-turk-dunya-tarihi/', 'Tekrar edilecek');

  await page.goto(DERS);
  await expect(page.locator('[data-ilerleme-metin]').first()).toHaveText('1/4 tamamlandı');
  await expect(page.locator('[data-konu-durum="tarih/osmanli-tarihi"]')).toHaveText('Tamamlandı');

  const dosya = await yedekIndir(page, testInfo);
  const yedek = JSON.parse(await readFile(dosya, 'utf8'));
  expect(yedek.konular['tarih/osmanli-tarihi']).toMatchObject({ durum: 'tamamlandi', not: 'Tımar sistemini tekrar et' });

  // Başka bir bilgisayar: boş tarayıcı bağlamı.
  const temiz = await browser.newContext({ baseURL: testInfo.project.use.baseURL });
  const sayfa = await temiz.newPage();
  await sayfa.goto(DERS);
  await expect(sayfa.locator('[data-ilerleme-metin]').first()).toHaveText('0/4 tamamlandı');

  await yedekYukle(sayfa, dosya);
  await expect(sayfa.locator('[data-yukle-mesaji]')).toContainText('Yedek yüklendi');
  await expect(sayfa.locator('[data-tekrar-listesi]')).toContainText('Çağdaş Türk ve Dünya Tarihi');

  await sayfa.goto(DERS);
  await expect(sayfa.locator('[data-ilerleme-metin]').first()).toHaveText('1/4 tamamlandı');
  await sayfa.goto(KONU);
  await expect(sayfa.getByRole('radio', { name: 'Tamamlandı' })).toBeChecked();
  await expect(sayfa.getByLabel(/Notun/)).toHaveValue('Tımar sistemini tekrar et');
  await temiz.close();
});

test('geçersiz yedek Türkçe hata verir ve verileri değiştirmez', async ({ page }, testInfo) => {
  await durumSec(page, KONU, 'Çalışıyorum');
  const bozukJson = testInfo.outputPath('bozuk.json');
  await writeFile(bozukJson, '{ bu json değil');
  await yedekYukle(page, bozukJson);
  await expect(page.locator('[data-yukle-mesaji]')).toContainText('geçerli bir JSON değil');

  const yanlisAlan = testInfo.outputPath('yanlis.json');
  await writeFile(yanlisAlan, JSON.stringify({ surum: 1, konular: { 'tarih/osmanli-tarihi': { durum: 'bitti', seviye: 9 } } }));
  await yedekYukle(page, yanlisAlan);
  await expect(page.locator('[data-yukle-mesaji]')).toContainText('Yedek geçersiz');
  await expect(page.locator('[data-yukle-mesaji] li')).toHaveCount(2);

  await page.goto(KONU);
  await expect(page.getByRole('radio', { name: 'Çalışıyorum' })).toBeChecked();
});

test('birleştir güncel olanı korur, üzerine yaz onayla değiştirir', async ({ page }, testInfo) => {
  const eski = testInfo.outputPath('eski.json');
  await writeFile(
    eski,
    JSON.stringify({
      surum: 1,
      konular: {
        'tarih/osmanli-tarihi': { durum: 'tekrar', guncelleme: '2020-01-01T00:00:00.000Z' },
        'cografya/turkiye-fiziki': { durum: 'tamamlandi', guncelleme: '2020-01-01T00:00:00.000Z' },
      },
    }),
  );
  await durumSec(page, KONU, 'Tamamlandı');

  await yedekYukle(page, eski, 'Birleştir');
  await expect(page.locator('[data-yukle-mesaji]')).toContainText('birleştirildi');
  await page.goto(KONU);
  await expect(page.getByRole('radio', { name: 'Tamamlandı' })).toBeChecked(); // yerel kayıt daha yeni
  await page.goto('./konu/cografya/turkiye-fiziki/');
  await expect(page.getByRole('radio', { name: 'Tamamlandı' })).toBeChecked(); // yedekten geldi

  // Üzerine yaz: önce vazgeç, sonra onayla.
  page.once('dialog', (d) => d.dismiss());
  await yedekYukle(page, eski, 'Üzerine yaz');
  await expect(page.locator('[data-yukle-mesaji]')).toContainText('iptal');
  page.once('dialog', (d) => d.accept());
  await yedekYukle(page, eski, 'Üzerine yaz');
  await expect(page.locator('[data-yukle-mesaji]')).toContainText('üzerine yazıldı');
  await page.goto(KONU);
  await expect(page.getByRole('radio', { name: 'Tekrar edilecek' })).toBeChecked();
});

test('tercihler promptlara eklenir; hedef tarih geri sayar', async ({ page }) => {
  await page.goto('./profil/');
  await page.getByLabel(/Promptlara eklenecek/).fill('Örnekleri tablo hâlinde ver.');
  await expect(page.locator('[data-tercih-mesaji]')).toContainText('Kaydedildi');
  await page.getByLabel('Hedef sınav tarihin').fill('2099-01-01');
  await expect(page.locator('[data-hedef-mesaji]')).toContainText('gün kaldı');

  await page.goto(KONU);
  const metin = await page.locator('[data-sablon="konu-anlat"] [data-onizleme]').textContent();
  expect(metin).toContain('Öğrencinin tercihleri: Örnekleri tablo hâlinde ver.');
});

test('verileri sil onayla tüm profili kaldırır', async ({ page }) => {
  await durumSec(page, KONU, 'Tamamlandı');
  await page.goto('./profil/');
  page.once('dialog', (d) => d.accept());
  await page.getByRole('button', { name: 'Tüm verilerimi sil' }).click();
  await expect(page.locator('[data-sil-mesaji]')).toHaveText('Tüm verilerin silindi.');
  await page.goto(KONU);
  await expect(page.getByRole('radio', { name: 'Başlanmadı' })).toBeChecked();
});

test('depolama kapalıysa her sayfada uyarı görünür', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('engelli'); } });
  });
  await page.goto('./');
  await expect(page.locator('[data-depolama-uyari]')).toBeVisible();
  await page.goto(KONU);
  await page.getByRole('radio', { name: 'Tamamlandı' }).check();
  await expect(page.locator('[data-durum-mesaji]')).toContainText('Kaydedilemedi');
});
