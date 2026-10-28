/**
 * Content review helpers (docs/REVIEW.md). Pure: they take and return file text so
 * frontmatter edits stay line-based and keep the rest of the file untouched.
 */

const FRONTMATTER = /^---\n([\s\S]*?)\n---\n/;
const REVIEW_FIELDS = ['reviewedBy', 'reviewedAt'];
const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** A top-level `key: value` line's value without surrounding quotes. */
function scalar(raw) {
  const value = raw.trim();
  if (/^".*"$/.test(value)) return JSON.parse(value);
  if (/^'.*'$/.test(value)) return value.slice(1, -1).replace(/''/g, "'");
  return value;
}

/** Splits a topic file into frontmatter lines and body; throws when there is no frontmatter. */
function split(text) {
  const match = text.replace(/\r\n/g, '\n').match(FRONTMATTER);
  if (!match) throw new Error('no frontmatter');
  return { lines: match[1].split('\n'), body: text.replace(/\r\n/g, '\n').slice(match[0].length) };
}

const join = (lines, body) => `---\n${lines.join('\n')}\n---\n${body}`;
const keyOf = (line) => line.match(/^([A-Za-z]+):/)?.[1];

/** Top-level scalar fields of a topic file (lists and nested values are skipped). */
export function frontmatter(text) {
  const fields = {};
  for (const line of split(text).lines) {
    const key = keyOf(line);
    const value = key && line.slice(key.length + 1).trim();
    if (value && !value.startsWith('[')) fields[key] = scalar(value);
  }
  return fields;
}

/** Marks a file as reviewed: `state: published` plus `reviewedBy`/`reviewedAt` after `updated`. */
export function publish(text, { by, date }) {
  if (!by?.trim()) throw new Error('reviewer name is required');
  if (!DATE.test(date)) throw new Error(`date must be YYYY-MM-DD, got '${date}'`);
  const fields = frontmatter(text);
  if (fields.state === 'skeleton') throw new Error('a skeleton topic has no summary to review');
  if (fields.verified !== 'true') throw new Error('the topic is not verified against an official document');
  if (fields.updated > date) throw new Error(`the file was updated (${fields.updated}) after the review date (${date})`);
  const { lines, body } = split(text);
  const kept = lines.filter((l) => !REVIEW_FIELDS.includes(keyOf(l)));
  const out = kept.map((l) => (keyOf(l) === 'state' ? 'state: published' : l));
  const at = out.findIndex((l) => keyOf(l) === 'updated');
  out.splice(at < 0 ? out.length : at + 1, 0, `reviewedBy: ${JSON.stringify(by.trim())}`, `reviewedAt: ${date}`);
  return join(out, body);
}

/** Takes a file back to draft and drops its review fields. */
export function unpublish(text) {
  const { lines, body } = split(text);
  return join(
    lines.filter((l) => !REVIEW_FIELDS.includes(keyOf(l))).map((l) => (keyOf(l) === 'state' ? 'state: draft' : l)),
    body,
  );
}

/**
 * Review progress. `topics`: `[{ id, locale, fields }]` with `fields` from `frontmatter()`.
 * Returns state counts per locale and the published files edited after their review.
 */
export function progress(topics) {
  const counts = {};
  const stale = [];
  for (const { id, locale, fields } of topics) {
    const state = fields.state ?? 'skeleton';
    (counts[locale] ??= { skeleton: 0, draft: 0, published: 0 })[state]++;
    if (state === 'published' && fields.reviewedAt < fields.updated) stale.push(`${locale}/${id}`);
  }
  return { counts, stale };
}
