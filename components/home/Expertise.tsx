"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import { gsap, mq, useGSAP } from "@/lib/motion";
import { RevealText } from "@/components/motion/Reveal";

/**
 * Accordion of five expertise blocks. Click/Enter opens a row (one at a time).
 * On desktop, hovering the list shows an illustration that trails the cursor.
 */
export function Expertise({ dict }: { dict: Dictionary }) {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const id = useId();
  const items = dict.expertise.items;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${mq.motion} and ${mq.fine} and ${mq.desktop}`, () => {
        const el = preview.current!;
        const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
        const rTo = gsap.quickTo(el, "rotation", { duration: 0.6, ease: "power3" });
        let lastX = 0;
        const list = root.current!.querySelector("[data-list]")!;
        const onMove = (e: Event) => {
          const { clientX, clientY } = e as PointerEvent;
          const box = list.getBoundingClientRect();
          xTo(clientX - box.left);
          yTo(clientY - box.top);
          rTo(gsap.utils.clamp(-8, 8, (clientX - lastX) * 0.4));
          lastX = clientX;
        };
        list.addEventListener("pointermove", onMove);
        return () => list.removeEventListener("pointermove", onMove);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="py-section px-site" aria-labelledby={`${id}-title`}>
      <p className="text-meta mb-6 text-fg-muted">03 — {dict.expertise.label}</p>
      <RevealText id={`${id}-title`} className="text-display-l mb-16 max-w-[16ch]">
        {dict.expertise.title}
      </RevealText>

      <div data-list className="relative" onPointerLeave={() => setHovered(null)}>
        {/* Cursor-trailing illustration (desktop, decorative) */}
        <div
          ref={preview}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-10 hidden w-[22vw] max-w-[340px] lg:block"
        >
          <div
            className="-translate-x-1/2 -translate-y-1/2 transition-[opacity,transform] duration-400 ease-out"
            style={{ opacity: hovered === null ? 0 : 1, transform: `translate(-50%,-50%) scale(${hovered === null ? 0.8 : 1})` }}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              {items.map((item, i) => (
                <Image
                  key={item.title}
                  src={item.image}
                  alt=""
                  fill
                  sizes="340px"
                  className="object-cover transition-opacity duration-300"
                  style={{ opacity: hovered === i ? 1 : 0 }}
                />
              ))}
            </div>
          </div>
        </div>

        <ul className="border-t border-line">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li
                key={item.title}
                className="border-b border-line transition-opacity duration-300"
                style={{ opacity: hovered !== null && hovered !== i ? 0.35 : 1 }}
                onPointerEnter={() => setHovered(i)}
              >
                <h3>
                  <button
                    type="button"
                    id={`${id}-h${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${id}-p${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="group/row flex w-full items-baseline gap-4 py-6 text-left md:gap-10 md:py-8"
                    data-cursor="link"
                  >
                    <span className="text-meta w-8 shrink-0 text-fg-muted">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-h2 flex-1 transition-transform duration-500 ease-out group-hover/row:translate-x-2">
                      {item.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-h2 shrink-0 text-accent transition-transform duration-500 ease-out"
                      style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div
                  id={`${id}-p${i}`}
                  role="region"
                  aria-labelledby={`${id}-h${i}`}
                  className="grid transition-[grid-template-rows] duration-600 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  inert={!isOpen}
                >
                  <div className="overflow-hidden">
                    <div className="grid gap-6 pb-10 pl-12 md:grid-cols-2 md:pl-[4.5rem] lg:w-2/3">
                      <p className="text-body-l">{item.text}</p>
                      <p className="text-fg-muted">
                        <span className="text-meta mb-2 block text-accent">→</span>
                        {item.example}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
