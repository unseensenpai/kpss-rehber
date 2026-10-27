---
title: "Deney Tasarımı ve Varyans Analizi"
subject: deney-tasarimi-varyans
state: draft
subtopics:
  - Deney tasarımının ilkeleri
  - Tamamen rastgele tasarım ve tek yönlü varyans analizi
  - Varyans analizinin varsayımları
  - Rastgele blok ve Latin kare tasarımları
  - Faktöriyel tasarımlar ve etkileşim
  - Çoklu karşılaştırma testleri
  - Sabit ve rastgele etkiler
keyConcepts: [rastgeleleştirme, tekrarlama, bloklama, deneysel hata, kareler toplamı, kareler ortalaması, F oranı, serbestlik derecesi, varyansların homojenliği, Levene testi, rastgele blok tasarımı, Latin kare, etkileşim etkisi, 2 üzeri k faktöriyel, Tukey HSD, Scheffé testi]
questionStyle: "Eksik bir ANOVA tablosunu (serbestlik derecesi, kareler ortalaması, F) tamamlama; duruma uygun deney tasarımını seçme; etkileşimi yorumlama"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: kpss-lisans-2026
updated: 2026-10-28
---

## Temel fikir

Deney tasarımı, bir ya da daha fazla faktörün bir yanıt değişkeni üzerindeki etkisini hatayı en aza indirecek biçimde planlamaktır; varyans analizi (ANOVA) ise toplam değişkenliği kaynaklarına ayırarak bu etkileri test eder. Testte **4 soru** vardır. En sık soru tipi, bazı hücreleri boş bırakılmış bir ANOVA tablosunu tamamlamaktır.

## İlkeler ve tek yönlü ANOVA

- **Üç ilke:** **Rastgeleleştirme** (sistematik yanlılığı önler), **tekrarlama** (deneysel hatanın tahminini sağlar), **bloklama** ya da yerel kontrol (bilinen bir değişkenlik kaynağını ayırır).
- **Tamamen rastgele tasarım:** k işlem, toplam N gözlem. KT_toplam = KT_işlem + KT_hata.
- **Serbestlik dereceleri:** İşlem k − 1, hata N − k, toplam N − 1.
- **F = KO_işlem / KO_hata**, burada KO = KT / sd. F kritik değeri aşarsa "tüm işlem ortalamaları eşittir" hipotezi reddedilir.
- **Varsayımlar:** Hataların bağımsızlığı, normalliği ve **varyansların homojenliği** (Levene ya da Bartlett testiyle sınanır).
- **η² = KT_işlem / KT_toplam:** Yanıttaki değişkenliğin işlemlerce açıklanan oranı.

## Bloklu tasarımlar

- **Rastgele blok tasarımı:** k işlem, b blok; her blokta her işlem bir kez uygulanır. Blok sd b − 1, hata sd (k − 1)(b − 1). Bloklar birbirine benzer deneysel birimlerden oluşur.
- **Latin kare:** İki değişkenlik kaynağını (satır ve sütun) birlikte kontrol eder; p × p düzende her işlem her satırda ve her sütunda bir kez yer alır. Hata sd (p − 1)(p − 2).

## Faktöriyel tasarımlar

- İki ya da daha fazla faktörün tüm düzey birleşimleri denenir; **ana etkiler** ve **etkileşim** birlikte incelenir.
- **İki yönlü ANOVA (a × b, her hücrede n tekrar):** A için a − 1, B için b − 1, etkileşim için (a − 1)(b − 1), hata için ab(n − 1) sd.
- **Etkileşim** anlamlıysa bir faktörün etkisi diğerinin düzeyine göre değişir; ana etkiler tek başına yorumlanmamalıdır. Etkileşim grafiğinde paralel olmayan çizgiler etkileşime işaret eder.
- **2ᵏ faktöriyel:** k faktörün her biri iki düzeylidir; çok faktörü hızla taramak için kullanılır.

## Çoklu karşılaştırmalar ve etki türleri

- ANOVA anlamlı çıktığında hangi ortalamaların farklı olduğu **Tukey HSD, Scheffé, Bonferroni, Duncan** ya da **LSD** ile bulunur.
- **Sabit etkiler:** Düzeyleri araştırmacı seçer, sonuç yalnızca bu düzeyler için geçerlidir. **Rastgele etkiler:** Düzeyler daha geniş bir düzeyler anakütlesinden rastgele seçilir ve sonuç o anakütleye genellenir.

## Sık karıştırılanlar

- *Rastgele blok tasarımı* tek bir değişkenlik kaynağını, *Latin kare* iki kaynağı birlikte kontrol eder.
- *Ana etki* bir faktörün ortalama etkisidir; *etkileşim* bu etkinin diğer faktörün düzeyine göre değişmesidir.
- *Tukey* tüm ikili karşılaştırmalar için tasarlanmıştır; *Scheffé* her türlü karşıtlığa izin verir ve daha tutucudur.

## Çalışma ipucu

Her tasarım için ANOVA tablosunu (kaynak, sd, KT, KO, F) bir kez kendin kur. Toplam sd ve toplam KT'nin parçaların toplamı olduğunu unutmazsan eksik hücreleri birkaç saniyede doldurursun.
