"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Dot } from "@/components/brand/dot";
import { DotPattern } from "@/components/brand/dot-pattern";
import { WordsPullUp } from "@/components/ui/words-pull-up";
import { TransitionLink } from "@/components/layout/transition-link";
import { CopyButton } from "@/components/ui/copy-button";
import { CONTACT, CTA_COPY } from "@/lib/constants";
import { cn } from "@/lib/utils";

const easeCurve = [0.16, 1, 0.3, 1] as const;

export interface FinalCtaProps {
  eyebrow?: string;
  headline?: string;
  sub?: string;
  primary?: {
    label: string;
    href: string;
  };
}

/**
 * FinalCTA Section
 *
 * Full Bit Blue section serving as the primary conversion point of the home and inner pages.
 * Features:
 * - Brand Bit Blue background (--bit-blue) with high-contrast White typography and tokens.
 * - DotPattern background anchored to the right with subtle scroll parallax.
 * - WordsPullUp headline followed by white Dot.
 * - Primary Ink button with interactive nudging icon.
 * - CopyButton with clipboard API, aria announcements, and mailto fallback.
 * - Toggles navbar to 'blue' data-nav-theme on scroll.
 */
export function FinalCta({
  eyebrow = CTA_COPY.eyebrow,
  headline = CTA_COPY.headline,
  sub = CTA_COPY.sub,
  primary = CTA_COPY.primary,
}: FinalCtaProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-20% 0px" });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const onMotionChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", onMotionChange);

    const isTouch =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0);
    setIsTouchDevice(isTouch);

    return () => media.removeEventListener("change", onMotionChange);
  }, []);

  // Scroll parallax for background DotPattern
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion || isTouchDevice ? ["0%", "0%"] : ["-6%", "6%"]
  );

  const hasExtraContactInfo = Boolean(CONTACT.phone || CONTACT.location);

  return (
    <section
      ref={sectionRef}
      id="contact-cta"
      data-nav-theme="blue"
      aria-labelledby="cta-title"
      className="theme-blue relative isolate overflow-hidden text-white min-h-[max(560px,80svh)] flex items-center"
      style={{ background: "var(--bit-blue)" }}
    >
      {/* BACKGROUND PATTERN WITH PARALLAX */}
      <motion.div
        aria-hidden="true"
        style={{
          y: parallaxY,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: inView || prefersReducedMotion ? 0.14 : 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 1.2,
          delay: 0,
          ease: "easeOut",
        }}
        className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
      >
        {/* Mobile tighter crop (cols 2-5, rows 2-5) */}
        <div className="md:hidden absolute inset-0 w-full h-full pointer-events-none">
          <DotPattern
            bleed
            crop={{ col: 2, row: 2, cols: 4, rows: 4 }}
            tone="mono"
            showBlue={false}
            className="w-full h-full text-white"
          />
        </div>

        {/* Desktop / tablet crop (cols 1-6, rows 1-6), anchored right & slightly oversized */}
        <div className="hidden md:block absolute inset-0 w-full h-full pointer-events-none lg:translate-x-[18%] lg:scale-[1.15] origin-right">
          <DotPattern
            bleed
            crop={{ col: 1, row: 1, cols: 6, rows: 6 }}
            tone="mono"
            showBlue={false}
            className="w-full h-full text-white"
          />
        </div>
      </motion.div>

      {/* FOREGROUND CONTENT */}
      <div className="relative z-10 container mx-auto w-full max-w-[1280px] px-6 md:px-8 py-24 lg:py-32 flex flex-col items-start">
        {/* Top Label Row: Eyebrow on left + 8-bit byte equation on right */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{
            opacity: inView || prefersReducedMotion ? 1 : 0,
            y: inView || prefersReducedMotion ? 0 : 14,
          }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.6,
            ease: easeCurve,
            delay: 0,
          }}
          className="w-full flex items-center justify-between select-none"
        >
          <div className="flex items-center gap-2">
            <span
              className="w-[6px] h-[6px] rounded-full bg-white shrink-0 inline-block"
              aria-hidden="true"
            />
            <span className="label-mono text-[var(--cta-fg-muted)]">
              {eyebrow}
            </span>
          </div>

          <span className="hidden md:block label-mono text-[var(--cta-fg-muted)] tabular-nums">
            {CTA_COPY.byteLine}
          </span>
        </motion.div>

        {/* H2 Headline: WordsPullUp + White Dot */}
        <h2
          id="cta-title"
          className="text-[clamp(2.75rem,8vw,6.5rem)] font-medium tracking-[-0.035em] leading-[0.98] mt-7 text-balance md:max-w-[14ch] text-white"
        >
          <WordsPullUp
            text={headline}
            play={inView}
            delay={prefersReducedMotion ? 0 : 0.1}
            stagger={0.08}
            lastWordAddon={<Dot color="current" aria-hidden="true" />}
          />
        </h2>

        {/* Subcopy */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{
            opacity: inView || prefersReducedMotion ? 1 : 0,
            y: inView || prefersReducedMotion ? 0 : 14,
          }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.6,
            ease: easeCurve,
            delay: prefersReducedMotion ? 0 : 0.55,
          }}
          className="text-base md:text-lg max-w-[460px] text-[var(--cta-fg-muted)] mt-7 leading-relaxed font-normal"
        >
          {sub}
        </motion.p>

        {/* Actions Row */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{
            opacity: inView || prefersReducedMotion ? 1 : 0,
            y: inView || prefersReducedMotion ? 0 : 14,
          }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.6,
            ease: easeCurve,
            delay: prefersReducedMotion ? 0 : 0.7,
          }}
          className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto"
        >
          {/* Primary CTA Button */}
          {primary.href.startsWith("mailto:") ||
          primary.href.startsWith("tel:") ||
          primary.href.startsWith("http:") ||
          primary.href.startsWith("https:") ? (
            <a
              href={primary.href}
              className={cn(
                "h-14 px-7 rounded-full inline-flex items-center justify-between sm:justify-start gap-4",
                "bg-ink text-paper text-base font-medium select-none",
                "transition-all duration-200 group w-full sm:w-auto",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bit-blue)]",
                "active:scale-[0.98] [@media(hover:hover)]:hover:-translate-y-px"
              )}
            >
              <span>{primary.label}</span>
              <span
                aria-hidden="true"
                className="w-8 h-8 rounded-full bg-paper text-ink grid place-items-center shrink-0 transition-transform duration-200 group-hover:translate-x-[3px]"
              >
                <ArrowRight className="w-[18px] h-[18px]" />
              </span>
            </a>
          ) : (
            <TransitionLink
              href={primary.href}
              className={cn(
                "h-14 px-7 rounded-full inline-flex items-center justify-between sm:justify-start gap-4",
                "bg-ink text-paper text-base font-medium select-none",
                "transition-all duration-200 group w-full sm:w-auto",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bit-blue)]",
                "active:scale-[0.98] [@media(hover:hover)]:hover:-translate-y-px"
              )}
            >
              <span>{primary.label}</span>
              <span
                aria-hidden="true"
                className="w-8 h-8 rounded-full bg-paper text-ink grid place-items-center shrink-0 transition-transform duration-200 group-hover:translate-x-[3px]"
              >
                <ArrowRight className="w-[18px] h-[18px]" />
              </span>
            </TransitionLink>
          )}

          {/* Copy Email Button */}
          <CopyButton
            value={CONTACT.email}
            label={CONTACT.email}
            copiedLabel={CTA_COPY.copiedLabel}
            className="w-full sm:w-auto"
          />

          {/* Hidden mailto fallback for screen readers and no-JS */}
          <a href={`mailto:${CONTACT.email}`} className="sr-only">
            Email us directly at {CONTACT.email}
          </a>
        </motion.div>

        {/* Optional Secondary Contact Strip (rendered only if phone or location set) */}
        {hasExtraContactInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: inView || prefersReducedMotion ? 1 : 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.5,
              delay: prefersReducedMotion ? 0 : 0.85,
            }}
            className="mt-5 flex items-center gap-3 text-[var(--cta-fg-muted)] label-mono text-xs select-none"
          >
            {CONTACT.phone && <span>{CONTACT.phone}</span>}
            {CONTACT.phone && CONTACT.location && (
              <span className="w-px h-3 bg-[var(--cta-line)]" aria-hidden="true" />
            )}
            {CONTACT.location && <span>{CONTACT.location}</span>}
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default FinalCta;
