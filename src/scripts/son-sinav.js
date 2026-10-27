/**
 * Son bakılan sınavı profilde (`secilenSinav`) hatırlar. Sınav sayfası
 * `data-son-sinav` ile kaydeder; ana sayfadaki gizli `data-devam` bağlantısı
 * o sınavın kartından doldurulup gösterilir.
 */
import { ayarKaydet, profilOku } from './profil.js';

const kaydedilecek = document.querySelector('[data-son-sinav]');
if (kaydedilecek && profilOku().secilenSinav !== kaydedilecek.dataset.sinavId) {
  ayarKaydet({ secilenSinav: kaydedilecek.dataset.sinavId });
}

const devam = document.querySelector('[data-devam]');
const kart = devam && document.querySelector(`[data-sinav-kart="${profilOku().secilenSinav}"]`);
if (kart) {
  const link = devam.querySelector('a');
  link.href = kart.href;
  link.textContent = kart.dataset.kisaAd;
  devam.hidden = false;
}
