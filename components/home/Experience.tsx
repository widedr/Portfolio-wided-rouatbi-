"use client";

import { useId, useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { experiences } from "@/lib/content/about";
import { Reveal, RevealText } from "@/components/motion/Reveal";

/**
 * Career as a compact list: one row per role (period · company · role).
 * A row opens to show the description and tags; the current role starts open.
 */
export function Experience({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.experience;
  const [open, setOpen] = useState(0);
  const id = useId();

  return (
    <section id="experience" className="py-section px-site" aria-labelledby="experience-title">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-meta mb-6 text-fg-muted">03 — {t.label}</p>
          <RevealText id="experience-title" className="text-h2 max-w-[22ch]">
            {t.title} <em className="text-accent">{t.titleEm}</em>
          </RevealText>
        </div>
      </div>

      <Reveal as="ul" selector="[data-job]" className="border-t border-line">
        {experiences.map((job, i) => {
          const isOpen = open === i;
          return (
            <li key={job.company + job.period.en} data-job className="border-b border-line">
              <h3>
                <button
                  type="button"
                  id={`${id}-h${i}`}
                  aria-expanded={isOpen}
                  aria-controls={`${id}-p${i}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="group/row grid w-full grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 py-5 text-left md:grid-cols-[14rem_1fr_1fr_auto]"
                  data-cursor="link"
                >
                  <span className="text-meta order-2 col-span-2 text-fg-muted md:order-none md:col-span-1">
                    {job.period[locale]}
                  </span>
                  <span className="flex items-center gap-3 text-xl font-medium transition-transform duration-500 ease-out group-hover/row:translate-x-1 md:text-2xl">
                    {job.company}
                    {job.current && (
                      <>
                        <span className="pulse-dot relative inline-block size-2 rounded-full bg-accent" aria-hidden="true" />
                        <span className="sr-only">{t.current}</span>
                      </>
                    )}
                  </span>
                  <span className="order-3 col-span-2 text-fg-muted md:order-none md:col-span-1">{job.role[locale]}</span>
                  <span
                    aria-hidden="true"
                    className="row-start-1 text-xl text-accent transition-transform duration-500 ease-out md:row-auto"
                    style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
                  >
                    +
                  </span>
                </button>
              </h3>
              <div
                id={`${id}-p${i}`}
                role="region"
                aria-labelledby={`${id}-h${i}`}
                className="grid transition-[grid-template-rows] duration-500 ease-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                inert={!isOpen}
              >
                <div className="overflow-hidden">
                  <div className="pb-6 md:ml-[calc(14rem+1.5rem)]">
                    <p className="measure text-fg-muted">{job.description[locale]}</p>
                    <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tags">
                      {job.tags.map((tag) => (
                        <li key={tag} className="text-meta rounded-full border border-line px-3 py-1">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </Reveal>
    </section>
  );
}
