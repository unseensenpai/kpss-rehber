/**
 * Koleksiyonlar arası tutarlılık kontrolleri (spec §12). Zod tek dosyayı doğrular,
 * bunlar dosyalar arasındaki ilişkiyi. Hepsi saf: girdi `{ id, data }` listeleri,
 * çıktı hata mesajı listesi (boşsa veri tutarlı).
 */

/** @typedef {{ id: string, data: any }} Kayit */

/** Her sınav-ders-konu referansını dolaşır. */
function* referanslar(/** @type {Kayit[]} */ sinavlar) {
  for (const s of sinavlar) {
    for (const o of s.data.oturumlar) {
      for (const t of o.testler) {
        for (const d of t.dersler) {
          for (const konu of d.konular) yield { sinav: s.id, test: t.ad, ders: d.ders, konu };
        }
      }
    }
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

/** Her kayıt bir kaynağa ve yıla dayanmalı (Zod'u atlayan veri için de güvence). */
export function kaynakEksikleri(/** @type {Kayit[]} */ sinavlar, /** @type {Kayit[]} */ konular) {
  const hatalar = [];
  for (const s of sinavlar) {
    if (!s.data.kaynak?.tip || !s.data.kaynak?.yil) hatalar.push(`${s.id}: kaynak tipi/yılı eksik`);
  }
  for (const k of konular) {
    if (!k.data.kaynak || !k.data.kaynakYili) hatalar.push(`${k.id}: kaynak/kaynakYili eksik`);
  }
  return hatalar;
}

/** Tüm kontroller; hata mesajlarını tek listede döner. */
export function veriyiDogrula(/** @type {Kayit[]} */ sinavlar, /** @type {Kayit[]} */ konular) {
  return [
    ...kaynakEksikleri(sinavlar, konular),
    ...dersKlasorUyumsuzlugu(konular),
    ...eksikReferanslar(sinavlar, konular),
    ...yetimKonular(sinavlar, konular),
    ...soruToplamiHatalari(sinavlar),
  ];
}
