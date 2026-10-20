"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { DotPattern } from "@/components/brand/dot-pattern";
import { TransitionLink } from "@/components/layout/transition-link";
import { getSortedPublications, RESEARCH_PAGE } from "@/lib/research";
import { usePageReady } from "@/lib/transition";
import { cn } from "@/lib/utils";

const easeCurve = [0.16, 1, 0.3, 1] as const;

function formatMonthYear(isoDate: string): string {
  const [year, month] = isoDate.split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1, 1));
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(d)
    .toUpperCase();
}

export function LatestCard() {
  const [isReady, setIsReady] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  usePageReady(() => {
    setIsReady(true);
  });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const latestPub = getSortedPublications()[0];
  if (!latestPub) return null;

  const { list } = RESEARCH_PAGE;
  const isExternal = latestPub.href?.startsWith("http");

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{
        opacity: isReady || prefersReducedMotion ? 1 : 0,
        y: isReady || prefersReducedMotion ? 0 : 24,
      }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.8,
        ease: easeCurve,
        delay: prefersReducedMotion ? 0 : 0.3,
      }}
      className={cn(
        "group relative rounded-2xl border border-border p-5 sm:p-6 md:p-8 min-h-[280px] sm:min-h-[320px] w-full max-w-[480px] select-none",
        "theme-ink bg-background text-foreground flex flex-col justify-between overflow-hidden"
      )}
    >
      {/* Background Cropped DotPattern (Drifts 6px on hover) */}
      <div className="absolute -bottom-6 -right-6 w-[55%] h-[55%] pointer-events-none overflow-hidden select-none">
        <div className="w-full h-full transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5 group-hover:-translate-y-1.5">
          <DotPattern
            bleed
            crop={{ col: 3, row: 2, cols: 5, rows: 5 }}
            tone="paper"
            showBlue={false}
            className="w-full h-full opacity-14"
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Top Meta Row */}
        <div className="flex items-center justify-between">
          <span className="label-mono text-xs text-muted-foreground">
            {`${list.latest} · ${latestPub.type.toUpperCase()}`}
          </span>
          <span className="data-mono text-xs text-muted-foreground tabular-nums">
            {formatMonthYear(latestPub.date)}
          </span>
        </div>

        {/* Content Block */}
        <div className="mt-8 sm:mt-10 mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl md:text-2xl leading-snug font-medium text-foreground tracking-[-0.01em] m-0">
            {latestPub.title}
          </h3>

          <p className="text-xs sm:text-sm text-muted-foreground mt-3 font-normal m-0 break-words">
            {latestPub.authors.join(", ")}
          </p>

          {latestPub.venue && (
            <span className="label-mono text-xs text-muted-foreground mt-2 block">
              {latestPub.venue}
            </span>
          )}
        </div>

        {/* Bottom Action Row */}
        <div className="pt-4 border-t border-border flex items-center justify-between">
          {latestPub.href ? (
            isExternal ? (
              <a
                href={latestPub.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded"
              >
                <span>Read publication</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : (
              <TransitionLink
                href={latestPub.href}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded"
              >
                <span>Read publication</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </TransitionLink>
            )
          ) : (
            <span className="label-mono text-xs text-muted-foreground">
              {list.inPrep}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default LatestCard;
