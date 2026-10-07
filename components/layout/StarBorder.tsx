import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * Button skin after React Bits' "Star Border": two soft accent glows travel
 * along the top and bottom edges, behind a dark pill. Put it inside the
 * link/button (which carries the `star-border` class and the semantics).
 */
export function StarBorder({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <>
      <span className="star-border__glow star-border__glow--bottom" aria-hidden="true" />
      <span className="star-border__glow star-border__glow--top" aria-hidden="true" />
      <span className={cx("star-border__inner", className)}>{children}</span>
    </>
  );
}
