import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { konuSemasi, sinavSemasi } from './lib/semalar.js';

const sinavlar = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/sinavlar' }),
  schema: sinavSemasi,
});

// Kimlik klasör yolundan gelir: konular/tarih/osmanli-kurulus.md → 'tarih/osmanli-kurulus'.
const konular = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/konular' }),
  schema: konuSemasi,
});

export const collections = { sinavlar, konular };
