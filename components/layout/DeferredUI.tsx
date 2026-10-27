"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";

// Not needed for the first paint: loaded after hydration, in their own chunks.
const ChatWidget = dynamic(() => import("./ChatWidget").then((m) => m.ChatWidget), { ssr: false });
const Cursor = dynamic(() => import("./Cursor").then((m) => m.Cursor), { ssr: false });

/** Chat assistant (everywhere) and custom cursor (mouse/trackpad only), deferred off the critical path. */
export function DeferredUI({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only media query
    setFine(window.matchMedia("(pointer: fine)").matches);
  }, []);
  return (
    <>
      <ChatWidget dict={dict} locale={locale} />
      {fine && <Cursor />}
    </>
  );
}
