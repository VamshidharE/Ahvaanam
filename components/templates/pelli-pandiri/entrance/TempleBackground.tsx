"use client";

import React from "react";
import Image from "next/image";
import { motion, MotionValue } from "framer-motion";
import { FallingPetals } from "./FallingPetals";
import { PelliPandiriData } from "../adapter";

interface TempleBackgroundProps {
  skyY: MotionValue<number>;
  isMobile: boolean;
  data: PelliPandiriData;
}

export const TempleBackground: React.FC<TempleBackgroundProps> = ({ skyY, isMobile, data }) => {
  return (
    <motion.div
      style={{ y: skyY }}
      className={`absolute inset-x-0 top-0 w-full z-10 pointer-events-none select-none will-change-transform ${
        isMobile ? "h-[220vh]" : "aspect-[940/1672]"
      }`}
    >
      <Image
        src={data.assets.skyBackground}
        alt="Sacred South Indian Golden-Hour Sunset Sky and Landscape"
        fill
        sizes="100vw"
        className="object-cover object-top"
        unoptimized
        priority
      />

      {/* Atmospheric depth vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-amber-950/20 via-transparent to-black/15 opacity-40 pointer-events-none" />

      {/* Subtle divine sunbeam radiance glow (Pre-blurred smooth radial gradient; 0ms GPU blur computation) */}
      <div
        className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,225,140,0.45) 0%, rgba(245,190,80,0.22) 30%, rgba(230,165,55,0.08) 55%, transparent 72%)",
        }}
      />

      {/* Falling Petals in Hero Scene (Adaptive petal count on mobile) */}
      <FallingPetals isMobile={isMobile} />
    </motion.div>
  );
};
