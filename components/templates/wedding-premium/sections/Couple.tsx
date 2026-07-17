"use client";

import React from "react";
import { GoldDivider } from "../decorations";

interface CoupleProps {
  data: {
    groomName?: string;
    groomParents?: string;
    groomDescription?: string;
    brideName?: string;
    brideParents?: string;
    brideDescription?: string;
    message?: string;
  };
}

export default function Couple({ data }: CoupleProps) {
  const groomNameVal = data?.groomName || "Karthik";
  const groomParentsVal = data?.groomParents || "Saraswathi & Rajasekar";
  const groomDescVal = data?.groomDescription || "A passionate designer and software engineer who loves architecture, travel, and fine art.";
  const brideNameVal = data?.brideName || "Anusha";
  const brideParentsVal = data?.brideParents || "Vijayalakshmi & Sundarajan";
  const brideDescVal = data?.brideDescription || "A creative digital marketer and classical dancer with a love for music, plants, and story-writing.";
  const messageVal = data?.message || "Two hearts, two souls, united in love for a lifetime journey.";

  return (
    <div className="py-8 text-center space-y-6 select-none">
      <h2 className="text-xl font-bold uppercase tracking-[2.5px] text-[#E6A817] font-serif">The Couple</h2>
      <GoldDivider />

      <p className="text-[#FFF7E6]/75 text-[10px] tracking-[1px] leading-relaxed italic max-w-xs mx-auto mb-8 font-sans">
        "{messageVal}"
      </p>

      <div className="space-y-8">
        {/* Groom Panel */}
        <div className="border border-[#E6A817]/20 rounded-xl p-5 bg-black/25 relative overflow-hidden text-center space-y-2.5">
          <span className="text-[#E6A817] text-[8px] uppercase tracking-[3px] font-bold">The Groom</span>
          <h3 className="text-2xl font-bold tracking-[1px] text-[#FFF7E6] font-serif">{groomNameVal}</h3>
          
          <div className="flex flex-col items-center">
            <span className="text-[7px] text-[#FFF7E6]/40 uppercase tracking-[1px] font-semibold">Son of</span>
            <span className="text-[10px] text-[#FFF7E6]/85 font-serif font-semibold mt-0.5">{groomParentsVal}</span>
          </div>

          <div className="w-8 h-[1px] bg-[#E6A817]/25 mx-auto my-1" />
          <p className="text-[#FFF7E6]/70 text-[9px] leading-relaxed max-w-xs mx-auto font-sans">
            {groomDescVal}
          </p>
        </div>

        {/* Bride Panel */}
        <div className="border border-[#E6A817]/20 rounded-xl p-5 bg-black/25 relative overflow-hidden text-center space-y-2.5">
          <span className="text-[#E6A817] text-[8px] uppercase tracking-[3px] font-bold">The Bride</span>
          <h3 className="text-2xl font-bold tracking-[1px] text-[#FFF7E6] font-serif">{brideNameVal}</h3>
          
          <div className="flex flex-col items-center">
            <span className="text-[7px] text-[#FFF7E6]/40 uppercase tracking-[1px] font-semibold">Daughter of</span>
            <span className="text-[10px] text-[#FFF7E6]/85 font-serif font-semibold mt-0.5">{brideParentsVal}</span>
          </div>

          <div className="w-8 h-[1px] bg-[#E6A817]/25 mx-auto my-1" />
          <p className="text-[#FFF7E6]/70 text-[9px] leading-relaxed max-w-xs mx-auto font-sans">
            {brideDescVal}
          </p>
        </div>
      </div>
    </div>
  );
}
