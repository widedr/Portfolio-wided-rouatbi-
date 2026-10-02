"use client";

import { useEffect, useRef, type ElementType } from "react";
import { gsap, mq } from "@/lib/motion";
import { cx } from "@/lib/cx";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+=?/<>0123456789";
const BASE_WEIGHT = 500;
const MAX_WEIGHT = 800;
const WAVE_RADIUS = 110; // px around the pointer that thickens

/**
 * Title hover effect, all four layers at once:
 *  1. letters roll up one by one (left → right stagger), a copy rises from below;
 *  2. the incoming copy scrambles through random glyphs before settling;
 *  3. a weight wave follows the pointer along the word (variable font);
 *  4. outgoing letters blur away, incoming ones arrive sharp in the accent colour.
 *
 * The trigger is the closest link/button (or the text itself). Keyboard focus
 * plays the roll too. Touch and reduced-motion get plain text.
 */
export function HoverText({ text, as, className }: { text: string; as?: ElementType; className?: string }) {
  const Tag = (as ?? "span") as ElementType;
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(`${mq.motion} and ${mq.fine}`, () => {
      const trigger = (el.closest("a, button") as HTMLElement | null) ?? el;
      const tops = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-top]"));
      const bottoms = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-bottom]"));
      const chars = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-char]"));
      const finals = bottoms.map((b) => b.textContent ?? "");
      let scrambles: gsap.core.Tween[] = [];

      gsap.set(bottoms, { yPercent: 105 });
      gsap.set(chars, { "--w": BASE_WEIGHT });

      const scramble = () => {
        scrambles.forEach((s) => s.kill());
        scrambles = bottoms.map((b, i) => {
          const final = finals[i];
          const state = { p: 0 };
          return gsap.to(state, {
            p: 1,
            duration: 0.45,
            delay: i * 0.025,
            ease: "none",
            onUpdate: () => {
              b.textContent = state.p < 0.85 ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)] : final;
            },
            onComplete: () => {
              b.textContent = final;
            },
          });
        });
      };

      const enter = () => {
        scramble();
        gsap.to(tops, {
          yPercent: -105,
          filter: "blur(6px)",
          opacity: 0,
          duration: 0.5,
          ease: "power3.inOut",
          stagger: 0.025,
          overwrite: true,
        });
        gsap.to(bottoms, {
          yPercent: 0,
          filter: "blur(0px)",
          opacity: 1,
          duration: 0.5,
          ease: "power3.inOut",
          stagger: 0.025,
          overwrite: true,
        });
      };

      const leave = () => {
        scrambles.forEach((s) => s.kill());
        bottoms.forEach((b, i) => (b.textContent = finals[i]));
        gsap.to(bottoms, { yPercent: 105, filter: "blur(6px)", opacity: 0, duration: 0.45, ease: "power3.inOut", stagger: 0.015, overwrite: true });
        gsap.to(tops, { yPercent: 0, filter: "blur(0px)", opacity: 1, duration: 0.45, ease: "power3.inOut", stagger: 0.015, overwrite: true });
        gsap.to(chars, { "--w": BASE_WEIGHT, duration: 0.5, ease: "power2.out", overwrite: "auto" });
      };

      const wave = (e: PointerEvent) => {
        chars.forEach((c) => {
          const r = c.getBoundingClientRect();
          const d = Math.abs(e.clientX - (r.left + r.width / 2));
          const k = Math.max(0, 1 - d / WAVE_RADIUS);
          gsap.to(c, { "--w": BASE_WEIGHT + (MAX_WEIGHT - BASE_WEIGHT) * k * k, duration: 0.3, ease: "power2.out", overwrite: "auto" });
        });
      };

      trigger.addEventListener("pointerenter", enter);
      trigger.addEventListener("pointerleave", leave);
      trigger.addEventListener("pointermove", wave);
      trigger.addEventListener("focus", enter);
      trigger.addEventListener("blur", leave);
      return () => {
        scrambles.forEach((s) => s.kill());
        trigger.removeEventListener("pointerenter", enter);
        trigger.removeEventListener("pointerleave", leave);
        trigger.removeEventListener("pointermove", wave);
        trigger.removeEventListener("focus", enter);
        trigger.removeEventListener("blur", leave);
        bottoms.forEach((b, i) => (b.textContent = finals[i]));
        gsap.set([...tops, ...bottoms], { clearProps: "transform,filter,opacity" });
        gsap.set(chars, { clearProps: "--w" });
      };
    });
    return () => mm.revert();
  }, [text]);

  return (
    <Tag ref={root} className={cx("inline-block", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(" ").map((word, w, words) => (
          // Words stay unbreakable; lines can only wrap at the spaces between them.
          <span key={w}>
            <span className="inline-block whitespace-nowrap">
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
                  <span data-bottom className="absolute left-0 top-0 inline-block text-accent opacity-0">
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
