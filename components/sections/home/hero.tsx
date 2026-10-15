"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SonarGrid } from "@/components/ui/sonar-grid";
import { WordsPullUp } from "@/components/ui/words-pull-up";
import { ScrambleText } from "@/components/ui/scramble-text";
import { Dot } from "@/components/brand/dot";
import { TransitionLink } from "@/components/layout/transition-link";
import { UnderlineLink } from "@/components/ui/underline-link";
import { usePageReady } from "@/lib/transition";
import { HOME_HERO } from "@/lib/constants";
import { cn } from "@/lib/utils";


const easeCurve = [0.16, 1, 0.3, 1] as const;

/**
 * Home Page Hero Component
 *
 * Full-screen Ink section featuring:
 * - SonarGrid canvas dot-field background that responds to taps/clicks with expanding wavefronts
 * - Legibility scrim to keep headline crisp against background rings
 * - Scrambling eyebrow, masked word-by-word headline reveal ending with the brand Bit Blue dot
 * - Interactive CTAs with hover translation & directional underline drawing
 * - Bottom informational strip with brand ASCII byte indicator
 */
export function Hero() {
  const [ready, setReady] = useState(false);
  const [spacing, setSpacing] = useState(26);
  const [hintText, setHintText] = useState<string>(HOME_HERO.hint.desktop);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);

  // Intro sequence triggers when the curtain/preloader has finished lifting
  usePageReady(() => {
    setReady(true);
  });

  // Responsive spacing and pointer media query listener
  useEffect(() => {
    const checkViewport = () => {
      setSpacing(window.innerWidth < 640 ? 22 : 26);
    };

    const checkPointer = () => {
      const isCoarse = window.matchMedia("(pointer: coarse)").matches;
      setHintText(isCoarse ? HOME_HERO.hint.touch : HOME_HERO.hint.desktop);
    };

    const checkReduced = () => {
      setIsReducedMotion(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    };

    checkViewport();
    checkPointer();
    checkReduced();

    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // 0.30s: Programmatically emit the initial ping to demonstrate the canvas field
  useEffect(() => {
    if (!ready || isReducedMotion) return;

    const timer = setTimeout(() => {
      if (gridRef.current) {
        try {
          const rect = gridRef.current.getBoundingClientRect();
          const clientX = rect.left + rect.width * 0.5;
          const clientY = rect.top + rect.height * 0.42;

          gridRef.current.dispatchEvent(
            new PointerEvent("pointerdown", {
              clientX,
              clientY,
              bubbles: true,
            })
          );
        } catch {
          // pointerdown fallback handled silently
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [ready, isReducedMotion]);

  return (
    <SonarGrid
      ref={gridRef}
      id="hero"
      data-nav-theme="ink"
      aria-label="Introduction"
      spacing={spacing}
      dotRadius={1.4}
      baseOpacity={0.2}
      pingEvery={2.2}
      speed={240}
      ringWidth={110}
      amplitude={1.8}
      interactive={true}
      maxRings={5}
      seedPing={false}
      pingArea={[0.18, 0.2, 0.82, 0.8]}
      className="theme-ink bg-background text-foreground flex flex-col min-h-[max(640px,100svh)] w-full relative"
    >
      {/* Functional Legibility Scrim */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-85 select-none"
        style={{
          background:
            "radial-gradient(ellipse 40% 34% at 50% 50%, var(--background) 0%, transparent 100%)",
        }}
      />

      {/* Main Hero Content Wrapper */}
      <div className="relative z-10 mx-auto w-full max-w-[1280px] flex-1 flex flex-col items-center justify-center text-center px-6 md:px-8 pt-[calc(var(--nav-h)+24px)] pb-24">
        {/* Eyebrow: 0.00s fade-in & scramble */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: ready || isReducedMotion ? 1 : 0 }}
          transition={{ duration: 0.5, ease: easeCurve }}
          className="flex items-center gap-2 mb-6 select-none"
        >
          <span
            className="w-1.5 h-1.5 rounded-full bg-paper shrink-0 inline-block"
            aria-hidden="true"
          />
          <ScrambleText
            as="p"
            characterSet="01"
            trigger={ready}
            className="label-mono text-muted-foreground"
          >
            {HOME_HERO.eyebrow}
          </ScrambleText>
        </motion.div>

        {/* H1 Headline: 0.10s & 0.22s word-by-word masked pull up */}
        <h1 className="text-display font-medium tracking-[-0.03em] leading-[0.98] text-balance text-foreground text-[clamp(2.75rem,9vw,6.5rem)] flex flex-col items-center">
          <WordsPullUp
            text={HOME_HERO.headline[0]}
            play={ready || isReducedMotion}
            delay={0.1}
            stagger={0.08}
            className="block"
          />
          <WordsPullUp
            text={HOME_HERO.headline[1]}
            play={ready || isReducedMotion}
            delay={0.22}
            stagger={0.08}
            className="block"
            lastWordAddon={<Dot color="blue" />}
          />
        </h1>

        {/* Subline: 0.55s fade & slide */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{
            opacity: ready || isReducedMotion ? 1 : 0,
            y: ready || isReducedMotion ? 0 : 14,
          }}
          transition={{ duration: 0.7, ease: easeCurve, delay: 0.55 }}
          className="max-w-[560px] text-muted-foreground text-base md:text-lg leading-relaxed mt-7"
        >
          {HOME_HERO.subline}
        </motion.p>

        {/* CTAs: 0.68s entry */}
        <div className="mt-10 flex flex-wrap justify-center gap-3 w-full sm:w-auto">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{
              opacity: ready || isReducedMotion ? 1 : 0,
              y: ready || isReducedMotion ? 0 : 14,
            }}
            transition={{ duration: 0.7, ease: easeCurve, delay: 0.68 }}
            className="w-full sm:w-auto flex justify-center"
          >
            <TransitionLink
              href={HOME_HERO.primary.href}
              className="h-12 px-6 rounded-full inline-flex items-center gap-3 bg-primary text-primary-foreground font-medium text-sm group transition-all duration-200 hover:-translate-y-px active:scale-[0.98] w-full sm:w-auto justify-center select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span>{HOME_HERO.primary.label}</span>
              <span
                className="w-7 h-7 bg-background text-foreground rounded-full grid place-items-center shrink-0 transition-transform duration-200 group-hover:translate-x-[3px]"
                aria-hidden="true"
              >
                <ArrowRight className="w-4 h-4" />
              </span>
            </TransitionLink>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{
              opacity: ready || isReducedMotion ? 1 : 0,
              y: ready || isReducedMotion ? 0 : 14,
            }}
            transition={{ duration: 0.7, ease: easeCurve, delay: 0.76 }}
            className="w-full sm:w-auto flex justify-center"
          >
            <UnderlineLink href={HOME_HERO.secondary.href}>
              {HOME_HERO.secondary.label}
            </UnderlineLink>
          </motion.div>
        </div>


        {/* Ambient ping hint: 0.85s entry */}
        {!isReducedMotion && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: 0.6, ease: easeCurve, delay: 0.85 }}
            className="mt-9 label-mono text-muted-foreground text-xs select-none"
          >
            {hintText}
          </motion.p>
        )}
      </div>

      {/* Bottom Info Strip: 0.85s entry */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready || isReducedMotion ? 1 : 0 }}
        transition={{ duration: 0.7, ease: easeCurve, delay: 0.85 }}
        className="absolute bottom-0 inset-x-0 z-10 border-t border-border bg-transparent max-[560px]:static max-[560px]:mt-12"
      >
        <div className="relative mx-auto max-w-[1280px] px-6 md:px-8">
          {/* Brand byte static readout positioned above the right of the strip */}
          <div
            className="hidden md:block absolute right-8 bottom-full mb-3 select-none pointer-events-none data-mono text-xs text-muted-foreground"
            aria-hidden="true"
          >
            01101101 = m
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {HOME_HERO.points.map((point, index) => {
              const numStr = String(index + 1).padStart(2, "0");
              const isCell3 = index === 2;

              return (
                <div
                  key={index}
                  className={cn(
                    "py-4 md:py-5 flex items-center gap-3 border-border md:[&:not(:first-child)]:border-l md:pl-6",
                    isCell3 && "hidden sm:flex md:flex"
                  )}
                >
                  <span className="label-mono text-muted-foreground select-none shrink-0">
                    {numStr}
                  </span>
                  <span className="text-sm text-muted-foreground font-normal leading-snug text-left">
                    {point}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </SonarGrid>
  );
}

export default Hero;
