"use client";

import React from "react";
import { getTemplate, normalizeInvitationData } from "@/lib/template-engine";
import DemoOverlayBadge from "./DemoOverlayBadge";

interface DemoClientWrapperProps {
  slug: string;
  templateId: string;
  templateName: string;
  sampleData: any;
}

export default function DemoClientWrapper({
  slug,
  templateId,
  templateName,
  sampleData,
}: DemoClientWrapperProps) {
  const templateDefinition = getTemplate(templateId);

  if (!templateDefinition) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6 text-center font-serif">
        <div className="max-w-md w-full bg-white border border-[#C49B27]/30 rounded-3xl p-8 shadow-xl">
          <h2 className="text-xl font-bold uppercase tracking-wider text-[#241E1C] mb-2 font-cinzel">
            Template Unavailable
          </h2>
          <p className="text-xs text-zinc-500">
            The template engine could not resolve definition for &ldquo;{templateId}&rdquo;.
          </p>
        </div>
      </div>
    );
  }

  const TemplateComponent = templateDefinition.Component;
  const normalizedData = normalizeInvitationData(sampleData, `demo-${slug}`);

  return (
    <>
      <DemoOverlayBadge templateName={templateName} slug={slug} />
      <TemplateComponent
        invitationData={sampleData}
        data={normalizedData}
        clientId={`demo-${slug}`}
      />
    </>
  );
}
