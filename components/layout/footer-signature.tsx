"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { toBits } from "@/lib/byte";
import { PAGE_READY_EVENT } from "@/lib/transition";
import { cn } from "@/lib/utils";

const easeCurve = [0.16, 1, 0.3, 1] as const;

const SIGNATURE_LETTERS = ["m", "i", "n", "i", "b", "y", "t", "e"] as const;
// ASCII for 'm' = 109 = 01101101
const M_BITS = toBits(109);

interface LetterCellProps {
  char: string;
  index: number;
  playIntro: boolean;
  prefersReducedMotion: boolean;
}

function LetterCell({
  char,
  index,
  playIntro,
  prefersReducedMotion,
}: LetterCellProps) {
  const [displayChar, setDisplayChar] = useState<string>(char);
  const isScramblingRef = useRef(false);

  const scramble = useCallback(
    (durationMs: number = 300) => {
      if (prefersReducedMotion) {
        setDisplayChar(char);
        return;
      }

      isScramblingRef.current = true;
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTime;
        if (elapsed < durationMs) {
          const rand = Math.random() > 0.5 ? "1" : "0";
          setDisplayChar(rand);
          requestAnimationFrame(tick);
        } else {
          setDisplayChar(char);
          isScramblingRef.current = false;
        }
      };

      requestAnimationFrame(tick);
    },
    [char, prefersReducedMotion]
  );

  // Entrance decode sequence
  useEffect(() => {
    if (!playIntro || prefersReducedMotion) {
      setDisplayChar(char);
      return;
    }

    const timer = setTimeout(() => {
      scramble(300);
    }, index * 70);

    return () => clearTimeout(timer);
  }, [playIntro, index, scramble, char, prefersReducedMotion]);

  const handleMouseEnter = () => {
    if (!isScramblingRef.current) {
      scramble(280);
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      className="relative flex items-center justify-center cursor-default select-none group"
      style={{ width: "1ch" }}
    >
      {/* Invisible real character reserving exact 1ch width in flow */}
      <span className="invisible select-none" aria-hidden="true">
        {char}
      </span>

      {/* Rendered animated layer */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center font-normal lowercase tracking-normal text-center"
        style={{ color: "rgba(243, 244, 241, 0.92)" }}
      >
        {displayChar}
      </span>
    </div>
  );
}

interface DotCellProps {
  bit: boolean;
  index: number;
  playIntro: boolean;
  prefersReducedMotion: boolean;
}

function DotCell({
  bit,
  index,
  playIntro,
  prefersReducedMotion,
}: DotCellProps) {
  const isBlue = index === 7;
  const dotSize = bit ? "0.2em" : "0.07em";
  const dotColor = isBlue ? "var(--bit-blue)" : "rgba(243, 244, 241, 0.92)";

  // The blue dot receives a signature pop & pulse
  const scaleKeyframes = prefersReducedMotion
    ? 1
    : isBlue
    ? [0, 1, 1.3, 1]
    : [0, 1];

  return (
    <div
      className="flex items-center justify-center select-none"
      style={{ width: "1ch", height: "0.25em" }}
    >
      <motion.span
        initial={{
          scale: prefersReducedMotion ? 1 : 0,
          opacity: prefersReducedMotion ? 1 : 0,
        }}
        animate={{
          scale: playIntro || prefersReducedMotion ? scaleKeyframes : 0,
          opacity: playIntro || prefersReducedMotion ? 1 : 0,
        }}
        transition={{
          duration: prefersReducedMotion ? 0 : isBlue ? 0.5 : 0.35,
          ease: easeCurve,
          delay: prefersReducedMotion ? 0 : 0.75 + index * 0.05,
        }}
        className="rounded-full inline-block shrink-0"
        style={{
          width: dotSize,
          height: dotSize,
          backgroundColor: dotColor,
        }}
      />
    </div>
  );
}

export interface FooterSignatureProps {
  className?: string;
}

/**
 * FooterSignature
 *
 * Grand brand closure spanning the full width of the container:
 * - 20cqw fluid monospace font size (calc fallback for older engines).
 * - Decode reveal: 8 letters scramble 0/1 with stagger, followed by dot pop-ins.
 * - Final dot is Bit Blue (the ONLY blue element in the footer).
 * - Single letter re-scramble on hover.
 */
export function FooterSignature({ className }: FooterSignatureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-10% 0px" });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  // Debounced ScrollTrigger refresh after font loading & signature layout
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleRefresh = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        try {
          const { ScrollTrigger } = await import("gsap/ScrollTrigger");
          ScrollTrigger.refresh();
        } catch {
          // No-op if GSAP not loaded
        }
      }, 150);
    };

    window.addEventListener(PAGE_READY_EVENT, handleRefresh);

    const observer = new ResizeObserver(handleRefresh);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(handleRefresh);
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener(PAGE_READY_EVENT, handleRefresh);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "w-full overflow-hidden mt-12 select-none",
        "[container-type:inline-size]",
        className
      )}
    >
      {/* Fallback CSS for browsers without container query length units */}
      <style
        dangerouslySetInnerHTML={{
          __html:
            "@supports not (font-size: 1cqw) { .mb-signature-grid { font-size: calc((100vw - 3rem) / 4.8) !important; } }",
        }}
      />

      <div
        className="mb-signature-grid inline-grid w-full justify-items-center select-none"
        style={{
          fontSize: "20cqw",
          fontFamily: "var(--font-mono)",
          lineHeight: 1,
          letterSpacing: 0,
          gridTemplateColumns: "repeat(8, 1ch)",
          rowGap: "0.35em",
          marginBottom: "-0.12em",
        }}
      >
        {/* ROW 1: 8 Letters with independent decode scrambles */}
        {SIGNATURE_LETTERS.map((char, i) => (
          <LetterCell
            key={`char-${i}`}
            char={char}
            index={i}
            playIntro={inView}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}

        {/* ROW 2: 8 Bits under each letter */}
        {M_BITS.map((bit, i) => (
          <DotCell
            key={`dot-${i}`}
            bit={bit}
            index={i}
            playIntro={inView}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </div>
    </div>
  );
}

export default FooterSignature;
