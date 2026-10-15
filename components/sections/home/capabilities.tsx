"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Dot } from "@/components/brand/dot";
import { WordsPullUp } from "@/components/ui/words-pull-up";
import { UnderlineLink } from "@/components/ui/underline-link";
import { CapabilityRow } from "@/components/sections/home/capability-row";
import { CAPABILITIES, CAPABILITIES_COPY } from "@/lib/constants";

const easeCurve = [0.16, 1, 0.3, 1] as const;

/**
 * Capabilities Section
 *
 * Full Ink section with a sticky intro on the left and a list of 5 capability rows
 * on the right. Each row features a ByteMark icon (the binary of its 1-based index),
 * an 8-bit binary readout that scrambles on hover, title, description, tags, and
 * links to the Services page.
 *
 * Rule: Exactly ONE Bit Blue element in the section: the Dot after the headline.
 */
export function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);

  const isLeftInView = useInView(leftColRef, {
    once: true,
    margin: "-15% 0px",
  });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const countPadded = String(CAPABILITIES.length).padStart(2, "0");

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      data-nav-theme="ink"
      aria-labelledby="capabilities-title"
      className="theme-ink bg-background text-foreground"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-8 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-[4fr_8fr] gap-12 lg:gap-20 items-start">
          {/* LEFT COLUMN: Sticky Narrative Intro */}
          <div
            ref={leftColRef}
            className="lg:sticky lg:top-[calc(var(--nav-h)+48px)] self-start flex flex-col items-start max-w-xl"
          >
            {/* Eyebrow: 6px Paper Dot (not blue) + label-mono */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{
                opacity: isLeftInView || prefersReducedMotion ? 1 : 0,
                y: isLeftInView || prefersReducedMotion ? 0 : 14,
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.6,
                ease: easeCurve,
                delay: prefersReducedMotion ? 0 : 0,
              }}
              className="flex items-center gap-2 select-none"
            >
              <span
                className="w-[6px] h-[6px] rounded-full bg-paper shrink-0 inline-block"
                aria-hidden="true"
              />
              <span className="label-mono text-muted-foreground">
                {CAPABILITIES_COPY.eyebrow}
              </span>
            </motion.div>

            {/* H2 Headline: WordsPullUp + Bit Blue Dot (the ONE blue element in this section) */}
            <h2
              id="capabilities-title"
              className="text-[clamp(2.25rem,4.6vw,3.5rem)] font-medium tracking-[-0.03em] leading-[1.04] mt-5 text-foreground"
            >
              <WordsPullUp
                text={CAPABILITIES_COPY.headline}
                play={isLeftInView}
                delay={prefersReducedMotion ? 0 : 0.08}
                lastWordAddon={<Dot color="blue" />}
              />
            </h2>

            {/* Lead Copy */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{
                opacity: isLeftInView || prefersReducedMotion ? 1 : 0,
                y: isLeftInView || prefersReducedMotion ? 0 : 14,
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.6,
                ease: easeCurve,
                delay: prefersReducedMotion ? 0 : 0.16,
              }}
              className="text-base md:text-lg text-muted-foreground max-w-[380px] mt-6 leading-relaxed font-normal"
            >
              {CAPABILITIES_COPY.lead}
            </motion.p>

            {/* CTA Link: UnderlineLink with lucide ArrowRight */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{
                opacity: isLeftInView || prefersReducedMotion ? 1 : 0,
                y: isLeftInView || prefersReducedMotion ? 0 : 14,
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.6,
                ease: easeCurve,
                delay: prefersReducedMotion ? 0 : 0.24,
              }}
              className="mt-8"
            >
              <UnderlineLink
                href={CAPABILITIES_COPY.cta.href}
                className="px-0 h-auto inline-flex items-center gap-1.5"
                underlineClassName="bottom-0 inset-x-0"
              >
                <span>{CAPABILITIES_COPY.cta.label}</span>
                <ArrowRight className="w-4 h-4 ml-1 inline shrink-0" />
              </UnderlineLink>
            </motion.div>

            {/* Desktop Counter Strip */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{
                opacity: isLeftInView || prefersReducedMotion ? 1 : 0,
                y: isLeftInView || prefersReducedMotion ? 0 : 14,
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.6,
                ease: easeCurve,
                delay: prefersReducedMotion ? 0 : 0.32,
              }}
              className="hidden lg:block mt-12 data-mono text-muted-foreground select-none"
            >
              {`${countPadded} capabilities · 8 bits each`}
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Capabilities List */}
          <div className="w-full">
            <ul role="list" className="border-t border-border">
              {CAPABILITIES.map((capability, index) => (
                <CapabilityRow
                  key={capability.slug}
                  item={capability}
                  index={index}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Capabilities;
