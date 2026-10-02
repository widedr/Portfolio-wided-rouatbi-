"use client";

import { useId, useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { about } from "@/lib/content/about";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal, RevealText } from "@/components/motion/Reveal";
import { ArrowSwap } from "@/components/layout/RollText";
import { Portrait } from "./Portrait";

/**
 * About me, kept to roughly one screen: portrait and identity details on the
 * left; statement, short bio, key figures and skills (as tabs) on the right.
 */
export function About({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const a = dict.about;
  const [tab, setTab] = useState(0);
  const id = useId();
  const skills = about.skills;

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (i + delta + skills.length) % skills.length;
    setTab(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  };

  return (
    <section id="about" className="theme-paper py-section px-site" aria-labelledby="about-title">
      <div className="grid-site gap-y-12">
        {/* Left: portrait + identity */}
        <aside className="order-2 col-span-4 md:order-none md:col-span-2 lg:col-span-4">
          <div className="max-w-[220px] md:max-w-[340px]">
            <Portrait alt={dict.intro.portraitAlt} />
          </div>
          <dl className="mt-6 grid max-w-[340px] grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-meta text-ink-muted">{a.education}</dt>
              <dd className="mt-1">{about.education[locale]}</dd>
            </div>
            <div>
              <dt className="text-meta text-ink-muted">{a.languages}</dt>
              <dd className="mt-1">{about.languages[locale]}</dd>
            </div>
          </dl>
          <a
            href={locale === "fr" ? site.links.cvFr : site.links.cvEn}
            download
            className="arrow-trigger link-underline text-meta mt-6 inline-flex items-center gap-2"
            data-cursor="link"
          >
            {dict.intro.cv} <ArrowSwap direction="down" />
          </a>
        </aside>

        {/* Right: statement, bio, figures, skills */}
        <div className="order-1 col-span-4 md:order-none md:col-span-4 lg:col-span-7 lg:col-start-6">
          <p className="text-meta mb-6">02 — {a.label}</p>
          <RevealText id="about-title" className="text-h2 max-w-[24ch]">
            {about.leadPrefix[locale]}
            <span className="text-accent-ink">{about.leadHighlight[locale]}</span>
          </RevealText>

          <Reveal as="p" className="measure mt-8 text-ink-muted">
            {about.bio[locale]}
          </Reveal>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-y border-line py-6" aria-label={dict.figures.label}>
            {dict.figures.items.map((f) => (
              <div key={f.label}>
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <CountUp value={f.value} suffix={f.suffix} className="text-h2 block" />
                  <span className="mt-1 block text-xs leading-snug text-ink-muted" aria-hidden="true">
                    {f.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-10">
            <div role="tablist" aria-label={a.skills} className="flex flex-wrap gap-x-6 gap-y-2">
              {skills.map((group, i) => (
                <button
                  key={group.title.en}
                  id={`${id}-tab-${i}`}
                  role="tab"
                  type="button"
                  aria-selected={tab === i}
                  aria-controls={`${id}-panel`}
                  tabIndex={tab === i ? 0 : -1}
                  onClick={() => setTab(i)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className="text-meta relative min-h-11 text-ink-muted transition-colors duration-200 hover:text-ink aria-selected:text-ink"
                  data-cursor="link"
                >
                  {group.title[locale]}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-2 h-px origin-left bg-accent-ink transition-transform duration-400 ease-out"
                    style={{ transform: `scaleX(${tab === i ? 1 : 0})` }}
                  />
                </button>
              ))}
            </div>
            <ul
              id={`${id}-panel`}
              role="tabpanel"
              aria-labelledby={`${id}-tab-${tab}`}
              className="mt-4 flex flex-wrap gap-2"
            >
              {skills[tab].items[locale].map((item) => (
                <li key={item} className="rounded-full border border-line px-4 py-2 text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
