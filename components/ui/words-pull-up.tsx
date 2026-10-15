"use client";

import React, { useEffect, useState } from "react";
import { motion, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

export interface WordsPullUpProps {
  text: string;
  play?: boolean;
  delay?: number;
  stagger?: number;
  className?: string;
  as?: "span" | "div";
  lastWordAddon?: React.ReactNode;
}

const easeCurve = [0.16, 1, 0.3, 1] as const;

/**
 * WordsPullUp reveals headline text word-by-word with an upward sliding mask.
 * Layout-stable: each word mask reserves its natural flow size from the start.
 * Accessible: full text exposed via aria-label on the root wrapper.
 */
export function WordsPullUp({
  text,
  play = true,
  delay = 0,
  stagger = 0.08,
  className,
  as: Component = "span",
  lastWordAddon,
}: WordsPullUpProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const words = text.split(" ");

  return (
    <Component
      aria-label={text}
      className={cn("inline-block", className)}
    >
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        const transitionConfig: Transition = {
          duration: 0.7,
          ease: easeCurve,
          delay: delay + i * stagger,
        };

        return (
          <span
            key={`${word}-${i}`}
            className={cn(
              "inline-block overflow-hidden align-top leading-[inherit]",
              !isLast && "mr-[0.25em]"
            )}
            aria-hidden="true"
          >
            {prefersReducedMotion ? (
              <span className="inline-block leading-[inherit]">
                {word}
                {isLast && lastWordAddon}
              </span>
            ) : (
              <motion.span
                className="inline-block leading-[inherit]"
                initial={{ y: "110%" }}
                animate={{ y: play ? "0%" : "110%" }}
                transition={transitionConfig}
              >
                {word}
                {isLast && lastWordAddon}
              </motion.span>
            )}
          </span>
        );
      })}
    </Component>
  );
}

export default WordsPullUp;
