/** Remembers the language the visitor reads in, so the root page can send them back to it. */
export const LOCALE_KEY = 'kpss-rehber:locale';

function remember(locale) {
  try {
    localStorage.setItem(LOCALE_KEY, locale);
  } catch {
    /* not critical */
  }
}

remember(document.documentElement.lang);
for (const link of document.querySelectorAll('[data-language-link]')) {
  link.addEventListener('click', () => remember(link.dataset.languageLink));
}
