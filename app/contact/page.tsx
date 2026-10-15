import React, { Suspense } from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { DirectCard } from "@/components/sections/contact/direct-card";
import { FormSection, FormSkeleton } from "@/components/sections/contact/form-section";
import { NextSteps } from "@/components/sections/contact/next-steps";
import { UnderlineLink } from "@/components/ui/underline-link";
import { HashScroll } from "@/lib/use-hash-scroll";
import { CONTACT_PAGE } from "@/lib/contact";
import { CONTACT } from "@/lib/constants";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: CONTACT_PAGE.hero.lead,
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact · minibyte",
    description: CONTACT_PAGE.hero.lead,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPage() {
  const contactJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `${SITE.url}/contact`,
        url: `${SITE.url}/contact`,
        name: "Contact · minibyte",
        description: CONTACT_PAGE.hero.lead,
      },
      {
        "@type": "Organization",
        "@id": `${SITE.url}/#organization`,
        name: SITE.name,
        url: SITE.url,
        email: CONTACT.email,
        ...(CONTACT.phone ? { telephone: CONTACT.phone } : {}),
        ...(CONTACT.location ? { address: CONTACT.location } : {}),
      },
    ],
  };

  const jsonLdString = JSON.stringify(contactJsonLd).replace(/</g, "\\u003c");

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />

      {/* HashScroll listener for same-page hash jump (#form) */}
      <HashScroll />

      {/* 1. HERO (Paper theme, index 06, headline Dot is Bit Blue) */}
      <PageHero
        id="contact"
        index="06"
        theme="paper"
        dotColor="blue"
        eyebrow={CONTACT_PAGE.hero.eyebrow}
        title={CONTACT_PAGE.hero.title}
        lead={CONTACT_PAGE.hero.lead}
        actions={
          <UnderlineLink
            href="#form"
            className="inline-flex items-center text-base md:text-lg font-medium"
          >
            <span>Write to us</span>
          </UnderlineLink>
        }
        visual={<DirectCard />}
      />

      {/* 2. FORM SECTION (Ink theme, Suspense boundary for useSearchParams topic prefill) */}
      <Suspense fallback={<FormSkeleton />}>
        <FormSection />
      </Suspense>

      {/* 3. WHAT HAPPENS NEXT (Paper theme, strictly NO blue) */}
      <NextSteps />
    </>
  );
}
