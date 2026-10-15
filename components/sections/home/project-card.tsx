"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Dot } from "@/components/brand/dot";
import { DotPattern } from "@/components/brand/dot-pattern";
import { ScrambleText } from "@/components/ui/scramble-text";
import { TransitionLink } from "@/components/layout/transition-link";
import { toBits } from "@/lib/byte";
import { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

const easeCurve = [0.16, 1, 0.3, 1] as const;

export interface ProjectCardProps {
  project: Project;
  index: number;
  priority?: boolean;
  className?: string;
  showBlue?: boolean;
  reveal?: boolean;
  as?: "li" | "div";
}

/**
 * ProjectCard renders an interactive spec-sheet style card for a featured project.
 *
 * Spec highlights:
 * - Monospace top row with project sequence (PROJECT 01) and 4-bit binary representation.
 * - Aspect-ratio visual container: DotPattern with subtle hover parallax/scale or grayscale next/image.
 * - Title row: lowercase mono brand style ("nibble.") with Dot (color="current") and ScrambleText on hover.
 * - 3-row structured specification table (<dl>) pinned to card bottom.
 * - Exactly one blue element in section rule: DotPattern showBlue={showBlue ?? (index === 0)}.
 * - Accessible block link with full screen reader context.
 */
export function ProjectCard({
  project,
  index,
  priority = false,
  className,
  showBlue = index === 0,
  reveal = true,
  as = "li",
}: ProjectCardProps) {
  const cardRef = useRef<HTMLLIElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-10% 0px" });

  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const projectNumber = String(index + 1).padStart(2, "0");
  const binary4Bit = toBits(index + 1)
    .slice(4)
    .map(Number)
    .join("");

  const isInk = project.surface === "ink";
  const MotionComponent = as === "div" ? motion.div : motion.li;

  return (
    <MotionComponent
      ref={cardRef as React.RefObject<HTMLLIElement & HTMLDivElement>}
      initial={reveal ? { opacity: 0, y: 32 } : false}
      animate={{
        opacity: !reveal || inView || prefersReducedMotion ? 1 : 0,
        y: !reveal || inView || prefersReducedMotion ? 0 : 32,
      }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.8,
        ease: easeCurve,
        delay: prefersReducedMotion ? 0 : (index % 3) * 0.08,
      }}
      className={cn("list-none h-full", className)}
    >
      <TransitionLink
        href={`/portfolio/${project.slug}`}
        aria-label={`${project.name}: ${project.summary}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        className={cn(
          "group relative flex h-full flex-col rounded-2xl border overflow-hidden p-5 md:p-6 transition-colors duration-300 select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "active:scale-[0.99] transition-transform",
          isInk
            ? "theme-ink bg-background text-foreground border-border [@media(hover:hover)]:hover:border-foreground/40 group-focus-visible:border-foreground/40"
            : "bg-card text-foreground border-border [@media(hover:hover)]:hover:border-foreground/40 group-focus-visible:border-foreground/40"
        )}
      >
        {/* TOP ROW: Spec label and 4-bit binary index */}
        <div
          aria-hidden="true"
          className="flex items-center justify-between w-full select-none"
        >
          <span className="label-mono text-muted-foreground">
            {`PROJECT ${projectNumber}`}
          </span>
          <span className="label-mono text-muted-foreground tabular-nums">
            {binary4Bit}
          </span>
        </div>

        {/* VISUAL CONTAINER */}
        <div
          className={cn(
            "relative rounded-xl overflow-hidden mt-4",
            "aspect-[16/10]",
            index === 2
              ? "md:aspect-[21/9] lg:aspect-[4/3]"
              : "md:aspect-[4/3]",
            isInk ? "bg-card" : "bg-secondary"
          )}
        >
          {project.image ? (
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={project.image.src}
                alt={project.image.alt}
                fill
                priority={priority}
                quality={80}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={cn(
                  "object-cover transition-transform duration-600 ease-out",
                  project.image.tone === "original" ? "" : "grayscale",
                  !prefersReducedMotion &&
                    "[@media(hover:hover)]:group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
                )}
              />
            </div>
          ) : (
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{
                opacity: inView || prefersReducedMotion ? 0.9 : 0,
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.9,
                delay: prefersReducedMotion ? 0 : 0.15,
                ease: "easeOut",
              }}
              className={cn(
                "absolute inset-0 w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                !prefersReducedMotion &&
                  "[@media(hover:hover)]:group-hover:scale-[1.06] [@media(hover:hover)]:group-hover:-translate-x-1.5 [@media(hover:hover)]:group-hover:-translate-y-1.5 group-focus-visible:scale-[1.06] group-focus-visible:-translate-x-1.5 group-focus-visible:-translate-y-1.5"
              )}
            >
              <DotPattern
                bleed
                crop={project.pattern}
                tone={isInk ? "paper" : "ink"}
                showBlue={showBlue}
                className="w-full h-full"
              />
            </motion.div>
          )}
        </div>

        {/* TITLE ROW: Project Name in Geist Mono + Full Stop & Arrow Circle */}
        <div className="flex items-center justify-between gap-4 mt-6">
          <h3 className="font-mono text-2xl md:text-3xl font-normal tracking-[-0.02em] lowercase text-foreground [overflow-wrap:anywhere]">
            <ScrambleText characterSet="01" trigger={isHovered}>
              {project.name}
            </ScrambleText>
            <Dot color="current" aria-hidden="true" />
          </h3>

          <span
            aria-hidden="true"
            className={cn(
              "w-9 h-9 rounded-full border border-border grid place-items-center shrink-0 transition-all duration-[250ms] select-none",
              "[@media(hover:hover)]:group-hover:bg-foreground [@media(hover:hover)]:group-hover:text-background [@media(hover:hover)]:group-hover:border-foreground group-focus-visible:bg-foreground group-focus-visible:text-background group-focus-visible:border-foreground"
            )}
          >
            <ArrowUpRight
              className={cn(
                "w-4 h-4 transition-transform duration-[250ms]",
                !prefersReducedMotion &&
                  "[@media(hover:hover)]:group-hover:translate-x-[1px] [@media(hover:hover)]:group-hover:-translate-y-[1px] group-focus-visible:translate-x-[1px] group-focus-visible:-translate-y-[1px]"
              )}
            />
          </span>
        </div>

        {/* SUMMARY */}
        <p className="text-sm md:text-base text-muted-foreground mt-3 leading-relaxed font-normal line-clamp-3">
          {project.summary}
        </p>

        {/* TAGS */}
        <div className="flex flex-wrap gap-2 mt-4 select-none">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="label-mono text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* SPEC TABLE: Pushed to bottom with mt-auto */}
        {project.specs && project.specs.length > 0 && (
          <dl className="mt-auto pt-6 flex flex-col w-full">
            {project.specs.map((spec) => (
              <div
                key={spec.label}
                className="flex items-center justify-between py-2.5 border-t border-border"
              >
                <dt className="data-mono text-[13px] text-muted-foreground">
                  {spec.label}
                </dt>
                <dd className="data-mono text-[13px] text-foreground font-normal tabular-nums">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </TransitionLink>
    </MotionComponent>
  );
}

export default ProjectCard;
