/**
 * Promptu dış AI sitesinde açma bağlantıları. Parametreler belgelenmemiş olabilir;
 * `onDoldurma: false` olan sağlayıcı yalnızca ana sayfasını açar (metin panoda).
 */
export const SAGLAYICILAR = {
  // ?q= promptu otomatik gönderiyor; ?prompt= yalnızca kutuyu dolduruyor.
  // Öğrenci [ALAN]ları doldurmadan gönderilmemeli.
  chatgpt: { ad: 'ChatGPT', dugme: "ChatGPT'de aç", taban: 'https://chatgpt.com/', parametre: 'prompt', onDoldurma: true },
  // Resmi belge: q kutuyu doldurur, gönderim kullanıcıda; ~14.000 karakterde kesilir.
  claude: { ad: 'Claude', dugme: "Claude'da aç", taban: 'https://claude.ai/new', parametre: 'q', onDoldurma: true },
};

/** Ön doldurma için güvenli metin sınırı; uzun promptta yalnızca site açılır. */
export const EN_UZUN_URL_METNI = 12000;

/** Sağlayıcı bağlantısı; ön doldurma yoksa ya da metin çok uzunsa düz ana sayfa. */
export function disAcUrl(saglayici, metin) {
  const s = SAGLAYICILAR[saglayici];
  if (!s) throw new Error(`Bilinmeyen sağlayıcı: ${saglayici}`);
  if (!s.onDoldurma || metin.length > EN_UZUN_URL_METNI) return s.taban;
  const url = new URL(s.taban);
  url.searchParams.set(s.parametre, metin);
  return url.toString();
}
