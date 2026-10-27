/**
 * Links that open a prompt on an external AI site. The parameters may be
 * undocumented; a provider with `prefill: false` only opens its home page (the
 * text is on the clipboard).
 */
export const PROVIDERS = {
  // ?q= auto-submits the prompt; ?prompt= only fills the box.
  // The student must fill [FIELDS] before sending.
  chatgpt: { name: 'ChatGPT', base: 'https://chatgpt.com/', param: 'prompt', prefill: true },
  // Official docs: q fills the box, sending is up to the user; truncated around 14,000 characters.
  claude: { name: 'Claude', base: 'https://claude.ai/new', param: 'q', prefill: true },
};

/** Safe text length for prefill; longer prompts open just the site. */
export const MAX_URL_TEXT = 12000;

/** Provider link; the plain home page when prefill is off or the text is too long. */
export function providerUrl(provider, text) {
  const p = PROVIDERS[provider];
  if (!p) throw new Error(`Unknown provider: ${provider}`);
  if (!p.prefill || text.length > MAX_URL_TEXT) return p.base;
  const url = new URL(p.base);
  url.searchParams.set(p.param, text);
  return url.toString();
}
