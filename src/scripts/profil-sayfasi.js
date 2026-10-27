/**
 * Profil sayfası: hedef, tercihler, ilerleme özeti, yedekle / yükle (birleştir |
 * üzerine yaz) ve verileri sil. Geçersiz yedek hiçbir şeyi değiştirmez.
 */
import {
  profilBirlestir,
  profilDogrula,
  takmaAdlariUygula,
  YEDEK_BOYUT_SINIRI,
  yedekDosyaAdi,
} from '../lib/profil-veri.js';
import { geriSayimMetni, kalanGun } from '../lib/mufredat.js';
import { ayarKaydet, profilOku, profilSil, profilYaz } from './profil.js';
import { ilerlemeleriCiz } from './ilerleme.js';

const kok = document.querySelector('[data-profil-sayfasi]');
if (kok) kur(kok);

function kur(kok) {
  const veri = JSON.parse(kok.dataset.veri);
  const $ = (s) => kok.querySelector(s);
  const sinavSec = $('[data-secilen-sinav]');
  const hedefTarih = $('[data-hedef-tarih]');
  const tercihler = $('[data-tercihler]');

  // Konu kimlikleri değiştiyse eski kayıtları bir kez yeni kimliklere taşı.
  const ilk = profilOku();
  const tasinmis = takmaAdlariUygula(ilk, veri.eslesme);
  if (Object.keys(tasinmis.konular).join() !== Object.keys(ilk.konular).join()) profilYaz(tasinmis);

  function hedefMesaji() {
    const t = hedefTarih.value;
    $('[data-hedef-mesaji]').textContent = t ? `Hedef tarihine ${geriSayimMetni(kalanGun(new Date(t)))}.` : '';
  }

  function ciz() {
    const p = profilOku();
    sinavSec.value = p.secilenSinav ?? '';
    hedefTarih.value = p.hedefTarih ?? '';
    tercihler.value = p.tercihler ?? '';
    hedefMesaji();

    ilerlemeleriCiz();

    const tekrar = Object.entries(p.konular).filter(([id, k]) => k.durum === 'tekrar' && veri.konular[id]);
    $('[data-tekrar-listesi]').replaceChildren(
      ...tekrar.map(([id]) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = veri.konular[id].href;
        a.textContent = veri.konular[id].baslik;
        li.append(a);
        return li;
      }),
    );
    $('[data-tekrar-bos]').hidden = tekrar.length > 0;
  }

  sinavSec.addEventListener('change', () => ayarKaydet({ secilenSinav: sinavSec.value || null }));
  hedefTarih.addEventListener('change', () => {
    ayarKaydet({ hedefTarih: hedefTarih.value || null });
    hedefMesaji();
  });
  let zamanlayici;
  tercihler.addEventListener('input', () => {
    clearTimeout(zamanlayici);
    zamanlayici = setTimeout(() => {
      const tamam = ayarKaydet({ tercihler: tercihler.value.trim() });
      $('[data-tercih-mesaji]').textContent = tamam ? 'Kaydedildi; promptlarına eklenecek.' : 'Kaydedilemedi.';
    }, 400);
  });

  $('[data-yedekle]').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(profilOku(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = yedekDosyaAdi();
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  const yukleMesaji = $('[data-yukle-mesaji]');
  function yukleBildir(baslik, hatalar = [], hata = false) {
    const p = document.createElement('p');
    p.className = hata ? 'hata' : 'basari';
    p.textContent = baslik;
    const ul = document.createElement('ul');
    ul.append(...hatalar.slice(0, 10).map((h) => Object.assign(document.createElement('li'), { textContent: h })));
    if (hatalar.length > 10) ul.append(Object.assign(document.createElement('li'), { textContent: `…ve ${hatalar.length - 10} hata daha` }));
    yukleMesaji.replaceChildren(p, ...(hatalar.length ? [ul] : []));
  }

  $('[data-yukle-form]').addEventListener('submit', async (e) => {
    e.preventDefault();
    const dosya = $('[data-yedek-dosyasi]').files[0];
    if (!dosya) return;
    if (dosya.size > YEDEK_BOYUT_SINIRI) return yukleBildir('Dosya çok büyük; bu bir KPSS Rehber yedeği olamaz.', [], true);
    let ham;
    try {
      ham = JSON.parse(await dosya.text());
    } catch {
      return yukleBildir('Dosya okunamadı: geçerli bir JSON değil. Verilerin değişmedi.', [], true);
    }
    const { hatalar, profil: gelen } = profilDogrula(ham);
    if (!gelen) return yukleBildir('Yedek geçersiz; verilerin değişmedi.', hatalar, true);

    const kip = kok.querySelector('input[name="kip"]:checked').value;
    const tasinan = takmaAdlariUygula(gelen, veri.eslesme);
    let yeni;
    if (kip === 'uzerine-yaz') {
      if (!confirm('Bu tarayıcıdaki mevcut ilerlemen silinip yedektekiyle değiştirilecek. Emin misin?')) {
        return yukleBildir('Yükleme iptal edildi; verilerin değişmedi.');
      }
      yeni = tasinan;
    } else {
      yeni = profilBirlestir(profilOku(), tasinan);
    }
    if (!profilYaz(yeni)) return yukleBildir('Yedek kaydedilemedi: tarayıcın depolamaya izin vermiyor.', [], true);
    const sayi = Object.keys(gelen.konular).length;
    yukleBildir(`Yedek yüklendi (${kip === 'birlestir' ? 'birleştirildi' : 'üzerine yazıldı'}): ${sayi} konu kaydı.`);
    $('[data-yukle-form]').reset();
    ciz();
  });

  $('[data-sil]').addEventListener('click', () => {
    if (!confirm('Bu tarayıcıdaki tüm durumların, notların ve ayarların silinecek. Geri alınamaz. Emin misin?')) return;
    $('[data-sil-mesaji]').textContent = profilSil() ? 'Tüm verilerin silindi.' : 'Silinemedi.';
    ciz();
  });

  ciz();
}
