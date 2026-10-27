import { describe, expect, it } from 'vitest';
import {
  bosProfil,
  ilerleme,
  profilBirlestir,
  profilDogrula,
  profilYukselt,
  takmaAdEslesmesi,
  takmaAdlariUygula,
  yedekDosyaAdi,
} from '../../src/lib/profil-veri.js';

const T1 = '2026-10-01T10:00:00.000Z';
const T2 = '2026-10-20T10:00:00.000Z';

const profil = (ek = {}) => ({ ...bosProfil(new Date(T1)), ...ek });

describe('profilDogrula', () => {
  it('geçerli profili kabul eder, bilinmeyen alanları atar', () => {
    const { hatalar, profil: p } = profilDogrula({
      ...profil({ hedefTarih: '2027-09-05', tercihler: 'tablo kullan' }),
      fazla: 'x',
      konular: { 'tarih/a': { durum: 'tamamlandi', seviye: 4, not: 'önemli', guncelleme: T1, gizli: 1 } },
    });
    expect(hatalar).toEqual([]);
    expect(p.fazla).toBeUndefined();
    expect(p.konular['tarih/a']).toEqual({ durum: 'tamamlandi', seviye: 4, not: 'önemli', guncelleme: T1 });
  });

  it.each([
    [null, /yedeği değil/],
    [[], /yedeği değil/],
    [{ konular: {} }, /sürüm/],
    [{ surum: 99, konular: {} }, /daha yeni/],
  ])('yedek olmayan ya da uyumsuz veriyi reddeder (%#)', (ham, mesaj) => {
    const { hatalar, profil: p } = profilDogrula(ham);
    expect(p).toBeNull();
    expect(hatalar[0]).toMatch(mesaj);
  });

  it('bozuk konu alanlarını Türkçe hatayla bildirir', () => {
    const { hatalar, profil: p } = profilDogrula(
      profil({
        konular: {
          'tarih/a': { durum: 'bitti' },
          'tarih/b': { seviye: 9 },
          'tarih/c': { uzunluk: 'uzun' },
          'tarih/d': { not: 'x'.repeat(2001) },
          'tarih/e': { geriBildirim: [{ tur: 'harika', tarih: T1 }] },
          'kotu kimlik': {},
        },
      }),
    );
    expect(p).toBeNull();
    expect(hatalar).toHaveLength(6);
    expect(hatalar.join('\n')).toMatch(/bilinmeyen durum 'bitti'/);
  });

  it('hedef tarih biçimini denetler', () => {
    expect(profilDogrula(profil({ hedefTarih: '05.09.2027' })).hatalar[0]).toMatch(/YYYY-AA-GG/);
  });
});

describe('profilYukselt', () => {
  it('dönüşüm zincirini sırayla uygular', () => {
    const donusumler = {
      1: (p) => ({ ...p, a: 1 }),
      2: (p) => ({ ...p, b: p.a + 1 }),
    };
    expect(profilYukselt({ surum: 1 }, donusumler, 3)).toEqual({ surum: 3, a: 1, b: 2 });
  });
  it('eksik adımda hata verir; doğrulama bunu Türkçe bildirir', () => {
    expect(() => profilYukselt({ surum: 1 }, {}, 2)).toThrow(/1\. sürümden/);
    const { hatalar } = profilDogrula(profil({ surum: 1 }), { donusumler: {}, hedef: 2 });
    expect(hatalar[0]).toMatch(/yükseltilemedi/);
  });
  it('dönüşüm sonrası doğrulama yeni şemaya göre yapılır', () => {
    const donusumler = { 1: (p) => ({ ...p, konular: p.eskiKonular, eskiKonular: undefined }) };
    const { profil: p } = profilDogrula(
      { surum: 1, eskiKonular: { 'tarih/a': { durum: 'tekrar' } } },
      { donusumler, hedef: 2 },
    );
    expect(p.konular['tarih/a'].durum).toBe('tekrar');
  });
});

describe('profilBirlestir', () => {
  it('konu bazında güncel olan kazanır; iki taraftaki konular birleşir', () => {
    const mevcut = profil({ konular: { 'tarih/a': { durum: 'calisiyorum', guncelleme: T2 }, 'tarih/b': { durum: 'tekrar', guncelleme: T1 } } });
    const gelen = profil({ konular: { 'tarih/a': { durum: 'tamamlandi', guncelleme: T1 }, 'tarih/b': { durum: 'tamamlandi', guncelleme: T2 }, 'tarih/c': { durum: 'tamamlandi', guncelleme: T1 } } });
    const b = profilBirlestir(mevcut, gelen);
    expect(b.konular['tarih/a'].durum).toBe('calisiyorum');
    expect(b.konular['tarih/b'].durum).toBe('tamamlandi');
    expect(b.konular['tarih/c'].durum).toBe('tamamlandi');
  });
  it('ayarlar güncel olandan gelir; oluşturma en eskisidir', () => {
    const mevcut = profil({ olusturma: T2, tercihler: 'eski', ayarGuncelleme: T1 });
    const gelen = profil({ olusturma: T1, tercihler: 'yeni', hedefTarih: '2027-09-05', ayarGuncelleme: T2 });
    const b = profilBirlestir(mevcut, gelen);
    expect(b).toMatchObject({ tercihler: 'yeni', hedefTarih: '2027-09-05', olusturma: T1 });
  });
});

describe('takma adlar', () => {
  it('eski kimlikleri yenisine taşır, çakışmada güncel olan kalır', () => {
    const eslesme = takmaAdEslesmesi([{ id: 'tarih/osmanli-tarihi', data: { takmaAdlar: ['tarih/osmanli-kurulus'] } }]);
    expect(eslesme).toEqual({ 'tarih/osmanli-kurulus': 'tarih/osmanli-tarihi' });
    const p = takmaAdlariUygula(
      profil({
        konular: {
          'tarih/osmanli-kurulus': { durum: 'tamamlandi', guncelleme: T2 },
          'tarih/osmanli-tarihi': { durum: 'calisiyorum', guncelleme: T1 },
        },
      }),
      eslesme,
    );
    expect(Object.keys(p.konular)).toEqual(['tarih/osmanli-tarihi']);
    expect(p.konular['tarih/osmanli-tarihi'].durum).toBe('tamamlandi');
  });
});

describe('ilerleme', () => {
  it('tamamlanan ve çalışılan konuları sayar', () => {
    const k = { 'a/1': { durum: 'tamamlandi' }, 'a/2': { durum: 'calisiyorum' }, 'a/3': { seviye: 3 }, 'b/1': { durum: 'tamamlandi' } };
    expect(ilerleme(['a/1', 'a/2', 'a/3', 'a/4'], k)).toEqual({ toplam: 4, tamamlanan: 1, calisilan: 2, yuzde: 25 });
    expect(ilerleme([], k).yuzde).toBe(0);
  });
});

describe('yedekDosyaAdi', () => {
  it('yerel tarihle adlandırır', () => {
    expect(yedekDosyaAdi(new Date(2026, 9, 7, 23, 30))).toBe('kpss-rehber-yedek-2026-10-07.json');
  });
});
