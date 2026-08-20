"use client";

import React, { useState, useEffect } from "react";
import demoData from "@/components/data/invites/demo.json";
import RoseMandapTemplate from "@/components/templates/rose-mandap/RoseMandapTemplate";

export default function DemoPage() {
  const [invitationData, setInvitationData] = useState<any>({
    ...demoData,
    footer: { ...demoData.footer, enabled: false },
    sectionOrder: (demoData.sectionOrder || []).filter((s) => s !== "footer"),
  });

  useEffect(() => {
    // Sync with live ajay-rani invitation config if available
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
            footer: { ...(data.footer || {}), enabled: false },
            sectionOrder: (data.sectionOrder || []).filter((s: string) => s !== "footer"),
          });
        }
      })
      .catch(() => {
        // Fall back seamlessly to static demoData
      });
  }, []);

  return <RoseMandapTemplate invitationData={invitationData} clientId="ajay-rani" />;
}
