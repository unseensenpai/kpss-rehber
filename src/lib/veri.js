import { getCollection } from 'astro:content';
import { veriyiDogrula } from './dogrula.js';

/**
 * Sınav ve konu koleksiyonlarını yükler, tutarlılığı doğrular. Sayfalar veriye
 * buradan erişir; hata varsa build durur.
 */
export async function veri() {
  const [sinavlar, konular] = await Promise.all([getCollection('sinavlar'), getCollection('konular')]);
  const hatalar = veriyiDogrula(sinavlar, konular);
  if (hatalar.length) {
    throw new Error(`Veri doğrulaması başarısız (${hatalar.length}):\n- ${hatalar.join('\n- ')}`);
  }
  return { sinavlar, konular };
}
