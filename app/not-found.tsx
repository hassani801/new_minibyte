import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { UnderlineLink } from "@/components/ui/underline-link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <PageHero
      id="page-not-found"
      theme="paper"
      dotColor="current"
      eyebrow="404"
      title="Page not found"
      lead="That page does not exist or was moved."
      actions={
        <div className="flex flex-wrap items-center gap-6">
          <UnderlineLink
            href="/"
            className="text-base font-medium"
          >
            Home
          </UnderlineLink>
          <UnderlineLink
            href="/contact"
            className="text-base font-medium"
          >
            Contact
          </UnderlineLink>
        </div>
      }
    />
  );
}
