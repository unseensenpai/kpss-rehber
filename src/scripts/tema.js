const ANAHTAR = 'kpss-rehber:tema';

function kaydet(tema) {
  try { localStorage.setItem(ANAHTAR, tema); } catch { /* gizli sekme vb. */ }
}

for (const dugme of document.querySelectorAll('[data-tema-dugme]')) {
  dugme.addEventListener('click', () => {
    const html = document.documentElement;
    const yeni = html.dataset.theme === 'dark' ? 'light' : 'dark';
    html.dataset.theme = yeni;
    kaydet(yeni);
  });
}
