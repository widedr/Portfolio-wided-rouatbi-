import type { Dictionary } from "@/lib/i18n";
import { Marquee } from "@/components/motion/Marquee";

const clients = ["Carrefour.tn", "Five Guys", "Attunea", "Travel Shaper", "Clever Harvest", "Convergence", "Planet Tax Solution", "Bridge Global Funding"];

/** Two counter-running bands: client names, then skills. Decorative; names are also listed in the archive. */
export function Bands({ dict }: { dict: Dictionary }) {
  return (
    <section className="flex flex-col gap-6 overflow-hidden border-y border-line py-12" aria-label={dict.marquee.label}>
      <Marquee speed={45} label={clients.join(", ")}>
        {clients.map((c) => (
          <span
            key={c}
            className="font-display px-8 text-[clamp(2rem,5vw,4.5rem)] font-medium uppercase tracking-[-0.03em] text-fg-muted transition-colors duration-300 hover:text-fg"
          >
            {c}
          </span>
        ))}
      </Marquee>
      <Marquee speed={35} reverse>
        {dict.marquee.skills.map((s) => (
          <span key={s} className="text-meta flex items-center gap-8 px-4 text-fg-muted" aria-hidden="true">
            {s}
            <span className="text-accent">✦</span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
