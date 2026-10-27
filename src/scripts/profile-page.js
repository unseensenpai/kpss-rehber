/**
 * Profile page: goal, preferences, progress summary, backup / restore (merge |
 * replace) and delete. An invalid backup changes nothing.
 */
import { applyAliases, BACKUP_SIZE_LIMIT, backupFileName, mergeProfiles, validateProfile } from '../lib/profile-data.js';
import { daysUntil } from '../lib/curriculum.js';
import { translator } from '../i18n/index.js';
import { deleteProfile, readProfile, saveSettings, writeProfile } from './profile-store.js';
import { renderProgress } from './progress.js';

const t = translator(document.documentElement.lang);
const root = document.querySelector('[data-profile-page]');
if (root) setup(root);

function setup(root) {
  const data = JSON.parse(root.dataset.page);
  const $ = (s) => root.querySelector(s);
  const examSelect = $('[data-selected-exam]');
  const targetDate = $('[data-target-date]');
  const preferences = $('[data-preferences]');

  // If topic ids changed, move old records to the new ids once.
  const initial = readProfile();
  const moved = applyAliases(initial, data.aliases);
  if (Object.keys(moved.topics).join() !== Object.keys(initial.topics).join()) writeProfile(moved);

  function targetMessage() {
    const d = targetDate.value;
    $('[data-target-message]').textContent = d ? t('profile.targetCountdown', { countdown: t('countdown', { days: daysUntil(new Date(d)) }) }) : '';
  }

  function render() {
    const p = readProfile();
    examSelect.value = p.selectedExam ?? '';
    targetDate.value = p.targetDate ?? '';
    preferences.value = p.preferences ?? '';
    targetMessage();
    renderProgress();

    const review = Object.entries(p.topics).filter(([id, x]) => x.status === 'review' && data.topics[id]);
    $('[data-review-list]').replaceChildren(
      ...review.map(([id]) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = data.topics[id].href;
        a.textContent = data.topics[id].title;
        li.append(a);
        return li;
      }),
    );
    $('[data-review-empty]').hidden = review.length > 0;
  }

  examSelect.addEventListener('change', () => saveSettings({ selectedExam: examSelect.value || null }));
  targetDate.addEventListener('change', () => {
    saveSettings({ targetDate: targetDate.value || null });
    targetMessage();
  });
  let timer;
  preferences.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const ok = saveSettings({ preferences: preferences.value.trim() });
      $('[data-preferences-message]').textContent = ok ? t('profile.preferencesSaved') : t('profile.notSaved');
    }, 400);
  });

  $('[data-download]').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(readProfile(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = backupFileName();
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  const uploadMessage = $('[data-upload-message]');
  function report(title, errors = [], failed = false) {
    const p = document.createElement('p');
    p.className = failed ? 'error' : 'success';
    p.textContent = title;
    const ul = document.createElement('ul');
    const items = errors.slice(0, 10).map((e) => Object.assign(document.createElement('li'), { textContent: t(`profile.errors.${e.code}`, e.params) }));
    ul.append(...items);
    if (errors.length > 10) ul.append(Object.assign(document.createElement('li'), { textContent: t('profile.moreErrors', { n: errors.length - 10 }) }));
    uploadMessage.replaceChildren(p, ...(errors.length ? [ul] : []));
  }

  $('[data-upload-form]').addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = $('[data-backup-file]').files[0];
    if (!file) return;
    if (file.size > BACKUP_SIZE_LIMIT) return report(t('profile.tooLarge'), [], true);
    let raw;
    try {
      raw = JSON.parse(await file.text());
    } catch {
      return report(t('profile.notJson'), [], true);
    }
    const { errors, profile: incoming } = validateProfile(raw);
    if (!incoming) return report(t('profile.invalid'), errors, true);

    const mode = root.querySelector('input[name="mode"]:checked').value;
    const mapped = applyAliases(incoming, data.aliases);
    let next;
    if (mode === 'replace') {
      if (!confirm(t('profile.confirmReplace'))) return report(t('profile.cancelled'));
      next = mapped;
    } else {
      next = mergeProfiles(readProfile(), mapped);
    }
    if (!writeProfile(next)) return report(t('profile.writeFailed'), [], true);
    const n = Object.keys(incoming.topics).length;
    report(t('profile.loaded', { mode: t(mode === 'merge' ? 'profile.merged' : 'profile.replaced'), n }));
    $('[data-upload-form]').reset();
    render();
  });

  $('[data-delete]').addEventListener('click', () => {
    if (!confirm(t('profile.confirmDelete'))) return;
    $('[data-delete-message]').textContent = deleteProfile() ? t('profile.deleted') : t('profile.deleteFailed');
    render();
  });

  render();
}
