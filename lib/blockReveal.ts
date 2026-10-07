import { gsap } from "@/lib/motion";

/**
 * H1 entrance: on each line an accent block stretches from the left to cover
 * the line, then retracts to the right, the letters appearing in its wake as if
 * typed; it ends as a thin caret that fades out. Works on <HoverText> titles
 * (letters are `[data-char]`); lines are measured when the reveal plays.
 *
 * `hide()` masks the letters right away (call it in the setup, before paint);
 * `play()` measures, builds and runs the timeline; `revert()` cleans up.
 */
export function blockReveal(root: HTMLElement, { delay = 0 } = {}) {
  const chars = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-char]"));
  const blocks: HTMLElement[] = [];
  let tl: gsap.core.Timeline | null = null;
  const prevPosition = root.style.position;

  const hide = () => gsap.set(chars, { opacity: 0 });

  const play = () => {
    if (!chars.length) return;
    if (getComputedStyle(root).position === "static") root.style.position = "relative";
    const box = root.getBoundingClientRect();

    // Group letters by visual line (same top, within a few px).
    const lines: { chars: { el: HTMLElement; x: number }[]; left: number; right: number; top: number; bottom: number }[] = [];
    chars.forEach((el) => {
      const r = el.getBoundingClientRect();
      let line = lines.find((l) => Math.abs(l.top - (r.top - box.top)) < r.height * 0.4);
      if (!line) {
        line = { chars: [], left: Infinity, right: -Infinity, top: r.top - box.top, bottom: r.bottom - box.top };
        lines.push(line);
      }
      line.chars.push({ el, x: r.left + r.width / 2 - box.left });
      line.left = Math.min(line.left, r.left - box.left);
      line.right = Math.max(line.right, r.right - box.left);
      line.bottom = Math.max(line.bottom, r.bottom - box.top);
    });

    tl = gsap.timeline({ delay });
    lines.forEach((line, i) => {
      const width = line.right - line.left;
      const height = line.bottom - line.top;
      const block = document.createElement("span");
      block.setAttribute("aria-hidden", "true");
      Object.assign(block.style, {
        position: "absolute",
        left: `${line.left}px`,
        top: `${line.top + height * 0.08}px`,
        height: `${height * 0.84}px`,
        width: "0px",
        background: "var(--accent)",
        pointerEvents: "none",
      });
      root.appendChild(block);
      blocks.push(block);

      const caret = Math.max(3, height * 0.04);
      const grow = { p: 0 };
      const sweep = { p: 0 };
      tl!
        .to(
          grow,
          {
            p: 1,
            duration: 0.45,
            ease: "power3.inOut",
            onUpdate: () => (block.style.width = `${Math.max(caret, width * grow.p)}px`),
          },
          i * 0.14,
        )
        .to(sweep, {
          p: 1,
          duration: 0.55 + line.chars.length * 0.012,
          ease: "power2.inOut",
          onUpdate: () => {
            const edge = width * sweep.p;
            block.style.left = `${line.left + Math.min(edge, width - caret)}px`;
            block.style.width = `${Math.max(caret, width - edge)}px`;
            line.chars.forEach((c) => (c.el.style.opacity = c.x - line.left < edge ? "1" : "0"));
          },
        })
        .to(block, { opacity: 0, duration: 0.25, repeat: 1, yoyo: true, ease: "steps(1)" })
        .to(block, { opacity: 0, duration: 0.15 });
    });
    tl.add(() => revertBlocks());
  };

  const revertBlocks = () => {
    blocks.splice(0).forEach((b) => b.remove());
    root.style.position = prevPosition;
  };

  const revert = () => {
    tl?.kill();
    revertBlocks();
    gsap.set(chars, { clearProps: "opacity" });
  };

  return { hide, play, revert };
}
