import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { href } from "@/lib/i18n";
import { selectedProjects } from "@/lib/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { RevealText } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { ArrowSwap } from "@/components/layout/RollText";
import { StarBorder } from "@/components/layout/StarBorder";
import { HoverText } from "@/components/motion/HoverText";

/* Magazine rhythm: varied widths, aspect ratios and vertical offsets. */
const layout = [
  { col: "md:col-span-8 lg:col-span-8", aspect: "aspect-[16/10]", sizes: "(min-width: 1024px) 64vw, 100vw" },
  { col: "md:col-span-4 lg:col-span-4 lg:mt-24", aspect: "aspect-[4/5]", sizes: "(min-width: 1024px) 32vw, 100vw" },
  { col: "md:col-span-4 lg:col-span-5 lg:col-start-2", aspect: "aspect-[4/5]", sizes: "(min-width: 1024px) 40vw, 100vw" },
  { col: "md:col-span-8 lg:col-span-6 lg:col-start-7 lg:mt-16", aspect: "aspect-[16/10]", sizes: "(min-width: 1024px) 48vw, 100vw" },
  { col: "md:col-span-4 lg:col-span-5", aspect: "aspect-[4/3]", sizes: "(min-width: 1024px) 40vw, 100vw" },
  { col: "md:col-span-4 lg:col-span-5 lg:col-start-8 lg:mt-20", aspect: "aspect-[4/3]", sizes: "(min-width: 1024px) 40vw, 100vw" },
];

export function SelectedWork({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <section className="py-section px-site" aria-labelledby="work-title">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-8">
        <div>
          <p className="text-meta mb-6 text-fg-muted">04 — {dict.work.label}</p>
          <RevealText id="work-title" className="text-display-l">
            <HoverText text={dict.work.title} accent={dict.work.titleEm} />
          </RevealText>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-[var(--gutter)] gap-y-14 md:grid-cols-8 lg:grid-cols-12 lg:gap-y-20">
        {selectedProjects.map((project, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
            locale={locale}
            dict={dict}
            index={i + 1}
            aspect={layout[i].aspect}
            sizes={layout[i].sizes}
            className={layout[i].col}
          />
        ))}
      </div>

      <div className="mt-16 flex justify-center">
        <Magnetic>
          <Link
            href={href(locale, "/work")}
            className="star-border arrow-trigger"
            data-cursor="link"
          >
            <StarBorder className="inline-flex min-h-14 items-center gap-3 px-8 font-medium">
              {dict.work.viewAll}
              <ArrowSwap />
            </StarBorder>
          </Link>
        </Magnetic>
      </div>
    </section>
  );
}
