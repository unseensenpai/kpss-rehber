---
title: "Cebir"
subject: mat-cebir
state: draft
subtopics:
  - Vektör uzayları, taban ve boyut
  - Lineer dönüşümler ve matris temsili
  - Özdeğer, özvektör ve köşegenleştirme
  - Gruplar, alt gruplar ve homomorfizmalar
  - Halkalar, idealler ve cisimler
  - Sayılar teorisi ve kongrüanslar
keyConcepts: [lineer bağımsızlık, taban, boyut, çekirdek, görüntü, rank-sıfırlık teoremi, köşegenleştirme, Cayley-Hamilton teoremi, normal alt grup, homomorfizma, izomorfizma, ideal, tamlık bölgesi, Çin kalan teoremi]
questionStyle: "Bir lineer dönüşümün çekirdeğini, rankını ya da özdeğerlerini bulma; bir cebirsel yapının grup, halka ya da cisim olup olmadığını belirleme; kongrüans sistemlerini çözme"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: meb-ags-2026
updated: 2026-10-28
---

## Temel fikir

Lise öğretmenliği düzeyindeki Cebir üç dala ayrılır: **lineer cebir**, **soyut cebir** ve **sayılar teorisi**. Ortak düşünce, nesneleri tek tek değil **yapı ve yapıyı koruyan dönüşümler** üzerinden incelemektir. Matematik ÖABT'sinde **12 soru** çıkar. Sorular çoğunlukla bir matrisin rankını ya da özdeğerlerini buldurur, bir kümenin verilen işlemlerle hangi yapıyı oluşturduğunu sorar ya da bir kongrüans sistemini çözdürür.

## Lineer cebir

- **Taban:** Uzayı geren, lineer bağımsız küme; tabandaki eleman sayısı **boyuttur**. ℝⁿ'de n'den fazla vektör daima lineer bağımlıdır.
- **Lineer dönüşüm:** T(au + bv) = aT(u) + bT(v). **Çekirdek** T(v) = 0 olan vektörler, **görüntü** T'nin aldığı değerlerdir. T birebir ⇔ çekirdek yalnızca sıfır vektörüdür.
- **Rank-sıfırlık teoremi:** T: V → W için dim V = dim(çekirdek) + dim(görüntü).
- **Özdeğer ve köşegenleştirme:** Av = λv. n×n bir matrisin n tane lineer bağımsız özvektörü varsa A = PDP⁻¹ biçiminde köşegenleştirilir; n farklı özdeğer bunun için yeterlidir. Gerçel simetrik matrisler her zaman köşegenleştirilebilir.
- **Cayley-Hamilton:** Her kare matris kendi karakteristik polinomunu sağlar; bu, Aⁿ ya da A⁻¹'i daha düşük kuvvetlerle yazmanı sağlar.

## Soyut cebir

- **Alt grup ve mertebe:** Sonlu grupta alt grubun mertebesi grubun mertebesini böler (Lagrange). Bir elemanın mertebesi aᵏ = e olan en küçük pozitif k'dir.
- **Devirli gruplar:** ℤₙ'de k elemanı ancak EBOB(k, n) = 1 ise üreteçtir; bu yüzden ℤₙ'nin φ(n) üreteci vardır.
- **Normal alt grup:** Her g için gNg⁻¹ = N. Bölüm grubu G/N yalnızca N normal olduğunda tanımlıdır; değişmeli grupta her alt grup normaldir.
- **Homomorfizma:** f(ab) = f(a)f(b). Çekirdeği daima normal alt gruptur ve **birinci izomorfizma teoremi** G/çek(f) ≅ görüntü(f) der.
- **Halka ve cisim:** Sıfır bölensiz değişmeli birimli halka **tamlık bölgesidir** (ℤ gibi). ℤₙ ancak ve ancak n asal ise cisimdir. Sonlu her tamlık bölgesi cisimdir.
- **İdeal:** Toplamaya göre alt grup olan ve halkanın elemanlarıyla çarpıma karşı kapalı alt küme; ℤ'nin idealleri nℤ biçimindedir.

## Sayılar teorisi

- **Çin kalan teoremi:** Modülleri ikişer ikişer aralarında asal olan x ≡ aᵢ (mod mᵢ) sisteminin, modüllerin çarpımına göre tek bir çözümü vardır.
- **Wilson teoremi:** p asal ⇔ (p − 1)! ≡ −1 (mod p).
- **Euler teoremi:** EBOB(a, n) = 1 ise a^φ(n) ≡ 1 (mod n); n = pᵏ için φ(n) = pᵏ − pᵏ⁻¹, aralarında asal m, n için φ(mn) = φ(m)·φ(n).

## Sık karıştırılanlar

- *Homomorfizma* yapıyı korur; *izomorfizma* buna ek olarak birebir ve örtendir.
- *Tamlık bölgesi* sıfır bölensizdir ama her elemanın tersi olmayabilir (ℤ); *cisimde* sıfırdan farklı her elemanın çarpma tersi vardır (ℚ, ℤₚ).
- *Lineer bağımsızlık* vektörlerin birbirinden üretilemediğini, *germe* ise uzayın tamamını ürettiklerini söyler; taban ikisini birden sağlar.

## Çalışma ipucu

Soyut cebirde her tanım için hazır bir örnek ve karşı örnek tut (ℤ, ℤ₆, S₃, 2×2 matrisler). S₃ değişmeli olmayan en küçük grup olduğundan normal olmayan alt grup sorularında ilk bakacağın yer orasıdır.
