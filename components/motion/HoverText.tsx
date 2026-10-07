"use client";

import { useEffect, useRef, type ElementType } from "react";
import { gsap, mq } from "@/lib/motion";
import { cx } from "@/lib/cx";

const BASE_WEIGHT = 500;
const MAX_WEIGHT = 900;
const WAVE_RADIUS = 180; // px around the pointer that thickens

/**
 * Title hover effect: a weight wave follows the pointer along the word
 * (variable font), the letters nearest the cursor thickening the most.
 * Each letter keeps a `[data-top]` span so reveal animations can lift it in.
 * Touch and reduced-motion get plain text.
 */
export function HoverText({
  text,
  accent,
  as,
  className,
}: {
  text: string;
  /** Optional trailing part shown in the accent colour (e.g. "rendus simples."). */
  accent?: string;
  as?: ElementType;
  className?: string;
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
  }, [text, accent]);

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
                // Mask padded past the line box so descenders (g, y) and accents aren't cut.
                <span
                  key={i}
                  data-char
                  className="relative -my-[0.18em] inline-block overflow-hidden py-[0.18em] align-bottom"
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
