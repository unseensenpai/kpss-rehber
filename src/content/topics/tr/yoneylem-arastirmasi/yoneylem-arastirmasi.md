---
title: "Yöneylem Araştırması"
subject: yoneylem-arastirmasi
state: draft
subtopics:
  - Doğrusal programlama modeli ve grafik çözüm
  - Simpleks yöntemi
  - Dualite ve duyarlılık analizi
  - Ulaştırma ve atama problemleri
  - Proje planlama (CPM ve PERT)
  - Kuyruk teorisi ve oyun teorisi
keyConcepts: [amaç fonksiyonu, kısıt, uygun çözüm bölgesi, köşe nokta, simpleks yöntemi, aylak değişken, artık değişken, yapay değişken, dual problem, gölge fiyat, kuzeybatı köşe yöntemi, Vogel yaklaşımı, Macar yöntemi, kritik yol, PERT, Little formülü]
questionStyle: "Küçük bir doğrusal programlama modelini kurup köşe noktalarda çözme; primal-dual ilişkisini yorumlama; kritik yol ya da ulaştırma tablosu sorusu"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: kpss-lisans-2026
updated: 2026-10-28
---

## Temel fikir

Yöneylem araştırması, sınırlı kaynaklarla en iyi kararı veren matematiksel modeller kurar. Merkezinde doğrusal programlama (DP) vardır: Doğrusal bir amaç fonksiyonu, doğrusal kısıtlar altında en büyüklenir ya da en küçüklenir. Testte yalnızca **2 soru** vardır; sorular çoğunlukla küçük bir DP modelini çözdürür, dual problemi sorar ya da bir proje ağında kritik yolu buldurur.

## Doğrusal programlama

- **Model:** Karar değişkenleri, amaç fonksiyonu, kısıtlar ve negatif olmama koşulu.
- **Grafik çözüm:** İki değişkenli modelde uygun bölge çizilir; en iyi çözüm (varsa) bir **köşe noktasında** bulunur.
- **Özel durumlar:** Uygun çözüm yok, sınırsız çözüm, alternatif en iyi çözümler, bozulma (dejenerasyon).
- **Simpleks yöntemi:** Bir köşeden komşu köşeye geçerek amaç değerini iyileştirir. ≤ kısıtına **aylak**, ≥ kısıtına **artık** ve **yapay** değişken eklenir; yapay değişkenler Büyük M ya da iki aşamalı yöntemle çözümden çıkarılır.

## Dualite ve duyarlılık

- Her primal problemin bir **duali** vardır: en büyükleme ↔ en küçükleme, kısıtlar ↔ değişkenler, sağ taraf değerleri ↔ amaç katsayıları.
- **Zayıf dualite:** En büyükleme probleminin herhangi bir uygun çözümündeki amaç değeri, dualin (en küçükleme) herhangi bir uygun değerini aşamaz. **Güçlü dualite:** İki problemin en iyi değerleri eşittir.
- **Gölge fiyat:** Bir kaynağın bir birim artmasının amaç değerine katkısı; ilgili dual değişkenin değeridir.

## Ulaştırma ve atama

- **Dengeli problem:** Toplam arz = toplam talep; değilse yapay bir kaynak ya da hedef eklenir.
- m kaynak ve n hedefli problemin temel çözümünde **m + n − 1** temel değişken bulunur.
- **Başlangıç çözümü:** Kuzeybatı köşe, en küçük maliyet ve **Vogel** yöntemi (genellikle en iyiye en yakın başlangıcı verir).
- **Atama problemi:** Birebir eşleştirme; **Macar yöntemi** ile çözülür.

## Ağlar, kuyruklar ve oyunlar

- **CPM:** Ağdaki en uzun yol **kritik yoldur**; kritik faaliyetlerin bolluğu sıfırdır ve gecikmeleri projeyi geciktirir.
- **PERT:** Beklenen süre (a + 4m + b)/6, varyans [(b − a)/6]²; a iyimser, m en olası, b kötümser süredir.
- **M/M/1 kuyruğu:** ρ = λ/μ < 1 olmalıdır; sistemdeki ortalama müşteri sayısı L = ρ/(1 − ρ). **Little formülü:** L = λW.
- **Oyun teorisi:** İki kişili sıfır toplamlı oyunda maksimin = minimaks ise **eyer noktası** vardır ve saf strateji yeterlidir.

## Sık karıştırılanlar

- *Aylak değişken* ≤ kısıtında kullanılmayan kaynağı, *artık değişken* ≥ kısıtında alt sınırın aşılan kısmını gösterir.
- *CPM* kesin sürelerle, *PERT* üç zaman tahminiyle çalışır.
- *Ulaştırma problemi* miktarları kaynaklardan hedeflere dağıtır; *atama problemi* her işi tam olarak bir kişiye verir.

## Çalışma ipucu

İki değişkenli bir DP modelinin grafik çözümünü ve dualini yazmayı birkaç örnekle pratik et; 2 soruluk bu derste en sık karşına çıkacak kalıp budur.
