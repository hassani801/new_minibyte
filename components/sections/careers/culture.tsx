"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Dot } from "@/components/brand/dot";
import { ByteMark } from "@/components/brand/byte-mark";
import { WordsPullUp } from "@/components/ui/words-pull-up";
import { ScrambleText } from "@/components/ui/scramble-text";
import { CAREERS_PAGE, CULTURE, PERKS } from "@/lib/careers";
import { cn } from "@/lib/utils";

const easeCurve = [0.16, 1, 0.3, 1] as const;

interface CultureCardProps {
  index: number;
  title: string;
  text: string;
  isInView: boolean;
  prefersReducedMotion: boolean;
}

function CultureCard({
  index,
  title,
  text,
  isInView,
  prefersReducedMotion,
}: CultureCardProps) {
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
        delay: prefersReducedMotion ? 0 : (index % 4) * 0.06,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "bg-card border border-border rounded-2xl p-6 min-h-[200px] flex flex-col select-none",
        "transition-colors duration-200 [@media(hover:hover)]:hover:border-foreground/40"
      )}
    >
      {/* Top Row: ByteMark (mono, no blue) & 4-bit binary */}
      <div className="flex items-center justify-between gap-4">
        <ByteMark
          value={index + 1}
          tone="mono"
          blueLast={false}
          className="w-9 text-foreground"
          aria-hidden="true"
        />
        <span className="data-mono text-xs text-muted-foreground select-none">
          <ScrambleText trigger={isHovered} characterSet="01">
            {binaryIndex}
          </ScrambleText>
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-medium tracking-tight text-foreground mt-auto">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm md:text-base text-muted-foreground mt-2 leading-relaxed">
        {text}
      </p>
    </motion.div>
  );
}

/**
 * Culture section
 *
 * Left: Sticky intro with eyebrow, headline, lead.
 * Right: 2x2 culture cards grid + perks list.
 * Note: ZERO blue in this section.
 */
export function Culture() {
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
      id="culture"
      data-nav-theme="paper"
      aria-labelledby="culture-title"
      className="bg-background text-foreground py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1280px] w-full px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[4fr_8fr] gap-12 lg:gap-20 items-start">
          {/* LEFT: Sticky Introduction */}
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+48px)] self-start flex flex-col items-start">
            <div className="flex items-center gap-2 select-none">
              <span
                className="w-1.5 h-1.5 rounded-full bg-foreground shrink-0 inline-block"
                aria-hidden="true"
              />
              <span className="label-mono text-muted-foreground">
                {CAREERS_PAGE.culture.eyebrow}
              </span>
            </div>

            <h2
              id="culture-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground mt-6 leading-[1.1] text-balance"
            >
              <WordsPullUp
                text={CAREERS_PAGE.culture.headline}
                play={isInView}
                stagger={0.06}
                lastWordAddon={<Dot color="current" aria-hidden="true" />}
              />
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground mt-6 leading-relaxed max-w-[420px]">
              {CAREERS_PAGE.culture.lead}
            </p>
          </div>

          {/* RIGHT: Cards Grid + Perks */}
          <div className="flex flex-col w-full">
            {/* 2 x 2 Culture Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CULTURE.map((item, idx) => (
                <CultureCard
                  key={item.title}
                  index={idx}
                  title={item.title}
                  text={item.text}
                  isInView={isInView}
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
            </div>

            {/* Perks Block */}
            {PERKS.length > 0 && (
              <div className="mt-12">
                <h3 className="label-mono text-muted-foreground">PERKS</h3>
                <ul
                  role="list"
                  className="mt-4 grid grid-cols-1 sm:grid-cols-2 border-t border-border"
                >
                  {PERKS.map((perk, idx) => (
                    <motion.li
                      key={perk}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{
                        opacity: isInView || prefersReducedMotion ? 1 : 0,
                        y: isInView || prefersReducedMotion ? 0 : 16,
                      }}
                      transition={{
                        duration: prefersReducedMotion ? 0 : 0.6,
                        ease: easeCurve,
                        delay: prefersReducedMotion ? 0 : (idx % 4) * 0.06,
                      }}
                      className="py-3.5 text-sm md:text-base border-b border-border flex items-center gap-3 text-foreground"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-foreground shrink-0 inline-block"
                        aria-hidden="true"
                      />
                      <span>{perk}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Culture;
