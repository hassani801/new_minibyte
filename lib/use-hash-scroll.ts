"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "@/components/providers/smooth-scroll";
import { onPageReady } from "@/lib/transition";

declare global {
  interface Window {
    __mbNavGrace?: number;
  }
}

/**
 * useHashScroll Hook
 *
 * Smoothly scrolls to hash anchor target after page transition or direct hash change.
 * - Respects font loading and layout shifts (document.fonts.ready + double rAF)
 * - Accounts for sticky navbar height (--nav-h + 24px)
 * - Extends navbar grace period (1200ms) so header does not hide immediately
 * - Moves keyboard focus to target article heading for accessibility
 * - Falls back to native scrollIntoView if Lenis is absent or prefers-reduced-motion is active
 */
export function useHashScroll() {
  const lenis = useLenis();
  const lenisRef = useRef(lenis);

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  useEffect(() => {
    let isCancelled = false;
    let rafId: number | null = null;

    const performScrollToHash = (rawHash: string) => {
      if (!rawHash) return;
      const targetId = rawHash.replace(/^#/, "");
      if (!targetId) return;

      // Wait for fonts to finish layout to prevent offset jumping
      const execute = async () => {
        if (typeof document !== "undefined" && document.fonts) {
          try {
            await document.fonts.ready;
          } catch {
            // Proceed if fonts API fails
          }
        }

        if (isCancelled) return;

        rafId = requestAnimationFrame(() => {
          if (isCancelled) return;

          rafId = requestAnimationFrame(() => {
            if (isCancelled) return;

            const targetEl = document.getElementById(targetId);
            if (!targetEl) return;

            // Set navbar grace period so it doesn't immediately hide
            if (typeof window !== "undefined") {
              window.__mbNavGrace = performance.now() + 1200;
            }

            const navHeightStr = getComputedStyle(document.documentElement)
              .getPropertyValue("--nav-h")
              .trim();
            const navHeight = parseFloat(navHeightStr) || 72;
            const targetOffset = -(navHeight + 24);

            const prefersReducedMotion = window.matchMedia(
              "(prefers-reduced-motion: reduce)"
            ).matches;

            const focusHeading = () => {
              const heading = targetEl.querySelector<HTMLElement>("h3");
              if (heading) {
                heading.tabIndex = -1;
                heading.focus({ preventScroll: true });
              }
            };

            const currentLenis = lenisRef.current;
            if (currentLenis && !prefersReducedMotion) {
              currentLenis.scrollTo(targetEl, {
                offset: targetOffset,
                duration: 1.1,
                immediate: false,
                onComplete: () => {
                  focusHeading();
                },
              });
            } else {
              targetEl.scrollIntoView({ block: "start" });
              focusHeading();
            }
          });
        });
      };

      void execute();
    };

    // 1. Initial load / page transition landing
    const unsubPageReady = onPageReady(() => {
      if (window.location.hash) {
        performScrollToHash(window.location.hash);
      }
    });

    // 2. Hashchange event listener
    const handleHashChange = () => {
      performScrollToHash(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      isCancelled = true;
      unsubPageReady();
      window.removeEventListener("hashchange", handleHashChange);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
}

/**
 * Tiny client wrapper for mounting useHashScroll inside Server Component pages.
 */
export function HashScroll() {
  useHashScroll();
  return null;
}
