---
title: "Regresyon Analizi"
subject: regresyon-analizi
state: draft
subtopics:
  - Basit doğrusal regresyon ve en küçük kareler
  - Belirlilik katsayısı ve varyans ayrışımı
  - Katsayılar için çıkarım
  - Çoklu regresyon ve düzeltilmiş R²
  - Klasik varsayımlar ve Gauss–Markov teoremi
  - Çoklu doğrusal bağlantı, değişen varyans ve otokorelasyon
  - Kukla değişkenler ve lojistik regresyon
keyConcepts: [en küçük kareler, regresyon katsayısı, artık, belirlilik katsayısı, düzeltilmiş R², standart hata, F testi, BLUE, çoklu doğrusal bağlantı, VIF, değişen varyans, otokorelasyon, Durbin-Watson, kukla değişken, lojistik regresyon, odds oranı]
questionStyle: "Özet istatistiklerden regresyon doğrusunu ve R² değerini hesaplama; çıktıdaki katsayıları ve testleri yorumlama; varsayım ihlalini ve ilgili testi tanıma"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: kpss-lisans-2026
updated: 2026-10-28
---

## Temel fikir

Regresyon analizi, bir bağımlı değişkenin (Y) bir ya da daha fazla açıklayıcı değişkenle (X) ilişkisini bir denklemle modeller; amaç hem ilişkiyi ölçmek hem de tahmin yapmaktır. Testte **4 soru** vardır. Sorular genellikle özet değerlerden katsayıları ve R²'yi hesaplatır, bir çıktıyı yorumlatır ya da hangi varsayımın bozulduğunu sorar.

## Basit doğrusal regresyon

- **Model:** Y = β₀ + β₁X + ε.
- **En küçük kareler (EKK):** Artık kareleri toplamı ∑eᵢ² en küçüklenir. b₁ = Sxy / Sxx = ∑(x − x̄)(y − ȳ) / ∑(x − x̄)², b₀ = ȳ − b₁x̄.
- EKK doğrusu (x̄, ȳ) noktasından geçer; sabit terimli modelde artıkların toplamı sıfırdır.
- b₁ = r · (s_y / s_x); eğimin işareti korelasyonun işaretiyle aynıdır.
- **Yorum:** b₁, X'teki bir birimlik artışın Y'de yol açtığı beklenen ortalama değişimdir.

## Uyum ve çıkarım

- **Varyans ayrışımı:** KT_toplam = KT_regresyon + KT_hata.
- **R² = KT_regresyon / KT_toplam:** Y'deki değişkenliğin modelce açıklanan oranı; basit regresyonda R² = r².
- **Katsayı testi:** t = b₁ / se(b₁); hata sd'si basit regresyonda n − 2, k açıklayıcılı çoklu regresyonda n − k − 1.
- **F testi:** F = KO_regresyon / KO_hata; modelin bütün olarak anlamlılığını sınar. Basit regresyonda F = t².
- **Düzeltilmiş R²** = 1 − (1 − R²)(n − 1)/(n − k − 1); işe yaramayan bir değişken eklenince düşebilir, R² ise değişken eklenince hiç düşmez.

## Varsayımlar ve sorunlar

- **Gauss–Markov teoremi:** Doğrusallık, hataların ortalamasının sıfır olması, sabit varyans, otokorelasyon olmaması ve tam doğrusal bağlantı olmaması koşullarında EKK tahmin edicileri **BLUE**'dur (doğrusal yansız tahmin ediciler içinde en küçük varyanslı). t ve F testleri için ayrıca hataların normalliği varsayılır.
- **Çoklu doğrusal bağlantı:** Açıklayıcılar arasında güçlü ilişki; standart hatalar şişer. **VIF = 1/(1 − Rⱼ²)**; genellikle 10'un üstü ciddi sorun sayılır.
- **Değişen varyans:** Hata varyansı sabit değildir; Breusch–Pagan ya da White testiyle sınanır, ağırlıklı EKK ya da dayanıklı standart hatalarla ele alınır.
- **Otokorelasyon:** Ardışık hatalar ilişkilidir (çoğunlukla zaman serisi verisinde). **Durbin–Watson** istatistiği 0 ile 4 arasındadır; 2'ye yakın değer birinci dereceden otokorelasyon olmadığına işaret eder.

## Özel modeller

- **Kukla değişken:** m kategorili nitel bir değişken için sabit terimli modelde m − 1 kukla kullanılır; m kukla kullanmak **kukla tuzağına** (tam doğrusal bağlantı) yol açar.
- **Lojistik regresyon:** Y iki değerliyse kullanılır; logit ln[p/(1 − p)] modellenir ve exp(β) odds oranını verir.
- **Log-log model:** Eğim katsayısı esneklik olarak yorumlanır.

## Sık karıştırılanlar

- *Korelasyon* ilişkinin gücünü simetrik olarak ölçer; *regresyon* bağımlı ve bağımsız değişkeni ayırır ve tahmin denklemi verir.
- *R²* değişken eklendikçe asla azalmaz; *düzeltilmiş R²* azalabilir.
- *Değişen varyans* hata varyansının değişmesidir; *otokorelasyon* hataların birbiriyle ilişkili olmasıdır.

## Çalışma ipucu

Sxx, Sxy ve Syy değerlerinden b₁, b₀, r ve R²'yi tek akışta hesaplamayı birkaç kez çalış; sonra her varsayım ihlali için "belirti, test, çözüm" üçlüsünü ezberle.
