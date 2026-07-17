"use client";

import React from "react";
import LayoutWrapper from "@/components/layouts/LayoutWrapper";
import MotionWrapper from "@/components/motion/MotionWrapper";

interface StoryEntry {
  title?: string;
  description?: string;
  date?: string;
  image?: string;
}

interface StorySectionProps {
  bindings?: Record<string, any>;
  properties?: Record<string, any>;
  layoutId?: string;
  motionId?: string;
  themeId?: string;
  className?: string;
}

export default function StorySection({
  bindings = {},
  properties = {},
  layoutId,
  motionId,
  className,
}: StorySectionProps) {
  const title = bindings.title || "Our Story";
  const entries: StoryEntry[] = Array.isArray(bindings.entries) ? bindings.entries : [];

  return (
    <MotionWrapper motionId={motionId} defaultMotionId="luxury-motion" type="reveal">
      <LayoutWrapper
        layoutId={layoutId}
        defaultLayoutId="story-stack"
        className={`story-section ${className || ""}`}
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

        {entries.length === 0 ? (
          <p style={{ textAlign: "center", opacity: 0.6 }}>No story entries yet.</p>
        ) : (
          <div
            style={{
              position: "relative",
              maxWidth: "48rem",
              width: "100%",
              margin: "0 auto",
              paddingLeft: "2rem",
            }}
          >
            {/* Vertical timeline line */}
            <div
              style={{
                position: "absolute",
                left: "0.5rem",
                top: 0,
                bottom: 0,
                width: "1px",
                background: "var(--theme-border, rgba(255,255,255,0.15))",
              }}
            />

            {entries.map((entry, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  marginBottom: index < entries.length - 1 ? "3rem" : 0,
                  paddingLeft: "1.5rem",
                }}
              >
                {/* Timeline dot */}
                <div
                  style={{
                    position: "absolute",
                    left: "-1.75rem",
                    top: "0.35rem",
                    width: "0.6rem",
                    height: "0.6rem",
                    borderRadius: "50%",
                    backgroundColor: "var(--theme-accent, #c9a96e)",
                    border: "2px solid var(--theme-bg, #0a0a0a)",
                  }}
                />

                {/* Date */}
                {entry.date && (
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      opacity: 0.5,
                      marginBottom: "0.4rem",
                    }}
                  >
                    {entry.date}
                  </span>
                )}

                {/* Entry title */}
                {entry.title && (
                  <h3
                    style={{
                      fontFamily: "var(--theme-font-heading, serif)",
                      fontSize: "1.25rem",
                      fontWeight: 400,
                      margin: "0 0 0.5rem 0",
                      color: "var(--theme-accent, #c9a96e)",
                    }}
                  >
                    {entry.title}
                  </h3>
                )}

                {/* Entry image */}
                {entry.image && (
                  <div
                    style={{
                      marginBottom: "0.75rem",
                      borderRadius: "0.5rem",
                      overflow: "hidden",
                      maxWidth: "20rem",
                    }}
                  >
                    <img
                      src={entry.image}
                      alt={entry.title || `Story moment ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}

                {/* Entry description */}
                {entry.description && (
                  <p
                    style={{
                      fontSize: "0.95rem",
                      lineHeight: 1.7,
                      margin: 0,
                      opacity: 0.8,
                      maxWidth: "36rem",
                    }}
                  >
                    {entry.description}
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