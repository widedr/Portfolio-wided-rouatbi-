"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { duration, ease, gsap, mq, stagger, useGSAP } from "@/lib/motion";
import { HoverText } from "@/components/motion/HoverText";
import { RevealText } from "@/components/motion/Reveal";

type Step = { step: string; text: string };

type Props = {
  title: string;
  steps: Step[];
  aiLabel: string;
  aiMethod?: { title: string; lines: string[] };
  aiMakingOf?: { before: string; after: string; caption: string };
  sliderLabels: { before: string; after: string; label: string };
};

/** Signature section: a timeline that fills on scroll, plus the AI making-of. */
export function Process({ title, steps, aiLabel, aiMethod, aiMakingOf, sliderLabels }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        gsap.fromTo(
          "[data-fill]",
          { scaleX: 0 },
          { scaleX: 1, ease: "none", scrollTrigger: { trigger: "[data-timeline]", start: "top 75%", end: "bottom 40%", scrub: true } },
        );
        gsap.from("[data-step]", {
          opacity: 0,
          y: 24,
          duration: duration.base,
          ease: ease.out,
          stagger: stagger.items,
          scrollTrigger: { trigger: "[data-timeline]", start: "top 80%", once: true },
        });
        gsap.from("[data-line]", {
          opacity: 0,
          x: -8,
          duration: duration.short,
          ease: ease.soft,
          stagger: 0.06,
          scrollTrigger: { trigger: "[data-editor]", start: "top 75%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="process" className="py-section px-site" aria-labelledby="process-title">
      <p className="text-meta mb-6 text-fg-muted">05</p>
      <RevealText id="process-title" className="text-display-l mb-16">
        <HoverText text={title} />
      </RevealText>

      <div data-timeline className="relative">
        <div className="absolute left-0 right-0 top-[7px] hidden h-px bg-line lg:block" aria-hidden="true">
          <div data-fill className="h-full origin-left bg-accent" />
        </div>
        <ol className="grid gap-10 md:grid-cols-3 lg:grid-cols-6 lg:gap-[var(--gutter)]">
          {steps.map((s, i) => (
            <li key={s.step} data-step className="relative lg:pt-10">
              <span className="absolute left-0 top-0 hidden size-[15px] rounded-full border border-accent bg-bg lg:block" aria-hidden="true" />
              <span className="text-meta text-fg-muted">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 text-xl font-medium">{s.step}</h3>
              <p className="mt-2 text-fg-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>

      {(aiMethod || aiMakingOf) && (
        <div className="mt-section grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-meta text-accent">{aiLabel}</p>
            {aiMakingOf && <p className="mt-6 text-body-l text-fg-muted">{aiMakingOf.caption}</p>}
          </div>
          <div className="flex flex-col gap-12 lg:col-span-8">
            {aiMakingOf && <BeforeAfter {...aiMakingOf} labels={sliderLabels} />}
            {aiMethod && (
              <figure data-editor className="overflow-hidden rounded-lg border border-line bg-[#171715] font-mono text-sm">
                <figcaption className="flex items-center gap-2 border-b border-line px-4 py-3">
                  <span className="size-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
                  <span className="size-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
                  <span className="size-3 rounded-full bg-[#28c840]" aria-hidden="true" />
                  <span className="ml-3 text-fg-muted">{aiMethod.title}</span>
                </figcaption>
                <pre className="whitespace-pre-wrap p-4 leading-7 md:p-6">
                  {aiMethod.lines.map((line, i) => (
                    <span key={i} data-line className="flex gap-6">
                      <span className="w-6 shrink-0 select-none text-right text-fg-muted/50" aria-hidden="true">
                        {i + 1}
                      </span>
                      <span className={line.startsWith("#") ? "text-accent" : "text-fg"}>{line || " "}</span>
                    </span>
                  ))}
                </pre>
              </figure>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

/** Before/after comparison with a draggable handle; the handle is a native range input (keyboard ready). */
function BeforeAfter({ before, after, labels }: { before: string; after: string; labels: { before: string; after: string; label: string } }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="relative aspect-[16/10] select-none overflow-hidden bg-white">
      <Image src={after} alt={labels.after} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before} alt={labels.before} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
      </div>
      <div className="pointer-events-none absolute inset-y-0 w-px bg-accent" style={{ left: `${pos}%` }} aria-hidden="true">
        <span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-ink">
          ↔
        </span>
      </div>
      <span className="text-meta absolute left-4 top-4 bg-bg/80 px-2 py-1">{labels.before}</span>
      <span className="text-meta absolute right-4 top-4 bg-bg/80 px-2 py-1">{labels.after}</span>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={labels.label}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
