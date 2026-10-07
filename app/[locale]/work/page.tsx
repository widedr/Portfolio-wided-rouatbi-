import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { format, getDictionary, isLocale } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import { ArchiveList } from "@/components/projects/ArchiveList";
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

  const rows = projects.map(({ slug, title, sector, employer, duration, cover, caseStudy }) => ({
    slug,
    title,
    sector,
    employer,
    duration,
    cover,
    hasCaseStudy: Boolean(caseStudy),
  }));

  return (
    <div className="px-site pb-section pt-[calc(var(--header-h)+12vh)]">
      <div className="mb-20 flex flex-wrap items-end justify-between gap-8">
        <div>
          <p className="text-meta mb-6 text-fg-muted">{dict.workPage.label}</p>
          <RevealText as="h1" variant="block" className="text-display-xl">
            <HoverText text={dict.workPage.title} hover="bounce" />
          </RevealText>
        </div>
        <div className="max-w-md">
          <p className="text-body-l text-fg-muted">{dict.workPage.intro}</p>
          <p className="text-meta mt-4">{format(dict.workPage.count, { n: projects.length })}</p>
        </div>
      </div>
      <ArchiveList rows={rows} locale={locale} dict={dict} />
    </div>
  );
}
