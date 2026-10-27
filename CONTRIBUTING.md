# Katkı rehberi

KPSS Rehber'e katkın için teşekkürler. Bu proje ücretsiz ve ticari değildir; en değerli katkılar **hata bildirimleri**, **konu özetleri** ve **prompt iyileştirmeleri**dir.

## Hızlı başlangıç

```bash
npm ci
npm run dev        # http://localhost:4321/kpss-rehber/
npm test           # birim testleri (Vitest)
npm run test:e2e   # uçtan uca testler (Playwright, build + önizleme)
```

Node 22 gerekir. `npm install` hata verirse repodaki `.npmrc` dosyasının yerinde olduğundan emin ol.

## Veri nerede?

| Dosya | İçerik |
|---|---|
| `src/content/sinavlar/*.yaml` | Sınav → oturum → test → ders → konu referansları |
| `src/content/konular/<ders>/<slug>.md` | Konu bilgileri ve statik özet |
| `src/prompts/sablonlar/*.md` | Prompt şablonları |
| `src/prompts/seviyeler.yaml`, `uzunluklar.yaml` | Seviye ve uzunluk talimatları |
| `data/kaynaklar.json` | Takip edilen resmi ÖSYM belgeleri |
| `data/takvim.yaml` | Başvuru ve sınav tarihleri |

Tüm veri build sırasında doğrulanır. Bozuk referans, yetim konu, tutmayan soru toplamı, kaynaksız kayıt ya da doldurulmamış şablon değişkeni **build'i kırar**; hata mesajı neyi düzeltmen gerektiğini söyler.

## Kaynak kuralı (en önemli kural)

- ÖSYM verisi (soru sayıları, süreler, kapsamlar, tarihler) **ezberden girilmez**. Her kayıt `data/kaynaklar.json`daki resmi bir belgeye bağlanır.
- ÖSYM'nin ayrıntılı listesi olmayan yerlerde konu ağacı çıkmış soru kitapçıklarından türetilir ve `kaynak: cikmis-soru-analizi` olarak işaretlenir.
- **Çıkmış soruların metni siteye kopyalanmaz** (telif ÖSYM'ye aittir). Yalnızca kitapçığın bağlantısı verilir ve istatistik çıkarılır.

## Konu dosyası

```markdown
---
baslik: Osmanlı Tarihi
ders: tarih                      # klasör adıyla aynı olmalı
durum: taslak                    # iskelet | taslak | yayinda
altBasliklar: [Kuruluş dönemi, Yükselme dönemi]
anahtarKavramlar: [tımar, devşirme]
soruTipi: Dönemin olaylarını ve kurumlarını eşleştirme, yorumlama
kaynak: osym-kilavuz             # osym-kilavuz | osym-oabt-kapsam | cikmis-soru-analizi
kaynakYili: 2026
belge: kpss-lisans-2026          # data/kaynaklar.json kimliği
dogrulandi: true
guncelleme: 2026-10-27
soruDagilimi: { 2025: 3, 2026: 2 }   # isteğe bağlı
---

## Temel mantık
...
```

`durum: iskelet` olan konuda `altBasliklar`, `anahtarKavramlar` ve `soruTipi` boş kalabilir; `taslak` ya da `yayinda` olduğunda zorunludur. Özet metni **promptsuz** okunabilmeli: öğrenci yapay zekâ kullanmadan konunun temel mantığını kavramalı.

Yeni konu eklerken onu en az bir sınavın `konular` listesine de ekle; yoksa yetim konu hatası alırsın.

## Prompt şablonu

`src/prompts/sablonlar/<id>.md`:

```markdown
---
baslik: Konuyu anlat
aciklama: Kartta görünen kısa açıklama.
sira: 1
ozel: false          # true ise yalnızca konunun ekPromptlar listesinde görünür
---
Sınav: {{sinav}}
Konu: {{konu}}
Seviye ({{seviyeAdi}}): {{seviyeTalimati}}
...
[SORUYU BURAYA YAPIŞTIR]
```

- Kullanılabilen değişkenler: `sinav, ders, konu, altBasliklar, anahtarKavramlar, soruTipi, seviyeAdi, seviyeTalimati, uzunlukTalimati, tercihler`. Başka bir değişken build'i kırar.
- Öğrencinin dolduracağı alanları `[BÜYÜK HARFLE]` yaz; sayfada vurgulanır.
- Model emin olmadığı bilgiyi kesinmiş gibi yazmamalı; şablonda bunu hatırlat.

## PR akışı

1. Repoyu fork'la, `main`'den bir dal aç (`konu/osmanli-tarihi-ozet`, `duzeltme/takvim-2027` gibi).
2. Değişikliği yap, `npm test` ve `npm run build` çalıştır.
3. PR açıklamasında hangi resmi belgeye dayandığını yaz.
4. CI yeşil olmadan birleştirme yapılmaz.

## Commit kuralları

- Mesajlar Türkçe ve [Conventional Commits](https://www.conventionalcommits.org/tr/) biçiminde: `feat: …`, `fix: …`, `docs: …`, `chore: …`, `test: …`
- Kod ve dosya adları Türkçe (`prompt-doldur.js`, `seviyeler.yaml`).
- Satır sonları LF.

## Lisans

Kod katkıların MIT ([LICENSE](LICENSE)), içerik katkıların (konu metinleri ve prompt şablonları) CC BY-SA 4.0 ([LICENSE-CONTENT](LICENSE-CONTENT)) ile lisanslanır. PR açarak bunu kabul etmiş olursun.

Davranış kuralları için bkz. [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
