/**
 * Prompt şablonlarını doldurur (spec §7). Saf: hem build doğrulamasında hem
 * tarayıcıdaki prompt kartında aynı fonksiyon kullanılır.
 */

/** Şablonlarda kullanılabilecek değişkenler; başkası build'i kırar. */
export const DEGISKENLER = [
  'sinav',
  'ders',
  'konu',
  'altBasliklar',
  'anahtarKavramlar',
  'soruTipi',
  'seviyeAdi',
  'seviyeTalimati',
  'uzunlukTalimati',
  'tercihler',
];

const DEGISKEN = /\{\{\s*([a-zA-Z]+)\s*\}\}/g;

/** Öğrencinin kendisinin dolduracağı alanlar: [SORUYU BURAYA YAPIŞTIR] gibi. */
export const OGRENCI_ALANI = /\[[A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜ0-9 ,.'’/()-]*\]/g;

/** Şablonda geçen değişken adları (tekrarsız, ilk geçiş sırasıyla). */
export function sablonDegiskenleri(metin) {
  return [...new Set([...metin.matchAll(DEGISKEN)].map((m) => m[1]))];
}

/**
 * `{{ad}}` yerlerine değerleri koyar. Tanımsız değişken hata fırlatır; boş metin
 * geçerlidir (ör. tercih yoksa) ve geride kalan boş satırlar tek boşluğa iner.
 */
export function promptDoldur(sablon, degerler) {
  const eksik = sablonDegiskenleri(sablon).filter((ad) => degerler[ad] === undefined || degerler[ad] === null);
  if (eksik.length) throw new Error(`Şablonda doldurulmamış değişken: ${eksik.join(', ')}`);
  return sablon
    .replace(DEGISKEN, (_, ad) => String(degerler[ad]))
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Konu ve tercihlerden şablon değerlerini kurar. İskelet konularda boş kalan
 * alanlar için modele genel bir yönerge verilir.
 */
export function promptDegerleri({ sinav, ders, konu, seviye, uzunluk, tercihler = '' }) {
  const liste = (dizi, yedek) => (dizi?.length ? dizi.join(', ') : yedek);
  return {
    sinav,
    ders,
    konu: konu.baslik,
    altBasliklar: liste(konu.altBasliklar, 'konunun resmi kapsamındaki tüm alt başlıklar'),
    anahtarKavramlar: liste(konu.anahtarKavramlar, 'konunun temel kavramları'),
    soruTipi: konu.soruTipi || 'ÖSYM’nin bu konudaki tipik soru tarzı',
    seviyeAdi: seviye.ad,
    seviyeTalimati: seviye.talimat,
    uzunlukTalimati: uzunluk.talimat,
    tercihler: tercihler ? `Öğrencinin tercihleri: ${tercihler}` : '',
  };
}

/** Metni düz parçalar ve öğrenci alanları olarak böler (sayfada vurgulamak için). */
export function ogrenciAlanlariniAyir(metin) {
  const parcalar = [];
  let son = 0;
  for (const m of metin.matchAll(OGRENCI_ALANI)) {
    if (m.index > son) parcalar.push({ metin: metin.slice(son, m.index), alan: false });
    parcalar.push({ metin: m[0], alan: true });
    son = m.index + m[0].length;
  }
  if (son < metin.length) parcalar.push({ metin: metin.slice(son), alan: false });
  return parcalar;
}

/** Konuda gösterilecek şablonlar: genel olanlar + konunun `ekPromptlar` listesindeki özel olanlar. */
export function konuSablonlari(sablonlar, konu) {
  const ek = konu.data.ekPromptlar ?? [];
  return sablonlar.filter((s) => !s.data.ozel || ek.includes(s.id));
}
