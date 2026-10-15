// PLACEHOLDER roles: replace with real openings. An empty array is supported (shows the open application state).

import { CONTACT } from "@/lib/constants";

export type Role = {
  slug: string;
  title: string;
  team: string;
  location: string;
  type: "Full-time" | "Part-time" | "Internship" | "Contract";
  summary: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
  postedAt?: string; /* ISO yyyy-mm-dd; only set for real roles */
  applyHref?: string; /* overrides the default mailto */
};

export const CAREERS_PAGE = {
  hero: {
    eyebrow: "CAREERS",
    title: "Raise your hand",
    lead: "We are a small lab. Everyone here owns real work, from the first question to the final measurement.",
  },
  culture: {
    eyebrow: "HOW WE WORK",
    headline: "A small team with high standards",
    lead: "What it is like to work at minibyte.",
  },
  roles: {
    eyebrow: "OPEN ROLES",
    headline: "Where we need people",
    filterLabel: "Filter by team",
    all: "All",
    empty: "No open roles right now.",
    emptyHelp: "We still read every open application.",
    apply: "Apply by email",
    copyLink: "Copy link",
    details: "Details",
    responsibilities: "What you will do",
    requirements: "What we look for",
    niceToHave: "Nice to have",
  },
  process: {
    eyebrow: "HIRING PROCESS",
    headline: "Four steps, no surprises",
    lead: "You will know where you stand after each one.",
  },
  cta: {
    eyebrow: "OPEN APPLICATION",
    headline: "Not seeing your role",
    sub: "Send us a short note about what you would like to work on. We read every message.",
    primary: {
      label: "Send an open application",
      href: "mailto",
    },
  },
} as const;

export const CULTURE = [
  {
    title: "Own the question",
    text: "We formulate the problem before touching the code, and carry it through to empirical validation.",
  },
  {
    title: "Measure before you claim",
    text: "Every latency number and memory bound comes from actual hardware runs, not intuition.",
  },
  {
    title: "Small team, short loops",
    text: "No layers between idea and execution; decisions happen through clear technical notes and working prototypes.",
  },
  {
    title: "Learn in the open",
    text: "We publish findings, share reproducible artifacts, and contribute back to open research.",
  },
] as const;

export const PERKS = [
  "Flexible hours",
  "Hardware budget",
  "Conference and learning budget",
  "Hybrid or remote options",
  "Paid public holidays",
  "Time for publishing",
] as const;

export const HIRING_STEPS = [
  {
    name: "Intro call",
    text: "A short conversation about you and the work.",
    duration: "30 min",
  },
  {
    name: "Technical conversation",
    text: "We go through a problem together and you ask us anything.",
    duration: "60 min",
  },
  {
    name: "Small exercise",
    text: "A focused task close to real work. We agree the scope and time up front.",
    duration: "Agreed",
  },
  {
    name: "Team and offer",
    text: "You meet the team; we reply within a few working days.",
    duration: "Few days",
  },
] as const;

export const ROLES: Role[] = [
  {
    slug: "research-engineer",
    title: "Research engineer",
    team: "Research",
    location: "Hybrid",
    type: "Full-time",
    summary:
      "Design and evaluate compact model architectures and quantization schemes for edge hardware. You will run experiments directly on physical target devices.",
    responsibilities: [
      "Profile memory and latency bottlenecks of quantized models on edge accelerators.",
      "Implement custom kernels and numerical routines to validate compression hypotheses.",
      "Run reproducible benchmarking sweeps against real domain-specific workloads.",
      "Document experimental methodologies and contribute reproducible code to lab publications.",
    ],
    requirements: [
      "Hands-on experience with PyTorch and low-level model profiling tools.",
      "Solid understanding of neural network quantization and numerical stability.",
      "Demonstrated ability to write clean, modular, and test-covered Python and C++.",
      "Strong communication skills and comfort with independent technical ownership.",
    ],
    niceToHave: [
      "Prior experience deploying models to ARM Cortex-M or embedded Linux devices.",
      "Contributions to open-source inference engines or scientific packages.",
    ],
  },
  {
    slug: "software-engineer-full-stack",
    title: "Software engineer, full stack",
    team: "Engineering",
    location: "Hybrid",
    type: "Full-time",
    summary:
      "Build benchmarking pipelines, evaluation dashboards, and developer tooling for client teams. You connect research output with production testing environments.",
    responsibilities: [
      "Architect and maintain data pipelines for continuous model evaluation across target hardware.",
      "Develop fast, accessible web interfaces and CLI utilities for internal researchers and clients.",
      "Ensure reliability and low latency of API services running on hybrid infrastructure.",
      "Collaborate closely with research engineers to instrument model metrics and trace regressions.",
    ],
    requirements: [
      "Proficiency with TypeScript, React/Next.js, and Python backend services.",
      "Experience designing relational database schemas and automated testing suites.",
      "Familiarity with containerized workflows and distributed job queues.",
      "A disciplined approach to software architecture and pragmatic engineering trade-offs.",
    ],
    niceToHave: [
      "Experience visualizing complex evaluation data and interactive charts.",
      "Familiarity with ONNX Runtime, TensorRT, or WebGPU APIs.",
    ],
  },
  {
    slug: "research-intern",
    title: "Research intern",
    team: "Research",
    location: "Onsite",
    type: "Internship",
    summary:
      "Explore novel pruning, distillation, and representation techniques alongside senior researchers. A structured role focused on deep technical inquiry and practical experimentation.",
    responsibilities: [
      "Conduct targeted literature reviews on modern model distillation and compression.",
      "Implement and compare baseline algorithms on standard benchmark datasets.",
      "Assist in analyzing device profiling logs and identifying performance regressions.",
      "Present findings and experimental artifacts to the broader research team.",
    ],
    requirements: [
      "Current enrollment in or recent completion of a STEM degree program (CS, Math, EE, or Physics).",
      "Familiarity with deep learning fundamentals and PyTorch experimentation.",
      "Working knowledge of linear algebra, probability, and basic algorithmic complexity.",
      "Curiosity, intellectual honesty, and enthusiasm for empirical verification.",
    ],
    niceToHave: [
      "Completed coursework or independent projects in machine learning systems.",
      "Active participation in competitive programming or academic research groups.",
    ],
  },
];

/**
 * Returns sorted unique team names from available roles.
 */
export function getTeams(): string[] {
  const teams = Array.from(new Set(ROLES.map((r) => r.team)));
  return teams.sort();
}

/**
 * Finds a role by its slug.
 */
export function getRole(slug: string): Role | undefined {
  return ROLES.find((r) => r.slug === slug);
}

/**
 * Returns an application URL for a specific role or an open application mailto.
 */
export function applyUrl(role?: Role): string {
  if (role?.applyHref) {
    return role.applyHref;
  }
  const subject = role ? `Application: ${role.title}` : "Open application";
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}`;
}
