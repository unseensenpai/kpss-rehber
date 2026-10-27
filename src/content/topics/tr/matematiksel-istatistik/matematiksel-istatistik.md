---
title: "Matematiksel İstatistik"
subject: matematiksel-istatistik
state: draft
subtopics:
  - Örnekleme dağılımları (ki-kare, t, F)
  - Tahmin edicilerin özellikleri
  - Momentler yöntemi ve en çok olabilirlik
  - Yeterlilik ve Cramér–Rao alt sınırı
  - Aralık tahmini
  - Hipotez testi ve Neyman–Pearson önsavı
keyConcepts: [tahmin edici, yansızlık, tutarlılık, etkinlik, hata kareler ortalaması, yeterli istatistik, çarpanlara ayırma teoremi, momentler yöntemi, en çok olabilirlik, Fisher bilgisi, Cramér-Rao alt sınırı, güven aralığı, I. tip hata, II. tip hata, testin gücü, olabilirlik oranı]
questionStyle: "Bir tahmin edicinin yansız olup olmadığını gösterme; en çok olabilirlik tahmin edicisini türetme; hata türleri, güç ve örnekleme dağılımları üzerine yorum"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: kpss-lisans-2026
updated: 2026-10-28
---

## Temel fikir

Matematiksel istatistik, örnekten anakütle parametresi hakkında çıkarım yapmanın kuramsal temelidir: Hangi tahmin edici iyidir, nasıl bulunur, bir hipotez nasıl test edilir? Bu ders testte **6 soru** ile temsil edilir. Sorular genellikle bir tahmin edicinin beklenen değerini ya da varyansını hesaplatır, bir dağılım için en çok olabilirlik tahminini türetir ya da hata türleri ve testin gücü üzerine kavramsal yorum ister.

## Örnekleme dağılımları

- **Örnek ortalaması:** E(x̄) = μ, Var(x̄) = σ²/n.
- **Örnek varyansı:** S² = ∑(xᵢ − x̄)²/(n − 1); n − 1'e bölmek S²'yi σ² için yansız yapar.
- **Ki-kare:** k bağımsız standart normalin karelerinin toplamı χ²(k) dağılır; normal anakütlede (n − 1)S²/σ² ~ χ²(n − 1).
- **t dağılımı:** Z / √(V/k), V ~ χ²(k) ve Z'den bağımsız. Serbestlik derecesi arttıkça standart normale yaklaşır.
- **F dağılımı:** (U/m) / (V/n), U ve V bağımsız ki-kare değişkenler. t(k) değişkeninin karesi F(1, k) dağılır.

## Tahmin edicinin özellikleri

- **Yansızlık:** E(θ̂) = θ.
- **Hata kareler ortalaması:** HKO = Var(θ̂) + (yan)²; yanlı bir tahmin edicinin HKO'su daha küçük olabilir.
- **Tutarlılık:** n → ∞ iken θ̂ olasılıkta θ'ya yakınsar.
- **Etkinlik:** İki yansız tahmin ediciden varyansı küçük olan daha etkindir.
- **Yeterlilik:** İstatistik, örnekteki θ ile ilgili tüm bilgiyi taşır; Fisher–Neyman çarpanlara ayırma teoremiyle gösterilir.
- **Cramér–Rao alt sınırı:** Düzenlilik koşulları altında yansız bir tahmin edicinin varyansı 1/(n·I(θ)) değerinden küçük olamaz; I(θ) tek gözlemin Fisher bilgisidir.

## Tahmin yöntemleri

- **Momentler yöntemi:** Örnek momentleri anakütle momentlerine eşitlenip çözülür.
- **En çok olabilirlik (EÇO):** L(θ) = ∏ f(xᵢ; θ) en büyüklenir; pratikte ln L'nin türevi sıfıra eşitlenir. Poisson için λ̂ = x̄, üstel için λ̂ = 1/x̄, Bernoulli için p̂ = x̄.
- **Değişmezlik:** θ̂ EÇO ise g(θ̂) de g(θ)'nın EÇO'sudur.

## Hipotez testi

- **I. tip hata (α):** Doğru H₀'ı reddetme. **II. tip hata (β):** Yanlış H₀'ı reddetmeme. **Güç** = 1 − β.
- Örnek hacmi sabitken α küçültülürse β büyür; ikisini birlikte azaltmanın yolu n'yi artırmaktır.
- **p-değeri:** H₀ doğruyken gözlenen kadar ya da daha uç bir sonucun olasılığı; p < α ise H₀ reddedilir.
- **Neyman–Pearson önsavı:** Basit hipoteze karşı basit hipotez testinde, verilen α için en güçlü test olabilirlik oranına dayanır.

## Sık karıştırılanlar

- *Yansızlık* ortalamada doğru olmayı, *tutarlılık* büyük örnekte doğru değere yakınsamayı anlatır.
- *α (anlamlılık düzeyi)* önceden seçilir; *p-değeri* veriden hesaplanır.
- *%95 güven aralığı* "parametre %95 olasılıkla bu aralıktadır" demek değildir; *yöntemin* ürettiği aralıkların yaklaşık %95'inin parametreyi kapsaması demektir.

## Çalışma ipucu

Poisson, üstel, normal ve Bernoulli için EÇO türetmelerini birer kez kendi elinle yap; sınavdaki sorular büyük ölçüde bu kalıpların küçük varyasyonlarıdır.
