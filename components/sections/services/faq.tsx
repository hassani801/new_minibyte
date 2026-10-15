"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Plus } from "lucide-react";
import { Dot } from "@/components/brand/dot";
import { WordsPullUp } from "@/components/ui/words-pull-up";
import { FAQ, SERVICES_PAGE } from "@/lib/services";
import { cn } from "@/lib/utils";

const easeCurve = [0.16, 1, 0.3, 1] as const;

/**
 * FAQ Section
 *
 * Paper section providing an accessible accordion answering common client questions.
 *
 * Rules:
 * - data-nav-theme="paper"
 * - NO blue elements in this section.
 * - Single item expanded at a time; first item closed by default.
 * - Full keyboard navigation: ArrowUp, ArrowDown, Home, End, Enter, Space.
 * - 0fr -> 1fr grid template rows height animation.
 * - Plus icon rotates 45deg into an 'X' upon open.
 */
export function Faq() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const isInView = useInView(sectionRef, { once: true, margin: "-10% 0px" });

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (index + 1) % FAQ.length;
      buttonRefs.current[next]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (index - 1 + FAQ.length) % FAQ.length;
      buttonRefs.current[prev]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      buttonRefs.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      buttonRefs.current[FAQ.length - 1]?.focus();
    }
  };

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const { eyebrow, headline } = SERVICES_PAGE.faq;

  return (
    <section
      ref={sectionRef}
      id="faq"
      data-nav-theme="paper"
      aria-labelledby="faq-title"
      className="bg-background text-foreground py-24 lg:py-32 relative"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[4fr_8fr] gap-12 lg:gap-20 items-start">
          {/* LEFT: Eyebrow and Headline */}
          <div ref={headerRef} className="flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{
                opacity: isInView || prefersReducedMotion ? 1 : 0,
                y: isInView || prefersReducedMotion ? 0 : 14,
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.6,
                ease: easeCurve,
                delay: 0,
              }}
              className="flex items-center gap-2 select-none"
            >
              <span
                className="w-[6px] h-[6px] rounded-full bg-foreground shrink-0 inline-block"
                aria-hidden="true"
              />
              <span className="label-mono text-muted-foreground">{eyebrow}</span>
            </motion.div>

            <h2
              id="faq-title"
              className="text-[clamp(2.25rem,4.6vw,3.5rem)] font-medium tracking-[-0.03em] leading-[1.04] mt-5 text-foreground"
            >
              <WordsPullUp
                text={headline}
                play={isInView}
                delay={prefersReducedMotion ? 0 : 0.08}
                lastWordAddon={<Dot color="current" aria-hidden="true" />}
              />
            </h2>
          </div>

          {/* RIGHT: Accordion List */}
          <div className="border-t border-border w-full flex flex-col">
            {FAQ.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div key={index} className="border-b border-border">
                  <h3 className="m-0 p-0 text-inherit font-normal">
                    <button
                      ref={(el) => {
                        buttonRefs.current[index] = el;
                      }}
                      id={`faq-btn-${index}`}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-${index}`}
                      onClick={() => toggleItem(index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className={cn(
                        "group w-full flex justify-between items-center gap-6 py-6 text-left",
                        "text-lg md:text-xl font-medium text-foreground tracking-[-0.01em]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded-lg",
                        "transition-colors duration-200"
                      )}
                    >
                      <span>{item.q}</span>

                      {/* 32px circular indicator with rotating Plus icon */}
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full border border-border flex items-center justify-center shrink-0",
                          "text-muted-foreground group-hover:text-foreground group-hover:border-foreground/40",
                          "transition-colors duration-200"
                        )}
                        aria-hidden="true"
                      >
                        <Plus
                          className={cn(
                            "w-4 h-4 transition-transform duration-200",
                            prefersReducedMotion
                              ? ""
                              : isOpen && "rotate-45"
                          )}
                        />
                      </div>
                    </button>
                  </h3>

                  {/* Accordion Panel: 0fr -> 1fr grid transition */}
                  <div
                    id={`faq-${index}`}
                    role="region"
                    aria-labelledby={`faq-btn-${index}`}
                    className={cn(
                      "grid transition-[grid-template-rows]",
                      prefersReducedMotion ? "duration-0" : "duration-300 ease-out"
                    )}
                    style={{
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                    }}
                  >
                    <div className="overflow-hidden">
                      <p className="text-base text-muted-foreground max-w-[60ch] pb-6 leading-relaxed m-0 font-normal">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Faq;
