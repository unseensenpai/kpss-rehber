import { getCollection } from 'astro:content';
import { validateData } from './validate.js';

/**
 * Splits `<locale>/<rest>` entry ids into `{ locale: [{ id: rest, locale, data, body, entry }] }`.
 * `entry` keeps the original collection entry for `render()`.
 */
export function byLocale(entries) {
  const result = {};
  for (const entry of entries) {
    const [locale, ...rest] = entry.id.split('/');
    (result[locale] ??= []).push({ id: rest.join('/'), locale, data: entry.data, body: entry.body, entry });
  }
  return result;
}

/**
 * Loads all collections and checks consistency. Pages read data through this;
 * any error stops the build. `topics` and `templates` are maps by locale.
 */
export async function loadData() {
  const names = ['exams', 'topics', 'sources', 'calendar', 'templates', 'levels', 'lengths'];
  const collections = await Promise.all(names.map((n) => getCollection(n)));
  const all = Object.fromEntries(names.map((n, i) => [n, collections[i]]));
  all.topics = byLocale(all.topics);
  all.templates = byLocale(all.templates);
  // Ordered lists: pages and the prompt panel rely on this order.
  for (const list of Object.values(all.templates)) list.sort((a, b) => a.data.order - b.data.order);
  all.levels.sort((a, b) => a.data.level - b.data.level);
  all.lengths.sort((a, b) => a.data.order - b.data.order);
  const errors = validateData(all);
  if (errors.length) throw new Error(`Data validation failed (${errors.length}):\n- ${errors.join('\n- ')}`);
  return all;
}
