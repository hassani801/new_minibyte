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
  isFirstOnLg: boolean;
}

function StatCell({
  label,
  targetValue,
  isInView,
  prefersReducedMotion,
  isFirstOnLg,
}: StatCellProps) {
  const [displayValue, setDisplayValue] = useState(prefersReducedMotion ? targetValue : 0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(targetValue);
      return;
    }

    if (!isInView) return;

    const duration = 1200; // 1.2s
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // power2.out easing: 1 - (1 - progress)^2
      const eased = 1 - Math.pow(1 - progress, 2);
      const current = Math.round(eased * targetValue);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        setDisplayValue(targetValue);
      }
    };

    requestAnimationFrame(frame);
  }, [isInView, targetValue, prefersReducedMotion]);

  const binaryString = (targetValue % 256).toString(2).padStart(8, "0");

  return (
    <div
      className={cn(
        "p-6 md:p-8 flex flex-col justify-between border-b border-border",
        "border-r border-border md:border-r-0",
        "lg:border-l lg:border-border",
        isFirstOnLg && "lg:border-l-0"
      )}
    >
      <div>
        {/* Animated Display Value */}
        <span className="sr-only">
          {targetValue} {label}
        </span>
        <span
          aria-hidden="true"
          className="font-mono text-[clamp(2.5rem,5vw,4rem)] font-normal leading-none tracking-[-0.03em] tabular-nums text-foreground block"
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
      className="theme-ink bg-background text-foreground py-20 lg:py-28 relative"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        {/* Header Block */}
        <div className="max-w-xl mb-12 lg:mb-16">
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
            className="text-[clamp(2.25rem,4.6vw,3.5rem)] font-medium tracking-[-0.03em] leading-[1.04] mt-5 text-foreground"
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
        <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-border">
          {items.map((item, index) => (
            <StatCell
              key={item.label}
              label={item.label}
              targetValue={item.value}
              isInView={isInView}
              prefersReducedMotion={prefersReducedMotion}
              isFirstOnLg={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Numbers;
