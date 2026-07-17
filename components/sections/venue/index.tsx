"use client";
import React from "react";
import LayoutWrapper from "@/components/layouts/LayoutWrapper";
import MotionWrapper from "@/components/motion/MotionWrapper";

interface Venue {
  venueName?: string;
  address?: string;
  city?: string;
  mapsUrl?: string;
  embedUrl?: string;
}

interface VenueSectionProps {
  bindings?: Record<string, any>;
  properties?: Record<string, any>;
  layoutId?: string;
  motionId?: string;
  themeId?: string;
  className?: string;
}

export default function VenueSection({
  bindings = {},
  properties = {},
  layoutId,
  motionId,
  className,
}: VenueSectionProps) {
  const title = bindings.title || "Venue";
  const venues: Venue[] = bindings.venues || [];

  return (
    <MotionWrapper motionId={motionId} defaultMotionId="luxury-motion" type="reveal">
      <LayoutWrapper
        layoutId={layoutId}
        defaultLayoutId="story-stack"
        className={`py-20 px-6 ${className || ""}`}
        style={{ fontFamily: "var(--theme-font-body)", color: "var(--theme-text)" }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "var(--theme-font-heading)",
              fontSize: "2rem",
              marginBottom: "2.5rem",
              color: "var(--theme-accent)",
              letterSpacing: "0.04em",
            }}
          >
            {title}
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: venues.length > 1 ? "repeat(auto-fit, minmax(320px, 1fr))" : "1fr",
              gap: "2rem",
            }}
          >
            {venues.map((venue, index) => (
              <div
                key={index}
                style={{
                  background: "var(--theme-surface, rgba(255,255,255,0.05))",
                  borderRadius: 16,
                  padding: "2rem",
                  border: "1px solid var(--theme-border, rgba(255,255,255,0.1))",
                  textAlign: "center",
                }}
              >
                {venue.venueName && (
                  <h3
                    style={{
                      fontFamily: "var(--theme-font-heading)",
                      fontSize: "1.35rem",
                      marginBottom: "0.75rem",
                      color: "var(--theme-text)",
                    }}
                  >
                    {venue.venueName}
                  </h3>
                )}

                {venue.address && (
                  <p
                    style={{
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      opacity: 0.8,
                      marginBottom: "0.25rem",
                    }}
                  >
                    {venue.address}
                  </p>
                )}

                {venue.city && (
                  <p
                    style={{
                      fontSize: "0.9rem",
                      opacity: 0.6,
                      marginBottom: "1.25rem",
                    }}
                  >
                    {venue.city}
                  </p>
                )}

                {venue.embedUrl && (
                  <div
                    style={{
                      borderRadius: 12,
                      overflow: "hidden",
                      marginBottom: "1.25rem",
                      border: "1px solid var(--theme-border, rgba(255,255,255,0.1))",
                    }}
                  >
                    <iframe
                      src={venue.embedUrl}
                      width="100%"
                      height="200"
                      style={{ border: 0, display: "block" }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Map of ${venue.venueName || "venue"}`}
                    />
                  </div>
                )}

                {venue.mapsUrl && (
                  <a
                    href={venue.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "0.6rem 1.4rem",
                      borderRadius: 999,
                      background: "var(--theme-accent)",
                      color: "var(--theme-bg, #fff)",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      letterSpacing: "0.02em",
                      transition: "opacity 0.2s",
                    }}
                  >
                    📍 Open in Maps
                  </a>
                )}
              </div>
            ))}
          </div>

          {venues.length === 0 && (
            <p style={{ opacity: 0.5, fontStyle: "italic" }}>Venue details coming soon.</p>
          )}
        </div>
      </LayoutWrapper>
    </MotionWrapper>
  );
}