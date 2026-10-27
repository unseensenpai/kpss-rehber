---
title: "Örnekleme"
subject: ornekleme
state: draft
subtopics:
  - Temel kavramlar ve örnekleme hataları
  - Olasılıklı ve olasılıksız örnekleme
  - Basit rastgele örnekleme
  - Örnek hacmi belirleme
  - Tabakalı örnekleme
  - Sistematik, küme ve çok aşamalı örnekleme
  - Oran ve regresyon tahmin edicileri
keyConcepts: [anakütle, örnekleme çerçevesi, örnekleme hatası, örnekleme dışı hata, sonlu anakütle düzeltmesi, basit rastgele örnekleme, tabakalı örnekleme, orantılı dağıtım, Neyman dağıtımı, sistematik örnekleme, küme örneklemesi, çok aşamalı örnekleme, kota örneklemesi, kartopu örneklemesi, oran tahmin edicisi, tasarım etkisi]
questionStyle: "Verilen duruma uygun örnekleme yöntemini bulma; örnek hacmi ya da tabakalara dağıtım hesaplama; tahmin edicinin varyansını yorumlama"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: kpss-lisans-2026
updated: 2026-10-28
---

## Temel fikir

Örnekleme, anakütlenin tamamını incelemeden, ondan seçilen bir parça ile anakütle hakkında güvenilir tahmin yapmaktır. İyi bir tasarım, verilen maliyetle en küçük varyansı ya da verilen hassasiyeti en düşük maliyetle sağlar. Testte **4 soru** vardır; sorular yöntem tanıma, örnek hacmi hesabı ve tabakalara dağıtım üzerinde yoğunlaşır.

## Temel kavramlar

- **Anakütle, örnekleme birimi** ve **örnekleme çerçevesi** (birimlerin seçimde kullanılan listesi).
- **Örnekleme hatası:** Tam sayım yerine örnek kullanmaktan doğar; n büyüdükçe küçülür.
- **Örnekleme dışı hata:** Çerçeve eksikliği, cevapsızlık, ölçme ve kayıt hataları; tam sayımda da görülür.
- **Olasılıklı örnekleme:** Her birimin seçilme olasılığı bilinir ve sıfırdan büyüktür; örnekleme hatası hesaplanabilir. **Olasılıksız örnekleme:** kolayda, kota, amaçlı (yargısal), kartopu.

## Basit rastgele örnekleme ve örnek hacmi

- Örnek ortalaması ȳ anakütle ortalamasının yansız tahmin edicisidir; iadesiz seçimde Var(ȳ) = (1 − f)·S²/n, f = n/N örnekleme oranıdır.
- **Sonlu anakütle düzeltmesi** (1 − f): n, N'ye göre çok küçükse (genellikle %5'in altında) ihmal edilir.
- **Ortalama için örnek hacmi:** n₀ = z²σ²/e², e kabul edilen hata payı. **Oran için:** n₀ = z²p(1 − p)/e²; p bilinmiyorsa en büyük hacmi veren p = 0,5 alınır.
- Sonlu anakütlede düzeltme: n = n₀ / (1 + n₀/N).
- Hata payını yarıya indirmek için örnek hacminin yaklaşık **dört katına** çıkması gerekir.

## Tabakalı örnekleme

- Anakütle **içte homojen, birbirinden farklı** tabakalara ayrılır; her tabakadan bağımsız örnek çekilir.
- **Tahmin edici:** ȳₛₜ = ∑ Wₕ ȳₕ, Wₕ = Nₕ/N.
- **Orantılı dağıtım:** nₕ ∝ Nₕ. **Neyman (optimum) dağıtımı:** nₕ ∝ Nₕ Sₕ. Tabakalarda birim maliyet farklıysa nₕ ∝ Nₕ Sₕ / √cₕ.

## Diğer olasılıklı yöntemler

- **Sistematik örnekleme:** k = N/n aralığıyla, rastgele bir başlangıçtan itibaren her k. birim seçilir. Listede k ile çakışan **dönemsellik** varsa ciddi yanlılık doğar.
- **Küme örneklemesi:** Doğal gruplar (mahalle, okul) seçilir ve içindeki birimler incelenir. Maliyet ve çerçeve açısından avantajlıdır; ama kümeler içte benzer olduğunda hassasiyet düşer, bu yüzden ideal küme **içte heterojendir**.
- **Çok aşamalı örnekleme:** Önce kümeler, sonra seçilen kümelerin içinden birimler seçilir.
- **Oran ve regresyon tahmin edicileri:** Ana değişkenle güçlü ilişkili ve anakütle toplamı bilinen bir yardımcı değişken kullanarak hassasiyeti artırır.
- **Tasarım etkisi:** Bir tasarımdaki tahmin varyansının aynı hacimli basit rastgele örneklemedeki varyansa oranı.

## Sık karıştırılanlar

- *Tabakalı örneklemede* her tabakadan birim seçilir ve tabakalar içte homojen olmalıdır; *küme örneklemesinde* yalnızca bazı kümeler seçilir ve kümeler içte heterojen olmalıdır.
- *Kota örneklemesi* tabakalıya benzer, ama birimler rastgele seçilmez; olasılıksız bir yöntemdir.
- *Örnekleme hatası* n arttıkça azalır; *örnekleme dışı hata* n arttıkça azalmaz, hatta büyüyebilir.

## Çalışma ipucu

Tabaka ile küme farkını tek cümleyle söyleyebilecek hâle gel, sonra n₀ = z²p(1 − p)/e² formülüyle birkaç örnek hacmi hesabı yap. Bu derste soruların çoğu bu iki noktadan gelir.
