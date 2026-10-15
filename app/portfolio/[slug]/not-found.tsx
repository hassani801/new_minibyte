import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { UnderlineLink } from "@/components/ui/underline-link";

export const metadata: Metadata = {
  title: "Project not found",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PortfolioNotFound() {
  return (
    <PageHero
      id="project-404"
      theme="paper"
      dotColor="current"
      eyebrow="404"
      title="Project not found"
      lead="That project does not exist or was moved."
      actions={
        <UnderlineLink
          href="/portfolio"
          className="inline-flex items-center gap-2 text-base md:text-lg font-medium"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Back to all projects</span>
        </UnderlineLink>
      }
    />
  );
}
