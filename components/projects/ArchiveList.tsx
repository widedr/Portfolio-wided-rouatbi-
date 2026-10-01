"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { href } from "@/lib/i18n";
import type { Project } from "@/lib/projects";
import { gsap, mq, stagger, duration, ease, useGSAP } from "@/lib/motion";

type Row = Pick<Project, "slug" | "title" | "sector" | "employer" | "duration" | "cover"> & { hasCaseStudy: boolean };

/**
 * Compact list of every project. On desktop a thumbnail trails the cursor
 * (lagging, tilting with speed); the hovered row turns accent, others fade.
 * On mobile each row shows a fixed thumbnail instead.
 */
export function ArchiveList({ rows, locale, dict }: { rows: Row[]; locale: Locale; dict: Dictionary }) {
  const root = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const c = dict.workPage.columns;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        gsap.from("[data-row]", {
          opacity: 0,
          y: 24,
          duration: duration.base,
          ease: ease.out,
          stagger: stagger.items / 2,
          scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
        });
      });
      mm.add(`${mq.motion} and ${mq.fine}`, () => {
        const el = thumb.current!;
        const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3" });
        const rTo = gsap.quickTo(el, "rotation", { duration: 0.7, ease: "power3" });
        let lastX = 0;
        const onMove = (e: PointerEvent) => {
          const box = root.current!.getBoundingClientRect();
          xTo(e.clientX - box.left);
          yTo(e.clientY - box.top);
          rTo(gsap.utils.clamp(-10, 10, (e.clientX - lastX) * 0.5));
          lastX = e.clientX;
        };
        root.current!.addEventListener("pointermove", onMove);
        return () => root.current?.removeEventListener("pointermove", onMove);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative" onPointerLeave={() => setHovered(null)}>
      <div
        ref={thumb}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-10 hidden w-[min(26vw,380px)] [@media(pointer:fine)]:block"
      >
        <div
          className="relative aspect-[4/3] overflow-hidden transition-[opacity,transform] duration-400 ease-out"
          style={{ opacity: hovered === null ? 0 : 1, transform: `translate(-50%, -60%) scale(${hovered === null ? 0.85 : 1})` }}
        >
          {rows.map((row, i) => (
            <Image
              key={row.slug}
              src={row.cover.src}
              alt=""
              fill
              sizes="380px"
              loading="lazy"
              className="object-cover transition-opacity duration-300"
              style={{ opacity: hovered === i ? 1 : 0 }}
            />
          ))}
        </div>
      </div>

      <table className="w-full border-collapse text-left">
        <thead className="text-meta text-fg-muted">
          <tr className="border-b border-line">
            <th scope="col" className="hidden w-16 py-4 font-normal md:table-cell">{c.index}</th>
            <th scope="col" className="py-4 font-normal">{c.name}</th>
            <th scope="col" className="hidden py-4 font-normal md:table-cell">{c.sector}</th>
            <th scope="col" className="hidden py-4 font-normal lg:table-cell">{c.role}</th>
            <th scope="col" className="hidden py-4 text-right font-normal sm:table-cell">{c.duration}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const dim = hovered !== null && hovered !== i;
            return (
              <tr
                key={row.slug}
                data-row
                className="group/row relative border-b border-line transition-[opacity,color] duration-300"
                style={{ opacity: dim ? 0.3 : 1, color: hovered === i ? "var(--accent)" : undefined }}
                onPointerEnter={() => setHovered(i)}
              >
                <td className="text-meta hidden py-5 align-middle md:table-cell">{String(i + 1).padStart(2, "0")}</td>
                <td className="py-4 align-middle md:py-5">
                  <Link
                    href={href(locale, `/work/${row.slug}`)}
                    className="flex items-center gap-4 after:absolute after:inset-0 after:content-['']"
                    data-cursor="view"
                    data-cursor-label={dict.cursor.view}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered(null)}
                  >
                    <span className="relative block size-14 shrink-0 overflow-hidden [@media(pointer:fine)]:hidden">
                      <Image src={row.cover.src} alt="" fill sizes="56px" className="object-cover" />
                    </span>
                    <span className="text-h2 transition-transform duration-500 ease-out group-hover/row:translate-x-2">
                      {row.title}
                    </span>
                    {row.hasCaseStudy && (
                      <span className="text-meta hidden rounded-full border border-current px-3 py-1 sm:inline">
                        {dict.workPage.caseStudy}
                      </span>
                    )}
                  </Link>
                </td>
                <td className="hidden py-5 align-middle md:table-cell">{row.sector[locale]}</td>
                <td className="hidden py-5 align-middle lg:table-cell">{row.employer}</td>
                <td className="text-meta hidden py-5 text-right align-middle sm:table-cell">{row.duration[locale]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
