"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface DemoOverlayBadgeProps {
  templateName: string;
  slug: string;
}

export default function DemoOverlayBadge({ templateName, slug }: DemoOverlayBadgeProps) {
  const [minimized, setMinimized] = useState(false);

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed top-4 left-4 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-amber-200/90 hover:text-amber-100 backdrop-blur-md border border-amber-400/25 shadow-lg text-[11px] font-sans font-medium transition-all duration-200 cursor-pointer"
        title="Show Demo Details"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        <span>Demo</span>
      </button>
    );
  }

  return (
    <aside 
      aria-label="Ahvaanam Live Demo Badge"
      className="fixed top-4 left-4 z-50 flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-amber-400/30 text-white shadow-xl select-none transition-all duration-200 animate-fadeIn font-sans"
    >
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#C49B27] animate-pulse shrink-0" />
        <span className="text-[10.5px] uppercase tracking-[1.5px] font-bold text-amber-300">
          Ahvaanam Demo
        </span>
        <span className="hidden sm:inline text-white/30 text-xs">|</span>
        <span className="hidden sm:inline text-[11px] text-white/80 font-serif italic truncate max-w-[140px]">
          {templateName}
        </span>
      </div>

      <button
        onClick={() => setMinimized(true)}
        className="text-white/40 hover:text-white/80 transition-colors p-0.5 ml-1 cursor-pointer"
        title="Minimize badge"
      >
        <X size={12} />
      </button>
    </aside>
  );
}
