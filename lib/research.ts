// PLACEHOLDER content: replace with real publications

export type PublicationType = "Paper" | "Technical report" | "Talk" | "Note";

export type Publication = {
  slug: string;
  title: string;
  type: PublicationType;
  date: string; // ISO yyyy-mm-dd
  authors: string[]; // e.g. ["A. Author", "B. Author"]
  venue?: string; // e.g. "Open Lab Night", "arXiv"
  abstract?: string; // 1-2 sentences
  href?: string; // external URL or internal path (/papers/x.pdf). Empty = "In preparation"
  cite?: string; // optional BibTeX string; shows a Copy citation control
  tags?: string[];
};

export const PUBLICATION_TYPES = [
  "Paper",
  "Technical report",
  "Talk",
  "Note",
] as const;

export const PUBLICATIONS: Publication[] = [
  {
    slug: "quantized-attention-edge",
    title: "Integer Attention Kernels for Microcontroller Vector Units",
    type: "Paper",
    date: "2026-10-02",
    authors: ["A. Author", "B. Author"],
    venue: "arXiv",
    abstract:
      "We formulate an integer-only scaled dot-product attention kernel tailored for ARM Cortex-M vector architectures, achieving zero floating-point operations.",
    href: "https://arxiv.org/abs/2610.00001",
    cite: `@article{author2026integer,
  title={Integer Attention Kernels for Microcontroller Vector Units},
  author={Author, A. and Author, B.},
  journal={arXiv preprint arXiv:2610.00001},
  year={2026}
}`,
    tags: ["Quantization", "Edge"],
  },
  {
    slug: "measured-eval-methodology",
    title: "Standardized Power and Latency Benchmarking for Sub-10MB Models",
    type: "Technical report",
    date: "2026-06-18",
    authors: ["B. Author", "C. Author"],
    venue: "minibyte Technical Reports",
    abstract:
      "A rigorous methodology for empirical measurement of battery drain, RAM footprint, and inference jitter across constrained silicon platforms.",
    href: "/reports/measured-eval-2026.pdf",
    tags: ["Evaluation", "Benchmarks"],
  },
  {
    slug: "tiny-robotics-perception",
    title: "Perception Under 15 Watts: Embedded Vision in Unknown Terrain",
    type: "Talk",
    date: "2026-03-24",
    authors: ["A. Author"],
    venue: "Open Robotics Workshop",
    abstract:
      "Slides and lecture notes from our keynote on designing stereo obstacle perception models for low-payload uncrewed vehicles.",
    href: "https://example.com/talks/robotics-2026",
    tags: ["Robotics", "Vision"],
  },
  {
    slug: "sub-byte-weight-packing",
    title: "Sub-Byte Weight Packing and Unaligned Memory Access on Edge Chips",
    type: "Paper",
    date: "2025-11-12",
    authors: ["A. Author", "D. Author"],
    venue: "Embedded Systems Symposium",
    abstract:
      "Techniques for storing non-standard bit-width weights without sacrificing sequential memory bandwidth during streaming token generation.",
    href: "https://example.com/papers/sub-byte-packing.pdf",
    cite: `@inproceedings{author2025subbyte,
  title={Sub-Byte Weight Packing on Edge Chips},
  author={Author, A. and Author, D.},
  booktitle={Embedded Systems Symposium},
  year={2025}
}`,
    tags: ["Quantization", "Architecture"],
  },
  {
    slug: "evaluating-reasoning-offline",
    title: "Why Small Models Fail Domain Tasks: Lessons from 2,000 Field Evals",
    type: "Talk",
    date: "2025-08-05",
    authors: ["B. Author"],
    venue: "Edge AI Summit",
    abstract:
      "An analysis of systematic failure modes when compact language models encounter out-of-distribution industrial terminology.",
    href: "https://example.com/talks/failure-modes-2025",
    tags: ["LLM", "Evaluation"],
  },
  {
    slug: "neural-compression-radios",
    title: "Neural Telemetry Compression for Contested Tactical Frequencies",
    type: "Note",
    date: "2025-04-14",
    authors: ["A. Author", "B. Author"],
    venue: "Lab Research Notes",
    abstract:
      "Early experimental findings on compressing structured tactical telemetry packets below 1 kilobit per second.",
    href: "", // In preparation
    tags: ["Defence", "Compression"],
  },
];

/**
 * Returns publications sorted in descending chronological order (newest first).
 */
export function getSortedPublications(): Publication[] {
  return [...PUBLICATIONS].sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Groups sorted publications by publication year.
 */
export function groupByYear(
  list: Publication[]
): { year: string; items: Publication[] }[] {
  const groups: Record<string, Publication[]> = {};

  for (const item of list) {
    const year = item.date.slice(0, 4);
    if (!groups[year]) {
      groups[year] = [];
    }
    groups[year].push(item);
  }

  return Object.keys(groups)
    .sort((a, b) => b.localeCompare(a))
    .map((year) => ({
      year,
      items: groups[year],
    }));
}

export type ByteTerm = {
  term: string;
  definition: string;
  more?: string;
};

export const BYTES: ByteTerm[] = [
  {
    term: "token",
    definition:
      "The atomic chunk of text—a word or subword fragment—that a model reads and produces.",
  },
  {
    term: "attention",
    definition:
      "The mathematical mechanism determining how much focus a model gives each preceding word.",
  },
  {
    term: "quantization",
    definition:
      "Compressing model weights by reducing numerical precision, typically from 16-bit to 4-bit.",
  },
  {
    term: "nibble",
    definition:
      "A four-bit unit of digital data, exactly half of one standard eight-bit byte.",
  },
  {
    term: "parameter",
    definition:
      "A learned weight inside the neural network that determines its predictive behavior.",
  },
  {
    term: "context window",
    definition:
      "The maximum number of tokens a model can hold in memory at any single moment.",
  },
  {
    term: "inference",
    definition:
      "Running an already-trained model on fresh input data to generate an answer.",
  },
  {
    term: "embedding",
    definition:
      "A vector of numbers that represents the semantic meaning of a word or concept.",
  },
];

export const RESEARCH_PAGE = {
  hero: {
    eyebrow: "RESEARCH",
    title: "Notes from the lab",
    lead: "Papers, reports and talks on making language models small, fast and measurable. Everything we publish comes with the numbers.",
  },
  list: {
    eyebrow: "PUBLICATIONS",
    headline: "Papers, reports and talks",
    filterLabel: "Filter by type",
    all: "All",
    empty: "Nothing here yet. New work lands soon.",
    inPrep: "IN PREPARATION",
    latest: "LATEST",
  },
  bytes: {
    eyebrow: "BYTES",
    headline: "One term, explained",
    lead: "A running series that explains one term of the field per post.",
    more: "Read more",
  },
  cta: {
    eyebrow: "COLLABORATE",
    headline: "Want to research with us",
    sub: "We partner with industry and academia on evaluation and on-device models.",
    primary: {
      label: "Start a conversation",
      href: "/contact",
    },
  },
} as const;
