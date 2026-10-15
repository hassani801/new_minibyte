"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Dot } from "@/components/brand/dot";
import { WordsPullUp } from "@/components/ui/words-pull-up";
import { ABOUT } from "@/lib/about";

const easeCurve = [0.16, 1, 0.3, 1] as const;

export function Story() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);

  const isInView = useInView(sectionRef, { once: true, margin: "-10% 0px" });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const { eyebrow, headline, paragraphs, facts } = ABOUT.story;

  return (
    <section
      ref={sectionRef}
      id="story"
      data-nav-theme="ink"
      aria-labelledby="story-title"
      className="theme-ink bg-background text-foreground py-24 lg:py-32 relative"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[4fr_8fr] gap-12 lg:gap-20 items-start">
          {/* LEFT: Sticky Narrative Intro */}
          <div
            ref={leftColRef}
            className="lg:sticky lg:top-[calc(var(--nav-h)+48px)] self-start flex flex-col items-start"
          >
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
                className="w-[6px] h-[6px] rounded-full bg-paper shrink-0 inline-block"
                aria-hidden="true"
              />
              <span className="label-mono text-muted-foreground">{eyebrow}</span>
            </motion.div>

            {/* H2 Headline: WordsPullUp + Bit Blue Dot (The ONE blue in this section) */}
            <h2
              id="story-title"
              className="text-[clamp(2.25rem,4.6vw,3.5rem)] font-medium tracking-[-0.03em] leading-[1.04] mt-5 text-foreground"
            >
              <WordsPullUp
                text={headline}
                play={isInView}
                delay={prefersReducedMotion ? 0 : 0.08}
                lastWordAddon={<Dot color="blue" aria-hidden="true" />}
              />
            </h2>
          </div>

          {/* RIGHT: Paragraphs and Spec Table */}
          <div className="flex flex-col items-start w-full">
            {/* Paragraph 1: Lead style */}
            {paragraphs[0] && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{
                  opacity: isInView || prefersReducedMotion ? 1 : 0,
                  y: isInView || prefersReducedMotion ? 0 : 16,
                }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.6,
                  ease: easeCurve,
                  delay: prefersReducedMotion ? 0 : 0.12,
                }}
                className="text-xl md:text-2xl leading-snug text-foreground font-normal m-0"
              >
                {paragraphs[0]}
              </motion.p>
            )}

            {/* Remaining paragraphs */}
            <div className="mt-6 space-y-6 max-w-[620px]">
              {paragraphs.slice(1).map((para, idx) => (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{
                    opacity: isInView || prefersReducedMotion ? 1 : 0,
                    y: isInView || prefersReducedMotion ? 0 : 16,
                  }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.6,
                    ease: easeCurve,
                    delay: prefersReducedMotion ? 0 : 0.2 + idx * 0.08,
                  }}
                  className="text-base md:text-lg text-muted-foreground leading-relaxed font-normal m-0"
                >
                  {para}
                </motion.p>
              ))}
            </div>

            {/* Spec Table */}
            <dl className="mt-12 w-full max-w-[620px] flex flex-col border-b border-border m-0">
              {facts.map((fact, idx) => (
                <motion.div
                  key={fact.label}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{
                    opacity: isInView || prefersReducedMotion ? 1 : 0,
                    y: isInView || prefersReducedMotion ? 0 : 14,
                  }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.6,
                    ease: easeCurve,
                    delay: prefersReducedMotion ? 0 : 0.35 + idx * 0.08,
                  }}
                  className="flex items-center justify-between py-4 border-t border-border"
                >
                  <dt className="data-mono text-sm text-muted-foreground">
                    {fact.label}
                  </dt>
                  <dd className="data-mono text-sm text-foreground font-normal tabular-nums">
                    {fact.value}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Story;
