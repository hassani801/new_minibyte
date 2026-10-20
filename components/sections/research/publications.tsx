"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Dot } from "@/components/brand/dot";
import { WordsPullUp } from "@/components/ui/words-pull-up";
import { FilterChips, useQueryParamState } from "@/components/ui/filter-chips";
import { CopyButton } from "@/components/ui/copy-button";
import { TransitionLink } from "@/components/layout/transition-link";
import {
  PUBLICATIONS,
  PUBLICATION_TYPES,
  getSortedPublications,
  groupByYear,
  RESEARCH_PAGE,
  type Publication,
} from "@/lib/research";
import { cn } from "@/lib/utils";

const easeCurve = [0.16, 1, 0.3, 1] as const;

function formatDayMonth(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  })
    .format(d)
    .toUpperCase();
}

interface PublicationRowProps {
  publication: Publication;
  prefersReducedMotion: boolean;
}

function PublicationRow({
  publication,
  prefersReducedMotion,
}: PublicationRowProps) {
  const hasLink = Boolean(publication.href && publication.href.trim().length > 0);
  const isExternal = publication.href?.startsWith("http");
  const { list } = RESEARCH_PAGE;

  return (
    <motion.li
      layout={!prefersReducedMotion}
      key={publication.slug}
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        scale: prefersReducedMotion ? 1 : 0.98,
        transition: { duration: 0.2 },
      }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.35,
        ease: easeCurve,
      }}
      className="group relative list-none py-6 md:py-8 border-b border-border last:border-b-0"
    >
      {/* Background card highlight on hover */}
      <div
        className="absolute -inset-x-4 inset-y-1 rounded-xl bg-card/40 transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-[110px_1fr_auto] gap-x-6 gap-y-3 items-start">
        {/* Col 1: Date & Type Pill */}
        <div className="flex md:flex-col items-center md:items-start gap-2 md:gap-2">
          <span className="data-mono text-xs text-muted-foreground tabular-nums">
            {formatDayMonth(publication.date)}
          </span>
          <span className="label-mono text-[11px] border border-border px-2.5 py-0.5 rounded-full text-muted-foreground whitespace-nowrap">
            {publication.type}
          </span>
        </div>

        {/* Col 2: Title, Authors, Venue, Abstract */}
        <div className="flex flex-col min-w-0 pr-2">
          <h3 className="text-lg md:text-xl font-medium tracking-[-0.01em] leading-snug text-foreground group-hover:underline underline-offset-4 m-0">
            {publication.title}
          </h3>

          <p className="text-sm text-muted-foreground mt-1.5 font-normal m-0">
            {publication.authors.join(", ")}
          </p>

          {publication.venue && (
            <span className="label-mono text-xs text-muted-foreground mt-2 block">
              {publication.venue}
            </span>
          )}

          {publication.abstract && (
            <p className="text-sm text-muted-foreground max-w-[62ch] mt-3 leading-relaxed font-normal m-0">
              {publication.abstract}
            </p>
          )}

          {publication.tags && publication.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {publication.tags.map((tag) => (
                <span
                  key={tag}
                  className="label-mono text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Col 3: Link Arrow & Cite Button */}
        <div className="flex items-center gap-3 md:justify-end shrink-0 pt-1">
          {publication.cite && (
            <CopyButton
              value={publication.cite}
              label="Cite"
              copiedLabel="Copied"
              className="relative z-20 text-xs py-1.5 px-3 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
            />
          )}

          {hasLink ? (
            <div
              className={cn(
                "w-9 h-9 rounded-full border border-border flex items-center justify-center transition-all duration-300 shrink-0",
                "group-hover:bg-foreground group-hover:text-background group-hover:border-foreground"
              )}
              aria-hidden="true"
            >
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          ) : (
            <span className="label-mono text-xs text-muted-foreground whitespace-nowrap">
              {list.inPrep}
            </span>
          )}
        </div>
      </div>

      {/* Stretched link overlay covering the entire row (except CiteButton which is z-20) */}
      {hasLink &&
        (isExternal ? (
          <a
            href={publication.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${publication.title} (opens in a new tab)`}
            className="absolute inset-0 z-10 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
          >
            <span className="sr-only">Open publication in new tab</span>
          </a>
        ) : (
          <TransitionLink
            href={publication.href!}
            aria-label={publication.title}
            className="absolute inset-0 z-10 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
          />
        ))}
    </motion.li>
  );
}

export function Publications() {
  const allPublications = useMemo(() => getSortedPublications(), []);
  const availableTypes = useMemo(() => {
    const presentTypes = PUBLICATION_TYPES.filter((type) =>
      PUBLICATIONS.some((p) => p.type === type)
    );
    return ["All", ...presentTypes];
  }, []);

  const [selectedType, setSelectedType] = useQueryParamState("type", availableTypes);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-10% 0px" });

  useEffect(() => {
    setMounted(true);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const filteredPublications = useMemo(() => {
    if (!mounted || selectedType === "All") {
      return allPublications;
    }
    return allPublications.filter((p) => p.type === selectedType);
  }, [allPublications, selectedType, mounted]);

  const yearGroups = useMemo(() => {
    return groupByYear(filteredPublications);
  }, [filteredPublications]);

  const totalCount = allPublications.length;
  const currentCount = filteredPublications.length;

  const statusText =
    selectedType === "All"
      ? `Showing all ${totalCount} publications`
      : `Showing ${currentCount} ${selectedType.toLowerCase()}s`;

  const { eyebrow, headline, filterLabel, all, empty } = RESEARCH_PAGE.list;

  return (
    <section
      ref={sectionRef}
      id="publications"
      data-nav-theme="ink"
      aria-labelledby="publications-title"
      style={{ scrollMarginTop: "calc(var(--nav-h) + 24px)" }}
      className="theme-ink bg-background text-foreground py-16 md:py-24 lg:py-32 relative"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-8">
        {/* Header Row */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 lg:mb-10"
        >
          {/* LEFT: Eyebrow + H2 */}
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{
                opacity: isHeaderInView || prefersReducedMotion ? 1 : 0,
                y: isHeaderInView || prefersReducedMotion ? 0 : 14,
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.6,
                ease: easeCurve,
                delay: 0,
              }}
              className="flex items-center gap-2 select-none"
            >
              <span
                className="w-[6px] h-[6px] rounded-full bg-paper shrink-0 inline-block"
                aria-hidden="true"
              />
              <span className="label-mono text-muted-foreground">{eyebrow}</span>
            </motion.div>

            <h2
              id="publications-title"
              className="text-[clamp(2rem,4.5vw,3.5rem)] font-medium tracking-[-0.03em] leading-[1.04] mt-4 sm:mt-5 text-foreground [overflow-wrap:anywhere]"
            >
              <WordsPullUp
                text={headline}
                play={isHeaderInView}
                delay={prefersReducedMotion ? 0 : 0.08}
                lastWordAddon={<Dot color="blue" aria-hidden="true" />}
              />
            </h2>
          </div>

          {/* RIGHT: Live Count */}
          <div
            role="status"
            aria-live="polite"
            className="data-mono text-sm text-muted-foreground tabular-nums select-none"
          >
            <span className="hidden md:inline">
              {currentCount} of {totalCount}
            </span>
            <span className="sr-only">{statusText}</span>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterChips
          options={availableTypes}
          value={selectedType}
          onChange={setSelectedType}
          label={filterLabel}
          allLabel={all}
          className="mb-8 md:mb-12"
        />

        {/* Publications List Grouped by Year */}
        {filteredPublications.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-12 text-center flex flex-col items-center justify-center min-h-[220px] sm:min-h-[260px]">
            <p className="text-base text-muted-foreground mb-6 font-normal">
              {empty}
            </p>
            <button
              type="button"
              onClick={() => setSelectedType("All")}
              className="label-mono text-xs uppercase tracking-wider text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
            >
              Clear filter
            </button>
          </div>
        ) : (
          <div className="flex flex-col space-y-12 sm:space-y-16">
            <AnimatePresence mode="popLayout" initial={false}>
              {yearGroups.map((group) => (
                <section
                  key={group.year}
                  aria-label={`Publications from ${group.year}`}
                  className="grid grid-cols-1 lg:grid-cols-[1fr_5fr] gap-x-8 lg:gap-x-10 border-t border-border pt-6 pb-4"
                >
                  {/* Left Sticky Year Label */}
                  <div className="lg:sticky lg:top-[calc(var(--nav-h)+24px)] self-start mb-4 lg:mb-0">
                    <span className="font-mono text-[clamp(1.5rem,3vw,2.25rem)] text-muted-foreground tabular-nums block">
                      {group.year}
                    </span>
                  </div>

                  {/* Right Publications List */}
                  <ul role="list" className="p-0 m-0 list-none">
                    {group.items.map((pub) => (
                      <PublicationRow
                        key={pub.slug}
                        publication={pub}
                        prefersReducedMotion={prefersReducedMotion}
                      />
                    ))}
                  </ul>
                </section>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}

export default Publications;
