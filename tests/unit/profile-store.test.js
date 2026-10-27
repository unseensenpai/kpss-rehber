import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { deleteProfile, KEY, readProfile, saveSettings, saveTopic, storageAvailable } from '../../src/scripts/profile-store.js';

function fakeStorage() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
  };
}

describe('profile store', () => {
  beforeEach(() => vi.stubGlobal('localStorage', fakeStorage()));
  afterEach(() => vi.unstubAllGlobals());

  it('returns an empty profile when nothing is saved', () => {
    expect(readProfile()).toMatchObject({ version: 2, topics: {}, preferences: '' });
  });

  it('merges a topic record and keeps other fields', () => {
    localStorage.setItem(KEY, JSON.stringify({ version: 2, topics: { 'tarih/a': { note: 'important', level: 2 } } }));
    expect(saveTopic('tarih/a', { level: 4, length: 'brief' })).toBe(true);
    const t = readProfile().topics['tarih/a'];
    expect(t).toMatchObject({ note: 'important', level: 4, length: 'brief' });
    expect(t.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('writes settings and refreshes settingsUpdatedAt', () => {
    saveSettings({ preferences: 'use tables' });
    const p = readProfile();
    expect(p.preferences).toBe('use tables');
    expect(p.settingsUpdatedAt).toBeTruthy();
  });

  it('falls back to an empty profile for corrupt JSON or an invalid profile', () => {
    localStorage.setItem(KEY, '{broken');
    expect(readProfile().topics).toEqual({});
    localStorage.setItem(KEY, JSON.stringify({ version: 2, topics: { 'tarih/a': { status: 'nope' } } }));
    expect(readProfile().topics).toEqual({});
  });

  it('migrates a v1 profile from the old key and removes it', () => {
    localStorage.setItem(
      'kpss-rehber:v1',
      JSON.stringify({ surum: 1, tercihler: 'tablo', konular: { 'tarih/a': { durum: 'tamamlandi', uzunluk: 'ozet' } } }),
    );
    const p = readProfile();
    expect(p).toMatchObject({ version: 2, preferences: 'tablo' });
    expect(p.topics['tarih/a']).toEqual({ status: 'done', length: 'brief' });
    expect(localStorage.getItem('kpss-rehber:v1')).toBeNull();
    expect(JSON.parse(localStorage.getItem(KEY)).topics['tarih/a'].status).toBe('done');
  });

  it('moves the old last-exam key into the profile', () => {
    localStorage.setItem('kpss-rehber:son-sinav', JSON.stringify({ sinavId: 'dhbt', ad: 'DHBT' }));
    expect(readProfile().selectedExam).toBe('dhbt');
    expect(localStorage.getItem('kpss-rehber:son-sinav')).toBeNull();
  });

  it('deleteProfile removes the record', () => {
    saveTopic('tarih/a', { status: 'done' });
    deleteProfile();
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it('returns false when storage rejects writes', () => {
    vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => { throw new Error('QuotaExceeded'); }, removeItem() {} });
    expect(saveTopic('tarih/a', { level: 3 })).toBe(false);
    expect(storageAvailable()).toBe(false);
  });
});
