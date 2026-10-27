import { z } from 'astro/zod';

/** Konu ve sınav verisinin dayandığı belge türleri (spec §5). */
export const KAYNAK_TIPLERI = ['osym-kilavuz', 'osym-oabt-kapsam', 'cikmis-soru-analizi'];

const kimlik = z.string().regex(/^[a-z0-9-]+$/, 'yalnızca küçük harf, rakam ve tire');
const konuRef = z.string().regex(/^[a-z0-9-]+\/[a-z0-9-]+$/, "'ders/slug' biçiminde olmalı");
const pozitifTam = z.number().int().positive();

/** Sınav kaynağı. `dogrulandi: true` ise resmi belge bağlantısı zorunlu. */
const sinavKaynak = z
  .object({
    tip: z.enum(KAYNAK_TIPLERI),
    yil: pozitifTam,
    url: z.url().optional(),
    dogrulandi: z.boolean(),
  })
  .refine((k) => !k.dogrulandi || k.url, {
    message: 'doğrulanmış kaynağın url alanı olmalı',
    path: ['url'],
  });

export const sinavSemasi = z.object({
  ad: z.string().min(1),
  kaynak: sinavKaynak,
  oturumlar: z
    .array(
      z.object({
        ad: z.string().min(1),
        sureDk: pozitifTam,
        testler: z
          .array(
            z.object({
              ad: z.string().min(1),
              soruSayisi: pozitifTam,
              dersler: z
                .array(
                  z.object({
                    ders: kimlik,
                    soruSayisi: pozitifTam,
                    konular: z.array(konuRef),
                  }),
                )
                .min(1),
            }),
          )
          .min(1),
      }),
    )
    .min(1),
});

export const konuSemasi = z.object({
  baslik: z.string().min(1),
  ders: kimlik,
  altBasliklar: z.array(z.string().min(1)).min(1),
  anahtarKavramlar: z.array(z.string().min(1)).min(1),
  soruTipi: z.string().min(1),
  kaynak: z.enum(KAYNAK_TIPLERI),
  kaynakYili: pozitifTam,
  // K3'te resmi belgeyle karşılaştırılana kadar false kalır.
  dogrulandi: z.boolean().default(false),
  guncelleme: z.coerce.date(),
  soruDagilimi: z.record(z.string().regex(/^\d{4}$/), z.number().int().nonnegative()).optional(),
  ekPromptlar: z.array(z.string().min(1)).optional(),
  takmaAdlar: z.array(z.string().min(1)).optional(),
});
