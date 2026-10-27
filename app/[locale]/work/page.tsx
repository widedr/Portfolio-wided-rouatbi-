import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { categories, projects } from "@/lib/projects";
import { WorkExplorer, type ExplorerProject } from "@/components/projects/WorkExplorer";
import { RevealText } from "@/components/motion/Reveal";
import { HoverText } from "@/components/motion/HoverText";

export async function generateMetadata({ params }: PageProps<"/[locale]/work">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return { title: dict.workPage.title, description: dict.workPage.intro };
}

export default async function WorkPage({ params }: PageProps<"/[locale]/work">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  // Only what the cards and rows need goes to the client.
  const items: ExplorerProject[] = projects.map(({ slug, title, sector, tagline, tags, cover, theme, employer, duration, category, caseStudy }) => ({
    slug,
    title,
    sector,
    tagline,
    tags,
    cover,
    theme,
    employer,
    duration,
    category,
    hasCaseStudy: Boolean(caseStudy),
  }));

  return (
    <div className="px-site pb-section pt-[calc(var(--header-h)+12vh)]">
      <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
        <div>
          <p className="text-meta mb-6 text-fg-muted">{dict.workPage.label}</p>
          <RevealText as="h1" className="text-display-xl">
            <HoverText text={dict.workPage.title} hover="pressure" />
          </RevealText>
        </div>
        <div className="max-w-md">
          <p className="text-body-l text-fg-muted">{dict.workPage.intro}</p>
        </div>
      </div>
      <WorkExplorer projects={items} categories={categories} locale={locale} dict={dict} />
    </div>
  );
}
