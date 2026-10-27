import { getCollection } from 'astro:content';
import { veriyiDogrula } from './dogrula.js';

/**
 * Tüm koleksiyonları yükler, tutarlılığı doğrular. Sayfalar veriye buradan
 * erişir; hata varsa build durur.
 */
export async function veri() {
  const adlar = ['sinavlar', 'konular', 'kaynaklar', 'takvim', 'sablonlar', 'seviyeler', 'uzunluklar'];
  const koleksiyonlar = await Promise.all(adlar.map((ad) => getCollection(ad)));
  const tumu = Object.fromEntries(adlar.map((ad, i) => [ad, koleksiyonlar[i]]));
  // Sıralı listeler: sayfalar ve prompt kartı bu sırayı kullanır.
  tumu.sablonlar.sort((a, b) => a.data.sira - b.data.sira);
  tumu.seviyeler.sort((a, b) => a.data.seviye - b.data.seviye);
  tumu.uzunluklar.sort((a, b) => a.data.sira - b.data.sira);
  const hatalar = veriyiDogrula(tumu);
  if (hatalar.length) {
    throw new Error(`Veri doğrulaması başarısız (${hatalar.length}):\n- ${hatalar.join('\n- ')}`);
  }
  return tumu;
}
