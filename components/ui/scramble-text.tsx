"use client";

import React, { ElementType, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface ScrambleTextProps {
  children: string;
  as?: ElementType;
  characterSet?: string;
  duration?: number;
  trigger?: boolean;
  className?: string;
}

/**
 * ScrambleText renders a text element that scrambles through random characters
 * (defaulting to binary "01") and resolves from left to right.
 *
 * Layout Stability:
 * An invisible copy of the final text reserves exact width and height in the flow,
 * while the scrambling animation renders in an absolutely positioned layer on top.
 * Screen readers always receive the static real text.
 */
export function ScrambleText({
  children,
  as: Component = "span",
  characterSet = "01",
  duration = 0.45,
  trigger = false,
  className,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(children);
  const prevTriggerRef = useRef(trigger);
  const rafIdRef = useRef<number | null>(null);

  // Sync when children text changes
  useEffect(() => {
    setDisplayText(children);
  }, [children]);

  useEffect(() => {
    // Only trigger when trigger flips from false to true
    const justTriggered = trigger && !prevTriggerRef.current;
    prevTriggerRef.current = trigger;

    if (!justTriggered) {
      return;
    }

    // Check prefers-reduced-motion
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplayText(children);
      return;
    }

    const totalDuration = Math.max(0.1, duration) * 1000;
    const startTime = performance.now();
    const len = children.length;

    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

    let lastTick = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / totalDuration);

      // Throttle text scramble mutations to ~30ms intervals
      if (now - lastTick >= 30 || progress >= 1) {
        lastTick = now;

        const resolvedCount = Math.floor(progress * len);
        let result = "";

        for (let i = 0; i < len; i++) {
          const char = children[i];
          if (i < resolvedCount || progress >= 1) {
            result += char;
          } else if (char === " ") {
            result += " ";
          } else {
            const randIdx = Math.floor(Math.random() * characterSet.length);
            result += characterSet[randIdx];
          }
        }

        setDisplayText(result);
      }

      if (progress < 1) {
        rafIdRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayText(children);
      }
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      const rafId = rafIdRef.current;
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [trigger, children, characterSet, duration]);

  return (
    <Component className={cn("relative inline-block", className)}>
      {/* Invisible layout spacer preserving exact text width and height */}
      <span className="invisible select-none" aria-hidden="true">
        {children}
      </span>

      {/* Accessible real text for screen readers */}
      <span className="sr-only">{children}</span>

      {/* Visually rendered scrambling layer */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center select-none pointer-events-none"
      >
        {displayText}
      </span>
    </Component>
  );
}

export default ScrambleText;
