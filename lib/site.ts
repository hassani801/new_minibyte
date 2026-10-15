// CONFIRM domain with team before launch
export const SITE = {
  name: "minibyte",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://minibyte.ai",
  description:
    "minibyte is an AI R&D and defence engineering firm building autonomous systems and on-device AI.",
  locale: "en",
} as const;
