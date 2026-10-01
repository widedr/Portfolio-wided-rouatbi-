"use client";

import { useRef, type ElementType } from "react";
import { gsap, mq, SplitText, useGSAP } from "@/lib/motion";

/** Large intro paragraph whose words light up (20% → 100% opacity) as you scroll. */
export function HighlightText({ as, text, className }: { as?: ElementType; text: string; className?: string }) {
  const Tag = (as ?? "p") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        const split = SplitText.create(ref.current!, { type: "words" });
        gsap.fromTo(
          split.words,
          { opacity: 0.2 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 45%", scrub: true },
          },
        );
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {text}
    </Tag>
  );
}
