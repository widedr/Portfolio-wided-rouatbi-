"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

function now() {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: site.timezone,
  }).format(new Date());
}

/** "Sousse · 11:57 CET", refreshed every minute. Renders empty on the server to avoid a mismatch. */
export function LocalClock({ withCity = true }: { withCity?: boolean }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTime(now());
    update();
    // Align to the next minute boundary, then tick every 60s.
    let interval: number | undefined;
    const timeout = window.setTimeout(() => {
      update();
      interval = window.setInterval(update, 60_000);
    }, 60_000 - (Date.now() % 60_000));
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, []);

  return (
    <time suppressHydrationWarning>
      {withCity ? `${site.city} · ` : ""}
      {time ?? "--:--"} CET
    </time>
  );
}
