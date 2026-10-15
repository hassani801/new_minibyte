"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ByteMark } from "@/components/brand/byte-mark";
import { useLenis } from "@/components/providers/smooth-scroll";
import { PRELOADER_EVENT } from "@/lib/preloader";

const TARGET_WORD = "minibyte";
const SCRAMBLE_CHARS = ["0", "1"];

/**
 * Returns formatted character for ASCII code.
 * ASCII 33..126 shows char; otherwise shows dot "·".
 */
function getCharRepresentation(val: number): string {
  if (val >= 33 && val <= 126) {
    return String.fromCharCode(val);
  }
  return "·";
}

/**
 * Waits for the document and fonts to fully load, with a 6-second fallback cap.
 */
function waitForPageReadiness(): Promise<void> {
  return new Promise((resolve) => {
    let resolved = false;
    const finish = () => {
      if (!resolved) {
        resolved = true;
        resolve();
      }
    };

    // 6-second hard cap fallback
    const timer = setTimeout(finish, 6000);

    const checkFonts = () => {
      if (typeof document !== "undefined" && "fonts" in document) {
        document.fonts.ready
          .then(() => {
            clearTimeout(timer);
            finish();
          })
          .catch(() => {
            clearTimeout(timer);
            finish();
          });
      } else {
        clearTimeout(timer);
        finish();
      }
    };

    if (typeof document !== "undefined" && document.readyState === "complete") {
      checkFonts();
    } else if (typeof window !== "undefined") {
      window.addEventListener(
        "load",
        () => {
          checkFonts();
        },
        { once: true }
      );
    } else {
      finish();
    }
  });
}

export function Preloader() {
  const lenis = useLenis();

  // State
  const [isMounted, setIsMounted] = useState(true);
  const [isDone, setIsDone] = useState(false);
  const [value, setValue] = useState(0);
  const [isLanded, setIsLanded] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [decodedChars, setDecodedChars] = useState<string[]>(() =>
    Array(TARGET_WORD.length).fill("0")
  );

  // Refs for GSAP & DOM manipulation
  const curtainRef = useRef<HTMLDivElement>(null);
  const contentGroupRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLDivElement>(null);
  const decodeRef = useRef<HTMLDivElement>(null);
  const hasDispatchedRef = useRef(false);

  // Dispatch completion event once and set flags
  const dispatchDone = useCallback(() => {
    if (hasDispatchedRef.current) return;
    hasDispatchedRef.current = true;
    if (typeof window !== "undefined") {
      window.__mbPreloaderDone = true;
      window.dispatchEvent(new CustomEvent(PRELOADER_EVENT));
    }
  }, []);

  useEffect(() => {
    // 1. Check replay force query parameter (?preloader=1)
    const isForced =
      typeof window !== "undefined" &&
      window.location.search.includes("preloader=1");

    // 2. Check if already preloaded in this browser session
    let isAlreadyPreloaded = false;
    try {
      isAlreadyPreloaded =
        !isForced && !!sessionStorage.getItem("mb-preloaded");
    } catch {
      // ignore security / private browsing errors
    }

    // 3. Check reduced-motion preference
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isAlreadyPreloaded || prefersReducedMotion) {
      document.documentElement.dataset.preloader = "done";
      try {
        sessionStorage.setItem("mb-preloaded", "1");
      } catch {}
      dispatchDone();
      setIsDone(true);
      setIsMounted(false);
      return;
    }

    // Lock scrolling while preloader runs
    if (lenis) {
      lenis.stop();
    }
    document.documentElement.style.overflow = "hidden";

    // Set initial curtain style
    if (curtainRef.current) {
      curtainRef.current.style.borderBottomLeftRadius = "0% 0%";
      curtainRef.current.style.borderBottomRightRadius = "0% 0%";
    }

    // Animation frame / timer ids for cleanup
    let decodeRafId: number | null = null;
    let pulseTimer: NodeJS.Timeout | null = null;

    // Start ready promise early
    const pageReadyPromise = waitForPageReadiness();

    // Context for all GSAP tweens
    const ctx = gsap.context(() => {
      const masterTl = gsap.timeline();

      // Counter animation: 0.15s -> 1.35s (duration 1.2s, ease power2.inOut)
      const counter = { v: 0 };
      let lastVal = 0;

      masterTl.to(
        counter,
        {
          v: 109,
          duration: 1.2,
          ease: "power2.inOut",
          onUpdate: () => {
            const rounded = Math.round(counter.v);
            if (rounded !== lastVal) {
              lastVal = rounded;
              setValue(rounded);
            }
          },
        },
        0.15
      );

      // LAND: at 1.35s, readout turns to paper color, last dot turns Bit Blue & pulses (1 -> 1.25 -> 1, 0.25s)
      masterTl.call(
        () => {
          setIsLanded(true);
          setIsPulsing(true);
          pulseTimer = setTimeout(() => {
            setIsPulsing(false);
          }, 250);
        },
        undefined,
        1.35
      );

      // Readout line fades out at 1.60s (duration 0.2s)
      masterTl.to(
        readoutRef.current,
        {
          opacity: 0,
          duration: 0.2,
          ease: "power1.out",
        },
        1.6
      );

      // DECODE: begins at 1.60s
      masterTl.call(
        () => {
          setIsDecoding(true);
          const decodeStartTime = performance.now();
          let lastScrambleTick = 0;
          let currentChars: string[] = Array(TARGET_WORD.length).fill("0");

          const runDecodeLoop = (timestamp: number) => {
            const elapsed = timestamp - decodeStartTime;
            let allResolved = true;

            const shouldFlicker = timestamp - lastScrambleTick >= 35;
            if (shouldFlicker) {
              lastScrambleTick = timestamp;
            }

            const nextChars: string[] = [];
            for (let i = 0; i < TARGET_WORD.length; i++) {
              const charStart = i * 60; // 0.06s stagger per letter
              const charEnd = charStart + 250; // ~0.25s scramble duration per letter

              if (elapsed >= charEnd) {
                nextChars.push(TARGET_WORD[i]);
              } else {
                allResolved = false;
                if (shouldFlicker) {
                  const randomBit =
                    SCRAMBLE_CHARS[
                      Math.floor(Math.random() * SCRAMBLE_CHARS.length)
                    ];
                  nextChars.push(randomBit);
                } else {
                  nextChars.push(currentChars[i] || "0");
                }
              }
            }

            if (shouldFlicker || allResolved) {
              currentChars = nextChars;
              setDecodedChars(
                allResolved ? TARGET_WORD.split("") : nextChars
              );
            }

            if (allResolved) {
              // Wait for page readiness (readyState complete + fonts ready, or 6s cap)
              pageReadyPromise.then(() => {
                triggerExit();
              });
            } else {
              decodeRafId = requestAnimationFrame(runDecodeLoop);
            }
          };

          decodeRafId = requestAnimationFrame(runDecodeLoop);
        },
        undefined,
        1.6
      );

      // EXIT timeline builder
      const triggerExit = () => {
        // Mark preloaded in storage & html dataset at exit start
        try {
          sessionStorage.setItem("mb-preloaded", "1");
        } catch {}
        document.documentElement.dataset.preloader = "done";

        // Unlock scroll on exit start
        if (lenis) {
          lenis.start();
        }
        document.documentElement.style.overflow = "";

        const exitTl = gsap.timeline({
          onComplete: () => {
            if (curtainRef.current) {
              curtainRef.current.style.display = "none";
              curtainRef.current.style.pointerEvents = "none";
              curtainRef.current.setAttribute("aria-busy", "false");
            }
            dispatchDone();
            setIsDone(true);
            setIsMounted(false);
          },
        });

        // Content group scales to 1.15 and fades to opacity 0 (duration 0.4, ease power2.in)
        if (contentGroupRef.current) {
          exitTl.to(
            contentGroupRef.current,
            {
              scale: 1.15,
              opacity: 0,
              duration: 0.4,
              ease: "power2.in",
            },
            0
          );
        }

        // Curtain translates y to -105% (duration 0.9, ease power3.inOut),
        // bottom corners round to "50% 12%". Starts 0.1s after content starts fading.
        if (curtainRef.current) {
          exitTl.to(
            curtainRef.current,
            {
              yPercent: -105,
              borderBottomLeftRadius: "50% 12%",
              borderBottomRightRadius: "50% 12%",
              duration: 0.9,
              ease: "power3.inOut",
            },
            0.1
          );
        }
      };
    }, curtainRef);

    return () => {
      ctx.revert();
      if (decodeRafId !== null) {
        cancelAnimationFrame(decodeRafId);
      }
      if (pulseTimer !== null) {
        clearTimeout(pulseTimer);
      }
      if (lenis) {
        lenis.start();
      }
      document.documentElement.style.overflow = "";
    };
  }, [lenis, dispatchDone]);

  if (!isMounted) {
    return null;
  }

  const charDisplay = getCharRepresentation(value);

  return (
    <div
      ref={curtainRef}
      id="preloader"
      role="status"
      aria-live="polite"
      aria-busy={!isDone}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink text-paper overflow-hidden select-none"
    >
      <span className="sr-only">Loading minibyte</span>

      <div
        ref={contentGroupRef}
        className="flex flex-col items-center justify-center will-change-transform"
      >
        {/* ByteMark Counter: width 72px mobile / 96px desktop */}
        <ByteMark
          value={value}
          tone="paper"
          blueLast={isLanded}
          pulseLast={isPulsing}
          animated
          className="w-[72px] h-[36px] md:w-[96px] md:h-[48px]"
        />

        {/* Readout line & decoded text slot below the mark */}
        <div className="relative mt-6 flex items-center justify-center min-h-[2.5rem]">
          {/* Readout Line: 12px Geist Mono, uppercase, tracking 0.08em, tabular-nums */}
          <div
            ref={readoutRef}
            className="font-mono text-[12px] uppercase tracking-[0.08em] tabular-nums transition-colors duration-150"
            style={{
              color: isLanded ? "var(--paper)" : "#9AA0AA",
            }}
          >
            {value} = {charDisplay}
          </div>

          {/* Decoded Word 'minibyte': Geist Mono, clamp(1.5rem, 4vw, 2.25rem), color #F3F4F1 */}
          <div
            ref={decodeRef}
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center font-mono font-medium tracking-tight text-paper text-[clamp(1.5rem,4vw,2.25rem)] select-none tabular-nums"
            style={{
              opacity: isDecoding ? 1 : 0,
              pointerEvents: isDecoding ? "auto" : "none",
            }}
          >
            {decodedChars.map((ch, idx) => (
              <span key={idx} className="inline-block">
                {ch}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
