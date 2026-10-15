import { useEffect, useRef } from "react";
import { onPreloaderDone } from "@/lib/preloader";

export const PAGE_READY_EVENT = "page:ready";

declare global {
  interface Window {
    __mbTransitioning?: boolean;
  }
}

/**
 * Executes a callback once the page is fully ready and visible to the user:
 * - If the initial brand preloader is still active, waits for "preloader:done".
 * - If a route-to-route page transition is currently in flight, waits for "page:ready".
 * - Otherwise, executes the callback immediately.
 *
 * @returns Cleanup function to unsubscribe listeners if unmounted early.
 */
export function onPageReady(cb: () => void): () => void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return () => {};
  }

  // 1. If initial preloader is active, wait for preloader:done first
  const isPreloaderActive =
    document.documentElement.dataset.preloader === "run" &&
    !window.__mbPreloaderDone;

  if (isPreloaderActive) {
    const unsubPreloader = onPreloaderDone(() => {
      // Check if a page transition started immediately after preloader
      if (window.__mbTransitioning) {
        const handleReady = () => {
          cb();
        };
        window.addEventListener(PAGE_READY_EVENT, handleReady, { once: true });
      } else {
        cb();
      }
    });

    return () => {
      unsubPreloader();
    };
  }

  // 2. If a route transition is currently active, wait for page:ready
  if (window.__mbTransitioning) {
    const handleReady = () => {
      cb();
    };
    window.addEventListener(PAGE_READY_EVENT, handleReady, { once: true });
    return () => {
      window.removeEventListener(PAGE_READY_EVENT, handleReady);
    };
  }

  // 3. Page is already visible and idle
  cb();
  return () => {};
}

/**
 * React hook wrapper for onPageReady.
 * Ensures intro animations or hero elements run only AFTER the transition curtain has lifted.
 */
export function usePageReady(cb: () => void): void {
  const cbRef = useRef(cb);

  useEffect(() => {
    cbRef.current = cb;
  }, [cb]);

  useEffect(() => {
    const unsubscribe = onPageReady(() => {
      cbRef.current();
    });
    return unsubscribe;
  }, []);
}
