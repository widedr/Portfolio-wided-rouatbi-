/** Text that rolls up on hover of its closest `.roll-trigger` ancestor. */
export function RollText({ children }: { children: string }) {
  return (
    <span className="roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}

/** Arrow that exits right while a copy enters from the left (inside `.arrow-trigger`). */
export function ArrowSwap({ direction = "right" }: { direction?: "right" | "up" | "down" | "up-right" }) {
  const glyph = { right: "→", up: "↑", down: "↓", "up-right": "↗" }[direction];
  return (
    <span className="arrow-swap" aria-hidden="true">
      <span>{glyph}</span>
      <span>{glyph}</span>
    </span>
  );
}
