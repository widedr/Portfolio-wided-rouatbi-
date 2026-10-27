"use client";

import { useEffect, useRef, useState } from "react";
import { scrollToTarget, useLenis } from "@/components/layout/SmoothScroll";

type Section = { id: string; label: string };

/**
 * Thin accent reading bar at the top, plus a quiet table of contents (wide screens,
 * where the margin can hold it):
 * a vertical rail in the right margin — numbers and ticks only, the current
 * section marked in accent, a fill line tracking progress. Hovering or
 * focusing the rail slides the section titles in over a soft fade.
 */
export function ReadingProgress({ sections, label }: { sections: Section[]; label: string }) {
  const bar = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState<string | null>(null);
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
      if (fill.current) fill.current.style.transform = `scaleY(${progress})`;
      if (window.scrollY < window.innerHeight * 0.8) setCurrent(null);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setCurrent(e.target.id));
        // Hidden while the opening hero fills the screen.
        if (window.scrollY < window.innerHeight * 0.8) setCurrent(null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [sections]);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] h-0.5" aria-hidden="true">
        <div ref={bar} className="h-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
      </div>
      <nav
        aria-label={label}
        className="group/toc fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 transition-opacity duration-500 min-[1400px]:block"
        style={{ opacity: current ? 1 : 0, pointerEvents: current ? "auto" : "none" }}
      >
        {/* Soft fade behind the titles, only while the rail is open */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-y-10 -left-16 -right-4 -z-10 bg-gradient-to-l from-bg via-bg/85 to-transparent opacity-0 transition-opacity duration-500 group-focus-within/toc:opacity-100 group-hover/toc:opacity-100"
        />
        <ol className="relative flex flex-col items-end gap-4 pr-3">
          <span aria-hidden="true" className="absolute inset-y-1 right-0 w-px bg-line">
            <span ref={fill} className="block h-full origin-top bg-accent" style={{ transform: "scaleY(0)" }} />
          </span>
          {sections.map((s, i) => {
            const isCurrent = current === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToTarget(lenis, `#${s.id}`);
                  }}
                  aria-current={isCurrent ? "location" : undefined}
                  className="group/item flex items-center justify-end gap-2 py-0.5 text-fg-muted transition-colors duration-300 hover:text-fg aria-[current]:text-fg"
                  data-cursor="link"
                >
                  <span className="translate-x-2 whitespace-nowrap font-display text-[15px] font-medium tracking-[-0.01em] opacity-0 transition-[opacity,transform] duration-500 ease-out group-focus-within/toc:translate-x-0 group-focus-within/toc:opacity-100 group-hover/toc:translate-x-0 group-hover/toc:opacity-100">
                    {s.label}
                  </span>
                  <span className={`font-mono text-[11px] tabular-nums transition-colors duration-300 ${isCurrent ? "text-accent" : ""}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`h-px transition-[width,background-color] duration-500 ease-out ${isCurrent ? "w-5 bg-accent" : "w-2 bg-current group-hover/item:w-3.5"}`}
                  />
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
