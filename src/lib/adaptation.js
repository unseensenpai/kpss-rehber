/**
 * Level/length adaptation rules driven by feedback (spec §7). Pure; saving to the
 * profile happens in `scripts/profile-store.js`.
 */

export const LEVEL_MIN = 1;
export const LEVEL_MAX = 5;
export const LENGTHS = ['brief', 'normal', 'detailed'];
export const DEFAULTS = { level: 3, length: 'normal' };
export const FEEDBACK_LIMIT = 10;

/** Feedback type → which axis it moves and in which direction. */
export const FEEDBACK = {
  'too-hard': { axis: 'level', direction: -1 },
  'just-right': { axis: null, direction: 0 },
  'too-easy': { axis: 'level', direction: 1 },
  'too-long': { axis: 'length', direction: -1 },
  'more-detail': { axis: 'length', direction: 1 },
};

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

/**
 * Applies feedback. If the previous feedback was the same type (same direction
 * twice in a row) it moves one extra step. Returns the new { level, length, feedback }.
 */
export function applyFeedback(state, type, at = new Date().toISOString()) {
  const rule = FEEDBACK[type];
  if (!rule) throw new Error(`Unknown feedback: ${type}`);
  const history = state.feedback ?? [];
  const step = rule.direction * (history.at(-1)?.type === type ? 2 : 1);
  let { level, length } = state;
  if (rule.axis === 'level') level = clamp(level + step, LEVEL_MIN, LEVEL_MAX);
  if (rule.axis === 'length') length = LENGTHS[clamp(LENGTHS.indexOf(length) + step, 0, LENGTHS.length - 1)];
  const feedback = [...history, { type, at }].slice(-FEEDBACK_LIMIT);
  return { level, length, feedback };
}

/**
 * Starting settings for a topic without a record: the rounded average of saved
 * topics in the same subject; 3 / normal when there is no data.
 */
export function initialSettings(subjectTopics, profileTopics) {
  const records = subjectTopics.map((id) => profileTopics[id]).filter((t) => t?.level);
  if (!records.length) return { ...DEFAULTS };
  const avg = (list) => Math.round(list.reduce((a, b) => a + b, 0) / list.length);
  return {
    level: clamp(avg(records.map((t) => t.level)), LEVEL_MIN, LEVEL_MAX),
    length: LENGTHS[avg(records.map((t) => Math.max(0, LENGTHS.indexOf(t.length))))],
  };
}
