"use client";

import React from "react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { Category } from "../../types/category";

interface CategoryCardProps {
  category: Category;
  selected: boolean;
  onSelect: () => void;
  templateCount?: number;
}

export default function CategoryCard({ category, selected, onSelect, templateCount }: CategoryCardProps) {
  // Resolve Lucide Icon dynamically
  const IconComponent = (LucideIcons as any)[category.icon] || LucideIcons.HelpCircle;

  return (
    <motion.div
      onClick={onSelect}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`relative h-[160px] rounded-2xl overflow-hidden cursor-pointer border backdrop-blur-md transition-all duration-300 flex flex-col justify-end p-5 group select-none ${
        selected
          ? "border-[#C49B27] shadow-[0_8px_25px_rgba(196,155,39,0.06)] bg-[#C49B27]/5"
          : "border-zinc-200/80 hover:border-[#C49B27]/40 bg-white"
      }`}
    >
      {/* Decorative Gradient Glow Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-300 pointer-events-none`} />
      
      {/* Template Count Badge */}
      {templateCount !== undefined && (
        <span className="absolute top-4 right-4 bg-zinc-100 group-hover:bg-[#C49B27]/10 text-zinc-500 group-hover:text-[#C49B27] px-2.5 py-0.5 rounded-full text-[8px] uppercase tracking-[1px] font-bold transition-all">
          {templateCount} {templateCount === 1 ? "Theme" : "Themes"}
        </span>
      )}
      
      {/* Card Content Layout */}
      <div className="z-10 flex flex-col gap-2 relative text-left">
        {/* Floating Icon Circle */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 ${
          selected
            ? "bg-[#C49B27]/10 border-[#C49B27]/30 text-[#C49B27]"
            : "bg-[#FAF9F6] border-zinc-200 text-[#241E1C]/60 group-hover:text-[#C49B27] group-hover:bg-[#C49B27]/5"
        }`}>
          <IconComponent size={18} className={selected ? "animate-pulse" : ""} />
        </div>

        {/* Title */}
        <h3 className={`text-sm font-bold tracking-[0.5px] transition-colors duration-300 ${
          selected ? "text-[#C49B27]" : "text-[#241E1C] group-hover:text-[#C49B27]"
        }`}>
          {category.name}
        </h3>

        {/* Description */}
        <p className="text-[10px] text-[#241E1C]/50 leading-relaxed line-clamp-2 group-hover:text-[#241E1C]/75 transition-colors font-semibold">
          {category.description}
        </p>
      </div>
    </motion.div>
  );
}
