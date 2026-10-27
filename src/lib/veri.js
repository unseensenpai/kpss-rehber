import { getCollection } from 'astro:content';
import { veriyiDogrula } from './dogrula.js';

/**
 * Tüm koleksiyonları yükler, tutarlılığı doğrular. Sayfalar veriye buradan
 * erişir; hata varsa build durur.
 */
export async function veri() {
  const [sinavlar, konular, kaynaklar, takvim] = await Promise.all(
    ['sinavlar', 'konular', 'kaynaklar', 'takvim'].map((ad) => getCollection(ad)),
  );
  const tumu = { sinavlar, konular, kaynaklar, takvim };
  const hatalar = veriyiDogrula(tumu);
  if (hatalar.length) {
    throw new Error(`Veri doğrulaması başarısız (${hatalar.length}):\n- ${hatalar.join('\n- ')}`);
  }
  return tumu;
}
