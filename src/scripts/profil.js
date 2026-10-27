/**
 * Tarayıcıdaki öğrenci profili (spec §8). K5 yalnızca konu bazında seviye/uzunluk
 * ve geri bildirimi yazar; durum, not, yedekleme K6'da eklenir.
 */
export const ANAHTAR = 'kpss-rehber:v1';
export const SURUM = 1;

function bosProfil() {
  return { surum: SURUM, olusturma: new Date().toISOString(), konular: {} };
}

function depo() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null; // bazı gizli sekmelerde erişim bile hata fırlatır
  }
}

/** Profili okur; yoksa ya da bozuksa boş profil döner. */
export function profilOku() {
  try {
    const ham = depo()?.getItem(ANAHTAR);
    const p = ham ? JSON.parse(ham) : null;
    if (p && typeof p === 'object' && p.konular && typeof p.konular === 'object') return p;
  } catch {
    /* bozuk JSON: boş profille devam */
  }
  return bosProfil();
}

/**
 * Bir konunun kaydına alanları birleştirir ve `guncelleme`yi tazeler.
 * Kaydedilemezse false döner (site çalışmaya devam eder).
 */
export function konuKaydet(konuId, alanlar) {
  const p = profilOku();
  p.konular[konuId] = { ...p.konular[konuId], ...alanlar, guncelleme: new Date().toISOString() };
  try {
    const d = depo();
    if (!d) return false;
    d.setItem(ANAHTAR, JSON.stringify(p));
    return true;
  } catch {
    return false;
  }
}
