"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useInView } from "framer-motion";
import { ByteMark } from "@/components/brand/byte-mark";
import { type Project } from "@/lib/projects";
import { PORTFOLIO_PAGE } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  label: string;
  value: string;
}

function ResultCard({ label, value }: ResultCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-10% 0px" });

  const [displayValue, setDisplayValue] = useState(value);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !isInView) return;

    // Check if value starts with or contains a number
    const match = value.match(/^([<>]?\s*)(\d+(\.\d+)?)(.*)$/);
    if (!match) return;

    const prefix = match[1] || "";
    const targetNum = parseFloat(match[2]);
    const suffix = match[4] || "";
    const isDecimal = match[2].includes(".");

    const duration = 1000;
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 2);
      const current = eased * targetNum;

      const formatted = isDecimal ? current.toFixed(1) : Math.round(current).toString();
      setDisplayValue(`${prefix}${formatted}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(frame);
  }, [isInView, value, prefersReducedMotion]);

  return (
    <div
      ref={cardRef}
      className="bg-card border border-border rounded-2xl p-4 sm:p-5 md:p-6 flex flex-col justify-between min-h-[120px] sm:min-h-[140px]"
    >
      <span className="sr-only">
        {value} {label}
      </span>
      <span
        aria-hidden="true"
        className="font-mono text-[clamp(1.75rem,4vw,3rem)] font-normal leading-none tracking-[-0.02em] tabular-nums text-foreground block"
      >
        {displayValue}
      </span>
      <span className="text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4 block">
        {label}
      </span>
    </div>
  );
}

interface CaseStoryProps {
  project: Project;
}

export function CaseStory({ project }: CaseStoryProps) {
  const caseData = project.case;
  if (!caseData) return null;

  const { challenge, approach, results, gallery } = caseData;
  const { challenge: challengeLabel, approach: approachLabel, results: resultsLabel } = PORTFOLIO_PAGE.case;

  const hasResults = Boolean(results && results.length > 0);
  const hasGallery = Boolean(gallery && gallery.length > 0);

  return (
    <div
      data-nav-theme="paper"
      className="bg-background text-foreground py-16 md:py-24 lg:py-32 relative"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-8 space-y-16 sm:space-y-24 lg:space-y-32">
        {/* 1. THE CHALLENGE */}
        {challenge && (
          <section
            aria-labelledby="challenge-title"
            className="grid grid-cols-1 lg:grid-cols-[4fr_8fr] gap-6 lg:gap-16 items-start"
          >
            <div className="lg:sticky lg:top-[calc(var(--nav-h)+32px)] self-start">
              <h2
                id="challenge-title"
                className="label-mono text-muted-foreground text-xs uppercase tracking-wider"
              >
                {challengeLabel}
              </h2>
            </div>
            <div>
              <p className="text-lg sm:text-xl md:text-2xl leading-snug max-w-[620px] text-foreground font-normal m-0">
                {challenge}
              </p>
            </div>
          </section>
        )}

        {/* 2. THE APPROACH */}
        {approach && approach.length > 0 && (
          <section
            aria-labelledby="approach-title"
            className="grid grid-cols-1 lg:grid-cols-[4fr_8fr] gap-6 lg:gap-16 items-start border-t border-border pt-12 sm:pt-16 lg:pt-24"
          >
            <div className="lg:sticky lg:top-[calc(var(--nav-h)+32px)] self-start">
              <h2
                id="approach-title"
                className="label-mono text-muted-foreground text-xs uppercase tracking-wider"
              >
                {approachLabel}
              </h2>
            </div>
            <div className="space-y-8 max-w-[620px]">
              {approach.map((step, index) => (
                <div key={index} className="flex items-start gap-5">
                  <div className="w-8 shrink-0 text-muted-foreground mt-1">
                    <ByteMark
                      value={index + 1}
                      tone="mono"
                      blueLast={false}
                      className="w-8"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed m-0 font-normal">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. THE RESULTS */}
        {(hasResults || hasGallery) && (
          <section
            aria-labelledby="results-title"
            className="grid grid-cols-1 lg:grid-cols-[4fr_8fr] gap-6 lg:gap-16 items-start border-t border-border pt-12 sm:pt-16 lg:pt-24"
          >
            <div className="lg:sticky lg:top-[calc(var(--nav-h)+32px)] self-start">
              <h2
                id="results-title"
                className="label-mono text-muted-foreground text-xs uppercase tracking-wider"
              >
                {resultsLabel}
              </h2>
            </div>
            <div className="w-full">
              {hasResults && results && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {results.map((result, index) => (
                    <ResultCard
                      key={`${result.label}-${index}`}
                      label={result.label}
                      value={result.value}
                    />
                  ))}
                </div>
              )}

              {/* Optional Gallery */}
              {hasGallery && gallery && (
                <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", hasResults ? "mt-8" : "")}>
                  {gallery.map((img, i) => (
                    <div
                      key={i}
                      className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-card border border-border"
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        quality={80}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                        className={cn(
                          "object-cover",
                          img.tone === "original" ? "" : "grayscale"
                        )}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default CaseStory;
