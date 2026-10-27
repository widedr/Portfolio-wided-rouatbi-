import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { href } from "@/lib/i18n";
import { ArrowSwap } from "@/components/layout/RollText";

/**
 * Invitation to the work page, styled like the footer's "Let's work together":
 * on hover the letters lift one by one and an accent line draws under the title.
 * The "see the work" cue sits under a divider. Navigation is a deliberate click.
 */
export function NextCta({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const chars = [...dict.next.title];

  return (
    <section className="theme-paper px-site py-section">
      <p className="text-meta mb-8">06 — {dict.next.label}</p>
      <Link
        href={href(locale, "/work")}
        className="group/next arrow-trigger block"
        data-cursor="view"
        data-cursor-label={dict.cursor.open}
        aria-label={`${dict.next.title} — ${dict.next.cta}`}
      >
        <span className="relative inline-block max-w-full">
          <span className="text-display-xl block text-[clamp(2.75rem,6.6vw,9rem)] md:whitespace-nowrap" aria-hidden="true">
            {chars.map((char, i) => (
              <span
                key={i}
                className="inline-block transition-transform duration-500 ease-out group-hover/next:-translate-y-[0.08em] group-focus-visible/next:-translate-y-[0.08em]"
                style={{ transitionDelay: `${i * 20}ms` }}
              >
                {char === " " ? " " : char}
              </span>
            ))}
          </span>
          <span
            aria-hidden="true"
            className="absolute -bottom-2 left-0 h-[3px] w-full origin-left scale-x-0 bg-accent transition-transform duration-700 ease-out group-hover/next:scale-x-100 group-focus-visible/next:scale-x-100"
          />
        </span>
        <span className="mt-16 flex items-center justify-between border-t border-line pt-6">
          <span className="text-meta inline-flex items-center gap-3" aria-hidden="true">
            {dict.next.cta} <ArrowSwap />
          </span>
        </span>
      </Link>
    </section>
  );
}
