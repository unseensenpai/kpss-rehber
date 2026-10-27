// Pure logic of the weekly source check: link extraction, comparison and issue text.
// Network and GitHub calls live in tools/source-check.mjs so this file stays testable.

export const USER_AGENT = 'kpss-rehber-source-check (+https://github.com/unseensenpai/kpss-rehber)';
export const LABEL = 'new-source';
export const KEY_PREFIX = '<!-- source-check-key: ';

/** ÖSYM serves a 200 HTML page titled "Erişim Engellendi" when it blocks a client. */
const BLOCK_PAGE = /<title>\s*Eri(ş|&#x15F;)im Engellendi/i;
const DOCUMENT_HOST = 'dokuman.osym.gov.tr';

// Named entities seen on ÖSYM pages: the HTML basics plus Turkish letters.
const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  ccedil: 'ç', Ccedil: 'Ç', ouml: 'ö', Ouml: 'Ö', uuml: 'ü', Uuml: 'Ü',
  gbreve: 'ğ', Gbreve: 'Ğ', scedil: 'ş', Scedil: 'Ş', imath: 'ı', inodot: 'ı', Idot: 'İ',
};

export function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (match, code) => {
    if (code[0] === '#') {
      const value = code[1] === 'x' || code[1] === 'X' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return String.fromCodePoint(value);
    }
    return ENTITIES[code] ?? ENTITIES[code.toLowerCase()] ?? match;
  });
}

/** Absolute URL with duplicate slashes in the path collapsed (ÖSYM links mix `web//2026` and `web/2026`). */
export function normalizeUrl(href, base) {
  const url = new URL(href, base);
  url.pathname = url.pathname.replace(/\/{2,}/g, '/');
  url.hash = '';
  return url.href;
}

/** Every `<a href>` on a page with its visible text (or title when the text is empty). */
export function extractLinks(html, base) {
  const links = [];
  for (const [, attrs, inner] of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const href = attrs.match(/\bhref="([^"]*)"/i)?.[1]?.trim();
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) continue;
    let url;
    try { url = normalizeUrl(decodeEntities(href), base); } catch { continue; }
    const text = decodeEntities(inner.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
    const title = decodeEntities(attrs.match(/\btitle="([^"]*)"/i)?.[1] ?? '').replace(/\s+/g, ' ').trim();
    links.push({ url, text: text || title });
  }
  return links;
}

/** First four-digit year (2000–2099) in a string, or null. */
export function yearOf(text) {
  const match = text.match(/(?:^|[^0-9])(20[0-9]{2})(?![0-9])/);
  return match ? Number(match[1]) : null;
}

// `kitapc` covers both "kitapcik" and "kitapcigi" in slugs.
const ANNOUNCEMENT = /kilavuz|kitapc|konu-dagilim/i;
const DOCUMENT = /kılavuz|kilavuz|kitapçı|kitapci|konu dağılım|konudagilim|konu-dagilim/i;
const NOT_A_DOCUMENT = /kullanıcı kılavuz|kullanici-kilavuz/i;

/** Announcement pages on an exam-group page that may carry guides, booklets or topic distributions. */
export function announcementLinks(links, { site, minYear }) {
  const seen = new Set();
  return links.filter(({ url }) => {
    const { origin, pathname } = new URL(url);
    if (origin !== site || seen.has(url)) return false;
    const slug = pathname.slice(1);
    if (slug.includes('/') || !ANNOUNCEMENT.test(slug)) return false;
    const year = yearOf(slug);
    if (year === null || year < minYear) return false;
    seen.add(url);
    return true;
  });
}

/**
 * ÖSYM PDF links that look like guides, question booklets or topic distributions.
 * `all` keeps every PDF: booklet announcements label their links with subject names only.
 */
export function documentLinks(links, { minYear, all = false }) {
  return links.filter(({ url, text }) => {
    const { hostname, pathname } = new URL(url);
    if (hostname !== DOCUMENT_HOST || !pathname.toLowerCase().endsWith('.pdf')) return false;
    const label = `${text} ${pathname}`;
    if ((!all && !DOCUMENT.test(label)) || NOT_A_DOCUMENT.test(label)) return false;
    const year = yearOf(pathname);
    return year !== null && year >= minYear;
  });
}

/** Booklet announcements, whose PDFs are all question booklets. */
export function isBookletPage(url) {
  return /kitapc/i.test(new URL(url).pathname);
}

export function isBlockPage(html) {
  return BLOCK_PAGE.test(html);
}

/**
 * Classifies the response for a registered source.
 * @param {{status:number, contentType:string, sha256?:string, error?:string, blocked?:boolean}} response
 */
export function checkSource(source, response) {
  if (response.error) return { kind: 'blocked', url: source.url, reason: response.error };
  if (response.blocked) return { kind: 'blocked', url: source.url, reason: 'block page' };
  if (response.status !== 200) return { kind: 'broken', id: source.id, url: source.url, status: response.status };
  if (!response.contentType.includes('pdf')) {
    return { kind: 'broken', id: source.id, url: source.url, status: `200 (${response.contentType || 'no content type'})` };
  }
  if (response.sha256 !== source.sha256) {
    return { kind: 'changed', id: source.id, url: source.url, oldHash: source.sha256, newHash: response.sha256 };
  }
  return null;
}

/** Documents found on ÖSYM pages that are neither registered sources nor ignored. */
export function newDocuments(found, sources, ignore = []) {
  const known = new Set([...sources.map((s) => normalizeUrl(s.url)), ...ignore.map((i) => normalizeUrl(i.url))]);
  const result = new Map();
  for (const doc of found) {
    if (known.has(doc.url) || result.has(doc.url)) continue;
    result.set(doc.url, { kind: 'new', ...doc });
  }
  return [...result.values()];
}

/** Stable key of a single finding, used to avoid reporting it twice. */
export function findingKey(finding) {
  switch (finding.kind) {
    case 'new': return `new:${finding.url}`;
    case 'changed': return `changed:${finding.id}:${finding.newHash}`;
    case 'broken': return `broken:${finding.id}`;
    case 'blocked': return 'blocked';
    default: throw new Error(`Unknown finding kind: ${finding.kind}`);
  }
}

/** Keys of past issues that silence a finding. Broken links and access errors may recur once closed. */
export function silencedKeys(issues) {
  const keys = new Set();
  for (const issue of issues) {
    for (const [, key] of (issue.body ?? '').matchAll(/<!-- source-check-key: (.+?) -->/g)) {
      const recurring = key === 'blocked' || key.startsWith('broken:');
      if (issue.state === 'open' || !recurring) keys.add(key);
    }
  }
  return keys;
}

/**
 * One issue per problem, not per URL: access errors become a single finding and
 * new documents are grouped by the page they were found on.
 */
export function groupFindings(findings) {
  const result = [];
  const pages = new Map();
  let blocked = null;
  for (const finding of findings) {
    if (finding.kind === 'blocked') {
      blocked ??= { kind: 'blocked', items: [] };
      blocked.items.push({ url: finding.url, reason: finding.reason });
    } else if (finding.kind === 'new') {
      if (!pages.has(finding.page)) {
        const group = { kind: 'new', page: finding.page, items: [] };
        pages.set(finding.page, group);
        result.push(group);
      }
      pages.get(finding.page).items.push({ url: finding.url, text: finding.text });
    } else {
      result.push(finding);
    }
  }
  return blocked ? [...result, blocked] : result;
}

/** Keys of every finding inside a grouped finding. */
export function groupKeys(group) {
  if (group.kind === 'new') return group.items.map((item) => findingKey({ kind: 'new', ...item }));
  return [findingKey(group)];
}

const shortHash = (hash) => (hash ? hash.slice(0, 12) : '—');

/** Issue title and body for a grouped finding. Issues are bilingual like the issue templates. */
export function issueFor(group) {
  const footer = [
    '',
    '---',
    'Opened by the weekly source check (`.github/workflows/source-check.yml`). Content is never changed automatically; see `docs/ANNUAL-REVIEW.md`.',
    'Haftalık kaynak kontrolü tarafından açıldı. İçerik otomatik değiştirilmez; bkz. `docs/ANNUAL-REVIEW.tr.md`.',
    '',
    ...groupKeys(group).map((key) => `${KEY_PREFIX}${key} -->`),
  ];
  switch (group.kind) {
    case 'new': {
      const first = group.items[0].text || group.items[0].url;
      const more = group.items.length > 1 ? ` (+${group.items.length - 1})` : '';
      return {
        title: `[Kaynak] Yeni belge / New document: ${first}${more}`,
        body: [
          `**Bulunduğu sayfa / Found on:** ${group.page}`,
          '',
          ...group.items.map(({ url, text }) => `- ${text || '—'}: ${url}`),
          '',
          'İlgili belgeleri `data/sources.json` dosyasına, ilgisiz olanları `data/source-watch.json` içindeki `ignore` listesine ekle; sonra bu issue\'yu kapat.',
          'Add the relevant documents to `data/sources.json` and the rest to `ignore` in `data/source-watch.json`, then close this issue.',
          ...footer,
        ].join('\n'),
      };
    }
    case 'changed':
      return {
        title: `[Kaynak] Belge değişti / Document changed: ${group.id}`,
        body: [
          `**Kaynak / Source:** \`${group.id}\``,
          `**Bağlantı / Link:** ${group.url}`,
          `**SHA-256:** \`${shortHash(group.oldHash)}…\` → \`${shortHash(group.newHash)}…\``,
          '',
          `Belgedeki değişiklikleri incele, etkilenen verileri güncelle, sonra \`npm run check:sources -- --accept ${group.id}\` çalıştır.`,
          `Review what changed in the document, update the affected data, then run \`npm run check:sources -- --accept ${group.id}\`.`,
          ...footer,
        ].join('\n'),
      };
    case 'broken':
      return {
        title: `[Kaynak] Kırık bağlantı / Broken link: ${group.id}`,
        body: [
          `**Kaynak / Source:** \`${group.id}\``,
          `**Bağlantı / Link:** ${group.url}`,
          `**Yanıt / Response:** ${group.status}`,
          '',
          'Belgenin yeni adresini bul ve `data/sources.json` içinde güncelle.',
          'Find the document\'s new address and update it in `data/sources.json`.',
          ...footer,
        ].join('\n'),
      };
    case 'blocked':
      return {
        title: '[Kaynak] ÖSYM\'ye erişilemedi / Could not reach ÖSYM',
        body: [
          'Kaynak kontrolü bazı adreslere erişemedi. ÖSYM, GitHub sunucularını engelliyor olabilir; kontrolü yerelde `npm run check:sources` ile çalıştır.',
          'The source check could not reach some addresses. ÖSYM may be blocking GitHub runners; run `npm run check:sources` locally instead.',
          '',
          ...group.items.map(({ url, reason }) => `- ${url} — ${reason}`),
          ...footer,
        ].join('\n'),
      };
    default:
      throw new Error(`Unknown finding kind: ${group.kind}`);
  }
}

