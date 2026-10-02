"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { href } from "@/lib/i18n";
import { gsap, mq, useGSAP } from "@/lib/motion";
import { ArrowSwap } from "@/components/layout/RollText";

/**
 * Full-height invitation to the work page. A progress bar fills as you scroll
 * through it. Navigation stays a deliberate click: no scroll-triggered redirect.
 */
export function NextCta({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        gsap.fromTo(
          "[data-progress]",
          { scaleX: 0 },
          { scaleX: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top 80%", end: "bottom bottom", scrub: true } },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="theme-paper relative flex min-h-[90svh] flex-col justify-between px-site py-16">
      <p className="text-meta">06 — {dict.next.label}</p>
      <Link
        href={href(locale, "/work")}
        className="group/next arrow-trigger block py-12"
        data-cursor="view"
        data-cursor-label={dict.cursor.open}
      >
        <span className="text-display-xl block max-w-[12ch] transition-transform duration-700 ease-out group-hover/next:translate-x-3">
          {dict.next.title}
        </span>
        <span className="text-meta mt-8 inline-flex items-center gap-3">
          {dict.next.cta} <ArrowSwap />
        </span>
      </Link>
      <div className="h-px w-full bg-line" aria-hidden="true">
        <div data-progress className="h-[3px] -translate-y-px origin-left bg-accent" />
      </div>
    </section>
  );
}
