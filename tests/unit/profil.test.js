import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ANAHTAR, ayarKaydet, depolamaKullanilabilir, konuKaydet, profilOku, profilSil } from '../../src/scripts/profil.js';

function sahteDepo() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
  };
}

describe('profil depolama', () => {
  beforeEach(() => vi.stubGlobal('localStorage', sahteDepo()));
  afterEach(() => vi.unstubAllGlobals());

  it('kayıt yokken boş profil döner', () => {
    expect(profilOku()).toMatchObject({ surum: 1, konular: {}, tercihler: '' });
  });

  it('konu kaydını birleştirir, diğer alanları korur', () => {
    localStorage.setItem(ANAHTAR, JSON.stringify({ surum: 1, konular: { 'tarih/a': { not: 'önemli', seviye: 2 } } }));
    expect(konuKaydet('tarih/a', { seviye: 4, uzunluk: 'ozet' })).toBe(true);
    const k = profilOku().konular['tarih/a'];
    expect(k).toMatchObject({ not: 'önemli', seviye: 4, uzunluk: 'ozet' });
    expect(k.guncelleme).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('ayarları yazar ve ayarGuncelleme tazelenir', () => {
    ayarKaydet({ tercihler: 'tablo kullan' });
    const p = profilOku();
    expect(p.tercihler).toBe('tablo kullan');
    expect(p.ayarGuncelleme).toBeTruthy();
  });

  it('bozuk JSON ve geçersiz profil boş profile düşer', () => {
    localStorage.setItem(ANAHTAR, '{bozuk');
    expect(profilOku().konular).toEqual({});
    localStorage.setItem(ANAHTAR, JSON.stringify({ surum: 1, konular: { 'tarih/a': { durum: 'yok' } } }));
    expect(profilOku().konular).toEqual({});
  });

  it('eski son-sınav anahtarını profile taşır ve siler', () => {
    localStorage.setItem('kpss-rehber:son-sinav', JSON.stringify({ sinavId: 'dhbt', ad: 'DHBT' }));
    expect(profilOku().secilenSinav).toBe('dhbt');
    expect(localStorage.getItem('kpss-rehber:son-sinav')).toBeNull();
    expect(JSON.parse(localStorage.getItem(ANAHTAR)).secilenSinav).toBe('dhbt');
  });

  it('profilSil kaydı kaldırır', () => {
    konuKaydet('tarih/a', { durum: 'tamamlandi' });
    profilSil();
    expect(localStorage.getItem(ANAHTAR)).toBeNull();
  });

  it('depolama yazmayı reddederse false döner', () => {
    vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => { throw new Error('QuotaExceeded'); }, removeItem() {} });
    expect(konuKaydet('tarih/a', { seviye: 3 })).toBe(false);
    expect(depolamaKullanilabilir()).toBe(false);
  });
});
