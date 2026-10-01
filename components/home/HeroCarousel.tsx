"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { format, href } from "@/lib/i18n";
import type { Project } from "@/lib/projects";
import { Draggable, duration, ease, gsap, mq, prefersReducedMotion, SplitText, stagger, useGSAP, whenLoaderDone } from "@/lib/motion";
import { ArrowSwap } from "@/components/layout/RollText";

type Slide = Pick<Project, "slug" | "title" | "tagline" | "sector" | "year" | "role" | "employer" | "cover" | "theme">;

export function HeroCarousel({ slides, locale, dict }: { slides: Slide[]; locale: Locale; dict: Dictionary }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const draggable = useRef<Draggable | null>(null);
  const snaps = useRef<number[]>([]);
  const dragged = useRef(false);
  const [active, setActive] = useState(0);
  const t = dict.hero;
  const total = slides.length;

  const nearest = (x: number) =>
    snaps.current.reduce((best, s, i) => (Math.abs(s - x) < Math.abs(snaps.current[best] - x) ? i : best), 0);

  const goTo = useCallback((index: number) => {
    const i = gsap.utils.clamp(0, snaps.current.length - 1, index);
    setActive(i);
    gsap.to(track.current, {
      x: snaps.current[i],
      duration: prefersReducedMotion() ? 0 : duration.base,
      ease: ease.out,
      onUpdate: () => draggable.current?.update(),
    });
  }, []);

  // Drag + inertia, velocity skew, snap, edge resistance.
  useGSAP(
    () => {
      const el = track.current!;
      const slidesEls = gsap.utils.toArray<HTMLElement>("[data-slide]", el);
      const measure = () => {
        const origin = slidesEls[0].offsetLeft;
        snaps.current = slidesEls.map((s) => -(s.offsetLeft - origin));
      };
      measure();

      const reduced = prefersReducedMotion();
      const skewTo = gsap.quickTo(slidesEls, "skewX", { duration: 0.5, ease: "power3" });
      let lastX = 0;
      let lastT = 0;

      const [d] = Draggable.create(el, {
        type: "x",
        inertia: !reduced,
        edgeResistance: 0.75,
        dragClickables: true,
        minimumMovement: 6,
        bounds: { minX: snaps.current[snaps.current.length - 1], maxX: 0 },
        snap: (x) => snaps.current[nearest(x)],
        onPress() {
          dragged.current = false;
          lastX = this.x;
          lastT = performance.now();
          if (!reduced) gsap.to(slidesEls, { scale: 0.95, duration: duration.short, ease: ease.soft });
        },
        onDrag() {
          dragged.current = true;
          if (reduced) return;
          const now = performance.now();
          const v = (this.x - lastX) / Math.max(1, now - lastT); // px/ms
          lastX = this.x;
          lastT = now;
          skewTo(gsap.utils.clamp(-6, 6, -v * 4));
        },
        onRelease() {
          gsap.to(slidesEls, { scale: 1, duration: duration.base, ease: ease.out });
          skewTo(0);
        },
        onThrowUpdate() {
          setActive(nearest(this.x));
        },
        onDragEnd() {
          setActive(nearest(this.endX ?? this.x));
        },
      });
      draggable.current = d;

      const onResize = () => {
        measure();
        d.applyBounds({ minX: snaps.current[snaps.current.length - 1], maxX: 0 });
        gsap.set(el, { x: snaps.current[nearest(d.x)] });
        d.update();
      };
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("resize", onResize);
        d.kill();
      };
    },
    { scope: root },
  );

  // Horizontal trackpad swipes move the carousel; vertical scroll stays native.
  useEffect(() => {
    const el = root.current!;
    let lock = false;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 20 || lock) return;
      e.preventDefault();
      lock = true;
      window.setTimeout(() => (lock = false), 600);
      setActive((current) => {
        const next = gsap.utils.clamp(0, total - 1, current + (e.deltaX > 0 ? 1 : -1));
        gsap.to(track.current, { x: snaps.current[next], duration: duration.base, ease: ease.out, onUpdate: () => draggable.current?.update() });
        return next;
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [total]);

  // Entrance after the loader: slides glide in from the right, title letters rise, sector line last.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        // Lift the CSS pre-hide first so `from` tweens record the visible state as their end.
        gsap.set("[data-hero-intro]", { opacity: 1 });
        const split = SplitText.create("[data-hero-title]", { type: "lines", mask: "lines" });
        const tl = gsap.timeline({ paused: true });
        tl.from("[data-slide]", { xPercent: 40, opacity: 0, duration: duration.long, ease: ease.out, stagger: stagger.items })
          .from(split.lines, { yPercent: 110, duration: duration.base, ease: ease.out, stagger: stagger.lines }, 0.15)
          .from("[data-hero-meta]", { opacity: 0, y: 16, duration: duration.base, ease: ease.out, stagger: stagger.items }, 0.5);
        const off = whenLoaderDone(() => tl.play());
        return () => {
          off();
          split.revert();
        };
      });
      mm.add(mq.reduced, () => {
        gsap.set("[data-hero-intro]", { opacity: 1 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Active slide title rolls its letters on change.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (prefersReducedMotion()) return;
    const title = root.current?.querySelector(`[data-slide="${active}"] [data-slide-title]`);
    if (!title) return;
    const split = SplitText.create(title, { type: "chars", mask: "chars" });
    const tween = gsap.from(split.chars, {
      yPercent: 100,
      duration: duration.short + 0.2,
      ease: ease.out,
      stagger: stagger.chars,
      onComplete: () => split.revert(),
    });
    return () => {
      tween.kill();
      split.revert();
    };
  }, [active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(active - 1);
    }
  };

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-[calc(var(--header-h)+2vh)]"
      aria-labelledby="hero-title"
    >
      {/* Who + what, readable in under five seconds */}
      <div className="grid-site px-site">
        <p data-hero-intro data-hero-meta className="text-meta col-span-4 text-fg-muted md:col-span-6 lg:col-span-12">
          {t.eyebrow}
        </p>
        <h1
          id="hero-title"
          data-hero-intro
          data-hero-title
          className="text-h2 col-span-4 mt-4 md:col-span-5 lg:col-span-7"
        >
          {t.title} <em className="text-accent">{t.titleEm}</em>
        </h1>
      </div>

      {/* Carousel */}
      <div
        className="relative mt-8 flex flex-1 flex-col justify-center lg:justify-end"
        role="region"
        aria-roledescription={t.carouselRole}
        aria-label={t.carouselLabel}
        onKeyDown={onKeyDown}
      >
        <div
          ref={track}
          className="flex gap-[var(--gutter)] pl-[var(--margin)] will-change-transform"
          data-cursor="drag"
          data-cursor-label={dict.cursor.drag}
          style={{ touchAction: "pan-y" }}
        >
          {slides.map((slide, i) => (
            <article
              key={slide.slug}
              data-slide={i}
              data-hero-intro
              className="w-[min(82vw,64svh)] shrink-0 md:w-[min(62vw,64svh)] lg:w-[min(54vw,68svh)]"
              aria-roledescription="slide"
              aria-label={format(t.slideOf, { i: i + 1, n: total })}
            >
              <Link
                href={href(locale, `/work/${slide.slug}`)}
                className="group/slide block transition-opacity duration-500"
                style={{ opacity: i === active ? 1 : 0.45 }}
                draggable={false}
                onClick={(e) => {
                  if (dragged.current) e.preventDefault();
                }}
                onFocus={() => i !== active && goTo(i)}
                data-cursor="view"
                data-cursor-label={dict.cursor.view}
              >
                <div
                  className="relative aspect-[16/10] overflow-hidden rounded-[2px]"
                  style={{ backgroundColor: slide.theme.bg }}
                >
                  <Image
                    src={slide.cover.src}
                    alt=""
                    fill
                    priority={i === 0}
                    sizes="(min-width: 1024px) 54vw, (min-width: 768px) 62vw, 82vw"
                    className="pointer-events-none object-cover transition-transform duration-[900ms] ease-out group-hover/slide:scale-[1.04]"
                    draggable={false}
                  />
                </div>
                <div className="mt-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
                  <h2
                    data-slide-title
                    className="text-display-l transition-transform duration-500 ease-out group-hover/slide:translate-x-2"
                  >
                    {slide.title}
                  </h2>
                  <p className="text-meta pb-2 text-fg-muted">
                    {slide.year ?? slide.employer} · {slide.role.split("&")[0].trim()}
                  </p>
                </div>
                <p className="mt-1 text-fg-muted">
                  <span className="text-fg">{slide.sector[locale]}</span> · {slide.tagline[locale]}
                </p>
              </Link>
            </article>
          ))}
          <div className="w-[var(--margin)] shrink-0" aria-hidden="true" />
        </div>

        {/* Controls */}
        <div data-hero-intro data-hero-meta className="mt-8 flex items-center justify-between gap-6 px-site pb-6">
          <div className="flex items-center gap-4">
            <span className="text-meta tabular-nums" aria-live="polite">
              {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <span className="relative block h-px w-24 overflow-hidden bg-line md:w-40" aria-hidden="true">
              <span
                className="absolute inset-0 origin-left bg-fg transition-transform duration-700 ease-out"
                style={{ transform: `scaleX(${(active + 1) / total})` }}
              />
            </span>
            <span className="text-meta hidden text-fg-muted lg:inline">{t.hint}</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              aria-label={t.prev}
              className="arrow-trigger grid size-12 place-items-center rounded-full border border-line transition-opacity disabled:opacity-30"
              data-cursor="link"
            >
              <span className="rotate-180">
                <ArrowSwap />
              </span>
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              disabled={active === total - 1}
              aria-label={t.next}
              className="arrow-trigger grid size-12 place-items-center rounded-full border border-line transition-opacity disabled:opacity-30"
              data-cursor="link"
            >
              <ArrowSwap />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
