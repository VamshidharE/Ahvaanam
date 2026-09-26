"use client";

import React from "react";
import { InvitationData } from "@/lib/template-engine/types";

export default function Footer({ data }: { data: InvitationData }) {
  const { footer } = data;

  return (
    <footer className="relative py-12 px-4 bg-[#2D070A] text-[#FFF8EB] text-center border-t-2 border-[#C59B27]/40 select-none">
      <div className="max-w-xl mx-auto space-y-4">
        
        {/* Sacred Sanskrit Benediction */}
        <div className="text-2xl text-[#C59B27] font-serif">ॐ</div>

        <p className="text-xs uppercase tracking-[3px] font-bold text-[#E8C15A] font-serif">
          शुभ विवाह ✦ Mangalyam Tantunanena
        </p>

        <p className="text-xs text-[#FFF8EB]/70 max-w-md mx-auto italic font-serif leading-relaxed">
          "{footer.quote || "A beautiful beginning starts with a sacred invitation. Thank you for being a part of our celebration."}"
        </p>

        <div className="w-16 h-[1px] bg-[#C59B27]/30 mx-auto my-4" />

        <div className="space-y-1 text-[10px] text-[#FFF8EB]/60">
          <p className="uppercase tracking-[2px] font-bold text-[#E8C15A]">
            {footer.designer || "Ahvaanam"} Digital Invitations
          </p>
          <p>{footer.service || "Printed & Powered by Tirumala Printers, Metpally"}</p>
          <p className="text-[#C59B27]">{footer.contact || "+91 9866767100"}</p>
        </div>

      </div>
    </footer>
  );
}
