"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Dot } from "@/components/brand/dot";
import { ByteMark } from "@/components/brand/byte-mark";
import { WordsPullUp } from "@/components/ui/words-pull-up";
import { UnderlineLink } from "@/components/ui/underline-link";
import { CAPABILITIES, type Capability } from "@/lib/constants";
import { SERVICE_DETAILS, SERVICES_PAGE } from "@/lib/services";
import { cn } from "@/lib/utils";

const easeCurve = [0.16, 1, 0.3, 1] as const;

interface ServiceArticleProps {
  capability: Capability;
  index: number;
  prefersReducedMotion: boolean;
}

function ServiceArticle({
  capability,
  index,
  prefersReducedMotion,
}: ServiceArticleProps) {
  const articleRef = useRef<HTMLElement>(null);
  const isRevealed = useInView(articleRef, { once: true, margin: "-10% 0px" });
  const isActive = useInView(articleRef, { margin: "-45% 0px -45% 0px" });

  const details = SERVICE_DETAILS[capability.slug];
  const binaryString = (index + 1).toString(2).padStart(8, "0");
  const serviceIndexStr = `SERVICE 0${index + 1}`;

  return (
    <motion.article
      ref={articleRef}
      id={capability.slug}
      aria-labelledby={`${capability.slug}-title`}
      style={{ scrollMarginTop: "calc(var(--nav-h) + 24px)" }}
      initial={{ opacity: 0, y: 24 }}
      animate={{
        opacity: isRevealed || prefersReducedMotion ? 1 : 0,
        y: isRevealed || prefersReducedMotion ? 0 : 24,
      }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.8,
        ease: easeCurve,
      }}
      className="border-t border-border py-12 md:py-16 first:border-t-0"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[4fr_8fr] gap-8 lg:gap-16 items-start">
        {/* LEFT: Sticky metadata & title */}
        <div className="lg:sticky lg:top-[calc(var(--nav-h)+32px)] self-start flex flex-col items-start">
          {/* ByteMark Icon (turns text-foreground when active in viewport middle) */}
          <div
            className={cn(
              "w-14 transition-colors duration-300",
              isActive ? "text-foreground" : "text-muted-foreground"
            )}
          >
            <ByteMark
              value={index + 1}
              tone="mono"
              blueLast={false}
              className="w-14"
              aria-hidden="true"
            />
          </div>

          {/* 8-bit binary & Service index label */}
          <div className="flex items-center gap-3 mt-3">
            <span className="data-mono text-xs text-muted-foreground tabular-nums">
              {binaryString}
            </span>
            <span className="w-1 h-1 rounded-full bg-border" aria-hidden="true" />
            <span className="label-mono text-xs text-muted-foreground">
              {serviceIndexStr}
            </span>
          </div>

          {/* H3 Title */}
          <h3
            id={`${capability.slug}-title`}
            className="text-2xl md:text-3xl font-medium tracking-[-0.02em] text-foreground mt-4 leading-tight focus-visible:outline-none"
          >
            {capability.title}
          </h3>

          {/* Tags Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {capability.tags.map((tag) => (
              <span
                key={tag}
                className="label-mono text-[11px] px-2.5 py-1 rounded-full border border-border text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT: Summary, Deliverables & Fit Lists, Format row */}
        <div className="flex flex-col items-start w-full">
          {/* Summary */}
          <p className="text-lg md:text-xl leading-snug text-foreground max-w-[620px] font-normal m-0">
            {details.summary}
          </p>

          {/* 2-Column Grid: Deliverables and Good Fit When */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-10">
            {/* Deliverables List */}
            <div className="flex flex-col">
              <span className="label-mono text-xs text-muted-foreground">
                DELIVERABLES
              </span>
              <ul
                role="list"
                className="mt-4 p-0 divide-y divide-border border-y border-border list-none"
              >
                {details.deliverables.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: isRevealed || prefersReducedMotion ? 1 : 0,
                      y: isRevealed || prefersReducedMotion ? 0 : 10,
                    }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.4,
                      delay: prefersReducedMotion ? 0 : 0.2 + i * 0.05,
                    }}
                    className="flex items-start gap-3 py-3 text-sm md:text-base text-foreground leading-relaxed"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 shrink-0 mt-2"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Good Fit When List */}
            <div className="flex flex-col">
              <span className="label-mono text-xs text-muted-foreground">
                GOOD FIT WHEN
              </span>
              <ul
                role="list"
                className="mt-4 p-0 divide-y divide-border border-y border-border list-none"
              >
                {details.fitWhen.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: isRevealed || prefersReducedMotion ? 1 : 0,
                      y: isRevealed || prefersReducedMotion ? 0 : 10,
                    }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.4,
                      delay: prefersReducedMotion ? 0 : 0.25 + i * 0.05,
                    }}
                    className="flex items-start gap-3 py-3 text-sm md:text-base text-foreground leading-relaxed"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 shrink-0 mt-2"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Format Row with Contact Link */}
          <div className="mt-8 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-border">
            <div className="flex items-center gap-3">
              <span className="label-mono text-xs text-muted-foreground">
                FORMAT
              </span>
              <span className="data-mono text-[13px] text-foreground">
                {details.format}
              </span>
            </div>

            <UnderlineLink
              href={`/contact?topic=${capability.slug}`}
              className="text-sm font-medium"
            >
              Discuss this
            </UnderlineLink>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/**
 * ServiceDetail Section
 *
 * Ink section listing detailed breakdowns of all 5 research & engineering capabilities.
 *
 * Rules:
 * - data-nav-theme="ink", className "theme-ink bg-background text-foreground"
 * - The section's ONLY blue element is the H2 headline Dot.
 * - Active state tracking highlights the current service's ByteMark in view.
 */
export function ServiceDetail() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const isHeaderInView = useInView(headerRef, { once: true, margin: "-10% 0px" });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const { eyebrow, headline } = SERVICES_PAGE.detail;

  return (
    <section
      ref={sectionRef}
      id="services-detail"
      data-nav-theme="ink"
      aria-labelledby="services-detail-title"
      className="theme-ink bg-background text-foreground py-24 lg:py-32 relative"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        {/* Header Row */}
        <div ref={headerRef} className="max-w-xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{
              opacity: isHeaderInView || prefersReducedMotion ? 1 : 0,
              y: isHeaderInView || prefersReducedMotion ? 0 : 14,
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

          <h2
            id="services-detail-title"
            className="text-[clamp(2.25rem,4.6vw,3.5rem)] font-medium tracking-[-0.03em] leading-[1.04] mt-5 text-foreground"
          >
            <WordsPullUp
              text={headline}
              play={isHeaderInView}
              delay={prefersReducedMotion ? 0 : 0.08}
              lastWordAddon={<Dot color="blue" aria-hidden="true" />}
            />
          </h2>
        </div>

        {/* 5 Capability Articles */}
        <div className="flex flex-col">
          {CAPABILITIES.map((capability, index) => (
            <ServiceArticle
              key={capability.slug}
              capability={capability}
              index={index}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
