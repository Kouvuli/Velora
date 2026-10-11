// VEL-WEB-landing: one-page site. Section order and ids follow AC-11; icons AC-26; word budget AC-27.
import {
  ArrowDown,
  Building2,
  ChartColumn,
  Cloud,
  Copy,
  Database,
  EyeOff,
  FileSearch,
  FileSpreadsheet,
  Handshake,
  ListChecks,
  Lock,
  Package,
  RefreshCw,
  ScanEye,
  SendHorizontal,
  Server,
  ShieldCheck,
  Shuffle,
  Sparkles,
  Store,
  Trash2,
  Unlink,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { ConnectsMarquee } from "@/components/ConnectsMarquee";
import { GraphDemo } from "@/components/GraphDemo";
import { HowItWorks } from "@/components/HowItWorks";
import { HeroScene } from "@/components/hero/HeroScene";
import { Section } from "@/components/Section";
import { Footer, Header } from "@/components/SiteChrome";
import { Reveal } from "@/components/StoryMotion";
import { DashboardPreview, GraphPreview, TreePreview } from "@/components/ViewPreviews";
import { WaitlistForm } from "@/components/WaitlistForm";
import { site } from "@/config/site";

function Icon({ icon: I, className = "text-ink" }: { icon: LucideIcon; className?: string }) {
  return <I aria-hidden="true" strokeWidth={1.75} className={`size-5 shrink-0 ${className}`} />;
}

const problems: [LucideIcon, string, string][] = [
  [Copy, "Duplicates", "The same customer, entered twice."],
  [Unlink, "Orphans", "Orders pointing at customers that don't exist."],
  [Shuffle, "Mismatched formats", "Dates, currencies and codes that differ in every file."],
];

const destinations: { icon: LucideIcon; name: string; what: string; how: string; when: string }[] = [
  { icon: Building2, name: "Odoo", what: "ERP", how: "Re-runs update, never duplicate.", when: "First release" },
  { icon: FileSpreadsheet, name: "Files", what: "CSV, XLSX, Parquet", how: "Clean, linked files.", when: "First release" },
  { icon: Cloud, name: "Cloud storage", what: "S3, Google Cloud Storage, Azure Blob", how: "Written to your bucket.", when: "Coming soon" },
  { icon: Database, name: "Cloud warehouse", what: "BigQuery or Snowflake", how: "Loaded and kept in sync.", when: "Coming soon" },
];

const trustStates: { icon: LucideIcon; name: string; tone: string; text: string }[] = [
  { icon: ScanEye, name: "Observed", tone: "text-observed", text: "Measured by the profiler." },
  { icon: Sparkles, name: "Suggested", tone: "text-suggested", text: "Proposed by Claude, with a confidence score." },
  { icon: UserCheck, name: "Approved", tone: "text-approved", text: "Confirmed by you." },
  { icon: ListChecks, name: "Enforced", tone: "text-approved", text: "Saved as a rule." },
  { icon: ShieldCheck, name: "Validated", tone: "text-approved", text: "Passed a dry run." },
  { icon: SendHorizontal, name: "Sent", tone: "text-ink", text: "Delivered and traceable to its source row." },
];

const audiences: [LucideIcon, string, string][] = [
  [Store, "Growing businesses", "Moving onto an ERP or combining tools. No SQL needed."],
  [ChartColumn, "Data teams and analysts", "Inherited, undocumented data? Link it and deliver a clean dataset to your warehouse."],
  [Handshake, "Consultants and partners", "Faster client projects, with a report your client can sign off."],
];

const plans: { icon: LucideIcon; name: string; price: string; unit: string; text: string }[] = [
  { icon: FileSearch, name: "Readiness Report", price: "Free", unit: "", text: "What you have, how it links, what's broken. 2 sources, no export." },
  { icon: Package, name: "Project pass", price: "From $299", unit: "one-time", text: "One migration or clean-up. Re-runs for 30 days." },
  { icon: RefreshCw, name: "Subscription", price: "From $99", unit: "per month", text: "Scheduled syncs and drift alerts." },
];

const safeguards: [LucideIcon, string, string][] = [
  [Lock, "Encrypted", "In transit and at rest."],
  [Trash2, "Deleted on request", "Short default retention."],
  [EyeOff, "Metadata-only mode", "Claude sees column names and statistics, not full rows."],
  [Server, "Local engine on request", "Processing runs on your own server."],
  [UserCheck, "You approve every link", "Nothing is sent without a passing dry run."],
];

const alternatives = [
  ["ERP importers (e.g. Odoo's)", "One file per data type. Links need matching names or IDs prepared by hand. No joins across files, databases or APIs."],
  ["Flatfile, OneSchema, Osmos", "CSV importers that software companies embed for their own customers, not cross-source clean-up for you."],
  ["Power BI, Tableau Prep, Alteryx", "Built for analytics. Complex, and they can't push into business systems like an ERP."],
  ["Airbyte, Fivetran", "Move data into warehouses. No reconciliation step and no human approval."],
  ["Zapier, Make, n8n", "One record at a time, triggered by events. No bulk linking."],
  ["ChatGPT or Claude chat", "One-off answers, black-box joins, limited by chat size, and they can't deliver into your systems."],
  ["Consultants and manual Excel", "The real alternative. Slow, expensive, and you start again next time."],
];

const faqs = [
  {
    q: "Why not just use ChatGPT?",
    a: `Chat tools are good for one-off questions, but they can't see millions of rows, their joins are a black box, and they can't put anything into your systems. ${site.name} is repeatable (saved pipelines and rules), traceable (every number traces back to a source row), handles live connections, and delivers into your ERP, cloud or warehouse, with Claude inside and you approving each link.`,
  },
  {
    q: "Does my data leave my environment?",
    a: "In the cloud version, your data is processed on our servers and encrypted in transit and at rest. In metadata-only mode, Claude sees only column names, statistics and masked samples. With the local engine, available on request, processing runs on your own machine or server and only metadata reaches Claude. We state exactly what leaves your environment in each mode.",
  },
  {
    q: "Which systems do you support?",
    a: "Sources: Excel, CSV, Google Sheets, Postgres, MySQL, SQL Server and REST APIs. Destinations: Odoo and files first, then cloud storage and a cloud warehouse. More ERPs, such as NetSuite and Business Central, come next.",
  },
  {
    q: "Do I need to know SQL?",
    a: "No. You fix data on the graph and in tables, and Claude turns each fix into a rule you approve. Data teams can still inspect every rule.",
  },
  {
    q: "What is the free Readiness Report?",
    a: "A report on your own data: what you have, how it links, what's broken, and how much manual work it would take. Tick the box when you sign up and we'll arrange a secure way to share files. Please don't email us spreadsheets.",
  },
  {
    q: "When can I start?",
    a: "We're onboarding early users in small groups. Sign up and we'll email you when there's a spot.",
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Hero (VEL-WEB-landing AC-39): from 640 px the 3D graph is a full-bleed background behind the text; on phones
            the text comes first and the graph sits in its own block below it, so nothing overlaps. */}
        <div className="relative isolate flex flex-col overflow-hidden border-b border-line sm:block">
          <HeroScene />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 hidden bg-[radial-gradient(ellipse_55%_45%_at_50%_48%,var(--color-paper)_35%,transparent_100%)] opacity-90 sm:block"
          />
          <div className="pointer-events-none relative z-10 order-1 mx-auto flex max-w-4xl flex-col items-center justify-center px-4 pt-14 pb-6 text-center sm:min-h-[calc(100svh-4rem)] sm:px-6 sm:py-20">
            <h1 className="text-5xl font-semibold tracking-[-0.035em] text-balance sm:text-6xl lg:text-7xl lg:leading-[1.02]">
              Connect messy data. See how it fits. Send it clean anywhere.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-balance text-muted sm:text-xl">{site.description}</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3 [&>a]:pointer-events-auto">
              <Link
                href="#early-access"
                className="press inline-flex h-12 items-center rounded-full bg-accent px-7 font-semibold text-on-accent hover:bg-accent-strong"
              >
                Get early access
              </Link>
              <Link
                href="#demo"
                className="press inline-flex h-12 items-center rounded-full border border-line bg-paper/60 px-7 font-semibold backdrop-blur-sm hover:border-ink"
              >
                Try the demo
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted">Early sign-ups get a free Readiness Report on their own data.</p>
          </div>
          <Link
            href="#connects"
            className="press relative order-4 z-20 mx-auto mb-4 inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm text-muted hover:text-ink sm:absolute sm:bottom-4 sm:left-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] sm:mb-0"
          >
            Scroll to explore
            <ArrowDown aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <ConnectsMarquee />

        <Section
          id="demo"
          title="Try it yourself"
          intro="Three issues from a typical export. Fix them, run a dry run, then send."
          tone="surface"
        >
          <GraphDemo />
        </Section>

        <Section
          id="problem"
          title="Your data is everywhere, and none of it lines up"
          intro="Customers in a spreadsheet, orders in an old database, products in another tool. Fixing that by hand takes weeks."
        >
          <ul className="grid gap-8 sm:grid-cols-3">
            {problems.map(([icon, term, text]) => (
              <li key={term} data-item="problem" className="border-t-2 border-ink pt-4">
                <p className="flex items-center gap-2 font-semibold">
                  <Icon icon={icon} />
                  {term}
                </p>
                <p className="mt-2 text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="how-it-works" title="How it works" tone="surface">
          <HowItWorks />
        </Section>

        <Section id="views" title="See your data before you send it" intro="Check the result three ways before anything leaves.">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              ["Linked graph", "Every entity and how it connects.", <GraphPreview key="g" />],
              ["Tree", "From customer to orders to products.", <TreePreview key="t" />],
              ["Summary dashboard", "Totals and quality checks at a glance.", <DashboardPreview key="d" />],
            ].map(([title, text, preview]) => (
              <figure
                key={title as string}
                data-hover-card
                className="group flex flex-col rounded-lg border border-line bg-surface p-5 transition-colors duration-300 hover:border-muted"
              >
                <div className="overflow-hidden rounded-md">
                  <div
                    data-zoom
                    className="flex min-h-40 items-center transition-transform duration-300 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  >
                    {preview}
                  </div>
                </div>
                <figcaption className="mt-5 border-t border-line pt-4">
                  <span className="font-semibold">{title}</span>
                  <span className="mt-1 block text-sm text-muted">{text}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>

        <Section id="destinations" title="Send it where it needs to go" tone="surface">
          <ul className="divide-y divide-line border-y border-line">
            {destinations.map((d) => (
              <li
                key={d.name}
                data-item="destination"
                data-hover-card
                className="-mx-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-md px-3 py-5 transition-colors duration-300 hover:bg-paper sm:grid-cols-[auto_14rem_1fr_8rem] sm:items-center"
              >
                <Icon icon={d.icon} className="size-6 text-accent" />
                <div>
                  <p className="font-semibold">{d.name}</p>
                  <p className="text-sm text-muted">{d.what}</p>
                </div>
                <p className="col-start-2 text-muted sm:col-start-auto">{d.how}</p>
                <p className="col-start-2 text-sm font-medium sm:col-start-auto sm:text-right">{d.when}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-muted">Next: NetSuite, Business Central and more.</p>
        </Section>

        <Section id="trust" title="Claude suggests. You decide." intro="Every link moves through visible states. Only approved data is sent.">
          <Reveal
            from={{ opacity: 0.25, scale: 0.97 }}
            step={0.18}
            className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3"
          >
            {trustStates.map((s) => (
              <div key={s.name} data-reveal data-item="trust" className="bg-surface p-5">
                <p className="flex items-center gap-2 font-semibold">
                  <Icon icon={s.icon} className={s.tone} />
                  {s.name}
                </p>
                <p className="mt-2 text-sm text-muted">{s.text}</p>
              </div>
            ))}
          </Reveal>
        </Section>

        <Section id="who" title="Who it's for" tone="surface">
          <ul className="grid gap-10 md:grid-cols-3">
            {audiences.map(([icon, title, text]) => (
              <li key={title} data-item="audience">
                <h3 className="flex items-center gap-3 text-xl font-semibold">
                  <Icon icon={icon} className="size-6 text-accent" />
                  {title}
                </h3>
                <p className="mt-3 text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="compare" title="Why not the tools you already have?">
          <div className="overflow-x-auto rounded-lg border border-line bg-surface">
            <table className="w-full min-w-[36rem] text-left">
              <thead className="border-b border-line text-sm text-muted">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Option
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Where it falls short for this job
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {alternatives.map(([name, gap]) => (
                  <tr key={name}>
                    <th scope="row" className="px-5 py-4 align-top font-semibold">
                      {name}
                    </th>
                    <td className="px-5 py-4 text-muted">{gap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="pricing" title="Early-access pricing" intro="Early customers keep their price." tone="surface">
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((p) => (
              <div
                key={p.name}
                data-item="plan"
                data-hover-card
                className="flex flex-col rounded-lg border border-line p-6 transition-colors duration-300 hover:border-muted hover:bg-paper"
              >
                <h3 className="flex items-center gap-2 font-semibold">
                  <Icon icon={p.icon} className="text-accent" />
                  {p.name}
                </h3>
                <p className="mt-4">
                  <span className="text-3xl font-semibold">{p.price}</span>
                  {p.unit && <span className="ml-2 text-muted">{p.unit}</span>}
                </p>
                <p className="mt-4 text-muted">{p.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-muted">Done-with-you projects are quoted on request.</p>
        </Section>

        <Section id="security" title="Your data, handled with care">
          <ul className="grid gap-x-10 gap-y-6 md:grid-cols-2">
            {safeguards.map(([icon, title, text]) => (
              <li key={title} data-item="security" className="flex gap-3">
                <Icon icon={icon} className="mt-0.5 text-accent" />
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="mt-1 text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-8">
            Read our{" "}
            <Link href="/privacy" className="font-medium text-accent underline decoration-accent/40 transition-colors hover:decoration-accent">
              privacy policy
            </Link>
            .
          </p>
        </Section>

        <Section id="about" title="Who's building this" tone="surface">
          <p className="max-w-2xl text-lg text-muted">
            Three engineers (data, AI and software) who have mapped messy data into ERP imports by hand, building the tool we
            wanted. Questions? Email{" "}
            <a href={`mailto:${site.email}`} className="font-medium text-accent underline decoration-accent/40 transition-colors hover:decoration-accent">
              {site.email}
            </a>
            .
          </p>
        </Section>

        <Section id="faq" title="Questions">
          <div className="max-w-3xl divide-y divide-line border-y border-line">
            {faqs.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {f.q}
                  <span aria-hidden="true" className="text-xl text-muted transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </Section>

        <Section id="early-access" title="Get early access" intro="We onboard early users in small groups." tone="surface">
          <div className="max-w-2xl">
            <WaitlistForm endpoint={process.env.NEXT_PUBLIC_WAITLIST_ENDPOINT} contactEmail={site.email} />
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
