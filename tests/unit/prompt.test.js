import { describe, expect, it } from 'vitest';
import {
  konuSablonlari,
  ogrenciAlanlariniAyir,
  promptDegerleri,
  promptDoldur,
  sablonDegiskenleri,
} from '../../src/lib/prompt-doldur.js';
import { baslangicAyari, geriBildirimUygula } from '../../src/lib/uyarlama.js';
import { disAcUrl, EN_UZUN_URL_METNI } from '../../src/lib/dis-ac.js';
import { promptHatalari } from '../../src/lib/dogrula.js';

describe('promptDoldur', () => {
  it('değişkenleri yerleştirir, boşlukları tolere eder', () => {
    expect(promptDoldur('Konu: {{konu}} / {{ ders }}', { konu: 'Paragraf', ders: 'Türkçe' })).toBe(
      'Konu: Paragraf / Türkçe',
    );
  });
  it('eksik değişkende hata fırlatır', () => {
    expect(() => promptDoldur('{{konu}} {{seviyeAdi}}', { konu: 'x' })).toThrow(/seviyeAdi/);
  });
  it('boş değer geçerli; geride kalan boş satırlar teke iner', () => {
    expect(promptDoldur('A\n{{tercihler}}\n\nB', { tercihler: '' })).toBe('A\n\nB');
  });
  it('sablonDegiskenleri tekrarsız liste verir', () => {
    expect(sablonDegiskenleri('{{a}} {{b}} {{a}}')).toEqual(['a', 'b']);
  });
});

describe('promptDegerleri', () => {
  const seviye = { ad: 'Orta', talimat: 'orta talimat' };
  const uzunluk = { talimat: 'normal talimat' };
  it('iskelet konuda boş alanlar için genel yönerge koyar', () => {
    const d = promptDegerleri({ sinav: 'S', ders: 'D', konu: { baslik: 'K', altBasliklar: [] }, seviye, uzunluk });
    expect(d.altBasliklar).toMatch(/tüm alt başlıklar/);
    expect(d.soruTipi).toMatch(/tipik soru/);
    expect(d.tercihler).toBe('');
  });
  it('listeleri virgülle birleştirir, tercihleri cümleye çevirir', () => {
    const d = promptDegerleri({
      sinav: 'S',
      ders: 'D',
      konu: { baslik: 'K', altBasliklar: ['a', 'b'], anahtarKavramlar: ['x'], soruTipi: 'tip' },
      seviye,
      uzunluk,
      tercihler: 'tablo kullan',
    });
    expect(d).toMatchObject({ altBasliklar: 'a, b', anahtarKavramlar: 'x', soruTipi: 'tip' });
    expect(d.tercihler).toBe('Öğrencinin tercihleri: tablo kullan');
  });
});

describe('ogrenciAlanlariniAyir', () => {
  it('[BÜYÜK HARF] alanlarını ayırır', () => {
    const p = ogrenciAlanlariniAyir('Soru: [SORUYU BURAYA YAPIŞTIR] ve [DOĞRU CEVAP].');
    expect(p.filter((x) => x.alan).map((x) => x.metin)).toEqual(['[SORUYU BURAYA YAPIŞTIR]', '[DOĞRU CEVAP]']);
    expect(p.map((x) => x.metin).join('')).toBe('Soru: [SORUYU BURAYA YAPIŞTIR] ve [DOĞRU CEVAP].');
  });
  it('küçük harfli köşeli parantezi alan saymaz', () => {
    expect(ogrenciAlanlariniAyir('dizi[0] ve [not]').some((x) => x.alan)).toBe(false);
  });
});

describe('konuSablonlari', () => {
  const s = (id, ozel = false) => ({ id, data: { ozel } });
  const sablonlar = [s('konu-anlat'), s('guncel-olaylar', true)];
  it('özel şablonu yalnızca ekPromptlar listesindeki konuda gösterir', () => {
    expect(konuSablonlari(sablonlar, { data: {} }).map((x) => x.id)).toEqual(['konu-anlat']);
    expect(konuSablonlari(sablonlar, { data: { ekPromptlar: ['guncel-olaylar'] } })).toHaveLength(2);
  });
});

describe('geriBildirimUygula', () => {
  const t = '2026-10-27T00:00:00Z';
  const durum = (ek = {}) => ({ seviye: 3, uzunluk: 'normal', geriBildirim: [], ...ek });

  it('çok zor → seviye −1, çok basit → +1, tam kararında değiştirmez', () => {
    expect(geriBildirimUygula(durum(), 'cok-zor', t).seviye).toBe(2);
    expect(geriBildirimUygula(durum(), 'cok-basit', t).seviye).toBe(4);
    expect(geriBildirimUygula(durum(), 'tam', t)).toMatchObject({ seviye: 3, uzunluk: 'normal' });
  });
  it('uzunluk ekseni bağımsızdır', () => {
    expect(geriBildirimUygula(durum(), 'cok-uzun', t)).toMatchObject({ seviye: 3, uzunluk: 'ozet' });
    expect(geriBildirimUygula(durum(), 'daha-detay', t).uzunluk).toBe('detayli');
  });
  it('aynı yönde art arda ikinci geri bildirim bir kademe daha kaydırır', () => {
    const bir = geriBildirimUygula(durum({ seviye: 5 }), 'cok-zor', t);
    expect(bir.seviye).toBe(4);
    const iki = geriBildirimUygula(bir, 'cok-zor', t);
    expect(iki.seviye).toBe(2);
  });
  it('araya başka geri bildirim girerse kademe sıfırlanır', () => {
    let d = geriBildirimUygula(durum({ seviye: 5 }), 'cok-zor', t);
    d = geriBildirimUygula(d, 'tam', t);
    expect(geriBildirimUygula(d, 'cok-zor', t).seviye).toBe(3);
  });
  it('sınırları aşmaz', () => {
    expect(geriBildirimUygula(durum({ seviye: 1 }), 'cok-zor', t).seviye).toBe(1);
    const iki = geriBildirimUygula(durum({ uzunluk: 'detayli', geriBildirim: [{ tur: 'daha-detay' }] }), 'daha-detay', t);
    expect(iki.uzunluk).toBe('detayli');
  });
  it('geçmişi en fazla 10 kayıt tutar', () => {
    const gecmis = Array.from({ length: 10 }, () => ({ tur: 'tam', tarih: t }));
    const d = geriBildirimUygula(durum({ geriBildirim: gecmis }), 'cok-basit', t);
    expect(d.geriBildirim).toHaveLength(10);
    expect(d.geriBildirim.at(-1).tur).toBe('cok-basit');
  });
  it('bilinmeyen türde hata verir', () => {
    expect(() => geriBildirimUygula(durum(), 'harika', t)).toThrow();
  });
});

describe('baslangicAyari', () => {
  it('veri yoksa 3 / normal', () => {
    expect(baslangicAyari(['tarih/a'], {})).toEqual({ seviye: 3, uzunluk: 'normal' });
  });
  it('aynı dersteki konuların ortalaması (yuvarlanmış)', () => {
    const profil = {
      'tarih/a': { seviye: 4, uzunluk: 'detayli' },
      'tarih/b': { seviye: 5, uzunluk: 'detayli' },
      'cografya/c': { seviye: 1, uzunluk: 'ozet' },
    };
    expect(baslangicAyari(['tarih/a', 'tarih/b', 'tarih/yeni'], profil)).toEqual({ seviye: 5, uzunluk: 'detayli' });
  });
});

describe('disAcUrl', () => {
  it('ChatGPT için ?prompt=, Claude için ?q= ile kodlanmış metin', () => {
    const metin = 'Konu: Osmanlı & Türk "tarihi"\nyeni satır';
    const c = new URL(disAcUrl('chatgpt', metin));
    expect(c.origin + c.pathname).toBe('https://chatgpt.com/');
    expect(c.searchParams.get('prompt')).toBe(metin);
    expect(c.searchParams.has('q')).toBe(false);
    const k = new URL(disAcUrl('claude', metin));
    expect(k.origin + k.pathname).toBe('https://claude.ai/new');
    expect(k.searchParams.get('q')).toBe(metin);
  });
  it('çok uzun metinde yalnızca siteyi açar', () => {
    expect(disAcUrl('claude', 'x'.repeat(EN_UZUN_URL_METNI + 1))).toBe('https://claude.ai/new');
  });
  it('bilinmeyen sağlayıcıda hata verir', () => {
    expect(() => disAcUrl('baska', 'x')).toThrow();
  });
});

describe('promptHatalari', () => {
  const seviyeler = [1, 2, 3, 4, 5].map((n) => ({ id: `s${n}`, data: { seviye: n, ad: `S${n}`, talimat: 't' } }));
  const uzunluklar = ['ozet', 'normal', 'detayli'].map((id) => ({ id, data: { talimat: 't' } }));
  const sinavlar = [
    {
      id: 'ornek',
      data: {
        ad: 'Örnek',
        oturumlar: [{ testler: [{ ad: 'GK', dersler: [{ ders: 'tarih', ad: 'Tarih', konular: ['tarih/a'] }] }] }],
      },
    },
  ];
  const konu = (ek = {}) => ({ id: 'tarih/a', data: { baslik: 'A', altBasliklar: [], anahtarKavramlar: [], ...ek } });
  const sablon = (id, body, ozel = false) => ({ id, body, data: { ozel } });
  const tum = (ek) => ({ seviyeler, uzunluklar, sinavlar, konular: [konu()], ...ek });

  it('geçerli şablonlarda hata yok', () => {
    expect(promptHatalari(tum({ sablonlar: [sablon('a', '{{konu}} {{seviyeAdi}} {{tercihler}}')] }))).toEqual([]);
  });
  it('bilinmeyen değişkeni yakalar', () => {
    expect(promptHatalari(tum({ sablonlar: [sablon('a', '{{konu}} {{puan}}')] }))[0]).toMatch(/bilinmeyen değişken puan/);
  });
  it('kapanmamış süslü parantezi şablon başına bir kez yakalar', () => {
    expect(promptHatalari(tum({ sablonlar: [sablon('a', '{{konu}} {{eksik')] }))).toEqual([
      "şablon 'a': kapanmamış ya da hatalı {{…}} işareti",
    ]);
  });
  it('içi boşluklu değişkeni geçerli sayar', () => {
    expect(promptHatalari(tum({ sablonlar: [sablon('a', '{{ konu }} {{ seviyeAdi }}')] }))).toEqual([]);
  });
  it('olmayan ya da özel olmayan ek promptu yakalar', () => {
    const h = promptHatalari(tum({ sablonlar: [sablon('a', '{{konu}}')], konular: [konu({ ekPromptlar: ['a', 'yok'] })] }));
    expect(h).toHaveLength(2);
  });
  it('eksik seviye ya da uzunluğu yakalar', () => {
    const h = promptHatalari(tum({ sablonlar: [sablon('a', '{{konu}}')], seviyeler: seviyeler.slice(1), uzunluklar: uzunluklar.slice(1) }));
    expect(h.join('\n')).toMatch(/seviyeler 1–5/);
    expect(h.join('\n')).toMatch(/uzunluklar/);
  });
});
