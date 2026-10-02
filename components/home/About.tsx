import type { Dictionary, Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { about } from "@/lib/content/about";
import { HighlightText } from "@/components/motion/HighlightText";
import { Magnetic } from "@/components/motion/Magnetic";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowSwap } from "@/components/layout/RollText";
import { Portrait } from "./Portrait";

/** About me: statement, bio, portrait, key figures and skills — on the paper palette. */
export function About({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const a = dict.about;

  return (
    <section id="about" className="theme-paper py-section px-site" aria-labelledby="about-label">
      <h2 id="about-label" className="text-meta mb-12">
        02 — {a.label}
      </h2>

      <HighlightText
        text={`${about.leadPrefix[locale]}${about.leadHighlight[locale]}`}
        className="text-display-l max-w-[22ch]"
      />

      <div className="grid-site mt-section gap-y-12">
        <Reveal className="col-span-4 flex flex-col gap-10 md:col-span-6 lg:col-span-7" selector="[data-block]">
          <p data-block className="text-body-l measure">
            {about.bio[locale]}
          </p>

          <ul data-block className="flex flex-wrap gap-2" aria-label={a.sectors}>
            {about.sectors[locale].map((s) => (
              <li key={s} className="text-meta rounded-full border border-line px-4 py-2">
                {s}
              </li>
            ))}
          </ul>

          <dl data-block className="grid grid-cols-2 gap-6 border-t border-line pt-6">
            <div>
              <dt className="text-meta text-ink-muted">{a.education}</dt>
              <dd className="mt-2">{about.education[locale]}</dd>
            </div>
            <div>
              <dt className="text-meta text-ink-muted">{a.languages}</dt>
              <dd className="mt-2">{about.languages[locale]}</dd>
            </div>
          </dl>

          <div data-block>
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
        </Reveal>

        <div className="col-span-3 md:col-span-3 md:col-start-4 lg:col-span-4 lg:col-start-9">
          <Portrait alt={dict.intro.portraitAlt} />
        </div>
      </div>

      {/* Key figures: numbers count up */}
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

      {/* Skills: four typographic columns, no cards */}
      <h3 className="text-meta mb-8 mt-section">{a.skills}</h3>
      <Reveal selector="[data-skill]" className="grid gap-x-[var(--gutter)] gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {about.skills.map((group, i) => (
          <div key={group.title.en} data-skill className="border-t border-ink pt-5">
            <p className="text-meta mb-5 flex gap-3">
              <span className="text-accent-ink">{String(i + 1).padStart(2, "0")}</span>
              {group.title[locale]}
            </p>
            <ul className="flex flex-col gap-2">
              {group.items[locale].map((item) => (
                <li key={item} className="text-body-l transition-[color,transform] duration-300 ease-out hover:translate-x-1 hover:text-accent-ink">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
