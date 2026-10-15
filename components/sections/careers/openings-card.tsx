"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { DotPattern } from "@/components/brand/dot-pattern";
import { ROLES } from "@/lib/careers";
import { usePageReady } from "@/lib/transition";

function binary8(n: number): string {
  return n.toString(2).padStart(8, "0");
}

/**
 * OpeningsCard (Careers Hero Visual)
 *
 * Large 4/3 dot pattern composition with an animated 2-digit role counter
 * and 8-bit binary status indicator.
 */
export function OpeningsCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetCount = ROLES.length;
  const [displayCount, setDisplayCount] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  usePageReady(() => {
    if (prefersReducedMotion || targetCount === 0) {
      setDisplayCount(targetCount);
      return;
    }

    const duration = 900; // 0.9s
    let startTime: number | null = null;
    let rafId: number;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      // power2.out easing
      const eased = 1 - Math.pow(1 - progress, 2);
      const current = Math.round(eased * targetCount);
      setDisplayCount(current);

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0px", "0px"] : ["-8px", "8px"]
  );

  return (
    <div
      ref={containerRef}
      className="w-full max-w-[480px] aspect-[4/3] max-h-[360px] md:max-h-none relative flex items-center justify-center overflow-hidden rounded-2xl select-none"
    >
      {/* Pattern drift on scroll */}
      <motion.div
        aria-hidden="true"
        style={{ y: parallaxY }}
        className="absolute inset-0 w-full h-full pointer-events-none select-none opacity-[0.22]"
      >
        <DotPattern
          bleed
          crop={{ col: 0, row: 0, cols: 8, rows: 8 }}
          tone="mono"
          showBlue={false}
          className="w-full h-full text-white"
        />
      </motion.div>

      {/* Foreground Count & Label */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        {/* Screen reader only live value */}
        <span className="sr-only">
          {targetCount === 0
            ? "Open applications welcome"
            : `${targetCount} open roles`}
        </span>

        {/* Animated Visual Number (fixed width container so nothing jitters) */}
        <div
          aria-hidden="true"
          className="font-mono text-[clamp(5rem,12vw,9rem)] leading-[0.9] font-medium tracking-tight text-white tabular-nums w-[2.2ch] text-center"
        >
          {prefersReducedMotion
            ? targetCount.toString().padStart(2, "0")
            : displayCount.toString().padStart(2, "0")}
        </div>

        {/* Binary & Status Indicator (using --cta-fg-muted for >= 4.5:1 contrast) */}
        <div
          aria-hidden="true"
          className="mt-4 label-mono text-[var(--cta-fg-muted)] tracking-[0.14em] text-xs sm:text-sm uppercase"
        >
          {targetCount === 0
            ? "OPEN APPLICATIONS WELCOME"
            : `OPEN ROLES · ${binary8(targetCount)}`}
        </div>
      </div>
    </div>
  );
}

export default OpeningsCard;
