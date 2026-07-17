"use client";
import React from "react";
import LayoutWrapper from "@/components/layouts/LayoutWrapper";
import MotionWrapper from "@/components/motion/MotionWrapper";

interface FooterSectionProps {
  bindings?: Record<string, any>;
  properties?: Record<string, any>;
  layoutId?: string;
  motionId?: string;
  themeId?: string;
  className?: string;
}

export default function FooterSection({
  bindings = {},
  properties = {},
  layoutId,
  motionId,
  className,
}: FooterSectionProps) {
  const salutation = bindings.salutation || "";
  const creditText = bindings.creditText || "";
  const hashtag = bindings.hashtag || "";

  return (
    <MotionWrapper motionId={motionId} defaultMotionId="luxury-motion" type="reveal">
      <LayoutWrapper
        layoutId={layoutId}
        defaultLayoutId="story-stack"
        className={`py-16 px-6 ${className || ""}`}
        style={{ fontFamily: "var(--theme-font-body)", color: "var(--theme-text)" }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          {salutation && (
            <p
              style={{
                fontFamily: "var(--theme-font-heading)",
                fontSize: "1.25rem",
                lineHeight: 1.6,
                marginBottom: "1.25rem",
                color: "var(--theme-text)",
                opacity: 0.85,
              }}
            >
              {salutation}
            </p>
          )}

          {hashtag && (
            <p
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "var(--theme-accent)",
                letterSpacing: "0.05em",
                marginBottom: "1.5rem",
              }}
            >
              {hashtag}
            </p>
          )}

          {creditText && (
            <p
              style={{
                fontSize: "0.75rem",
                opacity: 0.4,
                letterSpacing: "0.03em",
              }}
            >
              {creditText}
            </p>
          )}
        </div>
      </LayoutWrapper>
    </MotionWrapper>
  );
}