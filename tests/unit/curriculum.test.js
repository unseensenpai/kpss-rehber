import { describe, expect, it } from 'vitest';
import {
  daysUntil,
  examDates,
  examSubjects,
  examSummary,
  examTopics,
  reportIssueUrl,
  sortByMostAsked,
  topicAverage,
  topicUsages,
} from '../../src/lib/curriculum.js';

const subject = (id, topics = []) => ({ id, name: { tr: id }, questionCount: 10, topics });

const gygk = {
  id: 'lisans',
  data: {
    sessions: [
      {
        name: { tr: 'GY-GK' },
        durationMin: 130,
        tests: [
          { name: { tr: 'GY' }, questionCount: 60, subjects: [subject('turkce')] },
          { name: { tr: 'GK' }, questionCount: 60, subjects: [subject('tarih', ['tarih/osmanli'])] },
        ],
      },
    ],
  },
};

const oabt = {
  id: 'oabt',
  data: {
    sessions: [
      {
        name: { tr: 'ÖABT' },
        singleTestChoice: true,
        tests: [
          { name: { tr: 'Fizik' }, questionCount: 50, durationMin: 90, subjects: [subject('fiz')] },
          { name: { tr: 'Tarih' }, questionCount: 50, durationMin: 70, subjects: [subject('ot', ['tarih/osmanli'])] },
        ],
      },
    ],
  },
};

const field = {
  id: 'field',
  data: { sessions: [{ name: { tr: '1' }, tests: [{ name: { tr: 'A' }, questionCount: 40, durationMin: 50, subjects: [] }, { name: { tr: 'B' }, questionCount: 40, durationMin: 60, subjects: [] }] }] },
};

describe('examSubjects / examTopics', () => {
  it('flattens subjects in order with their test', () => {
    expect(examSubjects(gygk).map((x) => `${x.test.name.tr}/${x.subject.id}`)).toEqual(['GY/turkce', 'GK/tarih']);
  });
  it('lists unique topic ids', () => {
    expect(examTopics(gygk)).toEqual(['tarih/osmanli']);
  });
});

describe('examSummary', () => {
  it('uses the session duration when given and sums questions', () => {
    expect(examSummary(gygk)).toMatchObject({ questions: 120, durationMin: 130, testCount: 2 });
  });
  it('counts the longest test in a single-test-choice session', () => {
    expect(examSummary(oabt)).toMatchObject({ questions: 50, durationMin: 90 });
  });
  it('sums test durations when the session has none', () => {
    expect(examSummary(field)).toMatchObject({ questions: 80, durationMin: 110, testCount: 2, optional: false });
  });
  it('marks optional sessions', () => {
    expect(examSummary({ ...field, data: { ...field.data, sessionsOptional: true } }).optional).toBe(true);
  });
});

describe('topicUsages', () => {
  it('finds every exam using a topic', () => {
    expect(topicUsages([gygk, oabt], 'tarih/osmanli').map((x) => `${x.exam.id}/${x.test.name.tr}`)).toEqual(['lisans/GK', 'oabt/Tarih']);
  });
});

describe('topicAverage / sortByMostAsked', () => {
  const t = (id, questionDistribution) => ({ id, data: { questionDistribution } });
  it('averages to one decimal, null without data', () => {
    expect(topicAverage(t('a', { 2024: 2, 2025: 3, 2026: 3 }))).toBe(2.7);
    expect(topicAverage(t('b'))).toBeNull();
  });
  it('puts the most asked first, keeps topics without data in order at the end', () => {
    const list = [t('x'), t('few', { 2025: 1 }), t('y'), t('many', { 2025: 4 })];
    expect(sortByMostAsked(list).map((x) => x.id)).toEqual(['many', 'few', 'x', 'y']);
  });
});

describe('examDates / daysUntil', () => {
  const c = (exam, kind, day) => ({ data: { exam, kind, start: new Date(day) } });
  const calendar = [c('field', 'exam', '2026-09-13'), c('field', 'application', '2026-07-01'), c('field', 'exam', '2026-09-12'), c('dhbt', 'exam', '2026-11-01')];
  it('finds the first exam day from today on; an exam today counts', () => {
    expect(examDates(calendar, 'field', new Date('2026-09-12T15:00:00')).next.start).toEqual(new Date('2026-09-12'));
  });
  it('when all have passed, next is null and last is the latest', () => {
    const { next, last } = examDates(calendar, 'field', new Date('2026-10-27'));
    expect(next).toBeNull();
    expect(last.start).toEqual(new Date('2026-09-13'));
  });
  it('counts whole days', () => {
    expect(daysUntil(new Date('2026-11-01'), new Date('2026-10-27T23:30:00'))).toBe(5);
  });
});

describe('reportIssueUrl', () => {
  it('builds a prefilled issue link', () => {
    const url = new URL(reportIssueUrl('u/r', { title: 'Osmanlı Tarihi', page: '/tr/topic/tarih/osmanli-tarihi/', prefix: '[Hata]' }));
    expect(url.pathname).toBe('/u/r/issues/new');
    expect(url.searchParams.get('title')).toBe('[Hata] Osmanlı Tarihi');
    expect(url.searchParams.get('page')).toBe('/tr/topic/tarih/osmanli-tarihi/');
    expect(url.searchParams.get('template')).toBe('bug-report.yml');
  });
});
