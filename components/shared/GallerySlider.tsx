"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Grid } from "lucide-react";

interface GallerySliderProps {
  images: string[];
  themeColor: string;
  borderColor: string;
  bgColor: string;
  onImageClick: (index: number) => void;
}

export default function GallerySlider({
  images,
  themeColor,
  borderColor,
  bgColor,
  onImageClick,
}: GallerySliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 5);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      // Run once layout settles
      setTimeout(checkScroll, 100);
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [images]);

  const scrollBy = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full group/slider select-none">
      {/* Scroll controls (hidden on small touch devices, shown on hover on desktop) */}
      {canScrollLeft && (
        <button
          onClick={() => scrollBy(-280)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white/90 shadow-md border border-zinc-200/50 hover:bg-white text-zinc-800 transition-all hover:scale-105 active:scale-95 animate-fadeIn"
          style={{ color: themeColor }}
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={() => scrollBy(280)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white/90 shadow-md border border-zinc-200/50 hover:bg-white text-zinc-800 transition-all hover:scale-105 active:scale-95 animate-fadeIn"
          style={{ color: themeColor }}
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Horizontal Snap Scroll list */}
      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-6 pt-2 scrollbar-none scroll-smooth w-full px-1"
      >
        {images.map((image, idx) => (
          <motion.div
            key={idx}
            onClick={() => onImageClick(idx)}
            whileHover={{ scale: 1.02 }}
            className={`snap-center shrink-0 w-[240px] sm:w-[260px] md:w-[285px] cursor-pointer overflow-hidden rounded-2xl border ${borderColor} ${bgColor} p-2 relative shadow-lg group`}
          >
            <div className="overflow-hidden rounded-xl aspect-[3/4] relative">
              <Image
                src={image}
                alt={`Moments ${idx + 1}`}
                fill
                sizes="(max-w-768px) 240px, 300px"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
              <Grid style={{ color: themeColor }} size={26} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
