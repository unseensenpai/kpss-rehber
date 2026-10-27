import { describe, expect, it } from 'vitest';
import {
  aliasMap,
  applyAliases,
  backupFileName,
  emptyProfile,
  mergeProfiles,
  progress,
  upgradeProfile,
  validateProfile,
} from '../../src/lib/profile-data.js';

const T1 = '2026-10-01T10:00:00.000Z';
const T2 = '2026-10-20T10:00:00.000Z';

const profile = (extra = {}) => ({ ...emptyProfile(new Date(T1)), ...extra });
const codes = (r) => r.errors.map((e) => e.code);

describe('validateProfile', () => {
  it('accepts a valid profile and drops unknown fields', () => {
    const { errors, profile: p } = validateProfile({
      ...profile({ targetDate: '2027-09-05', preferences: 'use tables' }),
      extra: 'x',
      topics: { 'tarih/a': { status: 'done', level: 4, note: 'important', updatedAt: T1, hidden: 1 } },
    });
    expect(errors).toEqual([]);
    expect(p.extra).toBeUndefined();
    expect(p.topics['tarih/a']).toEqual({ status: 'done', level: 4, note: 'important', updatedAt: T1 });
  });

  it.each([
    [null, 'notBackup'],
    [[], 'notBackup'],
    [{ topics: {} }, 'noVersion'],
    [{ version: 99, topics: {} }, 'newerVersion'],
  ])('rejects non-backups and incompatible versions (%#)', (raw, code) => {
    const r = validateProfile(raw);
    expect(r.profile).toBeNull();
    expect(codes(r)).toEqual([code]);
  });

  it('reports broken topic fields with codes and params', () => {
    const r = validateProfile(
      profile({
        topics: {
          'tarih/a': { status: 'finished' },
          'tarih/b': { level: 9 },
          'tarih/c': { length: 'long' },
          'tarih/d': { note: 'x'.repeat(2001) },
          'tarih/e': { feedback: [{ type: 'great', at: T1 }] },
          'bad id': {},
        },
      }),
    );
    expect(r.profile).toBeNull();
    expect(codes(r)).toEqual(['badStatus', 'badLevel', 'badLength', 'badNote', 'badFeedback', 'badTopicId']);
    expect(r.errors[0].params).toEqual({ id: 'tarih/a', value: 'finished' });
  });

  it('checks the target date format', () => {
    expect(codes(validateProfile(profile({ targetDate: '05.09.2027' })))).toEqual(['badTargetDate']);
  });
});

describe('version migration', () => {
  it('upgrades a v1 (Turkish) backup to v2', () => {
    const { profile: p } = validateProfile({
      surum: 1,
      olusturma: T1,
      secilenSinav: 'dhbt',
      hedefTarih: '2027-09-05',
      tercihler: 'tablo',
      ayarGuncelleme: T2,
      konular: {
        'tarih/a': {
          durum: 'tekrar',
          seviye: 4,
          uzunluk: 'detayli',
          not: 'not',
          geriBildirim: [{ tur: 'cok-zor', tarih: T1 }],
          guncelleme: T2,
        },
      },
    });
    expect(p).toMatchObject({ version: 2, createdAt: T1, selectedExam: 'dhbt', targetDate: '2027-09-05', preferences: 'tablo', settingsUpdatedAt: T2 });
    expect(p.topics['tarih/a']).toEqual({
      status: 'review',
      level: 4,
      length: 'detailed',
      note: 'not',
      feedback: [{ type: 'too-hard', at: T1 }],
      updatedAt: T2,
    });
  });
  it('applies a migration chain in order', () => {
    const migrations = { 1: (p) => ({ ...p, a: 1 }), 2: (p) => ({ ...p, b: p.a + 1 }) };
    expect(upgradeProfile({ version: 1 }, migrations, 3)).toEqual({ version: 3, a: 1, b: 2 });
  });
  it('a missing step fails with a coded error', () => {
    expect(() => upgradeProfile({ version: 1 }, {}, 2)).toThrow(/no migration from version 1/);
    expect(codes(validateProfile(profile({ version: 1 }), { migrations: {}, target: 2 }))).toEqual(['migrationFailed']);
  });
});

describe('mergeProfiles', () => {
  it('per topic the newer record wins; topics from both sides are kept', () => {
    const current = profile({ topics: { 'tarih/a': { status: 'studying', updatedAt: T2 }, 'tarih/b': { status: 'review', updatedAt: T1 } } });
    const incoming = profile({ topics: { 'tarih/a': { status: 'done', updatedAt: T1 }, 'tarih/b': { status: 'done', updatedAt: T2 }, 'tarih/c': { status: 'done', updatedAt: T1 } } });
    const m = mergeProfiles(current, incoming);
    expect(m.topics['tarih/a'].status).toBe('studying');
    expect(m.topics['tarih/b'].status).toBe('done');
    expect(m.topics['tarih/c'].status).toBe('done');
  });
  it('settings come from the newer side; createdAt is the earliest', () => {
    const current = profile({ createdAt: T2, preferences: 'old', settingsUpdatedAt: T1 });
    const incoming = profile({ createdAt: T1, preferences: 'new', targetDate: '2027-09-05', settingsUpdatedAt: T2 });
    expect(mergeProfiles(current, incoming)).toMatchObject({ preferences: 'new', targetDate: '2027-09-05', createdAt: T1 });
  });
});

describe('aliases', () => {
  it('moves old ids to the new one; on conflict the newer record stays', () => {
    const map = aliasMap([{ id: 'tarih/osmanli-tarihi', data: { aliases: ['tarih/osmanli-kurulus'] } }]);
    expect(map).toEqual({ 'tarih/osmanli-kurulus': 'tarih/osmanli-tarihi' });
    const p = applyAliases(
      profile({
        topics: {
          'tarih/osmanli-kurulus': { status: 'done', updatedAt: T2 },
          'tarih/osmanli-tarihi': { status: 'studying', updatedAt: T1 },
        },
      }),
      map,
    );
    expect(Object.keys(p.topics)).toEqual(['tarih/osmanli-tarihi']);
    expect(p.topics['tarih/osmanli-tarihi'].status).toBe('done');
  });
});

describe('progress', () => {
  it('counts done and studied topics', () => {
    const t = { 'a/1': { status: 'done' }, 'a/2': { status: 'studying' }, 'a/3': { level: 3 }, 'b/1': { status: 'done' } };
    expect(progress(['a/1', 'a/2', 'a/3', 'a/4'], t)).toEqual({ total: 4, done: 1, studied: 2, percent: 25 });
    expect(progress([], t).percent).toBe(0);
  });
});

describe('backupFileName', () => {
  it('uses the local date', () => {
    expect(backupFileName(new Date(2026, 9, 7, 23, 30))).toBe('kpss-rehber-backup-2026-10-07.json');
  });
});
