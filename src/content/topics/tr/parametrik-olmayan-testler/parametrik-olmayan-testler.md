---
title: "Parametrik Olmayan Testler"
subject: parametrik-olmayan-testler
state: draft
subtopics:
  - Parametrik olmayan testlerin kullanım koşulları
  - Tek örnek ve uyum iyiliği testleri
  - İki bağımlı örnek testleri
  - İki bağımsız örnek testleri
  - k örnek testleri
  - Sıra korelasyonu ve bağımsızlık testleri
keyConcepts: [dağılımdan bağımsız, sıra (rank), işaret testi, Wilcoxon işaretli sıra testi, Mann-Whitney U, Kruskal-Wallis H, Friedman testi, ki-kare uyum iyiliği, ki-kare bağımsızlık testi, Kolmogorov-Smirnov, McNemar testi, Cochran Q, dizi (runs) testi, Spearman sıra korelasyonu, Kendall tau]
questionStyle: "Verilen araştırma durumuna uygun parametrik olmayan testi seçme; testin parametrik karşılığını bulma; Spearman ya da ki-kare için küçük bir hesap"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: kpss-lisans-2026
updated: 2026-10-28
---

## Temel fikir

Parametrik olmayan testler anakütle dağılımı hakkında (örneğin normallik) güçlü varsayım yapmaz; çoğu veriyi **sıralara** dönüştürerek çalışır. Küçük örneklerde, normallik bozulduğunda ya da veri sıralama veya sınıflama ölçeğindeyken tercih edilir. Varsayımlar sağlandığında ise parametrik testlerden genellikle daha az güçlüdür. Testte **2 soru** vardır ve çoğunlukla "bu durumda hangi test kullanılır?" sorusudur.

## Testler ve parametrik karşılıkları

- **İşaret testi:** Tek örnekte medyan ya da eşleştirilmiş farkların yalnızca işaretleri kullanılır.
- **Wilcoxon işaretli sıra testi:** İki bağımlı örnek (önce-sonra); farkların hem işaretini hem büyüklük sırasını kullanır. Karşılığı: eşleştirilmiş t testi.
- **Mann–Whitney U:** İki bağımsız örnek. Karşılığı: bağımsız örneklem t testi.
- **Kruskal–Wallis H:** k bağımsız örnek. Karşılığı: tek yönlü ANOVA.
- **Friedman testi:** k bağımlı örnek (tekrarlı ölçüm ya da bloklar). Karşılığı: tekrarlı ölçümler ANOVA.
- **Spearman sıra korelasyonu:** rₛ = 1 − 6∑d² / [n(n² − 1)], d iki sıra arasındaki farktır (eş sıra yoksa). Karşılığı: Pearson korelasyonu. **Kendall tau** da sıralı ilişkiyi ölçer.

## Sınıflamalı veri ve uyum testleri

- **Ki-kare uyum iyiliği:** Gözlenen frekanslar beklenen dağılıma uyuyor mu? χ² = ∑(G − B)²/B.
- **Ki-kare bağımsızlık testi:** r × c tabloda iki değişken bağımsız mı? Serbestlik derecesi (r − 1)(c − 1); beklenen frekansların genellikle 5'ten küçük olmaması istenir.
- **McNemar testi:** İki kategorili bir değişkende önce-sonra (bağımlı) değişimi test eder; **Cochran Q** bunu k bağımlı ölçüme genişletir.
- **Kolmogorov–Smirnov:** Örneğin birikimli dağılımını kuramsal sürekli bir dağılımla (ya da iki örneği birbiriyle) karşılaştırır; normallik sınamasında da kullanılır.
- **Dizi (runs) testi:** Bir gözlem dizisinin rastgele olup olmadığını sınar.

## Sık karıştırılanlar

- *Wilcoxon işaretli sıra testi* iki bağımlı örnek içindir; *Mann–Whitney U* (Wilcoxon sıra toplamı testi) iki bağımsız örnek içindir.
- *Kruskal–Wallis* bağımsız k grup, *Friedman* aynı deneklerde k ölçüm içindir.
- *McNemar* bağımlı iki ölçümdeki oran değişimini, *ki-kare bağımsızlık testi* tek bir örneklemdeki iki değişkenin ilişkisini inceler.

## Çalışma ipucu

İki sütunlu bir tablo yap: solda parametrik test, sağda parametrik olmayan karşılığı. Soruda önce "kaç grup var" ve "örnekler bağımlı mı, bağımsız mı" sorularını cevapla; test kendiliğinden ortaya çıkar.
