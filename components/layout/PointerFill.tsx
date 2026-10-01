"use client";

import { useEffect } from "react";

/** Feeds the pointer entry point to `.btn-fill` buttons so the accent fill grows from there. */
export function PointerFill() {
  useEffect(() => {
    const onEnter = (e: PointerEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>(".btn-fill");
      if (!btn || btn.contains(e.relatedTarget as Node | null)) return;
      const r = btn.getBoundingClientRect();
      btn.style.setProperty("--x", `${e.clientX - r.left}px`);
      btn.style.setProperty("--y", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointerover", onEnter);
    return () => document.removeEventListener("pointerover", onEnter);
  }, []);
  return null;
}
