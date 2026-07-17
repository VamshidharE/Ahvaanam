"use client";

import React from "react";
import LayoutWrapper from "@/components/layouts/LayoutWrapper";
import MotionWrapper from "@/components/motion/MotionWrapper";

interface EventItem {
  title?: string;
  date?: string;
  time?: string;
  venue?: string;
  description?: string;
  icon?: string;
  enabled?: boolean;
}

interface EventsSectionProps {
  bindings?: Record<string, any>;
  properties?: Record<string, any>;
  layoutId?: string;
  motionId?: string;
  themeId?: string;
  className?: string;
}

export default function EventsSection({
  bindings = {},
  properties = {},
  layoutId,
  motionId,
  className,
}: EventsSectionProps) {
  const title = bindings.title || "Wedding Events";
  const allEvents: EventItem[] = Array.isArray(bindings.events) ? bindings.events : [];
  const events = allEvents.filter((e) => e.enabled !== false);

  return (
    <MotionWrapper motionId={motionId} defaultMotionId="luxury-motion" type="reveal">
      <LayoutWrapper
        layoutId={layoutId}
        defaultLayoutId="story-stack"
        className={`events-section ${className || ""}`}
        style={{
          fontFamily: "var(--theme-font-body)",
          color: "var(--theme-text)",
          padding: "5rem 1.5rem",
        }}
      >
        {/* Section title */}
        <h2
          style={{
            fontFamily: "var(--theme-font-heading, serif)",
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            fontWeight: 300,
            textAlign: "center",
            margin: "0 0 1rem 0",
            letterSpacing: "0.05em",
          }}
        >
          {title}
        </h2>

        {/* Decorative divider */}
        <div
          style={{
            width: "4rem",
            height: "1px",
            background: "var(--theme-accent, #c9a96e)",
            margin: "0 auto 3rem auto",
          }}
        />

        {events.length === 0 ? (
          <p style={{ textAlign: "center", opacity: 0.6 }}>No events to display.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 20rem), 1fr))",
              gap: "1.5rem",
              width: "100%",
              maxWidth: "64rem",
              margin: "0 auto",
            }}
          >
            {events.map((event, index) => (
              <div
                key={index}
                style={{
                  padding: "2rem 1.5rem",
                  borderRadius: "0.75rem",
                  border: "1px solid var(--theme-border, rgba(255,255,255,0.1))",
                  backgroundColor: "var(--theme-surface, rgba(255,255,255,0.03))",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {/* Icon */}
                {event.icon && (
                  <span
                    style={{ fontSize: "1.75rem", lineHeight: 1 }}
                    aria-hidden="true"
                  >
                    {event.icon}
                  </span>
                )}

                {/* Event title */}
                <h3
                  style={{
                    fontFamily: "var(--theme-font-heading, serif)",
                    fontSize: "1.2rem",
                    fontWeight: 400,
                    margin: 0,
                    color: "var(--theme-accent, #c9a96e)",
                  }}
                >
                  {event.title || "Event"}
                </h3>

                {/* Date & time */}
                {(event.date || event.time) && (
                  <p
                    style={{
                      fontSize: "0.85rem",
                      margin: 0,
                      opacity: 0.7,
                      display: "flex",
                      gap: "0.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    {event.date && <span>{event.date}</span>}
                    {event.date && event.time && <span>·</span>}
                    {event.time && <span>{event.time}</span>}
                  </p>
                )}

                {/* Venue */}
                {event.venue && (
                  <p
                    style={{
                      fontSize: "0.85rem",
                      margin: 0,
                      opacity: 0.7,
                    }}
                  >
                    📍 {event.venue}
                  </p>
                )}

                {/* Description */}
                {event.description && (
                  <p
                    style={{
                      fontSize: "0.9rem",
                      lineHeight: 1.6,
                      margin: 0,
                      opacity: 0.8,
                    }}
                  >
                    {event.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </LayoutWrapper>
    </MotionWrapper>
  );
}