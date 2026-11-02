"use client";

import React from "react";
import { GrandCoupleShowcase } from "./GrandCoupleShowcase";
import { WeddingCelebrationsSection } from "./WeddingCelebrations";
import { PreWeddingVideo } from "./PreWeddingVideo";
import { OurJourneyGallery } from "./OurJourneyGallery";
import { FamilyDetails } from "./FamilyDetails";
import { RsvpSection } from "./RsvpSection";
import { AhvaanamFooter } from "./AhvaanamFooter";
import { PelliPandiriData } from "../adapter";

interface SectionsAfterOpeningProps {
  data: PelliPandiriData;
  clientId?: string;
}

export const SectionsAfterOpening: React.FC<SectionsAfterOpeningProps> = ({ data, clientId }) => {
  const { sectionOrder, sections } = data;

  const renderSection = (id: string) => {
    switch (id) {
      case "couple":
        if (!sections.showCouple) return null;
        return <GrandCoupleShowcase key="couple" data={data} />;
      case "events":
        if (!sections.showEvents) return null;
        return <WeddingCelebrationsSection key="events" data={data} />;
      case "story":
        if (!sections.showStory && !sections.showVideo) return null;
        return <PreWeddingVideo key="story" data={data} />;
      case "gallery":
        if (!sections.showGallery) return null;
        return <OurJourneyGallery key="gallery" data={data} />;
      case "families":
        if (!sections.showFamilies) return null;
        return <FamilyDetails key="families" data={data} />;
      case "countdown":
      case "rsvp":
        if (!sections.showCountdown && !sections.showRsvp) return null;
        return <RsvpSection key="rsvp" data={data} clientId={clientId} />;
      case "footer":
        if (!sections.showFooter) return null;
        return <AhvaanamFooter key="footer" data={data} clientId={clientId} />;
      default:
        return null;
    }
  };

  // Avoid rendering duplicate RSVP / countdown if both are listed in sectionOrder
  const renderedSet = new Set<string>();

  return (
    <div className="relative w-full z-20">
      <div className="relative w-full overflow-hidden bg-[#faedd4]">
        {/* Continuous Wedding Celebration Background Image */}
        <div
          className="absolute inset-0 pointer-events-none select-none z-0"
          style={{
            backgroundImage: `url('${data.assets.invitationBackground}')`,
            backgroundRepeat: "repeat-y",
            backgroundPosition: "top center",
            backgroundSize: "100% auto",
          }}
        />

        {/* Live Content of Sections dynamically mapped and ordered */}
        <div className="relative z-10">
          {sectionOrder.map((sectionId) => {
            if (sectionId === "hero") return null; // Hero rendered by TempleEntranceScene
            if (sectionId === "countdown" || sectionId === "rsvp") {
              if (renderedSet.has("rsvp-countdown-combined")) return null;
              renderedSet.add("rsvp-countdown-combined");
            }
            if (renderedSet.has(sectionId)) return null;
            renderedSet.add(sectionId);
            return renderSection(sectionId);
          })}
        </div>
      </div>
    </div>
  );
};
