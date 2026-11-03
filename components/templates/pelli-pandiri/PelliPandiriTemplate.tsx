"use client";

import React from "react";
import "./styles/pelli-pandiri.css";
import { mapInvitationConfigToPelliPandiri, PelliPandiriData } from "./adapter";
import { PelliPandiriProvider } from "./context";
import { TempleEntranceScene } from "./entrance/TempleEntranceScene";
import { SectionsAfterOpening } from "./sections/SectionsAfterOpening";
import { ButterflyCompanion } from "./butterfly/ButterflyCompanion";
import { AmbientAudio } from "./AmbientAudio";

export interface PelliPandiriTemplateProps {
  invitationData: any;
  clientId?: string;
}

export default function PelliPandiriTemplate({
  invitationData,
  clientId = "",
}: PelliPandiriTemplateProps) {
  const data: PelliPandiriData = mapInvitationConfigToPelliPandiri(invitationData, clientId);

  const isEmbedded = typeof window !== "undefined" && (
    window.self !== window.top ||
    window.location.search.includes("embed=1") ||
    window.location.search.includes("preview=1")
  );

  return (
    <PelliPandiriProvider value={{ data, clientId, isEmbedded }}>
      {/* High-priority preload for hero sky background to ensure instant load on fresh open */}
      <link
        rel="preload"
        href={data.assets.skyBackground}
        as="image"
        type="image/webp"
        // @ts-ignore
        fetchpriority="high"
      />
      <div className="pelli-pandiri-root min-h-screen bg-[#d38d38] text-white selection:bg-[#c49a45] selection:text-black relative font-montserrat">
        {/* Interactive 3D Butterfly */}
        <ButterflyCompanion />

        {/* Floating Background Audio Player */}
        <AmbientAudio />

        {/* Temple Entrance Hero Scene */}
        <TempleEntranceScene data={data} />

        {/* Content Sections (Ordered & Filtered by Section Visibility) */}
        <SectionsAfterOpening data={data} clientId={clientId} />
      </div>
    </PelliPandiriProvider>
  );
}
