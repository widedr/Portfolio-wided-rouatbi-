"use client";

import { useRef, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { gsap, mq, ScrollTrigger, useGSAP } from "@/lib/motion";

/**
 * Infinite band. Speed and direction follow the scroll: faster while
 * scrolling, reversed when scrolling up. Pauses on hover. Decorative copy
 * only; the duplicated track is hidden from assistive tech.
 */
export function Marquee({
  children,
  reverse = false,
  speed = 40,
  className,
  label,
}: {
  children: ReactNode;
  reverse?: boolean;
  /** Seconds for one full loop at rest. */
  speed?: number;
  className?: string;
  label?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        const tracks = root.current!.querySelectorAll("[data-track]");
        const base = reverse ? -1 : 1;
        const loop = gsap.to(tracks, { xPercent: -100, ease: "none", duration: speed, repeat: -1 });
        // Start deep into the repeat so playing backwards never hits time 0.
        loop.totalTime(speed * 1000).timeScale(base);
        let hovered = false;

        const st = ScrollTrigger.create({
          onUpdate(self) {
            if (hovered) return;
            const dir = self.direction === 1 ? 1 : -1;
            const boost = gsap.utils.clamp(1, 5, 1 + Math.abs(self.getVelocity()) / 400);
            gsap.to(loop, { timeScale: base * dir * boost, duration: 0.2, overwrite: true });
            gsap.to(loop, { timeScale: base * dir, duration: 1, delay: 0.25 });
          },
        });

        const el = root.current!;
        const pause = () => {
          hovered = true;
          gsap.to(loop, { timeScale: 0, duration: 0.5, overwrite: true });
        };
        const resume = () => {
          hovered = false;
          gsap.to(loop, { timeScale: base, duration: 0.5, overwrite: true });
        };
        el.addEventListener("pointerenter", pause);
        el.addEventListener("pointerleave", resume);
        return () => {
          st.kill();
          el.removeEventListener("pointerenter", pause);
          el.removeEventListener("pointerleave", resume);
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={cx("flex overflow-hidden whitespace-nowrap", className)} aria-label={label} role={label ? "group" : undefined}>
      <div data-track className="flex shrink-0 items-center">
        {children}
      </div>
      <div data-track className="flex shrink-0 items-center" aria-hidden="true">
        {children}
      </div>
    </div>
  );
}
