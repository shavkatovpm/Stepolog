import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#1A1A1A",
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="22"
          height="22"
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
      </div>
    ),
    { ...size }
  );
}
