"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { mq } from "@/lib/motion";

/**
 * Full-bleed hero background. Plays `site.heroVideo` right away (muted,
 * looping, no poster, paused off-screen) when one is configured; otherwise cross-fades the project
 * visuals with a slow zoom. Reduced motion: a single still frame.
 */
export function HeroMedia() {
  const video = useRef<HTMLVideoElement>(null);
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(false);
  const images = site.heroImages;

  useEffect(() => {
    const reduced = window.matchMedia(mq.reduced).matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- depends on a client-only media query
    setAnimate(!reduced);
    const v = video.current;
    if (v) {
      if (reduced) {
        v.pause();
        return;
      }
      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      });
      io.observe(v);
      return () => io.disconnect();
    }
    if (reduced) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % images.length), 4500);
    return () => window.clearInterval(id);
  }, [images.length]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {site.heroVideo ? (
        <video
          ref={video}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={site.heroVideo.mp4} type="video/mp4" />
          <source src={site.heroVideo.webm} type="video/webm" />
        </video>
      ) : (
        images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover transition-[opacity,transform] ease-out"
            style={{
              opacity: i === index ? 1 : 0,
              transform: animate && i === index ? "scale(1)" : "scale(1.08)",
              transitionDuration: "1600ms, 6000ms",
            }}
          />
        ))
      )}
      {/* Keeps the centred text legible over any frame */}
      <div className={site.heroVideo ? "absolute inset-0 bg-[#0f0f0e]/60" : "absolute inset-0 bg-[#0f0f0e]/80"} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0e]/60 via-transparent to-[#0f0f0e]" />
    </div>
  );
}
