---
title: "Mekanik"
subject: fiz-mekanik
state: draft
subtopics:
  - Vektörler ve kinematik (bir ve iki boyutta hareket)
  - Newton yasaları ve sürtünme
  - İş, enerji ve güç
  - Momentum, itme ve çarpışmalar
  - Dönme hareketi, tork ve açısal momentum
  - Kütle çekimi ve Kepler yasaları
  - Basit harmonik hareket
keyConcepts: [ivme, eğik atış, net kuvvet, eylemsizlik, kinetik enerji, potansiyel enerji, enerji korunumu, momentum korunumu, esnek çarpışma, eylemsizlik momenti, tork, açısal momentum, kütle çekim yasası, periyot]
questionStyle: "Verilen bir hareket durumunda doğru yasayı (Newton, enerji ya da momentum korunumu) seçip hız, ivme, kuvvet veya periyot hesaplama"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: meb-ags-2026
updated: 2026-10-28
---

## Temel fikir

Mekanik, cisimlerin **nasıl hareket ettiğini** (kinematik) ve **neden öyle hareket ettiğini** (dinamik) inceler. Bütün konu birkaç büyük ilkeye dayanır: **Newton yasaları**, **enerji korunumu** ve **momentum korunumu**. Testteki 50 sorunun **15**'i bu derstendir; en ağırlıklı alandır. Sorular genellikle bir durum verir ve hangi ilkenin en kısa yoldan sonuca götürdüğünü görmeni ister.

## Kinematik ve dinamik

- **Sabit ivmeli hareket:** v = v₀ + a·t, x = v₀·t + ½·a·t², v² = v₀² + 2·a·x.
- **Eğik atış:** Yatayda hız sabit, düşeyde ivme g'dir. Menzil R = v₀²·sin(2θ)/g; en büyük menzil 45°'de elde edilir (sürtünmesiz ve aynı yüksekliğe düşüş için).
- **Newton'un 1. yasası:** Net kuvvet sıfırsa cisim durumunu korur (eylemsizlik).
- **2. yasa:** F_net = m·a (genel hâli F = dp/dt).
- **3. yasa:** Etki ve tepki eşit büyüklükte, zıt yönlüdür ve **farklı cisimlere** etki eder.
- **Sürtünme:** f = μ·N; statik sürtünme en çok μs·N olabilir, kinetik sürtünme genellikle daha küçüktür.
- **Düzgün çembersel hareket:** Merkezcil ivme a = v²/r = ω²·r, yönü merkeze doğrudur.

## Enerji ve momentum

- **İş:** W = F·d·cosθ. **İş-enerji teoremi:** Net iş, kinetik enerji değişimine eşittir.
- **Enerjiler:** Ek = ½·m·v², yerçekimi Ep = m·g·h, yay Ep = ½·k·x².
- **Mekanik enerji korunumu:** Yalnız korunumlu kuvvetler iş yapıyorsa Ek + Ep sabittir. Sürtünme enerjiyi ısıya çevirir.
- **Güç:** P = W/t = F·v.
- **Momentum:** p = m·v; **itme** I = F·Δt = Δp. Dış kuvvet yoksa toplam momentum korunur.
- **Çarpışmalar:** Esnek çarpışmada hem momentum hem kinetik enerji korunur; esnek olmayanda yalnızca momentum. Tamamen esnek olmayan çarpışmada cisimler yapışır.

## Dönme, kütle çekimi ve titreşim

- **Tork:** τ = r·F·sinθ; dönmede τ = I·α.
- **Eylemsizlik momenti:** Noktasal kütle için I = m·r²; dönme kinetik enerjisi ½·I·ω².
- **Açısal momentum:** L = I·ω; dış tork yoksa korunur (kollarını toplayan patenci hızlanır).
- **Yuvarlanma:** Kaymadan yuvarlanmada v = ω·r ve toplam Ek = ½·m·v² + ½·I·ω².
- **Kütle çekimi:** F = G·m₁·m₂/r². Kepler: yörüngeler elipstir, alan hızı sabittir, T² ∝ a³.
- **Basit harmonik hareket:** Yay-kütle T = 2π·√(m/k); küçük açılı basit sarkaç T = 2π·√(L/g).

## Sık karıştırılanlar

- *Kütle* maddenin miktarıdır ve yerden yere değişmez; *ağırlık* (G = m·g) bir kuvvettir ve g ile değişir.
- *Esnek* çarpışmada kinetik enerji korunur; *esnek olmayan* çarpışmada yalnızca momentum korunur.
- *Etki-tepki* kuvvetleri farklı cisimlere etki eder; *dengelenmiş kuvvetler* aynı cisme etki eder.

## Çalışma ipucu

Her soruda önce "zaman soruluyor mu?" diye bak: zaman varsa kinematik ya da itme, yoksa enerji korunumu genellikle en kısa yoldur. Çarpışma ve patlamalarda önce momentumu yaz.
