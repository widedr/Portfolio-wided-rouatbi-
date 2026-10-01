"use client";

import { useRef } from "react";
import type { Dictionary } from "@/lib/i18n";
import { duration, ease, gsap, mq, stagger, useGSAP, whenLoaderDone } from "@/lib/motion";
import { Magnetic } from "@/components/motion/Magnetic";
import { ArrowSwap } from "@/components/layout/RollText";
import { scrollToTarget, useLenis } from "@/components/layout/SmoothScroll";
import { HeroMedia } from "./HeroMedia";

/**
 * Full-screen hero over a background video (or project visuals until one is
 * provided), centred: three oversized lines, one sentence, one call to action.
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
    <section
      ref={root}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-site pb-24 pt-[var(--header-h)] text-center"
    >
      <HeroMedia />

      <div className="relative flex flex-col items-center">
        <p data-fade data-hero-intro className="text-meta mb-8 text-fg-muted">
          {t.name} — {t.role}
        </p>

        <h1 className="text-display-xl text-[clamp(3.5rem,14vw,9.5rem)] uppercase">
          <span className="sr-only">{t.name} — </span>
          {t.lines.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.04em]">
              <span data-line data-hero-intro className={`block ${i === 1 ? "text-accent" : ""}`}>
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p data-fade data-hero-intro className="text-body-l mt-10 max-w-[38ch]">
          {t.lead} <em className="text-accent">{t.leadEm}</em>
        </p>

        <div data-fade data-hero-intro className="mt-10">
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

      {/* Bottom bar: location · scroll · availability */}
      <div
        data-fade
        data-hero-intro
        className="text-meta absolute inset-x-0 bottom-6 grid grid-cols-1 gap-2 px-site text-fg-muted md:grid-cols-3"
      >
        <span className="hidden text-left md:block">{t.based}</span>
        <span className="flex items-center justify-center gap-3">
          {t.scroll}
          <span className="scroll-cue inline-block" aria-hidden="true">
            ↓
          </span>
        </span>
        <span className="hidden items-center justify-end gap-3 md:flex">
          <span className="pulse-dot relative inline-block size-2 rounded-full bg-[#4ade80]" aria-hidden="true" />
          {t.relocation}
        </span>
      </div>
    </section>
  );
}
