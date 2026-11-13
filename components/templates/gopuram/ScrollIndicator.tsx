"use client";

import React from "react";
import { motion, MotionValue } from "framer-motion";

interface ScrollIndicatorProps {
  opacity: MotionValue<number>;
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ opacity }) => {
  return (
    <motion.div
      style={{ opacity }}
      className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none select-none text-center"
    >
      <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#edd99e] font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
        Scroll To Experience
      </span>

      <div className="w-5 h-8 rounded-full border border-[#edd99e]/60 flex items-start justify-center p-1 backdrop-blur-sm bg-black/20 shadow-lg">
        <motion.div
          animate={{
            y: [0, 10, 0],
            opacity: [1, 0.4, 1],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-1.5 h-1.5 rounded-full bg-[#f3e1a8] shadow-[0_0_8px_#eed68a]"
        />
      </div>
    </motion.div>
  );
};
