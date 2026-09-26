"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function TempleArch() {
  return (
    <div className="absolute top-0 inset-x-0 z-20 pointer-events-none w-full flex justify-center">
      {/* Top Arch Image Layer */}
      <div className="relative w-full max-w-[760px] h-[130px] sm:h-[170px] md:h-[210px]">
        <Image
          src="/templates/royal-temple/architecture/temple_arch.png"
          alt="Temple Arch with Garlands and Bells"
          fill
          priority
          className="object-contain object-top drop-shadow-md"
        />

        {/* Dynamic Hanging Central Bell with Sway Animation */}
        <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-8 h-10 sm:w-10 sm:h-12 rt-bell-animate">
          <Image
            src="/templates/royal-temple/decorations/temple_bell.png"
            alt="Temple Bell"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
