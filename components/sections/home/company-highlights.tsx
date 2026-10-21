"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Dot } from "@/components/brand/dot";
import { WordsPullUp } from "@/components/ui/words-pull-up";
import { cn } from "@/lib/utils";

const easeCurve = [0.16, 1, 0.3, 1] as const;

export const HIGHLIGHTS_METRICS = [
  { value: "1000+", label: "projects delivered" },
  { value: "120+", label: "active specialists" },
  { value: "30+", label: "countries reached" },
  { value: "20", label: "years building software" },
] as const;

interface MetricCellProps {
  rawValue: string;
  label: string;
  isInView: boolean;
  prefersReducedMotion: boolean;
  index: number;
}

function parseMetric(rawValue: string) {
  const match = rawValue.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  return {
    prefix: match ? match[1] : "",
    targetNum: match ? parseFloat(match[2]) : 0,
    suffix: match ? match[3] : "",
    isDecimal: match ? match[2].includes(".") : false,
  };
}

function MetricCell({
  rawValue,
  label,
  isInView,
  prefersReducedMotion,
  index,
}: MetricCellProps) {
  const { prefix, targetNum, suffix, isDecimal } = React.useMemo(
    () => parseMetric(rawValue),
    [rawValue]
  );

  const [displayValue, setDisplayValue] = useState(
    prefersReducedMotion ? rawValue : `${prefix}0${suffix}`
  );
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(rawValue);
      return;
    }

    if (!isInView || hasAnimatedRef.current) return;

    let rafId: number;
    const duration = 1400; // 1.4s smooth roll
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Quartic ease-out for smooth decelerating count-up
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = eased * targetNum;
      const formatted = isDecimal ? current.toFixed(1) : Math.round(current).toString();
      setDisplayValue(`${prefix}${formatted}${suffix}`);

      if (progress < 1) {
        rafId = requestAnimationFrame(frame);
      } else {
        setDisplayValue(rawValue);
        hasAnimatedRef.current = true;
      }
    };

    rafId = requestAnimationFrame(frame);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isInView, rawValue, targetNum, prefix, suffix, isDecimal, prefersReducedMotion]);

  const binaryString = (Math.round(targetNum) % 256).toString(2).padStart(8, "0");

  return (
    <div
      className={cn(
        "p-5 sm:p-6 md:p-8 flex flex-col justify-between bg-card",
        index < 3 && "border-b border-border",
        index % 2 === 0 ? "sm:border-r sm:border-border" : "sm:border-r-0",
        index < 2 ? "sm:border-b sm:border-border" : "sm:border-b-0",
        index > 0 ? "lg:border-l lg:border-border" : "lg:border-l-0",
        "lg:border-r-0 lg:border-b-0"
      )}
    >
      <div>
        {/* Screen Reader Full Static Text */}
        <span className="sr-only">
          {rawValue} {label}
        </span>

        {/* Animated Number */}
        <span
          aria-hidden="true"
          className="font-mono text-[clamp(2.25rem,4.5vw,4.25rem)] font-normal leading-none tracking-[-0.03em] tabular-nums text-foreground block"
        >
          {displayValue}
        </span>

        {/* Label */}
        <span className="label-mono text-muted-foreground text-xs mt-3 block capitalize">
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
 * Company Highlights Section
 *
 * Paper surface section displaying heritage metrics and track record.
 * Sequence: Placed on Home after Clients/Where we work (ink) and before Final CTA (blue).
 * Keeps alternating theme rhythm: ink > paper > ink > paper > ink > paper > blue.
 * Rule: NO blue elements in this section (<Dot color="current"/>).
 */
export function CompanyHighlights() {
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

  return (
    <section
      ref={sectionRef}
      id="highlights"
      data-nav-theme="paper"
      aria-labelledby="highlights-title"
      className="theme-paper bg-background text-foreground py-16 md:py-20 lg:py-28 relative border-t border-border"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-8">
        {/* Header Block */}
        <div className="max-w-2xl mb-10 lg:mb-16">
          <motion.p
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
            className="label-eyebrow mb-3 sm:mb-4 select-none"
          >
            PROVEN TRACK RECORD
          </motion.p>

          <h2
            id="highlights-title"
            className="text-[clamp(2rem,4.5vw,3.5rem)] font-semibold tracking-[-0.03em] leading-[1.06] mt-4 sm:mt-5 text-foreground"
          >
            <WordsPullUp
              text="Twenty years of building systems that never fail"
              play={isInView}
              delay={prefersReducedMotion ? 0 : 0.08}
              lastWordAddon={<Dot color="current" aria-hidden="true" />}
            />
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{
              opacity: isInView || prefersReducedMotion ? 1 : 0,
              y: isInView || prefersReducedMotion ? 0 : 14,
            }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.6,
              ease: easeCurve,
              delay: prefersReducedMotion ? 0 : 0.16,
            }}
            className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed mt-4 sm:mt-5 max-w-xl font-normal"
          >
            Standard solutions solve standard problems. For everything else, you need a team that has shipped in fields, in factories, on contested networks, and at enterprise scale. That’s the only kind of work we do.
          </motion.p>
        </div>

        {/* 4-Cell Border Grid */}
        <div
          role="region"
          aria-label="Key delivery metrics"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 overflow-hidden rounded-2xl border border-border"
        >
          {HIGHLIGHTS_METRICS.map((metric, index) => (
            <MetricCell
              key={metric.label}
              rawValue={metric.value}
              label={metric.label}
              isInView={isInView}
              prefersReducedMotion={prefersReducedMotion}
              index={index}
            />
          ))}
        </div>

        {/* Global Operations Footnote */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 label-mono text-xs text-muted-foreground">
          <span>GLOBAL PARTNERS &amp; TRUSTED ENTERPRISES</span>
          <span className="tabular-nums">US // EU // GCC // APAC</span>
        </div>
      </div>
    </section>
  );
}

export default CompanyHighlights;
