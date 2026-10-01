"use client";

import Image, { type ImageProps } from "next/image";
import { useRef, useState } from "react";
import { cx } from "@/lib/cx";
import { duration, ease, gsap, mq, useGSAP } from "@/lib/motion";

type Props = Omit<ImageProps, "className" | "onLoad"> & {
  className?: string;
  imageClassName?: string;
  /** Subtle scroll parallax on the image inside its frame (desktop only). */
  parallax?: boolean;
  /** Placeholder colour shown before the image loads. */
  tint?: string;
};

/**
 * Image revealed by a clip-path wipe from the bottom with a simultaneous
 * de-zoom (1.2 → 1). Optional parallax moves the image inside its frame.
 */
export function RevealImage({ className, imageClassName, parallax = false, tint = "#1c1b19", alt, ...img }: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        const inner = frame.current!.querySelector("[data-inner]");
        gsap
          .timeline({ scrollTrigger: { trigger: frame.current, start: "top 85%", once: true } })
          .from(frame.current, { clipPath: "inset(100% 0% 0% 0%)", duration: duration.long, ease: ease.out })
          .from(inner, { scale: 1.2, duration: duration.long * 1.2, ease: ease.out }, 0);
      });
      if (parallax) {
        mm.add(`${mq.motion} and ${mq.desktop}`, () => {
          gsap.fromTo(
            frame.current!.querySelector("[data-parallax]"),
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: frame.current, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      }
      return () => mm.revert();
    },
    { scope: frame },
  );

  return (
    <div ref={frame} className={cx("relative overflow-hidden", className)} style={{ backgroundColor: tint }}>
      <div data-inner className="absolute inset-0">
        <div data-parallax className={cx("absolute", parallax ? "-inset-y-[8%] inset-x-0" : "inset-0")}>
          <Image
            {...img}
            alt={alt}
            onLoad={() => setLoaded(true)}
            data-loaded={loaded}
            className={cx("img-fade h-full w-full object-cover", imageClassName)}
          />
        </div>
      </div>
    </div>
  );
}
