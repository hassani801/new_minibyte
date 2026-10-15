"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Dot } from "@/components/brand/dot";
import { WordsPullUp } from "@/components/ui/words-pull-up";
import { UnderlineLink } from "@/components/ui/underline-link";
import { ProjectCard } from "@/components/sections/home/project-card";
import { FEATURED_PROJECTS } from "@/lib/projects";
import { WORK_COPY } from "@/lib/constants";
import { cn } from "@/lib/utils";

const easeCurve = [0.16, 1, 0.3, 1] as const;

/**
 * SelectedWork Section: "Built, measured, delivered."
 *
 * Paper section featuring a responsive header row and a 3-card spec-sheet grid
 * of featured engineering and research projects.
 *
 * Rules:
 * - data-nav-theme="paper" to ensure navbar flips to light theme over this section.
 * - Max ONE blue element in this section (exclusively the last dot of the first card's DotPattern).
 * - On md (768px), the third card spans both columns (2-col grid).
 * - "All projects" CTA sits in header on desktop, and moves centered below the grid on mobile.
 */
export function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const isHeaderInView = useInView(headerRef, {
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

  return (
    <section
      ref={sectionRef}
      id="work"
      data-nav-theme="paper"
      aria-labelledby="work-title"
      className="bg-background text-foreground"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-8 py-24 lg:py-32">
        {/* HEADER ROW */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 lg:mb-16"
        >
          {/* LEFT: Eyebrow, H2 Headline, Lead Copy */}
          <div className="flex flex-col items-start max-w-xl">
            {/* Eyebrow: 6px Ink Dot + label-mono */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{
                opacity: isHeaderInView || prefersReducedMotion ? 1 : 0,
                y: isHeaderInView || prefersReducedMotion ? 0 : 14,
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.6,
                ease: easeCurve,
                delay: prefersReducedMotion ? 0 : 0,
              }}
              className="flex items-center gap-2 select-none"
            >
              <span
                className="w-[6px] h-[6px] rounded-full bg-foreground shrink-0 inline-block"
                aria-hidden="true"
              />
              <span className="label-mono text-muted-foreground">
                {WORK_COPY.eyebrow}
              </span>
            </motion.div>

            {/* H2 Headline: WordsPullUp + Current Color Dot */}
            <h2
              id="work-title"
              className="text-[clamp(2.25rem,4.6vw,3.5rem)] font-medium tracking-[-0.03em] leading-[1.04] mt-5 text-foreground"
            >
              <WordsPullUp
                text={WORK_COPY.headline}
                play={isHeaderInView}
                delay={prefersReducedMotion ? 0 : 0.08}
                lastWordAddon={<Dot color="current" aria-hidden="true" />}
              />
            </h2>

            {/* Lead Copy */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{
                opacity: isHeaderInView || prefersReducedMotion ? 1 : 0,
                y: isHeaderInView || prefersReducedMotion ? 0 : 14,
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.6,
                ease: easeCurve,
                delay: prefersReducedMotion ? 0 : 0.16,
              }}
              className="text-base md:text-lg text-muted-foreground max-w-[460px] mt-5 leading-relaxed font-normal"
            >
              {WORK_COPY.lead}
            </motion.p>
          </div>

          {/* RIGHT (Desktop md+): "All projects" CTA */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{
              opacity: isHeaderInView || prefersReducedMotion ? 1 : 0,
              y: isHeaderInView || prefersReducedMotion ? 0 : 14,
            }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.6,
              ease: easeCurve,
              delay: prefersReducedMotion ? 0 : 0.24,
            }}
            className="hidden md:block self-end"
          >
            <UnderlineLink
              href={WORK_COPY.cta.href}
              className="px-0 h-auto inline-flex items-center gap-1.5"
              underlineClassName="bottom-0 inset-x-0"
            >
              <span>{WORK_COPY.cta.label}</span>
              <ArrowRight className="w-4 h-4 ml-1 inline shrink-0" />
            </UnderlineLink>
          </motion.div>
        </div>

        {/* PROJECT GRID */}
        <ul
          role="list"
          className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0"
        >
          {FEATURED_PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
              className={cn(index === 2 && "md:col-span-2 lg:col-span-1")}
            />
          ))}
        </ul>

        {/* MOBILE CTA: Centered below grid on mobile */}
        <div className="mt-8 md:hidden flex justify-center">
          <UnderlineLink
            href={WORK_COPY.cta.href}
            className="px-0 h-auto inline-flex items-center gap-1.5"
            underlineClassName="bottom-0 inset-x-0"
          >
            <span>{WORK_COPY.cta.label}</span>
            <ArrowRight className="w-4 h-4 ml-1 inline shrink-0" />
          </UnderlineLink>
        </div>
      </div>
    </section>
  );
}

export default SelectedWork;
