import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { getDictionary, href, isLocale, locales, type Locale } from "@/lib/i18n";
import { getNextProject, getProject, projects, type Project } from "@/lib/projects";
import { ProjectHero } from "@/components/projects/case-study/ProjectHero";
import { Brief } from "@/components/projects/case-study/Brief";
import { Context } from "@/components/projects/case-study/Context";
import { ProblemsSolutions } from "@/components/projects/case-study/ProblemsSolutions";
import { Personas } from "@/components/projects/case-study/Personas";
import { Process } from "@/components/projects/case-study/Process";
import { Screens } from "@/components/projects/case-study/Screens";
import { Results } from "@/components/projects/case-study/Results";
import { NextProject } from "@/components/projects/case-study/NextProject";
import { ReadingProgress } from "@/components/projects/case-study/ReadingProgress";
import { Reveal, RevealText } from "@/components/motion/Reveal";
import { RevealImage } from "@/components/motion/RevealImage";

export function generateStaticParams() {
  return locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/[locale]/work/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project || !isLocale(locale)) return {};
  return {
    title: project.title,
    description: project.caseStudy?.subtitle[locale] ?? project.description[locale],
    openGraph: { images: [project.cover.src] },
  };
}

export default async function ProjectPage({ params }: PageProps<"/[locale]/work/[slug]">) {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project || !isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const p = dict.project;
  const cs = project.caseStudy;
  const next = getNextProject(slug);

  const brief = [
    { label: p.client, value: cs?.client[locale] ?? project.employer },
    { label: p.sector, value: project.sector[locale] },
    { label: p.role, value: project.role },
    { label: p.duration, value: project.duration[locale] },
    project.year ? { label: p.year, value: String(project.year) } : { label: p.employer, value: project.employer },
    ...(cs?.status ? [{ label: p.status, value: cs.status[locale] }] : []),
  ];

  const themeStyle = { "--bg": project.theme.bg, backgroundColor: project.theme.bg, color: project.theme.fg } as CSSProperties;

  return (
    <article style={themeStyle}>
      <ProjectHero
        title={project.title}
        subtitle={cs?.subtitle[locale] ?? project.description[locale]}
        eyebrow={`${project.sector[locale]} · ${project.year ?? project.employer}`}
        cover={project.cover}
        alt={project.description[locale]}
        scrollLabel={p.scroll}
      />
      <Brief
        title={p.brief}
        items={brief}
        live={project.liveUrl ? { href: project.liveUrl, label: p.live } : undefined}
      />
      {cs ? <CaseStudyBody project={project} locale={locale} dict={dict} /> : <Overview project={project} locale={locale} title={p.overview} />}
      <NextProject
        href={href(locale, `/work/${next.slug}`)}
        title={next.title}
        tagline={next.tagline[locale]}
        cover={next.cover.src}
        label={p.next}
        cursor={dict.cursor.next}
        back={{ href: href(locale, "/work"), label: p.backToWork }}
      />
    </article>
  );
}

type BodyProps = { project: Project; locale: Locale; dict: ReturnType<typeof getDictionary> };

function CaseStudyBody({ project, locale, dict }: BodyProps) {
  const cs = project.caseStudy!;
  const p = dict.project;
  const L = <T,>(v: Record<Locale, T>) => v[locale];

  const sections = [
    { id: "brief", label: p.brief },
    { id: "context", label: p.context },
    { id: "problems", label: p.problems },
    { id: "solutions", label: p.solutions },
    { id: "personas", label: p.personas },
    { id: "process", label: p.process },
    { id: "screens", label: p.screens },
    { id: "results", label: p.results },
  ];

  return (
    <>
      <ReadingProgress sections={sections} label={p.toc} />
      <Context
        title={p.context}
        paragraphs={L(cs.context.text)}
        facts={cs.context.facts.map((f) => ({ value: f.value, label: L(f.label) }))}
      />
      <ProblemsSolutions
        labels={{ problems: p.problems, solutions: p.solutions, answers: p.answers }}
        problems={cs.problems.map((x) => ({ id: x.id, title: L(x.title), text: L(x.text) }))}
        solutions={cs.solutions.map((x) => ({ title: L(x.title), text: L(x.text), solves: x.solves }))}
      />
      <Personas
        title={p.personas}
        note={p.personasNote}
        personas={cs.personas.map((x) => ({ role: L(x.role), situation: L(x.situation), outcome: L(x.outcome), image: x.image }))}
      />
      <Process
        title={p.process}
        steps={cs.process.map((x) => ({ step: L(x.step), text: L(x.text) }))}
        aiLabel={p.aiMakingOf}
        aiMethod={cs.aiMethod ? { title: L(cs.aiMethod.title), lines: L(cs.aiMethod.lines) } : undefined}
        aiMakingOf={cs.aiMakingOf ? { ...cs.aiMakingOf, caption: L(cs.aiMakingOf.caption) } : undefined}
        sliderLabels={{ before: p.before, after: p.after, label: p.sliderLabel }}
      />
      <Screens
        screens={cs.screens.map((s) => ({ ...s, alt: L(s.alt), title: L(s.title), decision: L(s.decision) }))}
        labels={{ title: p.screens, zoom: p.zoom, close: p.closeLightbox, prev: p.prevScreen, next: p.nextScreen }}
        zoomCursor={dict.cursor.open}
      />
      <Results
        title={p.results}
        learningsTitle={p.learnings}
        statement={cs.results.statement ? L(cs.results.statement) : undefined}
        metrics={cs.results.metrics?.map((m) => ({ ...m, label: L(m.label) }))}
        quotes={cs.results.quotes?.map(L)}
        learnings={cs.results.learnings.map(L)}
      />
    </>
  );
}

/** Short project sheet for projects without a full case study. */
function Overview({ project, locale, title }: { project: Project; locale: Locale; title: string }) {
  const [lead, ...rest] = project.longDescription[locale];
  return (
    <section className="theme-paper py-section px-site" aria-labelledby="overview-title">
      <div className="grid-site gap-y-12">
        <p className="text-meta col-span-4 md:col-span-6 lg:col-span-3">{title}</p>
        <div className="col-span-4 md:col-span-6 lg:col-span-8 lg:col-start-5">
          <RevealText id="overview-title" className="text-h2">
            {lead}
          </RevealText>
          <Reveal selector="p" className="measure mt-8 flex flex-col gap-6 text-body-l text-ink-muted">
            {rest.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </Reveal>
          <ul className="mt-10 flex flex-wrap gap-2" aria-label="Tags">
            {project.tags.map((tag) => (
              <li key={tag} className="text-meta rounded-full border border-line px-3 py-1">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <RevealImage
        src={project.cover.src}
        alt={project.description[locale]}
        fill
        sizes="100vw"
        parallax
        tint="#e7e3db"
        className="mt-section aspect-[16/10] w-full"
      />
    </section>
  );
}
