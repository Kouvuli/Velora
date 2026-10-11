// @vitest-environment node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// VEL-WEB-landing AC-30: every text/background pair meets WCAG AA in both themes, read from the real tokens.
const css = readFileSync(join(__dirname, "globals.css"), "utf8");
const tokens: Record<"light" | "dark", Record<string, string>> = { light: {}, dark: {} };
for (const [, name, light, dark] of css.matchAll(/--color-([\w-]+):\s*light-dark\((#[0-9a-f]{6}),\s*(#[0-9a-f]{6})\)/gi)) {
  tokens.light[name] = light;
  tokens.dark[name] = dark;
}

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const pairs: [string, string, number][] = [
  ["ink", "paper", 4.5],
  ["ink", "surface", 4.5],
  ["muted", "paper", 4.5],
  ["muted", "surface", 4.5],
  ["on-accent", "accent", 4.5],
  ["on-accent", "accent-strong", 4.5],
  ["accent", "paper", 4.5],
  ["accent", "surface", 4.5],
  ["suggested-ink", "suggested-soft", 4.5],
  ["approved", "approved-soft", 4.5],
  ["approved", "surface", 4.5],
  ["danger", "surface", 4.5],
  ["observed", "surface", 3],
  ["suggested", "surface", 3],
];

describe("petrol theme tokens (VEL-WEB-landing AC-30)", () => {
  it("defines every token for light and dark", () => {
    const names = new Set(pairs.flat().filter((x): x is string => typeof x === "string"));
    for (const name of names) {
      expect(tokens.light[name], name).toMatch(/^#/);
      expect(tokens.dark[name], name).toMatch(/^#/);
    }
  });

  for (const theme of ["light", "dark"] as const) {
    it.each(pairs)(`${theme}: %s on %s meets %s:1`, (fg, bg, min) => {
      expect(contrast(tokens[theme][fg], tokens[theme][bg])).toBeGreaterThanOrEqual(min);
    });
  }
});
