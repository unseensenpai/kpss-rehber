import { describe, expect, it } from 'vitest';
import { formatDate, LOCALES, localePath, localized, translator } from '../../src/i18n/index.js';
import tr from '../../src/i18n/tr.js';

/** Dotted key paths of a dictionary (leaves only). */
function keys(obj, prefix = '') {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
}

describe('translator', () => {
  const t = translator('tr');
  it('replaces placeholders', () => {
    expect(t('progress.text', { done: 1, total: 4 })).toBe('1/4 tamamlandı');
  });
  it('calls function values with params', () => {
    expect(t('countdown', { days: 5 })).toBe('5 gün kaldı');
    expect(t('countdown', { days: 0 })).toBe('bugün');
    expect(t('countdown', { days: -1 })).toBe('yapıldı');
  });
  it('throws on a missing key so gaps fail the build', () => {
    expect(() => t('nope.missing')).toThrow(/Missing translation: tr:nope\.missing/);
  });
  it('throws on an unknown locale', () => {
    expect(() => translator('xx')).toThrow();
  });
});

describe('dictionaries', () => {
  it('every locale has exactly the same keys as Turkish', async () => {
    for (const locale of LOCALES) {
      const dict = (await import(`../../src/i18n/${locale}.js`)).default;
      expect(keys(dict).sort(), locale).toEqual(keys(tr).sort());
    }
  });
});

describe('helpers', () => {
  it('localePath prefixes base and locale', () => {
    expect(localePath('tr', '/exam/dhbt/')).toBe('/tr/exam/dhbt/');
    expect(localePath('tr')).toBe('/tr/');
  });
  it('localized picks the locale value, passes plain strings through and throws when missing', () => {
    expect(localized({ tr: 'Tarih' }, 'tr')).toBe('Tarih');
    expect(localized('ÖABT', 'tr')).toBe('ÖABT');
    expect(() => localized({ tr: 'Tarih' }, 'en')).toThrow();
  });
  it('formatDate uses the locale', () => {
    expect(formatDate(new Date('2026-09-06'), 'tr')).toBe('6 Eylül 2026');
  });
});
