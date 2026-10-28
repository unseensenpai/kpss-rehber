# İçerik incelemesi

[English](REVIEW.md)

Sitedeki konu özetlerinin hepsi şu an **taslak**. Resmi belgelerden derlendiler, ancak henüz bir alan uzmanı okumadı. Bu belge, bir özetin incelenip **İncelendi** durumuna nasıl geçtiğini anlatır.

## Durumlar

| `state` | Sitede | Anlamı |
|---|---|---|
| `skeleton` | Özet hazırlanıyor | Yalnızca konu adı var. |
| `draft` | Taslak | Özet yazıldı, inceleme bekliyor. Sayfada "İncelemeye katıl" bağlantısı görünür. |
| `published` | İncelendi | Bir inceleyici kontrol listesini uyguladı. Sayfada inceleyenin adı ve tarih görünür. |

İnceleme **dile göre** yapılır: `topics/tr/...` ve `topics/en/...` dosyaları ayrı ayrı yayına alınır. Türkçesi incelenmiş bir konunun İngilizcesi taslak kalabilir.

Build şunlara izin vermez:

- `published` bir dosyada `reviewedBy` ya da `reviewedAt` eksikse,
- konu resmi belgeyle doğrulanmamışsa (`verified: false`),
- dosya incelemeden sonra düzenlenmişse (`updated` > `reviewedAt`),
- `draft` ya da `skeleton` bir dosyada inceleme alanları varsa.

## Kimler inceleyebilir

Konunun alanını bilen herkes: öğretmen, akademisyen, alanında çalışan ya da sınava yeni girip konuyu iyi bilen biri. İnceleyenin adı sayfada görünür. Adını vermek istemeyen GitHub kullanıcı adıyla görünebilir. Sitenin yöneticisi kendi incelediği konuları kendi adıyla yayına alabilir.

## Kontrol listesi

1. **Doğruluk:** Tanımlar, tarihler, sayılar, kişi ve eser adları, formüller doğru mu? Emin olmadığın her ifadeyi bir dayanakla kontrol et.
2. **Güncellik:** Kanun, yönetmelik ve program konularında metin yürürlükteki hâle uyuyor mu? Madde numaraları doğru mu? Sayfadaki dayanak bağlantısını aç.
3. **Kapsam:** Alt başlıklar sayfanın altındaki resmi belgede (ÖSYM kılavuzu ya da konu dağılımı) adı geçen kapsamı karşılıyor mu? Kapsam dışı ayrıntıya boğulmuş mu?
4. **Anahtar kavramlar ve "ÖSYM nasıl soruyor?":** Listedeki kavramlar metinde açıklanmış mı? Soru tarzı açıklaması gerçekçi mi?
5. **Tek başına okunabilirlik:** Öğrenci promptları kullanmadan konunun ana fikrini kavrayabiliyor mu?
6. **Telif:** Metinde çıkmış soru metni, ders kitabından ya da başka bir siteden kopyalanmış paragraf yok mu?
7. **Dil:** Anlatım açık mı, yazım ve noktalama doğru mu? İngilizce dosyada Türkçe terimlerin karşılığı doğru verilmiş mi?

## Nasıl inceleme gönderilir

**Kod bilmeden (issue):** Konu sayfasındaki "İncelemeye katıl" bağlantısından bu belgeye gel, ardından [İçerik incelemesi](https://github.com/unseensenpai/kpss-rehber/issues/new?template=content-review.yml) formunu doldur. Düzeltmeleri dayanaklarıyla yaz. Yönetici düzeltmeleri uygular ve konuyu senin adınla yayına alır.

**Pull request ile:** Düzeltmeleri dosyaya yap, `updated` alanını bugünün tarihine çek, sonra:

```bash
npm run review -- --publish tarih/osmanli-tarihi --locale tr --by "Ad Soyad"
npm test
npm run build
```

`--locale tr,en` iki dili birlikte yayına alır. Bunu yalnızca iki dosyayı da incelediysen kullan.

## Yönetici için komutlar

```bash
npm run review                                      # dile göre ilerleme
npm run review -- --list draft --subject tarih      # inceleme bekleyen dosyalar
npm run review -- --publish <ders/konu> --locale tr --by "Ad" [--date YYYY-MM-DD]
npm run review -- --unpublish <ders/konu> --locale tr
```

## İncelemeden sonra

- Yayındaki bir dosyada yapılan her değişiklik `updated` alanını ilerletir ve build'i durdurur. Ya inceleyici değişikliği onaylar (`--publish` ile yeni tarih), ya da dosya taslağa döner (`--unpublish`).
- Küçük yazım düzeltmelerini yönetici kendi adıyla yeniden onaylayabilir. Anlam değiştiren düzeltmeler ilk inceleyiciye ya da başka bir inceleyiciye gider.
- Mevzuat konuları her yıl [yıllık kontrolde](ANNUAL-REVIEW.tr.md) yeniden okunur.

## Öncelik

En çok soru gelen ve en hızlı eskiyen konulardan başla: KPSS Türkçe, Matematik ve Tarih, Eğitim Bilimleri ve Mevzuat (Maarif Modeli, kanunlar).
