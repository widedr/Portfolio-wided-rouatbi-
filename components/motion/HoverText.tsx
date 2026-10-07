"use client";

import { useEffect, useRef, type ElementType } from "react";
import { gsap, mq } from "@/lib/motion";
import { cx } from "@/lib/cx";

const BASE_WEIGHT = 500;
const MAX_WEIGHT = 900;
const WAVE_RADIUS = 180; // px around the pointer that thickens

/**
 * Title hover effect, two flavours:
 *  - "wave" (H2): a weight wave follows the pointer along the word (variable
 *    font), the letters nearest the cursor thickening the most;
 *  - "bounce" (H1): letters jump and stretch, then land with an exaggerated
 *    elastic wobble, rippling out from where the pointer entered; a letter
 *    the pointer crosses jumps again.
 * Each letter keeps a `[data-top]` span so reveal animations can lift it in.
 * Touch and reduced-motion get plain text.
 */
export function HoverText({
  text,
  accent,
  as,
  className,
  hover = "wave",
}: {
  text: string;
  /** Optional trailing part shown in the accent colour (e.g. "rendus simples."). */
  accent?: string;
  as?: ElementType;
  className?: string;
  hover?: "wave" | "bounce";
}) {
  const Tag = (as ?? "span") as ElementType;
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(`${mq.motion} and ${mq.fine}`, () => {
      const trigger = (el.closest("a, button") as HTMLElement | null) ?? el;
      const chars = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-char]"));

      if (hover === "bounce") {
        gsap.set(chars, { transformOrigin: "50% 100%" });
        const jumping = new Set<HTMLElement>();
        const jump = (c: HTMLElement, delay = 0) => {
          if (jumping.has(c)) return;
          jumping.add(c);
          gsap
            .timeline({ delay, onComplete: () => jumping.delete(c) })
            .to(c, { yPercent: -45, scaleY: 1.25, scaleX: 0.85, rotation: gsap.utils.random(-8, 8), duration: 0.2, ease: "power2.out" })
            .to(c, { yPercent: 0, scaleY: 1, scaleX: 1, rotation: 0, duration: 1.3, ease: "elastic.out(1.4, 0.22)" });
        };
        const nearest = (x: number) => {
          let best = 0;
          let min = Infinity;
          chars.forEach((c, i) => {
            const r = c.getBoundingClientRect();
            const d = Math.abs(x - (r.left + r.width / 2));
            if (d < min) [min, best] = [d, i];
          });
          return best;
        };
        const enter = (e: Event) => {
          const from = e instanceof PointerEvent ? nearest(e.clientX) : 0;
          chars.forEach((c, i) => jump(c, Math.abs(i - from) * 0.035));
        };
        const move = (e: PointerEvent) => {
          const t = (e.target as HTMLElement).closest<HTMLElement>("[data-char]");
          if (t && chars.includes(t)) jump(t);
        };
        trigger.addEventListener("pointerenter", enter);
        trigger.addEventListener("pointermove", move);
        trigger.addEventListener("focus", enter);
        return () => {
          trigger.removeEventListener("pointerenter", enter);
          trigger.removeEventListener("pointermove", move);
          trigger.removeEventListener("focus", enter);
          gsap.killTweensOf(chars);
          gsap.set(chars, { clearProps: "transform,transformOrigin" });
        };
      }

      gsap.set(chars, { "--w": BASE_WEIGHT });

      const leave = () => {
        gsap.to(chars, { "--w": BASE_WEIGHT, duration: 0.6, ease: "power2.out", overwrite: "auto" });
      };

      const wave = (e: PointerEvent) => {
        chars.forEach((c) => {
          const r = c.getBoundingClientRect();
          const d = Math.abs(e.clientX - (r.left + r.width / 2));
          const k = Math.max(0, 1 - d / WAVE_RADIUS);
          gsap.to(c, { "--w": BASE_WEIGHT + (MAX_WEIGHT - BASE_WEIGHT) * k * k * (3 - 2 * k), duration: 0.35, ease: "power2.out", overwrite: "auto" });
        });
      };

      trigger.addEventListener("pointerleave", leave);
      trigger.addEventListener("pointermove", wave);
      return () => {
        trigger.removeEventListener("pointerleave", leave);
        trigger.removeEventListener("pointermove", wave);
        gsap.set(chars, { clearProps: "--w" });
      };
    });
    return () => mm.revert();
  }, [text, accent, hover]);

  return (
    <Tag ref={root} className={cx("inline-block", className)}>
      <span className="sr-only">{accent ? `${text} ${accent}` : text}</span>
      <span aria-hidden="true">
        {[
          ...text.split(" ").filter(Boolean).map((word) => ({ word, accent: false })),
          ...(accent ?? "").split(" ").filter(Boolean).map((word) => ({ word, accent: true })),
        ].map(({ word, accent: isAccent }, w, words) => (
          // Words stay unbreakable; lines can only wrap at the spaces between them.
          <span key={w}>
            <span className={cx("inline-block whitespace-nowrap", isAccent && "text-accent")}>
              {[...word].map((ch, i) => (
                <span
                  key={i}
                  data-char
                  className="relative inline-block overflow-hidden align-bottom"
                  style={{ fontWeight: "var(--w, inherit)" as unknown as number }}
                >
                  <span data-top className="inline-block">
                    {ch}
                  </span>
                </span>
              ))}
            </span>
            {w < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </Tag>
  );
}
