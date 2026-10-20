"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Dot } from "@/components/brand/dot";
import { ByteMark } from "@/components/brand/byte-mark";
import { WordsPullUp } from "@/components/ui/words-pull-up";
import { ScrambleText } from "@/components/ui/scramble-text";
import { ABOUT } from "@/lib/about";
import { cn } from "@/lib/utils";

const easeCurve = [0.16, 1, 0.3, 1] as const;

interface PrincipleCardProps {
  index: number;
  title: string;
  text: string;
  isInView: boolean;
  prefersReducedMotion: boolean;
}

function PrincipleCard({
  index,
  title,
  text,
  isInView,
  prefersReducedMotion,
}: PrincipleCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const binaryIndex = (index + 1).toString(2).padStart(4, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{
        opacity: isInView || prefersReducedMotion ? 1 : 0,
        y: isInView || prefersReducedMotion ? 0 : 16,
      }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.6,
        ease: easeCurve,
        delay: prefersReducedMotion ? 0 : (index % 2) * 0.08,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative bg-card border border-border rounded-2xl p-5 sm:p-6 md:p-8",
        "flex flex-col gap-5 sm:gap-6 min-h-[220px] sm:min-h-[240px] cursor-default select-none",
        "transition-colors duration-200 hover:border-foreground/40"
      )}
    >
      {/* Top Row: ByteMark (left) & 4-bit Binary Index (right) */}
      <div className="flex items-center justify-between gap-4">
        <div className="w-10 shrink-0">
          <ByteMark
            value={index + 1}
            tone="mono"
            blueLast={false}
            className="w-10 text-foreground transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08] origin-left"
            aria-hidden="true"
          />
        </div>
        <span className="data-mono text-xs md:text-sm text-muted-foreground tabular-nums">
          <ScrambleText trigger={isHovered} characterSet="01">
            {binaryIndex}
          </ScrambleText>
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xl md:text-2xl font-medium tracking-[-0.02em] text-foreground mt-auto leading-snug">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm md:text-base text-muted-foreground max-w-[44ch] leading-relaxed m-0">
        {text}
      </p>
    </motion.div>
  );
}

/**
 * Principles Section: "Four principles"
 *
 * Paper section outlining the 4 foundational operating principles of minibyte.
 *
 * Rules:
 * - data-nav-theme="paper"
 * - NO blue elements in this section (all dots current tone, blueLast={false}).
 * - Cards are NOT links (no pointer cursor, no focus stops).
 * - 4-bit binary index (0001, 0010, 0011, 0100) scrambles once on hover.
 */
export function Principles() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const isInView = useInView(sectionRef, { once: true, margin: "-10% 0px" });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const { eyebrow, headline, items } = ABOUT.principles;

  return (
    <section
      ref={sectionRef}
      id="principles"
      data-nav-theme="paper"
      aria-labelledby="principles-title"
      className="bg-background text-foreground py-16 md:py-24 lg:py-32 relative"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-8">
        {/* Header Block */}
        <div ref={headerRef} className="max-w-[640px] mb-10 md:mb-12 lg:mb-16">
          {/* Eyebrow */}
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

          {/* H2 Headline: WordsPullUp + Current Color Dot */}
          <h2
            id="principles-title"
            className="text-[clamp(2rem,4.5vw,3.5rem)] font-medium tracking-[-0.03em] leading-[1.04] mt-4 sm:mt-5 text-foreground [overflow-wrap:anywhere]"
          >
            <WordsPullUp
              text={headline}
              play={isInView}
              delay={prefersReducedMotion ? 0 : 0.08}
              lastWordAddon={<Dot color="current" aria-hidden="true" />}
            />
          </h2>
        </div>

        {/* 2x2 Grid of 4 Principle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {items.map((item, index) => (
            <PrincipleCard
              key={item.title}
              index={index}
              title={item.title}
              text={item.text}
              isInView={isInView}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
