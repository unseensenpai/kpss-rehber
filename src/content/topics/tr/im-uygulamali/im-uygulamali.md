---
title: "Uygulamalı Matematik"
subject: im-uygulamali
state: draft
subtopics:
  - Sayma ilkeleri, permütasyon ve kombinasyon
  - Binom açılımı ve güvercin yuvası ilkesi
  - Olasılık ve koşullu olasılık
  - Rastgele değişkenler ve beklenen değer
  - Betimsel istatistik
  - Mantık ve çizge kuramı
keyConcepts: [toplama ve çarpma ilkesi, permütasyon, kombinasyon, güvercin yuvası ilkesi, içerme-dışarma ilkesi, Pascal üçgeni, koşullu olasılık, bağımsız olay, Bayes kuralı, beklenen değer, varyans, standart sapma, çizge, Euler devresi]
questionStyle: "Bir sayma ya da olasılık problemini çözme; bir veri kümesinin merkezi eğilim ve yayılım ölçülerini yorumlama; bir çizgenin ya da önermenin özelliğini belirleme"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: meb-ags-2026
updated: 2026-10-28
---

## Temel fikir

Uygulamalı Matematik bu sınavda üç parçadan oluşur: **olasılık**, **istatistik** ve **ayrık matematik** (sayma, mantık, çizgeler). İlköğretim Matematik ÖABT'sinde **8 soru** çıkar. Sorular çoğunlukla bir sayma ya da olasılık problemini çözdürür, bir veri kümesini yorumlatır ya da bir çizgenin özelliğini sorar. Ortaokulda öğreteceğin veri analizi ve olasılık ünitelerinin üniversite düzeyindeki dayanağı bu alandır.

## Sayma

- **Çarpma ilkesi:** Ardışık ve bağımsız seçimlerde seçenek sayıları çarpılır; ayrık durumlar ise toplanır.
- **Permütasyon (sıralı):** P(n, r) = n!/(n − r)!. Tekrarlı elemanlarda n!/(n₁!·n₂!·…); dairesel sıralamada (n − 1)!.
- **Kombinasyon (sırasız):** C(n, r) = n!/(r!·(n − r)!). Tekrarlı seçimde C(n + r − 1, r).
- **Binom açılımı:** (a + b)ⁿ = Σ C(n, k)·aⁿ⁻ᵏ·bᵏ; katsayılar toplamı 2ⁿ. **Pascal kuralı:** C(n, r) = C(n − 1, r − 1) + C(n − 1, r).
- **Güvercin yuvası ilkesi:** n + 1 nesne n kutuya konursa bir kutuda en az iki nesne olur.
- **İçerme-dışarma:** |A ∪ B| = |A| + |B| − |A ∩ B|.

## Olasılık

- **Klasik tanım:** Eş olasılıklı örnek uzayda P(A) = istenen durum sayısı / tüm durum sayısı.
- **Birleşim:** P(A ∪ B) = P(A) + P(B) − P(A ∩ B); tümleyen P(A') = 1 − P(A).
- **Koşullu olasılık:** P(A | B) = P(A ∩ B)/P(B). A ve B **bağımsız** ise P(A ∩ B) = P(A)·P(B).
- **Bayes kuralı:** P(A | B) = P(B | A)·P(A)/P(B); "sonuçtan nedene" giden sorularda kullanılır.
- **Beklenen değer ve varyans:** E(X) = Σ x·P(X = x), Var(X) = E(X²) − [E(X)]². Binom dağılımında E(X) = np, Var(X) = np(1 − p).

## İstatistik

- **Merkezi eğilim:** Aritmetik ortalama, ortanca (sıralı verinin ortası), tepe değer (en sık değer). Uç değerler ortalamayı etkiler, ortancayı az etkiler.
- **Yayılım:** Açıklık, varyans, standart sapma. Her veriye sabit eklemek ortalamayı kaydırır, standart sapmayı değiştirmez; her veriyi k ile çarpmak standart sapmayı |k| katına çıkarır.
- **Normal dağılım:** Verilerin yaklaşık %68'i ortalamanın bir, %95'i iki, %99,7'si üç standart sapma yakınındadır.

## Mantık ve çizgeler

- **Önermeler:** p ⇒ q ≡ ¬p ∨ q; bir koşullu önerme **karşıt tersine** (¬q ⇒ ¬p) denktir. De Morgan: ¬(p ∧ q) ≡ ¬p ∨ ¬q.
- **El sıkışma teoremi:** Bir çizgede köşe dereceleri toplamı kenar sayısının iki katıdır; tek dereceli köşe sayısı bu yüzden çifttir.
- **Euler devresi:** Bağlantılı bir çizgede ancak ve ancak tüm dereceler çiftse vardır. n köşeli **ağacın** n − 1 kenarı, tam çizge Kₙ'nin n(n − 1)/2 kenarı vardır.

## Sık karıştırılanlar

- *Permütasyonda* sıra önemlidir, *kombinasyonda* önemli değildir.
- *Bağımsız* olaylarda P(A ∩ B) = P(A)·P(B); *ayrık* olaylarda P(A ∩ B) = 0'dır. Olasılığı pozitif iki ayrık olay bağımsız olamaz.
- Bir önermenin *karşıt tersi* ona denktir; *karşıtı* (q ⇒ p) ve *tersi* (¬p ⇒ ¬q) denk değildir.

## Çalışma ipucu

Sayma sorularında önce "sıra önemli mi, tekrar var mı?" diye sor; bu iki cevap formülü seçer. Olasılıkta karmaşık durumlarda tümleyeni hesaplamak çoğu zaman daha kısadır.
