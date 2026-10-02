import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { href } from "@/lib/i18n";
import type { Project } from "@/lib/projects";
import { cx } from "@/lib/cx";
import { RevealImage } from "@/components/motion/RevealImage";
import { HoverText } from "@/components/motion/HoverText";

type Props = {
  project: Project;
  locale: Locale;
  dict: Dictionary;
  aspect?: string;
  sizes: string;
  index?: number;
  className?: string;
};

/** Editorial project card: large visual, title, sector, meta and a few tags. */
export function ProjectCard({ project, locale, dict, aspect = "aspect-[16/10]", sizes, index, className }: Props) {
  return (
    <article className={cx("group/card", className)}>
      <Link
        href={href(locale, `/work/${project.slug}`)}
        className="block"
        data-cursor="view"
        data-cursor-label={dict.cursor.view}
      >
        <div className="overflow-hidden">
          <RevealImage
            src={project.cover.src}
            alt=""
            fill
            sizes={sizes}
            parallax
            tint={project.theme.bg}
            className={aspect}
            imageClassName="transition-transform duration-[800ms] ease-out group-hover/card:scale-[1.06]"
          />
        </div>
        <div className="mt-5 flex items-baseline justify-between gap-4">
          <h3 className="text-h2 transition-transform duration-500 ease-out group-hover/card:translate-x-2">
            <HoverText text={project.title} />
          </h3>
          {index !== undefined && (
            <span className="text-meta text-fg-muted">{String(index).padStart(2, "0")}</span>
          )}
        </div>
        <div className="overflow-hidden">
          <div className="transition-transform duration-500 ease-out group-hover/card:-translate-y-0.5">
            <p className="mt-2 text-fg-muted">
              <span className="text-fg">{project.sector[locale]}</span> · {project.tagline[locale]}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tags">
              {project.tags.slice(0, 3).map((tag) => (
                <li
                  key={tag}
                  className="text-meta rounded-full border border-line px-3 py-1 transition-colors duration-200 group-hover/card:border-fg-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Link>
    </article>
  );
}
