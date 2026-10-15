"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Dot } from "@/components/brand/dot";
import { ByteMark } from "@/components/brand/byte-mark";
import { WordsPullUp } from "@/components/ui/words-pull-up";
import { CONTACT_PAGE, NEXT_STEPS } from "@/lib/contact";

const easeCurve = [0.16, 1, 0.3, 1] as const;

export function NextSteps() {
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
      id="next-steps"
      data-nav-theme="paper"
      aria-labelledby="next-title"
      className="bg-background text-foreground py-24 lg:py-32 select-text"
    >
      <div className="mx-auto max-w-[1280px] w-full px-6 md:px-8">
        {/* Header: Eyebrow, H2 (WordsPullUp + Current Color Dot), Lead */}
        <div className="flex flex-col items-start max-w-[720px]">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 select-none">
            <span
              className="w-1.5 h-1.5 rounded-full bg-foreground shrink-0 inline-block"
              aria-hidden="true"
            />
            <span className="label-mono text-muted-foreground">
              {CONTACT_PAGE.next.eyebrow}
            </span>
          </div>

          {/* H2 Headline: Strictly NO blue dots (use color="current") */}
          <h2
            id="next-title"
            className="text-[clamp(2.25rem,5vw,3.75rem)] font-medium tracking-[-0.035em] leading-[1.05] mt-6 text-foreground text-balance"
          >
            <WordsPullUp
              text={CONTACT_PAGE.next.headline}
              play={isInView}
              stagger={0.08}
              lastWordAddon={<Dot color="current" aria-hidden="true" />}
            />
          </h2>

          {/* Lead */}
          <p className="text-base sm:text-lg text-muted-foreground mt-6 leading-relaxed max-w-[520px]">
            {CONTACT_PAGE.next.lead}
          </p>
        </div>

        {/* Steps container with animated connector */}
        <div className="relative mt-14 pt-4">
          {/* CONNECTOR (md and up: draws left to right once in view, no blue) */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-0 left-0 right-0 pointer-events-none select-none"
          >
            {/* Horizontal Line */}
            <motion.div
              initial={{ scaleX: prefersReducedMotion ? 1 : 0 }}
              animate={{ scaleX: isInView || prefersReducedMotion ? 1 : 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 1.2,
                ease: easeCurve,
              }}
              className="h-[1px] bg-border origin-left w-full"
            />

            {/* Indicator dots along line */}
            <div className="absolute inset-0 grid grid-cols-3 gap-4 -translate-y-[3.5px]">
              {NEXT_STEPS.map((_, i) => (
                <div key={i} className="relative">
                  <motion.div
                    initial={{ scale: prefersReducedMotion ? 1 : 0 }}
                    animate={{ scale: isInView || prefersReducedMotion ? 1 : 0 }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.4,
                      delay: prefersReducedMotion ? 0 : 0.2 + i * 0.25,
                      ease: easeCurve,
                    }}
                    className="w-2 h-2 rounded-full bg-foreground shrink-0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Step Cards List */}
          <ol
            role="list"
            className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {NEXT_STEPS.map((step, idx) => {
              const stepNumber = idx + 1;
              const binaryIndex = stepNumber.toString(2).padStart(4, "0");

              return (
                <motion.li
                  key={step.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{
                    opacity: isInView || prefersReducedMotion ? 1 : 0,
                    y: isInView || prefersReducedMotion ? 0 : 16,
                  }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.6,
                    delay: prefersReducedMotion ? 0 : idx * 0.1,
                    ease: easeCurve,
                  }}
                  className="bg-card border border-border rounded-2xl p-6 min-h-[240px] flex flex-col transition-colors duration-200 [@media(hover:hover)]:hover:border-foreground/40"
                >
                  {/* Top row: STEP 0n and 4-bit binary */}
                  <div className="flex items-center justify-between w-full select-none">
                    <span className="label-mono text-muted-foreground">
                      STEP 0{stepNumber}
                    </span>
                    <span className="data-mono text-muted-foreground">
                      {binaryIndex}
                    </span>
                  </div>

                  {/* ByteMark: tone="mono", blueLast=false, w-10 mt-6 */}
                  <div className="mt-6 text-foreground">
                    <ByteMark
                      value={stepNumber}
                      tone="mono"
                      blueLast={false}
                      className="w-10"
                      aria-hidden="true"
                    />
                  </div>

                  {/* Step Name */}
                  <h3 className="text-xl font-medium tracking-tight text-foreground mt-6">
                    {step.name}
                  </h3>

                  {/* Step Description */}
                  <p className="text-sm md:text-base text-muted-foreground mt-2 leading-relaxed">
                    {step.text}
                  </p>

                  {/* Bottom: WHEN label + time */}
                  <div className="mt-auto pt-5 border-t border-border flex items-center justify-between text-xs select-none">
                    <span className="label-mono text-muted-foreground">WHEN</span>
                    <span className="data-mono text-foreground font-medium">
                      {step.time}
                    </span>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default NextSteps;
