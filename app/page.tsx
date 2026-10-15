import type { Metadata } from "next";
import { Hero } from "@/components/sections/home/hero";
import { ByteIdea } from "@/components/sections/home/byte-idea";
import { Capabilities } from "@/components/sections/home/capabilities";
import { SelectedWork } from "@/components/sections/home/selected-work";
import { Clients } from "@/components/sections/home/clients";
import { CompanyHighlights } from "@/components/sections/home/company-highlights";
import { FinalCta } from "@/components/sections/home/final-cta";

export const metadata: Metadata = {
  title: "minibyte · Big questions. Small models.",
  description:
    "AI R&D and defence autonomy engineering firm building autonomous robotics, edge AI modules, and mission-critical software systems.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ByteIdea />
      <Capabilities />
      <SelectedWork />
      <Clients />
      <CompanyHighlights />
      <FinalCta />
    </>
  );
}
