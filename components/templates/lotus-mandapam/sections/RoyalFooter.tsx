"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { TraditionalCornerKolam } from "../assets/Ornaments";
import { useEmeraldPalace } from "../context";

export function RoyalFooter({ clientId }: { clientId?: string }) {
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

  const effectiveClientId =
    clientId ||
    (typeof window !== "undefined"
      ? window.location.pathname.split("/").pop()
      : undefined);

  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [hasRated, setHasRated] = useState<boolean>(false);

  const handleRate = async (star: number) => {
    setRating(star);
    setHasRated(true);

    if (
      effectiveClientId &&
      !effectiveClientId.startsWith("preview") &&
      !effectiveClientId.startsWith("demo")
    ) {
      try {
        await fetch(`/api/invitation/${effectiveClientId}/feedback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rating: star,
            feedback: "Rated through invitation footer",
          }),
        });
      } catch (e) {
        console.warn("Feedback submission error:", e);
      }
    }
  };

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

        {/* 5-Star Interactive Rating Widget */}
        <div className="flex flex-col items-center my-2">
          <span className="font-cinzel text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#DFB759] uppercase mb-1">
            A Little Love For Ahvaanam ✨
          </span>
          <div className="flex items-center justify-center gap-1.5 py-0.5">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating ?? rating) >= star;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRate(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  aria-label={`Rate ${star} stars`}
                  className="p-1 text-[#DFB759]/60 hover:text-[#FFD700] transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                >
                  <Star
                    size={20}
                    className={`transition-colors ${
                      active
                        ? "fill-[#FFD700] text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]"
                        : "text-[#DFB759]/40"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          {hasRated && (
            <p className="text-[11px] font-serif italic text-[#FDEAB2] mt-1.5 animate-fadeIn">
              Thank you for sharing your love with Ahvaanam! ❤️
            </p>
          )}
        </div>

        {/* Fine Gold Divider */}
        <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#DFB759]/50 to-transparent my-2" />

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
