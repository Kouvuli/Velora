import { RevealHeading } from "./RevealHeading";

type Props = {
  id: string;
  title: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
  tone?: "paper" | "surface";
};

export function Section({ id, title, intro, children, tone = "paper" }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`border-t border-line py-16 sm:py-24 ${tone === "surface" ? "bg-surface" : ""}`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <RevealHeading id={`${id}-title`} text={title} className="max-w-3xl text-4xl font-semibold tracking-[-0.03em] sm:text-5xl" />
        {intro && <div className="mt-4 max-w-2xl text-lg text-muted">{intro}</div>}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
