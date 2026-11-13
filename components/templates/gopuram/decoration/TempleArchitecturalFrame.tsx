"use client";

import React from "react";
import Image from "next/image";

/**
 * TempleArchitecturalFrame
 *
 * Implements a continuous, stationary South Indian temple architectural frame:
 * 1. Left Pillar:
 *    - Top Capital (left-pillar-capital.png)
 *    - Repeating Shaft (pillar-segment-shaft.png) seamlessly tiled with background-repeat: repeat-y
 *    - Bottom Pedestal (left-pillar-base.png)
 * 2. Right Pillar:
 *    - Top Capital (right-pillar-capital.png)
 *    - Repeating Shaft (pillar-segment-shaft-r.png) seamlessly tiled with background-repeat: repeat-y
 *    - Bottom Pedestal (right-pillar-base.png)
 * 3. Top Corner Hanging Decoration:
 *    - Left: Mango leaves, flower malas, hanging diya (top-decoration-left.png)
 *    - Right: Symmetrical counterpart (top-decoration-right.png)
 */
export const TempleArchitecturalFrame: React.FC = () => {
  return (
    <aside
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none z-35 overflow-hidden"
    >
      {/* 1. LEFT SIDE TEMPLE PILLAR */}
      <div className="absolute top-0 bottom-0 left-0 w-[18px] sm:w-[26px] md:w-[110px] lg:w-[136px] xl:w-[150px] flex flex-col items-start z-35">
        <div className="relative w-full aspect-[168/153] shrink-0">
          <Image
            src="/templates/gopuram/decoration/left-pillar-capital.png"
            alt=""
            fill
            sizes="(max-width: 768px) 26px, 150px"
            className="object-contain object-left-top"
            priority
            unoptimized
          />
        </div>

        <div
          className="relative w-[62.5%] flex-1 shrink-0"
          style={{
            backgroundImage: "url('/templates/gopuram/decoration/pillar-segment-shaft.png')",
            backgroundRepeat: "repeat-y",
            backgroundSize: "100% auto",
            backgroundPosition: "top left",
          }}
        />

        <div className="relative w-full aspect-[168/121] shrink-0">
          <Image
            src="/templates/gopuram/decoration/left-pillar-base.png"
            alt=""
            fill
            sizes="(max-width: 768px) 26px, 150px"
            className="object-contain object-left-bottom"
            priority
            unoptimized
          />
        </div>
      </div>

      {/* 2. RIGHT SIDE TEMPLE PILLAR */}
      <div className="absolute top-0 bottom-0 right-0 w-[18px] sm:w-[26px] md:w-[110px] lg:w-[136px] xl:w-[150px] flex flex-col items-end z-35">
        <div className="relative w-full aspect-[168/153] shrink-0">
          <Image
            src="/templates/gopuram/decoration/right-pillar-capital.png"
            alt=""
            fill
            sizes="(max-width: 768px) 26px, 150px"
            className="object-contain object-right-top"
            priority
            unoptimized
          />
        </div>

        <div
          className="relative w-[62.5%] flex-1 shrink-0"
          style={{
            backgroundImage: "url('/templates/gopuram/decoration/pillar-segment-shaft-r.png')",
            backgroundRepeat: "repeat-y",
            backgroundSize: "100% auto",
            backgroundPosition: "top right",
          }}
        />

        <div className="relative w-full aspect-[168/121] shrink-0">
          <Image
            src="/templates/gopuram/decoration/right-pillar-base.png"
            alt=""
            fill
            sizes="(max-width: 768px) 26px, 150px"
            className="object-contain object-right-bottom"
            priority
            unoptimized
          />
        </div>
      </div>
    </aside>
  );
};
