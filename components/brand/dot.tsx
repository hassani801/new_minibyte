import React from "react";
import { cn } from "@/lib/utils";

export interface DotProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Color of the signature dot:
   * - "blue": var(--bit-blue) (default)
   * - "current": currentColor (use when a section already features a blue element)
   */
  color?: "blue" | "current";
  className?: string;
}

/**
 * Brand signature full stop.
 * Sits directly on the baseline following headline words or brand tags.
 * 
 * Rule reminder: Max ONE Bit Blue element per section.
 * Pass color="current" if another element in the section already uses Bit Blue.
 */
export function Dot({
  color = "blue",
  className,
  style,
  ...rest
}: DotProps) {
  const bg = color === "blue" ? "var(--bit-blue)" : "currentColor";

  return (
    <span
      aria-hidden="true"
      className={cn("inline-block rounded-full select-none shrink-0", className)}
      style={{
        width: "0.16em",
        height: "0.16em",
        backgroundColor: bg,
        marginLeft: "0.06em",
        verticalAlign: "baseline",
        ...style,
      }}
      {...rest}
    />
  );
}
