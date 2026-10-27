import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ANAHTAR, konuKaydet, profilOku } from '../../src/scripts/profil.js';

function sahteDepo() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
  };
}

describe('profil', () => {
  beforeEach(() => vi.stubGlobal('localStorage', sahteDepo()));
  afterEach(() => vi.unstubAllGlobals());

  it('kayıt yokken boş profil döner', () => {
    expect(profilOku()).toMatchObject({ surum: 1, konular: {} });
  });

  it('konu kaydını birleştirir, diğer alanları korur', () => {
    localStorage.setItem(ANAHTAR, JSON.stringify({ surum: 1, konular: { 'tarih/a': { not: 'önemli', seviye: 2 } } }));
    expect(konuKaydet('tarih/a', { seviye: 4, uzunluk: 'ozet' })).toBe(true);
    const k = profilOku().konular['tarih/a'];
    expect(k).toMatchObject({ not: 'önemli', seviye: 4, uzunluk: 'ozet' });
    expect(k.guncelleme).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('bozuk JSON boş profile düşer', () => {
    localStorage.setItem(ANAHTAR, '{bozuk');
    expect(profilOku().konular).toEqual({});
  });

  it('depolama yazmayı reddederse false döner', () => {
    vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => { throw new Error('QuotaExceeded'); } });
    expect(konuKaydet('tarih/a', { seviye: 3 })).toBe(false);
  });
});
