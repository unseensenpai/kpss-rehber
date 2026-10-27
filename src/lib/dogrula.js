/**
 * Koleksiyonlar arası tutarlılık kontrolleri (spec §12). Zod tek dosyayı doğrular,
 * bunlar dosyalar arasındaki ilişkiyi. Hepsi saf: girdi `{ id, data }` listeleri,
 * çıktı hata mesajı listesi (boşsa veri tutarlı).
 */

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

/** Bir test içinde aynı ders iki kez yazılamaz. */
export function tekrarlananDersler(/** @type {Kayit[]} */ sinavlar) {
  const hatalar = [];
  for (const s of sinavlar) {
    for (const o of s.data.oturumlar) {
      for (const t of o.testler) {
        const gorulen = new Set();
        for (const d of t.dersler) {
          if (gorulen.has(d.ders)) hatalar.push(`${s.id} › ${t.ad}: '${d.ders}' dersi iki kez yazılmış`);
          gorulen.add(d.ders);
        }
      }
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

/** Tüm kontroller; hata mesajlarını tek listede döner. */
export function veriyiDogrula({ sinavlar, konular, kaynaklar = [], takvim = [] }) {
  return [
    ...kaynakEksikleri(sinavlar, konular, kaynaklar),
    ...dersKlasorUyumsuzlugu(konular),
    ...eksikReferanslar(sinavlar, konular),
    ...yetimKonular(sinavlar, konular),
    ...soruToplamiHatalari(sinavlar),
    ...agirlikHatalari(sinavlar),
    ...tekrarlananDersler(sinavlar),
    ...takvimHatalari(takvim, sinavlar, kaynaklar),
  ];
}
