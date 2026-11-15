"use client";

import React from "react";
import { TraditionalCornerKolam } from "../assets/Ornaments";
import { useEmeraldPalace } from "../context";

export function RoyalFooter() {
  const data = useEmeraldPalace();

  const isBrideFirst = data.couple.primarySide === "bride";
  const firstName = isBrideFirst ? data.couple.bride : data.couple.groom;
  const secondName = isBrideFirst ? data.couple.groom : data.couple.bride;

  const quoteText = data.footer?.quote || data.footer?.blessing || "";
  const brandName = data.footer?.designer || "Ahvaanam";
  const serviceSubtitle = data.footer?.service || "Digital Wedding Invitations";
  const brandDisplay =
    brandName && brandName.toLowerCase() !== "ahvaanam"
      ? `${brandName} • ${serviceSubtitle}`
      : serviceSubtitle;

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
        {/* Illuminated Royal Couple Names */}
        <h3 className="font-cinzel text-xl sm:text-2xl lg:text-3xl text-[#FDEAB2] font-bold tracking-wider uppercase leading-tight my-1 drop-shadow-[0_2px_14px_rgba(223,183,89,0.5)]">
          {firstName} &amp; {secondName}
        </h3>

        {/* Short Closing Message (dynamically synced with editor) */}
        {quoteText && (
          <p className="font-serif text-xs sm:text-sm text-[#FFF6E9]/90 italic max-w-md mx-auto leading-relaxed mb-3">
            &ldquo;{quoteText}&rdquo;
          </p>
        )}

        {/* Fine Gold Divider */}
        <div className="w-28 h-[1px] bg-gradient-to-r from-transparent via-[#DFB759]/80 to-transparent my-3" />

        {/* Ahvaanam Official Brand Section & Website Link */}
        <a
          href="https://www.ahvaanam.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-col items-center gap-1.5 transition-transform hover:scale-105 group"
        >
          {/* Ahvaanam Logo */}
          <img
            src="/images/logo.png"
            alt="Ahvaanam"
            className="h-7 sm:h-8 w-auto object-contain brightness-110 drop-shadow-[0_2px_8px_rgba(223,183,89,0.3)]"
            loading="lazy"
            decoding="async"
          />

          {/* Dynamic Editable Designer & Service Credits */}
          <span className="font-cinzel text-[9px] uppercase tracking-[0.22em] text-[#DFB759]/90 font-semibold">
            {brandDisplay}
          </span>

          {/* Ahvaanam Website Link */}
          <span className="font-cinzel text-[10px] tracking-[0.2em] text-[#D6AD63] font-bold group-hover:text-[#FFF6E9] transition-colors underline-offset-4 group-hover:underline">
            www.ahvaanam.in
          </span>
        </a>
      </div>
    </footer>
  );
}

export default RoyalFooter;
