"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WaxSealCrest, RoyalCornerOrnament } from "../assets/Ornaments";
import { useEmeraldPalace } from "../context";

export function RoyalOpening({ onOpen }: { onOpen: () => void }) {
  const data = useEmeraldPalace();
  const [isBreakingSeal, setIsBreakingSeal] = useState(false);

  const handleOpen = () => {
    setIsBreakingSeal(true);
    setTimeout(() => {
      onOpen();
    }, 650);
  };

  const primaryCouple = data.couple.primarySide === "bride"
    ? `${data.couple.bride} & ${data.couple.groom}`
    : `${data.couple.groom} & ${data.couple.bride}`;

  return (
    <motion.div
      className="emerald-opening-overlay"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] },
      }}
      onClick={handleOpen}
    >
      <motion.div
        className="emerald-envelope-box max-h-[92vh] overflow-y-auto"
        style={{ padding: "1.75rem 1.25rem" }}
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{
          opacity: 0,
          scale: 1.08,
          filter: "blur(8px)",
          transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
        }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="emerald-envelope-inner-border" />

        {/* 4 Corner Ornaments */}
        <RoyalCornerOrnament position="tl" className="absolute top-2 left-2 opacity-80" />
        <RoyalCornerOrnament position="tr" className="absolute top-2 right-2 opacity-80" />
        <RoyalCornerOrnament position="bl" className="absolute bottom-2 left-2 opacity-80" />
        <RoyalCornerOrnament position="br" className="absolute bottom-2 right-2 opacity-80" />

        {/* Auspicious Vedic Invocation */}
        <motion.p
          className="text-xs uppercase tracking-[0.25em] text-[#DFB759]/90 font-medium mb-3 font-cinzel"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {data.introduction.mantra}
        </motion.p>

        {/* Wax Seal Crest with Breaking animation on tap */}
        <motion.div
          className="my-4 cursor-pointer"
          animate={isBreakingSeal ? { scale: [1, 1.25, 0], rotate: [0, 8, -12], opacity: [1, 1, 0] } : { scale: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <WaxSealCrest monogram={data.couple.monogram} />
        </motion.div>

        {/* Royal Family Invitation Banner */}
        <motion.p
          className="text-[0.8rem] tracking-[0.2em] uppercase text-[#F5ECE0]/80 font-cinzel my-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {data.introduction.familyTitle}
        </motion.p>

        {/* Couple Names */}
        <motion.h1
          className="text-3xl sm:text-4xl text-[#DFB759] font-serif tracking-wide my-2 leading-tight drop-shadow-md ep-gold-text"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          {primaryCouple}
        </motion.h1>

        {/* Wedding Date */}
        <motion.div
          className="mt-4 pt-3 border-t border-[#DFB759]/30 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <span className="text-xs uppercase tracking-[0.2em] text-[#FFE8A3] font-cinzel">
            {data.wedding.date}
          </span>
          <span className="text-[0.75rem] italic text-[#F5ECE0]/70 mt-1">
            {data.wedding.venue}, {data.wedding.city}
          </span>
        </motion.div>

        {/* Tap to Unveil CTA */}
        <motion.div
          className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#DFB759]/15 border border-[#DFB759]/40 text-[#DFB759] text-xs uppercase tracking-[0.18em] font-cinzel font-semibold"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        >
          <span>✦ Tap to Open Invitation ✦</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
export default RoyalOpening;
