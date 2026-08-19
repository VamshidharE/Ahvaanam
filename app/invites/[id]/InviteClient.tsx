"use client";

import React from "react";
import { InvitationDataProvider, useInvitationData } from "../../../components/context/InvitationDataContext";
import RsvpSubmissionForm from "../../../components/rsvp/RsvpSubmissionForm";
import RoseMandapTemplate from "../../../components/templates/rose-mandap/RoseMandapTemplate";

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
  const activeTheme = invitationData.themeId || config?.themeId || "royal-temple";

  if (activeTheme === "rose-mandap") {
    return <RoseMandapTemplate invitationData={invitationData} clientId={clientId} />;
  }

  return (
    <div className="client-invitation-view min-h-screen bg-[#FAF9F6] text-[#241E1C] font-sans py-16 px-6">
      <div className="max-w-3xl mx-auto rounded-3xl border border-[#D4AF37]/30 bg-white p-12 shadow-2xl text-center space-y-6">
        <span className="text-2xl text-[#C49B27] font-bold block">ॐ</span>
        <span className="text-[10px] font-bold uppercase tracking-[3px] text-[#C49B27]">
          {activeTheme.toUpperCase()} TEMPLATE
        </span>
        <h1 className="text-4xl md:text-5xl font-normal uppercase font-cinzel text-[#241E1C]">
          {invitationData.hero?.title || "Rahul & Priya"}
        </h1>
        <p className="text-xs uppercase tracking-[2px] font-bold text-zinc-500">
          {invitationData.hero?.subtitle || "Wedding Celebration"}
        </p>

        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto my-6" />

        <div className="text-xs font-semibold text-zinc-600 leading-relaxed max-w-lg mx-auto">
          We invite you to celebrate with us. Further template details and custom layout sections will render here.
        </div>
      </div>

      {/* RSVP Submission Form Component */}
      {invitationData.rsvp?.enabled && (
        <div className="max-w-3xl mx-auto mt-8">
          <RsvpSubmissionForm clientId={clientId} />
        </div>
      )}
    </div>
  );
}

export default function InviteClient({ clientId }: { clientId: string }) {
  return (
    <InvitationDataProvider clientId={clientId}>
      <InviteContent clientId={clientId} />
    </InvitationDataProvider>
  );
}
