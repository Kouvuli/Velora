import { expect, test, type Page } from "@playwright/test";

// 3D hero, story moments, icons and copy budget (VEL-WEB-landing revision 2).
// Assertions use DOM state exposed by the hero (data-*), never GPU pixels.

const scene = (page: Page) => page.locator("[data-hero-scene]");
const threeLoaded = (page: Page) => page.evaluate(() => "__THREE__" in window);

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("keeps the still graph and never loads three.js (VEL-WEB-landing AC-19, VEL-WEB-landing AC-22)", async ({ page }) => {
    await page.goto("/");
    await expect(scene(page)).toHaveAttribute("role", "img");
    await expect(scene(page)).toHaveAttribute("aria-label", /linked into one clean graph/);
    await expect(page.locator("[data-hero-still]")).toBeVisible();
    await page.waitForTimeout(2000);
    await expect(scene(page)).toHaveAttribute("data-state", "still");
    await expect(page.locator("[data-hero-scene] canvas")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Replay" })).toHaveCount(0);
    expect(await threeLoaded(page)).toBe(false);
  });

  test("shows story sections in their final state at once (VEL-WEB-landing AC-25)", async ({ page }) => {
    await page.goto("/");
    const steps = page.locator("#how-it-works [data-reveal]");
    for (const el of await steps.all()) await expect(el).toHaveCSS("opacity", "1");
    await expect(page.locator("[data-dashboard]")).toContainText("4,812");
    await expect(page.locator("[data-dashboard]")).toContainText("$1.28M");
  });
});

test("falls back to the still graph without WebGL (VEL-WEB-landing AC-22)", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    // @ts-expect-error -- simulate a browser without WebGL for this test
    HTMLCanvasElement.prototype.getContext = function (type: string, ...rest: unknown[]) {
      return type.startsWith("webgl") ? null : original.call(this, type as "2d", ...(rest as []));
    };
  });
  await page.goto("/");
  await page.waitForTimeout(2000);
  await expect(scene(page)).toHaveAttribute("data-state", "still");
  await expect(page.locator("[data-hero-scene] canvas")).toHaveCount(0);
  expect(await threeLoaded(page)).toBe(false);
});

test("assembles the 3D graph without shifting the layout, then replays (VEL-WEB-landing AC-20, VEL-WEB-landing AC-21)", async ({ page }) => {
  await page.goto("/");
  const before = await scene(page).boundingBox();
  await expect(scene(page)).toHaveAttribute("data-state", "canvas", { timeout: 10_000 });
  await expect(page.locator("[data-hero-scene] canvas")).toHaveCount(1);
  await expect(scene(page)).toHaveAttribute("data-phase", "assembling");
  await expect(scene(page)).toHaveAttribute("data-phase", "settled", { timeout: 6_000 });
  expect(await threeLoaded(page)).toBe(true);
  expect(await scene(page).boundingBox()).toEqual(before);

  const replay = page.getByRole("button", { name: "Replay" });
  await replay.focus();
  await page.keyboard.press("Enter");
  await expect(scene(page)).toHaveAttribute("data-phase", "assembling");
  await expect(scene(page)).toHaveAttribute("data-phase", "settled", { timeout: 6_000 });
});

test("uses the light tier on phones (VEL-WEB-landing AC-23)", async ({ page }, info) => {
  await page.goto("/");
  await expect(scene(page)).toHaveAttribute("data-state", "canvas", { timeout: 10_000 });
  const s = scene(page);
  if (info.project.name === "mobile") {
    await expect(s).toHaveAttribute("data-quality", "low");
    expect(Number(await s.getAttribute("data-points"))).toBeLessThanOrEqual(24);
    expect(Number(await s.getAttribute("data-dpr-max"))).toBeLessThanOrEqual(1.5);
    await expect(s).toHaveAttribute("data-pointer", "off");
  } else {
    await expect(s).toHaveAttribute("data-quality", "high");
    expect(Number(await s.getAttribute("data-dpr-max"))).toBeLessThanOrEqual(2);
  }
});

test("stops rendering off-screen and resumes when visible (VEL-WEB-landing AC-24)", async ({ page }) => {
  await page.goto("/");
  await expect(scene(page)).toHaveAttribute("data-active", "true", { timeout: 10_000 });
  await page.locator("#faq").scrollIntoViewIfNeeded();
  await expect(scene(page)).toHaveAttribute("data-active", "false");
  await scene(page).scrollIntoViewIfNeeded();
  await expect(scene(page)).toHaveAttribute("data-active", "true");
});

test("plays the story moments once when they scroll into view (VEL-WEB-landing AC-25)", async ({ page }, info) => {
  await page.goto("/");
  if (info.project.name === "mobile") {
    // On desktop, how-it-works is the pinned scroll story instead (VEL-WEB-landing AC-34).
    const steps = page.locator("#how-it-works [data-reveal]");
    await expect(steps.first()).toHaveCSS("opacity", "0");
    await page.locator("#how-it-works").scrollIntoViewIfNeeded();
    for (const el of await steps.all()) await expect(el).toHaveCSS("opacity", "1");
  }

  const trust = page.locator("#trust [data-reveal]");
  await expect(trust.first()).not.toHaveCSS("opacity", "1");
  await page.locator("#trust").scrollIntoViewIfNeeded();
  for (const el of await trust.all()) await expect(el).toHaveCSS("opacity", "1");

  const dashboard = page.locator("[data-dashboard]");
  await dashboard.scrollIntoViewIfNeeded();
  await expect(dashboard).toContainText("4,812");
  await expect(dashboard).toContainText("100%");
  await expect(dashboard).toContainText("$1.28M");
});

test("every listed item has a decorative icon (VEL-WEB-landing AC-26)", async ({ page }) => {
  await page.goto("/");
  const expected = { problem: 3, step: 3, destination: 4, trust: 6, audience: 3, plan: 3, security: 5 };
  for (const [kind, count] of Object.entries(expected)) {
    const items = page.locator(`[data-item="${kind}"]`);
    await expect(items, kind).toHaveCount(count);
    for (const item of await items.all()) {
      await expect(item.locator("svg.lucide").first()).toHaveAttribute("aria-hidden", "true");
    }
  }
});

test("keeps the main sections within the word budget (VEL-WEB-landing AC-27)", async ({ page }) => {
  await page.goto("/");
  const words = await page.evaluate(() =>
    ["problem", "how-it-works", "views", "destinations", "trust", "who", "pricing", "security", "about", "early-access"]
      .map((id) => document.getElementById(id)!.innerText.split(/\s+/).filter(Boolean).length)
      .reduce((a, b) => a + b, 0),
  );
  expect(words).toBeLessThanOrEqual(680);
});

// Revision 3: interactive hero, scroll story, micro-interactions, cursor effect.

async function settledHero(page: Page) {
  await page.goto("/");
  await expect(scene(page)).toHaveAttribute("data-phase", "settled", { timeout: 15_000 });
  await expect(scene(page)).toHaveAttribute("data-probe", /;/);
  const box = (await scene(page).boundingBox())!;
  return (fx: number, fy: number) => ({ x: box.x + box.width * fx, y: box.y + box.height * fy });
}
/** Screen fractions of hub 0 (Customers) and record 4 (ACME, Inc.), reported by the scene once settled. */
async function probe(page: Page) {
  const [hub, record] = (await scene(page).getAttribute("data-probe"))!.split(";").map((p) => p.split(",").map(Number));
  return { hub, record };
}
const tooltip = (page: Page) => page.locator("[data-hero-tooltip]");

test("dragging rotates the hero graph; vertical swipes still scroll on phones (VEL-WEB-landing AC-31)", async ({ page }, info) => {
  const at = await settledHero(page);
  await expect(scene(page)).toHaveCSS("touch-action", "pan-y");
  if (info.project.name !== "desktop") return;
  await expect(scene(page)).toHaveAttribute("data-rotated", "false");
  await page.mouse.move(at(0.3, 0.1).x, at(0.3, 0.1).y);
  await page.mouse.down();
  await page.mouse.move(at(0.7, 0.1).x, at(0.7, 0.1).y, { steps: 15 });
  await page.mouse.up();
  await expect(scene(page)).toHaveAttribute("data-rotated", "true");
});

test("hovering a hub or a record shows what it is (VEL-WEB-landing AC-32)", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "Hover is the pointer path; the tap path is covered below.");
  const at = await settledHero(page);
  const { hub, record } = await probe(page);
  await page.mouse.move(at(hub[0], hub[1]).x, at(hub[0], hub[1]).y);
  await expect(tooltip(page)).toHaveText("Customers, 1,204 records");
  await page.mouse.move(at(record[0], record[1]).x, at(record[0], record[1]).y);
  await expect(tooltip(page)).toHaveText("ACME, Inc. → matched to Acme Inc.");
  await page.mouse.move(at(0.5, 1.2).x, at(0.5, 1.2).y);
  await expect(tooltip(page)).toHaveCount(0);
});

test("tapping a hub on a phone shows what it is (VEL-WEB-landing AC-32)", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile", "Tap path.");
  await settledHero(page);
  const { hub } = await probe(page);
  const box = (await scene(page).boundingBox())!;
  await scene(page).tap({ position: { x: hub[0] * box.width, y: hub[1] * box.height }, force: true });
  await expect(tooltip(page)).toHaveText("Customers, 1,204 records");
});

test("the last suggested link is approved by clicking it or with the button; Replay resets it (VEL-WEB-landing AC-33)", async ({ page }, info) => {
  const at = await settledHero(page);
  await expect(scene(page)).toHaveAttribute("data-suggested", "pending");
  if (info.project.name === "desktop") {
    await page.mouse.click(at(0.5, 0.5).x, at(0.5, 0.5).y);
  } else {
    await page.getByRole("button", { name: "Approve suggested link" }).click();
  }
  await expect(scene(page)).toHaveAttribute("data-suggested", "approved");
  await expect(page.getByText("Link approved: orders and invoices are connected.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Approve suggested link" })).toHaveCount(0);

  await page.getByRole("button", { name: "Replay" }).click();
  await expect(scene(page)).toHaveAttribute("data-suggested", "pending");
  await expect(scene(page)).toHaveAttribute("data-phase", "settled", { timeout: 6_000 });
  await page.getByRole("button", { name: "Approve suggested link" }).focus();
  await page.keyboard.press("Enter");
  await expect(scene(page)).toHaveAttribute("data-suggested", "approved");
});

test("how it works pins and steps through Connect, See, Send on desktop (VEL-WEB-landing AC-34)", async ({ page }, info) => {
  await page.goto("/");
  const story = page.locator("#how-it-works [data-pinned]");
  if (info.project.name !== "desktop") {
    await expect(story).toHaveCount(0);
    await expect(page.locator('#how-it-works [data-item="step"]')).toHaveCount(3);
    return;
  }
  await expect(story).toHaveAttribute("data-pinned", "true");
  const top = async () => (await story.boundingBox())!.y;
  await page.evaluate(async () => {
    const el = document.querySelector("#how-it-works [data-pinned]") as HTMLElement;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "instant" });
  });
  await expect(story).toHaveAttribute("data-active-step", "connect");
  const pin = page.locator("#how-it-works [data-pin]");
  const pinTop = (await pin.boundingBox())!.y;
  for (const step of ["see", "send"]) {
    await page.mouse.wheel(0, 650);
    await expect(story).toHaveAttribute("data-active-step", step);
    expect(Math.abs((await pin.boundingBox())!.y - pinTop)).toBeLessThan(2);
  }
  expect(await top()).toBeLessThan(0);
});

test.describe("reduced motion: no pinning", () => {
  test.use({ reducedMotion: "reduce" });
  test("shows all three steps without pinning (VEL-WEB-landing AC-34)", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#how-it-works [data-pinned]")).toHaveCount(0);
    for (const step of await page.locator('#how-it-works [data-item="step"]').all()) await expect(step).toBeVisible();
  });
});

test("controls give quiet press, hover, open and success feedback (VEL-WEB-landing AC-37)", async ({ page }) => {
  await page.goto("/");
  const cta = page.getByRole("main").getByRole("link", { name: "Get early access" });
  expect(await cta.evaluate((el) => getComputedStyle(el).transitionProperty)).toContain("transform");
  const faq = page.locator("details").first();
  expect(await faq.evaluate((el) => getComputedStyle(el, "::details-content").transitionProperty)).toContain("block-size");

  await page.route("https://forms.test/f/e2e", (route) => route.fulfill({ status: 200, body: "{}" }));
  await page.goto("/#early-access");
  await page.getByLabel("Work email").fill("sam@shop.com");
  await page.getByRole("button", { name: "Get early access" }).click();
  const check = page.locator("[data-success-check] path");
  await expect(check).toBeVisible();
  expect(await check.evaluate((el) => getComputedStyle(el).animationName)).toBe("draw");
});

test.describe("reduced motion: instant feedback", () => {
  test.use({ reducedMotion: "reduce" });
  test("press and open feedback are instant (VEL-WEB-landing AC-37)", async ({ page }) => {
    await page.goto("/");
    const cta = page.getByRole("main").getByRole("link", { name: "Get early access" });
    expect(await cta.evaluate((el) => getComputedStyle(el).transitionDuration)).toBe("0s");
    const faq = page.locator("details").first();
    expect(await faq.evaluate((el) => getComputedStyle(el, "::details-content").transitionDuration)).toMatch(/^0s/);
  });
});

test("the cursor effect is on for desktop pointers and off for touch (VEL-WEB-landing AC-38)", async ({ page }, info) => {
  await settledHero(page);
  await expect(scene(page)).toHaveAttribute("data-cursor-effect", info.project.name === "desktop" ? "on" : "off");
});

// Revision 4: full-bleed hero, smooth scroll, heading reveals, hover zoom, "Connects to" marquee.

test("the hero is full-bleed with a centred headline; on phones the graph sits below the text (VEL-WEB-landing AC-39)", async ({ page }, info) => {
  await page.goto("/");
  const viewport = page.viewportSize()!;
  const box = (await scene(page).boundingBox())!;
  const h1 = (await page.locator("h1").boundingBox())!;
  expect(box.width).toBeGreaterThanOrEqual(viewport.width - 1);
  expect(Math.abs(h1.x + h1.width / 2 - viewport.width / 2)).toBeLessThan(4);
  expect(await page.locator("h1").evaluate((el) => getComputedStyle(el).textAlign)).toBe("center");
  const explore = page.getByRole("link", { name: "Scroll to explore" });
  await expect(explore).toHaveAttribute("href", "#connects");
  if (info.project.name === "desktop") {
    expect(box.height).toBeGreaterThanOrEqual(viewport.height - 64 - 1);
    expect(box.y).toBeLessThan(h1.y);
    await expect(explore).toBeInViewport();
  } else {
    // Text first, then the graph, then its controls, then "Scroll to explore": nothing overlaps.
    const cta = (await page.getByRole("main").getByText("Early sign-ups get a free Readiness Report").boundingBox())!;
    expect(box.y).toBeGreaterThanOrEqual(cta.y + cta.height);
    await expect(scene(page)).toHaveAttribute("data-phase", "settled", { timeout: 15_000 });
    const replay = (await page.getByRole("button", { name: "Replay" }).boundingBox())!;
    expect(replay.y).toBeGreaterThanOrEqual(box.y + box.height - 1);
    expect((await explore.boundingBox())!.y).toBeGreaterThanOrEqual(replay.y + replay.height - 1);
  }
});

test("scrolling is smooth on desktop pointers and native on touch (VEL-WEB-landing AC-40)", async ({ page }, info) => {
  await page.goto("/");
  const lenis = page.locator("html.lenis");
  if (info.project.name === "desktop") {
    await expect(lenis).toHaveCount(1);
    await page.getByRole("banner").getByRole("link", { name: "Pricing" }).click();
    await expect.poll(async () => (await page.locator("#pricing").boundingBox())!.y, { timeout: 5_000 }).toBeLessThan(140);
    expect((await page.locator("#pricing").boundingBox())!.y).toBeGreaterThan(40);
    const before = await page.evaluate(() => scrollY);
    await page.keyboard.press("PageDown");
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before);
  } else {
    await expect(lenis).toHaveCount(0);
  }
});

test.describe("reduced motion: native scroll, still headings and marquee", () => {
  test.use({ reducedMotion: "reduce" });
  test("no smooth scroll, headings shown at once, marquee still and wrapped (VEL-WEB-landing AC-40, VEL-WEB-landing AC-41, VEL-WEB-landing AC-43)", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html.lenis")).toHaveCount(0);
    const heading = page.locator("#pricing-title");
    await expect(heading).not.toHaveAttribute("data-heading-reveal", "armed");
    expect(await heading.locator("[data-word] > span").first().evaluate((el) => getComputedStyle(el).transform)).toBe("none");
    expect(await page.locator("[data-marquee-track]").evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
    await expect(page.getByRole("button", { name: "Pause" })).toBeHidden();
  });
});

test("section headings reveal line by line, once, and stay whole for screen readers (VEL-WEB-landing AC-41)", async ({ page }) => {
  await page.goto("/");
  const heading = page.locator("#pricing-title");
  await expect(heading).toHaveAttribute("data-heading-reveal", "armed");
  await expect(heading).toHaveText("Early-access pricing");
  await expect(page.getByRole("heading", { level: 2, name: "Early-access pricing" })).toHaveCount(1);
  const inner = heading.locator("[data-word] > span").first();
  expect(await inner.evaluate((el) => getComputedStyle(el).transform)).not.toBe("none");
  await heading.scrollIntoViewIfNeeded();
  await expect(heading).toHaveAttribute("data-heading-reveal", "played");
  await expect.poll(() => inner.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42)).toBe(0);
});

test("cards respond to hover; previews zoom inside their frame (VEL-WEB-landing AC-42)", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "Hover is a pointer interaction.");
  await page.goto("/");
  const card = page.locator("#views [data-hover-card]").first();
  await card.scrollIntoViewIfNeeded();
  await card.hover();
  await expect.poll(() => card.locator("[data-zoom]").evaluate((el) => Number(getComputedStyle(el).scale))).toBeCloseTo(1.04, 2);
  const plan = page.locator('[data-item="plan"]').first();
  const before = await plan.evaluate((el) => getComputedStyle(el).backgroundColor);
  await plan.hover();
  await expect.poll(() => plan.evaluate((el) => getComputedStyle(el).backgroundColor)).not.toBe(before);
});

test("the Connects to marquee moves, pauses, and hides its duplicate row (VEL-WEB-landing AC-43)", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#connects");
  const track = section.locator("[data-marquee-track]");
  await expect(section.getByRole("heading", { name: "Connects to" })).toBeVisible();
  for (const name of ["Excel", "Google Sheets", "Postgres", "SQL Server", "REST APIs", "Odoo", "Cloud storage", "Cloud warehouse"]) {
    await expect(section.locator("ul:not([aria-hidden])").getByText(name, { exact: true })).toHaveCount(1);
  }
  await expect(section.locator('ul[aria-hidden="true"]')).toHaveCount(1);
  expect(await track.evaluate((el) => getComputedStyle(el).animationName)).toBe("marquee");
  expect(await track.evaluate((el) => getComputedStyle(el).animationPlayState)).toBe("running");
  await section.getByRole("button", { name: "Pause" }).click();
  expect(await track.evaluate((el) => getComputedStyle(el).animationPlayState)).toBe("paused");
  await section.getByRole("button", { name: "Play" }).click();
  await section.locator("[tabindex='0']").focus();
  expect(await track.evaluate((el) => getComputedStyle(el).animationPlayState)).toBe("paused");
});
