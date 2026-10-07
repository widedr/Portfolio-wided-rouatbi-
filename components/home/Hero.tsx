"use client";

import { useRef } from "react";
import type { Dictionary } from "@/lib/i18n";
import { duration, ease, gsap, mq, stagger, useGSAP, whenLoaderDone } from "@/lib/motion";
import { Magnetic } from "@/components/motion/Magnetic";
import { ArrowSwap } from "@/components/layout/RollText";
import { StarBorder } from "@/components/layout/StarBorder";
import { scrollToTarget, useLenis } from "@/components/layout/SmoothScroll";
import { HeroMedia } from "./HeroMedia";
import { HoverText } from "@/components/motion/HoverText";
import { blockReveal } from "@/lib/blockReveal";

/**
 * Full-screen hero over a background video (or project visuals until one is
 * provided), centred and kept light: the name, a small rotating role line
 * (UX/UI · Product · AI-Augmented Designer) and one call to action.
 * The name is typed in behind an accent block after the loader, then the rest fades in.
 */
export function Hero({ dict }: { dict: Dictionary }) {
  const root = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const lenis = useLenis();
  const t = dict.hero;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        // Lift the CSS pre-hide first so `from` tweens record the visible state as their end.
        gsap.set("[data-hero-intro]", { opacity: 1 });
        const name = blockReveal(title.current!);
        name.hide();
        const tl = gsap
          .timeline({ paused: true })
          .add(() => name.play())
          .from("[data-fade]", { opacity: 0, y: 20, duration: duration.base, ease: ease.out, stagger: stagger.items }, 0.45);

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
        return () => {
          off();
          name.revert();
        };
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
        <h1 ref={title} data-hero-intro className="text-display-xl text-[clamp(3.5rem,13vw,9.5rem)] uppercase">
          {t.name.split(" ").map((word) => (
            <span key={word} className="inline-block px-[0.12em] pb-[0.04em] align-top">
              <HoverText text={word} hover="pressure" />
            </span>
          ))}
        </h1>

        {/* Rotating role: decorative; the full list is read once by assistive tech */}
        <p data-fade data-hero-intro className="mt-3 font-display text-[clamp(1.25rem,3vw,2.5rem)] font-medium leading-none tracking-[-0.03em] text-accent">
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

        <div data-fade data-hero-intro className="mt-12">
          <Magnetic>
            <a
              href="#featured"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget(lenis, "#featured");
              }}
              className="star-border arrow-trigger"
              data-cursor="link"
            >
              <StarBorder className="inline-flex min-h-14 items-center gap-3 px-7 font-medium">
                {t.cta}
                <ArrowSwap direction="down" />
              </StarBorder>
            </a>
          </Magnetic>
        </div>
      </div>

      {/* Bottom bar: location · availability (desktop only, kept quiet) */}
      <div
        data-fade
        data-hero-intro
        className="text-meta absolute inset-x-0 bottom-6 hidden justify-between px-site text-fg-muted md:flex md:pr-24"
      >
        <span>{t.based}</span>
        <span className="flex items-center gap-3">
          <span className="pulse-dot relative inline-block size-2 rounded-full bg-[#4ade80]" aria-hidden="true" />
          {t.relocation}
        </span>
      </div>
    </section>
  );
}
