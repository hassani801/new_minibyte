"use client";

import React from "react";
import { motion } from "framer-motion";
import { toBits } from "@/lib/byte";
import { cn } from "@/lib/utils";

export interface ByteMarkProps extends React.SVGAttributes<SVGSVGElement> {
  /**
   * Byte value between 0 and 255. Defaults to ASCII 'm' (109 = 01101101).
   */
  value?: number;
  /**
   * Visual tone for the mark:
   * - "ink": var(--ink) dots with Bit Blue last dot.
   * - "paper": var(--paper) dots with Bit Blue last dot.
   * - "mono": currentColor for all dots including the last.
   */
  tone?: "ink" | "paper" | "mono";
  /**
   * Whether the 8th dot (bottom-right) is rendered in Bit Blue. Defaults to true (forced false for tone="mono").
   */
  blueLast?: boolean;
  /**
   * When true, smoothly animates dot radii upon value transitions using framer-motion.
   */
  animated?: boolean;
  /**
   * When true, triggers a quick scale pulse (1 -> 1.25 -> 1) on the 8th dot.
   */
  pulseLast?: boolean;
  /**
   * Rendered width in px (height is rendered as width / 2). Default: fills container width.
   */
  size?: number;
  /**
   * Optional accessible title. If provided, role="img" is applied. Otherwise aria-hidden="true".
   */
  title?: string;
  className?: string;
}

/**
 * ByteMark renders 8 dots folded into a 4x2 grid representing 1 byte (8 bits).
 * 
 * Geometry:
 * - 4 columns x 2 rows (viewBox 0 0 52 26, pitch 13).
 * - Bit 1 = Large dot (r = 5).
 * - Bit 0 = Small dot (r = 1.6).
 * - ASCII 'm' = 109 = 01101101:
 *   Row 1: small, LARGE, LARGE, small
 *   Row 2: LARGE, LARGE, small, LARGE (Bit Blue)
 */
export function ByteMark({
  value = 109,
  tone = "ink",
  blueLast = true,
  animated = false,
  pulseLast = false,
  size,
  title,
  className,
  style,
  ...rest
}: ByteMarkProps) {
  const bits = toBits(value);
  const effectiveBlueLast = tone !== "mono" && blueLast;

  const baseFill =
    tone === "mono"
      ? "currentColor"
      : tone === "paper"
      ? "var(--paper)"
      : "var(--ink)";
  const blueFill = "var(--bit-blue)";

  const inlineStyles: React.CSSProperties = {
    minWidth: 24,
    ...(size ? { width: size, height: size / 2 } : {}),
    ...style,
  };

  return (
    <svg
      viewBox="0 0 52 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      className={cn("inline-block shrink-0", className)}
      style={inlineStyles}
      {...rest}
    >
      {title && <title>{title}</title>}
      {bits.map((bit, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const cx = 6.5 + col * 13;
        const cy = 6.5 + row * 13;
        const targetRadius = bit ? 5 : 1.6;
        const isBlueDot = effectiveBlueLast && i === 7;
        const fill = isBlueDot ? blueFill : baseFill;
        const isPulseDot = isBlueDot && pulseLast;

        if (animated) {
          return (
            <motion.circle
              key={i}
              cx={cx}
              cy={cy}
              fill={fill}
              initial={false}
              animate={{
                r: isPulseDot ? [targetRadius, targetRadius * 1.25, targetRadius] : targetRadius,
              }}
              transition={
                isPulseDot
                  ? { duration: 0.25, times: [0, 0.5, 1], ease: "easeInOut" }
                  : { duration: 0.12, ease: "easeOut" }
              }
            />
          );
        }

        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={targetRadius}
            fill={fill}
          />
        );
      })}
    </svg>
  );
}

