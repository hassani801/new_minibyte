import { ImageResponse } from "next/og";

export const alt = "minibyte · Big questions. Small models.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  // 01101101 binary:
  // Row 1: 0 (small), 1 (large), 1 (large), 0 (small)
  // Row 2: 1 (large), 1 (large), 0 (small), 1 (large, bitBlue)
  const row1 = [
    { bit: 0, blue: false },
    { bit: 1, blue: false },
    { bit: 1, blue: false },
    { bit: 0, blue: false },
  ];
  const row2 = [
    { bit: 1, blue: false },
    { bit: 1, blue: false },
    { bit: 0, blue: false },
    { bit: 1, blue: true },
  ];

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
        {/* Top bar with ByteMark and wordmark */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Byte mark 4x2 grid */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginRight: 28,
            }}
          >
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {row1.map((item, i) => (
                <div
                  key={i}
                  style={{
                    width: item.bit === 1 ? 14 : 7,
                    height: item.bit === 1 ? 14 : 7,
                    borderRadius: "50%",
                    backgroundColor: "#F3F4F1",
                  }}
                />
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {row2.map((item, i) => (
                <div
                  key={i}
                  style={{
                    width: item.bit === 1 ? 14 : 7,
                    height: item.bit === 1 ? 14 : 7,
                    borderRadius: "50%",
                    backgroundColor: item.blue ? "#4654FF" : "#F3F4F1",
                  }}
                />
              ))}
            </div>
          </div>
          <span
            style={{
              fontSize: 36,
              fontWeight: 500,
              color: "#F3F4F1",
              letterSpacing: "-0.04em",
            }}
          >
            minibyte
          </span>
        </div>

        {/* Center / Bottom copy */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 64,
              fontWeight: 600,
              color: "#F3F4F1",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            <span>Big questions.</span>
            <span>Small models.</span>
          </div>
          <div
            style={{
              fontSize: 24,
              color: "rgba(243, 244, 241, 0.7)",
              marginTop: 12,
            }}
          >
            AI R&D and defence autonomy engineering
          </div>
        </div>

        {/* Footer domain */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(243, 244, 241, 0.15)",
            paddingTop: 24,
            fontSize: 18,
            color: "rgba(243, 244, 241, 0.5)",
          }}
        >
          <span>minibyte.ai</span>
          <span>01101101 = m</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
