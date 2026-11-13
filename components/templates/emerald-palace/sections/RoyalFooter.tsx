"use client";

import React from "react";
import { TraditionalAuspiciousMotif, TraditionalCornerKolam } from "../assets/Ornaments";
import { useEmeraldPalace } from "../context";

export function RoyalFooter() {
  const data = useEmeraldPalace();

  const isBrideFirst = data.couple.primarySide === "bride";
  const firstName = isBrideFirst ? data.couple.bride : data.couple.groom;
  const secondName = isBrideFirst ? data.couple.groom : data.couple.bride;

  return (
    <footer
      className="relative w-full ep-bg-footer-silk text-[#FFF6E9] py-10 sm:py-12 px-4 overflow-hidden border-t-2 border-[#D6AD63]"
      role="contentinfo"
    >
      {/* Authentic Corner Kolam Linework in Footer with Gold Glow */}
      <div className="absolute top-2 left-2 w-24 sm:w-36 opacity-35 pointer-events-none brightness-150 filter drop-shadow-[0_2px_8px_rgba(223,183,89,0.3)]">
        <TraditionalCornerKolam className="w-full h-auto" />
      </div>
      <div className="absolute top-2 right-2 w-24 sm:w-36 opacity-35 pointer-events-none scale-x-[-1] brightness-150 filter drop-shadow-[0_2px_8px_rgba(223,183,89,0.3)]">
        <TraditionalCornerKolam className="w-full h-auto" />
      </div>

      <div className="relative z-10 max-w-xl mx-auto text-center flex flex-col items-center">
        {/* Compact Auspicious Deepam Motif */}
        <div className="w-10 h-10 mb-2 opacity-85 brightness-150 pointer-events-none filter drop-shadow-[0_0_12px_rgba(223,183,89,0.4)]">
          <TraditionalAuspiciousMotif className="w-full h-full object-contain" />
        </div>

        {/* Subtle Gold Monogram Emblem */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#65182F] to-[#450F1D] border-2 border-[#DFB759] flex items-center justify-center shadow-lg mb-2">
          <span className="font-cinzel text-xs font-bold text-[#FDEAB2] tracking-wider">
            {data.couple.monogram || "A & D"}
          </span>
        </div>

        {/* Illuminated Royal Couple Names */}
        <h3 className="font-cinzel text-xl sm:text-2xl lg:text-3xl text-[#FDEAB2] font-bold tracking-wider uppercase leading-tight my-1 drop-shadow-[0_2px_14px_rgba(223,183,89,0.5)]">
          {firstName} &amp; {secondName}
        </h3>

        {/* Wedding Date */}
        <p className="font-cinzel text-[11px] uppercase tracking-[0.25em] text-[#D6AD63] font-bold mt-1 mb-2">
          ✦ {data.wedding.date} ✦
        </p>

        {/* Short Closing Message */}
        <p className="font-serif text-xs sm:text-sm text-[#FFF6E9]/90 italic max-w-sm mx-auto leading-relaxed mb-3">
          &ldquo;{data.footer.blessing || "Looking forward to celebrating our sacred union with your esteemed presence."}&rdquo;
        </p>

        {/* Fine Gold Divider */}
        <div className="w-28 h-[1px] bg-gradient-to-r from-transparent via-[#DFB759]/80 to-transparent my-2" />

        {/* Brand Credit */}
        <span className="font-cinzel text-[9px] uppercase tracking-[0.22em] text-[#DFB759]/80 font-semibold">
          Ahvaanam • Luxury Digital Wedding Suite
        </span>
      </div>
    </footer>
  );
}

export default RoyalFooter;
