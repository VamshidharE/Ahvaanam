"use client";
import React from "react";
import LayoutWrapper from "@/components/layouts/LayoutWrapper";
import MotionWrapper from "@/components/motion/MotionWrapper";

interface Contact {
  type?: "whatsapp" | "phone" | string;
  value?: string;
  label?: string;
}

interface RSVPSectionProps {
  bindings?: Record<string, any>;
  properties?: Record<string, any>;
  layoutId?: string;
  motionId?: string;
  themeId?: string;
  className?: string;
}

export default function RSVPSection({
  bindings = {},
  properties = {},
  layoutId,
  motionId,
  className,
}: RSVPSectionProps) {
  const title = bindings.title || "RSVP";
  const subtitle = bindings.subtitle || "";
  const contacts: Contact[] = bindings.contacts || [];

  const getHref = (contact: Contact): string => {
    if (contact.type === "whatsapp") return `https://wa.me/${contact.value}`;
    if (contact.type === "phone") return `tel:${contact.value}`;
    return "#";
  };

  const getIcon = (type?: string): string => {
    if (type === "whatsapp") return "💬";
    if (type === "phone") return "📞";
    return "✉️";
  };

  return (
    <MotionWrapper motionId={motionId} defaultMotionId="luxury-motion" type="reveal">
      <LayoutWrapper
        layoutId={layoutId}
        defaultLayoutId="story-stack"
        className={`py-20 px-6 ${className || ""}`}
        style={{ fontFamily: "var(--theme-font-body)", color: "var(--theme-text)" }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "var(--theme-font-heading)",
              fontSize: "2rem",
              marginBottom: "0.75rem",
              color: "var(--theme-accent)",
              letterSpacing: "0.04em",
            }}
          >
            {title}
          </h2>

          {subtitle && (
            <p
              style={{
                fontSize: "1rem",
                opacity: 0.7,
                lineHeight: 1.6,
                marginBottom: "2rem",
              }}
            >
              {subtitle}
            </p>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "center",
              marginTop: subtitle ? 0 : "1.5rem",
            }}
          >
            {contacts.map((contact, index) => {
              const isWhatsApp = contact.type === "whatsapp";

              return (
                <a
                  key={index}
                  href={getHref(contact)}
                  target={isWhatsApp ? "_blank" : undefined}
                  rel={isWhatsApp ? "noopener noreferrer" : undefined}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "0.75rem 2rem",
                    borderRadius: 999,
                    background: isWhatsApp
                      ? "#25D366"
                      : "var(--theme-accent)",
                    color: isWhatsApp ? "#fff" : "var(--theme-bg, #fff)",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    letterSpacing: "0.02em",
                    transition: "opacity 0.2s, transform 0.2s",
                    minWidth: 220,
                    justifyContent: "center",
                  }}
                >
                  <span>{getIcon(contact.type)}</span>
                  <span>{contact.label || contact.value}</span>
                </a>
              );
            })}
          </div>

          {contacts.length === 0 && (
            <p style={{ opacity: 0.5, fontStyle: "italic", marginTop: "1rem" }}>
              Contact details coming soon.
            </p>
          )}
        </div>
      </LayoutWrapper>
    </MotionWrapper>
  );
}