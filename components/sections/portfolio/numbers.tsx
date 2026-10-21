"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Dot } from "@/components/brand/dot";
import { WordsPullUp } from "@/components/ui/words-pull-up";
import { PORTFOLIO_PAGE } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

const easeCurve = [0.16, 1, 0.3, 1] as const;

interface StatCellProps {
  label: string;
  targetValue: number;
  isInView: boolean;
  prefersReducedMotion: boolean;
  index: number;
}

function StatCell({
  label,
  targetValue,
  isInView,
  prefersReducedMotion,
  index,
}: StatCellProps) {
  const [displayValue, setDisplayValue] = useState(prefersReducedMotion ? targetValue : 0);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(targetValue);
      return;
    }

    if (!isInView || hasAnimatedRef.current) return;

    let rafId: number;
    const duration = 1400; // 1.4s smooth roll
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Quartic ease-out: 1 - (1 - progress)^4
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(eased * targetValue);
      setDisplayValue(current);

      if (progress < 1) {
        rafId = requestAnimationFrame(frame);
      } else {
        setDisplayValue(targetValue);
        hasAnimatedRef.current = true;
      }
    };

    rafId = requestAnimationFrame(frame);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isInView, targetValue, prefersReducedMotion]);

  const binaryString = (targetValue % 256).toString(2).padStart(8, "0");

  return (
    <div
      className={cn(
        "p-4 sm:p-6 md:p-8 flex flex-col justify-between bg-card",
        index < 2 ? "border-b border-border" : "border-b-0",
        index % 2 === 0 ? "border-r border-border lg:border-r-0" : "border-r-0",
        index > 0 ? "lg:border-l lg:border-border" : "lg:border-l-0",
        "lg:border-b-0"
      )}
    >
      <div>
        {/* Animated Display Value */}
        <span className="sr-only">
          {targetValue} {label}
        </span>
        <span
          aria-hidden="true"
          className="font-mono text-[clamp(2rem,4.5vw,4rem)] font-normal leading-none tracking-[-0.03em] tabular-nums text-foreground block"
        >
          {displayValue}
        </span>

        {/* Label */}
        <span className="label-mono text-muted-foreground text-xs mt-3 block">
          {label}
        </span>
      </div>

      {/* 8-bit binary representation */}
      <span className="data-mono text-xs text-muted-foreground tabular-nums mt-6 pt-3 border-t border-border/60 block select-none">
        {binaryString}
      </span>
    </div>
  );
}

/**
 * Numbers Section: "In numbers"
 *
 * Ink section with a 4-cell stats strip showing delivery metrics.
 *
 * Rules:
 * - data-nav-theme="ink", className "theme-ink bg-background text-foreground"
 * - Counting numbers from 0 to N when in view.
 * - 8-bit binary representation below each metric.
 * - NO blue elements in this section.
 */
export function Numbers() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10% 0px" });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const { eyebrow, headline, items } = PORTFOLIO_PAGE.numbers;

  return (
    <section
      ref={sectionRef}
      id="numbers"
      data-nav-theme="ink"
      aria-labelledby="numbers-title"
      className="theme-ink bg-background text-foreground py-16 md:py-20 lg:py-28 relative"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-8">
        {/* Header Block */}
        <div className="max-w-xl mb-10 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{
              opacity: isInView || prefersReducedMotion ? 1 : 0,
              y: isInView || prefersReducedMotion ? 0 : 14,
            }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.6,
              ease: easeCurve,
              delay: 0,
            }}
            className="flex items-center gap-2 select-none"
          >
            <span
              className="w-[6px] h-[6px] rounded-full bg-paper shrink-0 inline-block"
              aria-hidden="true"
            />
            <span className="label-mono text-muted-foreground">{eyebrow}</span>
          </motion.div>

          <h2
            id="numbers-title"
            className="text-[clamp(2rem,4.5vw,3.5rem)] font-medium tracking-[-0.03em] leading-[1.04] mt-4 sm:mt-5 text-foreground"
          >
            <WordsPullUp
              text={headline}
              play={isInView}
              delay={prefersReducedMotion ? 0 : 0.08}
              lastWordAddon={<Dot color="current" aria-hidden="true" />}
            />
          </h2>
        </div>

        {/* 4-Cell Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border border-border rounded-2xl overflow-hidden">
          {items.map((item, index) => (
            <StatCell
              key={item.label}
              label={item.label}
              targetValue={item.value}
              isInView={isInView}
              prefersReducedMotion={prefersReducedMotion}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Numbers;
