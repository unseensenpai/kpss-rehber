/**
 * Cross-collection consistency checks (spec §12). Zod validates single files; these
 * check relations between files. All pure: inputs are `{ id, data }` lists (topics
 * and templates as maps by locale), the output is a list of error messages (empty
 * when the data is consistent).
 */

import { topicUsages } from './curriculum.js';
import { fillPrompt, promptValues, templateVariables, topicTemplates, VARIABLES } from './prompt.js';
import { DEFAULTS, LENGTHS } from './adaptation.js';
import { DEFAULT_LOCALE, LOCALES } from '../i18n/locales.js';

/** @typedef {{ id: string, data: any, body?: string }} Entry */

/** A localized content value for a locale (validation runs before the i18n helpers). */
const text = (value, locale = DEFAULT_LOCALE) => (typeof value === 'string' ? value : value?.[locale]);

/** Every exam-test-subject triple. */
function* subjectsOf(/** @type {Entry[]} */ exams) {
  for (const e of exams) {
    for (const s of e.data.sessions) {
      for (const t of s.tests) {
        for (const subject of t.subjects) yield { exam: e.id, test: t, subject };
      }
    }
  }
}

/** Every exam-subject-topic reference. */
function* referencesOf(/** @type {Entry[]} */ exams) {
  for (const { exam, test, subject } of subjectsOf(exams)) {
    for (const topic of subject.topics) yield { exam, test: text(test.name), subject: subject.id, topic };
  }
}

/** Does a referenced topic exist, and in the right subject? */
export function missingReferences(/** @type {Entry[]} */ exams, /** @type {Entry[]} */ topics) {
  const byId = new Map(topics.map((t) => [t.id, t]));
  const errors = [];
  for (const r of referencesOf(exams)) {
    const topic = byId.get(r.topic);
    if (!topic) {
      errors.push(`${r.exam} › ${r.test} › ${r.subject}: topic '${r.topic}' does not exist`);
    } else if (!r.topic.startsWith(`${r.subject}/`) || topic.data.subject !== r.subject) {
      errors.push(`${r.exam} › ${r.test} › ${r.subject}: '${r.topic}' does not belong to this subject`);
    }
  }
  return errors;
}

/** Topics no exam uses. */
export function orphanTopics(/** @type {Entry[]} */ exams, /** @type {Entry[]} */ topics) {
  const used = new Set([...referencesOf(exams)].map((r) => r.topic));
  return topics.filter((t) => !used.has(t.id)).map((t) => `topic '${t.id}' is not used by any exam (orphan)`);
}

/** A topic file's folder must match its `subject` field. */
export function subjectFolderMismatch(/** @type {Entry[]} */ topics) {
  return topics
    .filter((t) => t.id.split('/')[0] !== t.data.subject)
    .map((t) => `'${t.id}': subject field '${t.data.subject}' does not match its folder`);
}

/** Subject question counts must add up to the test's question count. */
export function questionTotalErrors(/** @type {Entry[]} */ exams) {
  const errors = [];
  for (const e of exams) {
    for (const s of e.data.sessions) {
      for (const t of s.tests) {
        const total = t.subjects.reduce((a, sub) => a + sub.questionCount, 0);
        if (total !== t.questionCount) errors.push(`${e.id} › ${text(t.name)}: subjects add up to ${total}, test has ${t.questionCount}`);
      }
    }
  }
  return errors;
}

/** A weighted subject's question count must be that percentage of the test, rounded. */
export function weightErrors(/** @type {Entry[]} */ exams) {
  const errors = [];
  for (const { exam, test, subject } of subjectsOf(exams)) {
    if (subject.weight === undefined) continue;
    const expected = Math.round((test.questionCount * subject.weight) / 100);
    if (expected !== subject.questionCount) {
      errors.push(`${exam} › ${text(test.name)} › ${subject.id}: ${subject.weight}% → should be ${expected} questions, found ${subject.questionCount}`);
    }
  }
  return errors;
}

/** A subject may appear only once per exam (subject page `/exam/<exam>/<subject>/`). */
export function duplicateSubjects(/** @type {Entry[]} */ exams) {
  const errors = [];
  for (const e of exams) {
    const seen = new Set();
    for (const { exam, test, subject } of subjectsOf([e])) {
      if (seen.has(subject.id)) errors.push(`${exam} › ${text(test.name)}: subject '${subject.id}' appears twice in the exam`);
      seen.add(subject.id);
    }
  }
  return errors;
}

/**
 * Every record must rest on a source: exam and topic documents must exist in
 * `sources`, and topics need a source type and year (a safeguard beyond Zod).
 */
export function sourceErrors(/** @type {Entry[]} */ exams, /** @type {Entry[]} */ topics, /** @type {Entry[]} */ sources = []) {
  const documents = new Set(sources.map((s) => s.id));
  const errors = [];
  for (const e of exams) {
    const doc = e.data.source?.document;
    if (!doc) errors.push(`${e.id}: source document missing`);
    else if (!documents.has(doc)) errors.push(`${e.id}: document '${doc}' is not in sources`);
    for (const b of e.data.source?.booklets ?? []) {
      if (!documents.has(b)) errors.push(`${e.id}: booklet '${b}' is not in sources`);
    }
  }
  for (const t of topics) {
    if (!t.data.sourceType || !t.data.sourceYear) errors.push(`${t.id}: sourceType/sourceYear missing`);
    if (t.data.document && !documents.has(t.data.document)) errors.push(`${t.id}: document '${t.data.document}' is not in sources`);
  }
  return errors;
}

/** Calendar entries must point to existing exams and documents. */
export function calendarErrors(/** @type {Entry[]} */ calendar, /** @type {Entry[]} */ exams, /** @type {Entry[]} */ sources) {
  const examIds = new Set(exams.map((e) => e.id));
  const documents = new Set(sources.map((s) => s.id));
  const errors = [];
  for (const c of calendar) {
    if (!examIds.has(c.data.exam)) errors.push(`calendar '${c.id}': exam '${c.data.exam}' does not exist`);
    if (!documents.has(c.data.document)) errors.push(`calendar '${c.id}': document '${c.data.document}' does not exist`);
    if (c.data.end && c.data.end < c.data.start) errors.push(`calendar '${c.id}': end is before start`);
  }
  return errors;
}

/** Placeholder values used for the trial fill; real ones come from the UI dictionary. */
const TRIAL_FALLBACKS = { subtopics: '-', keyConcepts: '-', questionStyle: '-', preferencesPrefix: '-' };

/**
 * Prompt templates of one locale: only known variables, extraPrompts point to
 * existing special templates, levels 1–5 and all three lengths exist, and a trial
 * fill for every topic leaves no `{{…}}`.
 */
export function promptErrors({ templates = [], levels = [], lengths = [], topics = [], exams = [], locale = DEFAULT_LOCALE }) {
  const errors = [];
  const broken = new Set();
  for (const t of templates) {
    const body = t.body ?? '';
    const unknown = templateVariables(body).filter((v) => !VARIABLES.includes(v));
    if (unknown.length) errors.push(`template '${locale}/${t.id}': unknown variable ${unknown.join(', ')}`);
    const unbalanced = /\{\{|\}\}/.test(body.replace(/\{\{\s*[a-zA-Z]+\s*\}\}/g, ''));
    if (unbalanced) errors.push(`template '${locale}/${t.id}': unclosed or malformed {{…}} marker`);
    // Skip the per-topic trial fill so the same error is not repeated for every topic.
    if (unknown.length || unbalanced) broken.add(t.id);
  }
  if (!templates.length) return errors;

  const levelNumbers = levels.map((l) => l.data.level).sort();
  if (levelNumbers.join() !== '1,2,3,4,5') errors.push(`levels must be 1–5, found: ${levelNumbers.join(', ')}`);
  const lengthIds = lengths.map((l) => l.id).sort();
  if (lengthIds.join() !== [...LENGTHS].sort().join()) errors.push(`lengths must be ${LENGTHS.join('/')}`);

  const byId = new Map(templates.map((t) => [t.id, t]));
  const levelData = levels.find((l) => l.data.level === DEFAULTS.level)?.data;
  const lengthData = lengths.find((l) => l.id === DEFAULTS.length)?.data;
  const level = levelData && { name: text(levelData.name, locale), instruction: text(levelData.instruction, locale) };
  const length = lengthData && { instruction: text(lengthData.instruction, locale) };
  for (const topic of topics) {
    for (const extra of topic.data.extraPrompts ?? []) {
      if (!byId.get(extra)?.data.special) errors.push(`${locale}/${topic.id}: extraPrompts '${extra}' is missing or not a special template`);
    }
    const usage = topicUsages(exams, topic.id)[0];
    if (!usage || !level || !length) continue;
    const values = promptValues({
      exam: text(usage.exam.data.name, locale),
      subject: text(usage.subject.name, locale),
      topic: topic.data,
      level,
      length,
      fallbacks: TRIAL_FALLBACKS,
    });
    for (const t of topicTemplates(templates, topic).filter((x) => !broken.has(x.id))) {
      try {
        const filled = fillPrompt(t.body ?? '', values);
        if (/\{\{|\}\}/.test(filled)) errors.push(`${locale}/${topic.id} › ${t.id}: unfilled {{…}} left`);
      } catch (e) {
        errors.push(`${locale}/${topic.id} › ${t.id}: ${e.message}`);
      }
    }
  }
  return errors;
}

/** Topic fields that are not translated and must be identical in every locale. */
const SHARED_TOPIC_FIELDS = ['subject', 'sourceType', 'sourceYear', 'verified', 'document', 'questionDistribution', 'extraPrompts', 'aliases'];

/**
 * Every locale must have the same topics and templates as the default locale, and
 * untranslated topic/template fields must match. `topics`/`templates`: maps by locale.
 */
export function translationErrors({ topics = {}, templates = {} }, locales = LOCALES) {
  const errors = [];
  const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
  for (const [kind, map, shared] of [
    ['topic', topics, SHARED_TOPIC_FIELDS],
    ['template', templates, ['order', 'special']],
  ]) {
    const base = new Map((map[DEFAULT_LOCALE] ?? []).map((x) => [x.id, x]));
    for (const locale of locales.filter((l) => l !== DEFAULT_LOCALE)) {
      const other = new Map((map[locale] ?? []).map((x) => [x.id, x]));
      for (const id of base.keys()) if (!other.has(id)) errors.push(`${kind} '${id}': missing ${locale} translation`);
      for (const [id, x] of other) {
        const b = base.get(id);
        if (!b) {
          errors.push(`${kind} '${locale}/${id}': no ${DEFAULT_LOCALE} original`);
          continue;
        }
        for (const f of shared) {
          if (!same(b.data[f], x.data[f])) errors.push(`${kind} '${locale}/${id}': '${f}' differs from ${DEFAULT_LOCALE}`);
        }
      }
    }
    for (const locale of Object.keys(map)) {
      if (!locales.includes(locale)) errors.push(`${kind} folder '${locale}' is not a supported locale`);
    }
  }
  return errors;
}

/** All checks; returns error messages in a single list. `topics`/`templates` are maps by locale. */
export function validateData({ exams, topics = {}, sources = [], calendar = [], templates = {}, levels, lengths }) {
  const baseTopics = topics[DEFAULT_LOCALE] ?? [];
  return [
    ...sourceErrors(exams, baseTopics, sources),
    ...subjectFolderMismatch(baseTopics),
    ...missingReferences(exams, baseTopics),
    ...orphanTopics(exams, baseTopics),
    ...questionTotalErrors(exams),
    ...weightErrors(exams),
    ...duplicateSubjects(exams),
    ...calendarErrors(calendar, exams, sources),
    ...translationErrors({ topics, templates }),
    ...LOCALES.flatMap((locale) =>
      promptErrors({ templates: templates[locale] ?? [], levels, lengths, topics: topics[locale] ?? [], exams, locale }),
    ),
  ];
}
