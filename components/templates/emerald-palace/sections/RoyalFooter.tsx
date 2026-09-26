"use client";

import React from "react";
import { RoyalDivider, VedicGaneshaCrest } from "../assets/Ornaments";
import { useEmeraldPalace } from "../context";

export function RoyalFooter() {
  const data = useEmeraldPalace();

  return (
    <footer className="w-full bg-[#071912] text-[#FAF5EB] pt-14 pb-12 px-4 border-t-2 border-[#DFB759]/50 text-center relative z-10">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <VedicGaneshaCrest className="mb-4 scale-90" />

        <p className="font-serif italic text-lg sm:text-xl text-[#FDF2CA] max-w-lg mb-4 leading-relaxed">
          {data.footer.quote}
        </p>

        <p className="font-serif text-sm text-[#FAF5EB]/80 max-w-md mb-6 leading-relaxed">
          {data.footer.blessing}
        </p>

        <RoyalDivider goldVariant="light" className="my-4 scale-80" />

        <div className="text-xs uppercase tracking-[0.25em] text-[#DFB759] font-cinzel font-semibold mb-2">
          {data.introduction.familyTitle}
        </div>

        <p className="text-[0.75rem] text-[#FAF5EB]/60 font-cinzel tracking-wider">
          {data.footer.designer} • {data.footer.location}
        </p>
      </div>
    </footer>
  );
}
export default RoyalFooter;
