import { describe, expect, it } from "vitest";
import { capabilityGroups, plans } from "./pricing";

// VEL-WEB-landing AC-45, AC-46: plans and the comparison table follow Product Vision v2 §13 exactly.
const v2: Record<string, (string | boolean)[]> = {
  "Managed data products": ["Limited", "Expanded", "Shared pool", "Custom"],
  Profiling: ["Manual", "Scheduled", "Automatic", "Policy-driven"],
  "Data dictionary": [true, true, true, true],
  "Data contracts": ["Basic", true, true, "Advanced"],
  Transformation: ["Basic", true, true, "Advanced"],
  Validation: ["Basic", true, true, "Advanced"],
  "AI assistance": ["Limited", true, true, true],
  "Change detection": [false, true, true, true],
  History: [false, "Basic", true, true],
  Collaboration: [false, false, true, true],
  Governance: [false, false, "Basic", "Advanced"],
  "Deployment controls": [false, false, false, true],
};

describe("pricing data (VEL-WEB-landing AC-45, VEL-WEB-landing AC-46)", () => {
  it("has the four v2 plans in order, with no dollar amounts", () => {
    expect(plans.map((p) => p.name)).toEqual(["Free / Local", "Pro", "Team", "Enterprise"]);
    expect(plans.map((p) => p.price)).toEqual(["Free", "Early access", "Early access", "Contact us"]);
    expect(JSON.stringify(plans)).not.toMatch(/\$/);
  });

  it("lists exactly v2's twelve capabilities with v2's values, in five groups", () => {
    expect(capabilityGroups.map((g) => g.name)).toEqual([
      "Data products",
      "Understanding",
      "Building",
      "Trust & control",
      "Collaboration & governance",
    ]);
    const rows = Object.fromEntries(capabilityGroups.flatMap((g) => g.rows.map((r) => [r.name, r.values])));
    expect(rows).toEqual(v2);
  });

  it("builds each paid plan on the previous one", () => {
    expect(plans[0].includesFrom).toBeNull();
    expect(plans.slice(1).map((p) => p.includesFrom)).toEqual(["Free / Local", "Pro", "Team"]);
  });
});
