"use client";

import React from "react";
import Image from "next/image";

/**
 * TopDecorationBar
 *
 * Implements the auspicious top corner hanging decoration (mango leaves,
 * flower malas, and hanging golden diyas).
 * Fixed to the top of the viewport (does not scroll).
 */
export const TopDecorationBar: React.FC = () => {
  return (
    <aside
      aria-hidden="true"
      className="absolute top-0 inset-x-0 flex justify-between pointer-events-none select-none z-35"
    >
      {/* Top-Left Hanging Toranam & Diya */}
      <div className="relative w-[85px] sm:w-[110px] md:w-[145px] lg:w-[170px] xl:w-[190px] aspect-[607/873] shrink-0">
        <Image
          src="/templates/gopuram/decoration/top-decoration-left.png"
          alt=""
          fill
          sizes="(max-width: 768px) 110px, 190px"
          className="object-contain object-left-top filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]"
          priority
          unoptimized
        />
      </div>

      {/* Top-Right Hanging Toranam & Diya */}
      <div className="relative w-[85px] sm:w-[110px] md:w-[145px] lg:w-[170px] xl:w-[190px] aspect-[607/873] shrink-0">
        <Image
          src="/templates/gopuram/decoration/top-decoration-right.png"
          alt=""
          fill
          sizes="(max-width: 768px) 110px, 190px"
          className="object-contain object-right-top filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]"
          priority
          unoptimized
        />
      </div>
    </aside>
  );
};
