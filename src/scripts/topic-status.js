import { translator } from '../i18n/index.js';
import { readProfile, saveTopic } from './profile-store.js';

const t = translator(document.documentElement.lang);

for (const root of document.querySelectorAll('[data-topic-status]')) {
  const topicId = root.dataset.topicStatus;
  const message = root.querySelector('[data-status-message]');
  const note = root.querySelector('[data-note]');
  const record = readProfile().topics[topicId] ?? {};

  root.querySelector(`input[name="status"][value="${record.status ?? ''}"]`).checked = true;
  note.value = record.note ?? '';

  const report = (ok) => {
    message.textContent = ok ? t('topicStatus.saved') : t('topicStatus.notSaved');
  };

  for (const radio of root.querySelectorAll('input[name="status"]')) {
    radio.addEventListener('change', () => report(saveTopic(topicId, { status: radio.value || undefined })));
  }

  let timer;
  note.addEventListener('input', () => {
    clearTimeout(timer);
    message.textContent = '';
    timer = setTimeout(() => report(saveTopic(topicId, { note: note.value || undefined })), 400);
  });
}
