"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Plus, ArrowUpRight } from "lucide-react";
import { Dot } from "@/components/brand/dot";
import { WordsPullUp } from "@/components/ui/words-pull-up";
import { FilterChips, useQueryParamState } from "@/components/ui/filter-chips";
import { CopyButton } from "@/components/ui/copy-button";
import { CAREERS_PAGE, ROLES, getTeams, applyUrl } from "@/lib/careers";
import { usePageReady } from "@/lib/transition";
import { cn } from "@/lib/utils";

const easeCurve = [0.16, 1, 0.3, 1] as const;

export function RolesSkeleton() {
  return (
    <section
      id="roles"
      data-nav-theme="ink"
      aria-hidden="true"
      className="theme-ink bg-background text-foreground py-24 lg:py-32 scroll-mt-[calc(var(--nav-h)+24px)]"
    >
      <div className="mx-auto max-w-[1280px] w-full px-6 md:px-8">
        <div className="flex items-center justify-between pb-8 border-b border-border">
          <div className="h-8 w-48 bg-muted/40 rounded" />
          <div className="h-6 w-20 bg-muted/40 rounded" />
        </div>
        <div className="divide-y divide-border">
          {[1, 2, 3].map((n) => (
            <div key={n} className="py-8 flex items-center justify-between">
              <div className="flex flex-col gap-3">
                <div className="h-6 w-64 bg-muted/40 rounded" />
                <div className="h-4 w-36 bg-muted/40 rounded" />
              </div>
              <div className="w-9 h-9 rounded-full bg-muted/40" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Roles() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10% 0px" });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");

  const teams = getTeams();
  const showFilter = ROLES.length > 1 && teams.length > 1;
  const filterOptions = ["All", ...teams];
  const [selectedTeam, setSelectedTeam] = useQueryParamState(
    "team",
    teams,
    "All"
  );

  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  // Filtered list
  const filteredRoles =
    selectedTeam === "All"
      ? ROLES
      : ROLES.filter((r) => r.team === selectedTeam);

  // Deep link handler: checks URL hash for #role-{slug}
  const handleHash = useCallback(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    const match = hash.match(/^#role-([a-z0-9-]+)$/);
    if (match) {
      const slug = match[1];
      const targetRole = ROLES.find((r) => r.slug === slug);
      if (targetRole) {
        setOpenSlug(slug);
        requestAnimationFrame(() => {
          const el = document.getElementById(`role-${slug}`);
          if (el) {
            const navH = 80;
            const top =
              el.getBoundingClientRect().top + window.scrollY - (navH + 24);
            window.scrollTo({
              top,
              behavior: prefersReducedMotion ? "auto" : "smooth",
            });
            const btn = document.getElementById(`role-btn-${slug}`);
            btn?.focus({ preventScroll: true });
          }
        });
      }
    }
  }, [prefersReducedMotion]);

  usePageReady(() => {
    handleHash();
  });

  useEffect(() => {
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [handleHash]);

  const toggleRole = (slug: string) => {
    if (openSlug === slug) {
      setOpenSlug(null);
      if (typeof window !== "undefined") {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        );
      }
    } else {
      setOpenSlug(slug);
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", `#role-${slug}`);
      }
    }
  };

  const handleButtonKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    const total = filteredRoles.length;
    if (total === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (index + 1) % total;
      buttonRefs.current[nextIndex]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (index - 1 + total) % total;
      buttonRefs.current[prevIndex]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      buttonRefs.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      buttonRefs.current[total - 1]?.focus();
    }
  };

  return (
    <section
      ref={sectionRef}
      id="roles"
      data-nav-theme="ink"
      aria-labelledby="roles-title"
      className="theme-ink bg-background text-foreground py-24 lg:py-32 scroll-mt-[calc(var(--nav-h)+24px)]"
    >
      <div className="mx-auto max-w-[1280px] w-full px-6 md:px-8">
        {/* HEADER ROW */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 select-none">
              <span
                className="w-1.5 h-1.5 rounded-full bg-foreground shrink-0 inline-block"
                aria-hidden="true"
              />
              <span className="label-mono text-muted-foreground">
                {CAREERS_PAGE.roles.eyebrow}
              </span>
            </div>

            <h2
              id="roles-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground mt-4 leading-[1.1] text-balance"
            >
              <WordsPullUp
                text={CAREERS_PAGE.roles.headline}
                play={isInView}
                stagger={0.06}
                lastWordAddon={<Dot color="blue" aria-hidden="true" />}
              />
            </h2>
          </div>

          {/* Live Count status announcement */}
          <div
            role="status"
            aria-live="polite"
            className="data-mono text-xs sm:text-sm text-muted-foreground shrink-0 select-none pb-1"
          >
            {filteredRoles.length} of {ROLES.length}
          </div>
        </div>

        {/* TEAM FILTER CHIPS (Rendered only if >1 role and >1 team) */}
        {showFilter && (
          <div className="mt-8 mb-10">
            <FilterChips
              options={filterOptions}
              label={CAREERS_PAGE.roles.filterLabel}
              value={selectedTeam}
              onChange={setSelectedTeam}
            />
          </div>
        )}

        {/* ROLES ACCORDION LIST */}
        {filteredRoles.length > 0 ? (
          <ul role="list" className="border-t border-border mt-4">
            <AnimatePresence initial={false} mode="popLayout">
              {filteredRoles.map((role, idx) => {
                const isOpen = openSlug === role.slug;
                const shareUrl = origin
                  ? `${origin}/careers#role-${role.slug}`
                  : `#role-${role.slug}`;

                return (
                  <motion.li
                    key={role.slug}
                    layout
                    id={`role-${role.slug}`}
                    className="border-b border-border scroll-mt-[calc(var(--nav-h)+24px)]"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.4,
                      ease: easeCurve,
                      delay: prefersReducedMotion ? 0 : (idx % 6) * 0.06,
                    }}
                  >
                    {/* ACCORDION HEADER (h3 > button per WAI pattern) */}
                    <h3>
                      <button
                        ref={(el) => {
                          buttonRefs.current[idx] = el;
                        }}
                        type="button"
                        id={`role-btn-${role.slug}`}
                        aria-expanded={isOpen}
                        aria-controls={`role-panel-${role.slug}`}
                        onClick={() => toggleRole(role.slug)}
                        onKeyDown={(e) => handleButtonKeyDown(e, idx)}
                        className={cn(
                          "relative group w-full grid grid-cols-[1fr_auto] gap-4 items-center py-7 md:py-9 text-left select-none",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded-lg"
                        )}
                      >
                        {/* Hover subtle background highlight */}
                        <span
                          aria-hidden="true"
                          className="absolute -inset-x-4 inset-y-0 bg-card/60 rounded-xl opacity-0 transition-opacity duration-200 pointer-events-none -z-10 group-hover:opacity-100"
                        />

                        {/* Left: Role Title and Facts Pills */}
                        <div className="flex flex-col items-start gap-3 min-w-0 pr-4">
                          <span className="text-xl md:text-2xl font-medium tracking-tight text-foreground transition-colors group-hover:text-foreground">
                            {role.title}
                          </span>

                          <div className="flex flex-wrap items-center gap-2">
                            <span className="label-mono text-xs border border-border px-2.5 py-1 rounded-full text-muted-foreground bg-background">
                              {role.team}
                            </span>
                            <span className="label-mono text-xs border border-border px-2.5 py-1 rounded-full text-muted-foreground bg-background">
                              {role.location}
                            </span>
                            <span className="label-mono text-xs border border-border px-2.5 py-1 rounded-full text-muted-foreground bg-background">
                              {role.type}
                            </span>
                          </div>
                        </div>

                        {/* Right: Plus / Close Icon Circle */}
                        <div
                          aria-hidden="true"
                          className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center shrink-0 transition-colors group-hover:border-foreground/40"
                        >
                          <Plus
                            className={cn(
                              "w-4 h-4 text-foreground transition-transform duration-200",
                              !prefersReducedMotion && isOpen && "rotate-45"
                            )}
                          />
                        </div>
                      </button>
                    </h3>

                    {/* ACCORDION PANEL (0fr -> 1fr CSS grid technique) */}
                    <div
                      id={`role-panel-${role.slug}`}
                      role="region"
                      aria-labelledby={`role-btn-${role.slug}`}
                      className={cn(
                        "grid transition-all ease-out",
                        prefersReducedMotion ? "transition-none" : "duration-300",
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-10 pt-2">
                          {/* Role Summary */}
                          <div className="lg:col-span-2">
                            <p className="text-base md:text-lg text-foreground leading-relaxed max-w-[840px]">
                              {role.summary}
                            </p>
                          </div>

                          {/* Responsibilities */}
                          <div className="flex flex-col">
                            <h4 className="label-mono text-xs text-muted-foreground uppercase tracking-wider pb-3 border-b border-border">
                              {CAREERS_PAGE.roles.responsibilities}
                            </h4>
                            <ul role="list" className="mt-2 divide-y divide-border">
                              {role.responsibilities.map((resp, i) => (
                                <li
                                  key={i}
                                  className="py-3 text-sm md:text-base text-foreground flex items-start gap-3"
                                >
                                  <span
                                    className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 shrink-0 mt-2 inline-block"
                                    aria-hidden="true"
                                  />
                                  <span>{resp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Requirements */}
                          <div className="flex flex-col">
                            <h4 className="label-mono text-xs text-muted-foreground uppercase tracking-wider pb-3 border-b border-border">
                              {CAREERS_PAGE.roles.requirements}
                            </h4>
                            <ul role="list" className="mt-2 divide-y divide-border">
                              {role.requirements.map((req, i) => (
                                <li
                                  key={i}
                                  className="py-3 text-sm md:text-base text-foreground flex items-start gap-3"
                                >
                                  <span
                                    className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 shrink-0 mt-2 inline-block"
                                    aria-hidden="true"
                                  />
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Nice to Have (if present) */}
                          {role.niceToHave && role.niceToHave.length > 0 && (
                            <div className="lg:col-span-2 flex flex-col">
                              <h4 className="label-mono text-xs text-muted-foreground uppercase tracking-wider pb-3 border-b border-border">
                                {CAREERS_PAGE.roles.niceToHave}
                              </h4>
                              <ul
                                role="list"
                                className="mt-2 divide-y divide-border"
                              >
                                {role.niceToHave.map((item, i) => (
                                  <li
                                    key={i}
                                    className="py-3 text-sm md:text-base text-foreground flex items-start gap-3"
                                  >
                                    <span
                                      className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 shrink-0 mt-2 inline-block"
                                      aria-hidden="true"
                                    />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Actions Row */}
                          <div className="lg:col-span-2 flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-border">
                            {/* Primary: Apply by Email (plain <a> since mailto) */}
                            <a
                              href={applyUrl(role)}
                              aria-label={`Apply by email for ${role.title}`}
                              className={cn(
                                "h-12 px-6 rounded-full bg-primary text-primary-foreground inline-flex items-center gap-3 text-sm font-medium select-none",
                                "transition-transform active:scale-[0.98] [@media(hover:hover)]:hover:-translate-y-px group",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
                              )}
                            >
                              <span>{CAREERS_PAGE.roles.apply}</span>
                              <span
                                aria-hidden="true"
                                className="w-7 h-7 rounded-full bg-background text-foreground grid place-items-center shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                              >
                                <ArrowUpRight className="w-4 h-4" />
                              </span>
                            </a>

                            {/* Secondary: Copy Link */}
                            <CopyButton
                              value={shareUrl}
                              label={CAREERS_PAGE.roles.copyLink}
                              copiedLabel="Copied"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        ) : (
          /* EMPTY STATE */
          <div className="rounded-2xl border border-border p-8 md:p-10 bg-card/40 flex flex-col items-start gap-4 my-8">
            <h3 className="text-xl font-medium text-foreground">
              {CAREERS_PAGE.roles.empty}
            </h3>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              {CAREERS_PAGE.roles.emptyHelp}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <a
                href={applyUrl()}
                className={cn(
                  "h-11 px-5 rounded-full bg-foreground text-background text-sm font-medium inline-flex items-center gap-2",
                  "hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
                )}
              >
                Send an open application
              </a>
              {selectedTeam !== "All" && (
                <button
                  type="button"
                  onClick={() => setSelectedTeam("All")}
                  className={cn(
                    "h-11 px-5 rounded-full border border-border text-foreground text-sm font-medium",
                    "hover:border-foreground/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
                  )}
                >
                  Clear filter
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Roles;
