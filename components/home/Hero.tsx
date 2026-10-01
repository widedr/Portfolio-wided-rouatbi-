"use client";

import { useRef } from "react";
import type { Dictionary } from "@/lib/i18n";
import { duration, ease, gsap, mq, stagger, useGSAP, whenLoaderDone } from "@/lib/motion";
import { Magnetic } from "@/components/motion/Magnetic";
import { ArrowSwap } from "@/components/layout/RollText";
import { scrollToTarget, useLenis } from "@/components/layout/SmoothScroll";

/**
 * Typographic hero: three oversized lines, one sentence, one call to action.
 * Lines rise from their masks after the loader, then the rest fades in.
 */
export function Hero({ dict }: { dict: Dictionary }) {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const t = dict.hero;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        // Lift the CSS pre-hide first so `from` tweens record the visible state as their end.
        gsap.set("[data-hero-intro]", { opacity: 1 });
        const tl = gsap
          .timeline({ paused: true })
          .from("[data-line]", { yPercent: 110, duration: duration.long, ease: ease.out, stagger: stagger.lines + 0.02 })
          .from("[data-fade]", { opacity: 0, y: 20, duration: duration.base, ease: ease.out, stagger: stagger.items }, "-=0.7");
        const off = whenLoaderDone(() => tl.play());
        return off;
      });
      mm.add(mq.reduced, () => {
        gsap.set("[data-hero-intro]", { opacity: 1 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative flex min-h-[100svh] flex-col justify-end px-site pb-8 pt-[var(--header-h)]">
      <h1 className="text-display-xl text-[clamp(4rem,17vw,12rem)] uppercase">
        <span className="sr-only">{t.name} — </span>
        {t.lines.map((line, i) => (
          <span key={line} className="block overflow-hidden pb-[0.04em]">
            <span data-line data-hero-intro className="block">
              <span
                className={`block transition-transform duration-700 ease-out hover:translate-x-3 ${
                  i === 1 ? "text-accent" : ""
                }`}
              >
                {line}
              </span>
            </span>
          </span>
        ))}
      </h1>

      <div className="mt-10 grid gap-8 border-t border-line pt-8 md:grid-cols-12 md:gap-[var(--gutter)]">
        <p data-fade data-hero-intro className="text-body-l max-w-[34ch] md:col-span-6 lg:col-span-5">
          {t.lead} <em className="text-accent">{t.leadEm}</em>
        </p>

        <div data-fade data-hero-intro className="text-meta flex flex-col gap-2 text-fg-muted md:col-span-3 lg:col-span-4">
          <span>{t.based}</span>
          <span className="flex items-center gap-3">
            <span className="pulse-dot relative inline-block size-2 rounded-full bg-[#4ade80]" aria-hidden="true" />
            {t.relocation}
          </span>
        </div>

        <div data-fade data-hero-intro className="flex items-start md:col-span-3 md:justify-end">
          <Magnetic>
            <a
              href="#featured"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget(lenis, "#featured");
              }}
              className="btn-fill arrow-trigger inline-flex min-h-14 items-center gap-3 rounded-full border border-fg px-7 font-medium"
              data-cursor="link"
            >
              <span className="btn-fill__blob" aria-hidden="true" />
              {t.cta}
              <ArrowSwap direction="down" />
            </a>
          </Magnetic>
        </div>
      </div>

      <p data-fade data-hero-intro className="text-meta mt-8 flex items-center gap-3 text-fg-muted">
        {t.scroll}
        <span className="scroll-cue inline-block" aria-hidden="true">
          ↓
        </span>
      </p>
    </section>
  );
}
