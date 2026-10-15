import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { NamePattern } from "@/components/sections/about/name-pattern";
import { Story } from "@/components/sections/about/story";
import { Principles } from "@/components/sections/about/principles";
import { Team } from "@/components/sections/about/team";
import { FinalCta } from "@/components/sections/home/final-cta";
import { ABOUT } from "@/lib/about";

export const metadata: Metadata = {
  title: "About",
  description:
    "minibyte is an AI R&D and autonomy engineering firm with roots in CARE, building defense systems and on-device AI across US, UK, EU, UAE, KR, and PK.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About · minibyte",
    description:
      "minibyte is an AI R&D and autonomy engineering firm with roots in CARE, building defense systems and on-device AI across US, UK, EU, UAE, KR, and PK.",
  },
};

export default function AboutPage() {
  return (
    <>
      {/* 1. HERO (Paper theme, dotColor="current" because NamePattern holds the section's one blue dot) */}
      <PageHero
        id="about"
        index="01"
        theme="paper"
        dotColor="current"
        eyebrow={ABOUT.hero.eyebrow}
        title={ABOUT.hero.title}
        lead={ABOUT.hero.lead}
      >
        <NamePattern />
      </PageHero>

      {/* 2. OUR STORY (Ink theme, headline Dot is the one blue element) */}
      <Story />

      {/* 3. PRINCIPLES (Paper theme, no blue elements) */}
      <Principles />

      {/* 4. TEAM (Ink theme, no blue elements) */}
      <Team />

      {/* 5. FINAL CTA (Blue theme, reusable with ABOUT.cta copy) */}
      <FinalCta {...ABOUT.cta} />
    </>
  );
}
