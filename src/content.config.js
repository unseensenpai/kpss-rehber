import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import {
  calendarSchema,
  examSchema,
  lengthSchema,
  levelSchema,
  sourceSchema,
  templateSchema,
  topicSchema,
} from './lib/schemas.js';

const exams = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/exams' }),
  schema: examSchema,
});

// The id comes from the path: topics/tr/tarih/osmanli-tarihi.md → 'tr/tarih/osmanli-tarihi'.
// lib/data.js splits it into locale 'tr' and topic id 'tarih/osmanli-tarihi'.
const topics = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/topics' }),
  schema: topicSchema,
});

const sources = defineCollection({
  loader: file('./data/sources.json'),
  schema: sourceSchema,
});

const calendar = defineCollection({
  loader: file('./data/calendar.yaml'),
  schema: calendarSchema,
});

// Prompt templates: the body is used as raw text (entry.body), not rendered as Markdown.
const templates = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/prompts/templates' }),
  schema: templateSchema,
});

const levels = defineCollection({
  loader: file('./src/prompts/levels.yaml'),
  schema: levelSchema,
});

const lengths = defineCollection({
  loader: file('./src/prompts/lengths.yaml'),
  schema: lengthSchema,
});

export const collections = { exams, topics, sources, calendar, templates, levels, lengths };
