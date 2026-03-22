import { ImageResponse } from "next/og";

export const alt = "Stepolog.uz — Bepul bilim platformasi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1A1A1A",
          padding: "60px",
        }}
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="22" y="14" width="64" height="14" rx="2" fill="#FFDE59" />
          <rect x="72" y="24" width="14" height="24" fill="#FFDE59" />
          <rect x="14" y="43" width="20" height="14" rx="2" fill="#FFDE59" />
          <rect x="66" y="43" width="20" height="14" rx="2" fill="#FFDE59" />
          <rect x="14" y="52" width="14" height="24" fill="#FFDE59" />
          <rect x="14" y="72" width="64" height="14" rx="2" fill="#FFDE59" />
        </svg>
        <div
          style={{
            display: "flex",
            fontSize: "72px",
            fontWeight: 700,
            letterSpacing: "0.05em",
            color: "#F5F5F5",
            marginTop: "24px",
          }}
        >
          STEP
          <span style={{ color: "#FFDE59" }}>OLOG</span>
        </div>
        <div
          style={{
            fontSize: "24px",
            color: "#999999",
            marginTop: "16px",
            textAlign: "center",
          }}
        >
          Bepul bilim platformasi
        </div>
        <div
          style={{
            fontSize: "18px",
            color: "#666666",
            marginTop: "32px",
          }}
        >
          stepolog.uz
        </div>
      </div>
    ),
    { ...size }
  );
}
