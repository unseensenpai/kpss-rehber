---
title: "Geometri"
subject: mat-geometri
state: draft
subtopics:
  - Aksiyomatik geometri ve Öklid dışı geometriler
  - Vektörler, iç ve dış çarpım
  - Uzayda doğru ve düzlem
  - Konikler (elips, hiperbol, parabol)
  - Dönüşümler ve matrisle gösterimi
  - Eğrilerin diferansiyel geometrisi
keyConcepts: [paralellik aksiyomu, hiperbolik geometri, küresel geometri, iç çarpım, vektörel çarpım, karma çarpım, normal vektör, dışmerkezlik, odak ve doğrultman, izometri, ortogonal matris, eğrilik, burulma, Frenet formülleri]
questionStyle: "Uzayda doğru ve düzlemlerle ilgili uzaklık, açı ve kesişim hesapları yapma; bir koniğin elemanlarını bulma; bir eğrinin eğriliğini ya da burulmasını hesaplama"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: meb-ags-2026
updated: 2026-10-28
---

## Temel fikir

Lise öğretmenliği düzeyindeki Geometri, şekilleri **koordinat ve vektör** diliyle inceler: Düzlemden uzaya, doğrulardan konik ve eğrilere geçildikçe hesaplar vektör cebirine dayanır. Matematik ÖABT'sinde **10 soru** çıkar. Sorular çoğunlukla uzayda doğru ve düzlem hesabı, bir koniğin odak ve dışmerkezliği ya da bir uzay eğrisinin eğriliği üzerinedir; aksiyomatik geometriden ve dönüşümlerden de kavramsal sorular gelir.

## Aksiyomatik temeller

- **Paralellik aksiyomu:** Öklid geometrisinde bir doğruya dışındaki bir noktadan tek paralel geçer ve üçgenin açıları toplamı 180°'dir.
- **Hiperbolik geometride** sonsuz sayıda paralel vardır ve açılar toplamı 180°'den küçüktür; **küresel (eliptik) geometride** paralel yoktur ve toplam 180°'den büyüktür.

## Vektörler, doğru ve düzlem

- **İç çarpım:** u · v = |u|·|v|·cos θ; u · v = 0 ⇔ vektörler diktir (sıfırdan farklıysa).
- **Vektörel çarpım:** u × v hem u'ya hem v'ye diktir; |u × v| iki vektörün oluşturduğu paralelkenarın alanıdır.
- **Karma çarpım:** u · (v × w) üç vektörün oluşturduğu paralel yüzlünün işaretli hacmidir; sıfırsa vektörler aynı düzlemdedir.
- **Düzlem:** ax + by + cz + d = 0 düzleminin normal vektörü (a, b, c)'dir. (x₀, y₀, z₀) noktasının uzaklığı |ax₀ + by₀ + cz₀ + d| / √(a² + b² + c²).
- **Doğru:** (x₀, y₀, z₀) noktasından geçen ve (a, b, c) doğrultulu doğru (x − x₀)/a = (y − y₀)/b = (z − z₀)/c biçiminde yazılır. İki düzlem arasındaki açı, normal vektörleri arasındaki açıdır.

## Konikler

- **Elips:** x²/a² + y²/b² = 1 (a > b), c² = a² − b², dışmerkezlik e = c/a < 1. Odaklara uzaklıklar toplamı 2a'dır.
- **Hiperbol:** x²/a² − y²/b² = 1, c² = a² + b², e > 1, asimptotlar y = ±(b/a)x. Odaklara uzaklıklar farkının mutlak değeri 2a'dır.
- **Parabol:** y² = 4px; odak (p, 0), doğrultman x = −p, e = 1. Her nokta odağa ve doğrultmana eşit uzaklıktadır.

## Dönüşümler ve eğriler

- **İzometriler** uzaklığı korur; orijini sabit tutan doğrusal izometrilerin matrisleri **ortogonaldir** (AᵀA = I, det A = ±1). det A = 1 dönme, det A = −1 yansıma içerir.
- **θ açılı dönme matrisi:** [cos θ −sin θ; sin θ cos θ].
- **Eğrilik:** y = f(x) düzlem eğrisi için κ = |y''| / (1 + (y')²)^(3/2). Uzay eğrisi r(t) için κ = |r' × r''| / |r'|³; çemberin eğriliği 1/r'dir.
- **Burulma:** τ = (r' × r'') · r''' / |r' × r''|²; düzlemsel eğrilerde τ = 0'dır.
- **Frenet formülleri** (yay uzunluğuna göre): T' = κN, N' = −κT + τB, B' = −τN.

## Sık karıştırılanlar

- *İç çarpım* bir sayı, *vektörel çarpım* bir vektör verir; diklik için birincisi sıfır, paralellik için ikincisi sıfır vektör olur.
- *Elipste* c² = a² − b², *hiperbolde* c² = a² + b²'dir.
- *Eğrilik* eğrinin kendi düzlemi içinde bükülmesini, *burulma* ise o düzlemden ayrılmasını ölçer.

## Çalışma ipucu

Uzay sorularında her şeyi vektöre çevir: Düzlem için normal, doğru için doğrultu vektörü bul; açı, diklik ve uzaklık soruları bu iki vektörle iç ve dış çarpıma iner.
