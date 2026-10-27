/**
 * Geri bildirime göre seviye/uzunluk uyarlama kuralları (spec §7). Saf; profil
 * kaydı `profil.js`te yapılır.
 */

export const SEVIYE_EN_AZ = 1;
export const SEVIYE_EN_COK = 5;
export const UZUNLUKLAR = ['ozet', 'normal', 'detayli'];
export const VARSAYILAN = { seviye: 3, uzunluk: 'normal' };
export const GERI_BILDIRIM_SINIRI = 10;

/** Geri bildirim türü → hangi eksende hangi yöne. */
export const GERI_BILDIRIMLER = {
  'cok-zor': { eksen: 'seviye', yon: -1, etiket: 'Çok zordu' },
  tam: { eksen: null, yon: 0, etiket: 'Tam kararında' },
  'cok-basit': { eksen: 'seviye', yon: 1, etiket: 'Çok basitti' },
  'cok-uzun': { eksen: 'uzunluk', yon: -1, etiket: 'Çok uzundu' },
  'daha-detay': { eksen: 'uzunluk', yon: 1, etiket: 'Daha detay istiyorum' },
};

const sinirla = (n, alt, ust) => Math.min(ust, Math.max(alt, n));

/**
 * Geri bildirimi uygular. Bir önceki geri bildirim aynı türdeyse (art arda aynı
 * yön) bir kademe daha kaydırır. Döner: yeni { seviye, uzunluk, geriBildirim }.
 */
export function geriBildirimUygula(durum, tur, tarih = new Date().toISOString()) {
  const kural = GERI_BILDIRIMLER[tur];
  if (!kural) throw new Error(`Bilinmeyen geri bildirim: ${tur}`);
  const gecmis = durum.geriBildirim ?? [];
  const adim = kural.yon * (gecmis.at(-1)?.tur === tur ? 2 : 1);
  let { seviye, uzunluk } = durum;
  if (kural.eksen === 'seviye') seviye = sinirla(seviye + adim, SEVIYE_EN_AZ, SEVIYE_EN_COK);
  if (kural.eksen === 'uzunluk') {
    const i = sinirla(UZUNLUKLAR.indexOf(uzunluk) + adim, 0, UZUNLUKLAR.length - 1);
    uzunluk = UZUNLUKLAR[i];
  }
  const geriBildirim = [...gecmis, { tur, tarih }].slice(-GERI_BILDIRIM_SINIRI);
  return { seviye, uzunluk, geriBildirim };
}

/**
 * Konuda kayıt yoksa başlangıç: aynı dersteki kayıtlı konuların ortalaması
 * (yuvarlanmış); hiç kayıt yoksa 3 / normal.
 */
export function baslangicAyari(dersKonulari, profilKonulari) {
  const kayitlar = dersKonulari.map((id) => profilKonulari[id]).filter((k) => k?.seviye);
  if (!kayitlar.length) return { ...VARSAYILAN };
  const ort = (dizi) => Math.round(dizi.reduce((a, b) => a + b, 0) / dizi.length);
  return {
    seviye: sinirla(ort(kayitlar.map((k) => k.seviye)), SEVIYE_EN_AZ, SEVIYE_EN_COK),
    uzunluk: UZUNLUKLAR[ort(kayitlar.map((k) => Math.max(0, UZUNLUKLAR.indexOf(k.uzunluk))))],
  };
}
