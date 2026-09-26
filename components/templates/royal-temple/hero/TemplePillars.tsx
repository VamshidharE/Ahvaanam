"use client";

import React from "react";
import Image from "next/image";

export default function TemplePillars() {
  return (
    <>
      {/* Left Carved Stone Pillar */}
      <div className="absolute left-0 top-0 bottom-0 z-10 w-[70px] sm:w-[110px] md:w-[140px] pointer-events-none">
        <Image
          src="/templates/royal-temple/architecture/pillar_left.png"
          alt="Left Temple Pillar"
          fill
          priority
          className="object-cover object-left-top opacity-95"
        />
      </div>

      {/* Right Carved Stone Pillar */}
      <div className="absolute right-0 top-0 bottom-0 z-10 w-[70px] sm:w-[110px] md:w-[140px] pointer-events-none">
        <Image
          src="/templates/royal-temple/architecture/pillar_right.png"
          alt="Right Temple Pillar"
          fill
          priority
          className="object-cover object-right-top opacity-95"
        />
      </div>
    </>
  );
}
