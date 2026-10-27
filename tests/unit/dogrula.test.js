import { describe, expect, it } from 'vitest';
import {
  dersKlasorUyumsuzlugu,
  eksikReferanslar,
  kaynakEksikleri,
  soruToplamiHatalari,
  veriyiDogrula,
  yetimKonular,
} from '../../src/lib/dogrula.js';

const konu = (id, ek = {}) => ({
  id,
  data: { ders: id.split('/')[0], kaynak: 'cikmis-soru-analizi', kaynakYili: 2025, ...ek },
});

const sinav = (dersler, { testSoru = 4, kaynak = { tip: 'osym-kilavuz', yil: 2026 } } = {}) => ({
  id: 'ornek',
  data: { kaynak, oturumlar: [{ ad: 'Sabah', sureDk: 60, testler: [{ ad: 'GY', soruSayisi: testSoru, dersler }] }] },
});

const saglam = () => ({
  sinavlar: [
    sinav([
      { ders: 'turkce', soruSayisi: 2, konular: ['turkce/paragraf'] },
      { ders: 'matematik', soruSayisi: 2, konular: ['matematik/sayilar'] },
    ]),
  ],
  konular: [konu('turkce/paragraf'), konu('matematik/sayilar')],
});

describe('veriyiDogrula', () => {
  it('tutarlı veride hata vermez', () => {
    const { sinavlar, konular } = saglam();
    expect(veriyiDogrula(sinavlar, konular)).toEqual([]);
  });
});

describe('eksikReferanslar', () => {
  it('olmayan konuyu yakalar', () => {
    const { sinavlar } = saglam();
    const hatalar = eksikReferanslar(sinavlar, [konu('turkce/paragraf')]);
    expect(hatalar).toEqual(["ornek › GY › matematik: 'matematik/sayilar' konusu yok"]);
  });
  it('başka derse ait konuyu yakalar', () => {
    const s = sinav([{ ders: 'turkce', soruSayisi: 4, konular: ['matematik/sayilar'] }]);
    expect(eksikReferanslar([s], [konu('matematik/sayilar')])[0]).toMatch(/bu derse ait değil/);
  });
});

describe('yetimKonular', () => {
  it('hiçbir sınavın kullanmadığı konuyu yakalar', () => {
    const { sinavlar, konular } = saglam();
    const hatalar = yetimKonular(sinavlar, [...konular, konu('tarih/osmanli-kurulus')]);
    expect(hatalar).toEqual(["'tarih/osmanli-kurulus' konusunu hiçbir sınav kullanmıyor (yetim)"]);
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
    const s = sinav([{ ders: 'turkce', soruSayisi: 3, konular: [] }], { testSoru: 4 });
    expect(soruToplamiHatalari([s])).toEqual(['ornek › GY: derslerin toplamı 3, test 4 soru']);
  });
});

describe('kaynakEksikleri', () => {
  it('kaynaksız konu ve sınavı yakalar', () => {
    const s = sinav([], { kaynak: { tip: 'osym-kilavuz' } });
    const k = konu('turkce/paragraf', { kaynak: undefined });
    expect(kaynakEksikleri([s], [k])).toEqual([
      'ornek: kaynak tipi/yılı eksik',
      'turkce/paragraf: kaynak/kaynakYili eksik',
    ]);
  });
});
