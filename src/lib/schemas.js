import { z } from 'astro/zod';
import { LOCALES } from '../i18n/locales.js';

/** Document types that exam and topic data rely on (spec §5). */
export const SOURCE_TYPES = ['osym-guide', 'osym-oabt-scope', 'past-exam-analysis'];

/**
 * skeleton: only the name from the official list; draft/published: content fields must be filled.
 * published: a person has reviewed this locale's summary (docs/REVIEW.md).
 */
export const TOPIC_STATES = ['skeleton', 'draft', 'published'];

const slug = z.string().regex(/^[a-z0-9-]+$/, 'lowercase letters, digits and hyphens only');
const topicRef = z.string().regex(/^[a-z0-9-]+\/[a-z0-9-]+$/, "must be 'subject/slug'");
const positiveInt = z.number().int().positive();
const percent = z.number().positive().max(100);
/** Visible text in every locale: { tr: '…', en: '…' }. */
const localizedText = z.object(Object.fromEntries(LOCALES.map((l) => [l, z.string().min(1)])));

/** `data/sources.json`: tracked official documents (hash-checked for changes in K7). */
export const sourceSchema = z.object({
  id: slug,
  title: localizedText,
  kind: z.enum(['guide', 'topic-distribution', 'question-booklet']),
  sourceType: z.enum(SOURCE_TYPES),
  year: positiveInt,
  url: z.url(),
  sha256: z.string().regex(/^[0-9a-f]{64}$/),
  checkedAt: z.coerce.date(),
});

/** `data/calendar.yaml`: application and exam dates (countdown). */
export const calendarSchema = z.object({
  id: slug,
  exam: slug,
  kind: z.enum(['application', 'late-application', 'exam']),
  start: z.coerce.date(),
  end: z.coerce.date().optional(),
  time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  note: localizedText.optional(),
  document: slug,
});

/** An exam's source points to a document in the `sources` collection. */
const examSource = z.object({
  document: slug,
  verified: z.boolean(),
  // Question booklets linked as "ÖSYM booklet" on topic pages (link only).
  booklets: z.array(slug).default([]),
});

const subjectSchema = z.object({
  id: slug,
  name: localizedText,
  questionCount: positiveInt,
  // The guide's "approximate weight"; when set, questionCount is derived from it.
  weight: percent.optional(),
  topics: z.array(topicRef),
});

const testSchema = z.object({
  name: localizedText,
  questionCount: positiveInt,
  durationMin: positiveInt.optional(),
  subjects: z.array(subjectSchema).min(1),
});

const sessionSchema = z
  .object({
    name: localizedText,
    durationMin: positiveInt.optional(),
    // Like ÖABT: the candidate takes only one test in this session.
    singleTestChoice: z.boolean().default(false),
    tests: z.array(testSchema).min(1),
  })
  .refine((s) => s.durationMin || s.tests.every((t) => t.durationMin), {
    message: 'the session or every test needs durationMin',
    path: ['durationMin'],
  });

export const examSchema = z.object({
  name: localizedText,
  shortName: localizedText,
  // Grouping and order on the home page.
  group: z.enum(['KPSS', 'MEB-AGS']),
  order: positiveInt,
  description: localizedText.optional(),
  // Like A Grubu: candidates pick sessions, so total questions/duration are meaningless.
  sessionsOptional: z.boolean().default(false),
  source: examSource,
  sessions: z.array(sessionSchema).min(1),
});

/** One locale's topic file (`topics/<locale>/<subject>/<slug>.md`); shared fields must match across locales. */
export const topicSchema = z
  .object({
    title: z.string().min(1),
    subject: slug,
    state: z.enum(TOPIC_STATES).default('skeleton'),
    subtopics: z.array(z.string().min(1)).default([]),
    keyConcepts: z.array(z.string().min(1)).default([]),
    questionStyle: z.string().min(1).optional(),
    sourceType: z.enum(SOURCE_TYPES),
    sourceYear: positiveInt,
    // true if the topic name/scope was seen in an official document; `document` is its id in sources.
    verified: z.boolean().default(false),
    document: slug.optional(),
    updated: z.coerce.date(),
    questionDistribution: z.record(z.string().regex(/^\d{4}$/), z.number().int().nonnegative()).optional(),
    extraPrompts: z.array(z.string().min(1)).optional(),
    aliases: z.array(z.string().min(1)).optional(),
    // Per locale: who reviewed this file's summary and when. Only on published topics.
    reviewedBy: z.string().min(1).optional(),
    reviewedAt: z.coerce.date().optional(),
  })
  .superRefine((t, ctx) => {
    if (t.state === 'published') {
      for (const field of ['reviewedBy', 'reviewedAt']) {
        if (!t[field]) ctx.addIssue({ code: 'custom', path: [field], message: 'required when published' });
      }
      if (!t.verified) ctx.addIssue({ code: 'custom', path: ['verified'], message: 'a published topic must be verified against an official document' });
      if (t.reviewedAt && t.reviewedAt < t.updated) {
        ctx.addIssue({ code: 'custom', path: ['reviewedAt'], message: 'edited after review: review again or set state back to draft' });
      }
    } else {
      for (const field of ['reviewedBy', 'reviewedAt']) {
        if (t[field]) ctx.addIssue({ code: 'custom', path: [field], message: `only allowed when published, not ${t.state}` });
      }
    }
    if (t.state === 'skeleton') return;
    for (const field of ['subtopics', 'keyConcepts']) {
      if (!t[field].length) ctx.addIssue({ code: 'custom', path: [field], message: `cannot be empty when ${t.state}` });
    }
    if (!t.questionStyle) ctx.addIssue({ code: 'custom', path: ['questionStyle'], message: `required when ${t.state}` });
  });

/** `src/prompts/levels.yaml`: levels 1–5 and the instruction given to the model. */
export const levelSchema = z.object({
  id: slug,
  level: z.number().int().min(1).max(5),
  name: localizedText,
  instruction: localizedText,
});

/** `src/prompts/lengths.yaml`: brief / normal / detailed. */
export const lengthSchema = z.object({
  id: z.enum(['brief', 'normal', 'detailed']),
  order: positiveInt,
  name: localizedText,
  instruction: localizedText,
});

/** Frontmatter of `src/prompts/templates/<locale>/<id>.md`; the body is the template text. */
export const templateSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  order: positiveInt,
  // A special template only shows on topics that list it in `extraPrompts`.
  special: z.boolean().default(false),
});
