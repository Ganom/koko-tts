import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./playwright",
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: "http://127.0.0.1:5173/",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 5173 --strictPort",
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
});
