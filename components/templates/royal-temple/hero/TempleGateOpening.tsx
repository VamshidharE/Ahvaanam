"use client";

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";

interface TempleGateOpeningProps {
  isOpen: boolean;
  onOpen: () => void;
  mantra?: string;
  groomName: string;
  brideName: string;
  weddingDate: string;
}

export default function TempleGateOpening({
  isOpen,
  onOpen,
  mantra = "|| SHREE GANESHAYA NAMAH ||",
  groomName,
  brideName,
  weddingDate,
}: TempleGateOpeningProps) {
  const shouldReduceMotion = useReducedMotion();

  if (isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="temple-doors-overlay"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.3 : 1.2, ease: [0.77, 0, 0.175, 1] }}
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#2b080c] select-none"
      >
        {/* Left Temple Gate Door */}
        <motion.div
          initial={{ x: "0%" }}
          exit={{ x: "-105%", opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.3 : 1.4, ease: [0.77, 0, 0.175, 1] }}
          className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-[#1c0407] via-[#3d0b11] to-[#541018] border-r-2 border-[#C59B27]/40 shadow-2xl flex items-center justify-end pr-4 sm:pr-8"
        >
          {/* Ornate Door Carving Texture */}
          <div className="absolute inset-4 border border-[#C59B27]/25 rounded-l-2xl pointer-events-none" />
          <div className="text-[#C59B27]/30 text-5xl sm:text-7xl font-serif">❧</div>
        </motion.div>

        {/* Right Temple Gate Door */}
        <motion.div
          initial={{ x: "0%" }}
          exit={{ x: "105%", opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.3 : 1.4, ease: [0.77, 0, 0.175, 1] }}
          className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#1c0407] via-[#3d0b11] to-[#541018] border-l-2 border-[#C59B27]/40 shadow-2xl flex items-center justify-start pl-4 sm:pr-8"
        >
          {/* Ornate Door Carving Texture */}
          <div className="absolute inset-4 border border-[#C59B27]/25 rounded-r-2xl pointer-events-none" />
          <div className="text-[#C59B27]/30 text-5xl sm:text-7xl font-serif">☙</div>
        </motion.div>

        {/* Center Sacred Medallion / Seal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-30 flex flex-col items-center justify-center p-6 sm:p-8 rounded-full bg-gradient-to-b from-[#4a0d12] via-[#2d070a] to-[#1a0305] border-2 border-[#C59B27] shadow-[0_0_50px_rgba(197,155,39,0.4)] w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] text-center"
        >
          {/* Sacred Symbol */}
          <div className="text-3xl text-[#C59B27] mb-1">ॐ</div>

          {/* Mantra */}
          <p className="text-[9px] uppercase tracking-[2.5px] text-[#C59B27] font-semibold mb-2">
            {mantra}
          </p>

          <div className="w-12 h-[1px] bg-[#C59B27]/40 my-1" />

          {/* Couple Names */}
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-[#FFF8EB] my-1 font-serif">
            {groomName} <br />
            <span className="text-xs text-[#C59B27]">&</span> <br />
            {brideName}
          </h2>

          <p className="text-[8px] uppercase tracking-[1.5px] text-[#C59B27]/80 font-medium mb-3">
            {weddingDate}
          </p>

          {/* Action Button */}
          <button
            onClick={onOpen}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-[#C59B27] via-[#E8C15A] to-[#C59B27] text-[#3A080A] text-[9px] font-extrabold uppercase tracking-[2px] shadow-lg hover:scale-105 transition-transform cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles size={11} /> Open Invitation
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
