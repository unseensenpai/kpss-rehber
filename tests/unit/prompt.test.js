import { describe, expect, it } from 'vitest';
import { fillPrompt, promptValues, splitStudentFields, templateVariables, topicTemplates } from '../../src/lib/prompt.js';
import { applyFeedback, initialSettings } from '../../src/lib/adaptation.js';
import { MAX_URL_TEXT, providerUrl } from '../../src/lib/providers.js';
import { promptErrors } from '../../src/lib/validate.js';

const fallbacks = { subtopics: 'all subtopics', keyConcepts: 'core concepts', questionStyle: 'typical style', preferencesPrefix: 'Preferences:' };

describe('fillPrompt', () => {
  it('fills variables and tolerates inner spaces', () => {
    expect(fillPrompt('Topic: {{topic}} / {{ subject }}', { topic: 'Paragraf', subject: 'Türkçe' })).toBe('Topic: Paragraf / Türkçe');
  });
  it('throws on a missing variable', () => {
    expect(() => fillPrompt('{{topic}} {{levelName}}', { topic: 'x' })).toThrow(/levelName/);
  });
  it('an empty value is valid; blank lines left behind collapse', () => {
    expect(fillPrompt('A\n{{preferences}}\n\nB', { preferences: '' })).toBe('A\n\nB');
  });
  it('templateVariables lists unique names', () => {
    expect(templateVariables('{{a}} {{b}} {{a}}')).toEqual(['a', 'b']);
  });
});

describe('promptValues', () => {
  const level = { name: 'Orta', instruction: 'medium' };
  const length = { instruction: 'normal' };
  it('uses fallbacks for a skeleton topic', () => {
    const v = promptValues({ exam: 'S', subject: 'D', topic: { title: 'K', subtopics: [] }, level, length, fallbacks });
    expect(v).toMatchObject({ subtopics: 'all subtopics', questionStyle: 'typical style', preferences: '' });
  });
  it('joins lists and prefixes preferences', () => {
    const v = promptValues({
      exam: 'S',
      subject: 'D',
      topic: { title: 'K', subtopics: ['a', 'b'], keyConcepts: ['x'], questionStyle: 'style' },
      level,
      length,
      preferences: 'use tables',
      fallbacks,
    });
    expect(v).toMatchObject({ subtopics: 'a, b', keyConcepts: 'x', questionStyle: 'style', preferences: 'Preferences: use tables' });
  });
});

describe('splitStudentFields', () => {
  it('splits out [UPPER CASE] fields, Turkish letters included', () => {
    const parts = splitStudentFields('Soru: [SORUYU BURAYA YAPIŞTIR] ve [DOĞRU CEVAP].');
    expect(parts.filter((p) => p.field).map((p) => p.text)).toEqual(['[SORUYU BURAYA YAPIŞTIR]', '[DOĞRU CEVAP]']);
    expect(parts.map((p) => p.text).join('')).toBe('Soru: [SORUYU BURAYA YAPIŞTIR] ve [DOĞRU CEVAP].');
  });
  it('ignores lower-case and numeric brackets', () => {
    expect(splitStudentFields('arr[0] and [note]').some((p) => p.field)).toBe(false);
  });
});

describe('topicTemplates', () => {
  const t = (id, special = false) => ({ id, data: { special } });
  const templates = [t('explain-topic'), t('current-events', true)];
  it('shows a special template only on topics listing it in extraPrompts', () => {
    expect(topicTemplates(templates, { data: {} }).map((x) => x.id)).toEqual(['explain-topic']);
    expect(topicTemplates(templates, { data: { extraPrompts: ['current-events'] } })).toHaveLength(2);
  });
});

describe('applyFeedback', () => {
  const at = '2026-10-27T00:00:00Z';
  const state = (extra = {}) => ({ level: 3, length: 'normal', feedback: [], ...extra });

  it('too hard → level −1, too easy → +1, just right changes nothing', () => {
    expect(applyFeedback(state(), 'too-hard', at).level).toBe(2);
    expect(applyFeedback(state(), 'too-easy', at).level).toBe(4);
    expect(applyFeedback(state(), 'just-right', at)).toMatchObject({ level: 3, length: 'normal' });
  });
  it('the length axis is independent', () => {
    expect(applyFeedback(state(), 'too-long', at)).toMatchObject({ level: 3, length: 'brief' });
    expect(applyFeedback(state(), 'more-detail', at).length).toBe('detailed');
  });
  it('the same feedback twice in a row moves one extra step', () => {
    const one = applyFeedback(state({ level: 5 }), 'too-hard', at);
    expect(one.level).toBe(4);
    expect(applyFeedback(one, 'too-hard', at).level).toBe(2);
  });
  it('other feedback in between resets the streak', () => {
    let s = applyFeedback(state({ level: 5 }), 'too-hard', at);
    s = applyFeedback(s, 'just-right', at);
    expect(applyFeedback(s, 'too-hard', at).level).toBe(3);
  });
  it('stays within bounds', () => {
    expect(applyFeedback(state({ level: 1 }), 'too-hard', at).level).toBe(1);
    const s = applyFeedback(state({ length: 'detailed', feedback: [{ type: 'more-detail' }] }), 'more-detail', at);
    expect(s.length).toBe('detailed');
  });
  it('keeps at most 10 history entries', () => {
    const history = Array.from({ length: 10 }, () => ({ type: 'just-right', at }));
    const s = applyFeedback(state({ feedback: history }), 'too-easy', at);
    expect(s.feedback).toHaveLength(10);
    expect(s.feedback.at(-1).type).toBe('too-easy');
  });
  it('throws on an unknown type', () => {
    expect(() => applyFeedback(state(), 'great', at)).toThrow();
  });
});

describe('initialSettings', () => {
  it('3 / normal without data', () => {
    expect(initialSettings(['tarih/a'], {})).toEqual({ level: 3, length: 'normal' });
  });
  it('rounded average of topics in the same subject', () => {
    const profile = {
      'tarih/a': { level: 4, length: 'detailed' },
      'tarih/b': { level: 5, length: 'detailed' },
      'cografya/c': { level: 1, length: 'brief' },
    };
    expect(initialSettings(['tarih/a', 'tarih/b', 'tarih/new'], profile)).toEqual({ level: 5, length: 'detailed' });
  });
});

describe('providerUrl', () => {
  it('ChatGPT uses ?prompt=, Claude uses ?q=, with encoded text', () => {
    const text = 'Konu: Osmanlı & Türk "tarihi"\nnew line';
    const c = new URL(providerUrl('chatgpt', text));
    expect(c.origin + c.pathname).toBe('https://chatgpt.com/');
    expect(c.searchParams.get('prompt')).toBe(text);
    expect(c.searchParams.has('q')).toBe(false);
    const k = new URL(providerUrl('claude', text));
    expect(k.origin + k.pathname).toBe('https://claude.ai/new');
    expect(k.searchParams.get('q')).toBe(text);
  });
  it('opens just the site for very long text', () => {
    expect(providerUrl('claude', 'x'.repeat(MAX_URL_TEXT + 1))).toBe('https://claude.ai/new');
  });
  it('throws on an unknown provider', () => {
    expect(() => providerUrl('other', 'x')).toThrow();
  });
});

describe('promptErrors', () => {
  const levels = [1, 2, 3, 4, 5].map((n) => ({ id: `l${n}`, data: { level: n, name: { tr: `L${n}` }, instruction: { tr: 'i' } } }));
  const lengths = ['brief', 'normal', 'detailed'].map((id) => ({ id, data: { name: { tr: id }, instruction: { tr: 'i' } } }));
  const exams = [
    {
      id: 'sample',
      data: {
        name: { tr: 'Örnek' },
        sessions: [{ tests: [{ name: { tr: 'GK' }, subjects: [{ id: 'tarih', name: { tr: 'Tarih' }, topics: ['tarih/a'] }] }] }],
      },
    },
  ];
  const topic = (extra = {}) => ({ id: 'tarih/a', data: { title: 'A', subtopics: [], keyConcepts: [], ...extra } });
  const template = (id, body, special = false) => ({ id, body, data: { special } });
  const all = (extra) => ({ levels, lengths, exams, topics: [topic()], locale: 'tr', ...extra });

  it('no errors for valid templates', () => {
    expect(promptErrors(all({ templates: [template('a', '{{topic}} {{levelName}} {{preferences}}')] }))).toEqual([]);
  });
  it('catches an unknown variable', () => {
    expect(promptErrors(all({ templates: [template('a', '{{topic}} {{score}}')] }))[0]).toMatch(/unknown variable score/);
  });
  it('reports an unclosed brace once per template', () => {
    expect(promptErrors(all({ templates: [template('a', '{{topic}} {{missing')] }))).toEqual([
      "template 'tr/a': unclosed or malformed {{…}} marker",
    ]);
  });
  it('accepts variables with inner spaces', () => {
    expect(promptErrors(all({ templates: [template('a', '{{ topic }} {{ levelName }}')] }))).toEqual([]);
  });
  it('catches a missing or non-special extra prompt', () => {
    const errors = promptErrors(all({ templates: [template('a', '{{topic}}')], topics: [topic({ extraPrompts: ['a', 'none'] })] }));
    expect(errors).toHaveLength(2);
  });
  it('catches missing levels or lengths', () => {
    const errors = promptErrors(all({ templates: [template('a', '{{topic}}')], levels: levels.slice(1), lengths: lengths.slice(1) }));
    expect(errors.join('\n')).toMatch(/levels must be 1–5/);
    expect(errors.join('\n')).toMatch(/lengths must be/);
  });
});
