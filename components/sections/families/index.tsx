"use client";
import React from "react";
import LayoutWrapper from "@/components/layouts/LayoutWrapper";
import MotionWrapper from "@/components/motion/MotionWrapper";

interface FamilyMember {
  name?: string;
  relation?: string;
}

interface FamilyInfo {
  title?: string;
  members?: FamilyMember[];
}

interface FamiliesSectionProps {
  bindings?: Record<string, any>;
  properties?: Record<string, any>;
  layoutId?: string;
  motionId?: string;
  themeId?: string;
  className?: string;
}

export default function FamiliesSection({
  bindings = {},
  properties = {},
  layoutId,
  motionId,
  className,
}: FamiliesSectionProps) {
  const title = bindings.title || "Our Families";
  const brideFamily: FamilyInfo = bindings.brideFamily || {};
  const groomFamily: FamilyInfo = bindings.groomFamily || {};

  const renderFamily = (family: FamilyInfo, fallbackTitle: string) => (
    <div style={{ flex: 1, minWidth: 260, textAlign: "center" }}>
      <h3
        style={{
          fontFamily: "var(--theme-font-heading)",
          fontSize: "1.3rem",
          marginBottom: "1.5rem",
          color: "var(--theme-accent)",
          letterSpacing: "0.03em",
        }}
      >
        {family.title || fallbackTitle}
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {(family.members || []).map((member, idx) => (
          <div key={idx}>
            <p
              style={{
                fontFamily: "var(--theme-font-heading)",
                fontSize: "1.1rem",
                marginBottom: "0.2rem",
                color: "var(--theme-text)",
              }}
            >
              {member.name}
            </p>
            {member.relation && (
              <p
                style={{
                  fontSize: "0.85rem",
                  opacity: 0.6,
                  fontStyle: "italic",
                }}
              >
                {member.relation}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

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
              display: "flex",
              flexWrap: "wrap",
              gap: "3rem",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            {renderFamily(brideFamily, "Bride's Family")}

            <div
              style={{
                width: 1,
                alignSelf: "stretch",
                background: "var(--theme-border, rgba(255,255,255,0.15))",
                minHeight: 80,
              }}
              aria-hidden="true"
            />

            {renderFamily(groomFamily, "Groom's Family")}
          </div>
        </div>
      </LayoutWrapper>
    </MotionWrapper>
  );
}