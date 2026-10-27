/**
 * Derivations pages need from the curriculum data. All pure; inputs are content
 * collection entries (`{ id, data }`).
 */

const DAY_MS = 24 * 60 * 60 * 1000;

/** Every (session, test, subject) triple of an exam, in YAML order. */
export function examSubjects(exam) {
  return exam.data.sessions.flatMap((session) =>
    session.tests.flatMap((test) => test.subjects.map((subject) => ({ session, test, subject }))),
  );
}

/** Unique topic ids used by an exam. */
export function examTopics(exam) {
  return [...new Set(examSubjects(exam).flatMap(({ subject }) => subject.topics))];
}

/**
 * Total questions, duration and test count of an exam. In a single-test-choice
 * session the longest test counts; with optional sessions (`optional` true) the
 * totals cover all sessions.
 */
export function examSummary(exam) {
  let questions = 0;
  let durationMin = 0;
  let testCount = 0;
  for (const s of exam.data.sessions) {
    const counts = s.tests.map((t) => t.questionCount);
    const durations = s.tests.map((t) => t.durationMin ?? 0);
    testCount += s.tests.length;
    if (s.singleTestChoice) {
      questions += Math.max(...counts);
      durationMin += s.durationMin ?? Math.max(...durations);
    } else {
      questions += counts.reduce((a, b) => a + b, 0);
      durationMin += s.durationMin ?? durations.reduce((a, b) => a + b, 0);
    }
  }
  return { questions, durationMin, testCount, optional: Boolean(exam.data.sessionsOptional) };
}

/** Which exams/tests use a topic, and under which subject. */
export function topicUsages(exams, topicId) {
  return exams.flatMap((exam) =>
    examSubjects(exam)
      .filter(({ subject }) => subject.topics.includes(topicId))
      .map(({ test, subject }) => ({ exam, test, subject })),
  );
}

/** Yearly average question count from `questionDistribution` (1 decimal), or null. */
export function topicAverage(topic) {
  const values = Object.values(topic.data.questionDistribution ?? {});
  if (!values.length) return null;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}

/** Sorts topics by average question count, descending; topics without data keep their order at the end. */
export function sortByMostAsked(topics) {
  return topics
    .map((topic, i) => ({ topic, i, avg: topicAverage(topic) }))
    .sort((a, b) => (b.avg ?? -1) - (a.avg ?? -1) || a.i - b.i)
    .map((x) => x.topic);
}

/**
 * Exam days of an exam in the calendar: `next` is the first day on or after `now`;
 * when all have passed, only `last` is set.
 */
export function examDates(calendar, examId, now = new Date()) {
  const days = calendar
    .filter((c) => c.data.exam === examId && c.data.kind === 'exam')
    .map((c) => c.data)
    .sort((a, b) => a.start - b.start);
  const next = days.find((d) => daysUntil(d.start, now) >= 0) ?? null;
  return { next, last: days.at(-1) ?? null };
}

/**
 * Whole days until a calendar day. Calendar dates come from YAML as UTC midnight,
 * while `now` is the user's local day; they are read separately.
 */
export function daysUntil(target, now = new Date()) {
  const t = new Date(target);
  const targetDay = Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate());
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((targetDay - today) / DAY_MS);
}

/** Prefilled GitHub issue link for reporting a mistake; `prefix` is the localized title tag. */
export function reportIssueUrl(repo, { title, page, prefix }) {
  const p = new URLSearchParams({ template: 'bug-report.yml', title: `${prefix} ${title}`, page });
  return `https://github.com/${repo}/issues/new?${p}`;
}
