import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./playwright",
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: "http://127.0.0.1:4173/",
    trace: "on-first-retry",
  },
  webServer: {
    command:
      "npm run build-only -- --base=/ && npm run preview -- --host 127.0.0.1 --port 4173 --strictPort",
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
});
