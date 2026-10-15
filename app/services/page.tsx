import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { ServiceIndex } from "@/components/sections/services/service-index";
import { ServiceDetail } from "@/components/sections/services/service-detail";
import { Process } from "@/components/sections/services/process";
import { Engagement } from "@/components/sections/services/engagement";
import { Faq } from "@/components/sections/services/faq";
import { FinalCta } from "@/components/sections/home/final-cta";
import { UnderlineLink } from "@/components/ui/underline-link";
import { HashScroll } from "@/lib/use-hash-scroll";
import { SERVICES_PAGE, FAQ } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description: SERVICES_PAGE.hero.lead,
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Services · minibyte",
    description: SERVICES_PAGE.hero.lead,
  },
};

export default function ServicesPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const jsonLdString = JSON.stringify(faqJsonLd).replace(/</g, "\\u003c");

  return (
    <>
      {/* JSON-LD Schema for rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />

      {/* Anchor landing handler hook */}
      <HashScroll />

      {/* 1. HERO (Paper theme, headline Dot is the single blue element, actions slot with ArrowRight) */}
      <PageHero
        id="services"
        index="02"
        theme="paper"
        dotColor="blue"
        eyebrow={SERVICES_PAGE.hero.eyebrow}
        title={SERVICES_PAGE.hero.title}
        lead={SERVICES_PAGE.hero.lead}
        actions={
          <UnderlineLink
            href="/contact"
            className="inline-flex items-center gap-2 text-base md:text-lg font-medium"
          >
            <span>Start a project</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </UnderlineLink>
        }
      >
        <ServiceIndex />
      </PageHero>

      {/* 2. SERVICES DETAIL (Ink theme, headline Dot is the single blue element) */}
      <ServiceDetail />

      {/* 3. PROCESS & 12-WEEK TIMELINE (Paper theme, Hand over bar is the single blue element) */}
      <Process />

      {/* 4. ENGAGEMENT (Ink theme, Server Component, no blue elements) */}
      <Engagement />

      {/* 5. FAQ (Paper theme, accessible accordion, no blue elements) */}
      <Faq />

      {/* 6. FINAL CTA (Blue theme, reusable with SERVICES_PAGE.cta copy) */}
      <FinalCta {...SERVICES_PAGE.cta} />
    </>
  );
}
