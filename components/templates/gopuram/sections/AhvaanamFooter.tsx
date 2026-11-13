"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { useGopuram } from "../context";

export const AhvaanamFooter: React.FC = () => {
  const { data } = useGopuram();
  const { footer } = data;
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [hasRated, setHasRated] = useState<boolean>(false);

  return (
    <footer
      id="brand-footer"
      aria-label="Ahvaanam Brand Signature Footer"
      className="relative w-full overflow-hidden py-8 sm:py-10 text-[#3b0908] bg-transparent select-none"
    >
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        {/* Slender Top Gold Flourish Divider */}
        <div className="flex items-center justify-center gap-3 w-40 sm:w-56 mb-4 select-none opacity-80">
          <span className="flex-1 h-px bg-gradient-to-r from-transparent to-[#b88636]" />
          <span className="text-[#b88636] text-[10px]">✦</span>
          <span className="flex-1 h-px bg-gradient-to-l from-transparent to-[#b88636]" />
        </div>

        {/* AHVAANAM Brand Wordmark */}
        <h2 className="font-cinzel text-lg sm:text-xl font-black tracking-[0.24em] text-[#541c15] uppercase leading-tight">
          {footer.designedBy || "AHVAANAM"}
        </h2>

        {/* Tagline / Closing Quote */}
        <p className="font-cormorant italic text-sm sm:text-base text-[#7c4a2d] font-semibold tracking-wide mt-1">
          &ldquo;{footer.quote || "A beautiful beginning starts with a beautiful invitation."}&rdquo;
        </p>

        {/* Services & Contact */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-[#805527] font-serif mt-2 opacity-85">
          <span>{footer.services || "Digital Wedding Invitations & Card Services"}</span>
          <span>•</span>
          <a
            href={`tel:${(footer.phone || "+918688178323").replace(/\s+/g, "")}`}
            className="hover:text-[#541c15] font-semibold transition-colors"
          >
            {footer.phone || "+91 8688178323"}
          </a>
        </div>

        {footer.address && (
          <p className="text-[11px] text-[#805527]/80 font-serif mt-1">
            {footer.address}
          </p>
        )}

        {/* 5-Star Rating */}
        <div className="flex flex-col items-center justify-center mt-3">
          <div className="flex items-center justify-center gap-1.5 py-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating ?? rating) >= star;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setRating(star);
                    setHasRated(true);
                  }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="transition-transform duration-200 hover:scale-125 focus:outline-none cursor-pointer"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    size={16}
                    className={`transition-all duration-200 ${
                      active
                        ? "text-[#cca038] fill-[#eab308] stroke-[#b88636] drop-shadow-[0_0_6px_rgba(234,179,8,0.5)]"
                        : "text-[#c2962b] fill-transparent stroke-[#b88636]"
                    }`}
                    strokeWidth={1.8}
                  />
                </button>
              );
            })}
          </div>

          {hasRated && (
            <span className="text-xs font-cormorant italic text-[#8e2214] font-semibold mt-1">
              Thank you for sharing your love with Ahvaanam! ❤️
            </span>
          )}
        </div>

        {/* Bottom Auspicious Lotus Center Motif */}
        <div className="relative w-16 h-8 mt-5 opacity-70">
          <Image
            src="/templates/gopuram/decoration/Lotus-Mandala.png"
            alt="Lotus"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      </div>
    </footer>
  );
};
