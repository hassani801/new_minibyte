import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

/**
 * Apple Touch Icon (180x180) generated via next/og ImageResponse.
 * Ink rounded square with Paper dots and Bit Blue terminal dot.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0C0E12",
          borderRadius: 40,
        }}
      >
        <svg
          width="120"
          height="60"
          viewBox="0 0 52 26"
          fill="none"
        >
          {/* Row 1: 0 1 1 0 */}
          <circle cx="6.5" cy="6.5" r="1.6" fill="#F3F4F1" />
          <circle cx="19.5" cy="6.5" r="5" fill="#F3F4F1" />
          <circle cx="32.5" cy="6.5" r="5" fill="#F3F4F1" />
          <circle cx="45.5" cy="6.5" r="1.6" fill="#F3F4F1" />

          {/* Row 2: 1 1 0 1 (last is Bit Blue) */}
          <circle cx="6.5" cy="19.5" r="5" fill="#F3F4F1" />
          <circle cx="19.5" cy="19.5" r="5" fill="#F3F4F1" />
          <circle cx="32.5" cy="19.5" r="1.6" fill="#F3F4F1" />
          <circle cx="45.5" cy="19.5" r="5" fill="#4654FF" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
