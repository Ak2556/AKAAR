import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "AKAAR 3D";
  const subtitle = searchParams.get("subtitle") ?? "Giving AKAAR to Ideas";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #0a0a0b 0%, #111318 40%, #0d1117 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Grid pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(214,178,114,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(214,178,114,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Accent glow */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            right: "10%",
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(214,178,114,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Logo mark */}
        <div
          style={{
            position: "absolute",
            top: 56,
            left: 72,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              border: "1px solid rgba(214,178,114,0.4)",
              background: "rgba(214,178,114,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <polygon
                points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"
                stroke="rgb(214,178,114)"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </div>
          <span style={{ color: "#d6b272", fontSize: 20, fontWeight: 600, letterSpacing: "0.05em" }}>
            AKAAR 3D
          </span>
        </div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "relative", zIndex: 1 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#d6b272",
            }}
          >
            3D Printing · Jaipur, India
          </div>
          <div
            style={{
              fontSize: title.length > 40 ? 52 : 64,
              fontWeight: 700,
              color: "#f2f2f2",
              lineHeight: 1.1,
              maxWidth: 820,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 24,
              color: "rgba(255,255,255,0.55)",
              maxWidth: 680,
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Bottom divider line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, transparent, #d6b272, transparent)",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
