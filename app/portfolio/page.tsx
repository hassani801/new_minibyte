import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { PortfolioHeroVisual } from "@/components/sections/portfolio/portfolio-hero-visual";
import { ProjectFilter } from "@/components/sections/portfolio/project-filter";
import { Numbers } from "@/components/sections/portfolio/numbers";
import { FinalCta } from "@/components/sections/home/final-cta";
import { PUBLIC_PROJECTS } from "@/lib/projects";
import { PORTFOLIO_PAGE } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Portfolio",
  description: PORTFOLIO_PAGE.hero.lead,
  alternates: {
    canonical: "/portfolio",
  },
  openGraph: {
    title: "Portfolio · minibyte",
    description: PORTFOLIO_PAGE.hero.lead,
  },
};

function GridSkeleton() {
  return (
    <section
      data-nav-theme="paper"
      className="py-20 lg:py-28 max-w-[1280px] mx-auto px-6 md:px-8"
    >
      <div className="h-10 w-48 bg-card border border-border rounded-lg animate-pulse mb-12" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-80 rounded-2xl bg-card border border-border animate-pulse"
          />
        ))}
      </div>
    </section>
  );
}

export default function PortfolioPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: PUBLIC_PROJECTS.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: project.name,
      url: `https://minibyte.ai/portfolio/${project.slug}`,
    })),
  };

  const jsonLdString = JSON.stringify(itemListJsonLd).replace(/</g, "\\u003c");

  return (
    <>
      {/* ItemList JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />

      {/* 1. HERO (Ink theme, headline Dot is the single blue element, animated binary counter visual) */}
      <PageHero
        id="portfolio"
        index="03"
        theme="ink"
        dotColor="blue"
        eyebrow={PORTFOLIO_PAGE.hero.eyebrow}
        title={PORTFOLIO_PAGE.hero.title}
        lead={PORTFOLIO_PAGE.hero.lead}
      >
        <PortfolioHeroVisual />
      </PageHero>

      {/* 2. PROJECT FILTER & GRID (Paper theme, wrapped in Suspense for useSearchParams) */}
      <Suspense fallback={<GridSkeleton />}>
        <ProjectFilter />
      </Suspense>

      {/* 3. IN NUMBERS (Ink theme, counting stats strip) */}
      <Numbers />

      {/* 4. FINAL CTA (Blue theme, reusable copy) */}
      <FinalCta {...PORTFOLIO_PAGE.cta} />
    </>
  );
}
