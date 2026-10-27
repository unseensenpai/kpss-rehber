/**
 * Site içi bağlantıyı base önekiyle birleştirir: yol('/tarih') → '/kpss-rehber/tarih'.
 * @param {string} hedef
 * @param {string} [base]
 */
export function yol(hedef, base = import.meta.env.BASE_URL) {
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  const h = hedef.startsWith('/') ? hedef : `/${hedef}`;
  return `${b}${h}`;
}
