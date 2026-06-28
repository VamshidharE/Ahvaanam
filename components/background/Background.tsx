"use client";

import Glow from "./Glow";
import LightRays from "./LightRays";
import Image from "next/image";

export default function Background() {
  return (
    <>
      {/* Base */}
      <div className="absolute inset-0 bg-[#120915]" />

      {/* Main Gradient */}
      <div
        className="
        absolute inset-0
        bg-[radial-gradient(circle_at_top,#6a3b16_0%,#3a1825_32%,#1b0d18_65%,#0d0810_100%)]
      "
      />

      {/* Golden Spotlight */}
      <div
        className="
        absolute
        left-1/2
        top-[18%]
        h-[900px]
        w-[900px]
        -translate-x-1/2
        rounded-full
        bg-yellow-500/10
        blur-[180px]
      "
      />


      {/* Side Vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/35" />

      {/* Mandala */}

      <Image
        src="/ornaments/mandala.png"
        alt=""
        fill
        priority
        className="
          object-contain
          opacity-[0.035]
          pointer-events-none
          select-none
        "
      />
      <Glow />

      <LightRays />
    </>
  );
}