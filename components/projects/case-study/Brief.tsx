import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { ArrowSwap } from "@/components/layout/RollText";
import { StarBorder } from "@/components/layout/StarBorder";
import { HoverText } from "@/components/motion/HoverText";

type Item = { label: string; value: string };

/** "At a glance" identity card: 4–5 columns of label + value, separated by drawn lines. */
export function Brief({ title, items, live }: { title: string; items: Item[]; live?: { href: string; label: string } }) {
  return (
    <section id="brief" className="py-section px-site" aria-labelledby="brief-title">
      <h2 id="brief-title" className="text-meta mb-10 text-fg-muted">
        <HoverText text={title} />
      </h2>
      <Reveal as="dl" selector="[data-item]" className="grid grid-cols-2 gap-x-[var(--gutter)] gap-y-10 md:grid-cols-3 lg:grid-flow-col lg:auto-cols-fr lg:grid-cols-none">
        {items.map((item) => (
          <div key={item.label} data-item className="border-t border-line pt-5">
            <dt className="text-meta text-fg-muted">{item.label}</dt>
            <dd className="mt-3 text-body-l">{item.value}</dd>
          </div>
        ))}
      </Reveal>
      {live && (
        <div className="mt-12">
          <Magnetic>
            <a
              href={live.href}
              target="_blank"
              rel="noreferrer"
              className="star-border arrow-trigger"
            >
              <StarBorder className="inline-flex min-h-14 items-center gap-3 px-7">
                {live.label} <ArrowSwap direction="up-right" />
              </StarBorder>
            </a>
          </Magnetic>
        </div>
      )}
    </section>
  );
}
