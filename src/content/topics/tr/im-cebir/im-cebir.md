---
title: "Cebir"
subject: im-cebir
state: draft
subtopics:
  - Kümeler, bağıntılar ve fonksiyonlar
  - Bölünebilme, EBOB-EKOK ve asal sayılar
  - Modüler aritmetik ve kongrüanslar
  - Matrisler, determinant ve lineer denklem sistemleri
  - Vektör uzayları ve özdeğerler
  - İşlemler ve grup yapısı
keyConcepts: [denklik bağıntısı, sıralama bağıntısı, birebir ve örten fonksiyon, Öklid algoritması, aritmetiğin temel teoremi, kongrüans, Fermat'nın küçük teoremi, Euler phi fonksiyonu, determinant, ters matris, rank, özdeğer, grup, Lagrange teoremi]
questionStyle: "Bir sayı teorisi ya da matris hesabını yapma; bir bağıntının ya da işlemin özelliklerini belirleme; bir yapının grup olup olmadığına karar verme"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: meb-ags-2026
updated: 2026-10-28
---

## Temel fikir

Cebir, sayıların ve nesnelerin **işlemler altındaki yapısını** inceler: Bölünebilmeden matrislere, oradan gruplara kadar hep "hangi kural her zaman geçerli?" sorusu sorulur. İlköğretim Matematik ÖABT'sinde **12 soru** çıkar. Sorular çoğunlukla bir EBOB, kalan, determinant ya da ters matris hesaplatır; bir kısmı da bir bağıntının denklik bağıntısı ya da bir işlemin grup oluşturup oluşturmadığını sorar. Ortaokuldaki çarpanlar, katlar ve denklemler konularının kuramsal temeli buradadır.

## Kümeler, bağıntılar ve fonksiyonlar

- **Denklik bağıntısı:** Yansıyan, simetrik ve geçişken; kümeyi ayrık denklik sınıflarına ayırır.
- **Kısmi sıralama:** Yansıyan, ters simetrik ve geçişken (örneğin pozitif tam sayılarda "böler" bağıntısı).
- **Fonksiyon sayıları:** m elemanlı bir kümeden n elemanlı kümeye nᵐ fonksiyon vardır; m ≤ n ise bunların n!/(n − m)! tanesi **birebir**dir.

## Sayılar teorisi

- **Aritmetiğin temel teoremi:** 1'den büyük her tam sayı, sıra dışında tek biçimde asal çarpanlara ayrılır. n = pᵃ·qᵇ ise pozitif bölen sayısı (a + 1)(b + 1)'dir.
- **Öklid algoritması:** EBOB(a, b) = EBOB(b, a mod b). Ayrıca EBOB(a, b)·EKOK(a, b) = a·b ve EBOB(a, b) = ax + by olacak biçimde x, y tam sayıları vardır (**Bézout**).
- **Kongrüans:** a ≡ b (mod n) ⇔ n | (a − b). ax ≡ b (mod n) denkleminin çözümü ancak EBOB(a, n) | b ise vardır.
- **Fermat'nın küçük teoremi:** p asal ve p ∤ a ise aᵖ⁻¹ ≡ 1 (mod p). Genelleşmesi **Euler**: EBOB(a, n) = 1 ise a^φ(n) ≡ 1 (mod n); φ(p) = p − 1.

## Lineer cebir

- **Determinant:** det(AB) = det(A)·det(B), det(Aᵀ) = det(A), n×n matris için det(kA) = kⁿ·det(A). A'nın tersi ancak det(A) ≠ 0 ise vardır.
- **2×2 ters matris:** A = [a b; c d] için A⁻¹ = (1/(ad − bc))·[d −b; −c a].
- **Lineer sistemler:** Ax = b sisteminde det(A) ≠ 0 ise tek çözüm vardır (Cramer kuralı uygulanabilir). Homojen sistem Ax = 0'ın sıfırdan farklı çözümü ancak det(A) = 0 ise vardır.
- **Rank ve boyut:** n sütunlu A için rank(A) + sıfırlık(A) = n.
- **Özdeğer:** det(A − λI) = 0 denkleminin kökleri; özdeğerlerin çarpımı det(A), toplamı iz(A)'dır.

## Cebirsel yapılar

- **Grup:** İşlem kapalı, birleşmeli, birim elemanlı ve her elemanın tersi var. Değişme özelliği de varsa **değişmeli (Abel) grup** olur.
- **Örnekler:** (ℤ, +) grup, (ℤ, ·) grup değildir (2'nin tersi yok); (ℤₙ, +) devirli bir gruptur.
- **Lagrange teoremi:** Sonlu bir grupta alt grubun mertebesi grubun mertebesini böler; bu yüzden asal mertebeli her grup devirlidir.

## Sık karıştırılanlar

- *Simetrik* bağıntıda aRb ⇒ bRa; *ters simetrik* bağıntıda aRb ve bRa ise a = b'dir. Bir bağıntı ikisini birden sağlayabilir.
- *EBOB* ortak bölenlerin en büyüğü, *EKOK* ortak katların en küçüğüdür; ikisinin çarpımı yalnızca iki sayı için a·b'ye eşittir.
- *det(kA)* = kⁿ·det(A)'dır, *k·det(A)* değildir.

## Çalışma ipucu

Grup sorularında dört aksiyomu sırayla kontrol et ve ilk bozulanı bul; sayı teorisi sorularında büyük üsleri Fermat ya da Euler ile küçült. İkisi de hızlı ve güvenilir bir rutin sağlar.
