---
title: "Olasılık ve Stokastik Süreçler"
subject: olasilik-stokastik-surecler
state: draft
subtopics:
  - Olasılık aksiyomları, koşullu olasılık ve Bayes teoremi
  - Rastgele değişkenler, beklenen değer ve varyans
  - Kesikli ve sürekli dağılımlar
  - Ortak dağılımlar, kovaryans ve bağımsızlık
  - Limit teoremleri (büyük sayılar yasası, merkezi limit teoremi)
  - Markov zincirleri
  - Poisson süreci ve rastgele yürüyüş
keyConcepts: [koşullu olasılık, Bayes teoremi, bağımsızlık, beklenen değer, varyans, kovaryans, binom dağılımı, Poisson dağılımı, üstel dağılım, normal dağılım, Chebyshev eşitsizliği, merkezi limit teoremi, Markov zinciri, geçiş matrisi, durağan dağılım, Poisson süreci]
questionStyle: "Koşullu olasılık ve Bayes hesapları; bir dağılımın beklenen değer ve varyansını bulma; Markov zincirinde n adımlık geçiş ya da durağan dağılım hesaplama"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: kpss-lisans-2026
updated: 2026-10-28
---

## Temel fikir

Olasılık, belirsiz sonuçları sayılarla modellemenin dilidir; stokastik süreçler ise bu belirsizliğin zaman içinde nasıl ilerlediğini inceler. Bu ders testte **6 soru** ile en ağırlıklı derslerden biridir. Sorular çoğunlukla kısa bir hesap ister: koşullu olasılık, bir dağılımın beklenen değeri ya da varyansı, bir Markov zincirinde belirli sayıda adım sonra bir durumda olma olasılığı.

## Temel kurallar

- **Aksiyomlar:** 0 ≤ P(A) ≤ 1, P(Ω) = 1; ayrık olaylarda P(A ∪ B) = P(A) + P(B).
- **Toplama kuralı:** P(A ∪ B) = P(A) + P(B) − P(A ∩ B).
- **Koşullu olasılık:** P(A | B) = P(A ∩ B) / P(B), P(B) > 0.
- **Bağımsızlık:** P(A ∩ B) = P(A)·P(B). Olasılıkları sıfırdan büyük iki ayrık olay bağımsız olamaz.
- **Bayes teoremi:** P(Bᵢ | A) = P(A | Bᵢ)P(Bᵢ) / ∑ P(A | Bⱼ)P(Bⱼ); payda toplam olasılık kuralıdır.

## Rastgele değişkenler ve dağılımlar

- **Beklenen değer ve varyans:** E(aX + b) = aE(X) + b, Var(aX + b) = a²Var(X), Var(X) = E(X²) − [E(X)]².
- **Kovaryans:** Cov(X, Y) = E(XY) − E(X)E(Y); Var(X + Y) = Var(X) + Var(Y) + 2Cov(X, Y). Bağımsızlık kovaryansı sıfır yapar, ama sıfır kovaryans bağımsızlık demek değildir.
- **Binom (n, p):** ortalama np, varyans np(1 − p).
- **Poisson (λ):** ortalama ve varyans ikisi de λ.
- **Geometrik:** ilk başarıya kadar yapılan deneme sayısı; ortalama 1/p.
- **Düzgün (a, b):** ortalama (a + b)/2, varyans (b − a)²/12.
- **Üstel (λ):** ortalama 1/λ, varyans 1/λ²; **belleksizdir**: P(X > s + t | X > s) = P(X > t).
- **Normal:** Z = (X − μ)/σ ile standart normale dönüştürülür.

## Limit teoremleri

- **Chebyshev eşitsizliği:** P(|X − μ| ≥ kσ) ≤ 1/k²; dağılım bilinmese de geçerlidir.
- **Büyük sayılar yasası:** n büyüdükçe örnek ortalaması μ'ye yakınsar.
- **Merkezi limit teoremi:** Sonlu varyanslı, bağımsız ve aynı dağılımlı değişkenlerin ortalaması, n büyüdükçe yaklaşık N(μ, σ²/n) dağılır.

## Stokastik süreçler

- **Markov özelliği:** Gelecek yalnızca şimdiki duruma bağlıdır; geçmiş ek bilgi vermez.
- **Geçiş matrisi P:** Her satırın toplamı 1'dir; n adımlık geçiş olasılıkları Pⁿ ile bulunur (Chapman–Kolmogorov).
- **Durağan dağılım π:** πP = π ve bileşenlerin toplamı 1 denklemlerinden çözülür.
- **Poisson süreci (λ):** (0, t] aralığındaki olay sayısı Poisson(λt) dağılır; olaylar arası süreler bağımsız ve üstel(λ) dağılır.
- **Rastgele yürüyüş:** Her adımda bağımsız artışlarla ilerleyen süreç.

## Sık karıştırılanlar

- *Ayrık olaylar* aynı anda gerçekleşemez; *bağımsız olaylar* birbirinin olasılığını değiştirmez.
- *Sıfır kovaryans* yalnızca doğrusal ilişkinin yokluğudur; *bağımsızlık* çok daha güçlü bir koşuldur.
- *Poisson dağılımı* bir aralıktaki olay sayısını, *üstel dağılım* iki olay arasındaki süreyi modeller.

## Çalışma ipucu

Dağılımların ortalama ve varyanslarını tek bir tabloya yaz ve ezberle; soruların çoğu bu değerlerle bir iki adımda çözülür. Markov sorularında önce matrisin satır toplamlarını kontrol et, sonra πP = π denklemlerini kur.
