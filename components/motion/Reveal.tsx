"use client";

import { useRef, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { duration, ease, gsap, mq, ScrollTrigger, SplitText, stagger, useGSAP } from "@/lib/motion";
import { blockReveal } from "@/lib/blockReveal";

type Polymorphic<T extends ElementType> = { as?: T; children: ReactNode; className?: string; delay?: number } & Omit<
  ComponentPropsWithoutRef<T>,
  "as" | "children" | "className"
>;

/**
 * Headings: rise from a mask when the element reaches 85% of the viewport —
 * <HoverText> titles are typed in behind an accent block, others rise line by line. Plays once. Hidden state is applied by JS only,
 * so content stays visible without JavaScript or with reduced motion.
 */
export function RevealText<T extends ElementType = "h2">({
  as,
  children,
  className,
  delay = 0,
  ...rest
}: Polymorphic<T>) {
  const Tag = (as ?? "h2") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        const scrollTrigger = { trigger: ref.current, start: "top 85%", once: true };
        // Titles built with <HoverText>: typed in behind an accent block (see blockReveal).
        if (ref.current!.querySelector("[data-char]")) {
          const reveal = blockReveal(ref.current!, { delay });
          reveal.hide();
          const st = ScrollTrigger.create({ ...scrollTrigger, onEnter: () => reveal.play() });
          return () => {
            st.kill();
            reveal.revert();
          };
        }
        const split = SplitText.create(ref.current!, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, { yPercent: 110, duration: duration.base, ease: ease.out, stagger: stagger.lines, delay, scrollTrigger }),
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}

/** Paragraphs and blocks: fade + 24px rise. Pass `selector` to stagger children. */
export function Reveal<T extends ElementType = "div">({
  as,
  children,
  className,
  delay = 0,
  selector,
  ...rest
}: Polymorphic<T> & { selector?: string }) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        const targets = selector ? ref.current!.querySelectorAll(selector) : ref.current;
        gsap.from(targets, {
          opacity: 0,
          y: 24,
          duration: duration.base,
          ease: ease.out,
          stagger: stagger.items,
          delay,
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
