import { describe, expect, it } from 'vitest';
import {
  agirlikHatalari,
  dersKlasorUyumsuzlugu,
  eksikReferanslar,
  kaynakEksikleri,
  soruToplamiHatalari,
  takvimHatalari,
  tekrarlananDersler,
  veriyiDogrula,
  yetimKonular,
} from '../../src/lib/dogrula.js';

const konu = (id, ek = {}) => ({
  id,
  data: { ders: id.split('/')[0], kaynak: 'osym-kilavuz', kaynakYili: 2026, ...ek },
});

const ders = (ad, soruSayisi, konular = [], ek = {}) => ({ ders: ad, ad, soruSayisi, konular, ...ek });

const sinav = (dersler, { testSoru = 4, kaynak = { belge: 'kilavuz', dogrulandi: true } } = {}) => ({
  id: 'ornek',
  data: { kaynak, oturumlar: [{ ad: 'Sabah', sureDk: 60, testler: [{ ad: 'GY', soruSayisi: testSoru, dersler }] }] },
});

const kaynaklar = [{ id: 'kilavuz', data: {} }];

const saglam = () => ({
  sinavlar: [sinav([ders('turkce', 2, ['turkce/paragraf']), ders('matematik', 2, ['matematik/sayilar'])])],
  konular: [konu('turkce/paragraf'), konu('matematik/sayilar')],
  kaynaklar,
  takvim: [{ id: 't1', data: { sinav: 'ornek', belge: 'kilavuz', baslangic: new Date('2026-09-06') } }],
});

describe('veriyiDogrula', () => {
  it('tutarlı veride hata vermez', () => {
    expect(veriyiDogrula(saglam())).toEqual([]);
  });
});

describe('eksikReferanslar', () => {
  it('olmayan konuyu yakalar', () => {
    const { sinavlar } = saglam();
    const hatalar = eksikReferanslar(sinavlar, [konu('turkce/paragraf')]);
    expect(hatalar).toEqual(["ornek › GY › matematik: 'matematik/sayilar' konusu yok"]);
  });
  it('başka derse ait konuyu yakalar', () => {
    const s = sinav([ders('turkce', 4, ['matematik/sayilar'])]);
    expect(eksikReferanslar([s], [konu('matematik/sayilar')])[0]).toMatch(/bu derse ait değil/);
  });
});

describe('yetimKonular', () => {
  it('hiçbir sınavın kullanmadığı konuyu yakalar', () => {
    const { sinavlar, konular } = saglam();
    const hatalar = yetimKonular(sinavlar, [...konular, konu('tarih/osmanli-tarihi')]);
    expect(hatalar).toEqual(["'tarih/osmanli-tarihi' konusunu hiçbir sınav kullanmıyor (yetim)"]);
  });
  it('birden çok sınavın paylaştığı konu yetim sayılmaz', () => {
    const { sinavlar, konular } = saglam();
    expect(yetimKonular([...sinavlar, ...sinavlar], konular)).toEqual([]);
  });
});

describe('dersKlasorUyumsuzlugu', () => {
  it('klasör ile ders alanı farklıysa yakalar', () => {
    expect(dersKlasorUyumsuzlugu([konu('turkce/paragraf', { ders: 'tarih' })])).toHaveLength(1);
  });
});

describe('soruToplamiHatalari', () => {
  it('ders toplamı test sayısını tutmazsa yakalar', () => {
    const s = sinav([ders('turkce', 3)], { testSoru: 4 });
    expect(soruToplamiHatalari([s])).toEqual(['ornek › GY: derslerin toplamı 3, test 4 soru']);
  });
});

describe('agirlikHatalari', () => {
  it('yüzdeden türeyen soru sayısını kontrol eder (yuvarlayarak)', () => {
    const s = sinav([ders('a', 15, [], { agirlik: 18.75 }), ders('b', 65)], { testSoru: 80 });
    expect(agirlikHatalari([s])).toEqual([]);
  });
  it('ağırlıkla uyuşmayan soru sayısını yakalar', () => {
    const s = sinav([ders('tarih', 26, [], { agirlik: 45 }), ders('b', 34)], { testSoru: 60 });
    expect(agirlikHatalari([s])).toEqual(['ornek › GY › tarih: %45 → 27 soru olmalı, 26 yazılmış']);
  });
});

describe('tekrarlananDersler', () => {
  it('aynı testte iki kez yazılan dersi yakalar', () => {
    const s = sinav([ders('turkce', 2), ders('turkce', 2)]);
    expect(tekrarlananDersler([s])).toEqual(["ornek › GY: 'turkce' dersi iki kez yazılmış"]);
  });
});

describe('kaynakEksikleri', () => {
  it('kaynaksız konu ve belgesiz sınavı yakalar', () => {
    const s = sinav([], { kaynak: { dogrulandi: false } });
    const k = konu('turkce/paragraf', { kaynak: undefined });
    expect(kaynakEksikleri([s], [k], kaynaklar)).toEqual([
      'ornek: kaynak belgesi eksik',
      'turkce/paragraf: kaynak/kaynakYili eksik',
    ]);
  });
  it('kaynaklar listesinde olmayan belgeyi yakalar', () => {
    const s = sinav([], { kaynak: { belge: 'uydurma', dogrulandi: true } });
    const k = konu('turkce/paragraf', { belge: 'uydurma' });
    expect(kaynakEksikleri([s], [k], kaynaklar)).toHaveLength(2);
  });
});

describe('takvimHatalari', () => {
  it('olmayan sınavı, belgeyi ve ters tarih aralığını yakalar', () => {
    const t = [
      { id: 'a', data: { sinav: 'yok', belge: 'kilavuz', baslangic: new Date('2026-01-02') } },
      { id: 'b', data: { sinav: 'ornek', belge: 'yok', baslangic: new Date('2026-01-02') } },
      { id: 'c', data: { sinav: 'ornek', belge: 'kilavuz', baslangic: new Date('2026-01-02'), bitis: new Date('2026-01-01') } },
    ];
    expect(takvimHatalari(t, saglam().sinavlar, kaynaklar)).toEqual([
      "takvim 'a': 'yok' sınavı yok",
      "takvim 'b': 'yok' belgesi yok",
      "takvim 'c': bitiş başlangıçtan önce",
    ]);
  });
});
