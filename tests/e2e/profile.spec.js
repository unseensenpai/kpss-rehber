import { expect, test } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';

const TOPIC = './tr/topic/tarih/osmanli-tarihi/';
const SUBJECT = './tr/exam/lisans-gygk/tarih/';

/** Marks a status on a topic page and waits until it is saved. */
async function setStatus(page, path, status) {
  await page.goto(path);
  await page.getByRole('radio', { name: status }).check();
  await expect(page.locator('[data-status-message]')).toHaveText('Kaydedildi.');
}

/** Downloads the backup from the profile page; returns its path. */
async function downloadBackup(page, testInfo) {
  await page.goto('./tr/profile/');
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: /Yedeği indir/ }).click()]);
  expect(download.suggestedFilename()).toMatch(/^kpss-rehber-backup-\d{4}-\d{2}-\d{2}\.json$/);
  const path = testInfo.outputPath('backup.json');
  await download.saveAs(path);
  return path;
}

async function uploadBackup(page, file, mode = 'Birleştir') {
  await page.goto('./tr/profile/');
  await page.locator('[data-backup-file]').setInputFiles(file);
  await page.getByRole('radio', { name: new RegExp(mode) }).check();
  await page.getByRole('button', { name: /Yedeği yükle/ }).click();
}

test('complete → back up → restore in a clean profile → progress returns', async ({ page, browser }, testInfo) => {
  await setStatus(page, TOPIC, 'Tamamlandı');
  await page.getByLabel(/Notun/).fill('Tımar sistemini tekrar et');
  await expect(page.locator('[data-status-message]')).toHaveText('Kaydedildi.');
  await setStatus(page, './tr/topic/tarih/cagdas-turk-dunya-tarihi/', 'Tekrar edilecek');

  await page.goto(SUBJECT);
  await expect(page.locator('[data-progress-text]').first()).toHaveText('1/4 tamamlandı');
  await expect(page.locator('[data-topic-status-mark="tarih/osmanli-tarihi"]')).toHaveText('Tamamlandı');

  const file = await downloadBackup(page, testInfo);
  const backup = JSON.parse(await readFile(file, 'utf8'));
  expect(backup.version).toBe(2);
  expect(backup.topics['tarih/osmanli-tarihi']).toMatchObject({ status: 'done', note: 'Tımar sistemini tekrar et' });

  // Another computer: an empty browser context.
  const clean = await browser.newContext({ baseURL: testInfo.project.use.baseURL });
  const other = await clean.newPage();
  await other.goto(SUBJECT);
  await expect(other.locator('[data-progress-text]').first()).toHaveText('0/4 tamamlandı');

  await uploadBackup(other, file);
  await expect(other.locator('[data-upload-message]')).toContainText('Yedek yüklendi');
  await expect(other.locator('[data-review-list]')).toContainText('Çağdaş Türk ve Dünya Tarihi');

  await other.goto(SUBJECT);
  await expect(other.locator('[data-progress-text]').first()).toHaveText('1/4 tamamlandı');
  await other.goto(TOPIC);
  await expect(other.getByRole('radio', { name: 'Tamamlandı' })).toBeChecked();
  await expect(other.getByLabel(/Notun/)).toHaveValue('Tımar sistemini tekrar et');
  await clean.close();
});

test('a v1 backup from an older site version still loads', async ({ page }, testInfo) => {
  const v1 = testInfo.outputPath('v1.json');
  await writeFile(v1, JSON.stringify({ surum: 1, konular: { 'tarih/osmanli-tarihi': { durum: 'tamamlandi', guncelleme: '2026-10-01T00:00:00.000Z' } } }));
  await uploadBackup(page, v1);
  await expect(page.locator('[data-upload-message]')).toContainText('Yedek yüklendi');
  await page.goto(TOPIC);
  await expect(page.getByRole('radio', { name: 'Tamamlandı' })).toBeChecked();
});

test('an invalid backup shows Turkish errors and changes nothing', async ({ page }, testInfo) => {
  await setStatus(page, TOPIC, 'Çalışıyorum');
  const notJson = testInfo.outputPath('broken.json');
  await writeFile(notJson, '{ not json');
  await uploadBackup(page, notJson);
  await expect(page.locator('[data-upload-message]')).toContainText('geçerli bir JSON değil');

  const badFields = testInfo.outputPath('bad.json');
  await writeFile(badFields, JSON.stringify({ version: 2, topics: { 'tarih/osmanli-tarihi': { status: 'finished', level: 9 } } }));
  await uploadBackup(page, badFields);
  await expect(page.locator('[data-upload-message]')).toContainText('Yedek geçersiz');
  await expect(page.locator('[data-upload-message] li')).toHaveCount(2);
  await expect(page.locator('[data-upload-message] li').first()).toContainText("bilinmeyen durum 'finished'");

  await page.goto(TOPIC);
  await expect(page.getByRole('radio', { name: 'Çalışıyorum' })).toBeChecked();
});

test('merge keeps the newer record; replace swaps after confirmation', async ({ page }, testInfo) => {
  const old = testInfo.outputPath('old.json');
  await writeFile(
    old,
    JSON.stringify({
      version: 2,
      topics: {
        'tarih/osmanli-tarihi': { status: 'review', updatedAt: '2020-01-01T00:00:00.000Z' },
        'cografya/turkiye-fiziki': { status: 'done', updatedAt: '2020-01-01T00:00:00.000Z' },
      },
    }),
  );
  await setStatus(page, TOPIC, 'Tamamlandı');

  await uploadBackup(page, old, 'Birleştir');
  await expect(page.locator('[data-upload-message]')).toContainText('birleştirildi');
  await page.goto(TOPIC);
  await expect(page.getByRole('radio', { name: 'Tamamlandı' })).toBeChecked(); // the local record is newer
  await page.goto('./tr/topic/cografya/turkiye-fiziki/');
  await expect(page.getByRole('radio', { name: 'Tamamlandı' })).toBeChecked(); // came from the backup

  // Replace: cancel first, then confirm.
  page.once('dialog', (d) => d.dismiss());
  await uploadBackup(page, old, 'Üzerine yaz');
  await expect(page.locator('[data-upload-message]')).toContainText('iptal');
  page.once('dialog', (d) => d.accept());
  await uploadBackup(page, old, 'Üzerine yaz');
  await expect(page.locator('[data-upload-message]')).toContainText('üzerine yazıldı');
  await page.goto(TOPIC);
  await expect(page.getByRole('radio', { name: 'Tekrar edilecek' })).toBeChecked();
});

test('preferences go into prompts; the target date counts down', async ({ page }) => {
  await page.goto('./tr/profile/');
  await page.getByLabel(/Promptlara eklenecek/).fill('Örnekleri tablo hâlinde ver.');
  await expect(page.locator('[data-preferences-message]')).toContainText('Kaydedildi');
  await page.getByLabel('Hedef sınav tarihin').fill('2099-01-01');
  await expect(page.locator('[data-target-message]')).toContainText('gün kaldı');

  await page.goto(TOPIC);
  const text = await page.locator('[data-template="explain-topic"] [data-preview]').textContent();
  expect(text).toContain('Öğrencinin tercihleri: Örnekleri tablo hâlinde ver.');
});

test('delete removes the whole profile after confirmation', async ({ page }) => {
  await setStatus(page, TOPIC, 'Tamamlandı');
  await page.goto('./tr/profile/');
  page.once('dialog', (d) => d.accept());
  await page.getByRole('button', { name: 'Tüm verilerimi sil' }).click();
  await expect(page.locator('[data-delete-message]')).toHaveText('Tüm verilerin silindi.');
  await page.goto(TOPIC);
  await expect(page.getByRole('radio', { name: 'Başlanmadı' })).toBeChecked();
});

test('without storage every page shows a warning', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } });
  });
  await page.goto('./tr/');
  await expect(page.locator('[data-storage-warning]')).toBeVisible();
  await page.goto(TOPIC);
  await page.getByRole('radio', { name: 'Tamamlandı' }).check();
  await expect(page.locator('[data-status-message]')).toContainText('Kaydedilemedi');
});
