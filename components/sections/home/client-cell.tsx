"use client";

import React from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { BRAND_HEX, Client } from "@/lib/constants";
import { cn } from "@/lib/utils";

const PixelCanvas = dynamic(
  () => import("@/components/ui/pixel-canvas").then((m) => m.PixelCanvas),
  { ssr: false }
);

// Stable module-level colors constant for PixelCanvas (no blue)
const PIXEL_COLORS = [
  BRAND_HEX.paper,
  BRAND_HEX.mist,
  BRAND_HEX.graphite,
] as const;

const easeCurve = [0.16, 1, 0.3, 1] as const;

export interface DesktopGridPosition {
  row: number;
  col: number;
}

export interface ClientCellProps {
  client: Client;
  index: number;
  inView?: boolean;
  prefersReducedMotion?: boolean;
  desktopPlacement?: DesktopGridPosition;
  className?: string;
}

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
 * ClientCell renders an interactive logo cell with a centered wordmark / masked SVG logo
 * and a canvas pixel ripple on hover/touch.
 */
export function ClientCell({
  client,
  index,
  inView = true,
  prefersReducedMotion = false,
  desktopPlacement,
  className,
}: ClientCellProps) {
  // Stagger calculation: (row + col) * 0.04 in framed desktop, or index * 0.04 in flow
  const delay = desktopPlacement
    ? (desktopPlacement.row + desktopPlacement.col) * 0.04
    : index * 0.04;

  const placementClass = desktopPlacement
    ? cn(
        DESKTOP_ROW_CLASSES[desktopPlacement.row],
        DESKTOP_COL_CLASSES[desktopPlacement.col]
      )
    : undefined;

  return (
    <motion.div
      role="listitem"
      initial={{ opacity: 0, y: 12 }}
      animate={{
        opacity: inView || prefersReducedMotion ? 1 : 0,
        y: inView || prefersReducedMotion ? 0 : 12,
      }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.6,
        ease: easeCurve,
        delay: prefersReducedMotion ? 0 : delay,
      }}
      className={cn(
        "group relative isolate grid place-items-center overflow-hidden bg-card select-none",
        "h-[88px] lg:h-auto min-h-[88px]",
        "transition-colors duration-300",
        // Inset 1px outline on hover (no box-shadow)
        "[@media(hover:hover)]:hover:outline [@media(hover:hover)]:hover:outline-1 [@media(hover:hover)]:hover:outline-muted-foreground/40 [@media(hover:hover)]:hover:-outline-offset-1",
        placementClass,
        className
      )}
    >
      {/* Interactive Pixel Shimmer Canvas */}
      <PixelCanvas colors={PIXEL_COLORS} gap={5} speed={30} />

      {/* Client Logo Content */}
      <div className="relative z-[1] pointer-events-none flex items-center justify-center w-full px-3 text-center">
        {client.logoSrc ? (
          <span
            role="img"
            aria-label={client.name}
            className={cn(
              "block h-5 md:h-6 w-[70%] max-w-[140px] bg-current text-muted-foreground",
              "transition-all duration-300 group-hover:text-foreground",
              !prefersReducedMotion && "[@media(hover:hover)]:group-hover:scale-[1.04]"
            )}
            style={{
              maskImage: `url(${client.logoSrc})`,
              WebkitMaskImage: `url(${client.logoSrc})`,
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center",
              maskSize: "contain",
              WebkitMaskSize: "contain",
            }}
          />
        ) : (
          <span
            className={cn(
              "font-mono text-[12px] md:text-[13px] leading-tight tracking-tight text-center lowercase text-balance break-words max-w-full text-muted-foreground",
              "transition-all duration-300 group-hover:text-foreground",
              !prefersReducedMotion && "[@media(hover:hover)]:group-hover:scale-[1.04]"
            )}
          >
            {client.name}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default ClientCell;
