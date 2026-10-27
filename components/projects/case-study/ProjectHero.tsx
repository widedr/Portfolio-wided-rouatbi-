"use client";

import Image from "next/image";
import { useRef } from "react";
import { duration, ease, gsap, mq, stagger, useGSAP, whenLoaderDone } from "@/lib/motion";
import { HoverText } from "@/components/motion/HoverText";
import { blockReveal } from "@/lib/blockReveal";

type Props = {
  title: string;
  subtitle: string;
  eyebrow: string;
  cover: { src: string; width: number; height: number };
  alt: string;
  scrollLabel: string;
};

/**
 * Full-screen opening. The title is typed in behind an accent block; on scroll the visual shrinks and
 * rounds (scale 1 → 0.9, radius 0 → 24px) while the title moves faster.
 */
export function ProjectHero({ title, subtitle, eyebrow, cover, alt, scrollLabel }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        // Lift the CSS pre-hide first so `from` tweens record the visible state as their end.
        gsap.set("[data-hero-intro]", { opacity: 1 });
        const name = blockReveal(root.current!.querySelector<HTMLElement>("[data-title]")!);
        name.hide();
        const tl = gsap
          .timeline({ paused: true })
          .from("[data-visual]", { clipPath: "inset(100% 0% 0% 0%)", duration: duration.long, ease: ease.inOut })
          .from("[data-visual] img", { scale: 1.2, duration: duration.long * 1.3, ease: ease.out }, "<")
          .add(() => name.play(), "-=0.7")
          .from("[data-sub]", { opacity: 0, y: 16, duration: duration.base, ease: ease.out, stagger: stagger.items }, "-=0.5");
        const off = whenLoaderDone(() => tl.play());

        gsap.to("[data-visual]", {
          scale: 0.9,
          borderRadius: 24,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-title-wrap]", {
          yPercent: -60,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
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
    <section ref={root} className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-10">
      <div data-visual data-hero-intro className="absolute inset-0 overflow-hidden will-change-transform">
        <Image src={cover.src} alt={alt} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" aria-hidden="true" />
      </div>

      <div data-title-wrap className="relative px-site text-[#f2efe9]">
        <p data-sub data-hero-intro className="text-meta mb-6 opacity-80">
          {eyebrow}
        </p>
        <h1 data-title data-hero-intro className="text-display-xl">
          <HoverText text={title} />
        </h1>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
          <p data-sub data-hero-intro className="text-body-l max-w-[40ch]">
            {subtitle}
          </p>
          <p data-sub data-hero-intro className="text-meta flex items-center gap-3 opacity-80">
            {scrollLabel}
            <span className="scroll-cue inline-block" aria-hidden="true">
              ↓
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
