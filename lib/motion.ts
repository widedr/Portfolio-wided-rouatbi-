"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

let registered = false;
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin, Flip, useGSAP);
  registered = true;
}
registerGsap();

export const ease = {
  out: "expo.out", // entrances
  inOut: "power4.inOut", // page transitions, curtains
  soft: "power2.out", // hover, micro-interactions
  elastic: "elastic.out(1, 0.5)", // magnetic return
} as const;

export const duration = {
  micro: 0.2,
  short: 0.4,
  base: 0.8,
  long: 1.2,
} as const;

export const stagger = { chars: 0.02, words: 0.04, lines: 0.08, items: 0.1 } as const;

/** Media conditions shared by every gsap.matchMedia() call. */
export const mq = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
  fine: "(pointer: fine)",
  desktop: "(min-width: 1024px)",
} as const;

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(mq.reduced).matches;
}

/** Resolves once the first-load loader has finished (immediately if it never ran). */
export function whenLoaderDone(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  if (document.documentElement.dataset.loaderDone === "true") {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener("loader:done", handler, { once: true });
  return () => window.removeEventListener("loader:done", handler);
}

export { gsap, ScrollTrigger, SplitText, Draggable, InertiaPlugin, Flip, useGSAP };
