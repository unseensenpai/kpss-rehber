---
title: "Uygulamalı İstatistik"
subject: uygulamali-istatistik
state: draft
subtopics:
  - Ölçme düzeyleri ve veri türleri
  - Merkezi eğilim ölçüleri
  - Değişkenlik ve şekil ölçüleri
  - Standart puanlar ve normal dağılım uygulamaları
  - Güven aralıkları ve temel hipotez testleri
  - Korelasyon
  - İndeks sayıları
keyConcepts: [sınıflama ölçeği, sıralama ölçeği, aralık ölçeği, oran ölçeği, aritmetik ortalama, medyan, mod, standart sapma, değişim katsayısı, çeyrekler açıklığı, çarpıklık, basıklık, z puanı, güven aralığı, t testi, Laspeyres indeksi]
questionStyle: "Küçük bir veri setinde ortalama, medyan, standart sapma ya da değişim katsayısı hesaplama; çarpıklığı yorumlama; duruma uygun testi seçip sonucu yorumlama"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: kpss-lisans-2026
updated: 2026-10-28
---

## Temel fikir

Uygulamalı istatistik, veriyi özetleme, görselleştirme ve temel çıkarım araçlarını gerçek problemlere uygular. Testte **6 soru** ile en ağırlıklı derslerden biridir. Sorular genellikle küçük bir veri setinde hesap ister (ortalama, medyan, standart sapma, değişim katsayısı, z puanı) ya da bir araştırma durumuna uygun ölçeği ve testi seçtirir.

## Ölçme ve merkezi eğilim

- **Ölçme düzeyleri:** **Sınıflama** (cinsiyet), **sıralama** (eğitim düzeyi), **aralık** (°C cinsinden sıcaklık; sıfır noktası keyfi), **oran** (gelir, boy; gerçek sıfır vardır, oran kurulabilir).
- **Ortalama** uç değerlerden etkilenir; **medyan** ve **mod** daha dirençlidir. Sınıflama ölçeğinde yalnızca mod anlamlıdır.
- Pozitif verilerde **aritmetik ≥ geometrik ≥ harmonik** ortalama. Büyüme oranlarının ortalamasında geometrik, hızların ortalamasında harmonik ortalama kullanılır.

## Değişkenlik ve şekil

- **Varyans:** s² = ∑(xᵢ − x̄)²/(n − 1); **standart sapma** s = √s².
- **Değişim katsayısı:** DK = (s / x̄) × 100; birimleri ya da ortalamaları farklı serilerin değişkenliğini karşılaştırır.
- **Çeyrekler açıklığı:** Q₃ − Q₁; kutu grafiğinin temelidir, aykırı değerlerden az etkilenir.
- **Doğrusal dönüşüm:** Y = aX + b ise ȳ = a·x̄ + b ve s_Y = |a|·s_X; her değere sabit eklemek yayılımı değiştirmez.
- **Çarpıklık:** Sağa (pozitif) çarpık dağılımda genellikle mod < medyan < ortalama; sola çarpıkta sıralama tersine döner. **Basıklık**, dağılımın tepe ve kuyruk yapısını normal dağılımla karşılaştırır.

## Standart puan ve çıkarım

- **z puanı:** z = (x − x̄)/s; farklı ölçeklerdeki puanları karşılaştırır.
- **Normal dağılım kuralı:** Değerlerin yaklaşık %68'i μ ± σ, %95'i μ ± 2σ, %99,7'si μ ± 3σ içindedir.
- **Ortalama için güven aralığı:** σ biliniyorsa x̄ ± z(α/2)·σ/√n; bilinmiyorsa ve anakütle normalse z yerine t(n − 1) ve s kullanılır.
- **Test seçimi:** Tek örnek t, bağımsız iki örnek t, eşleştirilmiş t, oran için z testi, kategorik değişkenler için ki-kare.
- **Pearson korelasyonu** r, −1 ile 1 arasında doğrusal ilişkinin yönünü ve gücünü ölçer; nedensellik göstermez.

## İndeks sayıları

- **Laspeyres** ağırlık olarak **temel dönem** miktarlarını, **Paasche** **cari dönem** miktarlarını kullanır; **Fisher** indeksi ikisinin geometrik ortalamasıdır.

## Sık karıştırılanlar

- *Standart sapma* mutlak yayılımı, *değişim katsayısı* ortalamaya göre göreli yayılımı ölçer.
- *Aralık ölçeğinde* oran kurulamaz (20 °C, 10 °C'nin iki katı sıcak değildir); *oran ölçeğinde* kurulabilir.
- *Bağımsız örneklem t testi* farklı kişileri, *eşleştirilmiş t testi* aynı kişilerin iki ölçümünü karşılaştırır.

## Çalışma ipucu

Beş altı sayılık küçük veri setleriyle ortalama, medyan, standart sapma ve değişim katsayısını elle hesaplamayı alışkanlık hâline getir; bu derste hız, kavram kadar puan kazandırır.
