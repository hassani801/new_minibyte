export const ABOUT = {
  hero: {
    eyebrow: "ABOUT",
    title: "Engineering autonomy and on-device AI",
    lead: "minibyte is a Pakistan-based AI R&D and defence/autonomy engineering firm with roots in CARE (Centre for Advanced Research in Engineering, Pakistan), with a team in Pakistan and clients or presence in the US, UK, Germany, UAE and South Korea.",
  },
  story: {
    eyebrow: "OUR ROOTS",
    headline: "Built on engineering rigor",
    paragraphs: [
      "minibyte grew out of engineering roots at CARE (Centre for Advanced Research in Engineering, Pakistan), tackling complex signal processing, embedded systems, and autonomous navigation challenges.",
      "Today, we operate across four core areas: Autonomous Robotics, AI/ML Services, Automotive Tech, and Full-Stack Software Development. We build software and models that run where the work happens: on uncrewed air and ground platforms, edge compute modules, and low-latency field radios.",
      "With our engineering core in Pakistan and an active presence across the United States, United Kingdom, Germany, UAE, and South Korea, every project is anchored in rigorous measurement and full handover of code, weights, and documentation.",
    ],
    facts: [
      { label: "Roots", value: "CARE (Pakistan)" },
      { label: "Core areas", value: "Robotics, AI, Automotive, Software" },
      { label: "Presence", value: "US, UK, DE, UAE, KR, PK" },
    ],
  },
  principles: {
    eyebrow: "HOW WE WORK",
    headline: "Four principles",
    items: [
      {
        title: "Measure first",
        text: "We agree on the test set before we write a line of model code.",
      },
      {
        title: "Built for hardware",
        text: "Models and autonomy stacks are engineered for the specific compute and power limits of the field.",
      },
      {
        title: "Evidence, not a demo",
        text: "Every claim comes with verifiable data and operational validation.",
      },
      {
        title: "Yours to keep",
        text: "Weights, code and documentation are handed over, always.",
      },
    ],
  },
  team: {
    eyebrow: "THE TEAM",
    headline: "People behind the bits",
    // NEEDS REAL DATA: team members (names, roles, photos, links)
    members: [] as { name: string; role: string; photo?: string; link?: string }[],
  },
  cta: {
    eyebrow: "WORK WITH US",
    headline: "Want to build something that lasts",
    sub: "Tell us the problem and where it has to run.",
    primary: { label: "Start a project", href: "/contact" },
  },
} as const;

export type AboutContent = typeof ABOUT;
