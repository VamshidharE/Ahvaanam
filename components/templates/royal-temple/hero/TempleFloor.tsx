"use client";

import React from "react";
import Image from "next/image";

export default function TempleFloor() {
  return (
    <div className="absolute bottom-0 inset-x-0 z-15 pointer-events-none w-full flex justify-center">
      {/* Foreground Floor with Urlis & Petals */}
      <div className="relative w-full max-w-[760px] h-[100px] sm:h-[140px] md:h-[180px]">
        <Image
          src="/templates/royal-temple/architecture/floor_urlis.png"
          alt="Temple Courtyard Floor with Brass Urlis and Rose Petals"
          fill
          className="object-cover object-bottom"
        />
        {/* Subtle Candle Flame Glow on Floor Urlis */}
        <div className="absolute bottom-[20%] left-[8%] w-3 h-3 rounded-full bg-amber-400/90 blur-[4px] rt-flame-animate" />
        <div className="absolute bottom-[20%] right-[8%] w-3 h-3 rounded-full bg-amber-400/90 blur-[4px] rt-flame-animate" style={{ animationDelay: "0.6s" }} />
      </div>
    </div>
  );
}
