"use client";

import React from "react";
import { Heart } from "lucide-react";
import { MandalaLogo } from "../decorations";

interface FooterProps {
  data: {
    salutation?: string;
    creditText?: string;
    hashtag?: string;
  };
}

export default function Footer({ data }: FooterProps) {
  const salutationVal = data?.salutation || "Thank you for being a part of our lives.";
  const creditVal = data?.creditText || "Made with love for Karthik & Anusha";
  const hashtagVal = data?.hashtag || "#KarthikWedsAnusha";

  return (
    <div className="py-16 px-6 text-center space-y-6 relative overflow-hidden select-none">
      {/* Decorative center mandala */}
      <div className="mb-4 opacity-30">
        <MandalaLogo size={70} className="animate-spin animate-duration-[25s]" />
      </div>

      {/* Salutation */}
      <h3 className="text-sm font-bold text-[#FFF7E6] tracking-[1px] leading-relaxed max-w-xs mx-auto font-serif">
        {salutationVal}
      </h3>

      {/* Wedding hashtag */}
      {hashtagVal && (
        <div className="inline-block px-4 py-1.5 rounded-full border border-[#E6A817]/25 bg-[#3A080A]/40 text-[#E6A817] text-[10px] font-bold uppercase tracking-[2px] shadow-sm">
          {hashtagVal}
        </div>
      )}

      {/* Spacing lines */}
      <div className="w-8 h-[1px] bg-[#E6A817]/20 mx-auto my-4" />

      {/* Footer credit branding lines */}
      <div className="flex flex-col items-center gap-1.5 pt-2 text-[#FFF7E6]/40 text-[7.5px] uppercase tracking-[1.5px] font-semibold font-sans">
        <span>{creditVal}</span>
        <div className="flex items-center gap-1">
          <span>Powered by</span>
          <span className="text-[#E6A817] font-extrabold font-serif tracking-[1px]">Ahvaanam</span>
          <Heart size={8} className="text-[#E6A817] fill-[#E6A817]" />
        </div>
      </div>
    </div>
  );
}
