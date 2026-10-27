import { konuKaydet, profilOku } from './profil.js';

for (const kok of document.querySelectorAll('[data-konu-durumu]')) {
  const konuId = kok.dataset.konuDurumu;
  const mesaj = kok.querySelector('[data-durum-mesaji]');
  const not = kok.querySelector('[data-not]');
  const kayit = profilOku().konular[konuId] ?? {};

  kok.querySelector(`input[name="durum"][value="${kayit.durum ?? ''}"]`).checked = true;
  not.value = kayit.not ?? '';

  const bildir = (tamam) => {
    mesaj.textContent = tamam ? 'Kaydedildi.' : 'Kaydedilemedi: tarayıcın depolamaya izin vermiyor.';
  };

  for (const radyo of kok.querySelectorAll('input[name="durum"]')) {
    radyo.addEventListener('change', () => bildir(konuKaydet(konuId, { durum: radyo.value || undefined })));
  }

  let zamanlayici;
  not.addEventListener('input', () => {
    clearTimeout(zamanlayici);
    mesaj.textContent = '';
    zamanlayici = setTimeout(() => bildir(konuKaydet(konuId, { not: not.value || undefined })), 400);
  });
}
