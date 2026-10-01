"use client";

import { useRef } from "react";
import { duration, gsap, mq, useGSAP } from "@/lib/motion";

/** Number that counts up once when it scrolls into view. Final value is in the markup. */
export function CountUp({ value, suffix = "", pad = 0, className }: { value: number; suffix?: string; pad?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (n: number) => String(Math.round(n)).padStart(pad, "0") + suffix;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        const counter = { n: 0 };
        ref.current!.textContent = fmt(0);
        gsap.to(counter, {
          n: value,
          duration: duration.long,
          ease: "power2.out",
          scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
          onUpdate: () => {
            if (ref.current) ref.current.textContent = fmt(counter.n);
          },
        });
        return () => {
          if (ref.current) ref.current.textContent = fmt(value);
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {fmt(value)}
    </span>
  );
}
