/**
 * Öğrenci profilinin şeması ve saf işlemleri (spec §8): doğrulama, sürüm
 * dönüşümü, birleştirme, takma ad eşleme ve ilerleme. Depolama `scripts/profil.js`te.
 */
import { GERI_BILDIRIMLER, GERI_BILDIRIM_SINIRI, SEVIYE_EN_AZ, SEVIYE_EN_COK, UZUNLUKLAR } from './uyarlama.js';

export const SURUM = 1;
/** Konu durumu; kayıt yoksa "başlanmadı". */
export const DURUMLAR = {
  calisiyorum: 'Çalışıyorum',
  tamamlandi: 'Tamamlandı',
  tekrar: 'Tekrar edilecek',
};
export const NOT_SINIRI = 2000;
export const TERCIH_SINIRI = 500;
export const YEDEK_BOYUT_SINIRI = 1024 * 1024;

/**
 * Sürüm dönüşümleri: `DONUSUMLER[n]` n sürümündeki profili n+1'e yükseltir.
 * Şema değiştiğinde SURUM artırılır ve buraya bir adım eklenir.
 */
export const DONUSUMLER = {};

export function bosProfil(simdi = new Date()) {
  return {
    surum: SURUM,
    olusturma: simdi.toISOString(),
    secilenSinav: null,
    hedefTarih: null,
    tercihler: '',
    ayarGuncelleme: null,
    konular: {},
  };
}

const KONU_ID = /^[a-z0-9-]+\/[a-z0-9-]+$/;
const TARIH = /^\d{4}-\d{2}-\d{2}$/;
const gecerliZaman = (s) => typeof s === 'string' && !Number.isNaN(Date.parse(s));
const nesne = (x) => x !== null && typeof x === 'object' && !Array.isArray(x);

/** Eski sürümlü profili zincirle güncel sürüme çıkarır. */
export function profilYukselt(ham, donusumler = DONUSUMLER, hedef = SURUM) {
  let p = ham;
  while (p.surum < hedef) {
    const adim = donusumler[p.surum];
    if (!adim) throw new Error(`${p.surum}. sürümden yükseltme tanımlı değil`);
    p = { ...adim(p), surum: p.surum + 1 };
  }
  return p;
}

/**
 * Profili doğrular ve bilinmeyen alanları atarak normalleştirir. Geçersizse
 * `hatalar` Türkçe açıklamalarla dolu, `profil` null döner.
 */
export function profilDogrula(ham, { donusumler = DONUSUMLER, hedef = SURUM } = {}) {
  if (!nesne(ham)) return { hatalar: ['Dosya bir KPSS Rehber yedeği değil.'], profil: null };
  if (!Number.isInteger(ham.surum) || ham.surum < 1) {
    return { hatalar: ['Yedekte sürüm bilgisi yok ya da geçersiz.'], profil: null };
  }
  if (ham.surum > hedef) {
    return { hatalar: ['Bu yedek sitenin daha yeni bir sürümünden; sayfayı yenileyip tekrar dene.'], profil: null };
  }
  let p;
  try {
    p = profilYukselt(ham, donusumler, hedef);
  } catch (e) {
    return { hatalar: [`Yedek yükseltilemedi: ${e.message}`], profil: null };
  }

  const hatalar = [];
  const sonuc = bosProfil();
  sonuc.olusturma = gecerliZaman(p.olusturma) ? p.olusturma : sonuc.olusturma;
  if (p.secilenSinav != null) {
    if (typeof p.secilenSinav === 'string' && /^[a-z0-9-]+$/.test(p.secilenSinav)) sonuc.secilenSinav = p.secilenSinav;
    else hatalar.push('Seçili sınav geçersiz.');
  }
  if (p.hedefTarih != null) {
    if (typeof p.hedefTarih === 'string' && TARIH.test(p.hedefTarih) && gecerliZaman(p.hedefTarih)) sonuc.hedefTarih = p.hedefTarih;
    else hatalar.push('Hedef tarih YYYY-AA-GG biçiminde olmalı.');
  }
  if (p.tercihler != null) {
    if (typeof p.tercihler === 'string' && p.tercihler.length <= TERCIH_SINIRI) sonuc.tercihler = p.tercihler;
    else hatalar.push(`Tercihler en fazla ${TERCIH_SINIRI} karakter olabilir.`);
  }
  if (p.ayarGuncelleme != null && gecerliZaman(p.ayarGuncelleme)) sonuc.ayarGuncelleme = p.ayarGuncelleme;

  if (!nesne(p.konular)) {
    hatalar.push('Konu kayıtları bulunamadı.');
  } else {
    for (const [id, k] of Object.entries(p.konular)) {
      const h = konuHatalari(id, k);
      if (h.length) hatalar.push(...h);
      else sonuc.konular[id] = konuNormallestir(k);
    }
  }
  return hatalar.length ? { hatalar, profil: null } : { hatalar: [], profil: sonuc };
}

function konuHatalari(id, k) {
  const h = [];
  const ad = `'${id}'`;
  if (!KONU_ID.test(id)) return [`${ad} geçerli bir konu kimliği değil.`];
  if (!nesne(k)) return [`${ad} kaydı bozuk.`];
  if (k.durum != null && !(k.durum in DURUMLAR)) h.push(`${ad}: bilinmeyen durum '${k.durum}'.`);
  if (k.seviye != null && !(Number.isInteger(k.seviye) && k.seviye >= SEVIYE_EN_AZ && k.seviye <= SEVIYE_EN_COK)) {
    h.push(`${ad}: seviye 1–5 arasında olmalı.`);
  }
  if (k.uzunluk != null && !UZUNLUKLAR.includes(k.uzunluk)) h.push(`${ad}: bilinmeyen uzunluk '${k.uzunluk}'.`);
  if (k.not != null && (typeof k.not !== 'string' || k.not.length > NOT_SINIRI)) {
    h.push(`${ad}: not en fazla ${NOT_SINIRI} karakterlik metin olmalı.`);
  }
  if (k.geriBildirim != null) {
    const gecerli =
      Array.isArray(k.geriBildirim) &&
      k.geriBildirim.length <= GERI_BILDIRIM_SINIRI &&
      k.geriBildirim.every((g) => nesne(g) && g.tur in GERI_BILDIRIMLER && gecerliZaman(g.tarih));
    if (!gecerli) h.push(`${ad}: geri bildirim geçmişi bozuk.`);
  }
  if (k.guncelleme != null && !gecerliZaman(k.guncelleme)) h.push(`${ad}: güncelleme tarihi geçersiz.`);
  return h;
}

function konuNormallestir(k) {
  const n = {};
  for (const alan of ['durum', 'seviye', 'uzunluk', 'not', 'geriBildirim', 'guncelleme']) {
    if (k[alan] != null) n[alan] = k[alan];
  }
  return n;
}

const zaman = (s) => (s ? Date.parse(s) : -Infinity);

/**
 * İki profili birleştirir: konu bazında `guncelleme`si yeni olan kazanır; sınav,
 * hedef tarih ve tercihler `ayarGuncelleme`si yeni olandan gelir.
 */
export function profilBirlestir(mevcut, gelen) {
  const konular = { ...mevcut.konular };
  for (const [id, k] of Object.entries(gelen.konular)) {
    if (!konular[id] || zaman(k.guncelleme) > zaman(konular[id].guncelleme)) konular[id] = k;
  }
  const ayar = zaman(gelen.ayarGuncelleme) > zaman(mevcut.ayarGuncelleme) ? gelen : mevcut;
  return {
    ...mevcut,
    olusturma: zaman(gelen.olusturma) < zaman(mevcut.olusturma) ? gelen.olusturma : mevcut.olusturma,
    secilenSinav: ayar.secilenSinav,
    hedefTarih: ayar.hedefTarih,
    tercihler: ayar.tercihler,
    ayarGuncelleme: ayar.ayarGuncelleme,
    konular,
  };
}

/**
 * Konu kimliği değiştiyse (`takmaAdlar`) eski kayıtları yeni kimliğe taşır.
 * Yeni kimlikte de kayıt varsa güncel olan kalır. `eslesme`: eskiId → yeniId.
 */
export function takmaAdlariUygula(profil, eslesme) {
  const konular = {};
  for (const [id, k] of Object.entries(profil.konular)) {
    const hedef = eslesme[id] ?? id;
    if (!konular[hedef] || zaman(k.guncelleme) > zaman(konular[hedef].guncelleme)) konular[hedef] = k;
  }
  return { ...profil, konular };
}

/** Konu listesinden eskiId → yeniId eşlemesi. */
export function takmaAdEslesmesi(konular) {
  const e = {};
  for (const k of konular) for (const eski of k.data?.takmaAdlar ?? k.takmaAdlar ?? []) e[eski] = k.id;
  return e;
}

/** Konu listesi için ilerleme: tamamlanan, çalışılan (durumu olan), yüzde. */
export function ilerleme(konuIdleri, profilKonulari) {
  const toplam = konuIdleri.length;
  let tamamlanan = 0;
  let calisilan = 0;
  for (const id of konuIdleri) {
    const d = profilKonulari[id]?.durum;
    if (d) calisilan++;
    if (d === 'tamamlandi') tamamlanan++;
  }
  return { toplam, tamamlanan, calisilan, yuzde: toplam ? Math.round((tamamlanan / toplam) * 100) : 0 };
}

/** `kpss-rehber-yedek-YYYY-MM-DD.json` (yerel tarih). */
export function yedekDosyaAdi(simdi = new Date()) {
  const iki = (n) => String(n).padStart(2, '0');
  return `kpss-rehber-yedek-${simdi.getFullYear()}-${iki(simdi.getMonth() + 1)}-${iki(simdi.getDate())}.json`;
}
