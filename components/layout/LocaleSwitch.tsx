"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, switchLocalePath, type Locale } from "@/lib/i18n";

export function LocaleSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const index = locales.indexOf(locale);

  return (
    <nav aria-label={label} className="relative flex text-meta">
      {locales.map((l) => (
        <Link
          key={l}
          href={switchLocalePath(pathname, l)}
          hrefLang={l}
          lang={l}
          aria-current={l === locale ? "true" : undefined}
          className="relative grid min-h-11 min-w-11 place-items-center opacity-60 transition-opacity duration-200 hover:opacity-100 aria-[current]:opacity-100"
        >
          {l.toUpperCase()}
        </Link>
      ))}
      {/* The underline glides to the active language */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-2 left-0 h-px w-11 bg-current transition-transform duration-500 ease-out"
        style={{ transform: `translateX(${index * 100}%) scaleX(0.4)` }}
      />
    </nav>
  );
}
