// DRAFT: have this reviewed by a lawyer before launch

import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms governing the use of the minibyte website and communications.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        id="terms-hero"
        theme="paper"
        dotColor="blue"
        eyebrow="LEGAL"
        title="Terms & Conditions"
        lead="Terms governing the use of this website and technical inquiries."
      />

      <section
        data-nav-theme="paper"
        className="theme-paper bg-background text-foreground py-16 lg:py-24 border-t border-border"
      >
        <article className="mx-auto max-w-[720px] px-6 md:px-8 space-y-10 text-base leading-relaxed text-muted-foreground">
          <div className="label-mono text-xs text-foreground uppercase tracking-wider">
            Last updated: October 2026
          </div>

          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium tracking-tight text-foreground m-0">
              1. Acceptance of Terms
            </h2>
            <p className="m-0">
              By accessing and using this website (<code className="font-mono text-xs bg-card px-1.5 py-0.5 rounded border border-border text-foreground">minibyte.ai</code>), you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, please do not use this site.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium tracking-tight text-foreground m-0">
              2. Intellectual Property
            </h2>
            <p className="m-0">
              All materials published on this website, including technical diagrams, architectural papers, software descriptions, design systems, logos, and byte mark symbols, are the proprietary intellectual property of MINIBYTE or licensed partners. Unlicensed reproduction, modification, or distribution is prohibited without prior written consent.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium tracking-tight text-foreground m-0">
              3. Information and Case Studies
            </h2>
            <p className="m-0">
              The case studies, performance metrics, hardware benchmarks, and project overviews presented on this website are provided for informational demonstration of past engineering capabilities. Technical results reflect measured outcomes under specific test conditions and hardware configurations.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium tracking-tight text-foreground m-0">
              4. Commercial Engagements
            </h2>
            <p className="m-0">
              Inquiries submitted through the contact form do not constitute a binding contract. Formal client engagements, technical scopes of work, intellectual property transfer terms, and delivery schedules are established exclusively through individually executed Master Services Agreements (MSAs) and Statements of Work (SOWs).
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium tracking-tight text-foreground m-0">
              5. Disclaimer and Limitation of Liability
            </h2>
            <p className="m-0">
              This website is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. MINIBYTE makes no warranties regarding uninterrupted access, error-free operation, or fitness for a particular purpose, and disclaims liability for damages arising out of use of this website.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium tracking-tight text-foreground m-0">
              6. Contact
            </h2>
            <p className="m-0">
              For questions regarding these terms, contact us at{" "}
              <a
                href={`mailto:${CONTACT.email}`}
                className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
              >
                {CONTACT.email}
              </a>.
            </p>
          </div>
        </article>
      </section>
    </>
  );
}
