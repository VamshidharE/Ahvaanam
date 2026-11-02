"use client";

import React from "react";
import Image from "next/image";
import { PelliPandiriData } from "../adapter";

interface TempleArchProps {
  isMobile: boolean;
  data: PelliPandiriData;
}

export const TempleArch: React.FC<TempleArchProps> = ({ data }) => {
  const { assets } = data;

  return (
    <div className="absolute inset-0 w-full h-full z-23 pointer-events-none select-none drop-shadow-[0_25px_60px_rgba(0,0,0,0.65)]">
      <Image
        src={assets.pelliPandiri}
        alt="Traditional South Indian Dravidian Temple Entrance Gateway Arch"
        fill
        sizes="(max-width: 768px) 94vw, 740px"
        className="object-contain object-top filter brightness-[1.01] contrast-[1.03]"
        unoptimized
        priority
      />
    </div>
  );
};
