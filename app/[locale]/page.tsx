import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { featuredProjects } from "@/lib/projects";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { Intro } from "@/components/home/Intro";
import { SelectedWork } from "@/components/home/SelectedWork";
import { Bands } from "@/components/home/Bands";
import { Expertise } from "@/components/home/Expertise";
import { NextCta } from "@/components/home/NextCta";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const slides = featuredProjects.map(({ slug, title, tagline, sector, year, role, employer, cover, theme }) => ({
    slug,
    title,
    tagline,
    sector,
    year,
    role,
    employer,
    cover,
    theme,
  }));

  return (
    <>
      <HeroCarousel slides={slides} locale={locale} dict={dict} />
      <Intro dict={dict} locale={locale} />
      <SelectedWork dict={dict} locale={locale} />
      <Bands dict={dict} />
      <Expertise dict={dict} />
      <NextCta dict={dict} locale={locale} />
    </>
  );
}
