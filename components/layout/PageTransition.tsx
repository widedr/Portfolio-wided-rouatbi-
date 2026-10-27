"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Curtain between pages: on an internal link click an accent strip and a dark
 * panel rise to cover the screen, the route changes underneath, then both lift
 * away. Page intros wait for the curtain (they listen to "loader:done").
 * Hash links, new tabs, downloads, modified clicks and reduced motion are left alone.
 */
export function PageTransition({ label }: { label: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const covering = useRef(false);
  const fallback = useRef(0);

  const reveal = () => {
    window.clearTimeout(fallback.current);
    if (!covering.current || !root.current) return;
    covering.current = false;
    // Page intros (hero name, case-study title) may start now.
    document.documentElement.dataset.loaderDone = "true";
    window.dispatchEvent(new Event("loader:done"));
    gsap
      .timeline({ onComplete: () => gsap.set(root.current, { visibility: "hidden" }) })
      .to("[data-curtain-label]", { opacity: 0, duration: 0.2 })
      .to("[data-curtain]", { yPercent: -100, duration: 0.65, ease: "power4.inOut", stagger: { each: 0.12, from: "end" } }, 0.05);
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // same page (incl. #anchors)
      if (/\.(pdf|mp4|webm|jpg|png)$/i.test(url.pathname) || prefersReducedMotion()) return;

      e.preventDefault();
      if (covering.current) return;
      covering.current = true;
      document.documentElement.dataset.loaderDone = "false";
      const el = root.current!;
      gsap.set(el, { visibility: "visible" });
      gsap
        .timeline({
          onComplete: () => {
            router.push(url.pathname + url.search + url.hash);
            // Never leave the curtain down if the navigation stalls.
            fallback.current = window.setTimeout(reveal, 2500);
          },
        })
        .fromTo("[data-curtain]", { yPercent: 100 }, { yPercent: 0, duration: 0.6, ease: "power4.inOut", stagger: 0.12 })
        .fromTo("[data-curtain-label]", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3 }, "-=0.2");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);

  // The new route has rendered: lift the curtain on the next frame.
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(reveal));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[200]" style={{ visibility: "hidden" }}>
      <div data-curtain className="absolute inset-0 bg-accent" style={{ transform: "translateY(100%)" }} />
      <div data-curtain className="absolute inset-0 grid place-items-center bg-[#181816]" style={{ transform: "translateY(100%)" }}>
        <span data-curtain-label className="text-meta text-[#f2efe9]/70 opacity-0">
          {label}
        </span>
      </div>
    </div>
  );
}
