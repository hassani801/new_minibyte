import React from "react";
import { NAME_BITS } from "@/lib/byte";
import { cn } from "@/lib/utils";

export interface DotPatternProps extends React.SVGAttributes<SVGSVGElement> {
  /**
   * Color tone:
   * - "ink": var(--ink) dots with a single Bit Blue dot on row 0, col 7.
   * - "paper": var(--paper) dots with a single Bit Blue dot on row 0, col 7.
   * - "mono": currentColor for all dots.
   */
  tone?: "ink" | "paper" | "mono";
  /**
   * Crop region in grid units (columns and rows).
   * Default: full grid viewBox.
   */
  crop?: {
    col: number;
    row: number;
    cols: number;
    rows: number;
  };
  /**
   * Number of times to tile the 8x8 matrix (number or {x, y}). Defaults to 1.
   */
  repeat?: number | { x: number; y: number };
  /**
   * Radius for bit 1 dots. Defaults to 5.
   */
  large?: number;
  /**
   * Radius for bit 0 dots. Defaults to 1.6.
   */
  small?: number;
  /**
   * Pitch (grid spacing) in SVG coordinate units. Defaults to 13.
   */
  pitch?: number;
  /**
   * When true, preserves aspect ratio with "slice" and takes full container width and height.
   */
  bleed?: boolean;
  /**
   * When false, forces all dots to use base tone fill, preventing the Bit Blue accent dot. Defaults to true.
   */
  showBlue?: boolean;
  className?: string;
}

/**
 * DotPattern renders the 8x8 binary matrix of "minibyte".
 * 
 * Each row corresponds to a letter of "minibyte" (ASCII bits).
 * Only the last bit of the first row ("m") is rendered in Bit Blue (unless tone="mono" or showBlue=false).
 */
export function DotPattern({
  tone = "ink",
  crop,
  repeat = 1,
  large = 5,
  small = 1.6,
  pitch = 13,
  bleed = false,
  showBlue = true,
  className,
  style,
  ...rest
}: DotPatternProps) {
  const tilesX = typeof repeat === "number" ? repeat : repeat.x;
  const tilesY = typeof repeat === "number" ? repeat : repeat.y;

  const totalCols = 8 * tilesX;
  const totalRows = 8 * tilesY;

  const vbX = crop ? crop.col * pitch : 0;
  const vbY = crop ? crop.row * pitch : 0;
  const vbW = crop ? crop.cols * pitch : totalCols * pitch;
  const vbH = crop ? crop.rows * pitch : totalRows * pitch;

  const baseFill =
    tone === "mono"
      ? "currentColor"
      : tone === "paper"
      ? "var(--paper)"
      : "var(--ink)";
  const blueFill = "var(--bit-blue)";

  const dots: React.ReactNode[] = [];

  for (let ty = 0; ty < tilesY; ty++) {
    for (let tx = 0; tx < tilesX; tx++) {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const globalCol = tx * 8 + c;
          const globalRow = ty * 8 + r;

          // If crop is active, skip dots outside crop bounds + 1 pitch margin
          if (crop) {
            if (
              globalCol < crop.col - 1 ||
              globalCol > crop.col + crop.cols ||
              globalRow < crop.row - 1 ||
              globalRow > crop.row + crop.rows
            ) {
              continue;
            }
          }

          const cx = pitch / 2 + globalCol * pitch;
          const cy = pitch / 2 + globalRow * pitch;
          const isBit1 = NAME_BITS[r][c];
          const radius = isBit1 ? large : small;

          // Blue dot is exclusively row 0, col 7 of the first tile (when showBlue is true)
          const isBlue = showBlue && tone !== "mono" && tx === 0 && ty === 0 && r === 0 && c === 7;
          const fill = isBlue ? blueFill : baseFill;

          dots.push(
            <circle
              key={`${tx}-${ty}-${r}-${c}`}
              cx={cx}
              cy={cy}
              r={radius}
              fill={fill}
            />
          );
        }
      }
    }
  }

  return (
    <svg
      viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
      preserveAspectRatio={bleed ? "xMidYMid slice" : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn(
        "select-none pointer-events-none",
        bleed && "w-full h-full",
        className
      )}
      style={style}
      {...rest}
    >
      {dots}
    </svg>
  );
}
