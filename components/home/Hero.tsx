"use client";

import { useRef } from "react";
import type { Dictionary } from "@/lib/i18n";
import { duration, ease, gsap, mq, stagger, useGSAP, whenLoaderDone } from "@/lib/motion";
import { Magnetic } from "@/components/motion/Magnetic";
import { ArrowSwap } from "@/components/layout/RollText";
import { scrollToTarget, useLenis } from "@/components/layout/SmoothScroll";
import { HeroMedia } from "./HeroMedia";
import { HoverText } from "@/components/motion/HoverText";

/**
 * Full-screen hero over a background video (or project visuals until one is
 * provided), centred: the name always visible, a role line that rotates
 * (UX/UI · Product · AI-Augmented Designer), one sentence, one call to action.
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

        // Role line: each title rolls up and the next one comes in from below.
        const roles = gsap.utils.toArray<HTMLElement>("[data-role]");
        gsap.set(roles.slice(1), { y: 0, yPercent: 110 });
        const cycle = gsap.timeline({ repeat: -1, paused: true });
        roles.forEach((role, i) => {
          const next = roles[(i + 1) % roles.length];
          cycle
            .to(role, { yPercent: -110, duration: 0.7, ease: ease.inOut }, "+=1.8")
            .fromTo(next, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: ease.inOut, immediateRender: false }, "<");
        });
        tl.add(() => cycle.play());

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
        <h1 className="text-display-xl text-[clamp(3.5rem,13vw,9.5rem)] uppercase">
          {t.name.split(" ").map((word) => (
            <span key={word} className="inline-block overflow-hidden px-[0.12em] pb-[0.04em] align-top">
              <span data-line data-hero-intro className="block">
                <HoverText text={word} />
              </span>
            </span>
          ))}
        </h1>

        {/* Rotating role: decorative; the full list is read once by assistive tech */}
        <p data-fade data-hero-intro className="mt-4 font-display text-[clamp(1.75rem,5.5vw,4.5rem)] font-medium leading-none tracking-[-0.03em] text-accent">
          <span className="sr-only">{t.roles.join(", ")}</span>
          <span className="grid overflow-hidden pb-[0.08em]" aria-hidden="true">
            {t.roles.map((role, i) => (
              // Only the first role shows until JS takes over (also the reduced-motion state).
              <span key={role} data-role className="col-start-1 row-start-1 block" style={i ? { transform: "translateY(110%)" } : undefined}>
                {role}
              </span>
            ))}
          </span>
        </p>

        <p data-fade data-hero-intro className="text-meta mt-10 max-w-[52ch] leading-relaxed text-fg-muted">
          {t.lead} {t.leadEm}
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
        className="text-meta absolute inset-x-0 bottom-6 grid grid-cols-1 gap-2 px-site text-fg-muted md:grid-cols-3 md:pr-24"
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
