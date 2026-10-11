import { expect, test, type Page } from "@playwright/test";
import { E2E_ENDPOINT } from "../playwright.config";

const demoStatus = (page: Page) => page.locator("#demo").getByRole("status");

test("hero headline and call to action are visible without scrolling (VEL-WEB-landing AC-01)", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Connect messy data. See how it fits. Send it clean anywhere.");
  await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
  await expect(page.getByRole("main").getByRole("link", { name: "Get early access" }).first()).toBeInViewport();
});

test("sections appear in the agreed order (VEL-WEB-landing AC-11)", async ({ page }, info) => {
  await page.goto("/");
  const ids = await page.locator("main section[id]").evaluateAll((els) => els.map((e) => e.id));
  expect(ids).toEqual(["connects", "demo", "problem", "how-it-works", "views", "destinations", "trust", "who", "compare", "pricing", "security", "about", "faq", "early-access"]);
  if (info.project.name === "desktop") {
    const nav = page.getByRole("navigation", { name: "Main" });
    for (const name of ["How it works", "Pricing", "Security", "FAQ"]) await expect(nav.getByRole("link", { name })).toBeVisible();
    await expect(page.getByRole("banner").getByRole("link", { name: "Get early access" })).toHaveAttribute("href", "/#early-access");
  }
});

test("pricing and security say what was agreed (VEL-WEB-landing AC-12, VEL-WEB-landing AC-13)", async ({ page }) => {
  await page.goto("/");
  const pricing = page.locator("#pricing");
  await expect(pricing).toContainText("Early-access pricing");
  for (const text of ["Readiness Report", "Free", "From $299", "From $99", "per month"]) await expect(pricing).toContainText(text);
  const security = page.locator("#security");
  for (const text of ["In transit and at rest", "Deleted on request", "Metadata-only mode", "Local engine on request"]) {
    await expect(security).toContainText(text);
  }
  await expect(page.locator("body")).not.toContainText(/never leaves/i);
});

test("accepting the suggestion links the records, and reset restores it (VEL-WEB-landing AC-06, VEL-WEB-landing AC-07, VEL-WEB-landing AC-09, VEL-WEB-landing AC-10)", async ({ page }) => {
  await page.goto("/");
  await page.locator("#demo").scrollIntoViewIfNeeded();
  const status = demoStatus(page);
  await expect(status).toHaveAttribute("aria-live", "polite");
  await expect(status).toContainText("312 orders have no matching customer");
  await expect(status).toContainText("cust_no → customer_id (94% match)");
  await expect(page.getByTestId("rf__edge-link")).toContainText("94%");

  // Keyboard path: focus the button and press Enter.
  await page.getByRole("button", { name: "Accept suggestion" }).focus();
  await page.keyboard.press("Enter");
  await expect(status).toHaveText("Link approved. All 4,812 orders matched to a customer");
  await expect(page.getByTestId("rf__edge-link")).toContainText("Approved");
  await expect(page.locator('[data-issue="link"]')).toHaveAttribute("data-fixed", "true");

  await page.getByRole("button", { name: "Reset demo" }).focus();
  await page.keyboard.press("Enter");
  await expect(status).toContainText("312 orders have no matching customer");
  await expect(page.locator('[data-issue="link"]')).toHaveAttribute("data-fixed", "false");
});

test("three issues, a dry run, then sending (VEL-WEB-landing AC-35, VEL-WEB-landing AC-36)", async ({ page }) => {
  await page.goto("/");
  const demo = page.locator("#demo");
  await demo.scrollIntoViewIfNeeded();
  const progress = demo.locator("[data-demo-progress]");
  const odoo = page.getByRole("button", { name: "Odoo", exact: true });
  const dryRun = page.getByRole("button", { name: "Run dry run" });

  await expect(demo.locator("[data-issue]")).toHaveCount(3);
  await expect(progress).toHaveText("0 of 3 fixed");
  await expect(dryRun).toBeDisabled();

  await page.getByRole("button", { name: "Accept suggestion" }).click();
  await expect(progress).toHaveText("1 of 3 fixed");
  await expect(odoo).toBeDisabled();
  await page.getByRole("button", { name: "Merge" }).click();
  await expect(demoStatus(page)).toContainText("Merged “ACME, Inc.” into “Acme Inc.”");
  await page.getByRole("button", { name: "Convert dates" }).click();
  await expect(progress).toHaveText("3 of 3 fixed");
  await expect(odoo).toBeDisabled();

  await dryRun.click();
  await expect(demo.locator("[data-dry-run]")).toHaveAttribute("data-dry-run", "running");
  await expect(demo.locator("[data-dry-run]")).toHaveAttribute("data-dry-run", "passed");
  await expect(demo.locator("[data-dry-run]")).toContainText("0 violations");
  await expect(demoStatus(page)).toHaveText("Dry run passed: 0 violations. Ready to send.");
  for (const name of ["Odoo", "Files", "Cloud storage", "Warehouse"]) {
    await expect(page.getByRole("button", { name, exact: true })).toBeEnabled();
  }
  await odoo.click();
  await expect(page.getByText("Ready for Odoo: 4,812 orders")).toBeVisible();

  await page.getByRole("button", { name: "Reset demo" }).click();
  await expect(progress).toHaveText("0 of 3 fixed");
  await expect(odoo).toBeDisabled();
  await expect(demo.locator("[data-dry-run]")).toHaveCount(0);
});

async function dragHandle(page: Page, from: string, to: string) {
  const source = page.locator(`.react-flow__handle[data-handleid="${from}"]`);
  const target = page.locator(`.react-flow__handle[data-handleid="${to}"]`);
  const a = (await source.boundingBox())!;
  const b = (await target.boundingBox())!;
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 12 });
  await page.mouse.up();
}

test("drawing the link by hand resolves the demo; a wrong link gives a hint (VEL-WEB-landing AC-08)", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "Dragging is the pointer path; phones use Accept suggestion (VEL-WEB-landing AC-07).");
  await page.goto("/");
  const status = demoStatus(page);
  await page.locator("#demo").scrollIntoViewIfNeeded();
  // React Flow draws edges only after measuring nodes on the client: the demo is interactive from here.
  await expect(page.getByTestId("rf__edge-link")).toBeVisible();

  await dragHandle(page, "order_id", "customer_id");
  await expect(status).toHaveText("Those columns don't match. Try cust_no → customer_id.");

  await dragHandle(page, "cust_no", "customer_id");
  await expect(status).toHaveText("Link approved. All 4,812 orders matched to a customer");
});

test("a visitor joins early access (VEL-WEB-landing AC-02)", async ({ page }) => {
  const bodies: unknown[] = [];
  await page.route(E2E_ENDPOINT, async (route) => {
    bodies.push(route.request().postDataJSON());
    await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
  });
  await page.goto("/#early-access");
  await page.getByLabel("Work email").fill("sam@shop.com");
  await page.getByLabel("Consultant or partner").check();
  await page.getByLabel(/free Readiness Report/).check();
  await page.getByRole("button", { name: "Get early access" }).click();

  await expect(page.getByText("You're on the list")).toBeVisible();
  expect(bodies).toEqual([{ email: "sam@shop.com", segment: "consultant", readinessReport: true, source: "landing" }]);
});

test("FAQ answers open without JavaScript (VEL-WEB-landing AC-14)", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  for (const q of ["Why not just use ChatGPT?", "Does my data leave my environment?"]) {
    await page.getByText(q).click();
    await expect(page.locator("details", { hasText: q })).toHaveAttribute("open", "");
  }
  await context.close();
});

test("privacy page explains the form data and is linked from the footer and the form (VEL-WEB-landing AC-15)", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#early-access").getByRole("link", { name: "privacy policy" })).toHaveAttribute("href", "/privacy");
  await page.getByRole("contentinfo").getByRole("link", { name: "Privacy policy" }).click();
  await expect(page).toHaveURL(/\/privacy$/);
  const main = page.getByRole("main");
  for (const text of ["your email address", "Formspree", "no analytics and no tracking cookies", "How long we keep it", "delete"]) {
    await expect(main).toContainText(text);
  }
});

test("share metadata and image are in place (VEL-WEB-landing AC-18)", async ({ page, request }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/connect messy data, see how it fits, send it clean anywhere/i);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /opengraph-image/);
  const res = await request.get("/opengraph-image");
  expect(res.headers()["content-type"]).toBe("image/png");
  const png = await res.body();
  expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
});

test("no horizontal scrolling at 320px (VEL-WEB-landing non-functional)", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  for (const path of ["/", "/privacy"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});
