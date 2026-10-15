"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Dot } from "@/components/brand/dot";
import { ClientCell, DesktopGridPosition } from "@/components/sections/home/client-cell";
import { CLIENTS, CLIENTS_COPY } from "@/lib/constants";
import { cn } from "@/lib/utils";

const easeCurve = [0.16, 1, 0.3, 1] as const;

// 14-cell desktop perimeter map (row, col) (1-based)
const DESKTOP_PLACEMENTS: readonly DesktopGridPosition[] = [
  { row: 1, col: 1 },
  { row: 1, col: 2 },
  { row: 1, col: 3 },
  { row: 1, col: 4 },
  { row: 1, col: 5 },
  { row: 2, col: 1 },
  { row: 2, col: 5 },
  { row: 3, col: 1 },
  { row: 3, col: 5 },
  { row: 4, col: 1 },
  { row: 4, col: 2 },
  { row: 4, col: 3 },
  { row: 4, col: 4 },
  { row: 4, col: 5 },
] as const;

const DESKTOP_ROW_CLASSES: Record<number, string> = {
  1: "lg:row-start-1",
  2: "lg:row-start-2",
  3: "lg:row-start-3",
  4: "lg:row-start-4",
};

const DESKTOP_COL_CLASSES: Record<number, string> = {
  1: "lg:col-start-1",
  2: "lg:col-start-2",
  3: "lg:col-start-3",
  4: "lg:col-start-4",
  5: "lg:col-start-5",
};

/**
 * Where We Work / Clients Section
 *
 * Ink section featuring a centered headline card framed by country wordmark cells.
 * - Desktop (>= 1024px): 5 columns x 4 rows (96px row height).
 *   The center narrative block spans cols 2-4 and rows 2-3 (3x2), framed by country cells + filler cells.
 * - Below 1024px: Full-width center block on top, followed by 3-col (mobile) / 4-col (tablet) grid.
 * - Rule: Exactly ONE blue element in this section (the headline Dot).
 */
export function Clients() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const isGridInView = useInView(gridRef, {
    once: true,
    margin: "-10% 0px",
  });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const desktopFillerCount = Math.max(0, 14 - CLIENTS.length);

  return (
    <section
      ref={sectionRef}
      id="clients"
      data-nav-theme="ink"
      aria-labelledby="clients-title"
      className="theme-ink bg-background text-foreground"
    >
      <div className="mx-auto max-w-[1160px] px-4 md:px-8 py-20 md:py-28">
        {/* GRID WRAPPER */}
        <div
          ref={gridRef}
          role="list"
          className={cn(
            "relative grid gap-px bg-border border border-border w-full",
            // Flow layout below lg: 3 columns on mobile, 4 columns on tablet
            "grid-cols-3 md:grid-cols-4",
            // Desktop framed layout: 5 columns x 4 rows
            "lg:grid-cols-5 lg:[grid-template-rows:repeat(4,96px)]"
          )}
        >
          {/* CENTER HEADING BLOCK */}
          <motion.div
            role="none"
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: isGridInView || prefersReducedMotion ? 1 : 0,
              y: isGridInView || prefersReducedMotion ? 0 : 12,
            }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.6,
              ease: easeCurve,
              delay: 0,
            }}
            className={cn(
              "bg-card flex flex-col items-center justify-center text-center gap-5 px-6 py-10 md:py-12 select-none",
              // Mobile / Tablet: spans entire row on top
              "col-span-3 md:col-span-4",
              // Desktop: positioned at row 2-3, col 2-4
              "lg:col-start-2 lg:col-span-3 lg:row-start-2 lg:row-span-2"
            )}
          >
            {/* Badge */}
            <span className="inline-flex rounded-full border border-border px-3 py-1 label-mono text-muted-foreground select-none">
              {CLIENTS_COPY.badge}
            </span>

            {/* Headline with Bit Blue Dot (ONE blue element in this section) */}
            <h2
              id="clients-title"
              className="text-2xl md:text-3xl font-medium tracking-[-0.02em] leading-tight max-w-[516px] text-balance text-foreground m-0"
            >
              <span>{CLIENTS_COPY.headline}</span>
              <Dot color="blue" aria-hidden="true" />
            </h2>

            {/* Subcopy */}
            <p className="text-sm text-muted-foreground max-w-[380px] leading-relaxed font-normal m-0">
              {CLIENTS_COPY.sub}
            </p>
          </motion.div>

          {/* COUNTRY CELLS */}
          {CLIENTS.map((client, index) => (
            <ClientCell
              key={client.name}
              client={client}
              index={index}
              inView={isGridInView}
              prefersReducedMotion={prefersReducedMotion}
              desktopPlacement={DESKTOP_PLACEMENTS[index]}
            />
          ))}

          {/* DESKTOP FILLER CELLS (Fill the remaining perimeter slots on desktop) */}
          {Array.from({ length: desktopFillerCount }).map((_, i) => {
            const placementIndex = CLIENTS.length + i;
            const pos = DESKTOP_PLACEMENTS[placementIndex];
            const rowClass = DESKTOP_ROW_CLASSES[pos.row] ?? "";
            const colClass = DESKTOP_COL_CLASSES[pos.col] ?? "";

            return (
              <div
                key={`desktop-filler-${i}`}
                role="presentation"
                aria-hidden="true"
                className={cn(
                  "bg-card h-[96px] min-h-[96px] hidden lg:block select-none pointer-events-none",
                  rowClass,
                  colClass
                )}
              />
            );
          })}

          {/* TABLET FILLER CELLS (Completes row on 4-col tablet: 6 items + 2 fillers = 8 items) */}
          <div
            role="presentation"
            aria-hidden="true"
            className="bg-card h-[88px] min-h-[88px] hidden md:block lg:hidden select-none pointer-events-none"
          />
          <div
            role="presentation"
            aria-hidden="true"
            className="bg-card h-[88px] min-h-[88px] hidden md:block lg:hidden select-none pointer-events-none"
          />
        </div>
      </div>
    </section>
  );
}

export default Clients;
