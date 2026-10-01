"use client";

import { useRef } from "react";
import { ease, gsap, prefersReducedMotion, useGSAP } from "@/lib/motion";

const KEY = "wr-loader-seen";
const MIN = 1; // seconds — long enough to read the counter
const MAX = 1.8;

function finish() {
  document.documentElement.dataset.loaderDone = "true";
  window.dispatchEvent(new Event("loader:done"));
}

/**
 * First-load screen: a rolling 000 → 100 counter that follows font loading,
 * then a curtain that lifts into the hero entrance. Plays once per session;
 * the inline script in <head> hides it on later loads before first paint.
 */
export function Loader({ role }: { role: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      if (html.hasAttribute("data-loader-seen")) {
        finish();
        return;
      }
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* storage blocked: the loader simply plays again next time */
      }

      const el = root.current!;
      if (prefersReducedMotion()) {
        gsap.to(el, { autoAlpha: 0, duration: 0.3, delay: 0.2, onComplete: finish });
        return;
      }

      const columns = el.querySelectorAll<HTMLElement>("[data-digit]");
      const state = { p: 0 };
      const render = () => {
        const value = Math.round(state.p);
        const digits = [Math.floor(value / 100), Math.floor((value % 100) / 10), value % 10];
        columns.forEach((col, i) => gsap.to(col, { yPercent: -digits[i] * 10, duration: 0.25, ease: "power2.out", overwrite: true }));
      };

      // Counter runs toward 90 on its own, the real "ready" signal finishes it.
      const progress = gsap.to(state, { p: 90, duration: MIN, ease: "power1.inOut", onUpdate: render });
      const started = performance.now();
      let done = false;

      const exit = () => {
        if (done) return;
        done = true;
        progress.kill();
        gsap
          .timeline()
          .to(state, { p: 100, duration: 0.35, ease: "power2.out", onUpdate: render })
          .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.9, ease: ease.inOut }, "+=0.1")
          .add(finish, "-=0.45")
          .set(el, { display: "none" });
      };

      const ready = document.fonts?.ready ?? Promise.resolve();
      ready.then(() => {
        const elapsed = (performance.now() - started) / 1000;
        gsap.delayedCall(Math.max(0, MIN - elapsed), exit);
      });
      gsap.delayedCall(MAX - 0.45, exit); // hard cap: total stays under 1.8s + curtain
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="loader fixed inset-0 z-[90] flex flex-col items-center justify-center bg-bg"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      aria-hidden="true"
    >
      <div className="flex font-mono text-[clamp(4rem,14vw,10rem)] leading-none tracking-tight">
        {[0, 1, 2].map((i) => (
          <span key={i} className="relative block h-[1em] overflow-hidden">
            <span data-digit className="flex flex-col">
              {Array.from({ length: 10 }, (_, d) => (
                <span key={d} className="block h-[1em]">
                  {d}
                </span>
              ))}
            </span>
          </span>
        ))}
      </div>
      <p className="text-meta absolute inset-x-0 bottom-8 flex justify-between px-site text-fg-muted">
        <span>Wided Rouatbi</span>
        <span>{role}</span>
      </p>
    </div>
  );
}
