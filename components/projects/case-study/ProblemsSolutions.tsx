"use client";

import { useRef, useState } from "react";
import { duration, ease, gsap, mq, useGSAP } from "@/lib/motion";

type Problem = { id: string; title: string; text: string };
type Solution = { title: string; text: string; solves: string[] };

type Props = {
  labels: { problems: string; solutions: string; answers: string };
  problems: Problem[];
  solutions: Solution[];
};

/**
 * "What was in the way" and "What I designed" side by side in the story:
 * numbered problems with a vertical progress line, then solutions that each
 * reference the problems they answer. Hovering/focusing a solution
 * highlights those problems.
 */
export function ProblemsSolutions({ labels, problems, solutions }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [highlight, setHighlight] = useState<string[]>([]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        gsap.fromTo(
          "[data-progress-line]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: "[data-problems]", start: "top 70%", end: "bottom 60%", scrub: true },
          },
        );
        gsap.utils.toArray<HTMLElement>("[data-problem]").forEach((el) => {
          const num = el.querySelector<HTMLElement>("[data-num]")!;
          const target = Number(num.dataset.num);
          const counter = { n: 0 };
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 80%", once: true } });
          tl.to(counter, {
            n: target,
            duration: 0.5,
            ease: "power1.out",
            onUpdate: () => (num.textContent = String(Math.round(counter.n)).padStart(2, "0")),
          }).from(el.querySelectorAll("[data-copy]"), { opacity: 0, y: 24, duration: duration.base, ease: ease.out, stagger: 0.08 }, 0.2);
        });
        gsap.utils.toArray<HTMLElement>("[data-solution]").forEach((el) => {
          gsap.from(el, { opacity: 0, y: 32, duration: duration.base, ease: ease.out, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <section id="problems" className="py-section px-site" aria-labelledby="problems-title">
        <div className="grid-site">
          <div className="col-span-4 md:col-span-6 lg:col-span-4">
            <p className="text-meta mb-6 text-fg-muted">02</p>
            <h2 id="problems-title" className="text-display-l lg:sticky lg:top-32">
              {labels.problems}
            </h2>
          </div>
          <ol data-problems className="relative col-span-4 mt-12 md:col-span-6 lg:col-span-7 lg:col-start-6 lg:mt-0">
            <span className="absolute left-0 top-0 h-full w-px bg-line" aria-hidden="true">
              <span data-progress-line className="block h-full w-full origin-top bg-accent" />
            </span>
            {problems.map((p) => {
              const lit = highlight.includes(p.id);
              return (
                <li
                  key={p.id}
                  id={`problem-${p.id}`}
                  data-problem
                  className="relative pb-16 pl-8 transition-colors duration-300 last:pb-0 md:pl-14"
                  style={{ color: lit ? "var(--accent)" : undefined }}
                >
                  <span data-num={Number(p.id)} className="text-meta mb-4 block text-accent" aria-hidden="true">
                    {p.id}
                  </span>
                  <h3 data-copy className="text-h2">
                    <span className="sr-only">{p.id}. </span>
                    {p.title}
                  </h3>
                  <p data-copy className="measure mt-3 text-body-l text-fg-muted">
                    {p.text}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section id="solutions" className="py-section px-site" aria-labelledby="solutions-title">
        <p className="text-meta mb-6 text-fg-muted">03</p>
        <h2 id="solutions-title" className="text-display-l mb-16">
          {labels.solutions}
        </h2>
        <ol className="grid gap-x-[var(--gutter)] gap-y-16 md:grid-cols-2">
          {solutions.map((s, i) => (
            <li
              key={s.title}
              data-solution
              tabIndex={0}
              className="group/sol border-t border-line pt-6 outline-offset-8"
              onPointerEnter={() => setHighlight(s.solves)}
              onPointerLeave={() => setHighlight([])}
              onFocus={() => setHighlight(s.solves)}
              onBlur={() => setHighlight([])}
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-meta text-fg-muted">S{String(i + 1).padStart(2, "0")}</span>
                <span className="text-meta flex gap-2">
                  {s.solves.map((id) => (
                    <a
                      key={id}
                      href={`#problem-${id}`}
                      className="rounded-full border border-line px-3 py-1 transition-colors duration-200 group-hover/sol:border-accent group-hover/sol:text-accent"
                      tabIndex={-1}
                    >
                      {labels.answers} {id}
                    </a>
                  ))}
                </span>
              </div>
              <h3 className="text-h2 mt-6">{s.title}</h3>
              <p className="measure mt-3 text-body-l text-fg-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
