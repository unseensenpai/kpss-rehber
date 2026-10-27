import { describe, expect, it } from 'vitest';
import { kaynakSemasi, konuSemasi, sinavSemasi, takvimSemasi } from '../../src/lib/semalar.js';

const konu = {
  baslik: 'Paragraf',
  ders: 'turkce',
  kaynak: 'osym-kilavuz',
  kaynakYili: 2026,
  guncelleme: '2026-10-27',
};

const icerik = {
  altBasliklar: ['Ana düşünce'],
  anahtarKavramlar: ['konu', 'ana fikir'],
  soruTipi: 'Paragrafın ana düşüncesini bulma',
};

const sinav = {
  ad: 'Örnek',
  kisaAd: 'Ö',
  kaynak: { belge: 'kpss-lisans-2026', dogrulandi: true },
  oturumlar: [
    {
      ad: 'Sabah',
      sureDk: 60,
      testler: [
        {
          ad: 'GY',
          soruSayisi: 1,
          dersler: [{ ders: 'turkce', ad: 'Türkçe', soruSayisi: 1, konular: ['turkce/paragraf'] }],
        },
      ],
    },
  ],
};

describe('konuSemasi', () => {
  it('iskelet konu içerik alanları olmadan geçerli; varsayılanlar dolar', () => {
    const k = konuSemasi.parse(konu);
    expect(k).toMatchObject({ durum: 'iskelet', dogrulandi: false, altBasliklar: [] });
    expect(k.guncelleme).toBeInstanceOf(Date);
  });
  it.each(['baslik', 'ders', 'kaynak', 'kaynakYili', 'guncelleme'])("zorunlu '%s' alanı eksikse reddeder", (alan) => {
    const { [alan]: _, ...eksik } = konu;
    expect(konuSemasi.safeParse(eksik).success).toBe(false);
  });
  it.each(['altBasliklar', 'anahtarKavramlar', 'soruTipi'])(
    "taslak konuda '%s' zorunlu",
    (alan) => {
      const { [alan]: _, ...eksik } = icerik;
      expect(konuSemasi.safeParse({ ...konu, ...icerik, durum: 'taslak' }).success).toBe(true);
      expect(konuSemasi.safeParse({ ...konu, ...eksik, durum: 'taslak' }).success).toBe(false);
    },
  );
  it('tanımsız kaynak tipini reddeder', () => {
    expect(konuSemasi.safeParse({ ...konu, kaynak: 'wikipedia' }).success).toBe(false);
  });
  it('soruDagilimi yıl → sayı biçiminde olmalı', () => {
    expect(konuSemasi.safeParse({ ...konu, soruDagilimi: { 2024: 2 } }).success).toBe(true);
    expect(konuSemasi.safeParse({ ...konu, soruDagilimi: { gecen: 2 } }).success).toBe(false);
  });
});

describe('sinavSemasi', () => {
  it('geçerli sınavı kabul eder', () => {
    expect(sinavSemasi.safeParse(sinav).success).toBe(true);
  });
  it("konu referansı 'ders/slug' biçiminde olmalı", () => {
    const bozuk = structuredClone(sinav);
    bozuk.oturumlar[0].testler[0].dersler[0].konular = ['paragraf'];
    expect(sinavSemasi.safeParse(bozuk).success).toBe(false);
  });
  it('süre oturumda ya da her testte bulunmalı', () => {
    const bozuk = structuredClone(sinav);
    delete bozuk.oturumlar[0].sureDk;
    expect(sinavSemasi.safeParse(bozuk).success).toBe(false);
    bozuk.oturumlar[0].testler[0].sureDk = 50;
    expect(sinavSemasi.safeParse(bozuk).success).toBe(true);
  });
  it('ağırlık 100\'ü aşamaz', () => {
    const bozuk = structuredClone(sinav);
    bozuk.oturumlar[0].testler[0].dersler[0].agirlik = 120;
    expect(sinavSemasi.safeParse(bozuk).success).toBe(false);
  });
});

describe('kaynakSemasi', () => {
  const kaynak = {
    id: 'kpss-lisans-2026',
    baslik: 'Kılavuz',
    tur: 'kilavuz',
    tip: 'osym-kilavuz',
    yil: 2026,
    url: 'https://dokuman.osym.gov.tr/x.pdf',
    sha256: 'a'.repeat(64),
    kontrolTarihi: '2026-10-27',
  };
  it('geçerli belgeyi kabul eder, hatalı hash\'i reddeder', () => {
    expect(kaynakSemasi.safeParse(kaynak).success).toBe(true);
    expect(kaynakSemasi.safeParse({ ...kaynak, sha256: 'abc' }).success).toBe(false);
  });
});

describe('takvimSemasi', () => {
  it('saat SS:DD biçiminde olmalı', () => {
    const t = { id: 'a', sinav: 'dhbt', tur: 'sinav', baslangic: '2026-11-01', belge: 'kpss-lisans-2026' };
    expect(takvimSemasi.safeParse({ ...t, saat: '10:15' }).success).toBe(true);
    expect(takvimSemasi.safeParse({ ...t, saat: '10.15' }).success).toBe(false);
  });
});
