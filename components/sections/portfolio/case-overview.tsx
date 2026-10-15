import React from "react";
import { type Project } from "@/lib/projects";

interface CaseOverviewProps {
  project: Project;
}

export function CaseOverview({ project }: CaseOverviewProps) {
  const caseData = project.case;

  const facts: { label: string; value: string; isDataMono: boolean }[] = [];
  if (caseData?.client) {
    facts.push({ label: "CLIENT", value: caseData.client, isDataMono: false });
  }
  if (caseData?.role) {
    facts.push({ label: "ROLE", value: caseData.role, isDataMono: false });
  }
  if (project.year) {
    facts.push({ label: "YEAR", value: project.year, isDataMono: true });
  }
  if (caseData?.duration) {
    facts.push({ label: "DURATION", value: caseData.duration, isDataMono: true });
  }
  if (project.specs && project.specs.length > 0) {
    for (const spec of project.specs) {
      facts.push({
        label: spec.label.toUpperCase(),
        value: spec.value,
        isDataMono: true,
      });
    }
  }

  const stack = caseData?.stack || project.tags;

  if (facts.length === 0 && stack.length === 0) {
    return null;
  }

  return (
    <section
      id="overview"
      data-nav-theme="ink"
      aria-labelledby="overview-title"
      className="theme-ink bg-background text-foreground py-16 lg:py-24 relative border-t border-border"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        <h2 id="overview-title" className="sr-only">
          Project Overview
        </h2>

        {/* Spec Table Grid */}
        {facts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {facts.map((fact, index) => (
              <div key={`${fact.label}-${index}`} className="border-t border-border pt-4 flex flex-col gap-1.5">
                <span className="label-mono text-xs text-muted-foreground">
                  {fact.label}
                </span>
                <span
                  className={
                    fact.isDataMono
                      ? "data-mono text-base text-foreground tabular-nums"
                      : "text-base text-foreground font-normal"
                  }
                >
                  {fact.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Stack Tags */}
        {stack.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="label-mono text-xs text-muted-foreground shrink-0">
              TECHNOLOGY STACK
            </span>
            <div className="flex flex-wrap gap-2">
              {stack.map((tech) => (
                <span
                  key={tech}
                  className="label-mono text-xs px-3 py-1 rounded-full border border-border text-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default CaseOverview;
