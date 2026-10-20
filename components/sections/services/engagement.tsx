import React from "react";
import { Dot } from "@/components/brand/dot";
import { WordsPullUp } from "@/components/ui/words-pull-up";
import { ENGAGEMENT, SERVICES_PAGE } from "@/lib/services";
import { EngagementAnimated } from "./engagement-client";

/**
 * Engagement Section: "How we engage"
 *
 * Server Component rendered in Ink theme.
 * Composes sticky narrative left column and spec-table / expectations right column.
 *
 * Rules:
 * - data-nav-theme="ink", className "theme-ink bg-background text-foreground"
 * - NO blue elements in this section.
 * - Sticky left column on desktop.
 * - Hides empty/placeholder notes.
 */
export function Engagement() {
  const { eyebrow, headline } = SERVICES_PAGE.engagement;
  const { facts, needFromYou, notIncluded, note } = ENGAGEMENT;

  const showNote = Boolean(
    note && !note.trim().startsWith("[PLACEHOLDER") && note.trim().length > 0
  );

  return (
    <section
      id="engagement"
      data-nav-theme="ink"
      aria-labelledby="engagement-title"
      className="theme-ink bg-background text-foreground py-16 md:py-24 lg:py-32 relative"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[4fr_8fr] gap-10 md:gap-12 lg:gap-20 items-start">
          {/* LEFT: Sticky Heading & Eyebrow */}
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+48px)] self-start flex flex-col items-start">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 select-none">
              <span
                className="w-[6px] h-[6px] rounded-full bg-paper shrink-0 inline-block"
                aria-hidden="true"
              />
              <span className="label-mono text-muted-foreground">{eyebrow}</span>
            </div>

            {/* H2 Headline: WordsPullUp (Client island) + Current Color Dot */}
            <h2
              id="engagement-title"
              className="text-[clamp(2rem,4.5vw,3.5rem)] font-medium tracking-[-0.03em] leading-[1.04] mt-4 sm:mt-5 text-foreground [overflow-wrap:anywhere]"
            >
              <WordsPullUp
                text={headline}
                lastWordAddon={<Dot color="current" aria-hidden="true" />}
              />
            </h2>

            {/* Optional note (omitted if placeholder) */}
            {showNote && (
              <p className="label-mono text-xs md:text-sm text-muted-foreground mt-4 max-w-sm m-0">
                {note}
              </p>
            )}
          </div>

          {/* RIGHT: Animated spec table and requirements lists */}
          <EngagementAnimated
            facts={facts}
            needFromYou={needFromYou}
            notIncluded={notIncluded}
          />
        </div>
      </div>
    </section>
  );
}

export default Engagement;
