"use client";

import { useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import { site } from "@/lib/site";
import { duration, ease, gsap, mq, stagger, useGSAP } from "@/lib/motion";
import { Magnetic } from "@/components/motion/Magnetic";
import { LocalClock } from "./LocalClock";
import { ArrowSwap } from "./RollText";
import { scrollToTarget, useLenis } from "./SmoothScroll";

export function Footer({ dict }: { dict: Dictionary }) {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  // Giant name: letters rise from a mask when the footer scrolls in.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        gsap.from("[data-name-char]", {
          yPercent: 110,
          duration: duration.long,
          ease: ease.out,
          stagger: stagger.chars * 2,
          scrollTrigger: { trigger: "[data-name]", start: "top 95%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const ctaChars = [...dict.footer.cta];

  return (
    <footer ref={root} id="contact" className="relative overflow-hidden border-t border-line px-site pt-section">
      <p className="text-meta mb-8 text-fg-muted">{dict.footer.lead}</p>

      {/* Big CTA: letters lift one by one, an accent line draws underneath */}
      <a
        href={`mailto:${site.email}`}
        className="group/cta relative inline-block max-w-full"
        data-cursor="link"
        aria-label={`${dict.footer.cta} — ${site.email}`}
      >
        <span className="text-display-xl block" aria-hidden="true">
          {ctaChars.map((char, i) => (
            <span
              key={i}
              className="inline-block transition-transform duration-500 ease-out group-hover/cta:-translate-y-[0.08em] group-focus-visible/cta:-translate-y-[0.08em]"
              style={{ transitionDelay: `${i * 20}ms` }}
            >
              {char === " " ? " " : char}
            </span>
          ))}
        </span>
        <span
          aria-hidden="true"
          className="absolute -bottom-2 left-0 h-[3px] w-full origin-left scale-x-0 bg-accent transition-transform duration-700 ease-out group-hover/cta:scale-x-100 group-focus-visible/cta:scale-x-100"
        />
      </a>

      <div className="mt-16 grid gap-10 border-t border-line pt-10 md:grid-cols-2 lg:grid-cols-4">
        {/* Email + copy */}
        <div className="flex flex-col gap-3">
          <span className="text-meta text-fg-muted">Email</span>
          <div className="flex flex-wrap items-center gap-3">
            <a href={`mailto:${site.email}`} className="link-underline text-body-l">
              {site.email}
            </a>
            <button
              type="button"
              onClick={copy}
              className="text-meta min-h-11 rounded-full border border-line px-4 transition-colors duration-200 hover:border-accent hover:text-accent"
              data-cursor="link"
            >
              {copied ? dict.footer.copied : dict.footer.copy}
            </button>
            <span className="sr-only" aria-live="polite">
              {copied ? dict.footer.copiedAnnounce : ""}
            </span>
          </div>
        </div>

        {/* Live clock + availability */}
        <div className="flex flex-col gap-3">
          <span className="text-meta text-fg-muted">
            <LocalClock />
          </span>
          <p className="flex items-center gap-3">
            <span className="pulse-dot relative inline-block size-2 rounded-full bg-[#4ade80]" aria-hidden="true" />
            {dict.footer.available}
          </p>
        </div>

        <ul className="text-meta flex flex-col gap-2">
          {[
            ["LinkedIn", site.links.linkedin],
            ["GitHub", site.links.github],
            ["WhatsApp", site.links.whatsapp],
          ].map(([label, url]) => (
            <li key={label}>
              <a href={url} target="_blank" rel="noreferrer" className="arrow-trigger link-underline inline-flex gap-2">
                {label} <ArrowSwap direction="up-right" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex flex-col items-start gap-4 lg:items-end">
          <div className="text-meta flex gap-6">
            <a href={site.links.cvFr} download className="link-underline">
              {dict.footer.cvFr}
            </a>
            <a href={site.links.cvEn} download className="link-underline">
              {dict.footer.cvEn}
            </a>
          </div>
          <Magnetic>
            <button
              type="button"
              onClick={() => scrollToTarget(lenis, 0)}
              className="group/top text-meta inline-flex min-h-11 items-center gap-3 rounded-full border border-line px-5"
              data-cursor="link"
            >
              {dict.footer.backToTop}
              <span aria-hidden="true" className="inline-block transition-transform duration-500 ease-out group-hover/top:rotate-[360deg]">
                ↑
              </span>
            </button>
          </Magnetic>
        </div>
      </div>

      <p data-name className="mt-section flex select-none justify-between overflow-hidden leading-[0.8]" aria-hidden="true">
        {[..."ROUATBI"].map((c, i) => (
          <span
            key={i}
            data-name-char
            className="inline-block font-display text-[clamp(4rem,23vw,26rem)] font-medium tracking-[-0.04em]"
          >
            {c}
          </span>
        ))}
      </p>
      <p className="text-meta flex flex-wrap justify-between gap-4 border-t border-line py-6 text-fg-muted">
        <span>© {new Date().getFullYear()} Wided Rouatbi</span>
        <span>{dict.footer.rights}</span>
      </p>
    </footer>
  );
}
