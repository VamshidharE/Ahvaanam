"use client";

import React, { useState, useEffect } from "react";
import LayoutWrapper from "@/components/layouts/LayoutWrapper";
import MotionWrapper from "@/components/motion/MotionWrapper";

interface CountdownSectionProps {
  bindings?: Record<string, any>;
  properties?: Record<string, any>;
  layoutId?: string;
  motionId?: string;
  themeId?: string;
  className?: string;
}

function computeTimeLeft(targetDate: string) {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownSection({
  bindings = {},
  properties = {},
  layoutId,
  motionId,
  className,
}: CountdownSectionProps) {
  const title = bindings.title || "Counting Down";
  const targetDate = bindings.targetDate || "";
  const postWeddingMessage =
    bindings.postWeddingMessage || "We are now married! Thank you for your love and blessings.";

  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof computeTimeLeft>>(
    targetDate ? computeTimeLeft(targetDate) : null
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!targetDate) return;

    setTimeLeft(computeTimeLeft(targetDate));

    const interval = setInterval(() => {
      setTimeLeft(computeTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: "Days", value: timeLeft?.days ?? 0 },
    { label: "Hours", value: timeLeft?.hours ?? 0 },
    { label: "Minutes", value: timeLeft?.minutes ?? 0 },
    { label: "Seconds", value: timeLeft?.seconds ?? 0 },
  ];

  const boxStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "1.5rem 1rem",
    borderRadius: "0.75rem",
    border: "1px solid var(--theme-border, rgba(255,255,255,0.12))",
    backgroundColor: "var(--theme-surface, rgba(255,255,255,0.04))",
    minWidth: "5rem",
    flex: "1 1 5rem",
  };

  return (
    <MotionWrapper motionId={motionId} defaultMotionId="luxury-motion" type="reveal">
      <LayoutWrapper
        layoutId={layoutId}
        defaultLayoutId="story-stack"
        className={`countdown-section ${className || ""}`}
        style={{
          fontFamily: "var(--theme-font-body)",
          color: "var(--theme-text)",
          padding: "5rem 1.5rem",
          textAlign: "center",
        }}
      >
        {/* Section title */}
        <h2
          style={{
            fontFamily: "var(--theme-font-heading, serif)",
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            fontWeight: 300,
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

        {/* Countdown or post-wedding message */}
        {!mounted ? (
          <div style={{ opacity: 0.5, fontSize: "1rem" }}>Loading...</div>
        ) : timeLeft ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "center",
              maxWidth: "32rem",
              margin: "0 auto",
            }}
          >
            {units.map((unit) => (
              <div key={unit.label} style={boxStyle}>
                <span
                  style={{
                    fontFamily: "var(--theme-font-heading, serif)",
                    fontSize: "clamp(2rem, 5vw, 3rem)",
                    fontWeight: 300,
                    lineHeight: 1,
                    color: "var(--theme-accent, #c9a96e)",
                  }}
                >
                  {String(unit.value).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    marginTop: "0.5rem",
                    opacity: 0.6,
                  }}
                >
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p
            style={{
              fontSize: "1.15rem",
              fontStyle: "italic",
              opacity: 0.85,
              maxWidth: "32rem",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            {postWeddingMessage}
          </p>
        )}
      </LayoutWrapper>
    </MotionWrapper>
  );
}