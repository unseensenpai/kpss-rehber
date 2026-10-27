/**
 * Pagefind JS API üzerine küçük arama arayüzü. Hazır Pagefind UI inline stil
 * kullandığı için CSP ile uyumlu değil; burada yalnızca DOM düğümleri üretilir.
 */
const kok = document.querySelector('[data-arama]');
const BASE = import.meta.env.BASE_URL.replace(/\/?$/, '/');
const EN_FAZLA = 8;

let pagefind;
async function yukle() {
  if (!pagefind) {
    const adres = `${BASE}pagefind/pagefind.js`;
    pagefind = await import(/* @vite-ignore */ adres);
    await pagefind.options({ baseUrl: BASE });
  }
  return pagefind;
}

/** Pagefind alıntısındaki <mark> dışındaki her şeyi düz metin olarak aktarır. */
function alintiDugumleri(html) {
  const sablon = document.createElement('template');
  sablon.innerHTML = html;
  const parca = document.createDocumentFragment();
  for (const d of sablon.content.childNodes) {
    if (d.nodeName === 'MARK') {
      const m = document.createElement('mark');
      m.textContent = d.textContent;
      parca.append(m);
    } else {
      parca.append(d.textContent);
    }
  }
  return parca;
}

if (kok) {
  const girdi = kok.querySelector('[data-arama-girdi]');
  const durum = kok.querySelector('[data-arama-durum]');
  const liste = kok.querySelector('[data-arama-sonuclar]');
  let sayac = 0;
  let zamanlayici;

  kok.querySelector('[data-arama-form]').addEventListener('submit', (e) => e.preventDefault());

  girdi.addEventListener('input', () => {
    clearTimeout(zamanlayici);
    zamanlayici = setTimeout(ara, 200);
  });

  async function ara() {
    const sorgu = girdi.value.trim();
    const bu = ++sayac;
    if (!sorgu) {
      liste.replaceChildren();
      durum.textContent = '';
      return;
    }
    let sonuc;
    try {
      sonuc = await (await yukle()).search(sorgu);
    } catch {
      durum.textContent = 'Arama şu an kullanılamıyor (dizin yalnızca derlenmiş sitede bulunur).';
      return;
    }
    const veriler = await Promise.all(sonuc.results.slice(0, EN_FAZLA).map((r) => r.data()));
    if (bu !== sayac) return; // daha yeni bir arama başladı
    durum.textContent = sonuc.results.length ? `${sonuc.results.length} sonuç` : 'Sonuç bulunamadı.';
    liste.replaceChildren(
      ...veriler.map((v) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = v.url;
        a.textContent = v.meta.title;
        const p = document.createElement('p');
        p.append(alintiDugumleri(v.excerpt));
        li.append(a, p);
        return li;
      }),
    );
  }
}
