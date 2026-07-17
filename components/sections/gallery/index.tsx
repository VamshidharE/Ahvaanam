"use client";

import React from "react";
import LayoutWrapper from "@/components/layouts/LayoutWrapper";
import MotionWrapper from "@/components/motion/MotionWrapper";

interface GallerySectionProps {
  bindings?: Record<string, any>;
  properties?: Record<string, any>;
  layoutId?: string;
  motionId?: string;
  themeId?: string;
  className?: string;
}

export default function GallerySection({
  bindings = {},
  properties = {},
  layoutId,
  motionId,
  className,
}: GallerySectionProps) {
  const title = bindings.title || "Gallery";
  const images: string[] = Array.isArray(bindings.images) ? bindings.images : [];

  /* Scoped unique ID to avoid style collisions */
  const scopeId = "gallery-grid-scope";

  return (
    <MotionWrapper motionId={motionId} defaultMotionId="luxury-motion" type="reveal">
      <LayoutWrapper
        layoutId={layoutId}
        defaultLayoutId="story-stack"
        className={`gallery-section ${className || ""}`}
        style={{
          fontFamily: "var(--theme-font-body)",
          color: "var(--theme-text)",
          padding: "5rem 1.5rem",
        }}
      >
        {/* Scoped styles for grid responsiveness and hover zoom */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .${scopeId} {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 0.75rem;
                width: 100%;
                max-width: 56rem;
                margin: 0 auto;
              }
              @media (min-width: 768px) {
                .${scopeId} {
                  grid-template-columns: repeat(3, 1fr);
                  gap: 1rem;
                }
              }
              .${scopeId} .gallery-item {
                position: relative;
                aspect-ratio: 1 / 1;
                overflow: hidden;
                border-radius: 0.5rem;
              }
              .${scopeId} .gallery-item img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94);
              }
              .${scopeId} .gallery-item:hover img {
                transform: scale(1.08);
              }
            `,
          }}
        />

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

        {images.length === 0 ? (
          <p style={{ textAlign: "center", opacity: 0.6 }}>
            No photos to display yet. Check back closer to the event!
          </p>
        ) : (
          <div className={scopeId}>
            {images.map((src, index) => (
              <div key={index} className="gallery-item">
                <img
                  src={src}
                  alt={`Gallery photo ${index + 1}`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </LayoutWrapper>
    </MotionWrapper>
  );
}