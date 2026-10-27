import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import {
  kaynakSemasi,
  konuSemasi,
  sablonSemasi,
  seviyeSemasi,
  sinavSemasi,
  takvimSemasi,
  uzunlukSemasi,
} from './lib/semalar.js';

const sinavlar = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/sinavlar' }),
  schema: sinavSemasi,
});

// Kimlik klasör yolundan gelir: konular/tarih/osmanli-tarihi.md → 'tarih/osmanli-tarihi'.
const konular = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/konular' }),
  schema: konuSemasi,
});

const kaynaklar = defineCollection({
  loader: file('./data/kaynaklar.json'),
  schema: kaynakSemasi,
});

const takvim = defineCollection({
  loader: file('./data/takvim.yaml'),
  schema: takvimSemasi,
});

// Prompt şablonları: gövde ham metin olarak kullanılır (entry.body), Markdown olarak işlenmez.
const sablonlar = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/prompts/sablonlar' }),
  schema: sablonSemasi,
});

const seviyeler = defineCollection({
  loader: file('./src/prompts/seviyeler.yaml'),
  schema: seviyeSemasi,
});

const uzunluklar = defineCollection({
  loader: file('./src/prompts/uzunluklar.yaml'),
  schema: uzunlukSemasi,
});

export const collections = { sinavlar, konular, kaynaklar, takvim, sablonlar, seviyeler, uzunluklar };
