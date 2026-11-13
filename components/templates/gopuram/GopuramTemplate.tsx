"use client";

import React from "react";
import "./styles/gopuram.css";
import { mapInvitationConfigToGopuram, GopuramData } from "./adapter";
import { GopuramProvider } from "./context";
import { GopuramScene } from "./GopuramScene";
import { SectionsAfterOpening } from "./sections/SectionsAfterOpening";
import { ButterflyCompanion } from "./butterfly/ButterflyCompanion";
import { AmbientAudio } from "./AmbientAudio";

export interface GopuramTemplateProps {
  invitationData: any;
  clientId?: string;
}

export default function GopuramTemplate({
  invitationData,
  clientId = "",
}: GopuramTemplateProps) {
  const data: GopuramData = mapInvitationConfigToGopuram(invitationData, clientId);

  const isEmbedded = typeof window !== "undefined" && (
    window.self !== window.top ||
    window.location.search.includes("embed=1") ||
    window.location.search.includes("preview=1")
  );

  return (
    <GopuramProvider value={{ data, clientId, isEmbedded }}>
      {/* High-priority preload for hero sky background */}
      <link
        rel="preload"
        href={data.assets.skyBackground}
        as="image"
        type="image/png"
        // @ts-ignore
        fetchpriority="high"
      />
      <div className="gopuram-root min-h-screen bg-[#0a0807] text-white selection:bg-[#c49a45] selection:text-black relative font-montserrat">
        {/* Interactive 3D Butterfly */}
        <ButterflyCompanion />

        {/* Ambient Audio Player */}
        <AmbientAudio />

        {/* Gopuram Entrance Hero Scene */}
        <GopuramScene />

        {/* Content Sections (Ordered & Filtered by Section Visibility) */}
        <SectionsAfterOpening />
      </div>
    </GopuramProvider>
  );
}
