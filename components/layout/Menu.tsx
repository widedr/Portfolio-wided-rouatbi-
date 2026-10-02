"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { href } from "@/lib/i18n";
import { site } from "@/lib/site";
import { duration, ease, gsap, prefersReducedMotion, stagger, useGSAP } from "@/lib/motion";
import { LocalClock } from "./LocalClock";
import { scrollToTarget, useLenis } from "./SmoothScroll";
import { HoverText } from "@/components/motion/HoverText";

type Props = { open: boolean; onClose: () => void; locale: Locale; dict: Dictionary };

export function Menu({ open, onClose, locale, dict }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const pathname = usePathname();
  const lenis = useLenis();

  const links = [
    { label: dict.nav.home, to: href(locale) },
    { label: dict.nav.about, to: `${href(locale)}#about` },
    { label: dict.nav.work, to: href(locale, "/work") },
    { label: dict.nav.caseStudy, to: href(locale, "/work/mathis-bs") },
    { label: dict.nav.contact, to: "#contact" },
  ];

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();
      tl.current = gsap
        .timeline({ paused: true })
        .set(root.current, { visibility: "visible" })
        .fromTo(
          root.current,
          reduced ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" },
          reduced
            ? { opacity: 1, duration: 0.25 }
            : { clipPath: "inset(0% 0% 0% 0%)", duration: duration.base, ease: ease.inOut },
        )
        .fromTo(
          "[data-menu-line]",
          { yPercent: reduced ? 0 : 110 },
          { yPercent: 0, duration: duration.base, ease: ease.out, stagger: stagger.lines },
          reduced ? 0 : "-=0.35",
        )
        .fromTo("[data-menu-foot]", { opacity: 0 }, { opacity: 1, duration: duration.short }, "-=0.5");
    },
    { scope: root },
  );

  useEffect(() => {
    if (!tl.current) return;
    if (open) {
      gsap.set(root.current, { visibility: "visible" });
      tl.current.timeScale(1).play();
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
      root.current?.querySelector<HTMLElement>("a")?.focus();
    } else {
      tl.current.timeScale(1.6).reverse();
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
  }, [open, lenis]);

  // Escape closes, Tab stays inside the menu (plus the header's close button).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !root.current) return;
      const toggle = document.querySelector<HTMLElement>('[aria-controls="site-menu"]');
      const focusables = [
        ...(toggle ? [toggle] : []),
        ...root.current.querySelectorAll<HTMLElement>("a, button"),
      ];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      ref={root}
      id="site-menu"
      className="invisible fixed inset-0 z-40 flex flex-col justify-between bg-bg px-site pb-8 pt-[calc(var(--header-h)+4vh)]"
      inert={!open}
      aria-label={dict.nav.menuLabel}
      role="dialog"
      aria-modal="true"
    >
      <nav aria-label={dict.nav.menuLabel}>
        <ul className="group/menu flex flex-col">
          {links.map((link, i) => {
            const [path, hash] = link.to.split("#");
            // Anchors on the current page scroll in place instead of navigating.
            const samePageAnchor = Boolean(hash) && (path === "" || path === pathname);
            const current = !hash && pathname === link.to;
            return (
              <li key={link.to} className="overflow-hidden">
                <div data-menu-line>
                  <Link
                    href={link.to}
                    aria-current={current ? "page" : undefined}
                    onClick={(e) => {
                      if (!samePageAnchor) return;
                      e.preventDefault();
                      onClose();
                      requestAnimationFrame(() => scrollToTarget(lenis, `#${hash}`));
                    }}
                    className="roll-trigger flex items-baseline gap-4 py-1 transition-opacity duration-300 group-hover/menu:opacity-30 hover:!opacity-100 focus-visible:!opacity-100 md:gap-8"
                    data-cursor="link"
                  >
                    <span className="text-meta w-8 shrink-0 text-fg-muted">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-display-l">
                      <HoverText text={link.label} />
                    </span>
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      <div data-menu-foot className="grid gap-6 border-t border-line pt-6 text-meta sm:grid-cols-2 lg:grid-cols-4">
        <a href={`mailto:${site.email}`} className="link-underline w-fit normal-case tracking-normal">
          {site.email}
        </a>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <a href={site.links.linkedin} target="_blank" rel="noreferrer" className="link-underline">
            LinkedIn
          </a>
          <a href={site.links.github} target="_blank" rel="noreferrer" className="link-underline">
            GitHub
          </a>
        </div>
        <div className="flex gap-6">
          <a href={site.links.cvFr} className="link-underline" download>
            {dict.footer.cvFr}
          </a>
          <a href={site.links.cvEn} className="link-underline" download>
            {dict.footer.cvEn}
          </a>
        </div>
        <p className="text-fg-muted lg:text-right">
          {dict.nav.localTime} · <LocalClock />
        </p>
      </div>
    </div>
  );
}
