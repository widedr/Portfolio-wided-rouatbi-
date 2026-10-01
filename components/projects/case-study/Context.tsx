import { Reveal, RevealText } from "@/components/motion/Reveal";

/** Signature section: the domain explained to someone who doesn't know it. */
export function Context({
  title,
  paragraphs,
  facts,
}: {
  title: string;
  paragraphs: string[];
  facts: { value: string; label: string }[];
}) {
  return (
    <section id="context" className="theme-paper py-section px-site" aria-labelledby="context-title">
      <div className="grid-site gap-y-16">
        <div className="col-span-4 md:col-span-6 lg:col-span-7">
          <p className="text-meta mb-6">01 — {title}</p>
          <RevealText id="context-title" className="text-h2 mb-10">
            {paragraphs[0]}
          </RevealText>
          <Reveal selector="p" className="measure flex flex-col gap-6 text-body-l text-ink-muted">
            {paragraphs.slice(1).map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>
        </div>
        <Reveal as="dl" selector="[data-fact]" className="col-span-4 flex flex-col gap-10 md:col-span-6 lg:col-span-4 lg:col-start-9">
          {facts.map((f) => (
            <div key={f.label} data-fact className="border-t border-line pt-5">
              <dt className="sr-only">{f.label}</dt>
              <dd>
                <span className="block font-display text-[clamp(2.25rem,4.2vw,4.5rem)] font-medium leading-none tracking-[-0.03em]">{f.value}</span>
                <span className="mt-2 block text-ink-muted" aria-hidden="true">
                  {f.label}
                </span>
              </dd>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
