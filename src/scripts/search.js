/**
 * A small search UI on top of the Pagefind JS API. The stock Pagefind UI uses
 * inline styles, which the CSP blocks; here only DOM nodes are created.
 * Pagefind picks the index matching the page's `<html lang>`.
 */
import { translator } from '../i18n/index.js';

const root = document.querySelector('[data-search]');
const BASE = import.meta.env.BASE_URL.replace(/\/?$/, '/');
const MAX_RESULTS = 8;
const t = translator(document.documentElement.lang);

let pagefind;
async function load() {
  if (!pagefind) {
    const url = `${BASE}pagefind/pagefind.js`;
    pagefind = await import(/* @vite-ignore */ url);
    await pagefind.options({ baseUrl: BASE });
  }
  return pagefind;
}

/** Copies a Pagefind excerpt as plain text, keeping only <mark> elements. */
function excerptNodes(html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  const fragment = document.createDocumentFragment();
  for (const node of template.content.childNodes) {
    if (node.nodeName === 'MARK') {
      const m = document.createElement('mark');
      m.textContent = node.textContent;
      fragment.append(m);
    } else {
      fragment.append(node.textContent);
    }
  }
  return fragment;
}

if (root) {
  const input = root.querySelector('[data-search-input]');
  const status = root.querySelector('[data-search-status]');
  const list = root.querySelector('[data-search-results]');
  let counter = 0;
  let timer;

  root.querySelector('[data-search-form]').addEventListener('submit', (e) => e.preventDefault());

  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(search, 200);
  });

  async function search() {
    const query = input.value.trim();
    const current = ++counter;
    if (!query) {
      list.replaceChildren();
      status.textContent = '';
      return;
    }
    let result;
    try {
      result = await (await load()).search(query);
    } catch {
      status.textContent = t('search.unavailable');
      return;
    }
    const items = await Promise.all(result.results.slice(0, MAX_RESULTS).map((r) => r.data()));
    if (current !== counter) return; // a newer search has started
    status.textContent = result.results.length ? t('search.results', { n: result.results.length }) : t('search.none');
    list.replaceChildren(
      ...items.map((item) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.url;
        a.textContent = item.meta.title;
        const p = document.createElement('p');
        p.append(excerptNodes(item.excerpt));
        li.append(a, p);
        return li;
      }),
    );
  }
}
