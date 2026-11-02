"use client";

import React from "react";
import Image from "next/image";
import { motion, MotionValue, useReducedMotion } from "framer-motion";
import { FallingPetals } from "./FallingPetals";
import { PelliPandiriData } from "../adapter";

interface TempleBackgroundProps {
  skyY: MotionValue<number>;
  isMobile: boolean;
  data: PelliPandiriData;
}

export const TempleBackground: React.FC<TempleBackgroundProps> = ({ skyY, isMobile, data }) => {
  const shouldReduceMotion = useReducedMotion();

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
        className="object-cover object-top filter brightness-[1.0] contrast-[1.02]"
        unoptimized
        priority
      />

      {/* Atmospheric depth vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-amber-950/20 via-transparent to-black/15 opacity-40" />

      {/* Subtle divine sunbeam radiance glow */}
      <div
        className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full opacity-40 blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,225,140,0.55) 0%, rgba(230,165,55,0.2) 45%, transparent 70%)",
        }}
      />

      {/* Falling Petals in Hero Scene */}
      <FallingPetals />

      {/* Top-Left Corner Foliage */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                rotate: [-0.9, 0.9, -0.9],
                y: [0, 2.5, 0],
              }
        }
        transition={{
          duration: 6.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "top left" }}
        className="absolute -top-1.5 -left-1.5 z-20 w-[150px] sm:w-[200px] md:w-[260px] lg:w-[320px] xl:w-[370px] aspect-[520/724] pointer-events-none select-none"
      >
        <Image
          src={data.assets.cornerLeavesLeft}
          alt=""
          fill
          sizes="(max-width: 768px) 200px, 370px"
          className="object-contain object-left-top drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
          priority
          unoptimized
        />
      </motion.div>

      {/* Top-Right Corner Foliage */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                rotate: [0.9, -0.9, 0.9],
                y: [0, 2.5, 0],
              }
        }
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "top right" }}
        className="absolute -top-1.5 -right-1.5 z-20 w-[150px] sm:w-[200px] md:w-[260px] lg:w-[320px] xl:w-[370px] aspect-[520/724] pointer-events-none select-none"
      >
        <Image
          src={data.assets.cornerLeavesRight}
          alt=""
          fill
          sizes="(max-width: 768px) 200px, 370px"
          className="object-contain object-right-top drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
          priority
          unoptimized
        />
      </motion.div>
    </motion.div>
  );
};
