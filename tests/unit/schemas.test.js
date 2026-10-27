import { describe, expect, it } from 'vitest';
import { calendarSchema, examSchema, sourceSchema, topicSchema } from '../../src/lib/schemas.js';

const topic = {
  title: 'Paragraf',
  subject: 'turkce',
  sourceType: 'osym-guide',
  sourceYear: 2026,
  updated: '2026-10-27',
};

const content = {
  subtopics: ['Ana düşünce'],
  keyConcepts: ['konu', 'ana fikir'],
  questionStyle: 'Paragrafın ana düşüncesini bulma',
};

const exam = {
  name: { tr: 'Örnek' },
  shortName: { tr: 'Ö' },
  group: 'KPSS',
  order: 1,
  source: { document: 'kpss-lisans-2026', verified: true },
  sessions: [
    {
      name: { tr: 'Sabah' },
      durationMin: 60,
      tests: [
        {
          name: { tr: 'GY' },
          questionCount: 1,
          subjects: [{ id: 'turkce', name: { tr: 'Türkçe' }, questionCount: 1, topics: ['turkce/paragraf'] }],
        },
      ],
    },
  ],
};

describe('topicSchema', () => {
  it('a skeleton topic is valid without content fields; defaults are filled', () => {
    const t = topicSchema.parse(topic);
    expect(t).toMatchObject({ state: 'skeleton', verified: false, subtopics: [] });
    expect(t.updated).toBeInstanceOf(Date);
  });
  it.each(['title', 'subject', 'sourceType', 'sourceYear', 'updated'])("rejects a missing required '%s'", (field) => {
    const { [field]: _, ...missing } = topic;
    expect(topicSchema.safeParse(missing).success).toBe(false);
  });
  it.each(['subtopics', 'keyConcepts', 'questionStyle'])("'%s' is required for a draft topic", (field) => {
    const { [field]: _, ...missing } = content;
    expect(topicSchema.safeParse({ ...topic, ...content, state: 'draft' }).success).toBe(true);
    expect(topicSchema.safeParse({ ...topic, ...missing, state: 'draft' }).success).toBe(false);
  });
  it('rejects an unknown source type', () => {
    expect(topicSchema.safeParse({ ...topic, sourceType: 'wikipedia' }).success).toBe(false);
  });
  it('questionDistribution maps year → count', () => {
    expect(topicSchema.safeParse({ ...topic, questionDistribution: { 2024: 2 } }).success).toBe(true);
    expect(topicSchema.safeParse({ ...topic, questionDistribution: { last: 2 } }).success).toBe(false);
  });
});

describe('examSchema', () => {
  it('accepts a valid exam', () => {
    expect(examSchema.safeParse(exam).success).toBe(true);
  });
  it("topic references must be 'subject/slug'", () => {
    const bad = structuredClone(exam);
    bad.sessions[0].tests[0].subjects[0].topics = ['paragraf'];
    expect(examSchema.safeParse(bad).success).toBe(false);
  });
  it('visible text needs every locale', () => {
    expect(examSchema.safeParse({ ...exam, name: 'Örnek' }).success).toBe(false);
    expect(examSchema.safeParse({ ...exam, name: { en: 'Sample' } }).success).toBe(false);
  });
  it('the session or every test needs a duration', () => {
    const bad = structuredClone(exam);
    delete bad.sessions[0].durationMin;
    expect(examSchema.safeParse(bad).success).toBe(false);
    bad.sessions[0].tests[0].durationMin = 50;
    expect(examSchema.safeParse(bad).success).toBe(true);
  });
  it('weight cannot exceed 100', () => {
    const bad = structuredClone(exam);
    bad.sessions[0].tests[0].subjects[0].weight = 120;
    expect(examSchema.safeParse(bad).success).toBe(false);
  });
});

describe('sourceSchema', () => {
  const source = {
    id: 'kpss-lisans-2026',
    title: { tr: 'Kılavuz' },
    kind: 'guide',
    sourceType: 'osym-guide',
    year: 2026,
    url: 'https://dokuman.osym.gov.tr/x.pdf',
    sha256: 'a'.repeat(64),
    checkedAt: '2026-10-27',
  };
  it('accepts a valid document and rejects a bad hash', () => {
    expect(sourceSchema.safeParse(source).success).toBe(true);
    expect(sourceSchema.safeParse({ ...source, sha256: 'abc' }).success).toBe(false);
  });
});

describe('calendarSchema', () => {
  it('time must be HH:MM', () => {
    const c = { id: 'a', exam: 'dhbt', kind: 'exam', start: '2026-11-01', document: 'kpss-lisans-2026' };
    expect(calendarSchema.safeParse({ ...c, time: '10:15' }).success).toBe(true);
    expect(calendarSchema.safeParse({ ...c, time: '10.15' }).success).toBe(false);
  });
});
