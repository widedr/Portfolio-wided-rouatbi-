import { CountUp } from "@/components/motion/CountUp";
import { Reveal, RevealText } from "@/components/motion/Reveal";
import { HoverText } from "@/components/motion/HoverText";

type Props = {
  title: string;
  learningsTitle: string;
  statement?: string;
  metrics?: { value: number; suffix?: string; label: string }[];
  quotes?: string[];
  learnings: string[];
};

/** Signature section: measured impact when it exists, honest status when it doesn't, then learnings. */
export function Results({ title, learningsTitle, statement, metrics, quotes, learnings }: Props) {
  return (
    <section id="results" className="theme-paper py-section px-site" aria-labelledby="results-title">
      <p className="text-meta mb-6">07</p>
      <RevealText id="results-title" className="text-display-l mb-16">
        <HoverText text={title} />
      </RevealText>

      {metrics && metrics.length > 0 && (
        <dl className="mb-20 grid gap-10 md:grid-cols-3">
          {metrics.map((m) => (
            <div key={m.label} className="border-t border-line pt-6">
              <dt className="sr-only">{m.label}</dt>
              <dd>
                <CountUp value={m.value} suffix={m.suffix} className="text-display-xl block" />
                <span className="mt-2 block text-ink-muted" aria-hidden="true">
                  {m.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      )}

      {quotes?.map((q) => (
        <blockquote key={q} className="text-h2 mb-16 max-w-[30ch]">
          <span className="font-display text-[1.6em] leading-none text-accent-ink" aria-hidden="true">
            “
          </span>
          {q}
        </blockquote>
      ))}

      {statement && (
        <Reveal as="p" className="text-h2 mb-20 max-w-[34ch] text-ink-muted">
          {statement}
        </Reveal>
      )}

      <h3 className="text-meta mb-8">{learningsTitle}</h3>
      <Reveal as="ol" selector="li" className="grid gap-10 md:grid-cols-3">
        {learnings.map((l, i) => (
          <li key={l} className="border-t border-line pt-6">
            <span className="text-meta text-accent-ink">{String(i + 1).padStart(2, "0")}</span>
            <p className="mt-4 text-body-l">{l}</p>
          </li>
        ))}
      </Reveal>
    </section>
  );
}
