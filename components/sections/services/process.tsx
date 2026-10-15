"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Dot } from "@/components/brand/dot";
import { WordsPullUp } from "@/components/ui/words-pull-up";
import { PROCESS, TOTAL_WEEKS, SERVICES_PAGE } from "@/lib/services";
import { cn } from "@/lib/utils";

const easeCurve = [0.16, 1, 0.3, 1] as const;

/**
 * Process Section: "Four phases, each with a clear result"
 *
 * Paper section featuring an interactive 12-week timeline and 4 phase detail cards.
 *
 * Rules:
 * - data-nav-theme="paper"
 * - The ONE blue element is the Hand over phase bar (var(--bit-blue)).
 * - Interactive linked highlighting between timeline rows and phase cards.
 * - Mobile (< 768px) switches from 12-column grid to embedded mini progress tracks.
 * - Accessible sr-only table for screen reader users.
 */
export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10% 0px" });

  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const { eyebrow, headline, lead } = SERVICES_PAGE.process;

  // Derive overlap note
  const overlaps: string[] = [];
  for (let i = 0; i < PROCESS.length - 1; i++) {
    const current = PROCESS[i];
    const next = PROCESS[i + 1];
    if (current.end >= next.start) {
      overlaps.push(`Weeks ${current.start}-${current.end} and ${next.start}-${next.end} overlap`);
    }
  }
  const overlapNote = overlaps.length > 0 ? overlaps.join(", ") : null;

  return (
    <section
      ref={sectionRef}
      id="process"
      data-nav-theme="paper"
      aria-labelledby="process-title"
      className="bg-background text-foreground py-24 lg:py-32 relative"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        {/* Header Block */}
        <div className="max-w-2xl mb-12 lg:mb-16">
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
              className="w-[6px] h-[6px] rounded-full bg-foreground shrink-0 inline-block"
              aria-hidden="true"
            />
            <span className="label-mono text-muted-foreground">{eyebrow}</span>
          </motion.div>

          <h2
            id="process-title"
            className="text-[clamp(2.25rem,4.6vw,3.5rem)] font-medium tracking-[-0.03em] leading-[1.04] mt-5 text-foreground"
          >
            <WordsPullUp
              text={headline}
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
            className="text-base md:text-lg text-muted-foreground max-w-[560px] mt-6 leading-relaxed font-normal m-0"
          >
            {lead}
          </motion.p>

          {overlapNote && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: isInView || prefersReducedMotion ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="label-mono text-xs text-muted-foreground mt-3"
            >
              {overlapNote}
            </motion.p>
          )}
        </div>

        {/* SR-ONLY Table for Accessibility */}
        <table className="sr-only">
          <caption>Project delivery process phases and 12-week schedule</caption>
          <thead>
            <tr>
              <th scope="col">Phase</th>
              <th scope="col">Weeks</th>
              <th scope="col">Summary</th>
              <th scope="col">Deliverable</th>
            </tr>
          </thead>
          <tbody>
            {PROCESS.map((phase) => (
              <tr key={phase.key}>
                <td>{phase.name}</td>
                <td>
                  Weeks {phase.start} to {phase.end}
                </td>
                <td>{phase.summary}</td>
                <td>{phase.deliverable}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* DESKTOP TIMELINE CARD (hidden below md) */}
        <div
          aria-hidden="true"
          className="hidden md:block bg-card border border-border rounded-2xl p-6 md:p-10 select-none"
        >
          {/* Top Axis Row */}
          <div className="flex items-center pb-6 border-b border-border">
            <div className="w-[140px] shrink-0 label-mono text-xs text-muted-foreground">
              PHASE
            </div>
            <div className="grid grid-cols-12 flex-1">
              {Array.from({ length: TOTAL_WEEKS }, (_, i) => (
                <div
                  key={i}
                  className="text-center data-mono text-xs text-muted-foreground tabular-nums"
                >
                  W{i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* 4 Phase Rows */}
          <div className="flex flex-col divide-y divide-border/60">
            {PROCESS.map((phase, index) => {
              const isLast = index === PROCESS.length - 1;
              const isDimmed = hoveredKey !== null && hoveredKey !== phase.key;

              return (
                <div
                  key={phase.key}
                  onMouseEnter={() => setHoveredKey(phase.key)}
                  onMouseLeave={() => setHoveredKey(null)}
                  className={cn(
                    "flex items-center py-4 cursor-default transition-opacity duration-200",
                    isDimmed && "opacity-45"
                  )}
                >
                  {/* Left Label Gutter */}
                  <div className="w-[140px] shrink-0 flex flex-col pr-4">
                    <span className="text-sm font-medium text-foreground">
                      {phase.name}
                    </span>
                    <span className="data-mono text-xs text-muted-foreground tabular-nums">
                      Weeks {phase.start}–{phase.end}
                    </span>
                  </div>

                  {/* 12-Column Track with faint week grid lines */}
                  <div className="relative flex-1 grid grid-cols-12 h-10 items-center">
                    {/* Background faint vertical lines */}
                    <div className="absolute inset-0 grid grid-cols-12 pointer-events-none">
                      {Array.from({ length: TOTAL_WEEKS }, (_, colIdx) => (
                        <div
                          key={colIdx}
                          className="border-l border-border/40 h-full first:border-l-0"
                        />
                      ))}
                    </div>

                    {/* Animated Progress Bar */}
                    <motion.div
                      initial={{ scaleX: prefersReducedMotion ? 1 : 0 }}
                      animate={{ scaleX: isInView || prefersReducedMotion ? 1 : 0 }}
                      transition={{
                        duration: prefersReducedMotion ? 0 : 0.8,
                        ease: easeCurve,
                        delay: prefersReducedMotion ? 0 : index * 0.15,
                      }}
                      style={{
                        gridColumnStart: phase.start,
                        gridColumnEnd: phase.end + 1,
                        transformOrigin: "left",
                      }}
                      className={cn(
                        "h-3.5 rounded-full z-10",
                        isLast ? "bg-[var(--bit-blue)]" : "bg-foreground"
                      )}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PHASE CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {PROCESS.map((phase, index) => {
            const isLast = index === PROCESS.length - 1;
            const isHighlighted = hoveredKey === phase.key;
            const binaryIndex = (index + 1).toString(2).padStart(4, "0");

            return (
              <div
                key={phase.key}
                onMouseEnter={() => setHoveredKey(phase.key)}
                onMouseLeave={() => setHoveredKey(null)}
                className={cn(
                  "bg-card border rounded-2xl p-5 md:p-6 flex flex-col justify-between min-h-[260px]",
                  "transition-colors duration-200",
                  isHighlighted
                    ? "border-foreground/50"
                    : "border-border hover:border-foreground/40"
                )}
              >
                <div>
                  {/* Top Row: Phase 0n left & binary right */}
                  <div className="flex items-center justify-between label-mono text-xs text-muted-foreground">
                    <span>PHASE 0{index + 1}</span>
                    <span className="data-mono tabular-nums">{binaryIndex}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-medium text-foreground tracking-[-0.01em] mt-5">
                    {phase.name}
                  </h3>

                  {/* Summary */}
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed m-0">
                    {phase.summary}
                  </p>

                  {/* Mobile mini progress track */}
                  <div className="md:hidden mt-4">
                    <div className="w-full h-2 rounded-full bg-border/40 relative overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          isLast ? "bg-[var(--bit-blue)]" : "bg-foreground"
                        )}
                        style={{
                          left: `${((phase.start - 1) / TOTAL_WEEKS) * 100}%`,
                          width: `${((phase.end - phase.start + 1) / TOTAL_WEEKS) * 100}%`,
                          position: "absolute",
                        }}
                      />
                    </div>
                    <span className="data-mono text-[11px] text-muted-foreground mt-1 inline-block tabular-nums">
                      Weeks {phase.start}–{phase.end}
                    </span>
                  </div>
                </div>

                {/* Bottom Deliverable Row */}
                <div className="mt-6 pt-4 border-t border-border flex flex-col gap-1">
                  <span className="label-mono text-[11px] text-muted-foreground">
                    DELIVERABLE
                  </span>
                  <span className="text-sm text-foreground font-medium">
                    {phase.deliverable}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
