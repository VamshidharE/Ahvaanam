"use client";

import React from "react";
import { MapPin, Navigation } from "lucide-react";
import { GoldDivider } from "../decorations";

interface VenueItem {
  venueName?: string;
  address?: string;
  city?: string;
  mapsUrl?: string;
  embedUrl?: string;
}

interface VenueProps {
  data: {
    title?: string;
    venues?: VenueItem[];
  };
}

export default function Venue({ data }: VenueProps) {
  const titleVal = data?.title || "Wedding Venues";
  const venuesVal = data?.venues || [];

  if (venuesVal.length === 0) return null;

  return (
    <div className="py-8 text-center space-y-6 select-none">
      <h2 className="text-xl font-bold uppercase tracking-[2.5px] text-[#E6A817] font-serif">{titleVal}</h2>
      <GoldDivider />

      <div className="space-y-6">
        {venuesVal.map((v, idx) => (
          <div 
            key={idx} 
            className="border border-[#E6A817]/20 rounded-xl p-5 bg-black/25 relative overflow-hidden text-left space-y-3.5 shadow-lg"
          >
            {/* Venue name header */}
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-[#E6A817]" />
              <h3 className="text-sm font-bold text-[#FFF7E6] font-serif">{v.venueName}</h3>
            </div>

            {/* Address text */}
            <p className="text-[#FFF7E6]/70 text-[9.5px] leading-relaxed font-sans pl-1">
              {v.address}
            </p>

            {/* Maps iframe embedding block */}
            {v.embedUrl && (
              <div className="w-full aspect-[16/9] rounded-xl overflow-hidden shadow-inner border border-white/5 relative bg-white/5">
                <iframe 
                  src={v.embedUrl} 
                  className="w-full h-full border-none opacity-85" 
                  allowFullScreen={false} 
                  loading="lazy"
                  title={`Map location for ${v.venueName}`}
                />
              </div>
            )}

            {/* Navigation Button */}
            {v.mapsUrl && (
              <a
                href={v.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 border border-[#E6A817]/40 bg-[#E6A817]/10 hover:bg-[#E6A817]/15 text-[#E6A817] rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer text-center w-full"
              >
                <Navigation size={13} />
                <span>Get Directions</span>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
