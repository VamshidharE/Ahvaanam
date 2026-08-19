import { ImageResponse } from "next/og";
import { getInvitationMeta } from "@/lib/utils/invitationMeta";

export const runtime = "nodejs";

export const alt = "Invitation Preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const meta = await getInvitationMeta(id);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#FAF9F6",
          padding: "36px",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Outer Decorative Gold Border */}
        <div
          style={{
            position: "absolute",
            inset: "20px",
            border: "3px solid #C49B27",
            borderRadius: "28px",
            display: "flex",
          }}
        />

        {/* Inner Thin Gold Border */}
        <div
          style={{
            position: "absolute",
            inset: "30px",
            border: "1px solid rgba(196, 155, 39, 0.4)",
            borderRadius: "20px",
            display: "flex",
          }}
        />

        {/* Corner Accents */}
        <div style={{ position: "absolute", top: "38px", left: "42px", color: "#C49B27", fontSize: 24 }}>✦</div>
        <div style={{ position: "absolute", top: "38px", right: "42px", color: "#C49B27", fontSize: 24 }}>✦</div>
        <div style={{ position: "absolute", bottom: "38px", left: "42px", color: "#C49B27", fontSize: 24 }}>✦</div>
        <div style={{ position: "absolute", bottom: "38px", right: "42px", color: "#C49B27", fontSize: 24 }}>✦</div>

        {/* Top Header Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "16px",
          }}
        >
          {/* Auspicious Mantra / Symbol */}
          <div
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: "#C49B27",
              letterSpacing: "3px",
              marginBottom: "8px",
            }}
          >
            {meta.mantraText}
          </div>

          {/* Category Pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "rgba(196, 155, 39, 0.1)",
              border: "1px solid rgba(196, 155, 39, 0.3)",
              padding: "6px 20px",
              borderRadius: "50px",
              color: "#997314",
              fontSize: 13,
              fontWeight: "bold",
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            ✦ {meta.categoryTitle} ✦
          </div>
        </div>

        {/* Center Main Names & Blessing Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            maxWidth: "920px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              fontSize: 16,
              color: "#7A695C",
              letterSpacing: "4px",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: "12px",
            }}
          >
            Together with their families
          </div>

          {/* Couple / Main Person Names */}
          <div
            style={{
              fontSize: meta.headingNames.length > 25 ? 54 : 64,
              fontWeight: "bold",
              color: "#241E1C",
              lineHeight: 1.15,
              textTransform: "uppercase",
              letterSpacing: "2px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              textShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            {meta.headingNames}
          </div>

          {/* Divider Line */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "360px",
              marginTop: "16px",
              marginBottom: "12px",
            }}
          >
            <div style={{ height: "1px", flex: 1, backgroundColor: "#C49B27", opacity: 0.5 }} />
            <div style={{ margin: "0 12px", color: "#C49B27", fontSize: 18 }}>✦</div>
            <div style={{ height: "1px", flex: 1, backgroundColor: "#C49B27", opacity: 0.5 }} />
          </div>

          {/* Invitation Callout */}
          <div
            style={{
              fontSize: 18,
              color: "#5C4B3E",
              fontStyle: "italic",
              maxWidth: "760px",
            }}
          >
            Request the honour of your presence to celebrate this auspicious beginning
          </div>
        </div>

        {/* Bottom Details Section (Date, Venue & Ahvaanam Branding) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            marginBottom: "12px",
          }}
        >
          {/* Date & Venue Pill */}
          {(meta.dateText || meta.venueText) && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "1px solid rgba(196, 155, 39, 0.25)",
                borderRadius: "16px",
                padding: "10px 24px",
                color: "#241E1C",
                fontSize: 15,
                fontWeight: 600,
                marginBottom: "14px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              }}
            >
              {meta.dateText && <span>🗓 {meta.dateText}</span>}
              {meta.dateText && meta.venueText && <span style={{ color: "#C49B27" }}>•</span>}
              {meta.venueText && <span>📍 {meta.venueText}</span>}
            </div>
          )}

          {/* Brand Seal */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#C49B27",
              fontSize: 12,
              letterSpacing: "3px",
              textTransform: "uppercase",
              fontWeight: "bold",
            }}
          >
            AHVAANAM • PREMIUM DIGITAL INVITATIONS
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
