import { describe, expect, it } from 'vitest';
import { frontmatter, progress, publish, unpublish } from '../../tools/lib/review.js';

const file = `---
title: "Rehberlik"
subject: egitim-bilimleri
state: draft
keyConcepts: [gizlilik, sevk]
verified: true
updated: 2026-10-28
---

## Temel fikir
`;

describe('frontmatter', () => {
  it('reads top-level scalars and skips lists', () => {
    expect(frontmatter(file)).toEqual({ title: 'Rehberlik', subject: 'egitim-bilimleri', state: 'draft', verified: 'true', updated: '2026-10-28' });
  });
  it('accepts CRLF files and rejects files without frontmatter', () => {
    expect(frontmatter(file.replace(/\n/g, '\r\n')).state).toBe('draft');
    expect(() => frontmatter('# no frontmatter')).toThrow();
  });
});

describe('publish / unpublish', () => {
  it('sets the state and adds the review after updated, keeping the body', () => {
    const out = publish(file, { by: 'Ayşe "Hoca"', date: '2026-10-29' });
    expect(out).toContain('state: published\n');
    expect(out).toContain('updated: 2026-10-28\nreviewedBy: "Ayşe \\"Hoca\\""\nreviewedAt: 2026-10-29\n---\n\n## Temel fikir\n');
    expect(frontmatter(out).reviewedBy).toBe('Ayşe "Hoca"');
  });
  it('a second review replaces the first', () => {
    const twice = publish(publish(file, { by: 'A', date: '2026-10-29' }), { by: 'B', date: '2026-11-01' });
    expect(twice.match(/reviewedBy/g)).toHaveLength(1);
    expect(frontmatter(twice)).toMatchObject({ reviewedBy: 'B', reviewedAt: '2026-11-01' });
  });
  it('refuses skeletons, unverified topics, missing names and reviews older than the last edit', () => {
    expect(() => publish(file.replace('state: draft', 'state: skeleton'), { by: 'A', date: '2026-10-29' })).toThrow(/skeleton/);
    expect(() => publish(file.replace('verified: true', 'verified: false'), { by: 'A', date: '2026-10-29' })).toThrow(/verified/);
    expect(() => publish(file, { by: ' ', date: '2026-10-29' })).toThrow(/reviewer/);
    expect(() => publish(file, { by: 'A', date: '2026-10-27' })).toThrow(/after the review/);
    expect(() => publish(file, { by: 'A', date: '29.10.2026' })).toThrow(/YYYY-MM-DD/);
  });
  it('unpublish restores the draft exactly', () => {
    expect(unpublish(publish(file, { by: 'A', date: '2026-10-29' }))).toBe(file);
  });
});

describe('progress', () => {
  it('counts states per locale and lists files edited after review', () => {
    const { counts, stale } = progress([
      { id: 'a/x', locale: 'tr', fields: { state: 'published', updated: '2026-10-28', reviewedAt: '2026-10-28' } },
      { id: 'a/y', locale: 'tr', fields: { state: 'published', updated: '2026-11-02', reviewedAt: '2026-10-28' } },
      { id: 'a/x', locale: 'en', fields: { state: 'draft' } },
      { id: 'a/z', locale: 'en', fields: {} },
    ]);
    expect(counts).toEqual({ tr: { skeleton: 0, draft: 0, published: 2 }, en: { skeleton: 1, draft: 1, published: 0 } });
    expect(stale).toEqual(['tr/a/y']);
  });
});
