"use client";

import React from "react";
import { GoldDivider } from "../decorations";

interface StoryEntry {
  title?: string;
  date?: string;
  description?: string;
  image?: string;
}

interface StoryProps {
  data: {
    title?: string;
    entries?: StoryEntry[];
  };
}

export default function Story({ data }: StoryProps) {
  const titleVal = data?.title || "Our Love Story";
  const entriesVal = data?.entries || [];

  if (entriesVal.length === 0) return null;

  return (
    <div className="py-8 text-center space-y-6 select-none">
      <h2 className="text-xl font-bold uppercase tracking-[2.5px] text-[#E6A817] font-serif">{titleVal}</h2>
      <GoldDivider />

      <div className="relative pl-6 text-left border-l-2 border-[#E6A817]/25 space-y-8 ml-3 pr-2">
        {entriesVal.map((entry, idx) => (
          <div key={idx} className="relative space-y-3">
            {/* Timeline Circle Bullet Node */}
            <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#E6A817] border-2 border-[#3A080A] shadow-md flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>

            <div className="space-y-1">
              <span className="text-[7.5px] text-[#E6A817] uppercase tracking-[2px] font-bold">
                {entry.date}
              </span>
              <h3 className="text-base font-bold tracking-[0.5px] text-[#FFF7E6] font-serif">
                {entry.title}
              </h3>
            </div>

            {entry.image && (
              <div className="w-full aspect-[16/10] rounded-xl overflow-hidden shadow-md border border-[#E6A817]/10 relative group">
                <img 
                  src={entry.image} 
                  alt={entry.title || "Story moment"} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            )}

            <p className="text-[#FFF7E6]/70 text-[9px] leading-relaxed font-sans pb-2">
              {entry.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
