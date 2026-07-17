"use client";

import React from "react";
import { CompositionSchema } from "@/lib/composition/types";
import ThemeProvider from "@/components/theme/ThemeProvider";

// Dynamic section component imports
import HeroSection from "@/components/sections/hero";
import CoupleSection from "@/components/sections/couple";
import CountdownSection from "@/components/sections/countdown";
import StorySection from "@/components/sections/story";
import EventsSection from "@/components/sections/events";
import GallerySection from "@/components/sections/gallery";
import VenueSection from "@/components/sections/venue";
import FamiliesSection from "@/components/sections/families";
import RSVPSection from "@/components/sections/rsvp";
import FAQSection from "@/components/sections/faq";
import DressCodeSection from "@/components/sections/dressCode";
import FooterSection from "@/components/sections/footer";

const SECTION_COMPONENTS: Record<string, React.ComponentType<any>> = {
  hero: HeroSection,
  couple: CoupleSection,
  countdown: CountdownSection,
  story: StorySection,
  events: EventsSection,
  gallery: GallerySection,
  venue: VenueSection,
  families: FamiliesSection,
  rsvp: RSVPSection,
  faq: FAQSection,
  dressCode: DressCodeSection,
  footer: FooterSection,
};

function resolveBindingValue(path: string, data: any): any {
  if (!path) return undefined;
  const parts = path.split(".");
  let current = data;
  for (const part of parts) {
    if (current == null) return undefined;
    current = current[part];
  }
  return current;
}

interface CompositionRendererProps {
  composition: CompositionSchema;
  invitationData: any;
}

export default function CompositionRenderer({ composition, invitationData }: CompositionRendererProps) {
  const isWrapped = invitationData && "category" in invitationData && "config" in invitationData;
  const config = isWrapped ? (invitationData as any).config : invitationData;

  return (
    <div className="space-y-0">
      <ThemeProvider themeId={config.themeId || "royal-temple"} />
      {composition.sections.map((section) => {
        if (section.properties?.enabled === false) return null;
        const Comp = SECTION_COMPONENTS[section.type];
        if (!Comp) return null;

        // Resolve bindings
        const resolvedProps: Record<string, any> = {};
        if (section.bindings) {
          for (const [key, path] of Object.entries(section.bindings)) {
            resolvedProps[key] = resolveBindingValue(path, config);
          }
        }

        return (
          <Comp
            key={section.id}
            {...resolvedProps}
            properties={section.properties}
          />
        );
      })}
    </div>
  );
}