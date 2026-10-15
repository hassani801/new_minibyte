import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseHero } from "@/components/sections/portfolio/case-hero";
import { CaseOverview } from "@/components/sections/portfolio/case-overview";
import { CaseStory } from "@/components/sections/portfolio/case-story";
import { CaseNext } from "@/components/sections/portfolio/case-next";
import { FinalCta } from "@/components/sections/home/final-cta";
import { PUBLIC_PROJECTS } from "@/lib/projects";
import { getProject, PORTFOLIO_PAGE } from "@/lib/portfolio";

export async function generateStaticParams() {
  return PUBLIC_PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: project.name,
    description: project.summary,
    alternates: {
      canonical: `/portfolio/${project.slug}`,
    },
    openGraph: {
      title: `${project.name} · minibyte`,
      description: project.summary,
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  const projectIndex = PUBLIC_PROJECTS.findIndex((p) => p.slug === project.slug);

  const creativeWorkJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.summary,
    url: `https://minibyte.ai/portfolio/${project.slug}`,
  };

  const jsonLdString = JSON.stringify(creativeWorkJsonLd).replace(
    /</g,
    "\\u003c"
  );

  return (
    <>
      {/* CreativeWork JSON-LD Schema (client name omitted for confidentiality) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />

      {/* 1. HERO (Paper theme, headline Dot is single blue element) */}
      <CaseHero project={project} projectIndex={projectIndex} />

      {/* 2. OVERVIEW & FACTS (Ink theme, specs table & stack) */}
      <CaseOverview project={project} />

      {/* 3. STORY: CHALLENGE, APPROACH & RESULTS (Paper theme) */}
      <CaseStory project={project} />

      {/* 4. NEXT PROJECT (Ink theme, wrap-around navigation) */}
      <CaseNext currentSlug={project.slug} />

      {/* 5. FINAL CTA (Blue theme, custom headline) */}
      <FinalCta
        {...PORTFOLIO_PAGE.cta}
        headline="Have something like this in mind"
      />
    </>
  );
}
