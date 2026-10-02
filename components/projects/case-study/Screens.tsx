"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { duration, ease, Flip, gsap, mq, prefersReducedMotion, useGSAP } from "@/lib/motion";
import { HoverText } from "@/components/motion/HoverText";

type Screen = { src: string; width: number; height: number; alt: string; title: string; decision: string };

type Labels = { title: string; zoom: string; close: string; prev: string; next: string };

/**
 * Key screens as numbered tabs. Switching cross-fades the image and rewrites
 * the caption (each caption explains a decision). Clicking the image opens a
 * lightbox that grows from the thumbnail (Flip), with ← → and Escape.
 */
export function Screens({ screens, labels, zoomCursor }: { screens: Screen[]; labels: Labels; zoomCursor: string }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        gsap.from("[data-stage]", {
          clipPath: "inset(100% 0% 0% 0%)",
          duration: duration.long,
          ease: ease.out,
          scrollTrigger: { trigger: "[data-stage]", start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Caption rewrites itself on change.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    gsap.fromTo("[data-caption]", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: duration.short, ease: ease.soft });
  }, [active]);

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (i + delta + screens.length) % screens.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  const screen = screens[active];

  return (
    <section ref={root} id="screens" className="py-section px-site" aria-labelledby="screens-title">
      <p className="text-meta mb-6 text-fg-muted">06</p>
      <h2 id="screens-title" className="text-display-l mb-12">
        <HoverText text={labels.title} />
      </h2>

      <div role="tablist" aria-label={labels.title} className="mb-8 flex flex-wrap gap-x-6 gap-y-2 border-b border-line">
        {screens.map((s, i) => (
          <button
            key={s.src}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            id={`screen-tab-${i}`}
            aria-selected={active === i}
            aria-controls="screen-panel"
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onTabKey(e, i)}
            className="text-meta relative min-h-11 pb-3 text-fg-muted transition-colors duration-200 hover:text-fg aria-selected:text-fg"
            data-cursor="link"
          >
            {String(i + 1).padStart(2, "0")} {s.title}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 -bottom-px h-0.5 origin-left bg-accent transition-transform duration-400 ease-out"
              style={{ transform: `scaleX(${active === i ? 1 : 0})` }}
            />
          </button>
        ))}
      </div>

      <div id="screen-panel" role="tabpanel" aria-labelledby={`screen-tab-${active}`} className="grid gap-10 lg:grid-cols-12">
        <button
          ref={trigger}
          type="button"
          data-stage
          onClick={() => setLightbox(true)}
          aria-label={`${labels.zoom} : ${screen.title}`}
          className="relative aspect-[533/357] overflow-hidden bg-white lg:col-span-8"
          data-cursor="zoom"
          data-cursor-label={zoomCursor}
        >
          {screens.map((s, i) => (
            <Image
              key={s.src}
              src={s.src}
              alt={i === active ? s.alt : ""}
              data-flip-id={i === active ? "screen" : undefined}
              fill
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="object-contain transition-opacity duration-500"
              style={{ opacity: i === active ? 1 : 0 }}
            />
          ))}
        </button>
        <div className="lg:col-span-4 lg:pt-4" aria-live="polite">
          <div data-caption>
            <p className="text-meta text-accent">
              {String(active + 1).padStart(2, "0")} — {screen.title}
            </p>
            <p className="mt-4 text-body-l">{screen.decision}</p>
          </div>
        </div>
      </div>

      {lightbox && (
        <Lightbox
          screens={screens}
          index={active}
          onIndex={setActive}
          labels={labels}
          onClose={() => {
            setLightbox(false);
            trigger.current?.focus();
          }}
        />
      )}
    </section>
  );
}

function Lightbox({
  screens,
  index,
  onIndex,
  labels,
  onClose,
}: {
  screens: Screen[];
  index: number;
  onIndex: (i: number) => void;
  labels: Labels;
  onClose: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const screen = screens[index];
  const step = useCallback((d: number) => onIndex((index + d + screens.length) % screens.length), [index, onIndex, screens.length]);

  // Grow from the thumbnail.
  useGSAP(
    () => {
      const from = document.querySelector('[data-flip-id="screen"]');
      const to = root.current!.querySelector("[data-lightbox-img]");
      gsap.fromTo(root.current, { backgroundColor: "rgb(15 15 14 / 0)" }, { backgroundColor: "rgb(15 15 14 / 0.94)", duration: duration.short });
      if (from && to && !prefersReducedMotion()) {
        Flip.fit(to, from, { scale: true });
        gsap.to(to, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: duration.base, ease: ease.inOut });
      }
      closeBtn.current?.focus();
    },
    { scope: root },
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "Tab" && root.current) {
        const f = [...root.current.querySelectorAll<HTMLElement>("button")];
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [onClose, step]);

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={screen.title}
      className="fixed inset-0 z-[80] flex flex-col p-4 md:p-10"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      data-lenis-prevent
    >
      <div className="mb-4 flex items-center justify-between text-[#f2efe9]">
        <p className="text-meta">
          {String(index + 1).padStart(2, "0")} / {String(screens.length).padStart(2, "0")} — {screen.title}
        </p>
        <button ref={closeBtn} type="button" onClick={onClose} className="text-meta min-h-11 rounded-full border border-[#f2efe9]/40 px-5">
          {labels.close} ✕
        </button>
      </div>
      <div className="relative flex-1" onClick={onClose}>
        <div data-lightbox-img className="absolute inset-0 origin-top-left bg-white" onClick={(e) => e.stopPropagation()}>
          <Image src={screen.src} alt={screen.alt} fill sizes="100vw" className="object-contain" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-6 text-[#f2efe9]">
        <button type="button" onClick={() => step(-1)} aria-label={labels.prev} className="grid size-12 place-items-center rounded-full border border-[#f2efe9]/40">
          ←
        </button>
        <p className="hidden max-w-[60ch] text-center text-sm opacity-80 md:block">{screen.decision}</p>
        <button type="button" onClick={() => step(1)} aria-label={labels.next} className="grid size-12 place-items-center rounded-full border border-[#f2efe9]/40">
          →
        </button>
      </div>
    </div>
  );
}
