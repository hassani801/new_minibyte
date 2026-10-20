"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { DotPattern } from "@/components/brand/dot-pattern";
import { TransitionLink } from "@/components/layout/transition-link";
import { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

const easeCurve = [0.16, 1, 0.3, 1] as const;

interface FeaturedProjectCardProps {
  project: Project;
  prefersReducedMotion?: boolean;
}

/**
 * FeaturedProjectCard — Figma reference "large case study" layout
 *
 * Two-column on desktop: large image/visual on left (~55%), spec sheet + CTA on right.
 * On mobile: stacked vertically.
 * Matches the Figma screenshot: category badge, bold headline, description text,
 * spec rows (label left, value right), and "Read the case study →" link.
 */
export function FeaturedProjectCard({ project, prefersReducedMotion = false }: FeaturedProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-10% 0px" });

  const [isHovered, setIsHovered] = useState(false);

  const isInk = project.surface === "ink";

  // Build a readable category from the first tag
  const category = project.tags[0] ?? "Project";

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      animate={{
        opacity: inView || prefersReducedMotion ? 1 : 0,
        y: inView || prefersReducedMotion ? 0 : 24,
      }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: easeCurve }}
      className="mb-4 md:mb-5"
    >
      <TransitionLink
        href={`/portfolio/${project.slug}`}
        aria-label={`${project.name}: ${project.summary}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        className="group block rounded-2xl border border-border overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors hover:border-foreground/20 select-none"
      >
        <div className="grid grid-cols-1 md:grid-cols-[55fr_45fr]">
          {/* LEFT: Visual — image or dot pattern */}
          <div
            className={cn(
              "relative aspect-[4/3] md:aspect-auto md:min-h-[420px] overflow-hidden",
              isInk ? "theme-ink bg-background" : "bg-secondary"
            )}
          >
            {project.image ? (
              <Image
                src={project.image.src}
                alt={project.image.alt}
                fill
                priority
                quality={85}
                sizes="(max-width: 768px) 100vw, 55vw"
                className={cn(
                  "object-cover transition-transform duration-700 ease-out",
                  project.image.tone === "original" ? "" : "grayscale",
                  !prefersReducedMotion && "[@media(hover:hover)]:group-hover:scale-[1.03]"
                )}
              />
            ) : (
              <motion.div
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: inView || prefersReducedMotion ? 0.9 : 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 1, ease: "easeOut" }}
                className={cn(
                  "absolute inset-0 w-full h-full",
                  !prefersReducedMotion && "[@media(hover:hover)]:group-hover:scale-[1.04] transition-transform duration-700"
                )}
              >
                <DotPattern
                  bleed
                  crop={project.pattern}
                  tone={isInk ? "paper" : "ink"}
                  showBlue={true}
                  className="w-full h-full"
                />
              </motion.div>
            )}
          </div>

          {/* RIGHT: Content pane */}
          <div className="flex flex-col justify-between p-5 sm:p-6 md:p-8 lg:p-10 bg-card">
            {/* Category badge + project type */}
            <div>
              <div className="flex items-center gap-2 mb-3 sm:mb-4 select-none">
                <span className="label-eyebrow">Case Study</span>
                <span className="text-muted-foreground" aria-hidden="true">·</span>
                <span className="label-mono uppercase">{category}</span>
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-[-0.025em] leading-tight text-foreground mb-3 capitalize">
                {project.name.replace(/-/g, " ")}
              </h3>

              {/* Summary */}
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-normal mb-6">
                {project.summary}
              </p>
            </div>

            {/* Spec table */}
            {project.specs && project.specs.length > 0 && (
              <dl className="flex flex-col mb-6">
                {project.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-center justify-between py-2.5 sm:py-3 border-t border-border gap-4"
                  >
                    <dt className="data-mono text-xs sm:text-[13px] text-muted-foreground shrink-0">{spec.label}</dt>
                    <dd className="data-mono text-xs sm:text-[13px] text-foreground font-normal text-right break-words">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {/* CTA link */}
            <div className="flex items-center gap-1.5 text-sm font-medium text-accent group-hover:gap-2.5 transition-all duration-200" style={{ color: "var(--bit-blue)" }}>
              <span>Read the case study</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </TransitionLink>
    </motion.div>
  );
}

export default FeaturedProjectCard;
