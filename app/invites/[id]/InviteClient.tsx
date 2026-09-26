"use client";

import React from "react";
import { InvitationDataProvider, useInvitationData } from "../../../components/context/InvitationDataContext";
import { useInvitationTracker } from "@/lib/analytics/useInvitationTracker";
import { getTemplate, normalizeInvitationData } from "@/lib/template-engine";

function TemplateNotFoundFallback({ themeId }: { themeId: string }) {
  if (process.env.NODE_ENV === "development") {
    console.error(`[TemplateEngine] No template registered for themeId: "${themeId}". Safe fallback rendered.`);
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6 text-center select-none font-serif">
      <div className="max-w-md w-full bg-white border border-[#C49B27]/30 rounded-3xl p-8 shadow-xl relative overflow-hidden">
        {/* Subtle decorative top bar */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#C49B27] to-transparent" />
        
        <div className="text-3xl mb-4 text-[#C49B27]">✦</div>
        <h2 className="text-xl font-bold uppercase tracking-wider text-[#241E1C] mb-2 font-cinzel">
          Template in Development
        </h2>
        <p className="text-xs text-[#241E1C]/60 leading-relaxed mb-6 font-sans">
          The requested template <span className="font-semibold text-[#C49B27]">"{themeId || "unknown"}"</span> is currently being prepared for the new template engine architecture.
        </p>
        <div className="text-[10px] uppercase tracking-[2px] text-[#C49B27] font-bold">
          Ahvaanam Digital Invitations
        </div>
      </div>
    </div>
  );
}

function InviteContent({ clientId }: { clientId: string }) {
  const { invitationData, loading } = useInvitationData();
  const hasRecordedRef = React.useRef(false);

  // Initialize advanced engagement analytics tracker
  useInvitationTracker(clientId);

  React.useEffect(() => {
    if (loading || !invitationData || hasRecordedRef.current) return;

    // Asynchronous view recording (triggered once per browser session)
    const recordView = async () => {
      try {
        const sessionKey = `ahvaanam_viewed_${clientId}`;
        if (typeof window !== "undefined" && sessionStorage.getItem(sessionKey)) {
          hasRecordedRef.current = true;
          return;
        }

        hasRecordedRef.current = true;
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

        if (typeof window !== "undefined") {
          sessionStorage.setItem(sessionKey, "1");
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
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center text-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-2 border-[#C49B27] border-t-transparent rounded-full animate-spin mb-4" />
          <h2 className="text-[#C49B27] text-xs uppercase tracking-[3px] font-bold animate-pulse">Loading Invitation</h2>
        </div>
      </div>
    );
  }

  const isWrapped = invitationData && "category" in invitationData && "config" in invitationData;
  const config = isWrapped ? (invitationData as any).config : invitationData;
  const activeTheme = invitationData.themeId || config?.themeId || "";

  // 1. Resolve template from the new Template Engine Registry
  const templateDefinition = getTemplate(activeTheme);

  // 2. Safe Fallback if template is not yet registered or invalid (Never silently fall back to Rose Mandap)
  if (!templateDefinition) {
    return <TemplateNotFoundFallback themeId={activeTheme} />;
  }

  // 3. Normalize raw invitation data into typed InvitationData contract
  const normalizedData = normalizeInvitationData(invitationData, clientId);

  // 4. Render the autonomous template component
  const TemplateComponent = templateDefinition.Component;
  return (
    <TemplateComponent
      data={normalizedData}
      clientId={clientId}
      invitationData={invitationData}
    />
  );
}

export default function InviteClient({ clientId }: { clientId: string }) {
  return (
    <InvitationDataProvider clientId={clientId}>
      <InviteContent clientId={clientId} />
    </InvitationDataProvider>
  );
}
