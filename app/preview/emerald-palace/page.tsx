"use client";

import React, { useState, useEffect } from "react";
import emeraldPalaceData from "@/components/data/invites/emerald-palace.json";
import EmeraldPalaceTemplate from "@/components/templates/emerald-palace/EmeraldPalaceTemplate";

export default function EmeraldPalacePreviewPage() {
  const [invitationData, setInvitationData] = useState<any>(emeraldPalaceData);

  useEffect(() => {
    // Optionally sync with live invitation config if an ID is passed in search params
    const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const customId = searchParams?.get("id");
    
    if (customId) {
      fetch(`/api/invitation/${customId}?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setInvitationData({
              ...data,
              themeId: "emerald-palace",
            });
          }
        })
        .catch(() => {
          // Fall back gracefully to emeraldPalaceData
        });
    }
  }, []);

  return <EmeraldPalaceTemplate invitationData={invitationData} clientId="arjun-divya" />;
}
