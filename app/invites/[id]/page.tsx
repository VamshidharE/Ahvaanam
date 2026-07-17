"use client";

import React, { use } from "react";
import { InvitationDataProvider, useInvitationData } from "../../../components/context/InvitationDataContext";
import RsvpSubmissionForm from "../../../components/rsvp/RsvpSubmissionForm";

// Import all 10 visual template layouts
import RoyalTempleLayout from "../../../components/templates/royal-temple/Layout";
import FloralGardenLayout from "../../../components/templates/floral-garden/Layout";
import SouthIndianTraditionalLayout from "../../../components/templates/south-indian/Layout";
import PalaceLuxuryLayout from "../../../components/templates/palace-luxury/Layout";
import LotusSerenityLayout from "../../../components/templates/lotus-serenity/Layout";
import MarigoldLayout from "../../../components/templates/marigold/Layout";
import PeacockLayout from "../../../components/templates/peacock/Layout";
import HeritageLayout from "../../../components/templates/heritage/Layout";
import MoonlightLayout from "../../../components/templates/moonlight/Layout";
import GrandMandapLayout from "../../../components/templates/grand-mandap/Layout";
import ModernBirthdayLayout from "../../../components/templates/modern-birthday/Layout";
import PremiumBirthdayTemplateLayout from "../../../components/templates/birthday-premium/Layout";
import WeddingPremiumLayout from "../../../components/templates/wedding-premium/Layout";

function InviteContent({ clientId }: { clientId: string }) {
  const { invitationData, loading } = useInvitationData();

  React.useEffect(() => {
    if (loading || !invitationData) return;

    // Asynchronous view recording
    const recordView = async () => {
      try {
        let visitorToken = localStorage.getItem("ahvaanam_visitor_token");
        if (!visitorToken) {
          if (typeof crypto !== "undefined" && crypto.randomUUID) {
            visitorToken = crypto.randomUUID();
          } else {
            visitorToken = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
              const r = (Math.random() * 16) | 0,
                v = c === "x" ? r : (r & 0x3) | 0x8;
              return v.toString(16);
            });
          }
          localStorage.setItem("ahvaanam_visitor_token", visitorToken);
        }

        await fetch(`/api/invitation/${clientId}/view`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitor_token: visitorToken }),
        });
      } catch (err) {
        console.error("Failed to record analytics view:", err);
      }
    };

    recordView();
  }, [clientId, loading, invitationData]);

  if (loading || !invitationData) {
    return (
      <div className="min-h-screen bg-[#05020B] flex items-center justify-center text-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4 animate-duration-[1s]" />
          <h2 className="text-[#C59B27] text-[10px] uppercase tracking-[3px] font-semibold animate-pulse">Loading Invitation</h2>
        </div>
      </div>
    );
  }

  const activeTheme = invitationData.themeId || "royal-temple";
  const dummyBack = () => {};

  return (
    <div className="client-invitation-view">
      {/* Dynamic CSS Injection to hide the Back button from guests */}
      <style dangerouslySetInnerHTML={{__html: `
        button[title="Back to Selector Hub"] {
          display: none !important;
        }
      `}} />

      {(() => {
        switch (activeTheme) {
          case "royal-temple":
            return <RoyalTempleLayout onBackToHub={dummyBack} />;
          case "floral-garden":
            return <FloralGardenLayout onBackToHub={dummyBack} />;
          case "south-indian":
            return <SouthIndianTraditionalLayout onBackToHub={dummyBack} />;
          case "palace-luxury":
            return <PalaceLuxuryLayout onBackToHub={dummyBack} />;
          case "lotus-serenity":
            return <LotusSerenityLayout onBackToHub={dummyBack} />;
          case "marigold":
            return <MarigoldLayout onBackToHub={dummyBack} />;
          case "peacock":
            return <PeacockLayout onBackToHub={dummyBack} />;
          case "heritage":
            return <HeritageLayout onBackToHub={dummyBack} />;
          case "moonlight":
            return <MoonlightLayout onBackToHub={dummyBack} />;
          case "grand-mandap":
            return <GrandMandapLayout onBackToHub={dummyBack} />;
          case "modern-birthday":
            return <ModernBirthdayLayout onBackToHub={dummyBack} />;
          case "wedding-premium":
            return <WeddingPremiumLayout onBackToHub={dummyBack} />;
          case "midnight":
          case "marble":
          case "emerald":
          case "navy":
          case "burgundy":
          case "champagne":
          case "glass":
          case "rosegold":
          case "artdeco":
          case "botanical":
            return <PremiumBirthdayTemplateLayout onBackToHub={dummyBack} />;
          default:
            return <RoyalTempleLayout onBackToHub={dummyBack} />;
        }
      })()}

      {/* RSVP Submission Form Component */}
      {invitationData.rsvp?.enabled && (
        <div className="bg-[#FAF9F6] border-t border-zinc-200/50">
          <RsvpSubmissionForm clientId={clientId} />
        </div>
      )}
    </div>
  );
}

export default function GuestInvitePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <InvitationDataProvider clientId={id}>
      <InviteContent clientId={id} />
    </InvitationDataProvider>
  );
}
