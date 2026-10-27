import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  use: { baseURL: 'http://localhost:4321/kpss-rehber/' },
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4321/kpss-rehber/',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  projects: [
    { name: 'masaustu', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobil', use: { ...devices['Pixel 7'] } },
  ],
});
