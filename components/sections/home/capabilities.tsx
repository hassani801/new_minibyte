"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Dot } from "@/components/brand/dot";
import { WordsPullUp } from "@/components/ui/words-pull-up";
import { TransitionLink } from "@/components/layout/transition-link";
import { CAPABILITIES, CAPABILITIES_COPY } from "@/lib/constants";

const easeCurve = [0.16, 1, 0.3, 1] as const;

/**
 * Capabilities Section — Figma reference style
 *
 * Section header: eyebrow (blue) + bold headline left, lead copy + CTA right.
 * Below: 4 numbered cards in a horizontal grid (01–04), where the last card
 * is highlighted in ink to draw visual focus — matching the reference "Run" card.
 */
export function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const isHeaderInView = useInView(headerRef, { once: true, margin: "-10% 0px" });
  const isCardsInView = useInView(cardsRef, { once: true, margin: "-10% 0px" });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      data-nav-theme="ink"
      aria-labelledby="capabilities-title"
      className="theme-ink bg-background text-foreground"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-8 py-16 md:py-24 lg:py-32">

        {/* SECTION HEADER: eyebrow + headline left, lead + CTA right */}
        <div
          ref={headerRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 items-start mb-12 lg:mb-20"
        >
          {/* Left: eyebrow + headline */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{
                opacity: isHeaderInView || prefersReducedMotion ? 1 : 0,
                y: isHeaderInView || prefersReducedMotion ? 0 : 12,
              }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: easeCurve }}
              className="label-eyebrow mb-3 sm:mb-4 select-none"
            >
              {CAPABILITIES_COPY.eyebrow}
            </motion.p>

            <h2
              id="capabilities-title"
              className="text-[clamp(2rem,4.5vw,3.5rem)] font-semibold tracking-[-0.03em] leading-[1.06] text-foreground"
            >
              <WordsPullUp
                text={CAPABILITIES_COPY.headline}
                play={isHeaderInView}
                delay={prefersReducedMotion ? 0 : 0.06}
                lastWordAddon={<Dot color="blue" />}
              />
            </h2>
          </div>

          {/* Right: lead copy + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: isHeaderInView || prefersReducedMotion ? 1 : 0,
              y: isHeaderInView || prefersReducedMotion ? 0 : 12,
            }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: easeCurve, delay: prefersReducedMotion ? 0 : 0.1 }}
            className="flex flex-col items-start justify-center md:pt-2"
          >
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-normal">
              {CAPABILITIES_COPY.lead}
            </p>

            <TransitionLink
              href={CAPABILITIES_COPY.cta.href}
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              <span>{CAPABILITIES_COPY.cta.label}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </TransitionLink>
          </motion.div>
        </div>

        {/* CAPABILITY CARDS: horizontal numbered grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {CAPABILITIES.map((capability, index) => {
            const numStr = String(index + 1).padStart(2, "0");
            const isLastCard = index === CAPABILITIES.length - 1;

            return (
              <motion.div
                key={capability.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isCardsInView || prefersReducedMotion ? 1 : 0,
                  y: isCardsInView || prefersReducedMotion ? 0 : 20,
                }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.6,
                  ease: easeCurve,
                  delay: prefersReducedMotion ? 0 : index * 0.07,
                }}
              >
                <TransitionLink
                  href={`/services#${capability.slug}`}
                  className={`group flex flex-col p-6 md:p-7 rounded-2xl border h-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    isLastCard
                      ? "theme-ink bg-foreground text-background border-foreground hover:opacity-90"
                      : "bg-card text-foreground border-border hover:border-foreground/30"
                  }`}
                >
                  {/* Number */}
                  <span
                    className={`label-mono mb-5 select-none ${
                      isLastCard ? "text-background/60" : "text-bit-blue"
                    }`}
                    style={isLastCard ? {} : { color: "var(--bit-blue)" }}
                  >
                    {numStr}
                  </span>

                  {/* Title */}
                  <h3
                    className={`text-xl font-semibold tracking-[-0.02em] leading-snug mb-3 ${
                      isLastCard ? "text-background" : "text-foreground"
                    }`}
                  >
                    {capability.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={`text-sm leading-relaxed font-normal mb-6 flex-1 ${
                      isLastCard ? "text-background/70" : "text-muted-foreground"
                    }`}
                  >
                    {capability.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {capability.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`label-mono text-[10px] px-2 py-1 rounded-full border select-none ${
                          isLastCard
                            ? "border-background/30 text-background/60"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </TransitionLink>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Capabilities;
