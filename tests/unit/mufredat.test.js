import { describe, expect, it } from 'vitest';
import {
  cokSoruCikanSirasi,
  hataBildirUrl,
  kalanGun,
  konuKullanimlari,
  konuOrtalamasi,
  sinavDersleri,
  sinavOzeti,
  sinavTarihleri,
  tarihYaz,
} from '../../src/lib/mufredat.js';

const ders = (id, konular = []) => ({ ders: id, ad: id, soruSayisi: 10, konular });

const gygk = {
  id: 'lisans',
  data: {
    oturumlar: [
      {
        ad: 'GY-GK',
        sureDk: 130,
        testler: [
          { ad: 'GY', soruSayisi: 60, dersler: [ders('turkce')] },
          { ad: 'GK', soruSayisi: 60, dersler: [ders('tarih', ['tarih/osmanli'])] },
        ],
      },
    ],
  },
};

const oabt = {
  id: 'oabt',
  data: {
    oturumlar: [
      {
        ad: 'ÖABT',
        tekTestSecilir: true,
        testler: [
          { ad: 'Fizik', soruSayisi: 50, sureDk: 90, dersler: [ders('fiz')] },
          { ad: 'Tarih', soruSayisi: 50, sureDk: 70, dersler: [ders('ot', ['tarih/osmanli'])] },
        ],
      },
    ],
  },
};

const alan = {
  id: 'alan',
  data: { oturumlar: [{ ad: '1', testler: [{ ad: 'A', soruSayisi: 40, sureDk: 50, dersler: [] }, { ad: 'B', soruSayisi: 40, sureDk: 60, dersler: [] }] }] },
};

describe('sinavDersleri', () => {
  it('dersleri test bilgisiyle birlikte sırayla düzleştirir', () => {
    expect(sinavDersleri(gygk).map((x) => `${x.test.ad}/${x.ders.ders}`)).toEqual(['GY/turkce', 'GK/tarih']);
  });
});

describe('sinavOzeti', () => {
  it('oturum süresi varsa onu, soruları toplar', () => {
    expect(sinavOzeti(gygk)).toMatchObject({ soru: 120, sureDk: 130, testSayisi: 2 });
  });
  it('tek test seçilen oturumda en uzun testi sayar', () => {
    expect(sinavOzeti(oabt)).toMatchObject({ soru: 50, sureDk: 90 });
  });
  it('oturum süresi yoksa test sürelerini toplar', () => {
    expect(sinavOzeti(alan)).toMatchObject({ soru: 80, sureDk: 110, testSayisi: 2, secmeli: false });
  });
  it('seçmeli oturumları işaretler', () => {
    const secmeli = { ...alan, data: { ...alan.data, oturumlarSecmeli: true } };
    expect(sinavOzeti(secmeli).secmeli).toBe(true);
  });
});

describe('konuKullanimlari', () => {
  it('konuyu kullanan tüm sınavları bulur', () => {
    const k = konuKullanimlari([gygk, oabt], 'tarih/osmanli');
    expect(k.map((x) => `${x.sinav.id}/${x.test.ad}`)).toEqual(['lisans/GK', 'oabt/Tarih']);
  });
});

describe('konuOrtalamasi ve cokSoruCikanSirasi', () => {
  const k = (id, soruDagilimi) => ({ id, data: { soruDagilimi } });
  it('ortalamayı bir ondalıkla verir, veri yoksa null', () => {
    expect(konuOrtalamasi(k('a', { 2024: 2, 2025: 3, 2026: 3 }))).toBe(2.7);
    expect(konuOrtalamasi(k('b'))).toBeNull();
  });
  it('çok soru çıkanı öne alır, verisizleri sonda sırasıyla bırakır', () => {
    const liste = [k('x'), k('az', { 2025: 1 }), k('y'), k('cok', { 2025: 4 })];
    expect(cokSoruCikanSirasi(liste).map((x) => x.id)).toEqual(['cok', 'az', 'x', 'y']);
  });
});

describe('sinavTarihleri ve kalanGun', () => {
  const t = (sinav, tur, gun) => ({ data: { sinav, tur, baslangic: new Date(gun) } });
  const takvim = [
    t('alan', 'sinav', '2026-09-13'),
    t('alan', 'basvuru', '2026-07-01'),
    t('alan', 'sinav', '2026-09-12'),
    t('dhbt', 'sinav', '2026-11-01'),
  ];
  it('bugünden sonraki ilk sınav gününü bulur; sınav günü bugünse o gündür', () => {
    const { siradaki } = sinavTarihleri(takvim, 'alan', new Date('2026-09-12T15:00:00'));
    expect(siradaki.baslangic).toEqual(new Date('2026-09-12'));
  });
  it('hepsi geçtiyse siradaki null, son en geç gündür', () => {
    const { siradaki, son } = sinavTarihleri(takvim, 'alan', new Date('2026-10-27'));
    expect(siradaki).toBeNull();
    expect(son.baslangic).toEqual(new Date('2026-09-13'));
  });
  it('gün farkını tam gün olarak verir', () => {
    expect(kalanGun(new Date('2026-11-01'), new Date('2026-10-27T23:30:00'))).toBe(5);
  });
});

describe('tarihYaz', () => {
  it('Türkçe uzun tarih biçimi', () => {
    expect(tarihYaz(new Date('2026-09-06'))).toBe('6 Eylül 2026');
  });
});

describe('hataBildirUrl', () => {
  it('başlık ve sayfa ile önceden doldurulmuş issue bağlantısı üretir', () => {
    const url = new URL(hataBildirUrl('u/r', { baslik: 'Osmanlı Tarihi', sayfa: '/konu/tarih/osmanli-tarihi/' }));
    expect(url.pathname).toBe('/u/r/issues/new');
    expect(url.searchParams.get('title')).toBe('[Hata] Osmanlı Tarihi');
    expect(url.searchParams.get('sayfa')).toBe('/konu/tarih/osmanli-tarihi/');
    expect(url.searchParams.get('template')).toBe('hata-bildir.yml');
  });
});
