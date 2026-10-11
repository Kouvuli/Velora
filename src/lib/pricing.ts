// Plans and capabilities for /pricing (VEL-WEB-landing AC-45, AC-46), from Product Vision v2 §13. No prices yet:
// exact pricing and limits follow real usage.

export type CapabilityValue = string | boolean;

export type Plan = {
  name: string;
  tagline: string;
  price: string;
  priceNote: string;
  cta: "join" | "contact";
  /** The previous plan this one builds on ("Everything in X, plus:"). */
  includesFrom: string | null;
  includes: string[];
};

export const plans: Plan[] = [
  {
    name: "Free / Local",
    tagline: "Understand your own data",
    price: "Free",
    priceNote: "For individuals getting started",
    cta: "join",
    includesFrom: null,
    includes: [
      "A limited number of managed data products",
      "Manual profiling",
      "Data dictionary",
      "Basic contracts, transformation and validation",
      "Limited AI assistance",
    ],
  },
  {
    name: "Pro",
    tagline: "For analysts and small teams",
    price: "Early access",
    priceNote: "Pricing set with early customers",
    cta: "join",
    includesFrom: "Free / Local",
    includes: [
      "More managed data products",
      "Scheduled profiling",
      "Full contracts, transformation and validation",
      "Full AI assistance",
      "Change detection",
      "Basic history",
    ],
  },
  {
    name: "Team",
    tagline: "For teams that share data products",
    price: "Early access",
    priceNote: "Pricing set with early customers",
    cta: "join",
    includesFrom: "Pro",
    includes: ["A shared pool of data products", "Automatic profiling", "Full history", "Collaboration", "Basic governance"],
  },
  {
    name: "Enterprise",
    tagline: "For policy, governance and deployment needs",
    price: "Contact us",
    priceNote: "Custom terms",
    cta: "contact",
    includesFrom: "Team",
    includes: [
      "Custom data products",
      "Policy-driven profiling",
      "Advanced contracts, transformation and validation",
      "Advanced governance",
      "Deployment controls",
    ],
  },
];

export type CapabilityGroup = { name: string; rows: { name: string; values: CapabilityValue[] }[] };

/** Values per plan, in plan order. `true` = included, `false` = not included. */
export const capabilityGroups: CapabilityGroup[] = [
  { name: "Data products", rows: [{ name: "Managed data products", values: ["Limited", "Expanded", "Shared pool", "Custom"] }] },
  {
    name: "Understanding",
    rows: [
      { name: "Profiling", values: ["Manual", "Scheduled", "Automatic", "Policy-driven"] },
      { name: "Data dictionary", values: [true, true, true, true] },
      { name: "AI assistance", values: ["Limited", true, true, true] },
    ],
  },
  {
    name: "Building",
    rows: [
      { name: "Data contracts", values: ["Basic", true, true, "Advanced"] },
      { name: "Transformation", values: ["Basic", true, true, "Advanced"] },
      { name: "Validation", values: ["Basic", true, true, "Advanced"] },
    ],
  },
  {
    name: "Trust & control",
    rows: [
      { name: "Change detection", values: [false, true, true, true] },
      { name: "History", values: [false, "Basic", true, true] },
    ],
  },
  {
    name: "Collaboration & governance",
    rows: [
      { name: "Collaboration", values: [false, false, true, true] },
      { name: "Governance", values: [false, false, "Basic", "Advanced"] },
      { name: "Deployment controls", values: [false, false, false, true] },
    ],
  },
];
