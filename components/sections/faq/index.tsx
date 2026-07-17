"use client";
import React, { useState } from "react";
import LayoutWrapper from "@/components/layouts/LayoutWrapper";
import MotionWrapper from "@/components/motion/MotionWrapper";

interface FAQEntry {
  question?: string;
  answer?: string;
}

interface FAQSectionProps {
  bindings?: Record<string, any>;
  properties?: Record<string, any>;
  layoutId?: string;
  motionId?: string;
  themeId?: string;
  className?: string;
}

export default function FAQSection({
  bindings = {},
  properties = {},
  layoutId,
  motionId,
  className,
}: FAQSectionProps) {
  const title = bindings.title || "FAQ";
  const entries: FAQEntry[] = bindings.entries || [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <MotionWrapper motionId={motionId} defaultMotionId="luxury-motion" type="reveal">
      <LayoutWrapper
        layoutId={layoutId}
        defaultLayoutId="story-stack"
        className={`py-20 px-6 ${className || ""}`}
        style={{ fontFamily: "var(--theme-font-body)", color: "var(--theme-text)" }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
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
              flexDirection: "column",
              gap: "0.75rem",
              textAlign: "left",
            }}
          >
            {entries.map((entry, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  style={{
                    background: "var(--theme-surface, rgba(255,255,255,0.05))",
                    borderRadius: 12,
                    border: "1px solid var(--theme-border, rgba(255,255,255,0.1))",
                    overflow: "hidden",
                    transition: "border-color 0.2s",
                    ...(isOpen
                      ? { borderColor: "var(--theme-accent)" }
                      : {}),
                  }}
                >
                  <button
                    onClick={() => toggle(index)}
                    style={{
                      width: "100%",
                      padding: "1.1rem 1.25rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "1rem",
                      color: "var(--theme-text)",
                      fontFamily: "var(--theme-font-body)",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      textAlign: "left",
                      lineHeight: 1.4,
                    }}
                    aria-expanded={isOpen}
                  >
                    <span>{entry.question}</span>
                    <span
                      style={{
                        fontSize: "1.1rem",
                        opacity: 0.5,
                        transition: "transform 0.25s ease",
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                        flexShrink: 0,
                      }}
                    >
                      +
                    </span>
                  </button>

                  <div
                    style={{
                      maxHeight: isOpen ? 500 : 0,
                      overflow: "hidden",
                      transition: "max-height 0.3s ease",
                    }}
                  >
                    <p
                      style={{
                        padding: "0 1.25rem 1.1rem",
                        fontSize: "0.9rem",
                        lineHeight: 1.7,
                        opacity: 0.75,
                        margin: 0,
                      }}
                    >
                      {entry.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {entries.length === 0 && (
            <p style={{ opacity: 0.5, fontStyle: "italic" }}>
              No questions yet.
            </p>
          )}
        </div>
      </LayoutWrapper>
    </MotionWrapper>
  );
}