import { geriSayimMetni, kalanGun } from '../lib/mufredat.js';

for (const el of document.querySelectorAll('[data-geri-sayim]')) {
  el.textContent = geriSayimMetni(kalanGun(new Date(el.dataset.geriSayim)));
}
