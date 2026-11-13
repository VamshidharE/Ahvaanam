"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { VedicGaneshaCrest } from "../assets/Ornaments";
import { useEmeraldPalace } from "../context";

export function RoyalOpening({ onOpen }: { onOpen: () => void }) {
  const data = useEmeraldPalace();
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 700);
  };

  // Automatic opening within 2 seconds as requested (no button needed)
  useEffect(() => {
    const timer = setTimeout(() => {
      handleOpen();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const primaryCouple =
    data.couple.primarySide === "bride"
      ? `${data.couple.bride} & ${data.couple.groom}`
      : `${data.couple.groom} & ${data.couple.bride}`;

  const ganeshMantra =
    (data.hero as any)?.welcomeMessage ||
    data.introduction?.mantra ||
    "॥ श्री गणेशाय नमः ॥";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-b from-[#2B0912]/95 via-[#3D0E1A]/95 to-[#1A040A]/98 backdrop-blur-xl select-none cursor-pointer overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: isOpening ? 0 : 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
      }}
      onClick={handleOpen}
    >
      {/* Ambient Royal Gold Glow in Background */}
      <div
        className="absolute w-96 h-96 rounded-full bg-radial from-[#D6AD63]/20 via-[#781D36]/10 to-transparent blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Royal Arched Invitation Folio Card */}
      <motion.div
        className="relative w-full max-w-[340px] sm:max-w-[380px] bg-gradient-to-b from-[#FFFDF8] via-[#FFF9F0] to-[#FDF4E6] border-[1.5px] border-[#D6AD63] rounded-t-[140px] rounded-b-[24px] px-6 py-8 sm:px-8 sm:py-9 text-center shadow-[0_24px_60px_rgba(20,4,8,0.65),inset_0_0_30px_rgba(214,173,99,0.15)] overflow-hidden"
        initial={{ opacity: 0, scale: 0.92, y: 25 }}
        animate={
          isOpening
            ? { opacity: 0, scale: 1.06, y: -20, filter: "blur(6px)" }
            : { opacity: 1, scale: 1, y: 0 }
        }
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Inner Delicate Inset Gold Hairline Contour */}
        <div className="absolute inset-2 border border-[#D6AD63]/55 rounded-t-[132px] rounded-b-[18px] pointer-events-none" />

        {/* Top Decorative Gold Finial Ornament */}
        <div className="flex justify-center -mt-2 mb-2">
          <svg viewBox="0 0 24 16" className="w-5 h-3.5 text-[#C99A38]" fill="currentColor">
            <path d="M12 0L14.5 5.5L20 7L15 11L16 16L12 13L8 16L9 11L4 7L9.5 5.5L12 0Z" />
          </svg>
        </div>

        {/* Sacred Vedic Ganesha Crest */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mb-1.5 flex justify-center text-[#C99A38]"
        >
          <VedicGaneshaCrest />
        </motion.div>

        {/* Auspicious Kumkum Crimson Mantra */}
        <motion.p
          className="font-mantra text-xs uppercase tracking-[0.22em] text-[#9E1B32] font-bold mb-3"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          {ganeshMantra}
        </motion.p>

        {/* Traditional Gold Flourish Divider */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#D6AD63]" />
          <span className="text-[#C99A38] text-[9px]">✦</span>
          <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#D6AD63]" />
        </div>

        {/* Wax Seal Medallion in Deep Burgundy Velvet & Gold Rim */}
        <motion.div
          className="my-3 mx-auto w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-gradient-to-br from-[#781D36] via-[#61162B] to-[#450C1B] border-2 border-[#DFB759] flex items-center justify-center shadow-[0_8px_24px_rgba(120,29,54,0.45),inset_0_2px_8px_rgba(255,255,255,0.2)] relative"
          animate={
            isOpening
              ? { scale: [1, 1.25, 0], opacity: [1, 1, 0] }
              : { scale: [1, 1.04, 1] }
          }
          transition={
            isOpening
              ? { duration: 0.5, ease: "easeInOut" }
              : { repeat: Infinity, duration: 3, ease: "easeInOut" }
          }
        >
          {/* Subtle Outer Glow Ring */}
          <div className="absolute -inset-1 rounded-full border border-[#DFB759]/40 animate-pulse pointer-events-none" />
          <span className="font-royal text-2xl sm:text-3xl font-bold tracking-wider text-[#FDEAB2] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            {data.couple.monogram || "A & D"}
          </span>
        </motion.div>

        {/* Eyebrow */}
        <p className="font-royal text-[10px] uppercase tracking-[0.3em] text-[#8C6418] font-semibold mt-2 mb-1">
          {data.hero?.eyebrow || "The Wedding Of"}
        </p>

        {/* Couple Names */}
        <h2 className="font-royal text-xl sm:text-2xl uppercase tracking-[0.14em] text-[#5C1222] font-bold my-1">
          {primaryCouple}
        </h2>

        {/* Wedding Date */}
        <p className="font-royal text-[11px] uppercase tracking-[0.24em] text-[#7A5314] font-medium mt-1 mb-4">
          ✦ {data.wedding.date} ✦
        </p>

        {/* Smooth 2-Second Auto-Opening Progress Bar (No button needed) */}
        <div className="w-full max-w-[200px] mx-auto pt-1">
          <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.2em] text-[#8C6418]/80 mb-1 font-medium">
            <span>Opening Invitation</span>
            <span className="text-[#C99A38]">✦</span>
          </div>
          <div className="h-[2px] w-full bg-[#D6AD63]/25 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#C99A38] to-[#DFB759] rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.9, ease: "easeInOut" }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default RoyalOpening;
