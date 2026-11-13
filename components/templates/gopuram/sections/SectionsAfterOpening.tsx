"use client";

import React from "react";
import { GrandCoupleShowcase } from "./GrandCoupleShowcase";
import { WeddingCelebrationsSection } from "./WeddingCelebrations";
import { PreWeddingVideo } from "./PreWeddingVideo";
import { OurJourneyGallery } from "./OurJourneyGallery";
import { FamilyDetails } from "./FamilyDetails";
import { RsvpSection } from "./RsvpSection";
import { AhvaanamFooter } from "./AhvaanamFooter";
import { useGopuram } from "../context";

export const SectionsAfterOpening: React.FC = () => {
  const { data } = useGopuram();
  const { sectionOrder, sections, assets } = data;

  const renderSection = (id: string) => {
    switch (id) {
      case "couple":
        if (!sections.showCouple) return null;
        return <GrandCoupleShowcase key="couple" />;
      case "events":
        if (!sections.showEvents) return null;
        return <WeddingCelebrationsSection key="events" />;
      case "story":
      case "video":
        if (!sections.showStory && !sections.showVideo) return null;
        return <PreWeddingVideo key="story" />;
      case "gallery":
        if (!sections.showGallery) return null;
        return <OurJourneyGallery key="gallery" />;
      case "families":
        if (!sections.showFamilies) return null;
        return <FamilyDetails key="families" />;
      case "countdown":
      case "rsvp":
        if (!sections.showCountdown && !sections.showRsvp) return null;
        return <RsvpSection key="rsvp" />;
      case "footer":
        if (!sections.showFooter) return null;
        return <AhvaanamFooter key="footer" />;
      default:
        return null;
    }
  };

  // Avoid duplicate RSVP/Countdown rendering if both are in sectionOrder
  const renderedSet = new Set<string>();

  return (
    <div className="relative w-full z-20">
      <div className="relative w-full overflow-hidden bg-[#faedd4]">
        {/* Continuous Seamless Repeating Temple Pillar & Parchment Background */}
        <div
          className="absolute inset-0 pointer-events-none select-none z-0"
          style={{
            backgroundImage: `url('${assets.invitationBackground}')`,
            backgroundRepeat: "repeat-y",
            backgroundPosition: "top center",
            backgroundSize: "100% auto",
          }}
        />

        {/* Live Content of Sections dynamically mapped and ordered */}
        <div className="relative z-10">
          {sectionOrder.map((sectionId) => {
            if (sectionId === "hero") return null; // Hero rendered by GopuramScene
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
