import { describe, expect, it } from 'vitest';
import {
  announcementLinks, checkSource, decodeEntities, documentLinks, extractLinks, findingKey, groupFindings,
  groupKeys, isBlockPage, isBookletPage, issueFor, newDocuments, normalizeUrl, silencedKeys, yearOf,
} from '../../tools/lib/source-check.js';

const SITE = 'https://www.osym.gov.tr';
const source = { id: 'kpss-lisans-2026', url: 'https://dokuman.osym.gov.tr/web/2026/7/a.pdf', sha256: 'aaa', year: 2026 };
const pdf = (sha256) => ({ status: 200, contentType: 'application/pdf', sha256 });

describe('link extraction', () => {
  it('decodes numeric and named entities', () => {
    expect(decodeEntities('K&#x131;lavuz&nbsp;&amp; Kitap&#231;ık')).toBe('Kılavuz & Kitapçık');
    expect(decodeEntities('Kamu Y&ouml;netimi, &Ouml;ABT, &scedil;&uuml;phe, &unknown;')).toBe('Kamu Yönetimi, ÖABT, şüphe, &unknown;');
  });

  it('collapses duplicate slashes and drops the hash', () => {
    expect(normalizeUrl('https://dokuman.osym.gov.tr/web//2026/9/x.pdf#p2')).toBe('https://dokuman.osym.gov.tr/web/2026/9/x.pdf');
    expect(normalizeUrl('/2026-kpss', SITE)).toBe(`${SITE}/2026-kpss`);
  });

  it('reads anchors with their text, falling back to title', () => {
    const html = `
      <a href="/a" title="ignored">Visible <b>text</b></a>
      <a href="https://dokuman.osym.gov.tr/web//2026/9/b.pdf" title="2026-KPSS Ba&#x15F;vuru K&#x131;lavuzu"></a>
      <a href="#top">top</a><a href="javascript:void(0)">x</a>`;
    expect(extractLinks(html, SITE)).toEqual([
      { url: `${SITE}/a`, text: 'Visible text' },
      { url: 'https://dokuman.osym.gov.tr/web/2026/9/b.pdf', text: '2026-KPSS Başvuru Kılavuzu' },
    ]);
  });

  it('finds the year in slugs and paths', () => {
    expect(yearOf('/2026kpss-lisans-kilavuz')).toBe(2026);
    expect(yearOf('/kpss20252-tercih')).toBe(null);
    expect(yearOf('/pdfdokuman/2026/KPSS/x.pdf')).toBe(2026);
  });
});

describe('page filters', () => {
  const links = [
    { url: `${SITE}/2026kpss-lisans-kilavuz-ve-basvuru-bilgileri` },
    { url: `${SITE}/2026-kpss-on-lisans-temel-soru-kitapcigi-ve-cevap-anahtari-10` },
    { url: `${SITE}/2026-kpss-on-lisans-temel-soru-kitapcigi-ve-cevap-anahtari-10` },
    { url: `${SITE}/2024-kpss-kilavuz` },
    { url: `${SITE}/2026-kpss-sinav-sonuclari-aciklandi` },
    { url: `${SITE}/Sayfa/2026-kilavuz` },
    { url: 'https://example.com/2026-kilavuz' },
  ];

  it('keeps current announcements about guides, booklets and topic distributions', () => {
    expect(announcementLinks(links, { site: SITE, minYear: 2026 }).map((l) => l.url)).toEqual([
      `${SITE}/2026kpss-lisans-kilavuz-ve-basvuru-bilgileri`,
      `${SITE}/2026-kpss-on-lisans-temel-soru-kitapcigi-ve-cevap-anahtari-10`,
    ]);
  });

  it('keeps ÖSYM PDFs that are guides, booklets or topic distributions', () => {
    const docs = [
      { url: 'https://dokuman.osym.gov.tr/pdfdokuman/2026/KPSS/LISANS/kilavuz_Ld01072026.pdf', text: 'Başvuru Kılavuzu' },
      { url: 'https://dokuman.osym.gov.tr/web/2026/9/kitapcik.pdf', text: 'Temel Soru Kitapçığı' },
      { url: 'https://dokuman.osym.gov.tr/pdfdokuman/2026/MEB-AGS/konudagilimi08012026.pdf', text: 'Konu Dağılımları' },
      { url: 'https://dokuman.osym.gov.tr/pdfdokuman/2026/KPSS/LISANS/ebk.pdf', text: 'Engelli Başvuru Kullanıcı Kılavuzu' },
      { url: 'https://dokuman.osym.gov.tr/pdfdokuman/2026/KPSS/LISANS/bm.pdf', text: 'Başvuru Merkezleri' },
      { url: 'https://dokuman.osym.gov.tr/pdfdokuman/2025/KPSS/kilavuz.pdf', text: 'Kılavuz' },
      { url: 'https://example.com/2026/kilavuz.pdf', text: 'Kılavuz' },
    ];
    expect(documentLinks(docs, { minYear: 2026 }).map((d) => d.text)).toEqual([
      'Başvuru Kılavuzu', 'Temel Soru Kitapçığı', 'Konu Dağılımları',
    ]);
  });

  it('keeps every PDF on a booklet announcement, whose links carry only subject names', () => {
    const docs = [
      { url: 'https://dokuman.osym.gov.tr/web/2026/9/kamu-yonetimi-abuck9-13135237.pdf', text: 'Kamu Yönetimi' },
      { url: 'https://dokuman.osym.gov.tr/web/2026/9/ebk.pdf', text: 'Kullanıcı Kılavuzu' },
    ];
    expect(documentLinks(docs, { minYear: 2026 })).toEqual([]);
    expect(documentLinks(docs, { minYear: 2026, all: true }).map((d) => d.text)).toEqual(['Kamu Yönetimi']);
    expect(isBookletPage(`${SITE}/2026-kpss-a-grubu-temel-soru-kitapciklari-ve-cevap-anahtarlari-10`)).toBe(true);
    expect(isBookletPage(`${SITE}/2026kpss-lisans-kilavuz-ve-basvuru-bilgileri`)).toBe(false);
  });

  it('recognizes the ÖSYM block page', () => {
    expect(isBlockPage('<html><head><title>Erişim Engellendi</title>')).toBe(true);
    expect(isBlockPage('<title>Eri&#x15F;im Engellendi</title>')).toBe(true);
    expect(isBlockPage('<title>KPSS</title>')).toBe(false);
  });
});

describe('checkSource', () => {
  it('passes an unchanged PDF', () => {
    expect(checkSource(source, pdf('aaa'))).toBe(null);
  });

  it('reports a changed hash', () => {
    expect(checkSource(source, pdf('bbb'))).toEqual({ kind: 'changed', id: source.id, url: source.url, oldHash: 'aaa', newHash: 'bbb' });
  });

  it('reports a missing document and an HTML page in place of the PDF as broken', () => {
    expect(checkSource(source, { status: 404, contentType: 'text/html' })).toMatchObject({ kind: 'broken', status: 404 });
    expect(checkSource(source, { status: 200, contentType: 'text/html' })).toMatchObject({ kind: 'broken', status: '200 (text/html)' });
  });

  it('reports network errors and the block page as access problems, not changes', () => {
    expect(checkSource(source, { error: 'timeout' })).toEqual({ kind: 'blocked', url: source.url, reason: 'timeout' });
    expect(checkSource(source, { status: 200, contentType: 'text/html', blocked: true })).toMatchObject({ kind: 'blocked' });
  });
});

describe('newDocuments', () => {
  it('skips registered, ignored and repeated documents', () => {
    const found = [
      { url: source.url, text: 'known', page: 'p' },
      { url: 'https://dokuman.osym.gov.tr/web/2026/9/ignored.pdf', text: 'ignored', page: 'p' },
      { url: 'https://dokuman.osym.gov.tr/web/2026/9/new.pdf', text: 'new', page: 'p1' },
      { url: 'https://dokuman.osym.gov.tr/web/2026/9/new.pdf', text: 'new', page: 'p2' },
    ];
    const ignore = [{ url: 'https://dokuman.osym.gov.tr/web//2026/9/ignored.pdf', reason: 'not an exam document' }];
    expect(newDocuments(found, [source], ignore)).toEqual([
      { kind: 'new', url: 'https://dokuman.osym.gov.tr/web/2026/9/new.pdf', text: 'new', page: 'p1' },
    ]);
  });
});

describe('issue deduplication', () => {
  const issue = (key, state) => ({ state, body: `text\n<!-- source-check-key: ${key} -->` });

  it('builds stable keys', () => {
    expect(findingKey({ kind: 'new', url: 'u' })).toBe('new:u');
    expect(findingKey({ kind: 'changed', id: 'x', newHash: 'h' })).toBe('changed:x:h');
    expect(findingKey({ kind: 'broken', id: 'x' })).toBe('broken:x');
    expect(findingKey({ kind: 'blocked', items: [] })).toBe('blocked');
  });

  it('never reopens new or changed documents, but lets broken links and access errors recur once closed', () => {
    const keys = silencedKeys([
      issue('new:u', 'closed'),
      issue('changed:x:h', 'closed'),
      issue('broken:x', 'closed'),
      issue('blocked', 'closed'),
      issue('broken:y', 'open'),
      { state: 'open', body: null },
    ]);
    expect([...keys].sort()).toEqual(['broken:y', 'changed:x:h', 'new:u']);
  });

  it('a new hash of an already reported document is a new finding', () => {
    const keys = silencedKeys([issue('changed:x:h1', 'closed')]);
    expect(keys.has(findingKey({ kind: 'changed', id: 'x', newHash: 'h2' }))).toBe(false);
  });

  it('groups access errors into one finding and new documents by page', () => {
    const grouped = groupFindings([
      { kind: 'blocked', url: 'a', reason: 'timeout' },
      { kind: 'new', url: 'n1', text: 'one', page: 'p' },
      { kind: 'changed', id: 'x', newHash: 'h' },
      { kind: 'new', url: 'n2', text: 'two', page: 'q' },
      { kind: 'new', url: 'n3', text: 'three', page: 'p' },
      { kind: 'blocked', url: 'b', reason: 'block page' },
    ]);
    expect(grouped).toEqual([
      { kind: 'new', page: 'p', items: [{ url: 'n1', text: 'one' }, { url: 'n3', text: 'three' }] },
      { kind: 'changed', id: 'x', newHash: 'h' },
      { kind: 'new', page: 'q', items: [{ url: 'n2', text: 'two' }] },
      { kind: 'blocked', items: [{ url: 'a', reason: 'timeout' }, { url: 'b', reason: 'block page' }] },
    ]);
    expect(groupKeys(grouped[0])).toEqual(['new:n1', 'new:n3']);
  });
});

describe('issueFor', () => {
  const findings = [
    { kind: 'new', url: 'https://dokuman.osym.gov.tr/web/2026/9/a.pdf', text: 'Kamu Yönetimi', page: `${SITE}/p` },
    { kind: 'new', url: 'https://dokuman.osym.gov.tr/web/2026/9/b.pdf', text: 'Hukuk', page: `${SITE}/p` },
    { kind: 'changed', id: 'x', url: 'u', oldHash: 'a'.repeat(64), newHash: 'b'.repeat(64) },
    { kind: 'broken', id: 'x', url: 'u', status: 404 },
    { kind: 'blocked', url: 'u', reason: 'timeout' },
  ];

  it('embeds every finding key so a grouped issue silences each document', () => {
    for (const group of groupFindings(findings)) {
      const { title, body } = issueFor(group);
      expect(title).toMatch(/^\[Kaynak\] /);
      const silenced = silencedKeys([{ state: 'open', body }]);
      for (const key of groupKeys(group)) expect(silenced.has(key)).toBe(true);
    }
    const all = silencedKeys(groupFindings(findings).map((g) => ({ state: 'open', body: issueFor(g).body })));
    for (const finding of findings) expect(all.has(findingKey(finding))).toBe(true);
  });

  it('names the first document and counts the rest in the title', () => {
    expect(issueFor(groupFindings(findings)[0]).title).toBe('[Kaynak] Yeni belge / New document: Kamu Yönetimi (+1)');
  });

  it('tells how to accept a changed document', () => {
    expect(issueFor(findings[2]).body).toContain('npm run check:sources -- --accept x');
  });
});
