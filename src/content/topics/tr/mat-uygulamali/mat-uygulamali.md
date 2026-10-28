---
title: "Uygulamalı Matematik"
subject: mat-uygulamali
state: draft
subtopics:
  - Birinci mertebe diferansiyel denklemler
  - Sabit katsayılı lineer denklemler ve Laplace dönüşümü
  - Rastgele değişkenler ve olasılık dağılımları
  - Beklenen değer, varyans ve merkezi limit teoremi
  - Denklemlerin sayısal çözümü
  - Sayısal integral ve sayısal diferansiyel denklem çözümü
keyConcepts: [ayrılabilir denklem, integrasyon çarpanı, tam diferansiyel denklem, karakteristik denklem, Wronskian, Laplace dönüşümü, olasılık yoğunluk fonksiyonu, Poisson dağılımı, normal dağılım, merkezi limit teoremi, ikiye bölme yöntemi, Newton-Raphson yöntemi, Simpson kuralı, Euler yöntemi]
questionStyle: "Bir diferansiyel denklemin türünü belirleyip genel çözümünü bulma; bir dağılımın beklenen değer ve varyansını hesaplama; bir sayısal yöntemin bir adımını uygulama"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: meb-ags-2026
updated: 2026-10-28
---

## Temel fikir

Bu alan, matematiğin **modelleme ve hesaplama** yüzüdür: Değişimi diferansiyel denklemlerle, belirsizliği olasılık ve istatistikle, tam çözülemeyen problemleri sayısal yöntemlerle ele alır. Matematik ÖABT'sinde **10 soru** çıkar. Diferansiyel denklem sorularında önce **denklemin türünü tanımak** belirleyicidir; olasılıkta bir dağılımın parametreleri, sayısal yöntemlerde ise bir algoritmanın tek bir adımı sorulur.

## Diferansiyel denklemler

- **Ayrılabilir:** dy/dx = g(x)·h(y) ise dy/h(y) = g(x) dx yazılıp iki taraf integrallenir.
- **Birinci mertebe lineer:** y' + P(x)y = Q(x). **İntegrasyon çarpanı** μ = e^(∫P dx) ile (μy)' = μQ olur.
- **Tam denklem:** M dx + N dy = 0, ∂M/∂y = ∂N/∂x ise tamdır; çözüm F(x, y) = C biçimindedir.
- **Bernoulli:** y' + Py = Qyⁿ denklemi v = y¹⁻ⁿ dönüşümüyle lineer hâle gelir.
- **Sabit katsayılı homojen:** ay'' + by' + cy = 0 için ar² + br + c = 0 karakteristik denklemi çözülür. Farklı gerçel kökler: C₁e^(r₁x) + C₂e^(r₂x); çift kök r: (C₁ + C₂x)e^(rx); karmaşık kökler α ± βi: e^(αx)(C₁cos βx + C₂sin βx).
- **Wronskian** bir aralıkta sıfırdan farklıysa çözümler lineer bağımsızdır.
- **Laplace dönüşümü:** L{1} = 1/s, L{e^(at)} = 1/(s − a), L{y'} = sY(s) − y(0); başlangıç değer problemlerini cebirsel denkleme çevirir.

## Olasılık ve istatistik

- **Sürekli rastgele değişken:** Yoğunluk fonksiyonu f ≥ 0 ve tüm doğru üzerinde integrali 1'dir; P(a ≤ X ≤ b) = ∫ₐᵇ f(x) dx.
- **Doğrusal dönüşüm:** E(aX + b) = aE(X) + b, Var(aX + b) = a²·Var(X).
- **Dağılımlar:** Poisson(λ) için beklenen değer ve varyans λ'dır. [a, b] üzerinde düzgün dağılımda E = (a + b)/2, Var = (b − a)²/12. Üstel dağılımda (oran λ) E = 1/λ.
- **Normal dağılım:** Z = (X − μ)/σ ile standart normale çevrilir.
- **Merkezi limit teoremi:** Büyük örneklemlerde örneklem ortalaması, ana kütle dağılımı ne olursa olsun yaklaşık normaldir; ortalaması μ, standart sapması σ/√n'dir.
- **Hipotez testi:** Doğru olan H₀'ı reddetmek **I. tip hata**, yanlış olan H₀'ı kabul etmek II. tip hatadır.

## Sayısal yöntemler

- **İkiye bölme:** f(a)·f(b) < 0 olan aralık her adımda yarıya indirilir; yavaş ama kesin yakınsar.
- **Newton-Raphson:** xₙ₊₁ = xₙ − f(xₙ)/f'(xₙ). Basit köke yakın başlanırsa ikinci mertebeden (hızlı) yakınsar; f'(xₙ) = 0 olursa çöker.
- **Yamuk kuralı:** ∫ₐᵇ f dx ≈ (h/2)[f₀ + 2f₁ + … + 2fₙ₋₁ + fₙ].
- **Simpson kuralı:** n çift olmak üzere ≈ (h/3)[f₀ + 4f₁ + 2f₂ + … + 4fₙ₋₁ + fₙ]; üçüncü dereceye kadar polinomlar için tam sonuç verir.
- **Euler yöntemi:** y' = f(x, y) için yₙ₊₁ = yₙ + h·f(xₙ, yₙ).

## Sık karıştırılanlar

- *Lineer* denklemde y ve türevleri birinci kuvvettedir; *homojen* sözcüğü ise ya sağ tarafın sıfır olduğunu ya da f(tx, ty) = f(x, y) özelliğini anlatır. Bağlama dikkat et.
- *Poisson* dağılımında beklenen değer ile varyans eşittir; *binom* dağılımında varyans np(1 − p) olup beklenen değerden küçüktür.
- *Yamuk* kuralı eğriyi doğru parçalarıyla, *Simpson* kuralı parabollerle yaklaşıklar.

## Çalışma ipucu

Diferansiyel denklem sorusunda çözmeye başlamadan önce türünü (ayrılabilir, lineer, tam, Bernoulli, sabit katsayılı) belirle; tür doğru tanınınca yöntem kendiliğinden gelir.
