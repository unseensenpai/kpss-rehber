# Yıllık kontrol

[English](ANNUAL-REVIEW.md)

ÖSYM her yıl yeni kılavuz, takvim ve soru kitapçığı yayımlar. Bu liste siteyi yeni yıla taşımak içindir. Buradaki hiçbir adım otomatik değildir: haftalık kaynak kontrolü değişiklikleri yalnızca **bildirir** ve sitedeki her sayı resmi bir belgeye dayanmalıdır.

## Değişiklikler bize nasıl ulaşır

- `.github/workflows/source-check.yml` her pazartesi çalışır; Actions sekmesinden elle de başlatılabilir.
- `data/sources.json` içindeki her belgeyi indirip SHA-256 değerini karşılaştırır. Ayrıca `data/source-watch.json` içindeki ÖSYM sınav grubu sayfalarını okur ve henüz kayıtlı olmayan kılavuz, soru kitapçığı ve konu dağılımlarını arar.
- Her bulgu `new-source` etiketli bir issue açar. Aynı bulgu, issue kapatılmış olsa bile ikinci kez açılmaz. Kırık bağlantılar ve erişim hataları istisnadır: sorun tekrar ederse yeniden bildirilir.
- ÖSYM zaman zaman otomatik istemcileri engeller. "ÖSYM'ye erişilemedi" issue'su açılırsa kontrolü yerelde çalıştır:

  ```bash
  npm run check:sources
  ```

## Yeni yılın belgeleri yayımlandığında

Kılavuzların yayımlanma sırasıyla, sınav sınav ilerle (genellikle ilkbaharda MEB-AGS, ardından KPSS Lisans, Ön Lisans, Ortaöğretim ve DHBT).

### 1. Belgeyi kaydet

- [ ] PDF'yi `dokuman.osym.gov.tr` adresinden indir ve ilgili bölümleri oku.
- [ ] `data/sources.json` dosyasına kayıt ekle: yeni `id` (ör. `kpss-lisans-2027`), her dilde `title`, `kind`, `sourceType`, `year`, `url`, `sha256`, `checkedAt`.
- [ ] Önceki yılın kaydını, ona atıf yapan sayfa kaldıkça silme.
- [ ] İlgisiz bir belgeyi kısa bir `reason` ile `data/source-watch.json` içindeki `ignore` listesine ekle.

### 2. Sınav yapısı (`src/content/exams/*.yaml`)

- [ ] Oturumlar, testler, soru sayıları ve süreler.
- [ ] Ders ağırlıkları ve bunlardan türetilen soru sayıları.
- [ ] Eklenen ya da çıkarılan testler, alanlar veya ÖABT branşları.
- [ ] `source.document` yeni belgeyi gösteriyor; dosyanın başındaki yorum kullanılan bölümü belirtiyor.

### 3. Takvim (`data/calendar.yaml`)

- [ ] Kılavuzun ilk sayfalarından başvuru, geç başvuru ve sınav tarihleri ile saatleri.
- [ ] Her kayıttaki `document` yeni belgeyi gösteriyor.
- [ ] Yenileri eklendikten sonra geçmiş yılın kayıtlarını sil.

### 4. Konular (`src/content/topics/<dil>/`)

- [ ] Resmi kapsam cümleleri hâlâ kılavuz ya da konu dağılımıyla örtüşüyor.
- [ ] Frontmatter'da `document`, `sourceYear` ve `updated`; aynı değişiklik her dilde.
- [ ] Yeni konular sınav dosyalarından bağlandı. Bir konu yeniden adlandırılır ya da birleştirilirse eski kimliğini yeni konunun `aliases` listesine yaz; öğrencilerin ilerlemesi korunur.

### 5. Soru dağılımı (her sınavdan sonra)

- [ ] Soru kitapçığını kaydet (`kind: question-booklet`, `sourceType: past-exam-analysis`) ve sınavın `source.booklets` listesine ekle.
- [ ] Konu başına soru sayısını çıkar ve yılı konu frontmatter'ındaki `questionDistribution` alanına ekle (ör. `"2027": 3`).
- [ ] Soru metnini asla repoya kopyalama; yalnızca kitapçığa bağlantı ver.

### 6. Aynı yıl içinde değişen belge

Bir issue kayıtlı bir belgenin değiştiğini bildirdiğinde:

- [ ] Yeni PDF'yi eskisiyle karşılaştır (`pdftotext` ve bir diff aracı işe yarar).
- [ ] Etkilenen her değeri güncelle (2–5. adımlar).
- [ ] Yeni hash'i kaydet:

  ```bash
  npm run check:sources -- --accept <kaynak id>
  ```

### 7. Bitiş

- [ ] `npm test` ve `npm run test:e2e` geçiyor (build referansları, toplamları, takvimi ve çevirileri doğrular).
- [ ] Sınav sayfalarını ve geri sayımı iki dilde kontrol et.
- [ ] Her sınav için bir pull request; kapattığı `new-source` issue'larına bağlantı ver.
