"use client";

import { useEffect, useState } from "react";
import { isAmbientRunning, startAmbient, stopAmbient } from "@/lib/ambient";

const KEY = "wr-sound";

/**
 * Header sound switch for the ambient soundtrack. Off by default; the choice is
 * remembered for the visit (after a reload, sound resumes on the first click or key).
 */
export function SoundToggle({ labelOn, labelOff }: { labelOn: string; labelOff: string }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reflects a module-level audio state
    setOn(isAmbientRunning());
    let wanted = false;
    try {
      wanted = sessionStorage.getItem(KEY) === "on";
    } catch {}
    if (!wanted || isAmbientRunning()) return;
    // Browsers only allow audio after a gesture: resume on the first interaction.
    const resume = () => {
      startAmbient().then(() => setOn(true));
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
    };
    window.addEventListener("pointerdown", resume, { once: true });
    window.addEventListener("keydown", resume, { once: true });
    return () => {
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
    };
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    try {
      sessionStorage.setItem(KEY, next ? "on" : "off");
    } catch {}
    if (next) startAmbient();
    else stopAmbient();
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? labelOff : labelOn}
      className="sound-toggle grid min-h-11 min-w-11 place-items-center"
      data-cursor="link"
      data-on={on}
    >
      <span className="flex h-3.5 items-end gap-[3px]" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="sound-toggle__bar w-[2px] bg-current" style={{ animationDelay: `${i * -0.27}s` }} />
        ))}
      </span>
    </button>
  );
}
