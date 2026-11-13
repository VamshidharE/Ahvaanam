"use client";

import React from "react";
import { motion, MotionValue } from "framer-motion";
import { useGopuram } from "./context";

interface OpeningHeaderProps {
  opacity: MotionValue<number>;
  y: MotionValue<number>;
}

export const OpeningHeader: React.FC<OpeningHeaderProps> = ({ opacity, y }) => {
  const { data } = useGopuram();
  const { details, couple } = data;

  const firstPersonName = couple.firstPersonName || couple.groomName || "Arjun";
  const secondPersonName = couple.secondPersonName || couple.brideName || "Meera";

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute top-0 left-0 right-0 z-30 pt-4 sm:pt-6 md:pt-7 px-4 flex flex-col items-center text-center pointer-events-none select-none max-w-4xl mx-auto"
    >
      {/* Auspicious Invocation */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="text-[#eed68a] text-[10px] sm:text-xs tracking-[0.25em] font-cinzel font-semibold mb-1 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
      >
        {details.invocation}
      </motion.div>

      {/* Decorative Golden Divider Motif */}
      <div className="flex items-center gap-2.5 my-0.5 opacity-80">
        <span className="w-6 sm:w-12 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-[#e8c766]" />
        <span className="text-[#e8c766] text-[10px] font-serif">✦</span>
        <span className="w-6 sm:w-12 h-[1px] bg-gradient-to-l from-transparent via-[#d4af37] to-[#e8c766]" />
      </div>

      {/* Introductory message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.95 }}
        transition={{ duration: 1.2, delay: 0.15 }}
        className="text-[#f1ece1] font-cormorant italic text-xs sm:text-sm md:text-base max-w-lg mx-auto mt-1 leading-snug tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]"
      >
        {details.introductoryMessage}
      </motion.p>

      {/* Family Surname Heading */}
      {details.familyName && (
        <motion.h2
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.2 }}
          className="font-cinzel text-xs sm:text-sm md:text-base font-extrabold tracking-[0.22em] uppercase text-[#fdfaf2] my-0.5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]"
        >
          {details.familyName}
        </motion.h2>
      )}

      {/* Couple Names */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.3, delay: 0.3 }}
        className="mt-1 sm:mt-2 flex flex-row items-center justify-center gap-2 sm:gap-4 md:gap-5"
      >
        <h1 className="font-cinzel text-2xl sm:text-4xl md:text-[2.75rem] md:leading-tight font-bold tracking-wider gold-gradient-text gold-subtle-glow drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
          {firstPersonName}
        </h1>

        <span className="font-cormorant italic text-xl sm:text-2xl md:text-3xl text-[#edd693] font-light drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          &
        </span>

        <h1 className="font-cinzel text-2xl sm:text-4xl md:text-[2.75rem] md:leading-tight font-bold tracking-wider gold-gradient-text gold-subtle-glow drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
          {secondPersonName}
        </h1>
      </motion.div>

      {/* Wedding Date & Sacred Timing */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.45 }}
        className="mt-1 sm:mt-1.5 flex flex-col items-center gap-0.5"
      >
        <p className="font-cinzel text-[10px] sm:text-xs md:text-sm text-[#fdfaf2] tracking-[0.2em] uppercase font-semibold drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
          {details.weddingDate}
        </p>

        <p className="font-cormorant italic text-[9px] sm:text-xs text-[#edd693] tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
          {details.subDateText} {details.muhurthamTime ? `• ${details.muhurthamTime}` : ""}
        </p>
      </motion.div>
    </motion.div>
  );
};
