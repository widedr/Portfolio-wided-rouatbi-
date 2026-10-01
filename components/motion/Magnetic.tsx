"use client";

import { useRef, type ReactNode } from "react";
import { ease, gsap, mq, useGSAP } from "@/lib/motion";

/**
 * Wraps a primary CTA: it follows the pointer within an 80px radius
 * (max 12px of travel) and springs back elastically.
 */
export function Magnetic({ children, strength = 12, radius = 80 }: { children: ReactNode; strength?: number; radius?: number }) {
  const wrap = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = wrap.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(`${mq.motion} and ${mq.fine}`, () => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          const reach = Math.max(r.width, r.height) / 2 + radius;
          const dist = Math.hypot(dx, dy);
          if (dist > reach) {
            if (gsap.getProperty(el, "x") !== 0) gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: ease.elastic });
            return;
          }
          const pull = 1 - dist / reach;
          xTo((dx / reach) * strength * 2 * pull);
          yTo((dy / reach) * strength * 2 * pull);
        };
        window.addEventListener("pointermove", onMove);
        return () => {
          window.removeEventListener("pointermove", onMove);
          gsap.set(el, { x: 0, y: 0 });
        };
      });
      return () => mm.revert();
    },
    { scope: wrap },
  );

  return (
    <span ref={wrap} className="inline-block will-change-transform">
      {children}
    </span>
  );
}
