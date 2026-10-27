import { depolamaKullanilabilir } from './profil.js';

// Depolama yoksa site çalışır ama ilerleme kaydedilmez; bunu her sayfada söyle.
if (!depolamaKullanilabilir()) {
  for (const el of document.querySelectorAll('[data-depolama-uyari]')) el.hidden = false;
}
