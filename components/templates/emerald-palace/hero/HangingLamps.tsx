"use client";

import React from "react";
import { RoyalDiyaLamp } from "../assets/Ornaments";

export function HangingLamps() {
  return (
    <div className="ep-hanging-lights" aria-hidden="true">
      {/* Left Hanging Lamp */}
      <div className="ep-hanging-light-item flex flex-col items-center">
        <div className="w-[1.5px] h-20 bg-gradient-to-b from-[#DFB759] to-[#9C7723]" />
        <div className="w-3 h-3 rounded-full border border-[#DFB759] bg-[#0C2B22] -mt-1 mb-1" />
        <RoyalDiyaLamp className="scale-75 origin-top" />
      </div>

      {/* Center Left Small Bell */}
      <div className="ep-hanging-light-item hidden sm:flex flex-col items-center">
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#DFB759] to-[#9C7723]" />
        <div className="w-2.5 h-2.5 rounded-full border border-[#DFB759] bg-[#0C2B22]" />
      </div>

      {/* Center Right Small Bell */}
      <div className="ep-hanging-light-item hidden sm:flex flex-col items-center">
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#DFB759] to-[#9C7723]" />
        <div className="w-2.5 h-2.5 rounded-full border border-[#DFB759] bg-[#0C2B22]" />
      </div>

      {/* Right Hanging Lamp */}
      <div className="ep-hanging-light-item flex flex-col items-center">
        <div className="w-[1.5px] h-20 bg-gradient-to-b from-[#DFB759] to-[#9C7723]" />
        <div className="w-3 h-3 rounded-full border border-[#DFB759] bg-[#0C2B22] -mt-1 mb-1" />
        <RoyalDiyaLamp className="scale-75 origin-top" />
      </div>
    </div>
  );
}
export default HangingLamps;
