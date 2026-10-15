"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Dot } from "@/components/brand/dot";
import { WordsPullUp } from "@/components/ui/words-pull-up";
import { FilterChips, useQueryParamState } from "@/components/ui/filter-chips";
import { ProjectCard } from "@/components/sections/home/project-card";
import { PUBLIC_PROJECTS } from "@/lib/projects";
import { PORTFOLIO_PAGE, getAllTags } from "@/lib/portfolio";

const easeCurve = [0.16, 1, 0.3, 1] as const;

export function ProjectFilter() {
  const allTags = useMemo(() => ["All", ...getAllTags()], []);
  const [selectedTag, setSelectedTag] = useQueryParamState("tag", allTags);
  const [mounted, setMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-10% 0px" });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  // Filter projects (during SSR always display all projects for crawlability)
  const filteredProjects = useMemo(() => {
    if (!mounted || selectedTag === "All") {
      return PUBLIC_PROJECTS;
    }
    return PUBLIC_PROJECTS.filter((p) => p.tags.includes(selectedTag));
  }, [selectedTag, mounted]);

  const totalCount = PUBLIC_PROJECTS.length;
  const currentCount = filteredProjects.length;

  const statusText =
    selectedTag === "All"
      ? `Showing all ${totalCount} projects`
      : `Showing ${currentCount} projects for ${selectedTag}`;

  const { eyebrow, headline, filterLabel, all, empty } = PORTFOLIO_PAGE.list;

  return (
    <section
      ref={sectionRef}
      id="projects"
      data-nav-theme="paper"
      aria-labelledby="projects-title"
      className="bg-background text-foreground py-20 lg:py-28 relative"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        {/* Header Row */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 lg:mb-10"
        >
          {/* LEFT: Eyebrow + H2 */}
          <div className="max-w-xl">
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
                className="w-[6px] h-[6px] rounded-full bg-foreground shrink-0 inline-block"
                aria-hidden="true"
              />
              <span className="label-mono text-muted-foreground">{eyebrow}</span>
            </motion.div>

            <h2
              id="projects-title"
              className="text-[clamp(2.25rem,4.6vw,3.5rem)] font-medium tracking-[-0.03em] leading-[1.04] mt-5 text-foreground"
            >
              <WordsPullUp
                text={headline}
                play={isHeaderInView}
                delay={prefersReducedMotion ? 0 : 0.08}
                lastWordAddon={<Dot color="current" aria-hidden="true" />}
              />
            </h2>
          </div>

          {/* RIGHT: Live Count for Screen Readers & Desktop */}
          <div
            role="status"
            aria-live="polite"
            className="data-mono text-sm text-muted-foreground tabular-nums select-none"
          >
            <span className="hidden md:inline">
              {currentCount} of {totalCount}
            </span>
            <span className="sr-only">{statusText}</span>
          </div>
        </div>

        {/* Filter Bar using shared FilterChips */}
        <FilterChips
          options={allTags}
          value={selectedTag}
          onChange={setSelectedTag}
          label={filterLabel}
          allLabel={all}
          className="mb-10"
        />

        {/* Projects Grid or Empty State */}
        {filteredProjects.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[280px]">
            <p className="text-base text-muted-foreground mb-6 font-normal">
              {empty}
            </p>
            <button
              type="button"
              onClick={() => setSelectedTag("All")}
              className="label-mono text-xs uppercase tracking-wider text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
            >
              Clear filter
            </button>
          </div>
        ) : (
          <ul
            role="list"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 p-0 m-0 list-none"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredProjects.map((project) => {
                const originalIndex = PUBLIC_PROJECTS.findIndex(
                  (p) => p.slug === project.slug
                );

                return (
                  <motion.li
                    key={project.slug}
                    layout={!prefersReducedMotion}
                    initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      scale: prefersReducedMotion ? 1 : 0.98,
                      transition: { duration: 0.2 },
                    }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.35,
                      ease: easeCurve,
                    }}
                    className="list-none h-full"
                  >
                    <ProjectCard
                      as="div"
                      project={project}
                      index={originalIndex >= 0 ? originalIndex : 0}
                      showBlue={false}
                      reveal={false}
                      className="h-full"
                    />
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </section>
  );
}

export default ProjectFilter;
