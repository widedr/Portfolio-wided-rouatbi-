"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, mq, useGSAP } from "@/lib/motion";

type Persona = { role: string; situation: string; outcome: string; image?: string };

/**
 * Users in context. Desktop: the section pins and cards scroll horizontally
 * with the vertical scroll. Mobile / reduced motion: cards stack.
 */
export function Personas({ title, note, personas }: { title: string; note: string; personas: Persona[] }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${mq.motion} and ${mq.desktop}`, () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="personas" className="theme-paper overflow-hidden py-section lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center lg:py-16" aria-labelledby="personas-title">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6 px-site">
        <div>
          <p className="text-meta mb-6">04</p>
          <h2 id="personas-title" className="text-display-l">
            {title}
          </h2>
        </div>
        <p className="text-meta max-w-xs text-ink-muted">{note}</p>
      </div>
      <div ref={track} className="flex flex-col gap-[var(--gutter)] px-site lg:w-max lg:flex-row">
        {personas.map((p, i) => (
          <article key={p.role} className="grid gap-6 border-t border-line pt-6 lg:w-[62vw] lg:grid-cols-2">
            <div className="flex flex-col">
              <span className="text-meta text-ink-muted">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-h2 mt-4">{p.role}</h3>
              <p className="mt-6 text-body-l">{p.situation}</p>
              <p className="mt-6 border-l-2 border-accent pl-4 text-ink-muted">{p.outcome}</p>
            </div>
            {p.image && (
              <div className="relative aspect-[533/357] self-start overflow-hidden bg-white">
                <Image src={p.image} alt="" fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-contain" />
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
