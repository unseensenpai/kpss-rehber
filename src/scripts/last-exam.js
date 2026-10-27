/**
 * Remembers the last viewed exam in the profile (`selectedExam`). The exam page
 * saves it via `data-last-exam`; the hidden `data-continue` link on the home page is
 * filled from that exam's card and shown.
 */
import { readProfile, saveSettings } from './profile-store.js';

const current = document.querySelector('[data-last-exam]');
if (current && readProfile().selectedExam !== current.dataset.examId) {
  saveSettings({ selectedExam: current.dataset.examId });
}

const resume = document.querySelector('[data-continue]');
const card = resume && document.querySelector(`[data-exam-card="${readProfile().selectedExam}"]`);
if (card) {
  const link = resume.querySelector('a');
  link.href = card.href;
  link.textContent = card.dataset.shortName;
  resume.hidden = false;
}
