---
title: "Analiz"
subject: mat-analiz
state: draft
subtopics:
  - Gerçel sayıların tamlığı, supremum ve infimum
  - Diziler, Cauchy dizileri ve ε-δ limiti
  - Süreklilik ve düzgün süreklilik
  - Türev, Taylor açılımı ve Riemann integrali
  - Genelleştirilmiş integraller ve kuvvet serileri
  - Çok değişkenli fonksiyonlar ve katlı integraller
  - Karmaşık fonksiyonlara giriş
keyConcepts: [supremum, tamlık aksiyomu, Cauchy dizisi, Bolzano-Weierstrass teoremi, ε-δ tanımı, düzgün süreklilik, Taylor polinomu, Riemann integrali, genelleştirilmiş integral, yakınsaklık yarıçapı, kısmi türev, gradyan, Jacobian, Cauchy-Riemann denklemleri]
questionStyle: "Bir limit, integral ya da seri hesabını yapma; tanım ve teoremlerin (tamlık, düzgün süreklilik, yakınsaklık) koşullarını yorumlama; çok değişkenli fonksiyonlarda ekstremum ve katlı integral sorularını çözme"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: meb-ags-2026
updated: 2026-10-28
---

## Temel fikir

Lise öğretmenliği düzeyindeki Analiz, hesap tekniklerinin ötesine geçip bunların **neden çalıştığını** sorar: Gerçel sayıların tamlığı, ε-δ tanımları ve yakınsaklık kavramları her şeyin temelidir. Matematik ÖABT'sinde **18 soruyla** en büyük paya sahiptir. Sorular hem doğrudan hesap (limit, türev, integral, seri toplamı) hem de bir tanımın ya da teoremin hangi koşulda geçerli olduğunu sorar; çok değişkenli analiz ve karmaşık fonksiyonlardan da soru gelebilir.

## Gerçel sayılar ve diziler

- **Tamlık aksiyomu:** ℝ'nin üstten sınırlı ve boş olmayan her alt kümesinin bir **supremumu** (en küçük üst sınırı) vardır. ℚ bu özelliğe sahip değildir.
- **Cauchy dizisi:** ∀ε > 0 için öyle bir N vardır ki m, n > N ⇒ |aₘ − aₙ| < ε. ℝ'de bir dizi ancak ve ancak Cauchy ise yakınsar.
- **Bolzano-Weierstrass:** ℝ'deki her sınırlı dizinin yakınsak bir alt dizisi vardır.
- **ε-δ limiti:** lim x→a f(x) = L ⇔ ∀ε > 0 ∃δ > 0: 0 < |x − a| < δ ⇒ |f(x) − L| < ε.

## Süreklilik ve türev

- **Düzgün süreklilik:** δ yalnızca ε'a bağlıdır, noktaya bağlı değildir. Kapalı ve sınırlı bir aralıkta sürekli her fonksiyon düzgün süreklidir; f(x) = 1/x ise (0, 1) aralığında sürekli ama düzgün sürekli değildir.
- **Taylor açılımı:** f(x) ≈ Σ f⁽ᵏ⁾(a)·(x − a)ᵏ/k!. Önemli seriler: eˣ = Σ xⁿ/n!, sin x = x − x³/3! + x⁵/5! − …, 1/(1 − x) = Σ xⁿ (|x| < 1).
- **Ortalama değer teoremi** ve L'Hôpital kuralı belirsiz limitlerde temel araçlardır; L'Hôpital'i uygulamadan önce belirsizliğin 0/0 ya da ∞/∞ olduğunu doğrula.

## İntegral ve seriler

- **Riemann integrali:** Alt ve üst toplamların ortak limiti. Kapalı aralıkta sürekli (hatta sonlu sayıda süreksizliği olan sınırlı) her fonksiyon integrallenebilirdir.
- **Genelleştirilmiş integral:** ∫₁^∞ 1/xᵖ dx, p > 1 için yakınsak; ∫₀¹ 1/xᵖ dx, p < 1 için yakınsaktır.
- **Kuvvet serisi:** Σ cₙ(x − a)ⁿ için yakınsaklık yarıçapı R; |x − a| < R'de mutlak yakınsar, |x − a| > R'de ıraksar, uç noktalar ayrıca incelenir. Oran testinden 1/R = lim |cₙ₊₁/cₙ| (limit varsa).
- **Mutlak yakınsaklık** yakınsaklığı gerektirir; Σ (−1)ⁿ⁺¹/n yakınsak ama mutlak yakınsak değildir (**koşullu** yakınsak).

## Çok değişkenli ve karmaşık analiz

- **Kısmi türev ve gradyan:** ∇f = (∂f/∂x, ∂f/∂y); gradyan en hızlı artış yönünü gösterir. u birim vektör yönündeki türev ∇f · u'dur.
- **Ekstremum:** Kritik noktada D = f_xx·f_yy − (f_xy)². D > 0 ve f_xx > 0 ise yerel minimum, D > 0 ve f_xx < 0 ise yerel maksimum, D < 0 ise eyer noktası.
- **Kutupsal koordinatlar:** Çift katlı integralde dx dy = r dr dθ; buradaki r çarpanı dönüşümün **Jacobian** determinantıdır.
- **Karmaşık türev:** f = u + iv'nin türevlenebilmesi için **Cauchy-Riemann** denklemleri gerekir: ∂u/∂x = ∂v/∂y ve ∂u/∂y = −∂v/∂x.

## Sık karıştırılanlar

- *Süreklilikte* δ hem ε'a hem noktaya bağlı olabilir; *düzgün süreklilikte* tüm noktalar için aynı δ çalışmalıdır.
- *Mutlak* yakınsak bir serinin terimleri yeniden düzenlense de toplam değişmez; *koşullu* yakınsak serilerde bu garanti yoktur.
- *Supremum* kümenin elemanı olmak zorunda değildir; *maksimum* ise kümenin elemanıdır.

## Çalışma ipucu

Her tanımı nicelik belirteçleriyle (∀, ∃) yazmayı alıştırma hâline getir ve karşı örneklerden bir liste tut (1/x, sin(1/x), (−1)ⁿ). Kuramsal soruların çoğu bu kısa listedeki bir örnekle çürütülür.
