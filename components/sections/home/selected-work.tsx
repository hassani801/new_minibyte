"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Dot } from "@/components/brand/dot";
import { WordsPullUp } from "@/components/ui/words-pull-up";
import { ProjectCard } from "@/components/sections/home/project-card";
import { FeaturedProjectCard } from "@/components/sections/home/featured-project-card";
import { FEATURED_PROJECTS } from "@/lib/projects";
import { WORK_COPY } from "@/lib/constants";
import { TransitionLink } from "@/components/layout/transition-link";

const easeCurve = [0.16, 1, 0.3, 1] as const;

/**
 * SelectedWork Section — Figma reference style
 *
 * Section header: eyebrow (blue) + bold headline left, "All projects" CTA right.
 * Featured (first) project gets a large hero card with image on left and spec sheet on right.
 * Remaining projects in a smaller 3-column grid below.
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

  const [featuredProject, ...restProjects] = FEATURED_PROJECTS;

  return (
    <section
      ref={sectionRef}
      id="work"
      data-nav-theme="paper"
      aria-labelledby="work-title"
      className="bg-background text-foreground"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-8 py-16 md:py-24 lg:py-32">
        {/* HEADER ROW: eyebrow + headline left, CTA right */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10 lg:mb-16"
        >
          {/* LEFT: eyebrow + headline */}
          <div className="flex flex-col items-start max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{
                opacity: isHeaderInView || prefersReducedMotion ? 1 : 0,
                y: isHeaderInView || prefersReducedMotion ? 0 : 12,
              }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: easeCurve }}
              className="label-eyebrow mb-3 sm:mb-4 select-none"
            >
              {WORK_COPY.eyebrow}
            </motion.p>

            <h2
              id="work-title"
              className="text-[clamp(2rem,4.5vw,3.5rem)] font-semibold tracking-[-0.03em] leading-[1.06] text-foreground"
            >
              <WordsPullUp
                text={WORK_COPY.headline}
                play={isHeaderInView}
                delay={prefersReducedMotion ? 0 : 0.06}
                lastWordAddon={<Dot color="current" aria-hidden="true" />}
              />
            </h2>
          </div>

          {/* RIGHT (Desktop): "All projects" CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: isHeaderInView || prefersReducedMotion ? 1 : 0,
              y: isHeaderInView || prefersReducedMotion ? 0 : 12,
            }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: easeCurve, delay: prefersReducedMotion ? 0 : 0.1 }}
            className="hidden md:block md:pt-1 shrink-0"
          >
            <TransitionLink
              href={WORK_COPY.cta.href}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              <span>{WORK_COPY.cta.label}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </TransitionLink>
          </motion.div>
        </div>

        {/* FEATURED CARD: First project gets the large hero layout */}
        {featuredProject && (
          <FeaturedProjectCard
            project={featuredProject}
            prefersReducedMotion={prefersReducedMotion}
          />
        )}

        {/* REMAINING CARDS GRID */}
        {restProjects.length > 0 && (
          <ul
            role="list"
            className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0 mt-4 md:mt-5"
          >
            {restProjects.map((project, i) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={i + 1}
                showBlue={false}
              />
            ))}
          </ul>
        )}

        {/* MOBILE CTA */}
        <div className="mt-8 md:hidden flex justify-start">
          <TransitionLink
            href={WORK_COPY.cta.href}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            <span>{WORK_COPY.cta.label}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}

export default SelectedWork;
