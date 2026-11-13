"use client";

import React from "react";
import { motion } from "framer-motion";
import { TraditionalAuspiciousMotif, TraditionalCornerKolam } from "../assets/Ornaments";
import { useEmeraldPalace } from "../context";

export function VenueConcierge() {
  const data = useEmeraldPalace();

  return (
    <div className="relative w-full scroll-mt-16" id="venue">
      {/* Full-width Cinematic Mandap Scene */}
      <div className="ep-mandap-scene relative overflow-hidden min-h-[520px] sm:min-h-[620px] flex items-end justify-center pb-8 sm:pb-14">
        {/* Background Image: Luxury South Indian Wedding Mandap with Slow Cinematic Zoom */}
        <img
          src="/templates/emerald-palace/mandap-venue.jpg"
          alt="Luxury South Indian Kalyana Mandapam Stage"
          className="ep-mandap-bg-img ep-slow-zoom absolute inset-0 w-full h-full object-cover object-center"
          loading="lazy"
        />

        {/* Cinematic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20 pointer-events-none" />

        {/* Sophisticated Floating Venue Information Suite */}
        <motion.div
          className="relative z-10 w-full max-w-xl mx-4 bg-[#FFFDF9]/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-[#D6AD63]/60 text-center"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.85 }}
        >
          {/* Subtle Hand-Drawn Corner Kolams */}
          <div className="absolute top-2 left-2 w-6 h-6 opacity-50 pointer-events-none">
            <TraditionalCornerKolam className="w-full h-full" />
          </div>
          <div className="absolute top-2 right-2 w-6 h-6 opacity-50 pointer-events-none scale-x-[-1]">
            <TraditionalCornerKolam className="w-full h-full" />
          </div>
          <div className="absolute bottom-2 left-2 w-6 h-6 opacity-50 pointer-events-none scale-y-[-1]">
            <TraditionalCornerKolam className="w-full h-full" />
          </div>
          <div className="absolute bottom-2 right-2 w-6 h-6 opacity-50 pointer-events-none scale-[-1]">
            <TraditionalCornerKolam className="w-full h-full" />
          </div>

          {/* Sacred Auspicious Deepam & Kalash Emblem */}
          <div className="w-12 h-12 mx-auto mb-2 opacity-85 pointer-events-none">
            <TraditionalAuspiciousMotif className="w-full h-full object-contain" />
          </div>

          {/* Location Pin Icon & Title */}
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <span className="font-cinzel text-xs font-bold uppercase tracking-[0.25em] text-[#781D36]">
              Auspicious Venue
            </span>
          </div>

          {/* Venue Name */}
          <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#542D2A] mb-2 leading-snug">
            {data.wedding.venue}
          </h3>

          {/* Full Address */}
          <p className="font-serif text-xs sm:text-sm text-[#7E5B58] mb-5 max-w-md mx-auto leading-relaxed">
            {data.wedding.address || data.wedding.city}
          </p>

          {/* Timings Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-6">
            <div className="bg-[#FFF6E9] px-3.5 py-1.5 rounded-full border border-[#D6AD63]/40 text-left">
              <span className="font-cinzel text-[10px] tracking-wider uppercase font-bold text-[#781D36] block">
                Muhurtham
              </span>
              <span className="font-serif text-xs text-[#542D2A] font-semibold">
                {data.wedding.date} • {data.wedding.time}
              </span>
            </div>
            {data.reception?.enabled && (
              <div className="bg-[#FFF6E9] px-3.5 py-1.5 rounded-full border border-[#D6AD63]/40 text-left">
                <span className="font-cinzel text-[10px] tracking-wider uppercase font-bold text-[#781D36] block">
                  Reception
                </span>
                <span className="font-serif text-xs text-[#542D2A] font-semibold">
                  {data.reception.date} • {data.reception.time}
                </span>
              </div>
            )}
          </div>

          {/* Actions: View on Google Maps */}
          <div className="flex items-center justify-center gap-3">
            <a
              href={data.wedding.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ep-btn-burgundy text-xs py-2.5 px-6"
              aria-label="View Venue on Google Maps"
            >
              <span>📍 View on Google Maps</span>
              <span>↗</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
export default VenueConcierge;
