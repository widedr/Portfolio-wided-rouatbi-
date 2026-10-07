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
 *  - "pressure" (H1), after React Bits' Text Pressure: while the pointer is
 *    over the heading, every letter's weight (100 → 900) and slant follow its
 *    distance to a smoothed pointer — thin far away, heavy and leaning close by.
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
  hover?: "wave" | "pressure";
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

      if (hover === "pressure") {
        // The whole H1 is the active area, so multi-word names react as one.
        const area = el.closest<HTMLElement>("h1") ?? trigger;
        const target = { x: 0, y: 0 };
        const pos = { x: 0, y: 0 };
        let active = false;
        let raf = 0;

        const frame = () => {
          pos.x += (target.x - pos.x) / 12;
          pos.y += (target.y - pos.y) / 12;
          const maxDist = Math.max(area.getBoundingClientRect().width / 2, 1);
          chars.forEach((c) => {
            const r = c.getBoundingClientRect();
            const d = Math.hypot(pos.x - (r.left + r.width / 2), pos.y - (r.top + r.height / 2));
            const k = Math.max(0, 1 - d / maxDist);
            c.style.setProperty("--w", String(Math.round(100 + 800 * k)));
            c.style.transform = `skewX(${(-12 * k).toFixed(2)}deg)`;
          });
          if (active) raf = requestAnimationFrame(frame);
        };
        const enter = (e: PointerEvent) => {
          gsap.killTweensOf(chars);
          target.x = pos.x = e.clientX;
          target.y = pos.y = e.clientY;
          if (!active) {
            active = true;
            raf = requestAnimationFrame(frame);
          }
        };
        const move = (e: PointerEvent) => {
          target.x = e.clientX;
          target.y = e.clientY;
        };
        const leave = () => {
          active = false;
          cancelAnimationFrame(raf);
          gsap.to(chars, { "--w": BASE_WEIGHT, skewX: 0, duration: 0.6, ease: "power2.out", overwrite: "auto" });
        };
        area.addEventListener("pointerenter", enter);
        area.addEventListener("pointermove", move);
        area.addEventListener("pointerleave", leave);
        return () => {
          active = false;
          cancelAnimationFrame(raf);
          area.removeEventListener("pointerenter", enter);
          area.removeEventListener("pointermove", move);
          area.removeEventListener("pointerleave", leave);
          gsap.killTweensOf(chars);
          gsap.set(chars, { clearProps: "--w,transform" });
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
