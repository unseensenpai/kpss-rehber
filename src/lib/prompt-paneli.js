/**
 * Prompt panelinin tarayıcıya giden verisi: şablon metinleri, seviye/uzunluk
 * talimatları ve her konunun sınav bağlamları. Saf; build sırasında üretilir.
 */
import { konuKullanimlari, sinavDersleri } from './mufredat.js';
import { konuSablonlari } from './prompt-doldur.js';

export function panelVerisi({ sablonlar, seviyeler, uzunluklar, sinavlar }, konular) {
  return {
    sablonlar: sablonlar.map((s) => ({ id: s.id, baslik: s.data.baslik, aciklama: s.data.aciklama, metin: s.body.trim() })),
    seviyeler: seviyeler.map((s) => ({ seviye: s.data.seviye, ad: s.data.ad, talimat: s.data.talimat })),
    uzunluklar: uzunluklar.map((u) => ({ id: u.id, ad: u.data.ad, talimat: u.data.talimat })),
    sinavlar: sinavlar
      .filter((s) => sinavDersleri(s).some(({ ders }) => ders.konular.length))
      .sort((a, b) => a.data.grup.localeCompare(b.data.grup) || a.data.sira - b.data.sira)
      // Kütüphanedeki konu seçimi, sınavdaki ders sırasıyla gruplanır.
      .map((s) => ({
        id: s.id,
        kisaAd: s.data.kisaAd,
        dersler: sinavDersleri(s)
          .filter(({ ders }) => ders.konular.length)
          .map(({ ders }) => ({ ad: ders.ad, konular: ders.konular })),
      })),
    konular: konular.map((k) => {
      const kullanimlar = konuKullanimlari(sinavlar, k.id);
      return {
        id: k.id,
        baslik: k.data.baslik,
        altBasliklar: k.data.altBasliklar,
        anahtarKavramlar: k.data.anahtarKavramlar,
        soruTipi: k.data.soruTipi ?? '',
        // Başlangıç seviyesi aynı dersteki konuların ortalamasından gelir.
        dersKonulari: [...new Set(kullanimlar.flatMap((x) => x.ders.konular))],
        baglamlar: kullanimlar.map((x) => ({ sinavId: x.sinav.id, sinav: x.sinav.data.ad, kisaAd: x.sinav.data.kisaAd, ders: x.ders.ad })),
        sablonlar: konuSablonlari(sablonlar, k).map((s) => s.id),
      };
    }),
  };
}
