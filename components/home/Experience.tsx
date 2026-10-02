"use client";

import { useRef } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { experiences } from "@/lib/content/about";
import { duration, ease, gsap, mq, useGSAP } from "@/lib/motion";
import { RevealText } from "@/components/motion/Reveal";

/** Career timeline: the vertical line draws as you scroll, each role fades in. */
export function Experience({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const t = dict.experience;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        gsap.fromTo(
          "[data-line]",
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: "[data-timeline]", start: "top 70%", end: "bottom 60%", scrub: true } },
        );
        gsap.utils.toArray<HTMLElement>("[data-job]").forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 32,
            duration: duration.base,
            ease: ease.out,
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="experience" className="py-section px-site" aria-labelledby="experience-title">
      <p className="text-meta mb-6 text-fg-muted">03 — {t.label}</p>
      <RevealText id="experience-title" className="text-display-l mb-20 max-w-[18ch]">
        {t.title} <em className="text-accent">{t.titleEm}</em>
      </RevealText>

      <ol data-timeline className="relative">
        <span className="absolute left-0 top-0 h-full w-px bg-line md:left-[calc(25%-1px)]" aria-hidden="true">
          <span data-line className="block h-full w-full origin-top bg-accent" />
        </span>

        {experiences.map((job) => (
          <li
            key={job.company + job.period.en}
            data-job
            className="group/job relative grid gap-4 pb-16 pl-8 last:pb-0 md:grid-cols-4 md:gap-[var(--gutter)] md:pl-0"
          >
            <span
              aria-hidden="true"
              className={`absolute left-[-4px] top-2 size-[9px] rounded-full border border-accent md:left-[calc(25%-5px)] ${
                job.current ? "bg-accent" : "bg-bg"
              }`}
            />
            <div className="md:pr-10 md:text-right">
              <p className="text-meta text-fg-muted">{job.period[locale]}</p>
              {job.current && (
                <p className="text-meta mt-2 inline-flex items-center gap-2 text-accent">
                  <span className="pulse-dot relative inline-block size-1.5 rounded-full bg-accent" aria-hidden="true" />
                  {t.current}
                </p>
              )}
            </div>
            <div className="md:col-span-3 md:pl-10">
              <h3 className="text-h2 transition-transform duration-500 ease-out group-hover/job:translate-x-2">{job.company}</h3>
              <p className="mt-1 text-fg-muted">{job.role[locale]}</p>
              <p className="measure mt-4 text-fg-muted">{job.description[locale]}</p>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tags">
                {job.tags.map((tag) => (
                  <li key={tag} className="text-meta rounded-full border border-line px-3 py-1">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
