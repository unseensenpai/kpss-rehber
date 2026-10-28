# Katkı rehberi

[English](CONTRIBUTING.md) · **Türkçe**

KPSS Rehber'e katkın için teşekkürler. Bu proje ücretsiz ve ticari değildir; en değerli katkılar **hata bildirimleri**, **konu özetleri**, **çeviriler** ve **prompt iyileştirmeleri**dir.

## Hızlı başlangıç

```bash
npm ci
npm run dev        # http://localhost:4321/kpss-rehber/
npm test           # birim testleri (Vitest)
npm run test:e2e   # uçtan uca testler (Playwright, build + önizleme)
```

Node 22 gerekir. `npm install` hata verirse repodaki `.npmrc` dosyasının yerinde olduğundan emin ol.

## Veri nerede?

| Yol | İçerik |
|---|---|
| `src/content/exams/*.yaml` | Sınav → oturum → test → ders → konu referansları; görünen adlar `{ tr, en }` biçiminde |
| `src/content/topics/<dil>/<ders>/<slug>.md` | Her konu ve dil için bir dosya |
| `src/prompts/templates/<dil>/*.md` | Dile göre prompt şablonları |
| `src/prompts/levels.yaml`, `lengths.yaml` | Seviye ve uzunluk talimatları (`{ tr, en }`) |
| `src/i18n/tr.js`, `en.js` | Arayüz metinleri; iki sözlüğün anahtarları aynı olmalı |
| `data/sources.json` | Takip edilen resmi ÖSYM belgeleri |
| `data/calendar.yaml` | Başvuru ve sınav tarihleri |
| `data/source-watch.json` | Haftalık kaynak kontrolünün okuduğu ÖSYM sayfaları ve yok sayacağı belgeler |

Tüm veri build sırasında doğrulanır. Bozuk referans, yetim konu, tutmayan soru toplamı, kaynaksız kayıt, eksik çeviri ya da doldurulmamış şablon değişkeni **build'i kırar**; hata mesajı neyi düzeltmen gerektiğini söyler.

Haftalık bir iş (`npm run check:sources`) yeni ya da değişen ÖSYM belgelerini `new-source` etiketli issue olarak bildirir. Siteyi yeni sınav yılına taşıma adımları [docs/ANNUAL-REVIEW.tr.md](docs/ANNUAL-REVIEW.tr.md), bir özetin incelenip yayına alınması [docs/REVIEW.tr.md](docs/REVIEW.tr.md) dosyasında.

## Kaynak kuralı (en önemli kural)

- ÖSYM verisi (soru sayıları, süreler, kapsamlar, tarihler) **ezberden girilmez**. Her kayıt `data/sources.json`daki resmi bir belgeye bağlanır.
- ÖSYM'nin ayrıntılı listesi olmayan yerlerde konu ağacı çıkmış soru kitapçıklarından türetilir ve `sourceType: past-exam-analysis` olarak işaretlenir.
- **Çıkmış soruların metni siteye kopyalanmaz** (telif ÖSYM'ye aittir). Yalnızca kitapçığın bağlantısı verilir ve istatistik çıkarılır.

## Konu dosyası

`src/content/topics/tr/tarih/osmanli-tarihi.md`:

```markdown
---
title: Osmanlı Tarihi
subject: tarih                   # klasör adıyla aynı olmalı
state: draft                     # skeleton | draft | published
subtopics: [Kuruluş dönemi, Yükselme dönemi]
keyConcepts: [tımar, devşirme]
questionStyle: Dönemin olaylarını ve kurumlarını eşleştirme, yorumlama
sourceType: osym-guide           # osym-guide | osym-oabt-scope | past-exam-analysis
sourceYear: 2026
document: kpss-lisans-2026       # data/sources.json kimliği
verified: true
updated: 2026-10-27
questionDistribution: { 2025: 3, 2026: 2 }   # isteğe bağlı
---

## Temel mantık
...
```

- `state: skeleton` olan konuda `subtopics`, `keyConcepts` ve `questionStyle` boş kalabilir; `draft` ya da `published` olduğunda zorunludur.
- `state: published`, bu dildeki dosyanın bir inceleyiciden geçtiği anlamına gelir; `reviewedBy` ve `reviewedAt` ister ve `npm run review` ile verilir ([docs/REVIEW.tr.md](docs/REVIEW.tr.md)). Yeni özetler `draft` olarak başlar.
- Özet **promptsuz** okunabilmeli: öğrenci yapay zekâ kullanmadan konunun temel mantığını kavramalı.
- Her konunun **her dilde** bir dosyası olmalı (`topics/tr/...` ve `topics/en/...`). Çevrilmeyen alanlar (`subject`, `sourceType`, `sourceYear`, `verified`, `document`, `questionDistribution`, `extraPrompts`, `aliases`) tüm dillerde aynı olmalı.
- Yeni konu eklerken onu en az bir sınavın `topics` listesine de ekle; yoksa yetim konu hatası alırsın.
- Konu kimlikleri (`ders/slug`) öğrencilerin yedeklerinde saklanır. Değiştirmen gerekirse eski kimliği `aliases` listesine yaz ki ilerleme taşınsın.

## Prompt şablonu

`src/prompts/templates/<dil>/<id>.md`:

```markdown
---
title: Konuyu anlat
description: Kartta görünen kısa açıklama.
order: 1
special: false       # true ise yalnızca konunun extraPrompts listesinde görünür
---
Sınav: {{exam}}
Konu: {{topic}}
Seviye ({{levelName}}): {{levelInstruction}}
...
[SORUYU BURAYA YAPIŞTIR]
```

- Kullanılabilen değişkenler: `exam, subject, topic, subtopics, keyConcepts, questionStyle, levelName, levelInstruction, lengthInstruction, preferences`. Başka bir değişken build'i kırar.
- Öğrencinin dolduracağı alanları `[BÜYÜK HARFLE]` yaz; sayfada vurgulanır.
- Aynı şablon kimliği her dilde aynı `order` ve `special` değeriyle bulunmalı.
- Model emin olmadığı bilgiyi kesinmiş gibi yazmamalı; şablonda bunu hatırlat.

## Yeni dil eklemek

1. Dil kodunu `src/i18n/locales.js` içindeki `LOCALES` listesine, adını `src/i18n/index.js` içindeki `LANGUAGE_NAMES`/`INTL_LOCALE`'a ekle.
2. `tr.js` ile aynı anahtarlara sahip `src/i18n/<dil>.js` dosyasını oluştur (birim testi bunu denetler) ve `DICTIONARIES`'e kaydet.
3. Tüm `{ tr, en }` alanlarına yeni dilin değerini ekle; tüm konu ve şablon klasörlerini çevir.
4. `npm run build` eksik kalan her şeyi listeler.

## Kod stili

- Kod, dosya adları, tanımlayıcılar ve yorumlar **İngilizce**. Arayüz metni yalnızca `src/i18n/*.js` içinde durur; bileşenlere görünen metin gömülmez.
- Site içi bağlantılar `localePath(locale, '/yol/')` ile yazılır.
- Satır sonları LF.

## PR akışı

1. Repoyu fork'la, `main`'den bir dal aç (`topic/ottoman-history-summary`, `fix/calendar-2027` gibi).
2. Değişikliği yap, `npm test` ve `npm run build` çalıştır.
3. PR açıklamasında hangi resmi belgeye dayandığını yaz.
4. CI yeşil olmadan birleştirme yapılmaz.

Commit mesajları İngilizce ve [Conventional Commits](https://www.conventionalcommits.org/tr/) biçimindedir: `feat: …`, `fix: …`, `docs: …`, `chore: …`, `test: …`, `content: …`.

## Lisans

Kod katkıların MIT ([LICENSE](LICENSE)), içerik katkıların (konu metinleri ve prompt şablonları) CC BY-SA 4.0 ([LICENSE-CONTENT](LICENSE-CONTENT)) ile lisanslanır. PR açarak bunu kabul etmiş olursun.

Davranış kuralları için bkz. [CODE_OF_CONDUCT.tr.md](CODE_OF_CONDUCT.tr.md).
