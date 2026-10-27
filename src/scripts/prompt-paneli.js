/**
 * Prompt paneli davranışı: seviye/uzunluk (konu bazında saklanır), geri bildirimle
 * uyarlama, kopyalama ve ChatGPT/Claude'da açma. Metin her zaman panoya da kopyalanır
 * çünkü sağlayıcıların URL parametresi garanti değildir.
 */
import { ogrenciAlanlariniAyir, promptDegerleri, promptDoldur } from '../lib/prompt-doldur.js';
import { baslangicAyari, geriBildirimUygula } from '../lib/uyarlama.js';
import { disAcUrl, SAGLAYICILAR } from '../lib/dis-ac.js';
import { konuKaydet, profilOku } from './profil.js';

for (const kok of document.querySelectorAll('[data-prompt-paneli]')) kur(kok);

function kur(kok) {
  const veri = JSON.parse(kok.dataset.veri);
  const kutuphane = kok.hasAttribute('data-kutuphane');
  const $ = (s) => kok.querySelector(s);
  const seviyeSec = $('[data-seviye]');
  const uzunlukSec = $('[data-uzunluk]');
  const baglamSec = $('[data-baglam]');
  const sinavSec = $('[data-sinav-sec]');
  const konuSec = $('[data-konu-sec]');
  const uyarlamaMesaji = $('[data-uyarlama-mesaji]');
  const kartlar = [...kok.querySelectorAll('[data-sablon]')];
  const metinler = new Map();

  let konu = veri.konular.find((k) => k.id === (konuSec?.value ?? veri.konular[0].id));
  let baglam = konu.baglamlar[0];

  const seviyeBul = (n) => veri.seviyeler.find((s) => s.seviye === n);
  const uzunlukBul = (id) => veri.uzunluklar.find((u) => u.id === id);

  function kayit() {
    return profilOku().konular[konu.id];
  }

  /** Konunun kayıtlı ayarı; yoksa aynı dersin ortalaması (manuel seçim her zaman kazanır). */
  function ayarYukle() {
    const k = kayit();
    const ayar = k?.seviye ? k : baslangicAyari(konu.dersKonulari, profilOku().konular);
    seviyeSec.value = String(ayar.seviye);
    uzunlukSec.value = ayar.uzunluk;
  }

  function kaydet(alanlar) {
    $('[data-kayit-uyari]').hidden = konuKaydet(konu.id, alanlar);
  }

  function ciz() {
    const degerler = promptDegerleri({
      sinav: baglam.sinav,
      ders: baglam.ders,
      konu,
      seviye: seviyeBul(Number(seviyeSec.value)),
      uzunluk: uzunlukBul(uzunlukSec.value),
    });
    for (const kart of kartlar) {
      const sablon = veri.sablonlar.find((s) => s.id === kart.dataset.sablon);
      kart.hidden = !konu.sablonlar.includes(sablon.id);
      if (kart.hidden) continue;
      const metin = promptDoldur(sablon.metin, degerler);
      metinler.set(kart, metin);
      kart.querySelector('[data-onizleme]').replaceChildren(
        ...ogrenciAlanlariniAyir(metin).map((p) => {
          if (!p.alan) return p.metin;
          const m = document.createElement('mark');
          m.className = 'ogrenci-alani';
          m.textContent = p.metin;
          return m;
        }),
      );
    }
  }

  function baglamlariDoldur() {
    if (kutuphane) {
      baglam = konu.baglamlar.find((b) => b.sinavId === sinavSec.value) ?? konu.baglamlar[0];
      return;
    }
    baglamSec.replaceChildren(
      ...konu.baglamlar.map((b, i) => new Option(`${b.kisaAd} · ${b.ders}`, String(i))),
    );
    // Son bakılan sınav bu konuyu içeriyorsa onun bağlamıyla başla.
    let son = null;
    try { son = JSON.parse(localStorage.getItem('kpss-rehber:son-sinav') ?? 'null'); } catch { /* yok */ }
    const i = Math.max(0, konu.baglamlar.findIndex((b) => b.sinavId === son?.sinavId));
    baglamSec.value = String(i);
    baglam = konu.baglamlar[i];
  }

  function konulariDoldur() {
    const sinav = veri.sinavlar.find((s) => s.id === sinavSec.value);
    konuSec.replaceChildren(
      ...sinav.dersler.map((d) => {
        const grup = document.createElement('optgroup');
        grup.label = d.ad;
        grup.append(...d.konular.map((id) => new Option(veri.konular.find((k) => k.id === id).baslik, id)));
        return grup;
      }),
    );
    konuDegisti();
  }

  function konuDegisti() {
    konu = veri.konular.find((k) => k.id === konuSec.value);
    baglamlariDoldur();
    ayarYukle();
    uyarlamaMesaji.textContent = '';
    ciz();
  }

  /**
   * Panoya kopyalar. Clipboard API izni yoksa (bazı gömülü tarayıcılar) önizlemeyi
   * açıp metni seçer ve eski execCommand yolunu dener; o da olmazsa seçili bırakır.
   */
  async function kopyala(kart) {
    const metin = metinler.get(kart);
    try {
      await navigator.clipboard.writeText(metin);
      return true;
    } catch {
      kart.querySelector('details').open = true;
      const aralik = document.createRange();
      aralik.selectNodeContents(kart.querySelector('[data-onizleme]'));
      const secim = getSelection();
      secim.removeAllRanges();
      secim.addRange(aralik);
      try {
        return document.execCommand('copy');
      } catch {
        return false;
      }
    }
  }

  function bildir(kart, metin) {
    kart.querySelector('[data-bildirim]').textContent = metin;
  }

  const alanHatirlatma = (kart) =>
    ogrenciAlanlariniAyir(metinler.get(kart)).some((p) => p.alan) ? ' Köşeli parantezli alanları doldurmayı unutma.' : '';

  for (const kart of kartlar) {
    kart.querySelector('[data-kopyala]').addEventListener('click', async () => {
      const tamam = await kopyala(kart);
      bildir(kart, tamam ? `Kopyalandı.${alanHatirlatma(kart)}` : 'Otomatik kopyalanamadı; metin seçildi, Ctrl+C ile kopyalayabilirsin.');
    });
    for (const dugme of kart.querySelectorAll('[data-ac]')) {
      dugme.addEventListener('click', async () => {
        const saglayici = dugme.dataset.ac;
        // Kopyalama sayfa odaktayken başlamalı; yeni sekme açılınca odak gider.
        const kopya = kopyala(kart);
        window.open(disAcUrl(saglayici, metinler.get(kart)), '_blank', 'noopener');
        const tamam = await kopya;
        const ad = SAGLAYICILAR[saglayici].ad;
        bildir(
          kart,
          tamam
            ? `${ad} yeni sekmede açıldı; metin panoya da kopyalandı. Kutu boşsa yapıştır.${alanHatirlatma(kart)}`
            : `${ad} açıldı ama otomatik kopyalanamadı; metin seçildi, Ctrl+C ile kopyala.`,
        );
      });
    }
  }

  seviyeSec.addEventListener('change', () => {
    kaydet({ seviye: Number(seviyeSec.value), uzunluk: uzunlukSec.value });
    ciz();
  });
  uzunlukSec.addEventListener('change', () => {
    kaydet({ seviye: Number(seviyeSec.value), uzunluk: uzunlukSec.value });
    ciz();
  });
  baglamSec?.addEventListener('change', () => {
    baglam = konu.baglamlar[Number(baglamSec.value)];
    ciz();
  });
  sinavSec?.addEventListener('change', konulariDoldur);
  konuSec?.addEventListener('change', konuDegisti);

  for (const dugme of kok.querySelectorAll('[data-geri-bildirim]')) {
    dugme.addEventListener('click', () => {
      const once = { seviye: Number(seviyeSec.value), uzunluk: uzunlukSec.value };
      const yeni = geriBildirimUygula({ ...once, geriBildirim: kayit()?.geriBildirim ?? [] }, dugme.dataset.geriBildirim);
      kaydet(yeni);
      seviyeSec.value = String(yeni.seviye);
      uzunlukSec.value = yeni.uzunluk;
      ciz();
      const degisim = [];
      if (yeni.seviye !== once.seviye) degisim.push(`seviye ${seviyeBul(once.seviye).ad} → ${seviyeBul(yeni.seviye).ad}`);
      if (yeni.uzunluk !== once.uzunluk) degisim.push(`uzunluk ${uzunlukBul(once.uzunluk).ad} → ${uzunlukBul(yeni.uzunluk).ad}`);
      uyarlamaMesaji.textContent = degisim.length
        ? `Teşekkürler; ${degisim.join(', ')}. Promptlar güncellendi.`
        : 'Teşekkürler; ayarlar aynı kaldı.';
    });
  }

  if (kutuphane) konulariDoldur();
  else {
    baglamlariDoldur();
    ayarYukle();
    ciz();
  }
}
