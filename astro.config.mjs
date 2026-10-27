// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://unseensenpai.github.io',
  base: '/kpss-rehber',
  trailingSlash: 'ignore',
  output: 'static',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
  // Topic content has no code blocks; Shiki's inline styles conflict with the CSP.
  markdown: { syntaxHighlight: false },
  security: {
    // Astro adds hashes for its own scripts and styles automatically.
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
      // Pagefind search compiles WebAssembly; 'self' keeps Astro's default.
      scriptDirective: { resources: ["'self'", "'wasm-unsafe-eval'"] },
    },
  },
});
