/**
 * End-to-end tests (`npm run test:e2e`): the production build (`npm run build` first) served by
 * `next start` and driven in a real Chromium.
 *
 * The browser is Playwright's own Chromium (`npx playwright install chromium`). To use another
 * one, set PW_CHANNEL (e.g. `chrome`) or PW_EXECUTABLE_PATH (the path to a Chromium binary).
 */
import { defineConfig } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3100);

export default defineConfig({
  testDir: "e2e",
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    channel: process.env.PW_CHANNEL,
    launchOptions: { executablePath: process.env.PW_EXECUTABLE_PATH },
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npx next start --port ${PORT} --hostname 127.0.0.1`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
