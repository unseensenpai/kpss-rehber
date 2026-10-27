/**
 * Student profile schema and pure operations (spec §8): validation, version
 * migration, merging, alias mapping and progress. Storage lives in
 * `scripts/profile-store.js`.
 */
import { FEEDBACK, FEEDBACK_LIMIT, LENGTHS, LEVEL_MAX, LEVEL_MIN } from './adaptation.js';

export const VERSION = 2;
/** Topic status; no record means "not started". */
export const STATUSES = ['studying', 'done', 'review'];
export const NOTE_LIMIT = 2000;
export const PREFERENCE_LIMIT = 500;
export const BACKUP_SIZE_LIMIT = 1024 * 1024;

const rename = (obj, map) => Object.fromEntries(Object.entries(obj ?? {}).map(([k, v]) => [map[k] ?? k, v]));

/**
 * Version migrations: `MIGRATIONS[n]` upgrades a version-n profile to n+1.
 * When the schema changes, bump VERSION and add a step here.
 */
export const MIGRATIONS = {
  // v1 (K6) used Turkish field names and values.
  1: (p) => {
    const STATUS = { calisiyorum: 'studying', tamamlandi: 'done', tekrar: 'review' };
    const LENGTH = { ozet: 'brief', normal: 'normal', detayli: 'detailed' };
    const FEEDBACK_TYPE = {
      'cok-zor': 'too-hard',
      tam: 'just-right',
      'cok-basit': 'too-easy',
      'cok-uzun': 'too-long',
      'daha-detay': 'more-detail',
    };
    const topics = {};
    for (const [id, t] of Object.entries(p.konular ?? {})) {
      if (t === null || typeof t !== 'object') {
        topics[id] = t; // left for validation to report
        continue;
      }
      const n = rename(t, { durum: 'status', seviye: 'level', uzunluk: 'length', not: 'note', geriBildirim: 'feedback', guncelleme: 'updatedAt' });
      if (n.status != null) n.status = STATUS[n.status] ?? n.status;
      if (n.length != null) n.length = LENGTH[n.length] ?? n.length;
      if (Array.isArray(n.feedback)) {
        n.feedback = n.feedback.map((f) => (f && typeof f === 'object' ? { type: FEEDBACK_TYPE[f.tur] ?? f.tur, at: f.tarih } : f));
      }
      topics[id] = n;
    }
    return {
      createdAt: p.olusturma,
      selectedExam: p.secilenSinav,
      targetDate: p.hedefTarih,
      preferences: p.tercihler,
      settingsUpdatedAt: p.ayarGuncelleme,
      topics: p.konular === undefined ? undefined : topics,
    };
  },
};

export function emptyProfile(now = new Date()) {
  return {
    version: VERSION,
    createdAt: now.toISOString(),
    selectedExam: null,
    targetDate: null,
    preferences: '',
    settingsUpdatedAt: null,
    topics: {},
  };
}

const TOPIC_ID = /^[a-z0-9-]+\/[a-z0-9-]+$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const validTime = (s) => typeof s === 'string' && !Number.isNaN(Date.parse(s));
const isObject = (x) => x !== null && typeof x === 'object' && !Array.isArray(x);

/** The version field: `version` from v2 on, `surum` in v1. */
const versionOf = (raw) => raw.version ?? raw.surum;

/** Upgrades an older profile to the current version through the migration chain. */
export function upgradeProfile(raw, migrations = MIGRATIONS, target = VERSION) {
  let p = raw;
  let v = versionOf(raw);
  while (v < target) {
    const step = migrations[v];
    if (!step) throw new Error(`no migration from version ${v}`);
    p = step(p);
    v += 1;
  }
  return { ...p, version: v };
}

/**
 * Validates and normalizes a profile, dropping unknown fields. When invalid,
 * `errors` holds `{ code, params }` entries (the UI words them) and `profile` is null.
 */
export function validateProfile(raw, { migrations = MIGRATIONS, target = VERSION } = {}) {
  const fail = (code, params = {}) => ({ errors: [{ code, params }], profile: null });
  if (!isObject(raw)) return fail('notBackup');
  const version = versionOf(raw);
  if (!Number.isInteger(version) || version < 1) return fail('noVersion');
  if (version > target) return fail('newerVersion');
  let p;
  try {
    p = upgradeProfile(raw, migrations, target);
  } catch (e) {
    return fail('migrationFailed', { message: e.message });
  }

  const errors = [];
  const err = (code, params = {}) => errors.push({ code, params });
  const result = emptyProfile();
  result.createdAt = validTime(p.createdAt) ? p.createdAt : result.createdAt;
  if (p.selectedExam != null) {
    if (typeof p.selectedExam === 'string' && /^[a-z0-9-]+$/.test(p.selectedExam)) result.selectedExam = p.selectedExam;
    else err('badExam');
  }
  if (p.targetDate != null) {
    if (typeof p.targetDate === 'string' && DATE.test(p.targetDate) && validTime(p.targetDate)) result.targetDate = p.targetDate;
    else err('badTargetDate');
  }
  if (p.preferences != null) {
    if (typeof p.preferences === 'string' && p.preferences.length <= PREFERENCE_LIMIT) result.preferences = p.preferences;
    else err('badPreferences', { limit: PREFERENCE_LIMIT });
  }
  if (p.settingsUpdatedAt != null && validTime(p.settingsUpdatedAt)) result.settingsUpdatedAt = p.settingsUpdatedAt;

  if (!isObject(p.topics)) {
    err('noTopics');
  } else {
    for (const [id, t] of Object.entries(p.topics)) {
      const topicErrors = topicProblems(id, t);
      if (topicErrors.length) errors.push(...topicErrors);
      else result.topics[id] = normalizeTopic(t);
    }
  }
  return errors.length ? { errors, profile: null } : { errors: [], profile: result };
}

function topicProblems(id, t) {
  const errors = [];
  const err = (code, params = {}) => errors.push({ code, params: { id, ...params } });
  if (!TOPIC_ID.test(id)) return [{ code: 'badTopicId', params: { id } }];
  if (!isObject(t)) return [{ code: 'badTopic', params: { id } }];
  if (t.status != null && !STATUSES.includes(t.status)) err('badStatus', { value: t.status });
  if (t.level != null && !(Number.isInteger(t.level) && t.level >= LEVEL_MIN && t.level <= LEVEL_MAX)) err('badLevel');
  if (t.length != null && !LENGTHS.includes(t.length)) err('badLength', { value: t.length });
  if (t.note != null && (typeof t.note !== 'string' || t.note.length > NOTE_LIMIT)) err('badNote', { limit: NOTE_LIMIT });
  if (t.feedback != null) {
    const ok =
      Array.isArray(t.feedback) &&
      t.feedback.length <= FEEDBACK_LIMIT &&
      t.feedback.every((f) => isObject(f) && f.type in FEEDBACK && validTime(f.at));
    if (!ok) err('badFeedback');
  }
  if (t.updatedAt != null && !validTime(t.updatedAt)) err('badUpdatedAt');
  return errors;
}

function normalizeTopic(t) {
  const n = {};
  for (const field of ['status', 'level', 'length', 'note', 'feedback', 'updatedAt']) {
    if (t[field] != null) n[field] = t[field];
  }
  return n;
}

const time = (s) => (s ? Date.parse(s) : -Infinity);

/**
 * Merges two profiles: per topic the newer `updatedAt` wins; exam, target date and
 * preferences come from the side with the newer `settingsUpdatedAt`.
 */
export function mergeProfiles(current, incoming) {
  const topics = { ...current.topics };
  for (const [id, t] of Object.entries(incoming.topics)) {
    if (!topics[id] || time(t.updatedAt) > time(topics[id].updatedAt)) topics[id] = t;
  }
  const settings = time(incoming.settingsUpdatedAt) > time(current.settingsUpdatedAt) ? incoming : current;
  return {
    ...current,
    createdAt: time(incoming.createdAt) < time(current.createdAt) ? incoming.createdAt : current.createdAt,
    selectedExam: settings.selectedExam,
    targetDate: settings.targetDate,
    preferences: settings.preferences,
    settingsUpdatedAt: settings.settingsUpdatedAt,
    topics,
  };
}

/**
 * Moves records of renamed topics (`aliases`) to their new id. If the new id also
 * has a record, the newer one stays. `map`: oldId → newId.
 */
export function applyAliases(profile, map) {
  const topics = {};
  for (const [id, t] of Object.entries(profile.topics)) {
    const target = map[id] ?? id;
    if (!topics[target] || time(t.updatedAt) > time(topics[target].updatedAt)) topics[target] = t;
  }
  return { ...profile, topics };
}

/** oldId → newId map from a topic list. */
export function aliasMap(topics) {
  const map = {};
  for (const t of topics) for (const old of t.data?.aliases ?? t.aliases ?? []) map[old] = t.id;
  return map;
}

/** Progress for a list of topics: done, studied (has any status), percent. */
export function progress(topicIds, profileTopics) {
  const total = topicIds.length;
  let done = 0;
  let studied = 0;
  for (const id of topicIds) {
    const s = profileTopics[id]?.status;
    if (s) studied++;
    if (s === 'done') done++;
  }
  return { total, done, studied, percent: total ? Math.round((done / total) * 100) : 0 };
}

/** `kpss-rehber-backup-YYYY-MM-DD.json` (local date). */
export function backupFileName(now = new Date()) {
  const two = (n) => String(n).padStart(2, '0');
  return `kpss-rehber-backup-${now.getFullYear()}-${two(now.getMonth() + 1)}-${two(now.getDate())}.json`;
}
