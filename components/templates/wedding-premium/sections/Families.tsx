"use client";

import React from "react";
import { GoldDivider } from "../decorations";

interface FamiliesProps {
  data: {
    title?: string;
    brideFamily?: string;
    groomFamily?: string;
  };
}

export default function Families({ data }: FamiliesProps) {
  const titleVal = data?.title || "Our Families";
  const brideFamilyVal = data?.brideFamily || "Sundarajan & Vijayalakshmi (Parents)\nDr. Swetha Sundarajan (Sister)\nDr. Raghavan (Brother-in-Law)";
  const groomFamilyVal = data?.groomFamily || "Rajasekar & Saraswathi (Parents)\nVikram Rajasekar (Brother)\nPreethi Vikram (Sister-in-Law)";

  const splitLines = (txt: any) => {
    if (typeof txt !== "string") return [];
    return txt.split("\n").filter(line => line.trim() !== "");
  };

  return (
    <div className="py-8 text-center space-y-6 select-none">
      <h2 className="text-xl font-bold uppercase tracking-[2.5px] text-[#E6A817] font-serif">{titleVal}</h2>
      <GoldDivider />

      <div className="grid grid-cols-2 gap-4 text-left">
        {/* Bride Family details */}
        <div className="border border-[#E6A817]/15 rounded-xl p-4 bg-black/15 space-y-3 flex flex-col justify-between">
          <span className="text-[#E6A817] text-[8px] uppercase tracking-[2px] font-bold border-b border-[#E6A817]/15 pb-1.5 block">Bride's Family</span>
          <ul className="space-y-1.5 flex-1">
            {splitLines(brideFamilyVal).map((member, idx) => (
              <li key={idx} className="text-[#FFF7E6]/75 text-[9.5px] leading-tight font-serif">
                {member}
              </li>
            ))}
          </ul>
        </div>

        {/* Groom Family details */}
        <div className="border border-[#E6A817]/15 rounded-xl p-4 bg-black/15 space-y-3 flex flex-col justify-between">
          <span className="text-[#E6A817] text-[8px] uppercase tracking-[2px] font-bold border-b border-[#E6A817]/15 pb-1.5 block">Groom's Family</span>
          <ul className="space-y-1.5 flex-1">
            {splitLines(groomFamilyVal).map((member, idx) => (
              <li key={idx} className="text-[#FFF7E6]/75 text-[9.5px] leading-tight font-serif">
                {member}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
