"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Dot } from "@/components/brand/dot";
import { ByteMark } from "@/components/brand/byte-mark";
import { WordsPullUp } from "@/components/ui/words-pull-up";
import { CAREERS_PAGE, HIRING_STEPS } from "@/lib/careers";
import { cn } from "@/lib/utils";

const easeCurve = [0.16, 1, 0.3, 1] as const;

export function HiringProcess() {
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
      id="process"
      data-nav-theme="paper"
      aria-labelledby="process-title"
      className="bg-background text-foreground py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1280px] w-full px-6 md:px-8">
        {/* HEADER */}
        <div className="flex flex-col items-start max-w-[640px]">
          <div className="flex items-center gap-2 select-none">
            <span
              className="w-1.5 h-1.5 rounded-full bg-foreground shrink-0 inline-block"
              aria-hidden="true"
            />
            <span className="label-mono text-muted-foreground">
              {CAREERS_PAGE.process.eyebrow}
            </span>
          </div>

          <h2
            id="process-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground mt-4 leading-[1.1] text-balance"
          >
            <WordsPullUp
              text={CAREERS_PAGE.process.headline}
              play={isInView}
              stagger={0.06}
              lastWordAddon={<Dot color="current" aria-hidden="true" />}
            />
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground mt-6 leading-relaxed max-w-[520px]">
            {CAREERS_PAGE.process.lead}
          </p>
        </div>

        {/* STEPS WITH CONNECTOR */}
        <div className="relative mt-14 pt-4">
          {/* CONNECTOR (md and up) */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-0 left-0 right-0 pointer-events-none select-none"
          >
            {/* Horizontal Line: draws left to right */}
            <motion.div
              initial={{ scaleX: prefersReducedMotion ? 1 : 0 }}
              animate={{ scaleX: isInView || prefersReducedMotion ? 1 : 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 1.2,
                ease: easeCurve,
              }}
              className="h-[1px] bg-border origin-left w-full"
            />

            {/* 8px Ink dots popping as the line passes */}
            <div className="absolute inset-0 grid grid-cols-4 gap-4 -translate-y-[3.5px]">
              {HIRING_STEPS.map((_, i) => (
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

          {/* STEP CARDS */}
          <ol role="list" className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {HIRING_STEPS.map((step, idx) => {
              const stepNumber = idx + 1;
              const binaryNumber = stepNumber.toString(2).padStart(4, "0");

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
                    ease: easeCurve,
                    delay: prefersReducedMotion ? 0 : idx * 0.1,
                  }}
                  className={cn(
                    "bg-card border border-border rounded-2xl p-6 flex flex-col min-h-[260px] select-none",
                    "transition-colors duration-200 [@media(hover:hover)]:hover:border-foreground/40"
                  )}
                >
                  {/* Top Row: STEP 0n & 4-bit Binary */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="label-mono text-muted-foreground">
                      STEP 0{stepNumber}
                    </span>
                    <span className="data-mono text-muted-foreground">
                      {binaryNumber}
                    </span>
                  </div>

                  {/* ByteMark */}
                  <ByteMark
                    value={stepNumber}
                    tone="mono"
                    blueLast={false}
                    className="w-10 text-foreground mt-6"
                    aria-hidden="true"
                  />

                  {/* Step Title */}
                  <h3 className="text-xl font-medium tracking-tight text-foreground mt-6">
                    {step.name}
                  </h3>

                  {/* Step Text */}
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {step.text}
                  </p>

                  {/* Bottom: Duration metadata */}
                  <div className="mt-auto pt-5 border-t border-border flex items-center justify-between text-xs">
                    <span className="label-mono text-muted-foreground">
                      DURATION
                    </span>
                    <span className="data-mono text-foreground font-medium">
                      {step.duration}
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

export default HiringProcess;
