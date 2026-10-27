"use client";

import { useEffect, useRef, type ElementType } from "react";
import { gsap, mq } from "@/lib/motion";
import { cx } from "@/lib/cx";

const MAX_WEIGHT = 900;
const WAVE_RADIUS = 180; // px around the pointer that thickens

/**
 * Title hover effect, two flavours:
 *  - "wave" (H2): a weight wave follows the pointer along the word (variable
 *    font), the letters nearest the cursor thickening the most;
 *  - "pressure" (H1), after React Bits' Text Pressure: while the pointer is
 *    over the heading, every letter's weight (100 → 900) and slant follow its
 *    distance to a smoothed pointer — thin far away, heavy and leaning close by.
 * Letter widths are locked while hovered, so line breaks never change.
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
      const chars = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-char]"));
      const glyphs = chars.map((c) => c.querySelector<HTMLElement>("[data-top]")!);
      // Pressure reacts across the whole H1 (multi-word names move as one); the wave follows its own link/text.
      const area =
        (hover === "pressure" ? el.closest<HTMLElement>("h1") : (el.closest("a, button") as HTMLElement | null)) ?? el;
      const base = Number(getComputedStyle(el).fontWeight) || 500;

      // Layout lock: while hovered every letter keeps its resting width; the glyph is
      // squeezed or stretched to fit, so heavier letters never push a word to the next line.
      let rest: number[] = [];
      let thin: number[] = [];
      let heavy: number[] = [];
      const lock = () => {
        rest = chars.map((c) => c.getBoundingClientRect().width);
        chars.forEach((c) => c.style.setProperty("--w", "900"));
        heavy = chars.map((c) => c.getBoundingClientRect().width);
        chars.forEach((c) => c.style.setProperty("--w", "100"));
        thin = chars.map((c) => c.getBoundingClientRect().width);
        chars.forEach((c, i) => {
          c.style.setProperty("--w", String(base));
          c.style.width = `${rest[i]}px`;
          c.style.overflow = "visible";
        });
      };
      const unlock = () => {
        chars.forEach((c, i) => {
          c.style.removeProperty("--w");
          c.style.removeProperty("width");
          c.style.removeProperty("overflow");
          c.style.removeProperty("transform");
          glyphs[i].style.removeProperty("transform");
        });
      };

      const weight = chars.map(() => base);
      const slant = chars.map(() => 0);
      const target = { x: 0, y: 0 };
      const pos = { x: 0, y: 0 };
      let inside = false;
      let raf = 0;

      const frame = () => {
        pos.x += (target.x - pos.x) / (hover === "pressure" ? 12 : 4);
        pos.y += (target.y - pos.y) / (hover === "pressure" ? 12 : 4);
        const maxDist = hover === "pressure" ? Math.max(area.getBoundingClientRect().width / 2, 1) : WAVE_RADIUS;
        let settled = !inside;
        chars.forEach((c, i) => {
          let w = base;
          let sk = 0;
          if (inside) {
            const r = c.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            if (hover === "pressure") {
              const k = Math.max(0, 1 - Math.hypot(pos.x - cx, pos.y - (r.top + r.height / 2)) / maxDist);
              w = 100 + 800 * k;
              sk = -12 * k;
            } else {
              const k = Math.max(0, 1 - Math.abs(pos.x - cx) / maxDist);
              w = base + (MAX_WEIGHT - base) * k * k * (3 - 2 * k);
            }
          }
          weight[i] += (w - weight[i]) * 0.18;
          slant[i] += (sk - slant[i]) * 0.18;
          if (Math.abs(weight[i] - base) > 1 || Math.abs(slant[i]) > 0.1) settled = false;
          const natural = thin[i] + ((heavy[i] - thin[i]) * (weight[i] - 100)) / 800;
          c.style.setProperty("--w", String(Math.round(weight[i])));
          c.style.transform = slant[i] ? `skewX(${slant[i].toFixed(2)}deg)` : "";
          glyphs[i].style.transform = natural > 0 ? `scaleX(${(rest[i] / natural).toFixed(3)})` : "";
        });
        if (settled) {
          raf = 0;
          unlock();
          return;
        }
        raf = requestAnimationFrame(frame);
      };
      const start = () => {
        if (!raf) {
          lock();
          raf = requestAnimationFrame(frame);
        }
      };
      const enter = (e: PointerEvent) => {
        inside = true;
        target.x = e.clientX;
        target.y = e.clientY;
        if (!raf) {
          pos.x = e.clientX;
          pos.y = e.clientY;
        }
        start();
      };
      const move = (e: PointerEvent) => {
        target.x = e.clientX;
        target.y = e.clientY;
      };
      const leave = () => {
        inside = false;
      };
      area.addEventListener("pointerenter", enter);
      area.addEventListener("pointermove", move);
      area.addEventListener("pointerleave", leave);
      return () => {
        cancelAnimationFrame(raf);
        raf = 0;
        area.removeEventListener("pointerenter", enter);
        area.removeEventListener("pointermove", move);
        area.removeEventListener("pointerleave", leave);
        unlock();
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
