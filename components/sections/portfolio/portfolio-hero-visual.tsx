"use client";

import React, { useState, useEffect } from "react";
import { PUBLIC_PROJECTS } from "@/lib/projects";
import { usePageReady } from "@/lib/transition";

export function PortfolioHeroVisual() {
  const targetCount = PUBLIC_PROJECTS.length;
  const [displayCount, setDisplayCount] = useState(0);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  usePageReady(() => {
    if (prefersReducedMotion) {
      setDisplayCount(targetCount);
      return;
    }

    const duration = 900; // 0.9s
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // power2.out: 1 - (1 - progress)^2
      const eased = 1 - Math.pow(1 - progress, 2);
      const current = Math.round(eased * targetCount);
      setDisplayCount(current);

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        setDisplayCount(targetCount);
      }
    };

    requestAnimationFrame(frame);
  });

  const paddedCount = String(displayCount).padStart(2, "0");
  const binaryString = displayCount.toString(2).padStart(8, "0");

  return (
    <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 md:p-8 w-full max-w-[420px] select-none flex flex-col justify-between">
      {/* Top Header Row */}
      <div className="flex items-center justify-between label-mono text-xs text-muted-foreground">
        <span>PROJECTS</span>
        <span className="tabular-nums">03</span>
      </div>

      {/* Main Counter Display */}
      <div className="my-6">
        <span className="font-mono text-[clamp(3.5rem,8.5vw,7rem)] font-normal leading-none tracking-tight tabular-nums text-foreground block">
          {paddedCount}
        </span>
      </div>

      {/* 8-bit Binary representation */}
      <div className="pt-4 border-t border-border flex items-center justify-between data-mono text-xs text-muted-foreground">
        <span>BINARY</span>
        <span className="tabular-nums">{binaryString}</span>
      </div>
    </div>
  );
}

export default PortfolioHeroVisual;
