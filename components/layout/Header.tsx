"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { href } from "@/lib/i18n";
import { LocaleSwitch } from "./LocaleSwitch";
import { Menu } from "./Menu";
import { StarBorder } from "@/components/layout/StarBorder";
import { RollText } from "./RollText";
import { scrollToTarget, useLenis } from "./SmoothScroll";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();
  const pathname = usePathname();

  // Navigating closes the menu.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync UI with the route
    setOpen(false);
  }, [pathname]);

  // Hide when scrolling down past 100px, show again on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 100 && y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => {
    setOpen(false);
    menuButton.current?.focus();
  };

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 text-[#f2efe9] mix-blend-difference transition-transform duration-400 ease-out data-[hidden=true]:-translate-y-full"
        data-hidden={hidden && !open}
      >
        <div className="flex h-[var(--header-h)] items-center justify-between gap-4 px-site">
          <Link href={href(locale)} className="roll-trigger text-meta" data-cursor="link">
            <RollText>Wided Rouatbi</RollText>
          </Link>

          <div className="flex items-center gap-2 sm:gap-6">
            <LocaleSwitch locale={locale} label={dict.nav.language} />
            <button
              ref={menuButton}
              type="button"
              className="roll-trigger text-meta grid min-h-11 min-w-11 place-items-center"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((o) => !o)}
              data-cursor="link"
            >
              <RollText>{open ? dict.nav.close : dict.nav.menu}</RollText>
            </button>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                scrollToTarget(lenis, "#contact");
              }}
              className="star-border roll-trigger hidden sm:inline-block"
              data-cursor="link"
            >
              <StarBorder className="text-meta inline-flex min-h-11 items-center px-5">
                <RollText>{dict.nav.cta}</RollText>
              </StarBorder>
            </a>
          </div>
        </div>
      </header>
      <Menu open={open} onClose={close} locale={locale} dict={dict} />
    </>
  );
}
