"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { format } from "@/lib/i18n";
import type { Category, Project } from "@/lib/projects";
import { Flip, gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/motion";
import { cx } from "@/lib/cx";
import { ArchiveList } from "./ArchiveList";
import { ProjectCard, type CardProject } from "./ProjectCard";

export type ExplorerProject = CardProject &
  Pick<Project, "employer" | "duration" | "category"> & { hasCaseStudy: boolean };

type Filter = "all" | Category;
type View = "grid" | "list";

/**
 * Work page body: domain filters (with counts) and a grid / list switch.
 * In the grid, cards re-flow with a FLIP animation when the filter changes;
 * filter and view are mirrored in the URL (?filter=…&view=…) so links can be shared.
 */
export function WorkExplorer({
  projects,
  categories,
  locale,
  dict,
}: {
  projects: ExplorerProject[];
  categories: readonly Category[];
  locale: Locale;
  dict: Dictionary;
}) {
  const t = dict.workPage;
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<View>("grid");
  const grid = useRef<HTMLUListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  // Restore filter/view from the URL once on load.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const f = params.get("filter");
    const v = params.get("view");
    /* eslint-disable react-hooks/set-state-in-effect -- read once from the URL */
    if (f && (categories as readonly string[]).includes(f)) setFilter(f as Category);
    if (v === "list") setView("list");
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [categories]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (filter === "all") params.delete("filter");
    else params.set("filter", filter);
    if (view === "grid") params.delete("view");
    else params.set("view", view);
    const qs = params.toString();
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  }, [filter, view]);

  const visible = (p: ExplorerProject) => filter === "all" || p.category === filter;
  const shown = projects.filter(visible);

  const choose = (next: Filter) => {
    if (next === filter) return;
    if (view === "grid" && grid.current && !prefersReducedMotion()) {
      flipState.current = Flip.getState(grid.current.querySelectorAll("[data-card]"));
    }
    setFilter(next);
  };

  // Animate from the captured layout to the new one.
  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state || !grid.current) return;
    flipState.current = null;
    Flip.from(state, {
      targets: grid.current.querySelectorAll("[data-card]"),
      duration: 0.7,
      ease: "power3.inOut",
      absolute: true,
      stagger: 0.03,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.6, delay: 0.15 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.94, duration: 0.4 }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  }, [filter]);

  const options: Filter[] = ["all", ...categories];
  const count = (f: Filter) => (f === "all" ? projects.length : projects.filter((p) => p.category === f).length);

  return (
    <div>
      <div className="mb-12 flex flex-wrap items-center justify-between gap-6 border-y border-line py-5">
        {/* Mobile: one swipeable row; desktop: wraps */}
        <div
          role="group"
          aria-label={t.filterLabel}
          className="-mx-[var(--margin)] flex w-[calc(100%+2*var(--margin))] gap-2 overflow-x-auto px-[var(--margin)] [scrollbar-width:none] md:mx-0 md:w-auto md:flex-wrap md:overflow-visible md:px-0"
        >
          {options.map((f) => {
            const active = f === filter;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={active}
                onClick={() => choose(f)}
                className={cx(
                  "text-meta inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 transition-colors duration-300",
                  active ? "border-accent bg-accent text-ink" : "border-line text-fg-muted hover:border-fg hover:text-fg",
                )}
                data-cursor="link"
              >
                {t.filters[f]}
                <span className={cx("tabular-nums", active ? "text-ink/60" : "text-fg-muted/60")}>{count(f)}</span>
              </button>
            );
          })}
        </div>
        <div role="group" aria-label={t.viewLabel} className="text-meta flex items-center gap-1 rounded-full border border-line p-1">
          {(["grid", "list"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={cx(
                "min-h-9 rounded-full px-4 transition-colors duration-300",
                view === v ? "bg-fg text-bg" : "text-fg-muted hover:text-fg",
              )}
              data-cursor="link"
            >
              {t.views[v]}
            </button>
          ))}
        </div>
      </div>

      <p className="text-meta mb-8 text-fg-muted" aria-live="polite">
        {format(t.count, { n: shown.length })}
      </p>

      {view === "grid" ? (
        <ul ref={grid} className="grid gap-x-[var(--gutter)] gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <li key={p.slug} data-card className={visible(p) ? undefined : "hidden"}>
              <ProjectCard
                project={p}
                locale={locale}
                dict={dict}
                aspect="aspect-[4/3]"
                sizes="(min-width: 1024px) 31vw, (min-width: 768px) 47vw, 100vw"
                index={shown.indexOf(p) + 1 || undefined}
              />
            </li>
          ))}
        </ul>
      ) : (
        <ArchiveList rows={shown} locale={locale} dict={dict} />
      )}
    </div>
  );
}
