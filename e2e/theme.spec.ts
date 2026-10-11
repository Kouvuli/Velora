import { expect, test, type Page } from "@playwright/test";

// Pure mono theme, dark by default (VEL-WEB-landing revision 4).
const bg = (page: Page) => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
const LIGHT_PAPER = "rgb(255, 255, 255)";
const DARK_PAPER = "rgb(0, 0, 0)";

test("is dark for first-time visitors whatever their system setting, even without JavaScript (VEL-WEB-landing AC-28)", async ({ browser }) => {
  for (const colorScheme of ["light", "dark"] as const) {
    for (const javaScriptEnabled of [true, false]) {
      const context = await browser.newContext({ colorScheme, javaScriptEnabled });
      const page = await context.newPage();
      for (const path of ["/", "/privacy"]) {
        await page.goto(path);
        expect(await bg(page), `system ${colorScheme} js=${javaScriptEnabled} ${path}`).toBe(DARK_PAPER);
      }
      expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe("dark");
      await context.close();
    }
  }
});

test("a stored light choice is applied before first paint, without a flash (VEL-WEB-landing AC-28)", async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: "dark" });
  await context.addInitScript(() => {
    localStorage.setItem("theme", "light");
    document.addEventListener("DOMContentLoaded", () => {
      (window as unknown as { firstBg: string }).firstBg = getComputedStyle(document.body).backgroundColor;
    });
  });
  const page = await context.newPage();
  await page.goto("/");
  expect(await page.evaluate(() => (window as unknown as { firstBg: string }).firstBg)).toBe(LIGHT_PAPER);
  await context.close();
});

test("the toggle switches theme, is remembered, and recolours the 3D hero (VEL-WEB-landing AC-29)", async ({ page }) => {
  await page.goto("/");
  const scene = page.locator("[data-hero-scene]");
  await expect(scene).toHaveAttribute("data-state", "canvas", { timeout: 10_000 });
  await expect(scene).toHaveAttribute("data-ink", "rgb(255, 255, 255)");

  await page.getByRole("button", { name: "Switch to light theme" }).click();
  expect(await bg(page)).toBe(LIGHT_PAPER);
  await expect(page.getByRole("button", { name: "Switch to dark theme" })).toBeVisible();
  await expect(scene).toHaveAttribute("data-ink", "rgb(10, 10, 10)");

  await page.reload();
  expect(await bg(page)).toBe(LIGHT_PAPER);
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  expect(await bg(page)).toBe(DARK_PAPER);
});

test("text uses Geist, labels Geist Mono, both self-hosted (VEL-WEB-landing AC-44)", async ({ page }) => {
  const fontHosts: string[] = [];
  page.on("request", (r) => {
    if (/fonts\.(googleapis|gstatic)\.com/.test(r.url())) fontHosts.push(r.url());
  });
  await page.goto("/");
  expect(await page.locator("h1").evaluate((el) => getComputedStyle(el).fontFamily)).toMatch(/Geist/);
  // A stable element (the pinned story replaces the static one after hydration).
  const mono = page.locator("#demo .font-mono").first();
  await mono.scrollIntoViewIfNeeded();
  expect(await mono.evaluate((el) => getComputedStyle(el).fontFamily)).toMatch(/Geist Mono/);
  expect(await page.evaluate(() => document.fonts.check('16px "Geist"') || [...document.fonts].some((f) => /Geist/.test(f.family)))).toBe(true);
  expect(fontHosts).toEqual([]);
});
