"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { mq } from "@/lib/motion";

type View = "front" | "left" | "right" | "rear";

/**
 * Three photos (front, profile, back) that "turn" toward the pointer:
 * front when the pointer is near, profile when it's to a side, back when it
 * is far away. On touch it rotates slowly on its own; static with reduced motion.
 */
export function Portrait({ alt }: { alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>("front");

  useEffect(() => {
    if (window.matchMedia(mq.reduced).matches) return;

    if (window.matchMedia(mq.fine).matches) {
      const onMove = (e: PointerEvent) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
        const dist = Math.hypot(dx, (e.clientY - (r.top + r.height / 2)) / window.innerHeight);
        if (dist > 0.75) setView("rear");
        else if (dx < -0.12) setView("left");
        else if (dx > 0.12) setView("right");
        else setView("front");
      };
      window.addEventListener("pointermove", onMove);
      return () => window.removeEventListener("pointermove", onMove);
    }

    const order: View[] = ["front", "right", "rear", "left"];
    let i = 0;
    const id = window.setInterval(() => setView(order[(i = (i + 1) % order.length)]), 1600);
    return () => window.clearInterval(id);
  }, []);

  const src = { front: "front", left: "side", right: "side", rear: "rear" }[view];

  return (
    <div ref={ref} className="relative aspect-square w-full overflow-hidden bg-[#1a1917]">
      {(["front", "side", "rear"] as const).map((name) => (
        <Image
          key={name}
          src={`/images/portrait/${name}.png`}
          alt={name === "front" ? alt : ""}
          fill
          sizes="(min-width: 1024px) 25vw, 60vw"
          className="object-cover object-top transition-opacity duration-300"
          style={{
            opacity: src === name ? 1 : 0,
            // The profile photo faces left; mirror it when the pointer is on the right.
            transform: name === "side" && view === "right" ? "scaleX(-1)" : undefined,
          }}
        />
      ))}
    </div>
  );
}
