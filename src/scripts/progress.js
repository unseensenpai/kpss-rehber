import { progress } from '../lib/profile-data.js';
import { translator } from '../i18n/index.js';
import { readProfile } from './profile-store.js';

const t = translator(document.documentElement.lang);

/** Fills the page's progress bars and topic status marks from the profile. */
export function renderProgress() {
  const { topics } = readProfile();

  for (const el of document.querySelectorAll('[data-progress]')) {
    const p = progress(JSON.parse(el.dataset.progress), topics);
    el.querySelector('progress').value = p.percent;
    el.querySelector('[data-progress-text]').textContent = t('progress.text', { done: p.done, total: p.total });
    el.hidden = false;
  }

  for (const el of document.querySelectorAll('[data-topic-status-mark]')) {
    const status = topics[el.dataset.topicStatusMark]?.status;
    el.hidden = !status;
    el.textContent = status ? t(`status.${status}`) : '';
    if (status) el.dataset.status = status;
  }
}

renderProgress();
