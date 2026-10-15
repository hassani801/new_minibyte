"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { toBits } from "@/lib/byte";
import { usePageReady } from "@/lib/transition";
import { cn } from "@/lib/utils";

export interface ByteFoldDiagramProps {
  sectionRef: React.RefObject<HTMLElement | null>;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  onCaptionsChange?: (show: boolean) => void;
  onScrollHintChange?: (show: boolean) => void;
  className?: string;
}

// Byte data for ASCII 'm' (109 = 01101101)
const BITS = toBits(109); // [false, true, true, false, true, true, false, true]
const PLACE_VALUES = [128, 64, 32, 16, 8, 4, 2, 1];
const READOUT_STRING = "0 1 1 0 1 1 0 1";

// Layout geometry coordinates (SVG viewBox: 0 0 640 280)
// Unfolded row: x_i = 52 + i * 76, y = 140
const ROW_COORDS = BITS.map((_, i) => ({
  x: 52 + i * 76,
  y: 140,
}));

// Folded 4x2 grid: cols x = 212, 284, 356, 428; rows y = 112 (row 0), 184 (row 1)
const FOLDED_COORDS = BITS.map((_, i) => {
  const col = i % 4;
  const row = Math.floor(i / 4);
  return {
    x: 212 + col * 72,
    y: row === 0 ? 112 : 184,
  };
});

/**
 * ByteFoldDiagram
 *
 * Animated SVG diagram demonstrating how the 8 bits of ASCII 'm' (01101101)
 * fold into the 4 x 2 minibyte logo mark.
 *
 * Supported Modes:
 * - Desktop (>= 1024px): ScrollTrigger pins the section wrapper and scrubs timeline 0 -> 1.
 * - Mobile/Tablet (< 1024px): Time-based playback once when the section enters view.
 * - Reduced Motion: Directly displays the final folded logo mark.
 */
export function ByteFoldDiagram({
  sectionRef,
  wrapperRef,
  onCaptionsChange,
  onScrollHintChange,
  className,
}: ByteFoldDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const circlesRef = useRef<(SVGCircleElement | null)[]>([]);
  const placeLabelsRef = useRef<(SVGTextElement | null)[]>([]);
  const bitLabelsRef = useRef<(SVGTextElement | null)[]>([]);
  const baselineRef = useRef<SVGLineElement>(null);
  const readoutRef = useRef<SVGTextElement>(null);
  const [isReduced, setIsReduced] = useState(false);

  // Register ScrollTrigger plugin
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // Sync with page:ready to ensure layout recalculation occurs after preloader lifts
  usePageReady(() => {
    ScrollTrigger.refresh();
  });

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIsReduced(prefersReduced);

    const svg = svgRef.current;
    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    if (!svg || !section || !wrapper) return;

    // MODE 3: Reduced Motion -> Render final folded state immediately
    if (prefersReduced) {
      circlesRef.current.forEach((circle, i) => {
        if (!circle) return;
        const targetRadius = BITS[i] ? 22 : 7;
        const targetCoords = FOLDED_COORDS[i];
        circle.setAttribute("cx", String(targetCoords.x));
        circle.setAttribute("cy", String(targetCoords.y));
        circle.setAttribute("r", String(targetRadius));
        if (i === 7) {
          circle.setAttribute("fill", "var(--bit-blue)");
        }
      });
      onCaptionsChange?.(true);
      onScrollHintChange?.(false);
      return;
    }

    // Build timeline inside a master GSAP context and matchMedia
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Master timeline construction
      const createTimeline = () => {
        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: "none" },
        });

        const circles = circlesRef.current.filter(Boolean) as SVGCircleElement[];
        const placeLabels = placeLabelsRef.current.filter(Boolean) as SVGTextElement[];
        const bitLabels = bitLabelsRef.current.filter(Boolean) as SVGTextElement[];
        const baseline = baselineRef.current;
        const readout = readoutRef.current;

        // PHASE A: RESOLVE (0.0s -> 3.0s)
        // 1. Place value labels and baseline fade in
        if (placeLabels.length) {
          tl.to(placeLabels, { opacity: 1, duration: 0.4, stagger: 0.04 }, 0.15);
        }
        if (baseline) {
          tl.to(baseline, { opacity: 1, duration: 0.35 }, 0.1);
        }
        if (readout) {
          tl.to(readout, { opacity: 1, duration: 0.4 }, 0.3);
        }

        // 2. Each dot resolves to its bit size (22 for 1, 7 for 0) with a snappy back ease
        circles.forEach((circle, i) => {
          const targetR = BITS[i] ? 22 : 7;
          const startTime = 0.45 + i * 0.22;
          tl.to(
            circle,
            {
              attr: { r: targetR },
              duration: 0.45,
              ease: "back.out(1.6)",
            },
            startTime
          );

          if (bitLabels[i]) {
            tl.to(
              bitLabels[i],
              {
                opacity: 1,
                duration: 0.35,
                ease: "power2.out",
              },
              startTime
            );
          }
        });

        // 3. Last dot (bit 7) fill turns Bit Blue
        if (circles[7]) {
          tl.to(
            circles[7],
            {
              attr: { fill: "var(--bit-blue)" },
              duration: 0.25,
            },
            2.5
          );
        }
        if (bitLabels[7]) {
          tl.to(
            bitLabels[7],
            {
              attr: { fill: "var(--bit-blue)" },
              duration: 0.25,
            },
            2.5
          );
        }

        // PHASE B: HOLD (3.0s -> 3.8s)
        // Subtle pause so visitors absorb the resolved 8-bit row representation
        tl.to({}, { duration: 0.8 }, 3.0);

        // PHASE C: FOLD (3.8s -> 5.6s)
        // 1. Surrounding labels, baseline, and readout fade out
        const textElements = [...placeLabels, ...bitLabels];
        if (baseline) textElements.push(baseline as unknown as SVGTextElement);
        if (readout) textElements.push(readout);

        tl.to(
          textElements,
          {
            opacity: 0,
            duration: 0.4,
            stagger: 0.02,
          },
          3.8
        );

        // 2. First 4 dots (0-3) move to row 0
        circles.slice(0, 4).forEach((circle, i) => {
          const target = FOLDED_COORDS[i];
          tl.to(
            circle,
            {
              attr: { cx: target.x, cy: target.y },
              duration: 1.0,
              ease: "power3.inOut",
            },
            4.0 + i * 0.05
          );
        });

        // 3. Second 4 dots (4-7) fold under to row 1 (starts 0.15s after)
        circles.slice(4, 8).forEach((circle, i) => {
          const target = FOLDED_COORDS[i + 4];
          tl.to(
            circle,
            {
              attr: { cx: target.x, cy: target.y },
              duration: 1.0,
              ease: "power3.inOut",
            },
            4.15 + i * 0.05
          );
        });

        // PHASE D: SETTLE (5.6s -> 6.2s)
        // Final blue dot pulses (22 -> 26 -> 22) to mark the settled logo state
        if (circles[7]) {
          tl.to(
            circles[7],
            {
              attr: { r: 26 },
              duration: 0.2,
              ease: "power1.out",
            },
            5.6
          );
          tl.to(
            circles[7],
            {
              attr: { r: 22 },
              duration: 0.2,
              ease: "power1.in",
            },
            5.8
          );
        }

        return tl;
      };

      // MODE 1: DESKTOP (>= 1024px) -> Pin wrapper + scrub timeline
      mm.add("(min-width: 1024px)", () => {
        const tl = createTimeline();

        // Calculate dynamic nav height for start offset
        const navH =
          parseInt(
            getComputedStyle(document.documentElement).getPropertyValue(
              "--nav-h"
            )
          ) || 72;

        const st = ScrollTrigger.create({
          trigger: section,
          start: () => `top top+=${navH}px`,
          end: "+=170%",
          pin: wrapper,
          pinSpacing: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          animation: tl,
          onUpdate: (self) => {
            // Captions reveal when user scrubs near end (> 0.92)
            if (self.progress > 0.92) {
              onCaptionsChange?.(true);
            } else if (self.progress < 0.85) {
              onCaptionsChange?.(false);
            }

            // Scroll hint fades out on scroll
            if (self.progress > 0.03) {
              onScrollHintChange?.(false);
            } else {
              onScrollHintChange?.(true);
            }
          },
        });

        return () => {
          st.kill();
          tl.kill();
        };
      });

      // MODE 2: MOBILE & TABLET (< 1024px) -> Time-based playback on enter
      mm.add("(max-width: 1023px)", () => {
        const tl = createTimeline();

        tl.eventCallback("onComplete", () => {
          onCaptionsChange?.(true);
        });

        const st = ScrollTrigger.create({
          trigger: section,
          start: "top 65%",
          once: true,
          onEnter: () => {
            tl.play();
          },
        });

        return () => {
          st.kill();
          tl.kill();
        };
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, [sectionRef, wrapperRef, onCaptionsChange, onScrollHintChange]);

  return (
    <div className={cn("relative w-full select-none", className)}>
      <svg
        ref={svgRef}
        viewBox="0 0 640 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="The letter m is stored as the byte 01101101. Eight dots, large for 1 and small for 0, fold into two rows of four to form the minibyte mark."
        className="w-full h-auto overflow-visible"
      >
        <desc>
          Eight dots in a row represent binary 01101101 for the letter m. Dots for
          1 are large, dots for 0 are small. The row folds in half into a 4 by 2
          grid to form the minibyte logo mark with the final bit in Bit Blue.
        </desc>

        {/* Thin baseline shelf line under dots row (y = 170) */}
        <line
          ref={baselineRef}
          x1="30"
          y1="170"
          x2="610"
          y2="170"
          stroke="var(--border)"
          strokeWidth="1"
          style={{ opacity: 0 }}
        />

        {/* 8 Place Value Labels above dots (y = 64) */}
        {PLACE_VALUES.map((val, i) => (
          <text
            key={`place-${i}`}
            ref={(el) => {
              placeLabelsRef.current[i] = el;
            }}
            x={ROW_COORDS[i].x}
            y="64"
            textAnchor="middle"
            fill="var(--muted-foreground)"
            className="font-mono text-[12px] font-normal tabular-nums"
            style={{ opacity: 0 }}
          >
            {val}
          </text>
        ))}

        {/* 8 Binary Dots (Circles) */}
        {BITS.map((bit, i) => {
          const initCoords = isReduced ? FOLDED_COORDS[i] : ROW_COORDS[i];
          const initR = isReduced ? (bit ? 22 : 7) : 7;
          const isBlue = isReduced && i === 7;

          return (
            <circle
              key={`dot-${i}`}
              ref={(el) => {
                circlesRef.current[i] = el;
              }}
              cx={initCoords.x}
              cy={initCoords.y}
              r={initR}
              fill={isBlue ? "var(--bit-blue)" : "var(--foreground)"}
            />
          );
        })}

        {/* 8 Bit Value Labels below dots (y = 224) */}
        {BITS.map((bit, i) => (
          <text
            key={`bit-${i}`}
            ref={(el) => {
              bitLabelsRef.current[i] = el;
            }}
            x={ROW_COORDS[i].x}
            y="224"
            textAnchor="middle"
            fill="var(--foreground)"
            className="font-mono text-[18px] font-medium tabular-nums"
            style={{ opacity: isReduced ? 0 : 0 }}
          >
            {bit ? "1" : "0"}
          </text>
        ))}

        {/* Bit-string readout under the diagram (y = 262) */}
        <text
          ref={readoutRef}
          x="320"
          y="262"
          textAnchor="middle"
          fill="var(--muted-foreground)"
          className="font-mono text-[13px] font-normal tabular-nums tracking-[0.1em]"
          style={{ opacity: isReduced ? 0 : 0 }}
        >
          {READOUT_STRING}
        </text>
      </svg>

      {/* Screen reader paragraph for accessible description */}
      <p className="sr-only">
        The letter m is stored as the byte 01101101. Eight dots, large for 1 and small
        for 0, fold into two rows of four to form the minibyte mark.
      </p>
    </div>
  );
}

export default ByteFoldDiagram;
