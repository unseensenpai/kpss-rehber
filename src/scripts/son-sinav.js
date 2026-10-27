/**
 * Son bakılan sınavı hatırlar. Sınav sayfası `data-son-sinav` ile kaydeder,
 * ana sayfadaki gizli `data-devam` bağlantısı varsa onu gösterir.
 */
const ANAHTAR = 'kpss-rehber:son-sinav';

function oku() {
  try { return JSON.parse(localStorage.getItem(ANAHTAR) ?? 'null'); } catch { return null; }
}

const kaydedilecek = document.querySelector('[data-son-sinav]');
if (kaydedilecek) {
  const { sinavId, ad, href } = kaydedilecek.dataset;
  try { localStorage.setItem(ANAHTAR, JSON.stringify({ sinavId, ad, href })); } catch { /* gizli sekme vb. */ }
}

const devam = document.querySelector('[data-devam]');
const son = oku();
if (devam && son?.href && son?.ad) {
  const link = devam.querySelector('a');
  link.href = son.href;
  link.textContent = son.ad;
  devam.hidden = false;
}
