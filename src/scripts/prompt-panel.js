/**
 * Prompt panel behavior: level/length (saved per topic), feedback-driven
 * adaptation, copying and opening in ChatGPT/Claude. The text is always copied to
 * the clipboard too, because the providers' URL parameters are not guaranteed.
 */
import { fillPrompt, promptValues, splitStudentFields } from '../lib/prompt.js';
import { applyFeedback, initialSettings } from '../lib/adaptation.js';
import { PROVIDERS, providerUrl } from '../lib/providers.js';
import { translator } from '../i18n/index.js';
import { readProfile, saveTopic } from './profile-store.js';

const t = translator(document.documentElement.lang);
const fallbacks = t('panel.fallbacks');

for (const root of document.querySelectorAll('[data-prompt-panel]')) setup(root);

function setup(root) {
  const data = JSON.parse(root.dataset.panel);
  const library = root.hasAttribute('data-library');
  const $ = (s) => root.querySelector(s);
  const levelSelect = $('[data-level]');
  const lengthSelect = $('[data-length]');
  const contextSelect = $('[data-context]');
  const examSelect = $('[data-exam-select]');
  const topicSelect = $('[data-topic-select]');
  const adaptMessage = $('[data-adapt-message]');
  const cards = [...root.querySelectorAll('[data-template]')];
  const texts = new Map();

  let topic = data.topics.find((x) => x.id === (topicSelect?.value ?? data.topics[0].id));
  let context = topic.contexts[0];

  const levelOf = (n) => data.levels.find((l) => l.level === n);
  const lengthOf = (id) => data.lengths.find((l) => l.id === id);
  const record = () => readProfile().topics[topic.id];

  /** The topic's saved settings, otherwise the subject average (a manual choice always wins). */
  function loadSettings() {
    const r = record();
    const s = r?.level ? r : initialSettings(topic.subjectTopics, readProfile().topics);
    levelSelect.value = String(s.level);
    lengthSelect.value = s.length;
  }

  function save(fields) {
    $('[data-save-warning]').hidden = saveTopic(topic.id, fields);
  }

  function render() {
    const values = promptValues({
      exam: context.exam,
      subject: context.subject,
      topic,
      level: levelOf(Number(levelSelect.value)),
      length: lengthOf(lengthSelect.value),
      preferences: readProfile().preferences,
      fallbacks,
    });
    for (const card of cards) {
      const template = data.templates.find((x) => x.id === card.dataset.template);
      card.hidden = !topic.templates.includes(template.id);
      if (card.hidden) continue;
      const text = fillPrompt(template.text, values);
      texts.set(card, text);
      card.querySelector('[data-preview]').replaceChildren(
        ...splitStudentFields(text).map((part) => {
          if (!part.field) return part.text;
          const m = document.createElement('mark');
          m.className = 'student-field';
          m.textContent = part.text;
          return m;
        }),
      );
    }
  }

  function fillContexts() {
    if (library) {
      context = topic.contexts.find((c) => c.examId === examSelect.value) ?? topic.contexts[0];
      return;
    }
    contextSelect.replaceChildren(...topic.contexts.map((c, i) => new Option(`${c.shortName} · ${c.subject}`, String(i))));
    // Start with the selected exam's context if it uses this topic.
    const selected = readProfile().selectedExam;
    const i = Math.max(0, topic.contexts.findIndex((c) => c.examId === selected));
    contextSelect.value = String(i);
    context = topic.contexts[i];
  }

  function fillTopics() {
    const exam = data.exams.find((e) => e.id === examSelect.value);
    topicSelect.replaceChildren(
      ...exam.subjects.map((s) => {
        const group = document.createElement('optgroup');
        group.label = s.name;
        group.append(...s.topics.map((id) => new Option(data.topics.find((x) => x.id === id).title, id)));
        return group;
      }),
    );
    topicChanged();
  }

  function topicChanged() {
    topic = data.topics.find((x) => x.id === topicSelect.value);
    fillContexts();
    loadSettings();
    adaptMessage.textContent = '';
    render();
  }

  /**
   * Copies to the clipboard. Without Clipboard API permission (some embedded
   * browsers) it opens the preview, selects the text and tries the old execCommand
   * path; if that fails too, the text stays selected.
   */
  async function copy(card) {
    const text = texts.get(card);
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      card.querySelector('details').open = true;
      const range = document.createRange();
      range.selectNodeContents(card.querySelector('[data-preview]'));
      const selection = getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      try {
        return document.execCommand('copy');
      } catch {
        return false;
      }
    }
  }

  const notify = (card, text) => {
    card.querySelector('[data-notice]').textContent = text;
  };
  const fieldReminder = (card) => (splitStudentFields(texts.get(card)).some((p) => p.field) ? t('panel.fieldReminder') : '');

  for (const card of cards) {
    card.querySelector('[data-copy]').addEventListener('click', async () => {
      const ok = await copy(card);
      notify(card, ok ? `${t('panel.copied')}${fieldReminder(card)}` : t('panel.copyFailed'));
    });
    for (const button of card.querySelectorAll('[data-open]')) {
      button.addEventListener('click', async () => {
        const provider = button.dataset.open;
        // Copying must start while the page has focus; opening a tab moves focus away.
        const copied = copy(card);
        window.open(providerUrl(provider, texts.get(card)), '_blank', 'noopener');
        const ok = await copied;
        const name = PROVIDERS[provider].name;
        notify(card, ok ? `${t('panel.opened', { provider: name })}${fieldReminder(card)}` : t('panel.openedNoCopy', { provider: name }));
      });
    }
  }

  const saveSelects = () => {
    save({ level: Number(levelSelect.value), length: lengthSelect.value });
    render();
  };
  levelSelect.addEventListener('change', saveSelects);
  lengthSelect.addEventListener('change', saveSelects);
  contextSelect?.addEventListener('change', () => {
    context = topic.contexts[Number(contextSelect.value)];
    render();
  });
  examSelect?.addEventListener('change', fillTopics);
  topicSelect?.addEventListener('change', topicChanged);

  for (const button of root.querySelectorAll('[data-feedback]')) {
    button.addEventListener('click', () => {
      const before = { level: Number(levelSelect.value), length: lengthSelect.value };
      const next = applyFeedback({ ...before, feedback: record()?.feedback ?? [] }, button.dataset.feedback);
      save(next);
      levelSelect.value = String(next.level);
      lengthSelect.value = next.length;
      render();
      const changes = [];
      if (next.level !== before.level) changes.push(t('panel.levelChange', { from: levelOf(before.level).name, to: levelOf(next.level).name }));
      if (next.length !== before.length) changes.push(t('panel.lengthChange', { from: lengthOf(before.length).name, to: lengthOf(next.length).name }));
      adaptMessage.textContent = changes.length ? t('panel.adapted', { changes: changes.join(', ') }) : t('panel.unchanged');
    });
  }

  if (library) {
    // The library opens on the selected exam too, when it is listed.
    const selected = readProfile().selectedExam;
    if (data.exams.some((e) => e.id === selected)) examSelect.value = selected;
    fillTopics();
  } else {
    fillContexts();
    loadSettings();
    render();
  }
}
