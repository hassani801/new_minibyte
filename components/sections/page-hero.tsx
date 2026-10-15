"use client";

import React, { ReactNode, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Dot } from "@/components/brand/dot";
import { WordsPullUp } from "@/components/ui/words-pull-up";
import { usePageReady } from "@/lib/transition";
import { cn } from "@/lib/utils";

const easeCurve = [0.16, 1, 0.3, 1] as const;

export interface PageHeroProps {
  eyebrow: string;
  title: string;
  lead?: string;
  theme?: "paper" | "ink" | "blue";
  dotColor?: "blue" | "current";
  index?: string;
  children?: ReactNode;
  visual?: ReactNode;
  actions?: ReactNode;
  id?: string;
  className?: string;
  mono?: boolean;
}

/**
 * Reusable PageHero component
 * Standard hero template used across inner pages (About, Services, Portfolio, Research, Careers, Contact).
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  theme = "paper",
  dotColor = "blue",
  index,
  children,
  visual,
  actions,
  id = "page-hero",
  className,
  mono = false,
}: PageHeroProps) {
  const [isReady, setIsReady] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  usePageReady(() => {
    setIsReady(true);
  });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const isBlue = theme === "blue";
  const isInk = theme === "ink";
  const effectiveDotColor = isBlue ? "current" : dotColor;
  const visualContent = visual ?? children;
  const hasVisual = Boolean(visualContent);

  return (
    <section
      id={id}
      data-nav-theme={theme}
      aria-labelledby={`${id}-title`}
      className={cn(
        isInk && "theme-ink bg-background text-foreground",
        isBlue && "theme-blue text-white",
        !isInk && !isBlue && "bg-background text-foreground",
        "relative overflow-hidden",
        "min-h-[max(560px,78svh)] flex items-end lg:items-center",
        "pt-[calc(var(--nav-h)+48px)] pb-[72px]",
        className
      )}
      style={isBlue ? { background: "var(--bit-blue)" } : undefined}
    >
      <div className="mx-auto max-w-[1280px] w-full px-6 md:px-8">
        <div
          className={cn(
            hasVisual
              ? "grid grid-cols-1 lg:grid-cols-[6fr_6fr] gap-12 lg:gap-16 items-center"
              : "flex flex-col items-start max-w-[880px]"
          )}
        >
          {/* LEFT / MAIN TEXT COLUMN */}
          <div className="flex flex-col items-start w-full">
            {/* Meta Row: Eyebrow + Optional Index */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{
                opacity: isReady || prefersReducedMotion ? 1 : 0,
                y: isReady || prefersReducedMotion ? 0 : 14,
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.6,
                ease: easeCurve,
                delay: 0,
              }}
              className="flex items-center justify-between w-full select-none"
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "w-[6px] h-[6px] rounded-full shrink-0 inline-block",
                    isBlue ? "bg-white" : "bg-foreground"
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "label-mono",
                    isBlue ? "text-[var(--cta-fg-muted)]" : "text-muted-foreground"
                  )}
                >
                  {eyebrow}
                </span>
              </div>

              {index && (
                <span
                  className={cn(
                    "hidden sm:block label-mono tabular-nums",
                    isBlue ? "text-[var(--cta-fg-muted)]" : "text-muted-foreground"
                  )}
                >
                  {index} / 06
                </span>
              )}
            </motion.div>

            {/* H1 Headline (The single H1 of the page) */}
            <h1
              id={`${id}-title`}
              className={cn(
                "text-[clamp(2.75rem,7vw,5.5rem)] leading-[1] text-balance mt-6",
                isBlue ? "text-white" : "text-foreground",
                mono ? "font-mono lowercase tracking-[-0.02em]" : "font-medium tracking-[-0.035em]",
                hasVisual ? "max-w-[16ch]" : "max-w-[20ch]"
              )}
            >
              <WordsPullUp
                text={title}
                play={isReady}
                delay={prefersReducedMotion ? 0 : 0.1}
                stagger={0.08}
                lastWordAddon={<Dot color={effectiveDotColor} aria-hidden="true" />}
              />
            </h1>

            {/* Lead copy */}
            {lead && (
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{
                  opacity: isReady || prefersReducedMotion ? 1 : 0,
                  y: isReady || prefersReducedMotion ? 0 : 14,
                }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.6,
                  ease: easeCurve,
                  delay: prefersReducedMotion ? 0 : 0.5,
                }}
                className={cn(
                  "text-base md:text-lg md:text-xl max-w-[520px] mt-7 leading-relaxed font-normal",
                  isBlue ? "text-[var(--cta-fg-muted)]" : "text-muted-foreground"
                )}
              >
                {lead}
              </motion.p>
            )}

            {/* Actions Slot */}
            {actions && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{
                  opacity: isReady || prefersReducedMotion ? 1 : 0,
                  y: isReady || prefersReducedMotion ? 0 : 14,
                }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.6,
                  ease: easeCurve,
                  delay: prefersReducedMotion ? 0 : 0.62,
                }}
                className="mt-9"
              >
                {actions}
              </motion.div>
            )}
          </div>

          {/* RIGHT VISUAL SLOT */}
          {hasVisual && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{
                opacity: isReady || prefersReducedMotion ? 1 : 0,
                scale: isReady || prefersReducedMotion ? 1 : 0.98,
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.8,
                ease: easeCurve,
                delay: prefersReducedMotion ? 0 : 0.3,
              }}
              className="mt-12 lg:mt-0 w-full flex justify-center lg:justify-end"
            >
              {visualContent}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

export default PageHero;
