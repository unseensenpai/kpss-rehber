/**
 * Minimal i18n: locales, dictionary lookup, localized paths and content fields.
 * Used both at build time (Astro) and in browser scripts.
 */
import { withBase } from '../lib/path.js';
import { DEFAULT_LOCALE, LOCALES } from './locales.js';
import tr from './tr.js';

export { DEFAULT_LOCALE, LOCALES };
/** BCP 47 tags for Intl formatting. */
export const INTL_LOCALE = { tr: 'tr-TR', en: 'en-GB' };
/** Each language's name in its own language, for the language switcher. */
export const LANGUAGE_NAMES = { tr: 'Türkçe', en: 'English' };

const DICTIONARIES = { tr };

/**
 * Returns `t(key, params)` for a locale. Keys are dotted paths; string values get
 * `{name}` placeholders replaced, function values are called with `params`.
 * A missing key throws so gaps fail the build instead of showing raw keys.
 */
export function translator(locale) {
  const dict = DICTIONARIES[locale];
  if (!dict) throw new Error(`Unknown locale: ${locale}`);
  return (key, params = {}) => {
    const value = key.split('.').reduce((o, k) => o?.[k], dict);
    if (value === undefined) throw new Error(`Missing translation: ${locale}:${key}`);
    if (typeof value === 'function') return value(params);
    if (typeof value !== 'string') return value;
    return value.replace(/\{(\w+)\}/g, (m, k) => (params[k] !== undefined ? String(params[k]) : m));
  };
}

/** The page's locale: the `[locale]` route param, or the default. */
export function localeOf(astro) {
  return astro.params.locale ?? DEFAULT_LOCALE;
}

/** In-site link for a locale: localePath('tr', '/exam/dhbt/') → '/kpss-rehber/tr/exam/dhbt/'. */
export function localePath(locale, path = '/') {
  return withBase(`/${locale}${path.startsWith('/') ? path : `/${path}`}`);
}

/** Picks a content field's value for a locale (`{ tr: '…', en: '…' }`). */
export function localized(value, locale) {
  if (value === undefined || value === null || typeof value === 'string') return value;
  const v = value[locale];
  if (v === undefined) throw new Error(`Missing ${locale} value: ${JSON.stringify(value)}`);
  return v;
}

/** "6 Eylül 2026" / "6 September 2026". Calendar dates are UTC midnight. */
export function formatDate(date, locale) {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(date),
  );
}

/** `getStaticPaths` entries for every locale. */
export function localeParams() {
  return LOCALES.map((locale) => ({ params: { locale } }));
}
