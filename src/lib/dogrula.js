/**
 * Koleksiyonlar arası tutarlılık kontrolleri (spec §12). Zod tek dosyayı doğrular,
 * bunlar dosyalar arasındaki ilişkiyi. Hepsi saf: girdi `{ id, data }` listeleri,
 * çıktı hata mesajı listesi (boşsa veri tutarlı).
 */

import { konuKullanimlari } from './mufredat.js';
import { DEGISKENLER, konuSablonlari, promptDegerleri, promptDoldur, sablonDegiskenleri } from './prompt-doldur.js';
import { UZUNLUKLAR, VARSAYILAN } from './uyarlama.js';

/** @typedef {{ id: string, data: any }} Kayit */

/** Her sınav-test-ders üçlüsünü dolaşır. */
function* dersler(/** @type {Kayit[]} */ sinavlar) {
  for (const s of sinavlar) {
    for (const o of s.data.oturumlar) {
      for (const t of o.testler) {
        for (const d of t.dersler) yield { sinav: s.id, test: t, ders: d };
      }
    }
  }
}

/** Her sınav-ders-konu referansını dolaşır. */
function* referanslar(/** @type {Kayit[]} */ sinavlar) {
  for (const { sinav, test, ders } of dersler(sinavlar)) {
    for (const konu of ders.konular) yield { sinav, test: test.ad, ders: ders.ders, konu };
  }
}

/** Sınavın gösterdiği konu var mı, doğru derste mi? */
export function eksikReferanslar(/** @type {Kayit[]} */ sinavlar, /** @type {Kayit[]} */ konular) {
  const konuMap = new Map(konular.map((k) => [k.id, k]));
  const hatalar = [];
  for (const r of referanslar(sinavlar)) {
    const konu = konuMap.get(r.konu);
    if (!konu) {
      hatalar.push(`${r.sinav} › ${r.test} › ${r.ders}: '${r.konu}' konusu yok`);
    } else if (!r.konu.startsWith(`${r.ders}/`) || konu.data.ders !== r.ders) {
      hatalar.push(`${r.sinav} › ${r.test} › ${r.ders}: '${r.konu}' bu derse ait değil`);
    }
  }
  return hatalar;
}

/** Hiçbir sınavın kullanmadığı konular. */
export function yetimKonular(/** @type {Kayit[]} */ sinavlar, /** @type {Kayit[]} */ konular) {
  const kullanilan = new Set([...referanslar(sinavlar)].map((r) => r.konu));
  return konular
    .filter((k) => !kullanilan.has(k.id))
    .map((k) => `'${k.id}' konusunu hiçbir sınav kullanmıyor (yetim)`);
}

/** Konu dosyasının klasörü ile `ders` alanı aynı olmalı. */
export function dersKlasorUyumsuzlugu(/** @type {Kayit[]} */ konular) {
  return konular
    .filter((k) => k.id.split('/')[0] !== k.data.ders)
    .map((k) => `'${k.id}': ders alanı '${k.data.ders}', klasör ile uyuşmuyor`);
}

/** Derslerin soru sayıları toplamı testin soru sayısına eşit olmalı. */
export function soruToplamiHatalari(/** @type {Kayit[]} */ sinavlar) {
  const hatalar = [];
  for (const s of sinavlar) {
    for (const o of s.data.oturumlar) {
      for (const t of o.testler) {
        const toplam = t.dersler.reduce((a, d) => a + d.soruSayisi, 0);
        if (toplam !== t.soruSayisi) {
          hatalar.push(`${s.id} › ${t.ad}: derslerin toplamı ${toplam}, test ${t.soruSayisi} soru`);
        }
      }
    }
  }
  return hatalar;
}

/** Ağırlığı verilen dersin soru sayısı, testin o yüzdesinin yuvarlanmışı olmalı. */
export function agirlikHatalari(/** @type {Kayit[]} */ sinavlar) {
  const hatalar = [];
  for (const { sinav, test, ders } of dersler(sinavlar)) {
    if (ders.agirlik === undefined) continue;
    const beklenen = Math.round((test.soruSayisi * ders.agirlik) / 100);
    if (beklenen !== ders.soruSayisi) {
      hatalar.push(
        `${sinav} › ${test.ad} › ${ders.ders}: %${ders.agirlik} → ${beklenen} soru olmalı, ${ders.soruSayisi} yazılmış`,
      );
    }
  }
  return hatalar;
}

/** Bir sınavda aynı ders iki kez yazılamaz (ders sayfası `/sinav/<sinav>/<ders>/`). */
export function tekrarlananDersler(/** @type {Kayit[]} */ sinavlar) {
  const hatalar = [];
  for (const s of sinavlar) {
    const gorulen = new Set();
    for (const { sinav, test, ders } of dersler([s])) {
      if (gorulen.has(ders.ders)) hatalar.push(`${sinav} › ${test.ad}: '${ders.ders}' dersi sınavda iki kez yazılmış`);
      gorulen.add(ders.ders);
    }
  }
  return hatalar;
}

/**
 * Her kayıt bir kaynağa dayanmalı: sınavın ve konunun belgesi `kaynaklar`da olmalı,
 * konunun kaynak tipi ve yılı dolu olmalı (Zod'u atlayan veri için de güvence).
 */
export function kaynakEksikleri(
  /** @type {Kayit[]} */ sinavlar,
  /** @type {Kayit[]} */ konular,
  /** @type {Kayit[]} */ kaynaklar = [],
) {
  const belgeler = new Set(kaynaklar.map((k) => k.id));
  const hatalar = [];
  for (const s of sinavlar) {
    const belge = s.data.kaynak?.belge;
    if (!belge) hatalar.push(`${s.id}: kaynak belgesi eksik`);
    else if (!belgeler.has(belge)) hatalar.push(`${s.id}: '${belge}' belgesi kaynaklar listesinde yok`);
    for (const k of s.data.kaynak?.kitapciklar ?? []) {
      if (!belgeler.has(k)) hatalar.push(`${s.id}: '${k}' kitapçığı kaynaklar listesinde yok`);
    }
  }
  for (const k of konular) {
    if (!k.data.kaynak || !k.data.kaynakYili) hatalar.push(`${k.id}: kaynak/kaynakYili eksik`);
    if (k.data.belge && !belgeler.has(k.data.belge)) {
      hatalar.push(`${k.id}: '${k.data.belge}' belgesi kaynaklar listesinde yok`);
    }
  }
  return hatalar;
}

/** Takvim kayıtları var olan sınavlara ve belgelere bağlanmalı. */
export function takvimHatalari(
  /** @type {Kayit[]} */ takvim,
  /** @type {Kayit[]} */ sinavlar,
  /** @type {Kayit[]} */ kaynaklar,
) {
  const sinavIdleri = new Set(sinavlar.map((s) => s.id));
  const belgeler = new Set(kaynaklar.map((k) => k.id));
  const hatalar = [];
  for (const t of takvim) {
    if (!sinavIdleri.has(t.data.sinav)) hatalar.push(`takvim '${t.id}': '${t.data.sinav}' sınavı yok`);
    if (!belgeler.has(t.data.belge)) hatalar.push(`takvim '${t.id}': '${t.data.belge}' belgesi yok`);
    if (t.data.bitis && t.data.bitis < t.data.baslangic) hatalar.push(`takvim '${t.id}': bitiş başlangıçtan önce`);
  }
  return hatalar;
}

/**
 * Prompt şablonları: yalnızca bilinen değişkenler, ekPromptlar var olan özel
 * şablonlara bağlı, seviye 1–5 ve üç uzunluk eksiksiz, her konu için deneme
 * doldurmada `{{…}}` kalmıyor.
 */
export function promptHatalari({ sablonlar = [], seviyeler = [], uzunluklar = [], konular = [], sinavlar = [] }) {
  const hatalar = [];
  const bozuk = new Set();
  for (const s of sablonlar) {
    const govde = s.body ?? '';
    const bilinmeyen = sablonDegiskenleri(govde).filter((d) => !DEGISKENLER.includes(d));
    if (bilinmeyen.length) hatalar.push(`şablon '${s.id}': bilinmeyen değişken ${bilinmeyen.join(', ')}`);
    const yarim = /\{\{|\}\}/.test(govde.replace(/\{\{\s*[a-zA-Z]+\s*\}\}/g, ''));
    if (yarim) hatalar.push(`şablon '${s.id}': kapanmamış ya da hatalı {{…}} işareti`);
    // Her konu için aynı hatayı tekrarlamamak için deneme doldurmaya girmez.
    if (bilinmeyen.length || yarim) bozuk.add(s.id);
  }
  if (!sablonlar.length) return hatalar;

  const seviyeNo = seviyeler.map((s) => s.data.seviye).sort();
  if (seviyeNo.join() !== '1,2,3,4,5') hatalar.push(`seviyeler 1–5 olmalı, bulunan: ${seviyeNo.join(', ')}`);
  const uzunlukId = uzunluklar.map((u) => u.id).sort();
  if (uzunlukId.join() !== [...UZUNLUKLAR].sort().join()) hatalar.push(`uzunluklar ${UZUNLUKLAR.join('/')} olmalı`);

  const sablonMap = new Map(sablonlar.map((s) => [s.id, s]));
  const seviye = seviyeler.find((s) => s.data.seviye === VARSAYILAN.seviye)?.data;
  const uzunluk = uzunluklar.find((u) => u.id === VARSAYILAN.uzunluk)?.data;
  for (const k of konular) {
    for (const ek of k.data.ekPromptlar ?? []) {
      if (!sablonMap.get(ek)?.data.ozel) hatalar.push(`${k.id}: ekPromptlar '${ek}' özel bir şablon değil ya da yok`);
    }
    const kullanim = konuKullanimlari(sinavlar, k.id)[0];
    if (!kullanim || !seviye || !uzunluk) continue;
    const degerler = promptDegerleri({
      sinav: kullanim.sinav.data.ad,
      ders: kullanim.ders.ad,
      konu: k.data,
      seviye,
      uzunluk,
    });
    for (const s of konuSablonlari(sablonlar, k).filter((x) => !bozuk.has(x.id))) {
      try {
        const metin = promptDoldur(s.body ?? '', degerler);
        if (/\{\{|\}\}/.test(metin)) hatalar.push(`${k.id} › ${s.id}: doldurulmamış {{…}} kaldı`);
      } catch (e) {
        hatalar.push(`${k.id} › ${s.id}: ${e.message}`);
      }
    }
  }
  return hatalar;
}

/** Tüm kontroller; hata mesajlarını tek listede döner. */
export function veriyiDogrula({ sinavlar, konular, kaynaklar = [], takvim = [], sablonlar, seviyeler, uzunluklar }) {
  return [
    ...kaynakEksikleri(sinavlar, konular, kaynaklar),
    ...dersKlasorUyumsuzlugu(konular),
    ...eksikReferanslar(sinavlar, konular),
    ...yetimKonular(sinavlar, konular),
    ...soruToplamiHatalari(sinavlar),
    ...agirlikHatalari(sinavlar),
    ...tekrarlananDersler(sinavlar),
    ...takvimHatalari(takvim, sinavlar, kaynaklar),
    ...promptHatalari({ sablonlar, seviyeler, uzunluklar, konular, sinavlar }),
  ];
}
