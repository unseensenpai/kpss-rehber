import { z } from 'astro/zod';

/** Konu ve sınav verisinin dayandığı belge türleri (spec §5). */
export const KAYNAK_TIPLERI = ['osym-kilavuz', 'osym-oabt-kapsam', 'cikmis-soru-analizi'];

/** iskelet: yalnızca resmi listedeki ad; taslak/yayinda: içerik alanları dolu olmalı. */
export const KONU_DURUMLARI = ['iskelet', 'taslak', 'yayinda'];

const kimlik = z.string().regex(/^[a-z0-9-]+$/, 'yalnızca küçük harf, rakam ve tire');
const konuRef = z.string().regex(/^[a-z0-9-]+\/[a-z0-9-]+$/, "'ders/slug' biçiminde olmalı");
const pozitifTam = z.number().int().positive();
const yuzde = z.number().positive().max(100);

/** `data/kaynaklar.json`: takip edilen resmi belgeler (K7'de hash ile değişiklik kontrolü). */
export const kaynakSemasi = z.object({
  id: kimlik,
  baslik: z.string().min(1),
  tur: z.enum(['kilavuz', 'konu-dagilimi', 'soru-kitapcigi']),
  tip: z.enum(KAYNAK_TIPLERI),
  yil: pozitifTam,
  url: z.url(),
  sha256: z.string().regex(/^[0-9a-f]{64}$/),
  kontrolTarihi: z.coerce.date(),
});

/** `data/takvim.yaml`: başvuru ve sınav tarihleri (geri sayım). */
export const takvimSemasi = z.object({
  id: kimlik,
  sinav: kimlik,
  tur: z.enum(['basvuru', 'gec-basvuru', 'sinav']),
  baslangic: z.coerce.date(),
  bitis: z.coerce.date().optional(),
  saat: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  aciklama: z.string().optional(),
  belge: kimlik,
});

/** Sınavın kaynağı `kaynaklar` koleksiyonundaki bir belgeye bağlanır. */
const sinavKaynak = z.object({
  belge: kimlik,
  dogrulandi: z.boolean(),
});

const dersSemasi = z.object({
  ders: kimlik,
  ad: z.string().min(1),
  soruSayisi: pozitifTam,
  // Kılavuzdaki "yaklaşık ağırlık"; varsa soru sayısı bundan türetilmiş demektir.
  agirlik: yuzde.optional(),
  konular: z.array(konuRef),
});

const testSemasi = z.object({
  ad: z.string().min(1),
  soruSayisi: pozitifTam,
  sureDk: pozitifTam.optional(),
  dersler: z.array(dersSemasi).min(1),
});

const oturumSemasi = z
  .object({
    ad: z.string().min(1),
    sureDk: pozitifTam.optional(),
    // ÖABT gibi: aday oturumdaki testlerden yalnızca birine girer.
    tekTestSecilir: z.boolean().default(false),
    testler: z.array(testSemasi).min(1),
  })
  .refine((o) => o.sureDk || o.testler.every((t) => t.sureDk), {
    message: 'oturumun ya da her testin sureDk alanı olmalı',
    path: ['sureDk'],
  });

export const sinavSemasi = z.object({
  ad: z.string().min(1),
  kisaAd: z.string().min(1),
  aciklama: z.string().optional(),
  kaynak: sinavKaynak,
  oturumlar: z.array(oturumSemasi).min(1),
});

export const konuSemasi = z
  .object({
    baslik: z.string().min(1),
    ders: kimlik,
    durum: z.enum(KONU_DURUMLARI).default('iskelet'),
    altBasliklar: z.array(z.string().min(1)).default([]),
    anahtarKavramlar: z.array(z.string().min(1)).default([]),
    soruTipi: z.string().min(1).optional(),
    kaynak: z.enum(KAYNAK_TIPLERI),
    kaynakYili: pozitifTam,
    // Konu adı/kapsamı resmi belgede görüldüyse true; belge kaynaklar koleksiyonundaki kimlik.
    dogrulandi: z.boolean().default(false),
    belge: kimlik.optional(),
    guncelleme: z.coerce.date(),
    soruDagilimi: z.record(z.string().regex(/^\d{4}$/), z.number().int().nonnegative()).optional(),
    ekPromptlar: z.array(z.string().min(1)).optional(),
    takmaAdlar: z.array(z.string().min(1)).optional(),
  })
  .superRefine((k, ctx) => {
    if (k.durum === 'iskelet') return;
    for (const alan of ['altBasliklar', 'anahtarKavramlar']) {
      if (!k[alan].length) ctx.addIssue({ code: 'custom', path: [alan], message: `${k.durum} konuda boş olamaz` });
    }
    if (!k.soruTipi) ctx.addIssue({ code: 'custom', path: ['soruTipi'], message: `${k.durum} konuda zorunlu` });
  });
