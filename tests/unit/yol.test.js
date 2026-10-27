import { describe, expect, it } from 'vitest';
import { yol } from '../../src/lib/yol.js';

describe('yol', () => {
  it('base önekini ekler', () => {
    expect(yol('/tarih', '/kpss-rehber')).toBe('/kpss-rehber/tarih');
  });
  it('sondaki ve baştaki eğik çizgileri tekilleştirir', () => {
    expect(yol('tarih', '/kpss-rehber/')).toBe('/kpss-rehber/tarih');
  });
  it('kök base ile çalışır', () => {
    expect(yol('/profil', '/')).toBe('/profil');
  });
});
