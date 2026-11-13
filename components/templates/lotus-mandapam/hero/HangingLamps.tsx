"use client";

import React from "react";
import { HangingTempleBell } from "../assets/Ornaments";

export function HangingLamps() {
  return (
    <>
      {/* Left Hanging Brass Bells */}
      <div className="ep-hero-bell-left flex items-start gap-2 sm:gap-4 pointer-events-none">
        <HangingTempleBell size="md" className="origin-top" />
        <HangingTempleBell size="sm" className="hidden sm:block origin-top delay-300 -mt-3" />
      </div>

      {/* Right Hanging Brass Bells */}
      <div className="ep-hero-bell-right flex items-start gap-2 sm:gap-4 pointer-events-none">
        <HangingTempleBell size="sm" className="hidden sm:block origin-top delay-150 -mt-3" />
        <HangingTempleBell size="md" className="origin-top delay-500" />
      </div>
    </>
  );
}
export default HangingLamps;
