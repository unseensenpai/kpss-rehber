---
title: "Analiz"
subject: im-analiz
state: draft
subtopics:
  - Gerçel sayılar, diziler ve dizi limiti
  - Fonksiyon limiti ve süreklilik
  - Türev ve türev uygulamaları
  - Belirsiz ve belirli integral
  - İntegralin uygulamaları (alan ve hacim)
  - Seriler ve yakınsaklık testleri
keyConcepts: [dizi limiti, monoton dizi, süreklilik, ara değer teoremi, Rolle teoremi, ortalama değer teoremi, L'Hôpital kuralı, zincir kuralı, ekstremum, büküm noktası, analizin temel teoremi, kısmi integrasyon, geometrik seri, oran testi]
questionStyle: "Bir limit, türev ya da integrali hesaplama; bir teoremin koşullarının sağlanıp sağlanmadığını yorumlama; bir serinin yakınsak olup olmadığına karar verme"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: meb-ags-2026
updated: 2026-10-28
---

## Temel fikir

Analiz, **limit** kavramı üzerine kurulur: Süreklilik, türev, integral ve seriler aslında farklı biçimlerde sorulmuş limit sorularıdır. İlköğretim Matematik ÖABT'sinde **18 soruyla** en ağır alandır. Sorular çoğunlukla bir limiti, türevi ya da integrali hesaplatır; bir kısmı da bir teoremin (ara değer, Rolle, ortalama değer) koşullarını bilip bilmediğini ölçer. Ortaokulda öğreteceğin değişim hızı, eğim ve alan fikirlerinin üniversite düzeyindeki karşılığı burasıdır.

## Diziler, limit ve süreklilik

- **Dizi limiti:** Yakınsak her dizi sınırlıdır; tersi doğru değildir ((−1)ⁿ sınırlı ama ıraksaktır). **Monoton ve sınırlı** her dizi yakınsar.
- **Önemli limitler:** lim x→0 sin x / x = 1, lim n→∞ (1 + 1/n)ⁿ = e.
- **Süreklilik:** f, a noktasında süreklidir ⇔ lim x→a f(x) vardır ve f(a)'ya eşittir. Sağdan ve soldan limitler farklıysa limit yoktur.
- **Ara değer teoremi:** f, [a, b] aralığında sürekli ve f(a)·f(b) < 0 ise (a, b) içinde f(c) = 0 olan bir c vardır. Kapalı aralıkta sürekli fonksiyon en büyük ve en küçük değerini alır.

## Türev

- **Tanım:** f'(a) = lim h→0 [f(a + h) − f(a)] / h; geometrik olarak teğetin eğimi, fiziksel olarak anlık değişim hızıdır.
- **Türevlenebilirlik süreklilik gerektirir**, ama tersi yanlıştır: |x| fonksiyonu 0'da süreklidir, türevi yoktur.
- **Kurallar:** (f·g)' = f'g + fg', zincir kuralı (f∘g)'(x) = f'(g(x))·g'(x).
- **Ortalama değer teoremi:** [a, b]'de sürekli, (a, b)'de türevli f için f'(c) = [f(b) − f(a)] / (b − a) olan bir c vardır. **Rolle** teoremi bunun f(a) = f(b) özel hâlidir.
- **L'Hôpital kuralı:** 0/0 ya da ∞/∞ belirsizliğinde lim f/g = lim f'/g' (sağdaki limit varsa).
- **Uygulamalar:** f'(x) = 0 olan kritik noktada f''(x) > 0 ise yerel minimum, f''(x) < 0 ise yerel maksimum vardır. İkinci türevin işaret değiştirdiği yer **büküm noktası**dır.

## İntegral

- **Analizin temel teoremi:** F' = f ise ∫ₐᵇ f(x) dx = F(b) − F(a); ayrıca d/dx ∫ₐˣ f(t) dt = f(x).
- **Temel kalıplar:** ∫ xⁿ dx = xⁿ⁺¹/(n+1) + C (n ≠ −1), ∫ (1/x) dx = ln|x| + C, ∫ eˣ dx = eˣ + C.
- **Yöntemler:** Değişken değiştirme ve **kısmi integrasyon**: ∫ u dv = u·v − ∫ v du.
- **Alan ve hacim:** İki eğri arasındaki alan ∫ₐᵇ [f(x) − g(x)] dx (f ≥ g); x ekseni etrafında dönme hacmi π ∫ₐᵇ [f(x)]² dx.

## Seriler

- **Geometrik seri:** Σ a·rⁿ yalnızca |r| < 1 iken yakınsar; toplamı a/(1 − r) olur (ilk terim a).
- **p-serisi:** Σ 1/nᵖ, p > 1 ise yakınsak; p ≤ 1 ise ıraksaktır (harmonik seri p = 1).
- **Testler:** Terimler sıfıra gitmiyorsa seri ıraksar. **Oran testi:** lim |aₙ₊₁/aₙ| = L < 1 yakınsak, L > 1 ıraksak, L = 1 karar vermez.

## Sık karıştırılanlar

- *Sürekli* olmak *türevli* olmayı garanti etmez; türevli olmak ise sürekliliği garanti eder.
- *aₙ → 0* koşulu yakınsaklık için *gerekli* ama *yeterli* değildir: Harmonik serinin terimleri sıfıra gider, seri yine de ıraksar.
- *Belirsiz integral* bir fonksiyon ailesidir (+ C), *belirli integral* bir sayıdır.

## Çalışma ipucu

Her teoremi koşullarıyla birlikte ezberle ve koşulu bozan bir karşı örnek bul (|x|, 1/x gibi). Soruların önemli bir kısmı tam da "hangi koşul sağlanmıyor?" sorusunu sorar.
