import Image from "next/image";
import Link from "next/link";
import { ArrowSwap } from "@/components/layout/RollText";

type Props = {
  href: string;
  title: string;
  tagline: string;
  cover: string;
  label: string;
  cursor: string;
  back: { href: string; label: string };
};

/** Full-screen "next project" block: the visual unveils a little more on hover. */
export function NextProject({ href, title, tagline, cover, label, cursor, back }: Props) {
  return (
    <section className="relative" aria-label={label}>
      <Link
        href={href}
        className="group/next relative flex min-h-[70svh] flex-col justify-end overflow-hidden px-site pb-12 text-[#f2efe9]"
        data-cursor="next"
        data-cursor-label={cursor}
      >
        <div
          className="absolute inset-0 transition-[clip-path] duration-1000 ease-out [clip-path:inset(12%_8%_12%_8%)] group-hover/next:[clip-path:inset(0%_0%_0%_0%)] group-focus-visible/next:[clip-path:inset(0%_0%_0%_0%)]"
          aria-hidden="true"
        >
          <Image src={cover} alt="" fill sizes="100vw" className="object-cover transition-transform duration-1000 ease-out group-hover/next:scale-105" />
          <div className="absolute inset-0 bg-black/55" />
        </div>
        <p className="text-meta relative">{label}</p>
        <p className="text-display-xl relative mt-4">{title}</p>
        <p className="relative mt-6 flex flex-wrap items-center justify-between gap-4">
          <span className="text-body-l max-w-[40ch] opacity-80">{tagline}</span>
          <span className="arrow-trigger text-meta inline-flex items-center gap-3">
            <ArrowSwap />
          </span>
        </p>
      </Link>
      <div className="px-site py-8">
        <Link href={back.href} className="link-underline text-meta">
          ← {back.label}
        </Link>
      </div>
    </section>
  );
}
