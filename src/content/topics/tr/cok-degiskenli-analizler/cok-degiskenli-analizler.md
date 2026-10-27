---
title: "Çok Değişkenli Analizler"
subject: cok-degiskenli-analizler
state: draft
subtopics:
  - Ortalama vektörü, kovaryans ve korelasyon matrisi
  - Çok değişkenli normal dağılım ve Mahalanobis uzaklığı
  - Hotelling T² ve MANOVA
  - Temel bileşenler analizi
  - Faktör analizi
  - Diskriminant analizi
  - Kümeleme analizi
keyConcepts: [kovaryans matrisi, özdeğer, Mahalanobis uzaklığı, Hotelling T², Wilks lambda, temel bileşen, açıklanan varyans, Kaiser ölçütü, faktör yükü, ortak varyans, varimax döndürme, KMO, Bartlett küresellik testi, diskriminant fonksiyonu, k-ortalamalar, dendrogram]
questionStyle: "Verilen araştırma amacına uygun çok değişkenli yöntemi seçme; özdeğerlerden açıklanan varyans oranını hesaplama; faktör ve kümeleme çıktılarını yorumlama"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: kpss-lisans-2026
updated: 2026-10-28
---

## Temel fikir

Çok değişkenli analizler, birden çok değişkeni birlikte ele alır ve aralarındaki ilişki yapısını kullanır. Yöntemler iki aileye ayrılır: **bağımlılık yöntemleri** (bağımlı ve bağımsız değişken ayrımı var: MANOVA, diskriminant analizi, kanonik korelasyon) ve **karşılıklı bağımlılık yöntemleri** (ayrım yok: temel bileşenler, faktör ve kümeleme analizi). Testte **4 soru** vardır; sorular çoğunlukla bir amaca uygun yöntemi seçtirir ya da bir çıktıyı yorumlatır.

## Temel yapılar ve testler

- **Kovaryans matrisi Σ:** Simetriktir; köşegeninde varyanslar bulunur. **Korelasyon matrisinin** köşegeni 1'dir; değişkenler farklı birimlerle ölçüldüğünde tercih edilir.
- **Mahalanobis uzaklığı:** D² = (x − μ)ᵀ Σ⁻¹ (x − μ); ölçek farklarını ve değişkenler arası korelasyonu hesaba katar, çok değişkenli aykırı değerleri bulmada kullanılır.
- **Hotelling T²:** t testinin çok değişkenli karşılığıdır; ortalama vektörlerini karşılaştırır.
- **MANOVA:** Birden çok bağımlı değişkende grup farkını aynı anda test eder; **Wilks lambda** küçüldükçe gruplar arası fark büyür.

## Boyut indirgeme

- **Temel bileşenler analizi:** Değişkenlerin ilişkisiz doğrusal bileşimlerini üretir. Bileşenlerin varyansları kovaryans (ya da korelasyon) matrisinin **özdeğerleridir**; k. bileşenin açıkladığı oran λₖ / ∑λᵢ'dir. Korelasyon matrisinde özdeğerlerin toplamı değişken sayısına eşittir.
- **Kaç bileşen?** Özdeğeri 1'den büyük olanları alma (**Kaiser ölçütü**), yamaç grafiği ya da hedeflenen birikimli varyans oranı.
- **Faktör analizi:** Gözlenen değişkenlerin ortak varyansını az sayıda gizil faktörle açıklar. **Faktör yükü** değişken ile faktör arasındaki ilişkiyi, **ortak varyans** (communality) bir değişkenin faktörlerce açıklanan kısmını gösterir.
- **Uygunluk:** KMO değeri yüksek olmalı, **Bartlett küresellik testi** anlamlı çıkmalıdır (korelasyon matrisi birim matris değildir).
- **Döndürme:** Varimax dik döndürmedir (faktörler ilişkisiz kalır); oblimin ve promax eğik döndürmedir (faktörler ilişkili olabilir).

## Sınıflandırma ve gruplama

- **Diskriminant analizi:** Grupları önceden bilinen birimleri en iyi ayıran doğrusal fonksiyonu kurar ve yeni birimleri gruplara atar.
- **Kümeleme analizi:** Gruplar önceden bilinmez; benzer birimler bir araya getirilir. **Hiyerarşik** yöntemler (tek, tam, ortalama bağlantı, Ward) sonucu **dendrogramla** gösterir; **k-ortalamalar** küme sayısının önceden verildiği hiyerarşik olmayan yöntemdir.
- **Kanonik korelasyon:** İki değişken kümesi arasındaki en yüksek doğrusal ilişkiyi arar.

## Sık karıştırılanlar

- *Temel bileşenler* toplam varyansı özetler; *faktör analizi* ortak varyansı gizil yapılarla açıklar.
- *Diskriminant analizinde* gruplar önceden bilinir; *kümeleme analizinde* gruplar veriden çıkarılır.
- *Dik döndürme* faktörleri ilişkisiz tutar; *eğik döndürme* faktörler arası korelasyona izin verir.

## Çalışma ipucu

Her yöntem için "amaç, girdi, temel çıktı" üçlüsünü tek satırda yaz. Yöntem seçme sorularında önce bağımlı değişken olup olmadığına, sonra grupların önceden bilinip bilinmediğine bak.
