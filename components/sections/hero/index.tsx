"use client";

import React from "react";
import LayoutWrapper from "@/components/layouts/LayoutWrapper";
import MotionWrapper from "@/components/motion/MotionWrapper";

interface HeroSectionProps {
  bindings?: Record<string, any>;
  properties?: Record<string, any>;
  layoutId?: string;
  motionId?: string;
  themeId?: string;
  className?: string;
}

export default function HeroSection({
  bindings = {},
  properties = {},
  layoutId,
  motionId,
  className,
}: HeroSectionProps) {
  const title = bindings.title || "We're Getting Married";
  const subtitle = bindings.subtitle || "Join us for our special day";
  const welcomeMessage = bindings.welcomeMessage || "You are cordially invited";
  const ctaText = bindings.ctaText || "RSVP Now";
  const backgroundImage = bindings.backgroundImage || "";

  return (
    <MotionWrapper motionId={motionId} defaultMotionId="luxury-motion" type="reveal">
      <LayoutWrapper
        layoutId={layoutId}
        defaultLayoutId="story-stack"
        className={`hero-section ${className || ""}`}
        style={{
          fontFamily: "var(--theme-font-body)",
          color: "var(--theme-text)",
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: 0,
        }}
      >
        {/* Background image layer */}
        {backgroundImage && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 0,
            }}
          />
        )}

        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: backgroundImage
              ? "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 100%)"
              : "linear-gradient(135deg, var(--theme-primary, #1a1a2e) 0%, var(--theme-secondary, #16213e) 50%, var(--theme-accent, #0f3460) 100%)",
            zIndex: 1,
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "2rem 1.5rem",
            maxWidth: "48rem",
            width: "100%",
            gap: "1.5rem",
          }}
        >
          {/* Welcome badge */}
          <span
            style={{
              display: "inline-block",
              padding: "0.5rem 1.5rem",
              borderRadius: "9999px",
              border: "1px solid rgba(255,255,255,0.3)",
              backgroundColor: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(8px)",
              fontSize: "0.8rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: backgroundImage ? "#fff" : "var(--theme-text)",
              fontFamily: "var(--theme-font-body)",
            }}
          >
            {welcomeMessage}
          </span>

          {/* Title */}
          <h1
            style={{
              fontFamily: "var(--theme-font-heading, serif)",
              fontSize: "clamp(2.5rem, 7vw, 5rem)",
              fontWeight: 300,
              lineHeight: 1.1,
              margin: 0,
              color: backgroundImage ? "#fff" : "var(--theme-text)",
            }}
          >
            {title}
          </h1>

          {/* Decorative divider */}
          <div
            style={{
              width: "5rem",
              height: "1px",
              background: backgroundImage
                ? "rgba(255,255,255,0.5)"
                : "var(--theme-accent, #c9a96e)",
            }}
          />

          {/* Subtitle */}
          <p
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.35rem)",
              fontWeight: 300,
              maxWidth: "32rem",
              lineHeight: 1.6,
              margin: 0,
              opacity: 0.85,
              color: backgroundImage ? "#fff" : "var(--theme-text)",
            }}
          >
            {subtitle}
          </p>

          {/* CTA button */}
          <a
            href="#rsvp"
            style={{
              marginTop: "1rem",
              display: "inline-block",
              padding: "0.85rem 2.5rem",
              borderRadius: "9999px",
              border: backgroundImage
                ? "1px solid rgba(255,255,255,0.6)"
                : "1px solid var(--theme-accent, #c9a96e)",
              backgroundColor: "transparent",
              color: backgroundImage ? "#fff" : "var(--theme-text)",
              fontSize: "0.85rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
              cursor: "pointer",
              transition: "background-color 0.3s ease, color 0.3s ease",
              fontFamily: "var(--theme-font-body)",
            }}
          >
            {ctaText}
          </a>
        </div>
      </LayoutWrapper>
    </MotionWrapper>
  );
}