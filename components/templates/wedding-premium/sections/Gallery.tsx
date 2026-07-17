"use client";

import React, { useState } from "react";
import { GoldDivider } from "../decorations";

interface GalleryProps {
  data: {
    title?: string;
    images?: string[];
  };
}

export default function Gallery({ data }: GalleryProps) {
  const titleVal = data?.title || "Pre-Wedding Moments";
  const imagesVal = data?.images || [];

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (imagesVal.length === 0) return null;

  return (
    <div className="py-8 text-center space-y-6 select-none">
      <h2 className="text-xl font-bold uppercase tracking-[2.5px] text-[#E6A817] font-serif">{titleVal}</h2>
      <GoldDivider />

      <div className="grid grid-cols-2 gap-3 pt-2">
        {imagesVal.map((imgUrl, idx) => (
          <div 
            key={idx} 
            onClick={() => setSelectedImage(imgUrl)}
            className="w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md border border-[#E6A817]/10 relative group cursor-pointer"
          >
            <img 
              src={imgUrl} 
              alt={`Gallery Image ${idx + 1}`} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            {/* Hover overlay filter */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span className="text-white text-[8px] uppercase tracking-[2px] font-bold px-3 py-1 bg-black/40 rounded-full border border-white/10">View</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox view Modal overlay */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-sm w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <img 
              src={selectedImage} 
              alt="Enlarged gallery view" 
              className="w-full h-full object-cover"
            />
            {/* Close instruction caption */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-black/50 text-white text-[7px] uppercase tracking-[1.5px] rounded-full border border-white/5 font-semibold">
              Click anywhere to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
