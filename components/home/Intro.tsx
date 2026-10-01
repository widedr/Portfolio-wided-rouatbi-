import type { Dictionary, Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { HighlightText } from "@/components/motion/HighlightText";
import { Magnetic } from "@/components/motion/Magnetic";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowSwap } from "@/components/layout/RollText";
import { Portrait } from "./Portrait";

export function Intro({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <section className="theme-paper py-section px-site" aria-labelledby="intro-label">
      <div className="grid-site gap-y-12">
        <p id="intro-label" className="text-meta col-span-4 md:col-span-6 lg:col-span-12">
          01 — {dict.intro.label}
        </p>

        <div className="col-span-4 md:col-span-6 lg:col-span-8">
          <HighlightText text={dict.intro.text} className="text-display-l" />
          <div className="mt-12">
            <Magnetic>
              <a
                href={locale === "fr" ? site.links.cvFr : site.links.cvEn}
                download
                className="btn-fill arrow-trigger inline-flex min-h-14 items-center gap-3 rounded-full border border-ink px-7 font-medium"
                data-cursor="link"
              >
                <span className="btn-fill__blob" aria-hidden="true" />
                {dict.intro.cv}
                <ArrowSwap direction="down" />
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="col-span-3 md:col-span-3 lg:col-span-3 lg:col-start-10">
          <Portrait alt={dict.intro.portraitAlt} />
        </div>
      </div>

      {/* Key figures: lines draw in, numbers count up */}
      <Reveal as="dl" selector="[data-figure]" className="mt-section grid gap-y-10 md:grid-cols-3" aria-label={dict.figures.label}>
        {dict.figures.items.map((f) => (
          <div key={f.label} data-figure className="border-t border-line pt-6 md:pr-8">
            <dt className="sr-only">{f.label}</dt>
            <dd>
              <CountUp value={f.value} suffix={f.suffix} className="text-display-xl block" />
              <span className="mt-3 block max-w-[28ch] text-ink-muted" aria-hidden="true">
                {f.label}
              </span>
            </dd>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
