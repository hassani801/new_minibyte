"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const easeCurve = [0.16, 1, 0.3, 1] as const;

interface EngagementAnimatedProps {
  facts: readonly { label: string; value: string }[];
  needFromYou: readonly string[];
  notIncluded: readonly string[];
}

export function EngagementAnimated({
  facts,
  needFromYou,
  notIncluded,
}: EngagementAnimatedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col w-full">
      {/* Facts Spec Table (<dl>) */}
      <dl className="w-full flex flex-col border-b border-border m-0">
        {facts.map((fact, index) => (
          <motion.div
            key={fact.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: isInView || prefersReducedMotion ? 1 : 0,
              y: isInView || prefersReducedMotion ? 0 : 12,
            }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.5,
              ease: easeCurve,
              delay: prefersReducedMotion ? 0 : index * 0.08,
            }}
            className="flex items-center justify-between gap-4 py-3.5 sm:py-4 border-t border-border"
          >
            <dt className="data-mono text-xs sm:text-sm text-muted-foreground">
              {fact.label}
            </dt>
            <dd className="data-mono text-xs sm:text-sm text-foreground tabular-nums m-0 text-right break-words">
              {fact.value}
            </dd>
          </motion.div>
        ))}
      </dl>

      {/* 2-Column Grid: What we need from you & Not included */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-8 md:mt-12 w-full">
        {/* What we need from you */}
        <div className="flex flex-col">
          <span className="label-mono text-xs text-muted-foreground">
            WHAT WE NEED FROM YOU
          </span>
          <ul
            role="list"
            className="mt-4 p-0 divide-y divide-border border-y border-border list-none"
          >
            {needFromYou.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: isInView || prefersReducedMotion ? 1 : 0,
                  y: isInView || prefersReducedMotion ? 0 : 10,
                }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.4,
                  delay: prefersReducedMotion ? 0 : 0.2 + index * 0.06,
                }}
                className="flex items-start gap-3 py-3 text-sm md:text-base text-foreground leading-relaxed"
              >
                {/* 6px muted dot */}
                <span
                  className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 shrink-0 mt-2"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Not included */}
        <div className="flex flex-col">
          <span className="label-mono text-xs text-muted-foreground">
            NOT INCLUDED
          </span>
          <ul
            role="list"
            className="mt-4 p-0 divide-y divide-border border-y border-border list-none"
          >
            {notIncluded.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: isInView || prefersReducedMotion ? 1 : 0,
                  y: isInView || prefersReducedMotion ? 0 : 10,
                }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.4,
                  delay: prefersReducedMotion ? 0 : 0.25 + index * 0.06,
                }}
                className="flex items-start gap-3 py-3 text-sm md:text-base text-foreground leading-relaxed"
              >
                {/* 8px x 1px dash */}
                <span
                  className="w-2 h-[1px] bg-muted-foreground/60 shrink-0 mt-2.5"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
