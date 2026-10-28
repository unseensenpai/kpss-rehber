---
title: "Elektrik ve Manyetizma"
subject: fiz-elektrik-manyetizma
state: draft
subtopics:
  - Elektrik yükü, Coulomb yasası ve elektrik alan
  - Gauss yasası, elektrik potansiyel ve sığa
  - Akım, direnç ve doğru akım devreleri
  - Manyetik alan ve manyetik kuvvet
  - Elektromanyetik indüksiyon
  - Alternatif akım ve Maxwell denklemleri
keyConcepts: [Coulomb yasası, elektrik alan, Gauss yasası, potansiyel fark, sığa, Ohm yasası, Kirchhoff kuralları, Lorentz kuvveti, Biot-Savart yasası, Ampère yasası, manyetik akı, Faraday yasası, Lenz kuralı, öz indüktans]
questionStyle: "Bir yük dağılımı veya devre için alan, potansiyel, akım ya da indüksiyon emk'sını hesaplama; kuvvet ve indüklenen akımın yönünü bulma"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: meb-ags-2026
updated: 2026-10-28
---

## Temel fikir

Elektrik ve manyetizma, yüklerin birbirine nasıl etki ettiğini ve **hareketli yüklerin manyetik alan**, **değişen manyetik alanın da elektrik alan** ürettiğini anlatır. Testte **12** soru bu derstendir. Sorular genellikle alan ve potansiyel hesabı, devre çözümü ve indüksiyonda yön bulma üzerinedir.

## Elektrostatik

- **Coulomb yasası:** F = k·q₁·q₂/r², k = 1/(4π·ε₀) ≈ 9·10⁹ N·m²/C².
- **Elektrik alan:** E = F/q; noktasal yük için E = k·q/r². Alan çizgileri pozitiften negatife yönelir.
- **Gauss yasası:** Kapalı yüzeyden geçen elektrik akısı Φ = q_iç/ε₀. Simetrik dağılımlarda (küre, sonsuz tel, düzlem) alanı kolayca verir.
- **İletkende** durgun yük dış yüzeyde toplanır ve iç alan sıfırdır.
- **Potansiyel:** V = k·q/r; W = q·ΔV. Düzgün alanda E = ΔV/d.
- **Sığa:** C = Q/V; paralel levha C = ε₀·A/d. Depolanan enerji U = ½·C·V². Dielektrik sığayı κ katına çıkarır.
- **Bağlama:** Paralelde sığalar toplanır; seride 1/C toplanır.

## Doğru akım devreleri

- **Ohm yasası:** V = I·R; direnç R = ρ·L/A.
- **Güç:** P = V·I = I²·R = V²/R.
- **Dirençler:** Seride toplanır; paralelde 1/R toplanır.
- **Kirchhoff:** Düğüme giren akım çıkana eşittir (yük korunumu); kapalı ilmekte gerilimlerin toplamı sıfırdır (enerji korunumu).
- **RC devresi:** Zaman sabiti τ = R·C.

## Manyetizma ve indüksiyon

- **Lorentz kuvveti:** F = q·(E + v × B); telde F = I·L·B·sinθ. Manyetik kuvvet hıza diktir, iş yapmaz.
- **Düzgün alanda yük** çember çizer: r = m·v/(q·B).
- **Kaynaklar:** Uzun düz tel B = μ₀·I/(2π·r); uzun bobin (solenoid) içinde B = μ₀·n·I. Biot-Savart ve Ampère yasaları bunları verir.
- **Faraday yasası:** emk = −N·dΦ/dt, Φ = B·A·cosθ.
- **Lenz kuralı:** İndüklenen akım, kendisini oluşturan akı değişimine karşı koyar (eksi işaretin anlamı).
- **Hareket emk'sı:** emk = B·L·v.
- **İndüktans:** Bobinde depolanan enerji ½·L·I²; RL devresinde τ = L/R.
- **Transformatör:** V₂/V₁ = N₂/N₁ (ideal); yalnızca alternatif akımla çalışır.
- **Maxwell denklemleri** dört yasayı birleştirir ve elektromanyetik dalganın ışık hızında yayıldığını öngörür: c = 1/√(μ₀·ε₀).

## Sık karıştırılanlar

- *Elektrik alan* vektördür ve uzaklığın karesiyle azalır; *potansiyel* skalerdir ve uzaklıkla ters orantılıdır.
- *Manyetik alan* (B) bir alandır; *manyetik akı* (Φ = B·A·cosθ) bir yüzeyden geçen alan miktarıdır. İndüksiyonu akının *değişimi* doğurur, alanın varlığı değil.
- *Sığalar* paralelde toplanır, *dirençler* seride toplanır; bağlama kuralları birbirinin tersidir.

## Çalışma ipucu

Yön sorularında sağ el kuralını bir pozitif yük örneğiyle her gün birkaç kez uygula. Devrelerde önce eşdeğer direnci bul, sonra Kirchhoff ile akımları dağıt.
