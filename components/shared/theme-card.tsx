"use client";

import React from "react";
import { motion } from "framer-motion";
import { Theme } from "../../types/theme";

interface ThemeCardProps {
  theme: Theme;
  selected: boolean;
  onSelect: () => void;
}

export default function ThemeCard({ theme, selected, onSelect }: ThemeCardProps) {
  return (
    <motion.div
      onClick={onSelect}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`relative rounded-2xl overflow-hidden cursor-pointer border bg-white shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group select-none ${
        selected
          ? "border-[#C49B27] ring-1 ring-[#C49B27]"
          : "border-zinc-200/80 hover:border-[#C49B27]/40"
      }`}
    >
      {/* Theme Cover Image Preview */}
      <div className="relative w-full h-[140px] bg-[#FAF9F6] overflow-hidden border-b border-zinc-100 shrink-0 p-1.5 flex items-center justify-center">
        <img 
          src={theme.coverImage} 
          alt={theme.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 rounded-lg shadow-xs"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/[0.02] via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Theme Content Details */}
      <div className="p-4 flex flex-col gap-1.5 relative text-left bg-white flex-1">
        {/* Dynamic Selected Badge */}
        {selected && (
          <span className="absolute -top-3.5 right-3 bg-[#C49B27] text-white px-2.5 py-0.5 rounded-full text-[8px] uppercase tracking-[1px] font-bold shadow-md">
            Selected
          </span>
        )}

        {/* Title */}
        <h3 className={`text-xs font-bold uppercase tracking-[0.5px] transition-colors duration-300 ${
          selected ? "text-[#C49B27]" : "text-[#241E1C] group-hover:text-[#C49B27]"
        }`}>
          {theme.name}
        </h3>

        {/* Description */}
        <p className="text-[10px] text-[#241E1C]/50 leading-relaxed line-clamp-2 font-semibold">
          {theme.description}
        </p>
      </div>
    </motion.div>
  );
}
