// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://unseensenpai.github.io',
  base: '/kpss-rehber',
  trailingSlash: 'ignore',
  output: 'static',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
  security: {
    // Astro kendi script/style'larının hash'lerini otomatik ekler.
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "base-uri 'self'",
        "form-action 'none'",
        "object-src 'none'",
      ],
    },
  },
});
