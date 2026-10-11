import { defineConfig, devices } from "@playwright/test";

const port = 3100;
// The form posts here during e2e runs; tests intercept it, so nothing leaves the machine.
export const E2E_ENDPOINT = "https://forms.test/f/e2e";

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${port}`,
    // Optional: use an installed Chromium instead of running `npx playwright install chromium`.
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH } : {},
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], viewport: { width: 375, height: 812 } } },
  ],
  webServer: {
    command: `npm run build && npx next start -p ${port}`,
    url: `http://localhost:${port}`,
    env: { NEXT_PUBLIC_WAITLIST_ENDPOINT: E2E_ENDPOINT },
    timeout: 240_000,
    reuseExistingServer: false,
  },
});
