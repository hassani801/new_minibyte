import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

// Build-time audit for portfolio images
try {
  const publicDir = path.join(process.cwd(), "public");
  const expectedImages = [
    "/portfolio/aethero-space.jpg",
    "/portfolio/aethero-module-pcb.jpg",
    "/portfolio/counter-uas-interceptor.jpg",
    "/portfolio/drone-aero-simulation.jpg",
    "/portfolio/vps-diagram.jpg",
    "/portfolio/vps-base-orthophoto.jpg",
    "/portfolio/vps-orthophoto-loop.jpg",
    "/portfolio/vps-satellite-path.jpg",
    "/portfolio/vps-urban-orthophoto.jpg",
    "/portfolio/agri-ugv.jpg",
    "/portfolio/fabsky-cad.jpg",
    "/portfolio/alpr-screen.jpg",
  ];
  const missing = expectedImages.filter((img) => !fs.existsSync(path.join(publicDir, img)));
  if (missing.length > 0) {
    console.warn(`\n[minibyte image audit] Build Warning: Missing portfolio file(s) in /public/portfolio:\n  - ${missing.join("\n  - ")}\n`);
  }
} catch {
  // Ignore in environments where fs is restricted
}

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/capabilities", destination: "/services", permanent: true },
      { source: "/capabilities/:path*", destination: "/services", permanent: true },
      { source: "/work", destination: "/portfolio", permanent: true },
      { source: "/work/:slug", destination: "/portfolio/:slug", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/terms-and-conditions", destination: "/terms", permanent: true },
      { source: "/project-showcase", destination: "/portfolio", permanent: true },
      { source: "/services/project-portfolio", destination: "/portfolio", permanent: true },
      { source: "/test-ball-animation", destination: "/", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/blog", destination: "/research", permanent: true },
      { source: "/blog/:path*", destination: "/research", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
