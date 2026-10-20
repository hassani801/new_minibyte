"use client";

import React, { useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export interface FilterChipsProps {
  options: readonly string[] | string[];
  value: string;
  onChange: (v: string) => void;
  label: string;
  allLabel?: string;
  className?: string;
}

/**
 * FilterChips
 *
 * Accessible, horizontally scrollable chip group with roving keyboard focus.
 * - Snap-x scrolling on mobile with 44px minimum touch targets
 * - Keyboard navigation: ArrowLeft/Right, Home/End, Enter/Space
 * - aria-pressed on each option button
 */
export function FilterChips({
  options,
  value,
  onChange,
  label,
  allLabel = "All",
  className,
}: FilterChipsProps) {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const count = options.length;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (index + 1) % count;
      buttonRefs.current[nextIndex]?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = (index - 1 + count) % count;
      buttonRefs.current[prevIndex]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      buttonRefs.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      buttonRefs.current[count - 1]?.focus();
    }
  };

  return (
    <div
      role="group"
      aria-label={label}
      className={cn("relative -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 max-w-full overflow-hidden", className)}
    >
      <div className="flex items-center gap-2 overflow-x-auto snap-x flex-nowrap whitespace-nowrap scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1">
        {options.map((opt, index) => {
          const isSelected = value === opt;
          const displayLabel = opt === "All" ? allLabel : opt;

          return (
            <button
              key={opt}
              ref={(el) => {
                buttonRefs.current[index] = el;
              }}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(opt)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cn(
                "snap-start shrink-0 min-h-[44px] h-10 px-4 rounded-full border text-xs font-mono uppercase tracking-[0.08em] transition-colors duration-200 select-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground",
                isSelected
                  ? "bg-foreground text-background border-foreground font-medium"
                  : "bg-card text-muted-foreground border-border [@media(hover:hover)]:hover:border-foreground/40 [@media(hover:hover)]:hover:text-foreground"
              )}
            >
              {displayLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * useQueryParamState
 *
 * Synchronizes filter state with URL search query parameter shallowly.
 * - Initial SSR render equals allValue ("All") for crawlability.
 * - Reads query param after mount, falling back to allValue for unknown params.
 * - Writes via window.history.replaceState (no page transition, no scroll jump, no curtain).
 */
export function useQueryParamState(
  key: string,
  valid: readonly string[] | string[],
  allValue = "All"
): [string, (v: string) => void] {
  const searchParams = useSearchParams();
  const [state, setState] = useState(allValue);

  useEffect(() => {
    const current = searchParams.get(key);
    if (current && (valid.includes(current) || current === allValue)) {
      setState(current);
    } else {
      setState(allValue);
    }
  }, [searchParams, key, valid, allValue]);

  const setQueryParam = (newValue: string) => {
    setState(newValue);

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (newValue === allValue) {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, newValue);
      }
      window.history.replaceState(null, "", url.toString());
    }
  };

  return [state, setQueryParam];
}
