import { describe, expect, it } from 'vitest';
import {
  calendarErrors,
  duplicateSubjects,
  missingReferences,
  orphanTopics,
  questionTotalErrors,
  sourceErrors,
  subjectFolderMismatch,
  translationErrors,
  validateData,
  weightErrors,
} from '../../src/lib/validate.js';

const topic = (id, extra = {}) => ({
  id,
  data: { subject: id.split('/')[0], sourceType: 'osym-guide', sourceYear: 2026, ...extra },
});

const subject = (id, questionCount, topics = [], extra = {}) => ({ id, name: { tr: id }, questionCount, topics, ...extra });

const exam = (subjects, { testCount = 4, source = { document: 'guide', verified: true } } = {}) => ({
  id: 'sample',
  data: { source, sessions: [{ name: { tr: 'Sabah' }, durationMin: 60, tests: [{ name: { tr: 'GY' }, questionCount: testCount, subjects }] }] },
});

const sources = [{ id: 'guide', data: {} }];

const valid = () => ({
  exams: [exam([subject('turkce', 2, ['turkce/paragraf']), subject('matematik', 2, ['matematik/sayilar'])])],
  topics: { tr: [topic('turkce/paragraf'), topic('matematik/sayilar')] },
  sources,
  calendar: [{ id: 'c1', data: { exam: 'sample', document: 'guide', start: new Date('2026-09-06') } }],
});

describe('validateData', () => {
  it('reports nothing for consistent data', () => {
    expect(validateData(valid())).toEqual([]);
  });
});

describe('missingReferences', () => {
  it('catches a missing topic', () => {
    const { exams } = valid();
    expect(missingReferences(exams, [topic('turkce/paragraf')])).toEqual([
      "sample › GY › matematik: topic 'matematik/sayilar' does not exist",
    ]);
  });
  it('catches a topic from another subject', () => {
    const e = exam([subject('turkce', 4, ['matematik/sayilar'])]);
    expect(missingReferences([e], [topic('matematik/sayilar')])[0]).toMatch(/does not belong/);
  });
});

describe('orphanTopics', () => {
  it('catches a topic no exam uses', () => {
    const { exams, topics } = valid();
    expect(orphanTopics(exams, [...topics.tr, topic('tarih/osmanli-tarihi')])).toEqual([
      "topic 'tarih/osmanli-tarihi' is not used by any exam (orphan)",
    ]);
  });
  it('a topic shared by several exams is not an orphan', () => {
    const { exams, topics } = valid();
    expect(orphanTopics([...exams, ...exams], topics.tr)).toEqual([]);
  });
});

describe('subjectFolderMismatch', () => {
  it('catches a subject field that differs from the folder', () => {
    expect(subjectFolderMismatch([topic('turkce/paragraf', { subject: 'tarih' })])).toHaveLength(1);
  });
});

describe('questionTotalErrors', () => {
  it('catches subjects that do not add up to the test', () => {
    const e = exam([subject('turkce', 3)], { testCount: 4 });
    expect(questionTotalErrors([e])).toEqual(['sample › GY: subjects add up to 3, test has 4']);
  });
});

describe('weightErrors', () => {
  it('checks counts derived from weights (rounded)', () => {
    const e = exam([subject('a', 15, [], { weight: 18.75 }), subject('b', 65)], { testCount: 80 });
    expect(weightErrors([e])).toEqual([]);
  });
  it('catches a count that does not match its weight', () => {
    const e = exam([subject('tarih', 26, [], { weight: 45 }), subject('b', 34)], { testCount: 60 });
    expect(weightErrors([e])).toEqual(['sample › GY › tarih: 45% → should be 27 questions, found 26']);
  });
});

describe('duplicateSubjects', () => {
  it('catches a subject listed twice in an exam (even in different tests)', () => {
    const e = exam([subject('turkce', 2)]);
    e.data.sessions[0].tests.push({ name: { tr: 'GK' }, questionCount: 2, subjects: [subject('turkce', 2)] });
    expect(duplicateSubjects([e])).toEqual(["sample › GK: subject 'turkce' appears twice in the exam"]);
  });
});

describe('sourceErrors', () => {
  it('catches a topic without a source and an exam without a document', () => {
    const e = exam([], { source: { verified: false } });
    const t = topic('turkce/paragraf', { sourceType: undefined });
    expect(sourceErrors([e], [t], sources)).toEqual([
      'sample: source document missing',
      'turkce/paragraf: sourceType/sourceYear missing',
    ]);
  });
  it('catches documents and booklets missing from sources', () => {
    const e = exam([], { source: { document: 'made-up', verified: true, booklets: ['nope'] } });
    const t = topic('turkce/paragraf', { document: 'made-up' });
    expect(sourceErrors([e], [t], sources)).toHaveLength(3);
  });
});

describe('calendarErrors', () => {
  it('catches a missing exam, a missing document and a reversed range', () => {
    const c = [
      { id: 'a', data: { exam: 'none', document: 'guide', start: new Date('2026-01-02') } },
      { id: 'b', data: { exam: 'sample', document: 'none', start: new Date('2026-01-02') } },
      { id: 'c', data: { exam: 'sample', document: 'guide', start: new Date('2026-01-02'), end: new Date('2026-01-01') } },
    ];
    expect(calendarErrors(c, valid().exams, sources)).toEqual([
      "calendar 'a': exam 'none' does not exist",
      "calendar 'b': document 'none' does not exist",
      "calendar 'c': end is before start",
    ]);
  });
});

describe('translationErrors', () => {
  const tpl = (id, data = { order: 1, special: false }) => ({ id, data });
  it('passes when every locale has the same topics and shared fields', () => {
    const topics = { tr: [topic('tarih/a')], en: [topic('tarih/a', { title: 'A' })] };
    expect(translationErrors({ topics, templates: { tr: [tpl('x')], en: [tpl('x')] } }, ['tr', 'en'])).toEqual([]);
  });
  it('catches missing translations, extra files and differing shared fields', () => {
    const topics = {
      tr: [topic('tarih/a'), topic('tarih/b')],
      en: [topic('tarih/a', { sourceYear: 2025 }), topic('tarih/c')],
    };
    const errors = translationErrors({ topics, templates: { tr: [tpl('x')], en: [tpl('x', { order: 2, special: false })] } }, ['tr', 'en']);
    expect(errors).toEqual([
      "topic 'tarih/b': missing en translation",
      "topic 'en/tarih/a': 'sourceYear' differs from tr",
      "topic 'en/tarih/c': no tr original",
      "template 'en/x': 'order' differs from tr",
    ]);
  });
  it('catches a folder for an unsupported locale', () => {
    expect(translationErrors({ topics: { tr: [], de: [] } }, ['tr'])).toEqual(["topic folder 'de' is not a supported locale"]);
  });
});
