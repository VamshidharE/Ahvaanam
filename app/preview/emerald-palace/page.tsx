"use client";

import React, { useState, useEffect } from "react";
import demoData from "@/components/data/invites/demo.json";
import EmeraldPalaceTemplate from "@/components/templates/emerald-palace/EmeraldPalaceTemplate";

export default function EmeraldPalacePreviewPage() {
  const [invitationData, setInvitationData] = useState<any>({
    ...demoData,
    themeId: "emerald-palace",
  });

  useEffect(() => {
    // Sync with live invitation config if available
    fetch(`/api/invitation/ajay-rani?t=${Date.now()}`, {
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
        // Fall back gracefully to static demoData
      });
  }, []);

  return <EmeraldPalaceTemplate invitationData={invitationData} clientId="ajay-rani" />;
}
