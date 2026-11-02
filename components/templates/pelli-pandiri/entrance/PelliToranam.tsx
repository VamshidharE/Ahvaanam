"use client";

import React from "react";
import Image from "next/image";
import { motion, MotionValue, useTransform } from "framer-motion";
import { PelliPandiriData } from "../adapter";

interface PelliToranamProps {
  progress: MotionValue<number>;
  isMobile: boolean;
  shouldReduceMotion?: boolean | null;
  data: PelliPandiriData;
}

export const PelliToranam: React.FC<PelliToranamProps> = ({
  progress,
  isMobile,
  shouldReduceMotion = false,
  data,
}) => {
  const { assets } = data;
  const liftPx = isMobile ? 30 : 45;

  const toranamY = useTransform(
    progress,
    [0, 0.08, 0.85, 1],
    [0, 0, shouldReduceMotion ? 0 : -liftPx, shouldReduceMotion ? 0 : -liftPx]
  );

  return (
    <motion.div
      style={{
        y: toranamY,
        top: "16.5%",
        width: "64%",
      }}
      className="absolute left-1/2 -translate-x-1/2 z-24 pointer-events-none select-none flex justify-center origin-top will-change-transform"
    >
      <div className="relative w-full aspect-[1376/768] drop-shadow-[0_8px_20px_rgba(0,0,0,0.55)]">
        <Image
          src={assets.pelliToranam}
          alt="Traditional Telugu Wedding Pelli Toranam Garland"
          fill
          sizes="(max-width: 768px) 80vw, 480px"
          className="object-contain object-top filter brightness-[1.02] contrast-[1.04]"
          unoptimized
          priority
        />

        {assets.toranamCenterPendant && (
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    rotate: [-1.8, 1.8],
                  }
            }
            transition={{
              duration: 4.0,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "top center" }}
            className="absolute left-[45.5%] top-[25%] w-[9%] aspect-[120/323] pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]"
          >
            <Image
              src={assets.toranamCenterPendant}
              alt=""
              fill
              className="object-contain object-top"
              unoptimized
            />
          </motion.div>
        )}

        {assets.toranamStringLeft && (
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    rotate: [-1.98, 1.62],
                  }
            }
            transition={{
              duration: 4.4,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
              delay: 0.3,
            }}
            style={{ transformOrigin: "top center" }}
            className="absolute left-[29.5%] top-[28%] w-[6.5%] aspect-[90/280] pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]"
          >
            <Image
              src={assets.toranamStringLeft}
              alt=""
              fill
              className="object-contain object-top"
              unoptimized
            />
          </motion.div>
        )}

        {assets.toranamStringRight && (
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    rotate: [-1.62, 1.98],
                  }
            }
            transition={{
              duration: 4.2,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
              delay: 0.5,
            }}
            style={{ transformOrigin: "top center" }}
            className="absolute right-[29.5%] top-[28%] w-[6.5%] aspect-[90/280] pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]"
          >
            <Image
              src={assets.toranamStringRight}
              alt=""
              fill
              className="object-contain object-top"
              unoptimized
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
