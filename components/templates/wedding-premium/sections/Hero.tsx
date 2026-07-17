"use client";

import React from "react";
import { motion } from "framer-motion";
import { GaneshaSymbol, MandalaLogo } from "../decorations";

interface HeroProps {
  data: {
    title?: string;
    subtitle?: string;
    date?: string;
    location?: string;
    welcomeMessage?: string;
  };
}

export default function Hero({ data }: HeroProps) {
  const titleVal = data?.title || "Karthik & Anusha";
  const subtitleVal = data?.subtitle || "We Are Getting Married";
  const dateVal = data?.date || "July 24, 2026";
  const locationVal = data?.location || "Coimbatore, Tamil Nadu";
  const welcomeVal = data?.welcomeMessage || "Together with our families, we invite you to celebrate our union.";

  const splitNames = typeof titleVal === "string" ? titleVal.split("&") : ["Karthik", "Anusha"];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 relative text-center py-20">
      {/* Decorative Top deity */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-4 z-10"
      >
        <GaneshaSymbol size={75} />
      </motion.div>

      {/* Welcoming Subtitle badge */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-[#E6A817] text-[9px] uppercase tracking-[4px] font-bold mb-4 z-10 max-w-xs font-serif leading-none"
      >
        {subtitleVal}
      </motion.p>

      {/* Main Couple Names */}
      <div className="my-6 z-10">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.5 }}
          className="text-4xl md:text-6xl font-extrabold tracking-[1px] leading-tight text-[#FFF7E6] font-serif"
          style={{ textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}
        >
          {splitNames[0]}
          <span className="block my-2 text-2xl font-normal text-[#E6A817] italic">&</span>
          {splitNames[1]}
        </motion.h1>
      </div>

      {/* Circular mandala backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none select-none">
        <MandalaLogo size={320} className="animate-spin animate-duration-[40s]" />
      </div>

      {/* Welcome Message text block */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="text-[#FFF7E6]/75 text-[10px] max-w-xs tracking-[1px] leading-relaxed mx-auto mb-8 font-sans z-10"
      >
        {welcomeVal}
      </motion.p>

      {/* Details (Date & Venue) Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="border border-[#E6A817]/25 rounded-2xl p-5 bg-[#3A080A]/60 backdrop-blur-md shadow-xl w-full max-w-[340px] z-10 relative overflow-hidden"
      >
        <div className="text-[#E6A817] font-semibold text-xs tracking-[2.5px] uppercase font-serif mb-2">
          Save The Date
        </div>
        <div className="text-[#FFF7E6] font-extrabold text-sm tracking-[1px] font-serif">
          {dateVal}
        </div>
        <div className="w-12 h-[1px] bg-[#E6A817]/30 mx-auto my-3" />
        <div className="text-[#FFF7E6]/70 text-[9px] uppercase tracking-[1.5px] font-semibold">
          {locationVal}
        </div>
      </motion.div>

      {/* Animated Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 flex flex-col items-center gap-1.5 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.0, ease: "easeInOut" }}
      >
        <span className="text-[#E6A817]/60 text-[7px] uppercase tracking-[3px] font-bold">Scroll Down</span>
        <div className="w-[1.5px] h-6 bg-[#E6A817]/40 rounded-full" />
      </motion.div>
    </div>
  );
}
