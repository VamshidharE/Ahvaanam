"use client";

import React, { useState, useEffect } from "react";
import lotusMandapamData from "@/components/data/invites/lotus-mandapam.json";
import LotusMandapamTemplate from "@/components/templates/lotus-mandapam/LotusMandapamTemplate";

export default function SacredCourtyardPreviewPage() {
  const [invitationData, setInvitationData] = useState<any>(lotusMandapamData);

  useEffect(() => {
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
              themeId: "sacred-courtyard",
            });
          }
        })
        .catch(() => {});
    }
  }, []);

  return <LotusMandapamTemplate invitationData={invitationData} clientId="arjun-divya" />;
}
