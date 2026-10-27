/**
 * Fills prompt templates (spec §7). Pure: the build validation and the in-browser
 * prompt panel use the same functions.
 */

/** Variables a template may use; anything else breaks the build. */
export const VARIABLES = [
  'exam',
  'subject',
  'topic',
  'subtopics',
  'keyConcepts',
  'questionStyle',
  'levelName',
  'levelInstruction',
  'lengthInstruction',
  'preferences',
];

const VARIABLE = /\{\{\s*([a-zA-Z]+)\s*\}\}/g;

/** Fields the student fills in themselves, e.g. [SORUYU BURAYA YAPIŞTIR]. Upper case, Turkish letters allowed. */
export const STUDENT_FIELD = /\[[A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜ0-9 ,.'’/()-]*\]/g;

/** Variable names used in a template (unique, in order of first use). */
export function templateVariables(text) {
  return [...new Set([...text.matchAll(VARIABLE)].map((m) => m[1]))];
}

/**
 * Replaces `{{name}}` with values. A missing variable throws; an empty string is
 * valid (e.g. no preferences) and the blank lines it leaves collapse.
 */
export function fillPrompt(template, values) {
  const missing = templateVariables(template).filter((n) => values[n] === undefined || values[n] === null);
  if (missing.length) throw new Error(`Unfilled template variable: ${missing.join(', ')}`);
  return template
    .replace(VARIABLE, (_, n) => String(values[n]))
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Builds template values from a topic and settings. For skeleton topics with empty
 * fields, the model gets a generic instruction instead (`fallbacks`).
 */
export function promptValues({ exam, subject, topic, level, length, preferences = '', fallbacks }) {
  const list = (items, fallback) => (items?.length ? items.join(', ') : fallback);
  return {
    exam,
    subject,
    topic: topic.title,
    subtopics: list(topic.subtopics, fallbacks.subtopics),
    keyConcepts: list(topic.keyConcepts, fallbacks.keyConcepts),
    questionStyle: topic.questionStyle || fallbacks.questionStyle,
    levelName: level.name,
    levelInstruction: level.instruction,
    lengthInstruction: length.instruction,
    preferences: preferences ? `${fallbacks.preferencesPrefix} ${preferences}` : '',
  };
}

/** Splits text into plain parts and student fields (for highlighting on the page). */
export function splitStudentFields(text) {
  const parts = [];
  let last = 0;
  for (const m of text.matchAll(STUDENT_FIELD)) {
    if (m.index > last) parts.push({ text: text.slice(last, m.index), field: false });
    parts.push({ text: m[0], field: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), field: false });
  return parts;
}

/** Templates shown on a topic: general ones + special ones listed in the topic's `extraPrompts`. */
export function topicTemplates(templates, topic) {
  const extra = topic.data.extraPrompts ?? [];
  return templates.filter((t) => !t.data.special || extra.includes(t.id));
}
