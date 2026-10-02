"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, mq } from "@/lib/motion";

type State = "default" | "link" | "view" | "drag" | "next" | "zoom" | "hide";

/**
 * Desktop-only cursor: an 8px dot plus a 40px ring that trails behind.
 * Elements opt into states with `data-cursor="view|drag|next|zoom|link|hide"`
 * and an optional `data-cursor-label`. Native cursor stays in form fields.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<State>("default");
  const [label, setLabel] = useState("");
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`${mq.fine} and ${mq.motion}`);
    const sync = () => setEnabled(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    document.documentElement.classList.add("has-cursor");

    const dx = gsap.quickTo(dot.current, "x", { duration: 0.15, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.15, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.5, ease: "power3" });
    let visible = false;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!visible) {
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
        gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 });
        visible = true;
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const onOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button, input, textarea, select, label");
      if (!target) {
        setState("default");
        setLabel("");
        return;
      }
      if (target.matches("input, textarea, select")) {
        setState("hide");
        return;
      }
      setState((target.dataset.cursor as State | undefined) ?? "link");
      setLabel(target.dataset.cursorLabel ?? "");
    };
    const onLeave = () => {
      gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.3 });
      visible = false;
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerover", onOver);
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  const pill = state === "view" || state === "drag" || state === "next";
  const ringScale = pill ? 2.4 : state === "link" ? 1.6 : state === "zoom" ? 1.6 : 1;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <div ref={ring} className="invisible absolute left-0 top-0 opacity-0">
        <div
          className="absolute left-0 top-0 size-10 rounded-full border transition-[transform,background-color,border-color,opacity] duration-400 ease-out"
          style={{
            transform: `translate(-50%, -50%) scale(${ringScale * (pressed && pill ? 0.9 : 1)})`,
            backgroundColor: pill ? "var(--accent)" : state === "link" ? "rgb(210 255 58 / 0.2)" : "transparent",
            borderColor: pill || state === "link" ? "transparent" : "rgb(242 239 233 / 0.5)",
            opacity: state === "hide" ? 0 : 1,
          }}
        />
        {/* Label sits outside the scaled circle so it stays crisp */}
        <span
          className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-xs uppercase tracking-[0.08em] text-ink transition-opacity duration-200"
          style={{ opacity: pill || state === "zoom" ? 1 : 0 }}
        >
          {state === "zoom" ? "+" : label}
        </span>
      </div>
      <div ref={dot} className="invisible absolute left-0 top-0 opacity-0">
        <div
          className="size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent transition-opacity duration-200"
          style={{ opacity: pill || state === "hide" ? 0 : 1 }}
        />
      </div>
    </div>
  );
}
