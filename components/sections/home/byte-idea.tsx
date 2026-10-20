"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import dynamic from "next/dynamic";
import { WordsPullUp } from "@/components/ui/words-pull-up";
import { Dot } from "@/components/brand/dot";
import { BYTE_IDEA } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ByteFoldDiagram = dynamic(
  () =>
    import("@/components/sections/home/byte-fold-diagram").then(
      (m) => m.ByteFoldDiagram
    ),
  { ssr: false }
);

const easeCurve = [0.16, 1, 0.3, 1] as const;

/**
 * ByteIdea Section: "One byte spells m."
 *
 * Paper section explaining how 8 dots representing ASCII 'm' (01101101)
 * fold in half to form the minibyte logo mark.
 */
export function ByteIdea() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);

  const [captionsVisible, setCaptionsVisible] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);

  // Trigger left column headline and points reveal when section enters view
  const isLeftInView = useInView(leftColRef, {
    once: true,
    margin: "-15% 0px",
  });

  return (
    <section
      ref={sectionRef}
      id="byte-idea"
      data-nav-theme="paper"
      aria-labelledby="byte-idea-title"
      className="bg-background text-foreground overflow-visible relative"
    >
      <div
        ref={wrapperRef}
        className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-8 py-16 md:py-24 lg:py-32 min-h-0 lg:min-h-[calc(100svh-var(--nav-h))] flex items-center w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-10 lg:gap-16 items-start w-full">
          {/* LEFT COLUMN: Editorial Narrative */}
          <div ref={leftColRef} className="flex flex-col items-start max-w-xl">
            {/* Eyebrow: blue accent, no dot */}
            <div className="label-eyebrow mb-4 sm:mb-5 select-none">
              {BYTE_IDEA.eyebrow}
            </div>

            {/* H2 Headline: bolder, tighter, fluid clamp */}
            <h2
              id="byte-idea-title"
              className="text-[clamp(2rem,4.5vw,3.5rem)] font-semibold tracking-[-0.03em] leading-[1.06] mt-0 text-foreground"
            >
              <WordsPullUp
                text={BYTE_IDEA.headline}
                play={isLeftInView}
                lastWordAddon={<Dot color="current" />}
              />
            </h2>

            {/* Lead Paragraph with tabular mono binary code */}
            <p className="text-lg md:text-xl max-w-[440px] mt-6 text-foreground leading-relaxed">
              In every computer, the letter m is stored as{" "}
              <span className="data-mono font-medium text-foreground px-1 py-0.5 bg-muted rounded">
                01101101
              </span>
              .
            </p>

            {/* Key Bullet Points */}
            <ul className="mt-7 space-y-3.5">
              {BYTE_IDEA.points.map((point, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{
                    opacity: isLeftInView ? 1 : 0,
                    y: isLeftInView ? 0 : 12,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: easeCurve,
                    delay: 0.2 + index * 0.08,
                  }}
                  className="flex items-start gap-3 text-base text-muted-foreground leading-normal"
                >
                  <span
                    className="w-1 h-1 rounded-full bg-muted-foreground shrink-0 inline-block mt-[0.55em]"
                    aria-hidden="true"
                  />
                  <span>{point}</span>
                </motion.li>
              ))}
            </ul>

            {/* Secondary CTA */}
            <div className="mt-8">
              <a
                href={BYTE_IDEA.cta.href}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors group"
              >
                <span>{BYTE_IDEA.cta.label}</span>
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: The Folding Diagram Card & Captions */}
          <div className="flex flex-col w-full">
            {/* Diagram Card Container */}
            <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 md:p-10 relative w-full">
              {/* Card Header Row */}
              <div className="flex items-center justify-between select-none border-b border-border/50 pb-4 mb-4 sm:mb-6">
                <span className="label-mono text-muted-foreground">
                  {BYTE_IDEA.cardLabel}
                </span>
                <span className="label-mono text-muted-foreground font-mono">
                  03
                </span>
              </div>

              {/* Card Title */}
              <h3 className="text-xl sm:text-2xl md:text-3xl font-normal tracking-[-0.02em] text-foreground mb-4 sm:mb-6">
                {BYTE_IDEA.cardTitle}
              </h3>

              {/* Animated SVG Diagram */}
              <ByteFoldDiagram
                sectionRef={sectionRef}
                wrapperRef={wrapperRef}
                onCaptionsChange={setCaptionsVisible}
                onScrollHintChange={setShowScrollHint}
              />

              {/* Desktop Scroll Hint */}
              <div
                className={cn(
                  "hidden lg:block text-center mt-3 label-mono text-muted-foreground text-[11px] select-none transition-opacity duration-300",
                  showScrollHint ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
              >
                SCROLL TO FOLD
              </div>
            </div>

            {/* 3 Captions Row */}
            <div className="mt-8 pt-6 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-6">
              {BYTE_IDEA.captions.map((caption, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: captionsVisible ? 1 : 0,
                    y: captionsVisible ? 0 : 10,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: easeCurve,
                    delay: index * 0.08,
                  }}
                  className="space-y-1.5"
                >
                  <div className="data-mono text-sm font-medium text-foreground">
                    {caption.term}
                  </div>
                  <p className="text-[13px] leading-[20px] text-muted-foreground font-normal">
                    {caption.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ByteIdea;
