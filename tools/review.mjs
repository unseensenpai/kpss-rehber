#!/usr/bin/env node
// Content review (docs/REVIEW.md).
//
//   node tools/review.mjs                                   review progress per locale
//   node tools/review.mjs --list draft [--subject <id>] [--locale tr]
//                                                           files in a state, with paths
//   node tools/review.mjs --publish <subject/slug> --locale tr --by "<name>" [--date YYYY-MM-DD]
//                                                           mark a reviewed file published
//   node tools/review.mjs --unpublish <subject/slug> --locale tr
//                                                           take a file back to draft
//
// Review is per locale: the Turkish and English files of a topic are published separately.

import { readFile, readdir, writeFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { frontmatter, progress, publish, unpublish } from './lib/review.js';

const TOPICS = new URL('../src/content/topics/', import.meta.url);
const today = () => new Date().toISOString().slice(0, 10);

const { values } = parseArgs({
  options: {
    list: { type: 'string' },
    subject: { type: 'string' },
    locale: { type: 'string' },
    publish: { type: 'string' },
    unpublish: { type: 'string' },
    by: { type: 'string' },
    date: { type: 'string' },
  },
});

/** Every topic file as `{ id, locale, path, fields }`. */
async function topics() {
  const result = [];
  for (const locale of await readdir(TOPICS)) {
    for (const subject of await readdir(new URL(`${locale}/`, TOPICS))) {
      for (const file of await readdir(new URL(`${locale}/${subject}/`, TOPICS))) {
        if (!file.endsWith('.md')) continue;
        const path = `src/content/topics/${locale}/${subject}/${file}`;
        const text = await readFile(new URL(`${locale}/${subject}/${file}`, TOPICS), 'utf8');
        result.push({ id: `${subject}/${file.slice(0, -3)}`, locale, path, fields: frontmatter(text) });
      }
    }
  }
  return result;
}

/** Applies `edit` to the file of one topic in each requested locale. */
async function editTopic(id, edit) {
  if (!values.locale) throw new Error('--locale is required (tr, en or tr,en): each language is reviewed separately');
  for (const locale of values.locale.split(',')) {
    const url = new URL(`${locale}/${id}.md`, TOPICS);
    const before = await readFile(url, 'utf8').catch(() => {
      throw new Error(`no file for ${locale}/${id}`);
    });
    await writeFile(url, edit(before));
    console.log(`${locale}/${id}: ${frontmatter(edit(before)).state}`);
  }
}

try {
  if (values.publish) {
    const date = values.date ?? today();
    await editTopic(values.publish, (text) => publish(text, { by: values.by, date }));
  } else if (values.unpublish) {
    await editTopic(values.unpublish, unpublish);
  } else if (values.list) {
    const all = await topics();
    const rows = all.filter(
      (t) =>
        (t.fields.state ?? 'skeleton') === values.list &&
        (!values.subject || t.id.startsWith(`${values.subject}/`)) &&
        (!values.locale || t.locale === values.locale),
    );
    for (const t of rows) console.log(`${t.locale}/${t.id}\t${t.fields.title}\t${t.path}`);
    console.log(`${rows.length} file(s)`);
  } else {
    const { counts, stale } = progress(await topics());
    for (const [locale, c] of Object.entries(counts)) {
      const total = c.skeleton + c.draft + c.published;
      console.log(`${locale}: ${c.published}/${total} published, ${c.draft} draft, ${c.skeleton} skeleton`);
    }
    if (stale.length) console.log(`edited after review (review again or unpublish):\n  ${stale.join('\n  ')}`);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
