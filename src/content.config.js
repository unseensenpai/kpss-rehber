import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { kaynakSemasi, konuSemasi, sinavSemasi, takvimSemasi } from './lib/semalar.js';

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

export const collections = { sinavlar, konular, kaynaklar, takvim };
