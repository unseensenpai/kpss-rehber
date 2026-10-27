---
title: "Zaman Serileri"
subject: zaman-serileri
state: draft
subtopics:
  - Zaman serisinin bileşenleri
  - Toplamsal ve çarpımsal modeller
  - Hareketli ortalamalar ve üstel düzeltme
  - Durağanlık, birim kök ve fark alma
  - Otokorelasyon ve kısmi otokorelasyon
  - AR, MA, ARMA ve ARIMA modelleri
  - Box–Jenkins yaklaşımı ve tahmin hataları
keyConcepts: [trend, mevsimsellik, konjonktür, düzensiz bileşen, hareketli ortalama, üstel düzeltme, Holt-Winters, durağanlık, birim kök, Dickey-Fuller testi, beyaz gürültü, otokorelasyon fonksiyonu, kısmi otokorelasyon fonksiyonu, ARIMA modeli, Ljung-Box testi, MAPE]
questionStyle: "Bir serinin bileşenlerini ya da modelini tanıma; ACF ve PACF desenlerinden AR veya MA mertebesini belirleme; üstel düzeltme ile bir adım ileri tahmin yapma"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: kpss-lisans-2026
updated: 2026-10-28
---

## Temel fikir

Zaman serisi, aynı değişkenin eşit aralıklarla yapılmış ardışık gözlemleridir; gözlemler birbirinden bağımsız değildir ve bu bağımlılık geleceği tahmin etmekte kullanılır. Testte **2 soru** vardır. Sorular genellikle bileşenleri ayırt ettirir, durağanlığı sorgular ya da ACF ve PACF desenlerinden uygun modeli seçtirir.

## Bileşenler ve ayrıştırma

- **Trend (T):** Uzun dönemli artış ya da azalış eğilimi.
- **Mevsimsellik (S):** Bir yıl içinde (ay, çeyrek) düzenli tekrarlayan dalgalanma.
- **Konjonktür (C):** Bir yıldan uzun, süresi düzensiz iş çevrimi dalgaları.
- **Düzensiz bileşen (I):** Rastgele, öngörülemeyen kısım.
- **Toplamsal model** Y = T + S + C + I (mevsim etkisinin genliği sabit); **çarpımsal model** Y = T × S × C × I (mevsim etkisi seri düzeyiyle birlikte büyür).

## Düzeltme yöntemleri

- **Hareketli ortalama:** Kısa dönem dalgalanmaları törpüler; dönem uzunluğu mevsim uzunluğuna eşit seçilirse mevsimselliği giderir.
- **Basit üstel düzeltme:** Fₜ₊₁ = αYₜ + (1 − α)Fₜ, 0 < α < 1. α büyüdükçe son gözleme daha çok ağırlık verilir. Trendi ve mevsimselliği olmayan seriler içindir.
- **Holt** yöntemi trendi, **Holt–Winters** yöntemi trend ile mevsimselliği birlikte modeller.

## Durağanlık ve ARIMA

- **Zayıf durağanlık:** Ortalama ve varyans sabittir; iki gözlem arasındaki kovaryans yalnızca aradaki gecikmeye bağlıdır.
- **Beyaz gürültü:** Ortalaması sıfır, varyansı sabit, birbiriyle ilişkisiz şoklar.
- **Birim kök:** Durağan olmamanın tipik nedenidir; **Dickey–Fuller** testinde sıfır hipotezi "birim kök vardır"dır. Durağanlık **fark alma** ile sağlanır; kaç kez fark alındığı ARIMA'daki d'dir.
- **AR(p):** ACF yavaşça söner, **PACF p. gecikmeden sonra kesilir**. AR(1) için durağanlık koşulu |φ| < 1'dir.
- **MA(q):** **ACF q. gecikmeden sonra kesilir**, PACF yavaşça söner.
- **ARMA(p, q):** ACF de PACF de söner. **ARIMA(p, d, q):** d kez fark alınmış seriye uygulanan ARMA.
- **Box–Jenkins:** Tanımlama → tahmin → tanı kontrolü (artıklar beyaz gürültü mü? **Ljung–Box** testi) → öngörü.
- **Hata ölçüleri:** MAE, MSE ve MAPE; MAPE yüzde olduğu için farklı ölçekli serileri karşılaştırmaya uygundur.

## Sık karıştırılanlar

- *Mevsimsellik* bir yıl içinde sabit dönemle tekrarlar; *konjonktür* yıllara yayılır ve süresi düzensizdir.
- *AR* modelin izi PACF'teki kesilme, *MA* modelin izi ACF'deki kesilmedir.
- *Toplamsal* modelde mevsim etkisi birim cinsinden sabittir; *çarpımsal* modelde oran olarak sabittir.

## Çalışma ipucu

ACF ve PACF desenlerini küçük bir tabloya yaz (AR: PACF keser, MA: ACF keser, ARMA: ikisi de söner). 2 soruluk bu derste bu tablo ve bileşen tanımları soruların büyük kısmını karşılar.
