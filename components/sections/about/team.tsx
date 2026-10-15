"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Dot } from "@/components/brand/dot";
import { DotPattern } from "@/components/brand/dot-pattern";
import { WordsPullUp } from "@/components/ui/words-pull-up";
import { ABOUT } from "@/lib/about";

const easeCurve = [0.16, 1, 0.3, 1] as const;

export interface TeamMember {
  name: string;
  role: string;
  photo?: string;
  link?: string;
}

interface MemberCardProps {
  member: TeamMember;
  index: number;
  isInView: boolean;
  prefersReducedMotion: boolean;
}

function MemberCard({
  member,
  index,
  isInView,
  prefersReducedMotion,
}: MemberCardProps) {
  const photo = member.photo ?? "";
  const link = member.link ?? "";
  const hasPhoto = Boolean(photo.trim().length > 0);
  const hasLink = Boolean(link.trim().length > 0);

  const initials = member.name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      animate={{
        opacity: isInView || prefersReducedMotion ? 1 : 0,
        y: isInView || prefersReducedMotion ? 0 : 16,
      }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.6,
        ease: easeCurve,
        delay: prefersReducedMotion ? 0 : index * 0.08,
      }}
      className="group flex flex-col list-none"
    >
      {/* Avatar block: aspect-[4/5] rounded-2xl overflow-hidden bg-card border border-border */}
      <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-card border border-border">
        {hasPhoto ? (
          <Image
            src={photo}
            alt={member.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover grayscale transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
            {/* Pattern shifts 6px on hover */}
            <div className="absolute inset-0 w-full h-full transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5 group-hover:-translate-y-1.5">
              <DotPattern
                bleed
                crop={{
                  col: (index * 2) % 5,
                  row: (index * 2) % 5,
                  cols: 4,
                  rows: 4,
                }}
                tone="paper"
                showBlue={false}
                className="absolute inset-0 w-full h-full opacity-30"
              />
            </div>
            {/* Centered initials in 56px circle */}
            <div className="relative z-10 w-14 h-14 rounded-full bg-background border border-border flex items-center justify-center font-mono text-base uppercase text-foreground select-none">
              {initials}
            </div>
          </div>
        )}
      </div>

      {/* Meta block below avatar */}
      <div className="mt-3.5 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          {/* Name with draw underline on hover */}
          <p className="text-base md:text-lg font-medium text-foreground relative inline-block m-0">
            <span className="relative">
              {member.name}
              <span
                className="absolute left-0 bottom-0 w-full h-[1px] bg-foreground origin-left scale-x-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                aria-hidden="true"
              />
            </span>
          </p>

          {/* Optional external link icon */}
          {hasLink && (
            <a
              href={member.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors p-1 -m-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
              aria-label={`${member.name}'s profile (opens in a new tab)`}
            >
              <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
        </div>

        {/* Role */}
        <span className="label-mono text-muted-foreground text-xs">
          {member.role}
        </span>
      </div>
    </motion.li>
  );
}

/**
 * Team Section: "People behind the bits"
 *
 * Ink section showcasing the research, engineering, and leadership team.
 *
 * Rules:
 * - data-nav-theme="ink", className "theme-ink bg-background text-foreground"
 * - NO blue elements in this section.
 * - Placeholder initials if no photo provided.
 * - Hide team note and any member link that is empty.
 * - Photos black and white only (grayscale).
 */
export function Team() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10% 0px" });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const { eyebrow, headline, members } = ABOUT.team;
  if (!members || members.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      id="team"
      data-nav-theme="ink"
      aria-labelledby="team-title"
      className="theme-ink bg-background text-foreground py-24 lg:py-32 relative"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        {/* Header Block */}
        <div className="max-w-[640px] mb-12 lg:mb-16">
          {/* Eyebrow */}
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
              className="w-[6px] h-[6px] rounded-full bg-paper shrink-0 inline-block"
              aria-hidden="true"
            />
            <span className="label-mono text-muted-foreground">{eyebrow}</span>
          </motion.div>

          {/* H2 Headline: WordsPullUp + Current Color Dot */}
          <h2
            id="team-title"
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

        {/* 4-Column Grid: grid-cols-2 lg:grid-cols-4 */}
        <ul
          role="list"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 p-0 m-0"
        >
          {members.map((member, index) => (
            <MemberCard
              key={`${member.name}-${member.role}-${index}`}
              member={member}
              index={index}
              isInView={isInView}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
