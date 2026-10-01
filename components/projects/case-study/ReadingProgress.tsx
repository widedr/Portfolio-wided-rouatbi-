"use client";

import { useEffect, useRef, useState } from "react";
import { scrollToTarget, useLenis } from "@/components/layout/SmoothScroll";

type Section = { id: string; label: string };

/** Thin accent reading bar at the top, plus a floating mini table of contents (desktop). */
export function ReadingProgress({ sections, label }: { sections: Section[]; label: string }) {
  const bar = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState<string | null>(null);
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
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
        className="fixed bottom-8 left-[var(--margin)] z-30 hidden transition-opacity duration-500 xl:block"
        style={{ opacity: current ? 1 : 0 }}
      >
        <ol className="flex flex-col gap-1 rounded-2xl bg-bg/70 p-3 backdrop-blur-md">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget(lenis, `#${s.id}`);
                }}
                aria-current={current === s.id ? "location" : undefined}
                className="text-meta flex items-center gap-3 py-1 text-[#f2efe9]/50 transition-colors duration-200 hover:text-[#f2efe9] aria-[current]:text-[#f2efe9]"
              >
                <span
                  aria-hidden="true"
                  className="h-px bg-current transition-[width] duration-300"
                  style={{ width: current === s.id ? 20 : 8 }}
                />
                {s.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
