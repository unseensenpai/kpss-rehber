import { DURUMLAR, ilerleme } from '../lib/profil-veri.js';
import { profilOku } from './profil.js';

/** Sayfadaki ilerleme çubuklarını ve konu durum işaretlerini profile göre doldurur. */
export function ilerlemeleriCiz() {
  const { konular } = profilOku();

  for (const el of document.querySelectorAll('[data-ilerleme]')) {
    const i = ilerleme(JSON.parse(el.dataset.ilerleme), konular);
    el.querySelector('progress').value = i.yuzde;
    el.querySelector('[data-ilerleme-metin]').textContent = `${i.tamamlanan}/${i.toplam} tamamlandı`;
    el.hidden = false;
  }

  for (const el of document.querySelectorAll('[data-konu-durum]')) {
    const durum = konular[el.dataset.konuDurum]?.durum;
    el.hidden = !durum;
    el.textContent = durum ? DURUMLAR[durum] : '';
    if (durum) el.dataset.durum = durum;
  }
}

ilerlemeleriCiz();
