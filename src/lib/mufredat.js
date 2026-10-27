/**
 * Sayfaların müfredat verisinden ihtiyaç duyduğu türetmeler. Hepsi saf;
 * girdiler content collection kayıtları (`{ id, data }`).
 */

const GUN_MS = 24 * 60 * 60 * 1000;

/** Sınavdaki tüm (oturum, test, ders) üçlüleri, YAML sırasıyla. */
export function sinavDersleri(sinav) {
  return sinav.data.oturumlar.flatMap((oturum) =>
    oturum.testler.flatMap((test) => test.dersler.map((ders) => ({ oturum, test, ders }))),
  );
}

/**
 * Sınavın toplam soru sayısı, süresi ve test sayısı. Tek test seçilen oturumda en uzun
 * test sayılır; oturumları seçmeli sınavda toplamlar tüm oturumlarındır (`secmeli` true).
 */
export function sinavOzeti(sinav) {
  let soru = 0;
  let sureDk = 0;
  let testSayisi = 0;
  for (const o of sinav.data.oturumlar) {
    const testSoru = o.testler.map((t) => t.soruSayisi);
    const testSure = o.testler.map((t) => t.sureDk ?? 0);
    testSayisi += o.testler.length;
    if (o.tekTestSecilir) {
      soru += Math.max(...testSoru);
      sureDk += o.sureDk ?? Math.max(...testSure);
    } else {
      soru += testSoru.reduce((a, b) => a + b, 0);
      sureDk += o.sureDk ?? testSure.reduce((a, b) => a + b, 0);
    }
  }
  return { soru, sureDk, testSayisi, secmeli: Boolean(sinav.data.oturumlarSecmeli) };
}

/** Bir konunun hangi sınav/testlerde, hangi ders altında geçtiği. */
export function konuKullanimlari(sinavlar, konuId) {
  return sinavlar.flatMap((sinav) =>
    sinavDersleri(sinav)
      .filter(({ ders }) => ders.konular.includes(konuId))
      .map(({ test, ders }) => ({ sinav, test, ders })),
  );
}

/** `soruDagilimi` varsa yıllık ortalama soru sayısı (1 ondalık), yoksa null. */
export function konuOrtalamasi(konu) {
  const degerler = Object.values(konu.data.soruDagilimi ?? {});
  if (!degerler.length) return null;
  return Math.round((degerler.reduce((a, b) => a + b, 0) / degerler.length) * 10) / 10;
}

/** Konuları ortalama soru sayısına göre azalan sıralar; verisi olmayanlar sonda, sıraları korunur. */
export function cokSoruCikanSirasi(konular) {
  return konular
    .map((konu, i) => ({ konu, i, ort: konuOrtalamasi(konu) }))
    .sort((a, b) => (b.ort ?? -1) - (a.ort ?? -1) || a.i - b.i)
    .map((x) => x.konu);
}

/**
 * Sınavın takvimdeki sınav günleri; `simdi`den sonraki ilk gün `siradaki`,
 * hepsi geçtiyse `son` dolu döner.
 */
export function sinavTarihleri(takvim, sinavId, simdi = new Date()) {
  const gunler = takvim
    .filter((t) => t.data.sinav === sinavId && t.data.tur === 'sinav')
    .map((t) => t.data)
    .sort((a, b) => a.baslangic - b.baslangic);
  const siradaki = gunler.find((g) => kalanGun(g.baslangic, simdi) >= 0) ?? null;
  return { siradaki, son: gunler.at(-1) ?? null };
}

/**
 * Takvim gününe kalan tam gün. Takvim tarihleri YAML'dan UTC gece yarısı olarak gelir,
 * `simdi` ise kullanıcının yerel günüdür; ikisi ayrı okunur.
 */
export function kalanGun(hedef, simdi = new Date()) {
  const h = new Date(hedef);
  const hedefGun = Date.UTC(h.getUTCFullYear(), h.getUTCMonth(), h.getUTCDate());
  const bugun = Date.UTC(simdi.getFullYear(), simdi.getMonth(), simdi.getDate());
  return Math.round((hedefGun - bugun) / GUN_MS);
}

/** Kalan gün sayısının kullanıcıya gösterilen hâli. */
export function geriSayimMetni(gun) {
  if (gun > 0) return `${gun} gün kaldı`;
  return gun === 0 ? 'bugün' : 'yapıldı';
}

/** "6 Eylül 2026" biçimi. */
export function tarihYaz(tarih) {
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(tarih),
  );
}

/** Hata bildirimi için önceden doldurulmuş GitHub issue bağlantısı. */
export function hataBildirUrl(repo, { baslik, sayfa }) {
  const p = new URLSearchParams({ template: 'hata-bildir.yml', title: `[Hata] ${baslik}`, sayfa });
  return `https://github.com/${repo}/issues/new?${p}`;
}
