// DRAFT: have this reviewed by a lawyer before launch

import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How minibyte handles personal information and contact submissions.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        id="privacy-hero"
        theme="paper"
        dotColor="blue"
        eyebrow="LEGAL"
        title="Privacy Policy"
        lead="How minibyte handles personal information collected through this website."
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
              1. Data Controller
            </h2>
            <p className="m-0">
              The data controller responsible for this website is MINIBYTE. If you have any questions about this policy or your personal information, contact us at{" "}
              <a
                href={`mailto:${CONTACT.email}`}
                className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
              >
                {CONTACT.email}
              </a>.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium tracking-tight text-foreground m-0">
              2. Information We Collect
            </h2>
            <p className="m-0">
              We collect information that you voluntarily provide when using our contact form:
            </p>
            <ul className="list-disc pl-5 space-y-2 m-0">
              <li>Your name</li>
              <li>Your email address</li>
              <li>Your company or organization name (optional)</li>
              <li>Your selected project topic and inquiry message</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium tracking-tight text-foreground m-0">
              3. How We Use Your Data
            </h2>
            <p className="m-0">
              We use your submitted details exclusively to evaluate project feasibility, reply to your engineering inquiries, and schedule technical consultations. Inquiries are transmitted securely via email through our email infrastructure provider (Resend) directly to our internal engineering team. We do not sell or rent your information to third parties.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium tracking-tight text-foreground m-0">
              4. Local Storage and Drafts
            </h2>
            <p className="m-0">
              To prevent accidental data loss while composing messages, our contact form stores an in-progress draft in your browser&apos;s <code className="font-mono text-xs bg-card px-1.5 py-0.5 rounded border border-border text-foreground">sessionStorage</code>. This draft never leaves your device, is not accessible to other websites, and is discarded upon successful form submission or when closing your browser tab.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium tracking-tight text-foreground m-0">
              5. Cookies and Tracking
            </h2>
            <p className="m-0">
              We do not employ third-party advertising trackers, cross-site profiling tools, or marketing cookies. We only rely on standard, strictly necessary cookies provided by the hosting framework to serve pages securely and maintain site performance.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium tracking-tight text-foreground m-0">
              6. Data Retention
            </h2>
            <p className="m-0">
              We retain correspondence records only for as long as necessary to manage prospective project inquiries and fulfill legitimate business communications. You may request deletion of past inquiries at any time.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium tracking-tight text-foreground m-0">
              7. Your Rights
            </h2>
            <p className="m-0">
              You have the right to request access to the personal data we hold about you, request corrections, or request that your data be deleted. To submit a rights request, email us at{" "}
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
