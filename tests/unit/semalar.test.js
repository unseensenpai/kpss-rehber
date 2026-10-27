import { describe, expect, it } from 'vitest';
import { konuSemasi, sinavSemasi } from '../../src/lib/semalar.js';

const konu = {
  baslik: 'Paragraf',
  ders: 'turkce',
  altBasliklar: ['Ana düşünce'],
  anahtarKavramlar: ['konu', 'ana fikir'],
  soruTipi: 'Paragrafın ana düşüncesini bulma',
  kaynak: 'cikmis-soru-analizi',
  kaynakYili: 2025,
  guncelleme: '2026-10-27',
};

const sinav = {
  ad: 'Örnek',
  kaynak: { tip: 'osym-kilavuz', yil: 2026, dogrulandi: false },
  oturumlar: [
    {
      ad: 'Sabah',
      sureDk: 60,
      testler: [{ ad: 'GY', soruSayisi: 1, dersler: [{ ders: 'turkce', soruSayisi: 1, konular: ['turkce/paragraf'] }] }],
    },
  ],
};

describe('konuSemasi', () => {
  it('geçerli konuyu kabul eder, dogrulandi varsayılanı false', () => {
    const k = konuSemasi.parse(konu);
    expect(k.dogrulandi).toBe(false);
    expect(k.guncelleme).toBeInstanceOf(Date);
  });
  it.each(['baslik', 'ders', 'altBasliklar', 'anahtarKavramlar', 'soruTipi', 'kaynak', 'kaynakYili', 'guncelleme'])(
    "zorunlu '%s' alanı eksikse reddeder",
    (alan) => {
      const { [alan]: _, ...eksik } = konu;
      expect(konuSemasi.safeParse(eksik).success).toBe(false);
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
  it('doğrulanmış kaynak url olmadan reddedilir', () => {
    const bozuk = { ...sinav, kaynak: { ...sinav.kaynak, dogrulandi: true } };
    expect(sinavSemasi.safeParse(bozuk).success).toBe(false);
    bozuk.kaynak.url = 'https://www.osym.gov.tr/';
    expect(sinavSemasi.safeParse(bozuk).success).toBe(true);
  });
});
