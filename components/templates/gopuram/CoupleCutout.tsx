"use client";

import React from "react";
import Image from "next/image";
import { motion, MotionValue, useTransform } from "framer-motion";
import { useGopuram } from "./context";

interface CoupleCutoutProps {
  progress: MotionValue<number>;
  isMobile: boolean;
}

export const CoupleCutout: React.FC<CoupleCutoutProps> = ({
  progress,
  isMobile,
}) => {
  const { data } = useGopuram();
  const { assets, animation } = data;
  const { coupleRevealStart, coupleRevealComplete } = animation;

  const startYPercent = isMobile ? "27%" : "17%";

  const coupleY = useTransform(
    progress,
    [0, coupleRevealStart, coupleRevealComplete, 1],
    [startYPercent, startYPercent, "0%", "0%"]
  );

  const coupleVisibility = useTransform(progress, (p) =>
    p < coupleRevealStart ? 0 : 1
  );

  // Divine Golden Aura behind the couple
  const auraOpacity = useTransform(
    progress,
    [coupleRevealStart, coupleRevealComplete],
    [0, 0.45]
  );

  return (
    <div className="absolute inset-x-0 bottom-0 aspect-[2/3] w-full z-25 pointer-events-none select-none">
      {/* Divine Golden Aura behind couple */}
      <motion.div
        style={{
          opacity: auraOpacity,
          background:
            "radial-gradient(circle, rgba(245,200,100,0.55) 0%, rgba(210,150,50,0.2) 50%, transparent 75%)",
        }}
        className="absolute inset-x-4 bottom-0 top-[15%] rounded-full pointer-events-none blur-3xl"
      />

      {/* Reveal Container */}
      <div
        className="relative w-full h-full overflow-hidden"
        style={{ clipPath: "inset(0 0 0 0)" }}
      >
        <motion.div
          style={{
            y: coupleY,
            opacity: coupleVisibility,
          }}
          className="relative w-full h-full will-change-transform drop-shadow-[0_15px_40px_rgba(0,0,0,0.85)]"
        >
          <Image
            src={assets.coupleCutout}
            alt={assets.coupleCutoutAlt}
            fill
            className="object-contain object-bottom"
            unoptimized
            priority
          />
        </motion.div>
      </div>
    </div>
  );
};
