import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { LatestCard } from "@/components/sections/research/latest-card";
import { Publications } from "@/components/sections/research/publications";
import { Bytes } from "@/components/sections/research/bytes";
import { FinalCta } from "@/components/sections/home/final-cta";
import { UnderlineLink } from "@/components/ui/underline-link";
import { HashScroll } from "@/lib/use-hash-scroll";
import { PUBLICATIONS, RESEARCH_PAGE } from "@/lib/research";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Research",
  description: RESEARCH_PAGE.hero.lead,
  alternates: {
    canonical: "/research",
  },
  openGraph: {
    title: "Research · minibyte",
    description: RESEARCH_PAGE.hero.lead,
  },
};

function ListSkeleton() {
  return (
    <section
      data-nav-theme="ink"
      aria-hidden="true"
      className="theme-ink bg-background py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        <div className="h-10 w-48 bg-card border border-border rounded-lg animate-pulse mb-12" />
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-card border border-border animate-pulse"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ResearchPage() {
  // Build ScholarlyArticle JSON-LD for Papers and Technical reports
  const scholarlyArticles = PUBLICATIONS.filter(
    (p) => p.type === "Paper" || p.type === "Technical report"
  ).map((pub, index) => {
    let resolvedUrl: string | undefined = undefined;
    if (pub.href) {
      resolvedUrl = pub.href.startsWith("http")
        ? pub.href
        : `${SITE.url}${pub.href}`;
    }

    return {
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "ScholarlyArticle",
        headline: pub.title,
        datePublished: pub.date,
        author: pub.authors.map((name) => ({
          "@type": "Person",
          name,
        })),
        ...(resolvedUrl ? { url: resolvedUrl } : {}),
      },
    };
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: scholarlyArticles,
  };

  const jsonLdString = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return (
    <>
      {/* ScholarlyArticle JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />

      {/* Anchor scroll landing hook */}
      <HashScroll />

      {/* 1. HERO (Paper theme, headline Dot is single blue element, actions slot points to #publications) */}
      <PageHero
        id="research"
        index="04"
        theme="paper"
        dotColor="blue"
        eyebrow={RESEARCH_PAGE.hero.eyebrow}
        title={RESEARCH_PAGE.hero.title}
        lead={RESEARCH_PAGE.hero.lead}
        actions={
          <UnderlineLink
            href="#publications"
            className="text-base md:text-lg font-medium"
          >
            Browse publications
          </UnderlineLink>
        }
      >
        <LatestCard />
      </PageHero>

      {/* 2. PUBLICATIONS LIST & TYPE FILTER (Ink theme, headline Dot is single blue element) */}
      <Suspense fallback={<ListSkeleton />}>
        <Publications />
      </Suspense>

      {/* 3. BYTES GLOSSARY (Paper theme, alternating cards, zero blue) */}
      <Bytes />

      {/* 4. FINAL CTA (Blue theme, custom research collaboration copy) */}
      <FinalCta {...RESEARCH_PAGE.cta} />
    </>
  );
}
