"use client";

import React, { useState } from "react";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { Dot } from "@/components/brand/dot";
import { DotPattern } from "@/components/brand/dot-pattern";
import { ScrambleText } from "@/components/ui/scramble-text";
import { TransitionLink } from "@/components/layout/transition-link";
import { PUBLIC_PROJECTS } from "@/lib/projects";
import { getAdjacentProjects } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

interface CaseNextProps {
  currentSlug: string;
}

export function CaseNext({ currentSlug }: CaseNextProps) {
  const { prev, next } = getAdjacentProjects(currentSlug);
  const [isNextHovered, setIsNextHovered] = useState(false);

  const hasMultipleProjects = PUBLIC_PROJECTS.length >= 3;

  return (
    <section
      data-nav-theme="ink"
      aria-label="Next and previous projects"
      className="theme-ink bg-background text-foreground py-20 lg:py-28 relative border-t border-border overflow-hidden"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-8 flex flex-col gap-12">
        {/* Previous Project Link (if >= 3 projects) */}
        {hasMultipleProjects && (
          <div className="flex items-center">
            <TransitionLink
              href={`/portfolio/${prev.slug}`}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="label-mono text-xs">PREVIOUS:</span>
              <span className="font-mono text-sm lowercase underline underline-offset-4">
                {prev.name}
              </span>
            </TransitionLink>
          </div>
        )}

        {/* Big Next Project Card Block */}
        <TransitionLink
          href={`/portfolio/${next.slug}`}
          onMouseEnter={() => setIsNextHovered(true)}
          onMouseLeave={() => setIsNextHovered(false)}
          onFocus={() => setIsNextHovered(true)}
          onBlur={() => setIsNextHovered(false)}
          className={cn(
            "group relative rounded-3xl border border-border bg-card p-8 md:p-14 overflow-hidden block",
            "transition-colors duration-300 [@media(hover:hover)]:hover:border-foreground/40",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
          )}
        >
          {/* Subtle Background Pattern with 8px hover shift */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -right-12 -bottom-12 w-[340px] h-[340px] opacity-10 transition-transform duration-500 ease-out group-hover:translate-x-2 group-hover:-translate-y-2">
              <DotPattern
                bleed
                crop={next.pattern}
                tone="paper"
                showBlue={false}
                className="w-full h-full"
              />
            </div>
          </div>

          <div className="relative z-10 flex flex-col justify-between min-h-[220px]">
            {/* Header Tag */}
            <div className="flex items-center justify-between">
              <span className="label-mono text-xs text-muted-foreground">
                NEXT PROJECT
              </span>

              {/* Arrow Circle */}
              <div
                className={cn(
                  "w-12 h-12 rounded-full border border-border flex items-center justify-center transition-all duration-300",
                  "group-hover:bg-foreground group-hover:text-background group-hover:border-foreground"
                )}
              >
                <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>

            {/* Next Project Name in Geist Mono */}
            <div className="my-6">
              <h3 className="font-mono text-[clamp(2.5rem,7vw,6rem)] font-normal tracking-[-0.03em] leading-none lowercase text-foreground [overflow-wrap:anywhere]">
                <ScrambleText trigger={isNextHovered} characterSet="01">
                  {next.name}
                </ScrambleText>
                <Dot color="current" aria-hidden="true" />
              </h3>

              <p className="text-base md:text-lg text-muted-foreground max-w-[560px] mt-4 font-normal m-0 leading-relaxed">
                {next.summary}
              </p>
            </div>
          </div>
        </TransitionLink>
      </div>
    </section>
  );
}

export default CaseNext;
