/**
 * Tarayıcıdaki öğrenci profili (spec §8). Şema ve saf işlemler `lib/profil-veri.js`te;
 * burası yalnızca localStorage okuma/yazma. Depolama yoksa site çalışmaya devam eder.
 */
import { bosProfil, profilDogrula } from '../lib/profil-veri.js';

export const ANAHTAR = 'kpss-rehber:v1';
// K4'teki ayrı "son sınav" anahtarı; ilk okumada profile taşınır.
const ESKI_SON_SINAV = 'kpss-rehber:son-sinav';

function depo() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null; // bazı gizli sekmelerde erişim bile hata fırlatır
  }
}

/** Depolama gerçekten yazılabiliyor mu? */
export function depolamaKullanilabilir() {
  try {
    const d = depo();
    if (!d) return false;
    d.setItem(`${ANAHTAR}:deneme`, '1');
    d.removeItem(`${ANAHTAR}:deneme`);
    return true;
  } catch {
    return false;
  }
}

/** Profili okur; yoksa ya da bozuksa boş profil döner (bozuk kayıt silinmez). */
export function profilOku() {
  let profil = null;
  try {
    const ham = depo()?.getItem(ANAHTAR);
    if (ham) profil = profilDogrula(JSON.parse(ham)).profil;
  } catch {
    /* bozuk JSON: boş profille devam */
  }
  profil ??= bosProfil();
  try {
    const eski = depo()?.getItem(ESKI_SON_SINAV);
    if (eski) {
      profil.secilenSinav ??= JSON.parse(eski)?.sinavId ?? null;
      depo().removeItem(ESKI_SON_SINAV);
      profilYaz(profil);
    }
  } catch {
    /* taşınamazsa önemli değil */
  }
  return profil;
}

/** Profili yazar; yazılamazsa false. */
export function profilYaz(profil) {
  try {
    const d = depo();
    if (!d) return false;
    d.setItem(ANAHTAR, JSON.stringify(profil));
    return true;
  } catch {
    return false;
  }
}

/** Bir konunun kaydına alanları birleştirir ve `guncelleme`yi tazeler. */
export function konuKaydet(konuId, alanlar) {
  const p = profilOku();
  p.konular[konuId] = { ...p.konular[konuId], ...alanlar, guncelleme: new Date().toISOString() };
  return profilYaz(p);
}

/** Sınav, hedef tarih ve tercihler gibi profil geneli ayarları yazar. */
export function ayarKaydet(alanlar) {
  const p = profilOku();
  Object.assign(p, alanlar, { ayarGuncelleme: new Date().toISOString() });
  return profilYaz(p);
}

/** Tüm profili siler. */
export function profilSil() {
  try {
    depo()?.removeItem(ANAHTAR);
    return true;
  } catch {
    return false;
  }
}
