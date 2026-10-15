"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ByteMark } from "@/components/brand/byte-mark";
import { ScrambleText } from "@/components/ui/scramble-text";
import { TransitionLink } from "@/components/layout/transition-link";
import { toBits } from "@/lib/byte";
import { Capability } from "@/lib/constants";
import { cn } from "@/lib/utils";

const easeCurve = [0.16, 1, 0.3, 1] as const;

export interface CapabilityRowProps {
  item: Capability;
  index: number;
}

/**
 * CapabilityRow component renders an interactive capability item.
 * Features:
 * - 4x2 ByteMark icon representing index + 1 in binary (tone="mono", blueLast={false})
 * - Scrambling 8-bit binary readout on hover/focus via ScrambleText
 * - Directional drawing bottom highlight line (enters left, exits right)
 * - Scale-in background card hover state
 * - Clean scroll reveal animation via framer-motion
 * - Strict reduced motion and touch device support
 */
export function CapabilityRow({ item, index }: CapabilityRowProps) {
  const rowRef = useRef<HTMLLIElement>(null);
  const inView = useInView(rowRef, { once: true, margin: "-10% 0px" });

  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  // Format index + 1 as an 8-bit binary string (e.g. 1 -> "00000001")
  const value = index + 1;
  const binaryString = toBits(value)
    .map((b) => (b ? "1" : "0"))
    .join("");

  return (
    <motion.li
      ref={rowRef}
      initial={{ opacity: 0, y: 24 }}
      animate={{
        opacity: inView || prefersReducedMotion ? 1 : 0,
        y: inView || prefersReducedMotion ? 0 : 24,
      }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.7,
        ease: easeCurve,
        delay: prefersReducedMotion ? 0 : (index % 3) * 0.06,
      }}
      className="relative list-none"
    >
      <TransitionLink
        href={`/services#${item.slug}`}
        aria-label={item.title}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        className="group relative grid items-start gap-x-6 gap-y-3 py-7 md:py-9 border-b border-border grid-cols-[auto_1fr_auto] md:grid-cols-[88px_1fr_auto] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl active:scale-[0.995] transition-transform select-none w-full"
      >
        {/* Subtle Hover Background Card Layer */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-0 -inset-x-4 md:-inset-x-6 rounded-xl bg-card transition-all duration-200 z-0",
            "opacity-0",
            prefersReducedMotion ? "scale-y-100" : "scale-y-[0.96]",
            "[@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:scale-y-100 group-focus-visible:opacity-100 group-focus-visible:scale-y-100"
          )}
        />

        {/* Directional Drawing Bottom Highlight Line */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute bottom-0 inset-x-0 h-px bg-foreground z-10 transition-transform duration-[400ms] ease-out",
            prefersReducedMotion ? "hidden" : "scale-x-0 origin-right",
            "[@media(hover:hover)]:group-hover:scale-x-100 [@media(hover:hover)]:group-hover:origin-left group-focus-visible:scale-x-100 group-focus-visible:origin-left"
          )}
        />

        {/* COLUMN 1: Byte Icon & Binary String */}
        <div
          aria-hidden="true"
          className="relative z-10 flex flex-col items-start pt-1 select-none"
        >
          <ByteMark
            value={value}
            tone="mono"
            blueLast={false}
            className="w-10 md:w-12 text-muted-foreground transition-colors duration-300 [@media(hover:hover)]:group-hover:text-foreground group-focus-visible:text-foreground"
            aria-hidden
          />
          <div className="hidden md:block data-mono text-xs text-muted-foreground mt-2.5 tabular-nums">
            <ScrambleText characterSet="01" trigger={isHovered}>
              {binaryString}
            </ScrambleText>
          </div>
        </div>

        {/* COLUMN 2: Content (Title, Description, Tags) */}
        <div className="relative z-10 flex flex-col items-start text-left pr-2">
          <h3 className="text-xl md:text-2xl font-medium tracking-[-0.02em] text-foreground transition-colors">
            {item.title}
          </h3>

          <p className="text-sm md:text-base text-muted-foreground max-w-[560px] mt-2 leading-relaxed font-normal">
            {item.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="label-mono text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground transition-colors [@media(hover:hover)]:group-hover:border-muted-foreground group-focus-visible:border-muted-foreground select-none"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* COLUMN 3: Arrow Button */}
        <div className="relative z-10 flex items-start pt-1">
          <span
            aria-hidden="true"
            className={cn(
              "w-8 h-8 md:w-9 md:h-9 rounded-full border border-border grid place-items-center shrink-0 transition-all duration-[250ms] select-none",
              "[@media(hover:hover)]:group-hover:bg-foreground [@media(hover:hover)]:group-hover:text-background [@media(hover:hover)]:group-hover:border-foreground group-focus-visible:bg-foreground group-focus-visible:text-background group-focus-visible:border-foreground"
            )}
          >
            <ArrowUpRight
              className={cn(
                "w-4 h-4 transition-transform duration-[250ms]",
                !prefersReducedMotion &&
                  "[@media(hover:hover)]:group-hover:translate-x-[1px] [@media(hover:hover)]:group-hover:-translate-y-[1px] group-focus-visible:translate-x-[1px] group-focus-visible:-translate-y-[1px]"
              )}
            />
          </span>
        </div>
      </TransitionLink>
    </motion.li>
  );
}

export default CapabilityRow;
