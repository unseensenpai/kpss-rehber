/**
 * Joins an in-site link with the base path: withBase('/exam') → '/kpss-rehber/exam'.
 * @param {string} target
 * @param {string} [base]
 */
export function withBase(target, base = import.meta.env.BASE_URL) {
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  const t = target.startsWith('/') ? target : `/${target}`;
  return `${b}${t}`;
}
