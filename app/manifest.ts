import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "minibyte",
    short_name: "minibyte",
    description:
      "minibyte is an AI R&D and defence engineering firm building autonomous systems and on-device AI.",
    start_url: "/",
    display: "standalone",
    background_color: "#F3F4F1",
    theme_color: "#0C0E12",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
