export const SITE_METADATA = {
  name: "minibyte",
  title: "minibyte",
  titleTemplate: "%s · minibyte",
  description: "Big questions. Small models. minibyte is an AI research lab.",
  tagline: "Big questions. Small models.",
  url: "https://minibyte.ai",
} as const;

export const BRAND_COLORS = {
  paper: "#F3F4F1",
  ink: "#0C0E12",
  bitBlue: "#4654FF",
  white: "#FFFFFF",
  mist: "#D9DCD6",
  graphite: "#5A606B",
} as const;

export const BRAND_HEX = {
  ink: "#0C0E12",
  paper: "#F3F4F1",
  mist: "#D9DCD6",
  graphite: "#5A606B",
  bitBlue: "#4654FF",
} as const;

export const NAV_ITEMS = [
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Research", href: "/research" },
  { name: "Careers", href: "/careers" },
] as const;

export const NAV_CTA = { name: "Contact", href: "/contact" } as const;

export const MENU_ITEMS = [
  { name: "Home", href: "/" },
  ...NAV_ITEMS,
  NAV_CTA,
] as const;


export const ROUTE_LABELS: Record<string, string> = {
  "/": "Home",
  "/about": "About",
  "/services": "Services",
  "/portfolio": "Portfolio",
  "/research": "Research",
  "/careers": "Careers",
  "/contact": "Contact",
};

/**
 * Returns a human-readable route label for navigation overlay and screen reader announcements.
 * Strategy:
 * 1. Exact match in ROUTE_LABELS
 * 2. First path segment match in ROUTE_LABELS (e.g. /research/model-x -> /research)
 * 3. Capitalized last segment (e.g. /dev/transition/a -> "A")
 * 4. Fallback: "minibyte"
 */
export function getRouteLabel(pathname: string): string {
  if (!pathname) return "minibyte";
  const cleanPath = pathname.split("?")[0].replace(/\/+$/, "") || "/";

  // 1. Exact match
  if (ROUTE_LABELS[cleanPath]) {
    return ROUTE_LABELS[cleanPath];
  }

  // 2. First segment match or capitalized last segment
  const segments = cleanPath.split("/").filter(Boolean);
  if (segments.length > 0) {
    const firstSegmentPath = `/${segments[0]}`;
    if (ROUTE_LABELS[firstSegmentPath]) {
      return ROUTE_LABELS[firstSegmentPath];
    }

    // Capitalize last segment
    const last = segments[segments.length - 1];
    if (last) {
      return last.charAt(0).toUpperCase() + last.slice(1);
    }
  }

  return "minibyte";
}

export const HOME_HERO = {
  eyebrow: "AI R&D AND AUTONOMY ENGINEERING",
  // Tagline may not fit the defence/robotics work; confirm with the team
  headline: ["Big questions.", "Small models."],
  subline:
    "minibyte is a Pakistan-based AI R&D and defence/autonomy engineering firm with roots in CARE, building autonomous systems, on-device AI, and mission-critical software.",
  primary: { label: "Start a project", href: "/contact" },
  secondary: { label: "See our work", href: "/portfolio" },
  points: [
    "Autonomous robotics & defence systems",
    "On-device models & computer vision",
    "Engineering presence across US, UK, EU, UAE, KR, and PK",
  ],
  hint: { desktop: "Click anywhere to send a ping", touch: "Tap anywhere to send a ping" },
} as const;

export const BYTE_IDEA = {
  eyebrow: "THE IDEA",
  headline: "One byte spells m",
  lead: "In every computer, the letter m is stored as 01101101.",
  points: [
    "Eight dots: large for 1, small for 0.",
    "Folded into two rows, they become the mark.",
    "The name minibyte has eight letters, one for each bit.",
  ],
  cardLabel: "ONE BYTE",
  cardTitle: "One byte spells m.",
  captions: [
    { term: "01101101", text: "Binary for 109, the ASCII code of the letter m. Large dots are 1, small dots are 0." },
    { term: "4 × 2", text: "Fold the row in half and it becomes the mark. The final bit is always blue." },
    { term: "8 letters", text: "The name minibyte is eight characters long: one letter for every bit in a byte." },
  ],
  cta: { label: "Read the full story", href: "/about" },
} as const;

export const CAPABILITIES_COPY = {
  eyebrow: "WHAT WE DO",
  headline: "Research that ships",
  lead: "From autonomous robotics to full-stack systems, we engineer software and models that execute where the mission happens.",
  cta: { label: "All services", href: "/services" },
} as const;

export const CAPABILITIES = [
  {
    slug: "autonomous-robotics",
    title: "Autonomous robotics",
    description: "Perception, localization, and control architectures for uncrewed ground and aerial vehicles built on ROS2 and real-time sensor processing.",
    tags: ["ROS2", "Robotics", "Autonomy"],
  },
  {
    slug: "ai-ml-services",
    title: "AI and ML services",
    description: "On-device models, fine-tuned RAG pipelines, and high-throughput computer vision accelerated with CUDA and NVIDIA Jetson silicon.",
    tags: ["On-device models", "CUDA", "Vision"],
  },
  {
    slug: "automotive-tech",
    title: "Automotive technology",
    description: "Drive-by-wire integration, in-vehicle vision analytics, and rugged edge compute for ground mobility and fleet operations.",
    tags: ["Drive-by-wire", "Edge compute", "Mobility"],
  },
  {
    slug: "full-stack-software",
    title: "Full-stack software development",
    description: "Mission-critical web, mobile, and streaming infrastructure featuring WebRTC streaming, real-time telemetry, and resilient microservices.",
    tags: ["WebRTC streaming", "Full-stack", "Telemetry"],
  },
] as const;

export type Capability = (typeof CAPABILITIES)[number];

export const WORK_COPY = {
  eyebrow: "SELECTED WORK",
  headline: "Built, measured, delivered",
  lead: "A few recent projects. Every one ships with numbers you can check.",
  cta: { label: "All projects", href: "/portfolio" },
} as const;

export const CLIENTS_COPY = {
  badge: "WHERE WE WORK",
  headline: "Teams and clients across three continents",
  sub: "Presence in Pakistan with client engagements and deployments across North America, Europe, and Asia.",
} as const;

export type Client = { name: string; logoSrc?: string };

export const CLIENTS: Client[] = [
  { name: "United States" },
  { name: "United Kingdom" },
  { name: "Germany" },
  { name: "UAE" },
  { name: "South Korea" },
  { name: "Pakistan" },
];

export interface ContactInfo {
  email: string;
  phone?: string;
  location?: string;
  bookingUrl?: string;
  whatsapp?: string;
}

export const CONTACT: ContactInfo = {
  email: "info@minibyte.ai",
  phone: "", // optional; leave empty to hide
  location: "Rawalpindi / Islamabad, Pakistan",
  bookingUrl: "", // optional booking link; empty = hidden
  whatsapp: "", // optional WhatsApp number; empty = hidden
};

export const CTA_COPY = {
  eyebrow: "START A PROJECT",
  headline: "Have a hard problem? Let's talk",
  sub: "Tell us what you need to run on the device. We reply within two working days.",
  primary: { label: "Start a project", href: "/contact" },
  copyLabel: "Copy email",
  copiedLabel: "Copied",
  byteLine: "01101101 = m",
} as const;

export const FOOTER = {
  tagline: "Big questions. Small models.",
  descriptor: "AI R&D and defence/autonomy engineering firm",
  legalName: "MINIBYTE",
  address: ["Rawalpindi / Islamabad, Pakistan"],
  columns: [
    {
      title: "Capabilities",
      links: [
        { name: "AI / ML", href: "/services#ai-ml-services" },
        { name: "Software Engineering", href: "/services#full-stack-software" },
        { name: "Robotics & Autonomous Systems", href: "/services#autonomous-robotics" },
        { name: "Computer Vision", href: "/services#ai-ml-services" },
        { name: "Edge AI", href: "/services#ai-ml-services" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Selected Work", href: "/portfolio" },
        { name: "Contact", href: "/contact" },
        { name: "Careers", href: "/careers" },
      ],
    },
  ],
} as const;

export const SOCIALS = [
  { name: "LinkedIn", href: "https://www.linkedin.com/company/minibyte" },
  { name: "GitHub", href: "" },
  { name: "Instagram", href: "" },
  { name: "X", href: "" },
] as const;

export const LEGAL = [
  { name: "Privacy", href: "/privacy", enabled: true },
  { name: "Terms", href: "/terms", enabled: true },
] as const;

