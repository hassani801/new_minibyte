import { PUBLIC_PROJECTS, type Project } from "@/lib/projects";

export const PORTFOLIO_PAGE = {
  hero: {
    eyebrow: "PORTFOLIO",
    title: "Work we can show",
    lead: "Selected projects across autonomy, edge compute, and defence engineering. Some clients stay confidential; the results do not.",
  },
  list: {
    eyebrow: "ALL PROJECTS",
    headline: "Built, measured, delivered",
    filterLabel: "Filter by topic",
    all: "All",
    empty: "No projects match this filter yet.",
  },
  numbers: {
    eyebrow: "IN NUMBERS",
    headline: "What the work adds up to",
    items: [
      { label: "Projects delivered", value: PUBLIC_PROJECTS.length },
      { label: "Active specialists", value: 120 },
      { label: "Countries reached", value: 30 },
      { label: "Years building systems", value: 20 },
    ],
  },
  case: {
    overview: "OVERVIEW",
    challenge: "THE CHALLENGE",
    approach: "THE APPROACH",
    results: "THE RESULTS",
    next: "NEXT PROJECT",
    back: "All projects",
  },
  cta: {
    eyebrow: "START A PROJECT",
    headline: "Have something like this in mind",
    sub: "Tell us the problem and where it has to run.",
    primary: {
      label: "Start a project",
      href: "/contact",
    },
  },
} as const;

/**
 * Returns all unique tags across public projects, sorted alphabetically.
 */
export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  for (const project of PUBLIC_PROJECTS) {
    for (const tag of project.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
}

/**
 * Look up a public project by its URL slug.
 */
export function getProject(slug: string): Project | undefined {
  return PUBLIC_PROJECTS.find((p) => p.slug === slug);
}

/**
 * Returns the previous and next public projects with wrap-around.
 */
export function getAdjacentProjects(slug: string): {
  prev: Project;
  next: Project;
} {
  const currentIndex = PUBLIC_PROJECTS.findIndex((p) => p.slug === slug);
  if (currentIndex === -1) {
    return {
      prev: PUBLIC_PROJECTS[PUBLIC_PROJECTS.length - 1],
      next: PUBLIC_PROJECTS[0],
    };
  }

  const prevIndex = (currentIndex - 1 + PUBLIC_PROJECTS.length) % PUBLIC_PROJECTS.length;
  const nextIndex = (currentIndex + 1) % PUBLIC_PROJECTS.length;

  return {
    prev: PUBLIC_PROJECTS[prevIndex],
    next: PUBLIC_PROJECTS[nextIndex],
  };
}
