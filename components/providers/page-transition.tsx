"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ByteMark } from "@/components/brand/byte-mark";
import { toBits } from "@/lib/byte";
import { getRouteLabel } from "@/lib/constants";
import { useLenis } from "@/components/providers/smooth-scroll";
import { PAGE_READY_EVENT } from "@/lib/transition";

interface PageTransitionContextValue {
  navigate: (href: string) => void;
  isTransitioning: boolean;
}

const PageTransitionContext = createContext<PageTransitionContextValue>({
  navigate: () => {},
  isTransitioning: false,
});

/**
 * Access the route-to-route page transition controller.
 */
export function usePageTransition(): PageTransitionContextValue {
  return useContext(PageTransitionContext);
}

interface PageTransitionProviderProps {
  children: React.ReactNode;
}

/**
 * PageTransitionProvider handles custom App Router route transitions for the minibyte website.
 *
 * Architecture:
 * 1. COVER: An Ink curtain rises from bottom (y 100% -> 0%) with rounded top corners (50% 12% -> 0% 0%).
 *    The ByteMark and binary readout of the destination letter fade into view. Lenis is stopped.
 * 2. PUSH & HOLD: At 0.55s, scroll is snapped to top (immediate: true), and router.push(href) is called.
 *    The system holds until the new route mounts (usePathname updates), two rAF ticks pass, and
 *    fonts are ready, guaranteeing at least 0.2s minimum hold.
 * 3. REVEAL: Content fades out, and curtain lifts upward (0% -> -105%) with bottom corners rounding
 *    (0% 0% -> 50% 12%). Lenis resumes, ScrollTrigger refreshes, focus moves to #main, and
 *    "page:ready" is dispatched.
 * 4. NATIVE / POPSTATE: Direct back/forward button navigations skip the curtain and run a quick
 *    subtle entrance on #main so history navigation remains snappy.
 */
export function PageTransitionProvider({ children }: PageTransitionProviderProps) {
  const router = useRouter();
  const currentPathname = usePathname();
  const lenis = useLenis();

  // State
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetByteVal, setTargetByteVal] = useState<number>(109); // 'm' default
  const [targetChar, setTargetChar] = useState<string>("m");
  const [targetLabel, setTargetLabel] = useState<string>("minibyte");
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>("");

  // Refs
  const curtainRef = useRef<HTMLDivElement>(null);
  const contentGroupRef = useRef<HTMLDivElement>(null);
  const pendingTargetRef = useRef<string | null>(null);
  const pendingLabelRef = useRef<string>("minibyte");
  const isTransitioningRef = useRef(false);
  const isCoverFinishedRef = useRef(false);
  const coverFinishTimeRef = useRef<number>(0);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const isInitialMountRef = useRef(true);

  // Helper to clear safety timer
  const clearSafetyTimeout = useCallback(() => {
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
  }, []);

  // REVEAL ANIMATION (lifts curtain upward to reveal new route)
  const executeReveal = useCallback(() => {
    clearSafetyTimeout();
    const curtain = curtainRef.current;
    const contentGroup = contentGroupRef.current;
    if (!curtain || !contentGroup) return;

    if (activeTimelineRef.current) {
      activeTimelineRef.current.kill();
    }

    const revealTl = gsap.timeline({
      onComplete: () => {
        // Reset curtain to idle hidden state
        curtain.style.visibility = "hidden";
        curtain.style.transform = "translateY(100%)";
        curtain.style.borderBottomLeftRadius = "0% 0%";
        curtain.style.borderBottomRightRadius = "0% 0%";
        curtain.style.pointerEvents = "none";
        curtain.setAttribute("inert", "");

        // Refresh ScrollTrigger calculations
        ScrollTrigger.refresh();

        // Resume smooth scroll
        if (lenis) {
          lenis.start();
        }

        // Accessibility: focus to main element without scroll jump
        const mainEl = document.getElementById("main");
        if (mainEl) {
          gsap.set(mainEl, { clearProps: "all" });
          mainEl.removeAttribute("style");
          mainEl.tabIndex = -1;
          mainEl.focus({ preventScroll: true });
        }


        // Screen reader announcement
        setLiveAnnouncement(`Navigated to ${pendingLabelRef.current}`);

        // Set global flags & dispatch completion event
        window.__mbTransitioning = false;
        window.dispatchEvent(new CustomEvent(PAGE_READY_EVENT));

        // Reset state
        pendingTargetRef.current = null;
        isTransitioningRef.current = false;
        setIsTransitioning(false);
        isCoverFinishedRef.current = false;
        activeTimelineRef.current = null;
      },
    });

    activeTimelineRef.current = revealTl;

    // 1. Content group fades out (opacity 0, y -8px, duration 0.25, ease power2.in)
    revealTl.to(
      contentGroup,
      {
        opacity: 0,
        y: -8,
        duration: 0.25,
        ease: "power2.in",
      },
      0
    );

    // 2. Curtain y: 0% -> -105%, duration 0.75, ease power3.inOut, starting 0.1s after content starts fading.
    // Simultaneously bottom radii "0% 0%" -> "50% 12%".
    revealTl.to(
      curtain,
      {
        yPercent: -105,
        borderBottomLeftRadius: "50% 12%",
        borderBottomRightRadius: "50% 12%",
        duration: 0.75,
        ease: "power3.inOut",
      },
      0.1
    );
  }, [clearSafetyTimeout, lenis]);

  // NAVIGATE FUNCTION
  const navigate = useCallback(
    (href: string) => {
      // Ignore if transition already running
      if (isTransitioningRef.current) return;

      // Check reduced motion
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
        window.scrollTo(0, 0);
        router.push(href);
        return;
      }

      // Determine label & char for the destination
      let targetPathname = href;
      try {
        const parsed = new URL(href, window.location.href);
        targetPathname = parsed.pathname;
      } catch {}

      const label = getRouteLabel(targetPathname);
      const firstLetter = (label.charAt(0) || "m").toLowerCase();
      const charCode = firstLetter.charCodeAt(0);

      setTargetByteVal(charCode);
      setTargetChar(firstLetter);
      setTargetLabel(label);

      pendingTargetRef.current = targetPathname;
      pendingLabelRef.current = label;
      isTransitioningRef.current = true;
      setIsTransitioning(true);
      window.__mbTransitioning = true;
      isCoverFinishedRef.current = false;

      // Halt scroll
      if (lenis) {
        lenis.stop();
      }

      const curtain = curtainRef.current;
      const contentGroup = contentGroupRef.current;
      if (!curtain || !contentGroup) {
        router.push(href);
        return;
      }

      // Prepare curtain initial state
      curtain.removeAttribute("inert");
      curtain.style.pointerEvents = "auto";
      curtain.style.visibility = "visible";
      gsap.set(curtain, {
        yPercent: 100,
        borderTopLeftRadius: "50% 12%",
        borderTopRightRadius: "50% 12%",
        borderBottomLeftRadius: "0% 0%",
        borderBottomRightRadius: "0% 0%",
      });

      gsap.set(contentGroup, {
        opacity: 0,
        y: 12,
      });

      if (activeTimelineRef.current) {
        activeTimelineRef.current.kill();
      }

      const coverTl = gsap.timeline({
        onComplete: () => {
          // Immediately scroll to top
          if (lenis) {
            lenis.scrollTo(0, { immediate: true, force: true });
          }
          window.scrollTo(0, 0);

          coverFinishTimeRef.current = performance.now();
          isCoverFinishedRef.current = true;

          // Route change
          router.push(href);

          // 3-second safety timeout: reveal if pathname change hangs or 404s
          safetyTimeoutRef.current = setTimeout(() => {
            executeReveal();
          }, 3000);
        },
      });

      activeTimelineRef.current = coverTl;

      // Tween curtain y: 100% -> 0%, top radii: "50% 12%" -> "0% 0%"
      coverTl.to(
        curtain,
        {
          yPercent: 0,
          borderTopLeftRadius: "0% 0%",
          borderTopRightRadius: "0% 0%",
          duration: 0.55,
          ease: "power3.inOut",
        },
        0
      );

      // Content group fades in from opacity 0 / y 12 to opacity 1 / y 0 starting at 0.25s
      coverTl.to(
        contentGroup,
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        },
        0.25
      );
    },
    [router, lenis, executeReveal]
  );

  // PATHNAME CHANGE LISTENER
  useEffect(() => {
    // Skip initial mount effect
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      const mainEl = document.getElementById("main");
      if (mainEl) {
        gsap.set(mainEl, { clearProps: "all" });
        mainEl.removeAttribute("style");
      }
      return;
    }


    const target = pendingTargetRef.current;

    // CASE 1: Programmatic transition in-flight (curtain is covering screen)
    if (target) {
      clearSafetyTimeout();

      // Wait until:
      // 1. Two requestAnimationFrame ticks pass
      // 2. document.fonts.ready resolves
      // 3. Minimum 0.2s hold since cover finished
      const elapsedSinceCover = performance.now() - coverFinishTimeRef.current;
      const remainingHold = Math.max(0, 200 - elapsedSinceCover);

      const waitForDomAndFonts = new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (typeof document !== "undefined" && "fonts" in document) {
              document.fonts.ready.then(() => resolve()).catch(() => resolve());
            } else {
              resolve();
            }
          });
        });
      });

      const waitTimer = new Promise<void>((resolve) => {
        setTimeout(resolve, remainingHold);
      });

      Promise.all([waitForDomAndFonts, waitTimer]).then(() => {
        executeReveal();
      });
      return;
    }

    // CASE 2: Native Back / Forward (popstate) or external route change without transition
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      const mainEl = document.getElementById("main");
      if (mainEl) {
        gsap.set(mainEl, { clearProps: "all" });
        mainEl.removeAttribute("style");
      }
      ScrollTrigger.refresh();
      window.dispatchEvent(new CustomEvent(PAGE_READY_EVENT));
      return;
    }

    // Quick subtle reveal on <main id="main">
    const mainEl = document.getElementById("main");
    if (mainEl) {
      gsap.fromTo(
        mainEl,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.35,
          ease: "power2.out",
          clearProps: "all",
          onComplete: () => {
            gsap.set(mainEl, { clearProps: "all" });
            mainEl.removeAttribute("style");
            ScrollTrigger.refresh();
            window.dispatchEvent(new CustomEvent(PAGE_READY_EVENT));
          },
        }
      );
    } else {
      ScrollTrigger.refresh();
      window.dispatchEvent(new CustomEvent(PAGE_READY_EVENT));
    }


    const currentLabel = getRouteLabel(currentPathname);
    setLiveAnnouncement(`Navigated to ${currentLabel}`);
  }, [currentPathname, clearSafetyTimeout, executeReveal]);

  // CLEANUP ON UNMOUNT
  useEffect(() => {
    return () => {
      clearSafetyTimeout();
      if (activeTimelineRef.current) {
        activeTimelineRef.current.kill();
      }
      const mainEl = document.getElementById("main");
      if (mainEl) {
        gsap.set(mainEl, { clearProps: "all" });
        mainEl.removeAttribute("style");
      }
      if (lenis) {
        lenis.start();
      }
      window.__mbTransitioning = false;
    };
  }, [clearSafetyTimeout, lenis]);


  // Compute binary readout string for destination character
  const bitsArray = toBits(targetByteVal);
  const binaryString = bitsArray.map((bit) => (bit ? "1" : "0")).join("");

  return (
    <PageTransitionContext.Provider value={{ navigate, isTransitioning }}>
      {children}

      {/* Screen reader live announcement region */}
      <div
        aria-live="polite"
        role="status"
        className="sr-only"
      >
        {liveAnnouncement}
      </div>

      {/* Transition Overlay Curtain: z-[90] (below preloader z-[100], above navbar z-50) */}
      <div
        id="page-curtain"
        ref={curtainRef}
        aria-hidden="true"
        inert
        className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-ink text-paper pointer-events-none select-none overflow-hidden will-change-transform"
        style={{
          visibility: "hidden",
          transform: "translateY(100%)",
        }}
      >
        <div
          ref={contentGroupRef}
          className="flex flex-col items-center justify-center will-change-transform"
        >
          {/* Destination ByteMark (width 56px, tone paper, animated, Bit Blue last dot) */}
          <ByteMark
            value={targetByteVal}
            tone="paper"
            animated
            blueLast={true}
            className="w-[56px] h-[28px]"
          />

          {/* Mono readout: Geist Mono, 12px uppercase, tracking 0.08em, tabular-nums */}
          <div className="font-mono text-[12px] uppercase tracking-[0.08em] text-[#9AA0AA] tabular-nums mt-3 select-none">
            {binaryString} = {targetChar}
          </div>

          {/* Destination label in Geist, 14px, #F3F4F1 */}
          <div className="font-sans text-[14px] text-paper mt-1 select-none font-normal">
            {targetLabel}
          </div>
        </div>
      </div>
    </PageTransitionContext.Provider>
  );
}
