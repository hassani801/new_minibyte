"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LenisContext = createContext<Lenis | null>(null);

/**
 * Hook to access the current Lenis smooth scroll instance.
 */
export function useLenis(): Lenis | null {
  const context = useContext(LenisContext);
  if (context) return context;
  if (typeof window !== "undefined" && window.__mbLenis) {
    return window.__mbLenis;
  }
  return null;
}

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    // Disable Lenis entirely if prefers-reduced-motion: reduce
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    // Register ScrollTrigger plugin once
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis (duration ~1.1, easing easeOutExpo-like, smoothWheel true)
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    window.__mbLenis = lenis;
    setLenisInstance(lenis);

    // If preloader is running, lock scrolling immediately
    if (
      typeof document !== "undefined" &&
      document.documentElement.dataset.preloader === "run"
    ) {
      lenis.stop();
    }

    // Sync with GSAP
    const onScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", onScroll);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
      window.__mbLenis = null;
      setLenisInstance(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisInstance}>
      {children}
    </LenisContext.Provider>
  );
}

