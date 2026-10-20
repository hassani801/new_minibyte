"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Dot } from "@/components/brand/dot";
import { DotPattern } from "@/components/brand/dot-pattern";
import { WordsPullUp } from "@/components/ui/words-pull-up";
import { ScrambleText } from "@/components/ui/scramble-text";
import { BYTES, RESEARCH_PAGE, type ByteTerm } from "@/lib/research";
import { toBits } from "@/lib/byte";
import { cn } from "@/lib/utils";

const easeCurve = [0.16, 1, 0.3, 1] as const;

interface ByteCardProps {
  item: ByteTerm;
  index: number;
  isInView: boolean;
  prefersReducedMotion: boolean;
}

function ByteCard({
  item,
  index,
  isInView,
  prefersReducedMotion,
}: ByteCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isInk = index % 2 === 1;

  const sequenceNum = String(index + 1).padStart(2, "0");
  const binaryString = toBits(index + 1)
    .map(Number)
    .join("");

  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      animate={{
        opacity: isInView || prefersReducedMotion ? 1 : 0,
        y: isInView || prefersReducedMotion ? 0 : 16,
      }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.6,
        ease: easeCurve,
        delay: prefersReducedMotion ? 0 : (index % 4) * 0.06,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative rounded-2xl border p-4 sm:p-5 md:p-6 min-h-[220px] sm:min-h-[260px] flex flex-col justify-between list-none overflow-hidden select-none",
        "transition-colors duration-200",
        isInk
          ? "theme-ink bg-background text-foreground border-border hover:border-foreground/40"
          : "bg-card text-foreground border-border hover:border-foreground/40"
      )}
    >
      {/* Background cropped DotPattern with 6px hover shift */}
      <div className="absolute -bottom-6 -right-6 w-[120px] h-[120px] pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="w-full h-full transition-transform duration-500 ease-out group-hover:translate-x-1.5 group-hover:-translate-y-1.5">
          <DotPattern
            bleed
            crop={{ col: (index * 2) % 5, row: (index * 2) % 5, cols: 3, rows: 3 }}
            tone={isInk ? "paper" : "ink"}
            showBlue={false}
            className="w-full h-full opacity-[0.08]"
          />
        </div>
      </div>

      {/* Top Row: BYTES 0n and 8-bit binary */}
      <div className="relative z-10 flex items-center justify-between label-mono text-xs text-muted-foreground">
        <span>BYTES {sequenceNum}</span>
        <span className="data-mono tabular-nums">
          <ScrambleText trigger={isHovered} characterSet="01">
            {binaryString}
          </ScrambleText>
        </span>
      </div>

      {/* Content Block */}
      <div className="relative z-10 mt-auto pt-6">
        <h3 className="font-mono text-xl sm:text-2xl md:text-3xl font-normal tracking-[-0.02em] lowercase text-foreground leading-tight m-0">
          <span>{item.term}</span>
          <Dot color="current" aria-hidden="true" />
        </h3>

        <p className="text-sm md:text-base text-muted-foreground mt-3 max-w-[34ch] leading-relaxed font-normal m-0">
          {item.definition}
        </p>
      </div>
    </motion.li>
  );
}

/**
 * Bytes Section: "One term, explained"
 *
 * Paper section providing an 8-card glossary alternating between Paper and Ink surfaces.
 *
 * Rules:
 * - data-nav-theme="paper"
 * - ZERO blue elements in this entire section (all dots current color, showBlue={false}).
 * - Binary scrambles once on hover with zero jitter.
 */
export function Bytes() {
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

  const { eyebrow, headline, lead } = RESEARCH_PAGE.bytes;

  return (
    <section
      ref={sectionRef}
      id="bytes"
      data-nav-theme="paper"
      aria-labelledby="bytes-title"
      className="bg-background text-foreground py-16 md:py-24 lg:py-32 relative"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-8">
        {/* Header Block */}
        <div ref={headerRef} className="max-w-xl mb-10 md:mb-12 lg:mb-16">
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
            id="bytes-title"
            className="text-[clamp(2rem,4.5vw,3.5rem)] font-medium tracking-[-0.03em] leading-[1.04] mt-4 sm:mt-5 text-foreground [overflow-wrap:anywhere]"
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
            className="text-base md:text-lg text-muted-foreground max-w-[520px] mt-6 leading-relaxed font-normal m-0"
          >
            {lead}
          </motion.p>
        </div>

        {/* 8-Card Grid */}
        <ul
          role="list"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 p-0 m-0 list-none"
        >
          {BYTES.map((item, index) => (
            <ByteCard
              key={item.term}
              item={item}
              index={index}
              isInView={isInView}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </ul>

        {/* Footer Note */}
        <div className="mt-10 text-center md:text-left">
          <span className="label-mono text-muted-foreground text-xs">
            New terms land with every post.
          </span>
        </div>
      </div>
    </section>
  );
}

export default Bytes;
