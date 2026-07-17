"use client";
import React from "react";
import LayoutWrapper from "@/components/layouts/LayoutWrapper";
import MotionWrapper from "@/components/motion/MotionWrapper";

interface DressCodeSectionProps {
  bindings?: Record<string, any>;
  properties?: Record<string, any>;
  layoutId?: string;
  motionId?: string;
  themeId?: string;
  className?: string;
}

export default function DressCodeSection({
  bindings = {},
  properties = {},
  layoutId,
  motionId,
  className,
}: DressCodeSectionProps) {
  const title = bindings.title || "Dress Code";
  const description = bindings.description || "";
  const colors: string[] = bindings.colors || [];
  const note = bindings.note || "";

  return (
    <MotionWrapper motionId={motionId} defaultMotionId="luxury-motion" type="reveal">
      <LayoutWrapper
        layoutId={layoutId}
        defaultLayoutId="story-stack"
        className={`py-20 px-6 ${className || ""}`}
        style={{ fontFamily: "var(--theme-font-body)", color: "var(--theme-text)" }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "var(--theme-font-heading)",
              fontSize: "2rem",
              marginBottom: "1.5rem",
              color: "var(--theme-accent)",
              letterSpacing: "0.04em",
            }}
          >
            {title}
          </h2>

          {description && (
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.7,
                opacity: 0.8,
                marginBottom: "2rem",
              }}
            >
              {description}
            </p>
          )}

          {colors.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                flexWrap: "wrap",
                marginBottom: "2rem",
              }}
            >
              {colors.map((color, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      background: color,
                      border: "2px solid var(--theme-border, rgba(255,255,255,0.15))",
                      boxShadow: `0 2px 12px ${color}33`,
                    }}
                    title={color}
                    aria-label={`Color swatch: ${color}`}
                  />
                  <span
                    style={{
                      fontSize: "0.7rem",
                      opacity: 0.5,
                      fontFamily: "monospace",
                      textTransform: "uppercase",
                    }}
                  >
                    {color}
                  </span>
                </div>
              ))}
            </div>
          )}

          {note && (
            <p
              style={{
                fontSize: "0.9rem",
                opacity: 0.6,
                fontStyle: "italic",
                lineHeight: 1.6,
                marginTop: colors.length > 0 ? 0 : "1rem",
              }}
            >
              {note}
            </p>
          )}
        </div>
      </LayoutWrapper>
    </MotionWrapper>
  );
}