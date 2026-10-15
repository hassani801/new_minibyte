import { ImageResponse } from "next/og";
import { PUBLIC_PROJECTS } from "@/lib/projects";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PUBLIC_PROJECTS.find((p) => p.slug === slug);
  return [
    {
      id: "og",
      size: { width: 1200, height: 630 },
      alt: project ? `${project.name} · minibyte case study` : "minibyte project",
      contentType: "image/png",
    },
  ];
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PUBLIC_PROJECTS.find((p) => p.slug === slug);
  const name = project ? project.name : slug;
  const summary = project ? project.summary : "Engineering case study";
  const tags = project ? project.tags.join(" · ") : "AI · Autonomy";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          backgroundColor: "#0C0E12",
          fontFamily: "monospace",
        }}
      >
        {/* Top bar with backlink wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#4654FF",
            }}
          />
          <span
            style={{
              fontSize: 24,
              color: "rgba(243, 244, 241, 0.7)",
              letterSpacing: "-0.02em",
            }}
          >
            minibyte / portfolio
          </span>
        </div>

        {/* Project Name in mono with Dot */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span
              style={{
                fontSize: 68,
                fontWeight: 600,
                color: "#F3F4F1",
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
              }}
            >
              {name}
            </span>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                backgroundColor: "#4654FF",
                marginTop: 8,
              }}
            />
          </div>
          <div
            style={{
              fontSize: 26,
              color: "rgba(243, 244, 241, 0.7)",
              lineHeight: 1.4,
              maxWidth: 900,
            }}
          >
            {summary}
          </div>
        </div>

        {/* Footer info: tags & domain */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(243, 244, 241, 0.15)",
            paddingTop: 24,
            fontSize: 20,
            color: "rgba(243, 244, 241, 0.5)",
          }}
        >
          <span>{tags}</span>
          <span>minibyte.ai</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
