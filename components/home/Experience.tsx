"use client";

import { useId, useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { experiences } from "@/lib/content/about";
import { Reveal, RevealText } from "@/components/motion/Reveal";

/**
 * Career as a compact list: company name, then period · role underneath.
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
            <li
              key={job.company + job.period.en}
              data-job
              className="group/job relative border-b border-line transition-colors duration-300 hover:bg-[rgb(242_239_233/0.03)] has-[:focus-visible]:bg-[rgb(242_239_233/0.03)]"
            >
              {/* Hover: an accent bar grows on the left edge */}
              <span
                aria-hidden="true"
                className={`absolute inset-y-0 left-0 w-0.5 origin-top bg-accent transition-[scale] duration-500 ease-out ${
                  isOpen ? "scale-y-100" : "scale-y-0 group-hover/job:scale-y-100 group-has-[:focus-visible]/job:scale-y-100"
                }`}
              />
              <h3>
                <button
                  type="button"
                  id={`${id}-h${i}`}
                  aria-expanded={isOpen}
                  aria-controls={`${id}-p${i}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="group/row flex w-full items-start justify-between gap-6 py-5 pl-4 pr-2 text-left md:pl-6"
                  data-cursor="link"
                >
                  <span className="flex flex-col gap-2">
                    <span className="flex items-center gap-3 text-xl font-medium transition-[color,transform] duration-500 ease-out group-hover/row:translate-x-1 group-hover/row:text-accent md:text-2xl">
                      {job.company}
                      {job.current && (
                        <>
                          <span className="pulse-dot relative inline-block size-2 rounded-full bg-accent" aria-hidden="true" />
                          <span className="sr-only">{t.current}</span>
                        </>
                      )}
                    </span>
                    <span className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3">
                      <span className="text-meta text-fg-muted">{job.period[locale]}</span>
                      <span className="hidden text-fg-muted sm:inline" aria-hidden="true">
                        ·
                      </span>
                      <span className="text-fg-muted">{job.role[locale]}</span>
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-xl text-accent transition-[transform,border-color,background-color,color] duration-500 ease-out group-hover/row:border-accent group-hover/row:bg-accent group-hover/row:text-ink"
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
                  <div className="pb-6 pl-4 md:pl-6">
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
