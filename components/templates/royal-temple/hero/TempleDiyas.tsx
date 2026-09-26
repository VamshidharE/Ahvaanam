"use client";

import React from "react";
import Image from "next/image";

export default function TempleDiyas() {
  return (
    <>
      {/* Left Standing Brass Samayi Diya */}
      <div className="absolute left-[3%] sm:left-[6%] bottom-[12%] sm:bottom-[10%] z-20 w-[45px] h-[90px] sm:w-[60px] sm:h-[120px] pointer-events-none">
        <Image
          src="/templates/royal-temple/decorations/diya_left.png"
          alt="Brass Diya Lamp"
          fill
          className="object-contain"
        />
        {/* Animated Flame Light Aura */}
        <div className="absolute top-[4%] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-400/80 blur-[6px] rt-flame-animate pointer-events-none" />
      </div>

      {/* Right Standing Brass Samayi Diya */}
      <div className="absolute right-[3%] sm:right-[6%] bottom-[12%] sm:bottom-[10%] z-20 w-[45px] h-[90px] sm:w-[60px] sm:h-[120px] pointer-events-none">
        <Image
          src="/templates/royal-temple/decorations/diya_right.png"
          alt="Brass Diya Lamp"
          fill
          className="object-contain"
        />
        {/* Animated Flame Light Aura */}
        <div className="absolute top-[4%] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-400/80 blur-[6px] rt-flame-animate pointer-events-none" />
      </div>
    </>
  );
}
