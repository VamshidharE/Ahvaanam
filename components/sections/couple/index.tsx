"use client";

import React from "react";
import LayoutWrapper from "@/components/layouts/LayoutWrapper";
import MotionWrapper from "@/components/motion/MotionWrapper";

interface CoupleSectionProps {
  bindings?: Record<string, any>;
  properties?: Record<string, any>;
  layoutId?: string;
  motionId?: string;
  themeId?: string;
  className?: string;
}

export default function CoupleSection({
  bindings = {},
  properties = {},
  layoutId,
  motionId,
  className,
}: CoupleSectionProps) {
  const title = bindings.title || "The Happy Couple";
  const brideName = bindings.brideName || "Bride";
  const groomName = bindings.groomName || "Groom";
  const brideParents = bindings.brideParents || "";
  const groomParents = bindings.groomParents || "";
  const message = bindings.message || "";

  return (
    <MotionWrapper motionId={motionId} defaultMotionId="luxury-motion" type="reveal">
      <LayoutWrapper
        layoutId={layoutId}
        defaultLayoutId="story-stack"
        className={`couple-section ${className || ""}`}
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

        {/* Couple names container */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
            flexWrap: "wrap",
            width: "100%",
            maxWidth: "56rem",
            margin: "0 auto",
          }}
        >
          {/* Bride */}
          <div
            style={{
              flex: "1 1 14rem",
              textAlign: "center",
              padding: "2rem 1.5rem",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--theme-font-heading, serif)",
                fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
                fontWeight: 300,
                margin: "0 0 0.75rem 0",
                color: "var(--theme-accent, #c9a96e)",
              }}
            >
              {brideName}
            </h3>
            {brideParents && (
              <p
                style={{
                  fontSize: "0.9rem",
                  opacity: 0.7,
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {brideParents}
              </p>
            )}
          </div>

          {/* Ampersand divider */}
          <div
            style={{
              fontFamily: "var(--theme-font-heading, serif)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 200,
              color: "var(--theme-accent, #c9a96e)",
              opacity: 0.6,
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            &amp;
          </div>

          {/* Groom */}
          <div
            style={{
              flex: "1 1 14rem",
              textAlign: "center",
              padding: "2rem 1.5rem",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--theme-font-heading, serif)",
                fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
                fontWeight: 300,
                margin: "0 0 0.75rem 0",
                color: "var(--theme-accent, #c9a96e)",
              }}
            >
              {groomName}
            </h3>
            {groomParents && (
              <p
                style={{
                  fontSize: "0.9rem",
                  opacity: 0.7,
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {groomParents}
              </p>
            )}
          </div>
        </div>

        {/* Love message */}
        {message && (
          <p
            style={{
              textAlign: "center",
              maxWidth: "36rem",
              margin: "3rem auto 0 auto",
              fontSize: "1.05rem",
              lineHeight: 1.8,
              fontStyle: "italic",
              opacity: 0.8,
            }}
          >
            &ldquo;{message}&rdquo;
          </p>
        )}
      </LayoutWrapper>
    </MotionWrapper>
  );
}