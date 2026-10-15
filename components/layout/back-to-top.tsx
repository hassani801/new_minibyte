"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { useLenis } from "@/components/providers/smooth-scroll";
import { cn } from "@/lib/utils";

export interface BackToTopProps {
  className?: string;
}

/**
 * BackToTop button
 *
 * Smoothly scrolls the window to the top using Lenis smooth scrolling (quartic ease-out).
 * Gracefully falls back to instantaneous auto scroll if Lenis is unavailable or reduced motion is requested.
 */
export function BackToTop({ className }: BackToTopProps) {
  const lenis = useLenis();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const handleClick = () => {
    if (prefersReducedMotion || !lenis) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    lenis.scrollTo(0, {
      duration: 1.4,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Back to top"
      className={cn(
        "group inline-flex items-center gap-3 min-h-[44px] px-2 py-1 select-none cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-full",
        className
      )}
    >
      <span className="label-mono text-muted-foreground group-hover:text-foreground transition-colors duration-200">
        BACK TO TOP
      </span>

      <span
        aria-hidden="true"
        className={cn(
          "w-9 h-9 rounded-full border border-border grid place-items-center shrink-0 transition-all duration-[250ms]",
          "[@media(hover:hover)]:group-hover:bg-foreground [@media(hover:hover)]:group-hover:text-background [@media(hover:hover)]:group-hover:border-foreground"
        )}
      >
        <ArrowUp
          className={cn(
            "w-4 h-4 transition-transform duration-[250ms]",
            !prefersReducedMotion && "[@media(hover:hover)]:group-hover:-translate-y-[2px]"
          )}
        />
      </span>
    </button>
  );
}

export default BackToTop;
