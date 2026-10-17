import { ImageResponse } from "next/og";
import { content } from "@/content";

export const alt = content.meta.ogAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "#F8FAFC",
          backgroundColor: "#05050C",
          backgroundImage:
            "radial-gradient(70% 60% at 50% 105%, rgba(124,58,237,0.55) 0%, rgba(59,130,246,0.18) 40%, rgba(5,5,12,0) 70%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 30, letterSpacing: 6 }}>
          <svg width="56" height="56" viewBox="0 0 48 48">
            <path
              d="M11 11.5 24 37.5 37 11.5"
              fill="none"
              stroke="#8b7cf6"
              strokeWidth="4.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M39.8 17.7c2.4 3.9-2.6 9.6-11.2 12.9-8.9 3.4-17.4 3.1-20.4-.2"
              fill="none"
              stroke="#5b8cf6"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M39.6 6.2c.3 1.9.9 2.5 2.8 2.8-1.9.3-2.5.9-2.8 2.8-.3-1.9-.9-2.5-2.8-2.8 1.9-.3 2.5-.9 2.8-2.8Z"
              fill="#F8FAFC"
            />
          </svg>
          VORION CODE
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 110 }}>
          <div style={{ fontSize: 76, lineHeight: 1.02, letterSpacing: -2, maxWidth: 900 }}>
            {content.hero.headline}
          </div>
          <div style={{ fontSize: 28, color: "#9CA3AF" }}>Ideias em órbita. Soluções em escala.</div>
        </div>
        <div
          style={{
            position: "absolute",
            left: -100,
            right: -100,
            bottom: -905,
            height: 1000,
            borderRadius: "50%",
            borderTop: "2px solid rgba(220,205,255,0.85)",
            boxShadow: "0 -20px 80px rgba(167,139,250,0.55)",
            background: "#0b0a1f",
          }}
        />
      </div>
    ),
    size,
  );
}
