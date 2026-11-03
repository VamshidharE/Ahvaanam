"use client";

import React from "react";
import { motion, MotionValue } from "framer-motion";
import { PelliPandiriData } from "../adapter";

interface CoupleNameTitleProps {
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  isMobile: boolean;
  data: PelliPandiriData;
}

export const CoupleNameTitle: React.FC<CoupleNameTitleProps> = ({
  opacity,
  y,
  data,
}) => {
  const { details, couple } = data;
  const invocation = details.invocation || "|| श्री गणेशाय नमः ||";
  const introductoryMessage = details.introductoryMessage || "TOGETHER WITH THEIR FAMILIES";
  const introductorySubMessage = details.introductorySubMessage || "invite you to celebrate the beginning of their beautiful journey together";
  const familyName = details.familyName || "BIRUDURAJU'S FAMILY";
  const groomName = couple.firstPersonName || "Arjun";
  const brideName = couple.secondPersonName || "Meera";
  const weddingDate = details.weddingDate || "SUNDAY, NOVEMBER 29, 2026";
  const muhurthamTime = details.muhurthamTime || "AT 09:15 AM";

  const displayFamilyTitle = familyName.includes("INVITATION")
    ? familyName
    : `${familyName.replace(/['’]S\s+FAMILY/i, "")}'S WEDDING INVITATION`;

  return (
    <motion.div
      style={{
        opacity,
        y,
      }}
      className="absolute top-[6vh] sm:top-[8vh] md:top-[9vh] left-1/2 -translate-x-1/2 w-[94%] max-w-[860px] z-15 flex flex-col items-center text-center pointer-events-none select-none px-2"
    >
      {/* 
        1. SACRED SLOGAN & LORD GANESHA (Top of Hero Scene)
        Traditional Ganapati icon & sacred text
      */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="flex flex-col items-center justify-center mb-2 select-none"
      >
        <p
          className="font-serif text-sm sm:text-base md:text-lg font-bold tracking-[0.2em] text-[#580d15] uppercase"
          style={{
            textShadow: "0 1px 3px rgba(0, 0, 0, 0.35), 0 1px 2px rgba(255, 255, 255, 0.5)",
          }}
        >
          {invocation}
        </p>

        {/* Lord Ganesha Idol */}
        <div className="relative w-12 h-14 sm:w-15 sm:h-18 md:w-18 md:h-22 my-1 flex items-center justify-center">
          <img
            src="/templates/pelli-pandiri/decoration/lord-ganesha.webp"
            alt="Lord Ganesha – Vignaharta"
            className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)] drop-shadow-[0_1px_2px_rgba(255,255,255,0.4)]"
          />
        </div>
      </motion.div>

      {/* 
        2. TOGETHER WITH THEIR FAMILIES CONTEXT
      */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, delay: 0.15 }}
        className="flex flex-col items-center gap-0.5 mb-1.5"
      >
        <p
          className="font-cinzel text-[10.5px] sm:text-xs md:text-sm font-bold tracking-[0.24em] uppercase text-[#541219]"
          style={{ textShadow: "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(255, 255, 255, 0.5)" }}
        >
          {introductoryMessage}
        </p>
        <p
          className="font-cormorant italic text-xs sm:text-sm md:text-base font-semibold text-[#4e2217] tracking-wide"
          style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.25), 0 1px 2px rgba(255, 255, 255, 0.4)" }}
        >
          {introductorySubMessage}
        </p>
      </motion.div>

      {/* 
        3. SURNAME WEDDING INVITATION TEXT
      */}
      <motion.h2
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 0.25 }}
        className="font-cinzel text-sm sm:text-base md:text-lg lg:text-xl font-extrabold tracking-[0.26em] uppercase text-[#38070d] my-1"
        style={{
          textShadow:
            "0 2px 6px rgba(0, 0, 0, 0.35), 0 1px 3px rgba(255, 255, 255, 0.5)",
        }}
      >
        {displayFamilyTitle}
      </motion.h2>

      {/* 
        GRAND BRIDE & GROOM NAMES – BOLD, COMMANDING, OPULENT SIZING
        Deep royal maroon with crisp contrast against sunset sky
      */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="my-2 sm:my-3 md:my-4 flex flex-col items-center justify-center gap-0 sm:gap-1"
      >
        <h1
          className="font-cinzel text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-[0.08em] sm:tracking-[0.12em] leading-none uppercase text-[#300509]"
          style={{
            filter:
              "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.45)) drop-shadow(0 6px 18px rgba(50, 8, 12, 0.4)) drop-shadow(0 1px 2px rgba(255, 255, 255, 0.6))",
          }}
        >
          {groomName}
        </h1>

        {/* Ornate Calligraphic Ampersand with Golden Swirl Wings */}
        <div className="relative my-[-6px] sm:my-[-14px] md:my-[-20px] flex items-center justify-center gap-2 sm:gap-4 z-10">
          <span className="w-10 sm:w-16 md:w-24 h-[1.5px] bg-gradient-to-r from-transparent via-[#d4af37] to-[#7a121d]" />
          <span
            className="font-cormorant italic text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-[#8a3c10] select-none"
            style={{
              textShadow: "0 2px 6px rgba(0, 0, 0, 0.35), 0 1px 2px rgba(255, 255, 255, 0.5)",
            }}
          >
            &amp;
          </span>
          <span className="w-10 sm:w-16 md:w-24 h-[1.5px] bg-gradient-to-l from-transparent via-[#d4af37] to-[#7a121d]" />
        </div>

        <h1
          className="font-cinzel text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-[0.08em] sm:tracking-[0.12em] leading-none uppercase text-[#300509]"
          style={{
            filter:
              "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.45)) drop-shadow(0 6px 18px rgba(50, 8, 12, 0.4)) drop-shadow(0 1px 2px rgba(255, 255, 255, 0.6))",
          }}
        >
          {brideName}
        </h1>
      </motion.div>

      {/* 
        ELEGANT ROYAL DIVIDER
      */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 my-1 sm:my-2 opacity-95">
        <span className="w-14 sm:w-28 md:w-40 h-[1.5px] bg-gradient-to-r from-transparent via-[#d4af37] to-[#54141a]" />
        <span className="text-[#a85a1a] text-sm sm:text-base md:text-lg font-serif">✦</span>
        <span className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5 rotate-45 border border-[#d4af37] bg-[#54141a]/80" />
        <span className="text-[#a85a1a] text-sm sm:text-base md:text-lg font-serif">✦</span>
        <span className="w-14 sm:w-28 md:w-40 h-[1.5px] bg-gradient-to-l from-transparent via-[#d4af37] to-[#54141a]" />
      </div>

      {/* Wedding Date & Auspicious Muhurtham Time */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.45 }}
        className="flex flex-col items-center gap-0.5 sm:gap-1 mt-0.5"
      >
        <p
          className="font-cinzel text-sm sm:text-lg md:text-xl lg:text-2xl text-[#38080d] tracking-[0.24em] uppercase font-extrabold"
          style={{
            textShadow: "0 1px 4px rgba(0, 0, 0, 0.35), 0 1px 2px rgba(255, 255, 255, 0.4)",
          }}
        >
          {weddingDate}
        </p>

        {muhurthamTime && (
          <p
            className="font-cormorant text-xs sm:text-base md:text-lg lg:text-xl text-[#732212] font-extrabold tracking-[0.22em] uppercase"
            style={{
              textShadow: "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(255, 255, 255, 0.4)",
            }}
          >
            {muhurthamTime}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};
