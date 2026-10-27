const KEY = 'kpss-rehber:theme';

function save(theme) {
  try {
    localStorage.setItem(KEY, theme);
    localStorage.removeItem('kpss-rehber:tema'); // pre-English key
  } catch {
    /* private window etc. */
  }
}

for (const button of document.querySelectorAll('[data-theme-toggle]')) {
  button.addEventListener('click', () => {
    const html = document.documentElement;
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    html.dataset.theme = next;
    save(next);
  });
}
