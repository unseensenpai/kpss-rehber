---
title: "Analitik Kimya"
subject: kim-analitik
state: draft
subtopics:
  - Analitik verilerin değerlendirilmesi (hata ve istatistik)
  - Sulu çözelti dengeleri ve tampon çözeltiler
  - Çözünürlük dengesi ve gravimetri
  - Titrimetrik yöntemler
  - Elektroanalitik yöntemler
  - Spektroskopi ve kromatografi
keyConcepts: [doğruluk, kesinlik, sistematik hata, standart sapma, tampon çözelti, Henderson-Hasselbalch, çözünürlük çarpımı, ortak iyon etkisi, eşdeğerlik noktası, indikatör, EDTA, Nernst denklemi, Beer-Lambert yasası, alıkonma süresi]
questionStyle: "Titrasyon, tampon pH'ı, çözünürlük ve absorbans hesapları yapma; bir analiz için uygun yöntemi ya da indikatörü seçme"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: meb-ags-2026
updated: 2026-10-28
---

## Temel fikir

Analitik kimya, bir örnekte **ne olduğunu** (nitel analiz) ve **ne kadar olduğunu** (nicel analiz) güvenilir biçimde belirlemeyi öğretir. Bunun için çözelti dengelerini ölçüm yöntemleriyle birleştirir. Testte **10** soru vardır. Sorular çoğunlukla titrasyon ve denge hesapları, hata türleri ve yöntem seçimi üzerinedir.

## Veri ve çözelti dengeleri

- **Doğruluk** ölçümün gerçek değere yakınlığı, **kesinlik** tekrarlanan ölçümlerin birbirine yakınlığıdır.
- **Sistematik hata** tek yönlüdür ve düzeltilebilir (kalibrasyon, kör deneme); **rastgele hata** iki yönlüdür ve standart sapmayla ifade edilir.
- **Zayıf asit:** Ka = [H⁺]·[A⁻]/[HA]; derişim çok küçük değilse [H⁺] ≈ √(Ka·C).
- **Tampon çözelti:** Zayıf asit ile eşlenik bazının karışımıdır; az miktarda asit ya da baz eklenince pH pek değişmez. **Henderson-Hasselbalch:** pH = pKa + log([A⁻]/[HA]). En etkili tampon bölgesi pH ≈ pKa'dır.
- **Çözünürlük çarpımı:** AgCl için Ksp = [Ag⁺]·[Cl⁻]. İyon çarpımı Ksp'yi aşarsa çökelme olur.
- **Ortak iyon etkisi:** Ortamda çökeleğin iyonlarından biri varsa çözünürlük azalır.

## Gravimetri ve titrimetri

- **Gravimetri:** Analit saf, bilinen bileşimli ve az çözünen bir çökelek hâlinde ayrılıp tartılır.
- **Titrasyon:** Derişimi bilinen çözelti (titrant) analitle tam tepkimeye girene kadar eklenir. **Eşdeğerlik noktası** kuramsal noktadır; **dönüm noktası** indikatörün renk değiştirdiği gözlenen noktadır.
- **Asit-baz titrasyonu:** Güçlü asit-güçlü baz eşdeğerlikte pH 7'dir; zayıf asit-güçlü bazda pH 7'nin üstündedir (fenolftalein uygundur). Yarı eşdeğerlikte pH = pKa.
- **Kompleksometri:** EDTA metal iyonlarıyla 1:1 kompleks oluşturur; su sertliği tayininde kullanılır.
- **Redoks titrasyonu:** Permanganat (KMnO₄) asidik ortamda kendi indikatörü gibi davranır.
- **Çöktürme titrasyonu:** Klorür tayininde gümüş nitrat kullanılır (arjantometri).

## Aletli yöntemler

- **Nernst denklemi (25 °C):** E = E° − (0,0592/n)·log Q. pH metre, cam elektrotla potansiyel ölçer (potansiyometri).
- **Beer-Lambert yasası:** A = ε·b·c; absorbans derişimle doğru orantılıdır. Geçirgenlik T = I/I₀, A = −log T.
- **Atomik absorpsiyon** metallerin, **UV-görünür** ve **IR** spektroskopisi moleküllerin analizinde kullanılır.
- **Kromatografi:** Bileşenler sabit faz ile hareketli faz arasında farklı dağıldıkları için ayrılır. Gaz kromatografisi (GC) uçucu, sıvı kromatografisi (HPLC) uçucu olmayan maddelere uygundur; tanıma **alıkonma süresi** ile yapılır.

## Sık karıştırılanlar

- *Doğruluk* gerçek değere yakınlık, *kesinlik* tekrarların birbirine yakınlığıdır; kesin ama doğru olmayan sonuç sistematik hataya işaret eder.
- *Eşdeğerlik noktası* hesaplanan, *dönüm noktası* gözlenen noktadır.
- *Çözünürlük* (s, mol/L) ile *çözünürlük çarpımı* (Ksp) aynı şey değildir; AB₂ tipi tuzda Ksp = 4s³.

## Çalışma ipucu

Titrasyon eğrisini dört bölgede düşün: başlangıç, tampon bölgesi, eşdeğerlik ve aşırı titrant. Her bölgede hangi türün baskın olduğunu bilirsen pH hesabı kendiliğinden gelir.
