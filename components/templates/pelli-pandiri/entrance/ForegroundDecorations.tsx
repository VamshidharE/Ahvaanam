"use client";

import React from "react";
import Image from "next/image";
import { motion, MotionValue } from "framer-motion";
import { PelliPandiriData } from "../adapter";

interface ForegroundDecorationsProps {
  cloudOpacity: MotionValue<number>;
  cloudY: MotionValue<number>;
  data: PelliPandiriData;
}

export const ForegroundDecorations: React.FC<ForegroundDecorationsProps> = ({
  cloudOpacity,
  cloudY,
  data,
}) => {
  return (
    <>
      <motion.div
        style={{
          opacity: cloudOpacity,
          y: cloudY,
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 30%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 30%, black 100%)",
        }}
        className="absolute bottom-0 inset-x-0 h-[85px] sm:h-[105px] md:h-[125px] z-28 pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <Image
          src={data.assets.sectionCloud}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-bottom filter brightness-[1.03] contrast-[1.02]"
          unoptimized
          priority
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(235,145,45,0.2) 0%, rgba(248,190,70,0.08) 50%, transparent 100%)",
          }}
        />
      </motion.div>
    </>
  );
};
