/**
 * Data the prompt panel sends to the browser for one locale: template texts,
 * level/length instructions and each topic's exam contexts. Pure; built at build time.
 */
import { examSubjects, topicUsages } from './curriculum.js';
import { topicTemplates } from './prompt.js';

/** `data`: output of loadData(); `topics`: that locale's topic entries to include. */
export function panelData({ templates, levels, lengths, exams }, topics, locale) {
  const text = (v) => (typeof v === 'string' ? v : v[locale]);
  const localeTemplates = templates[locale];
  return {
    templates: localeTemplates.map((t) => ({ id: t.id, title: t.data.title, description: t.data.description, text: t.body.trim() })),
    levels: levels.map((l) => ({ level: l.data.level, name: text(l.data.name), instruction: text(l.data.instruction) })),
    lengths: lengths.map((l) => ({ id: l.id, name: text(l.data.name), instruction: text(l.data.instruction) })),
    exams: exams
      .filter((e) => examSubjects(e).some(({ subject }) => subject.topics.length))
      .sort((a, b) => a.data.group.localeCompare(b.data.group) || a.data.order - b.data.order)
      // In the library, topic choices are grouped by subject in exam order.
      .map((e) => ({
        id: e.id,
        shortName: text(e.data.shortName),
        subjects: examSubjects(e)
          .filter(({ subject }) => subject.topics.length)
          .map(({ subject }) => ({ name: text(subject.name), topics: subject.topics })),
      })),
    topics: topics.map((t) => {
      const usages = topicUsages(exams, t.id);
      return {
        id: t.id,
        title: t.data.title,
        subtopics: t.data.subtopics,
        keyConcepts: t.data.keyConcepts,
        questionStyle: t.data.questionStyle ?? '',
        // The starting level comes from the average of topics in the same subject.
        subjectTopics: [...new Set(usages.flatMap((u) => u.subject.topics))],
        contexts: usages.map((u) => ({
          examId: u.exam.id,
          exam: text(u.exam.data.name),
          shortName: text(u.exam.data.shortName),
          subject: text(u.subject.name),
        })),
        templates: topicTemplates(localeTemplates, t).map((x) => x.id),
      };
    }),
  };
}
