/**
 * The student profile in the browser (spec §8). Schema and pure operations live in
 * `lib/profile-data.js`; this module only reads and writes localStorage. Without
 * storage the site keeps working.
 */
import { emptyProfile, validateProfile } from '../lib/profile-data.js';

export const KEY = 'kpss-rehber:profile';
// Older keys: the v1 profile (K5–K6) and the separate "last exam" key (K4). Migrated on first read.
const LEGACY_PROFILE = 'kpss-rehber:v1';
const LEGACY_LAST_EXAM = 'kpss-rehber:son-sinav';

function storage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null; // some private windows throw on access
  }
}

/** Can storage actually be written? */
export function storageAvailable() {
  try {
    const s = storage();
    if (!s) return false;
    s.setItem(`${KEY}:probe`, '1');
    s.removeItem(`${KEY}:probe`);
    return true;
  } catch {
    return false;
  }
}

function parse(raw) {
  try {
    return raw ? validateProfile(JSON.parse(raw)).profile : null;
  } catch {
    return null; // corrupt JSON
  }
}

/** Reads the profile; returns an empty one when missing or corrupt (a corrupt record is not deleted). */
export function readProfile() {
  const s = storage();
  let profile = null;
  try {
    profile = parse(s?.getItem(KEY));
    if (!profile) {
      const legacy = parse(s?.getItem(LEGACY_PROFILE));
      if (legacy && writeProfile(legacy)) {
        s.removeItem(LEGACY_PROFILE);
        profile = legacy;
      }
    }
    const lastExam = s?.getItem(LEGACY_LAST_EXAM);
    if (lastExam) {
      profile ??= emptyProfile();
      profile.selectedExam ??= JSON.parse(lastExam)?.sinavId ?? null;
      s.removeItem(LEGACY_LAST_EXAM);
      writeProfile(profile);
    }
  } catch {
    /* migration is best effort */
  }
  return profile ?? emptyProfile();
}

/** Writes the profile; false when it cannot be written. */
export function writeProfile(profile) {
  try {
    const s = storage();
    if (!s) return false;
    s.setItem(KEY, JSON.stringify(profile));
    return true;
  } catch {
    return false;
  }
}

/** Merges fields into a topic's record and refreshes `updatedAt`. */
export function saveTopic(topicId, fields) {
  const p = readProfile();
  p.topics[topicId] = { ...p.topics[topicId], ...fields, updatedAt: new Date().toISOString() };
  return writeProfile(p);
}

/** Writes profile-wide settings such as exam, target date and preferences. */
export function saveSettings(fields) {
  const p = readProfile();
  Object.assign(p, fields, { settingsUpdatedAt: new Date().toISOString() });
  return writeProfile(p);
}

/** Deletes the whole profile. */
export function deleteProfile() {
  try {
    storage()?.removeItem(KEY);
    return true;
  } catch {
    return false;
  }
}
