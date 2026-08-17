"use client";

import React from "react";
import PremiumHinduWeddingHero from "@/components/hero/PremiumHinduWeddingHero";

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
  className,
}: HeroSectionProps) {
  const groomName = bindings.groomName || properties.groomName || "Aarav";
  const brideName = bindings.brideName || properties.brideName || "Ananya";
  const weddingDate = bindings.date || bindings.weddingDate || properties.date || "Sunday, December 20, 2026";
  const muhurthamTime = bindings.time || bindings.muhurthamTime || properties.time || "10:15 AM";
  const venueName = bindings.venue || bindings.venueName || properties.venue || "The Leela Palace";
  const venueCity = bindings.location || bindings.venueCity || properties.location || "Banjara Hills, Hyderabad";
  const welcomeMessage = bindings.welcomeMessage || properties.welcomeMessage || "Together with our families, we invite you to celebrate our union";
  const ctaText = bindings.ctaText || properties.ctaText || "Kindly Respond (RSVP)";

  return (
    <div className={`hero-section w-full ${className || ""}`}>
      <PremiumHinduWeddingHero
        groomName={groomName}
        brideName={brideName}
        weddingDate={weddingDate}
        muhurthamTime={muhurthamTime}
        venueName={venueName}
        venueCity={venueCity}
        welcomeMessage={welcomeMessage}
        ctaText={ctaText}
      />
    </div>
  );
}