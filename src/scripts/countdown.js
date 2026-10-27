import { daysUntil } from '../lib/curriculum.js';
import { translator } from '../i18n/index.js';

const t = translator(document.documentElement.lang);
for (const el of document.querySelectorAll('[data-countdown]')) {
  el.textContent = t('countdown', { days: daysUntil(new Date(el.dataset.countdown)) });
}
