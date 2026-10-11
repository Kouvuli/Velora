"use client";

// How it works (VEL-WEB-landing AC-25, AC-26, AC-34). Desktop with motion allowed: the section pins while
// Connect, See and Send become active in order with scroll. Otherwise: three steps at once (revealed once).

import {
  Check,
  Database,
  Eye,
  FileSpreadsheet,
  Globe,
  Link2,
  Plug,
  RefreshCw,
  ScanSearch,
  Send,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState, useSyncExternalStore } from "react";
import { Reveal } from "./StoryMotion";

type Stage = { id: string; icon: LucideIcon; title: string; text: string; steps: [LucideIcon, string][]; art: () => React.ReactNode };

function ConnectArt() {
  return (
    <div className="grid gap-3 text-sm">
      {[
        [FileSpreadsheet, "orders.xlsx", "4,812 rows"],
        [Database, "customers (Postgres)", "1,204 rows"],
        [Globe, "Shop API", "386 products"],
      ].map(([Icon, name, rows]) => (
        <div key={name as string} className="flex items-center gap-3 rounded-md border border-line bg-paper px-3 py-2">
          <Icon aria-hidden="true" className="size-4 text-accent" />
          <span className="font-mono">{name as string}</span>
          <span className="ml-auto text-muted">{rows as string}</span>
        </div>
      ))}
      <div className="mt-2 rounded-md border border-line px-3 py-2">
        <p className="font-medium">Profile: cust_no</p>
        <p className="text-muted">99.8% filled, 1,198 distinct, likely key</p>
      </div>
    </div>
  );
}

function SeeArt() {
  return (
    <div className="grid gap-4 text-sm">
      <div className="flex items-center gap-3">
        <span className="rounded-md border border-line bg-paper px-3 py-1.5 font-mono">cust_no</span>
        <span className="h-0.5 flex-1 border-t-2 border-dashed border-suggested" />
        <span className="rounded-md border border-line bg-paper px-3 py-1.5 font-mono">customer_id</span>
      </div>
      <p className="rounded-md bg-suggested-soft px-3 py-2 text-suggested-ink">Claude suggests this link (94% match)</p>
      <div className="flex items-center gap-3">
        <span className="rounded-md border border-line bg-paper px-3 py-1.5 font-mono">cust_no</span>
        <span className="h-0.5 flex-1 bg-approved" />
        <span className="rounded-md border border-line bg-paper px-3 py-1.5 font-mono">customer_id</span>
      </div>
      <p className="flex items-center gap-2 rounded-md bg-approved-soft px-3 py-2 text-approved">
        <Check aria-hidden="true" className="size-4" />
        You approved it; it is saved as a rule
      </p>
    </div>
  );
}

function SendArt() {
  return (
    <div className="grid gap-3 text-sm">
      <p className="flex items-center gap-2 rounded-md bg-approved-soft px-3 py-2 font-medium text-approved">
        <ShieldCheck aria-hidden="true" className="size-4" />
        Dry run passed: 0 violations
      </p>
      {["Odoo", "Files", "Cloud storage", "Warehouse"].map((d) => (
        <div key={d} className="flex items-center gap-3 rounded-md border border-line bg-paper px-3 py-2">
          <Send aria-hidden="true" className="size-4 text-accent" />
          {d}
          <Check aria-hidden="true" className="ml-auto size-4 text-approved" />
        </div>
      ))}
    </div>
  );
}

const stages: Stage[] = [
  {
    id: "connect",
    icon: Plug,
    title: "Connect",
    text: "Bring in spreadsheets, databases and APIs. Every column is profiled for gaps, duplicates and keys.",
    steps: [
      [Plug, "Connect"],
      [ScanSearch, "Profile"],
    ],
    art: ConnectArt,
  },
  {
    id: "see",
    icon: Eye,
    title: "See",
    text: "Claude suggests how records match. You approve or fix each link on a graph.",
    steps: [
      [Link2, "Link & fix"],
      [Eye, "See"],
    ],
    art: SeeArt,
  },
  {
    id: "send",
    icon: Send,
    title: "Send",
    text: "A dry run checks the destination's rules. Then clean data goes out and stays in sync.",
    steps: [
      [ShieldCheck, "Validate"],
      [Send, "Send"],
      [RefreshCw, "Sync"],
    ],
    art: SendArt,
  },
];

function StageText({ stage, large = true, current = true }: { stage: Stage; large?: boolean; current?: boolean }) {
  return (
    <>
      <h3
        className={`flex items-center gap-3 font-semibold transition-colors duration-300 ${large ? "text-2xl" : "text-xl"} ${
          current ? "text-ink" : "text-muted"
        }`}
      >
        <stage.icon
          aria-hidden="true"
          strokeWidth={1.75}
          className={`size-6 shrink-0 transition-colors duration-300 ${current ? "text-accent" : "text-observed"}`}
        />
        {stage.title}
      </h3>
      <p className="mt-3 text-muted">{stage.text}</p>
      <ul className="mt-4 flex flex-wrap gap-2 text-sm">
        {stage.steps.map(([Icon, label]) => (
          <li key={label} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1">
            <Icon aria-hidden="true" strokeWidth={1.75} className="size-4 shrink-0 text-muted" />
            {label}
          </li>
        ))}
      </ul>
    </>
  );
}

const PIN_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const subscribePin = (onChange: () => void) => {
  const media = matchMedia(PIN_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};

export function HowItWorks() {
  const pinned = useSyncExternalStore(subscribePin, () => matchMedia(PIN_QUERY).matches, () => false);
  return pinned ? <PinnedStory /> : <StaticSteps />;
}

function StaticSteps() {
  return (
    <Reveal className="grid gap-10 lg:grid-cols-3">
      {stages.map((s) => (
        <div key={s.id} data-reveal data-item="step">
          <StageText stage={s} />
        </div>
      ))}
    </Reveal>
  );
}

function PinnedStory() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(2, Math.max(0, Math.floor(v * 3)))));

  return (
    <div ref={ref} className="relative h-[240vh]" data-pinned="true" data-active-step={stages[active].id}>
      <div className="sticky top-28 grid grid-cols-[1fr_1.15fr] items-center gap-12" data-pin>
        <ol className="grid gap-8">
          {stages.map((s, i) => (
            <li
              key={s.id}
              data-item="step"
              aria-current={i === active ? "step" : undefined}
              className={`border-l-2 pl-6 transition-colors duration-300 ease-out ${i === active ? "border-accent" : "border-line"}`}
            >
              <StageText stage={s} large={false} current={i === active} />
            </li>
          ))}
        </ol>
        <div className="relative h-[22rem] rounded-xl border border-line bg-surface p-6" aria-hidden="true">
          {stages.map((s, i) => (
            <div
              key={s.id}
              className={`absolute inset-6 flex flex-col justify-center transition-[opacity,transform] duration-300 ease-out ${
                i === active ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
            >
              <s.art />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
