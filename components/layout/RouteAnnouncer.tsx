"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/** After client-side navigation: move focus to the new <h1> and announce the page. */
export function RouteAnnouncer({ prefix }: { prefix: string }) {
  const pathname = usePathname();
  const first = useRef(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const id = window.setTimeout(() => {
      const h1 = document.querySelector<HTMLElement>("main h1");
      if (h1) {
        h1.setAttribute("tabindex", "-1");
        h1.focus({ preventScroll: true });
      }
      setMessage(`${prefix} ${document.title}`);
    }, 50);
    return () => window.clearTimeout(id);
  }, [pathname, prefix]);

  return (
    <p className="sr-only" aria-live="polite" aria-atomic="true">
      {message}
    </p>
  );
}
