"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { NAME, NAME_BITS } from "@/lib/byte";
import { usePageReady } from "@/lib/transition";
import { cn } from "@/lib/utils";

const easeCurve = [0.16, 1, 0.3, 1] as const;

const LETTERS = NAME.split(""); // ["m", "i", "n", "i", "b", "y", "t", "e"]

export function NamePattern() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-10% 0px" });

  const [isPageReady, setIsPageReady] = useState(false);
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  usePageReady(() => {
    setIsPageReady(true);
  });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  // Clear touch active row when tapping outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setActiveRow(null);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", handleOutsideClick);
  }, []);

  const shouldAnimate = inView && isPageReady && !prefersReducedMotion;

  const activeLetter = activeRow !== null ? LETTERS[activeRow] : null;
  const activeBits =
    activeRow !== null
      ? NAME_BITS[activeRow].map((b) => (b ? "1" : "0")).join("")
      : null;

  return (
    <div
      ref={containerRef}
      className="bg-card rounded-2xl border border-border p-4 sm:p-6 md:p-8 w-full max-w-[460px] select-none"
    >
      {/* 8-Letter Label Column + 8x8 Dot SVG */}
      <div className="flex items-center gap-3 sm:gap-4 md:gap-6 w-full">
        {/* Left Column of 8 Letter Labels - dynamic 8-row grid matching SVG 8 rows */}
        <div className="grid grid-rows-8 self-stretch items-center shrink-0 font-mono text-xs sm:text-sm text-muted-foreground select-none">
          {LETTERS.map((letter, rowIdx) => {
            const isDimmed = activeRow !== null && activeRow !== rowIdx;

            return (
              <motion.span
                key={`label-${rowIdx}`}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: prefersReducedMotion
                    ? isDimmed
                      ? 0.25
                      : 1
                    : shouldAnimate
                    ? isDimmed
                      ? 0.25
                      : 1
                    : 0,
                }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.4,
                  delay: prefersReducedMotion ? 0 : rowIdx * 0.12,
                }}
                className={cn(
                  "w-4 text-center lowercase transition-opacity duration-200",
                  activeRow === rowIdx && "text-foreground font-medium"
                )}
              >
                {letter}
              </motion.span>
            );
          })}
        </div>

        {/* Right: The 8x8 SVG Matrix */}
        <div className="w-full aspect-square flex items-center justify-center">
          <svg
            viewBox="0 0 416 416"
            className="w-full h-full block"
            aria-label="8 by 8 binary name pattern for minibyte"
          >
            {NAME_BITS.map((bits, row) => {
              const letter = LETTERS[row];
              const bitsString = bits.map((b) => (b ? "1" : "0")).join("");
              const isDimmed = activeRow !== null && activeRow !== row;

              return (
                <g
                  key={`row-${row}`}
                  tabIndex={0}
                  role="img"
                  aria-label={`${letter}: ${bitsString}`}
                  onMouseEnter={() => setActiveRow(row)}
                  onMouseLeave={() => setActiveRow(null)}
                  onFocus={() => setActiveRow(row)}
                  onBlur={() => setActiveRow(null)}
                  onClick={() =>
                    setActiveRow((prev) => (prev === row ? null : row))
                  }
                  className={cn(
                    "cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-opacity duration-200",
                    isDimmed && "opacity-25"
                  )}
                  style={{
                    opacity: isDimmed ? 0.25 : 1,
                  }}
                >
                  {bits.map((bit, col) => {
                    const cx = 26 + col * 52;
                    const cy = 26 + row * 52;
                    const targetRadius = bit ? 16 : 5;
                    const isBlue = row === 0 && col === 7;
                    const fill = isBlue ? "var(--bit-blue)" : "var(--foreground)";

                    const rowDelay = row * 0.12;
                    const dotDelay = rowDelay + col * 0.03;

                    return (
                      <motion.circle
                        key={`dot-${row}-${col}`}
                        cx={cx}
                        cy={cy}
                        fill={fill}
                        initial={{
                          r: prefersReducedMotion ? targetRadius : 0,
                          opacity: prefersReducedMotion ? 1 : 0,
                        }}
                        animate={{
                          r: prefersReducedMotion
                            ? targetRadius
                            : shouldAnimate
                            ? isBlue
                              ? [0, 16, 20, 16]
                              : targetRadius
                            : 0,
                          opacity: prefersReducedMotion
                            ? 1
                            : shouldAnimate
                            ? 1
                            : 0,
                        }}
                        transition={{
                          r: {
                            duration: prefersReducedMotion
                              ? 0
                              : isBlue
                              ? 0.7
                              : 0.5,
                            delay: prefersReducedMotion ? 0 : dotDelay,
                            ease: easeCurve,
                          },
                          opacity: {
                            duration: prefersReducedMotion ? 0 : 0.2,
                            delay: prefersReducedMotion ? 0 : dotDelay,
                          },
                        }}
                      />
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Interactive Readout Area (Fixed height prevents any layout shift) */}
      <div
        className="h-7 mt-4 flex items-center justify-center font-mono text-xs data-mono text-foreground select-none"
        aria-live="polite"
      >
        {activeBits && activeLetter ? (
          <span className="tabular-nums">
            {activeBits} = {activeLetter}
          </span>
        ) : (
          <span className="text-muted-foreground/60 tabular-nums">
            hover row to decode
          </span>
        )}
      </div>

      {/* Caption Row */}
      <div className="border-t border-border mt-3 pt-3 flex items-center justify-between label-mono text-muted-foreground text-[11px] select-none">
        <span>PATTERN</span>
        <span>EIGHT LETTERS, EIGHT BYTES</span>
      </div>
    </div>
  );
}

export default NamePattern;
