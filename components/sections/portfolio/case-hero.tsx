import React from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { UnderlineLink } from "@/components/ui/underline-link";
import { DotPattern } from "@/components/brand/dot-pattern";
import { type Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

interface CaseHeroProps {
  project: Project;
  projectIndex: number;
}

export function CaseHero({ project, projectIndex }: CaseHeroProps) {
  const projectNumber = String(projectIndex + 1).padStart(2, "0");
  const isOriginalTone = project.image?.tone === "original";

  return (
    <PageHero
      id="case-hero"
      index={projectNumber}
      theme="paper"
      dotColor="blue"
      eyebrow={`PROJECT ${projectNumber}`}
      title={project.name}
      lead={project.summary}
      mono={true}
      actions={
        <UnderlineLink
          href="/portfolio"
          className="inline-flex items-center gap-2 text-base md:text-lg font-medium"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>All projects</span>
        </UnderlineLink>
      }
    >
      {/* Visual Slot: Rounded 2xl card with photo or DotPattern */}
      <div className="relative rounded-2xl overflow-hidden bg-secondary aspect-[4/3] w-full max-w-[520px] border border-border select-none">
        {project.image ? (
          <Image
            src={project.image.src}
            alt={project.image.alt}
            fill
            priority
            quality={80}
            sizes="(max-width: 768px) 100vw, 520px"
            className={cn(
              "object-cover",
              isOriginalTone ? "" : "grayscale"
            )}
          />
        ) : (
          <DotPattern
            bleed
            crop={project.pattern}
            tone="ink"
            showBlue={false}
            className="w-full h-full opacity-90"
          />
        )}
      </div>
    </PageHero>
  );
}

export default CaseHero;
