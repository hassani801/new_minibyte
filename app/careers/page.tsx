import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ArrowDown } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { OpeningsCard } from "@/components/sections/careers/openings-card";
import { Culture } from "@/components/sections/careers/culture";
import { Roles, RolesSkeleton } from "@/components/sections/careers/roles";
import { HiringProcess } from "@/components/sections/careers/hiring-process";
import { FinalCta } from "@/components/sections/home/final-cta";
import { TransitionLink } from "@/components/layout/transition-link";
import { HashScroll } from "@/lib/use-hash-scroll";
import { CAREERS_PAGE, ROLES, applyUrl } from "@/lib/careers";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Careers",
  description: CAREERS_PAGE.hero.lead,
  alternates: {
    canonical: "/careers",
  },
  openGraph: {
    title: "Careers · minibyte",
    description: CAREERS_PAGE.hero.lead,
  },
};

export default function CareersPage() {
  // JSON-LD: JobPosting emitted ONLY for roles that have a real postedAt date
  const qualifyingRoles = ROLES.filter((r) => Boolean(r.postedAt));
  let jsonLdScript: string | null = null;

  if (qualifyingRoles.length > 0) {
    const typeMap: Record<string, string> = {
      "Full-time": "FULL_TIME",
      "Part-time": "PART_TIME",
      Internship: "INTERN",
      Contract: "CONTRACTOR",
    };

    const schemas = qualifyingRoles.map((role) => {
      const item: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: role.title,
        description: role.summary,
        datePosted: role.postedAt,
        employmentType: typeMap[role.type] || "OTHER",
        hiringOrganization: {
          "@type": "Organization",
          name: "minibyte",
        },
      };

      if (role.location === "Remote") {
        item.jobLocationType = "TELECOMMUTE";
      }

      return item;
    });

    const rawJson = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
    jsonLdScript = rawJson.replace(/</g, "\\u003c");
  }

  return (
    <>
      {jsonLdScript && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript }}
        />
      )}

      {/* 1. PageHero (blue theme, white dot, openings counter visual, action scroll to #roles) */}
      <PageHero
        id="careers"
        index="05"
        theme="blue"
        dotColor="current"
        eyebrow={CAREERS_PAGE.hero.eyebrow}
        title={CAREERS_PAGE.hero.title}
        lead={CAREERS_PAGE.hero.lead}
        actions={
          <TransitionLink
            href="#roles"
            className={cn(
              "h-12 px-6 rounded-full bg-ink text-paper inline-flex items-center gap-3 text-sm font-medium select-none",
              "transition-transform active:scale-[0.98] [@media(hover:hover)]:hover:-translate-y-px group",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bit-blue)]"
            )}
          >
            <span>Browse roles</span>
            <span
              aria-hidden="true"
              className="w-7 h-7 rounded-full bg-paper text-ink grid place-items-center shrink-0 transition-transform duration-200 group-hover:translate-y-0.5"
            >
              <ArrowDown className="w-4 h-4" />
            </span>
          </TransitionLink>
        }
        visual={<OpeningsCard />}
      />

      {/* HashScroll listener for anchor navigation */}
      <HashScroll />

      {/* 2. Culture (paper theme, zero blue) */}
      <Culture />

      {/* 3. Open Roles (ink theme, headline Dot is single blue element, filter + WAI accordion) */}
      <Suspense fallback={<RolesSkeleton />}>
        <Roles />
      </Suspense>

      {/* 4. Hiring Process (paper theme, zero blue, animated connector) */}
      <HiringProcess />

      {/* 5. Final CTA (blue theme, open application mailto) */}
      <FinalCta
        eyebrow={CAREERS_PAGE.cta.eyebrow}
        headline={CAREERS_PAGE.cta.headline}
        sub={CAREERS_PAGE.cta.sub}
        primary={{
          label: CAREERS_PAGE.cta.primary.label,
          href: applyUrl(),
        }}
      />
    </>
  );
}
