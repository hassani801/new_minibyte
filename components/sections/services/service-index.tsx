"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ByteMark } from "@/components/brand/byte-mark";
import { ScrambleText } from "@/components/ui/scramble-text";
import { TransitionLink } from "@/components/layout/transition-link";
import { CAPABILITIES } from "@/lib/constants";
import { usePageReady } from "@/lib/transition";
import { cn } from "@/lib/utils";

const easeCurve = [0.16, 1, 0.3, 1] as const;

interface ServiceIndexRowProps {
  slug: string;
  title: string;
  index: number;
  isReady: boolean;
  prefersReducedMotion: boolean;
}

function ServiceIndexRow({
  slug,
  title,
  index,
  isReady,
  prefersReducedMotion,
}: ServiceIndexRowProps) {
  const [isHovered, setIsHovered] = useState(false);
  const binaryString = (index + 1).toString(2).padStart(8, "0");

  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      animate={{
        opacity: isReady || prefersReducedMotion ? 1 : 0,
        y: isReady || prefersReducedMotion ? 0 : 12,
      }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.5,
        ease: easeCurve,
        delay: prefersReducedMotion ? 0 : 0.2 + index * 0.07,
      }}
      className="list-none border-t border-border first:border-t"
    >
      <TransitionLink
        href={`#${slug}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        className={cn(
          "group grid grid-cols-[auto_1fr_auto] items-center gap-4 py-3.5 px-2 -mx-2 rounded-lg",
          "text-muted-foreground transition-colors duration-200 hover:text-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
        )}
      >
        {/* ByteMark Icon (w-8, mono tone, no blue) */}
        <div className="w-8 shrink-0 text-muted-foreground group-hover:text-foreground group-focus-visible:text-foreground transition-colors duration-200">
          <ByteMark
            value={index + 1}
            tone="mono"
            blueLast={false}
            className="w-8"
            aria-hidden="true"
          />
        </div>

        {/* Title row with 6px dot appearing on hover */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="w-1.5 h-1.5 rounded-full bg-foreground shrink-0 transition-opacity duration-200 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
            aria-hidden="true"
          />
          <span className="text-base md:text-lg font-medium text-foreground tracking-[-0.01em] truncate">
            {title}
          </span>
        </div>

        {/* 8-bit binary on the right (hidden below sm) */}
        <span className="hidden sm:inline data-mono text-xs text-muted-foreground group-hover:text-foreground group-focus-visible:text-foreground tabular-nums transition-colors duration-200">
          <ScrambleText trigger={isHovered} characterSet="01">
            {binaryString}
          </ScrambleText>
        </span>
      </TransitionLink>
    </motion.li>
  );
}

/**
 * ServiceIndex: Hero visual jump-list card for /services
 *
 * Paper theme card with 5 interactive rows linking to service anchors.
 * - Staggered reveal upon page:ready
 * - Binary scramble and dot indicator on hover
 * - Zero blue elements (blue reserved for hero headline Dot)
 */
export function ServiceIndex() {
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

  const totalCount = String(CAPABILITIES.length).padStart(2, "0");

  return (
    <div className="bg-card border border-border rounded-2xl p-5 md:p-7 w-full max-w-[480px] select-none">
      {/* Header Row */}
      <div className="flex items-center justify-between pb-4 label-mono text-muted-foreground text-xs">
        <span>INDEX</span>
        <span className="tabular-nums">{totalCount}</span>
      </div>

      {/* Navigation List */}
      <nav aria-label="Services index">
        <ul role="list" className="p-0 m-0">
          {CAPABILITIES.map((capability, index) => (
            <ServiceIndexRow
              key={capability.slug}
              slug={capability.slug}
              title={capability.title}
              index={index}
              isReady={isReady}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </ul>
      </nav>
    </div>
  );
}
