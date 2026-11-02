"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { PelliPandiriData, PelliPandiriPhoto } from "../adapter";

/* ═══════════════════════════════════════════════════ LIGHTBOX FULL-SCREEN VIEWER ═══════════════════════════════════════════════════ */
interface LightboxProps {
  photos: PelliPandiriPhoto[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const Lightbox: React.FC<LightboxProps> = ({ photos, currentIndex, onClose, onNavigate }) => {
  const currentPhoto = photos[currentIndex];

  const handlePrev = useCallback(() => {
    onNavigate((currentIndex - 1 + photos.length) % photos.length);
  }, [currentIndex, photos.length, onNavigate]);

  const handleNext = useCallback(() => {
    onNavigate((currentIndex + 1) % photos.length);
  }, [currentIndex, photos.length, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, handlePrev, handleNext]);

  if (!currentPhoto) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-md p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Top Bar: Counter & Close Button */}
      <div
        className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between text-[#f7e7c4] z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-cinzel text-xs sm:text-sm font-semibold tracking-widest text-[#d4af37]">
          {currentIndex + 1} / {photos.length}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close full-screen gallery"
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#f7e7c4] transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Image Container */}
      <div
        className="relative max-w-4xl max-h-[80vh] w-full aspect-[4/5] sm:aspect-[4/3] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhoto.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-[#b88636]/80 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
          >
            <Image
              src={currentPhoto.src}
              alt={currentPhoto.alt}
              fill
              sizes="(max-width: 1024px) 90vw, 896px"
              className="object-contain"
              priority
              unoptimized
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Caption */}
      <div
        className="absolute bottom-6 inset-x-4 text-center pointer-events-none"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-cormorant text-base sm:text-lg italic text-[#f7e7c4] drop-shadow-md">
          {currentPhoto.alt}
        </p>
      </div>

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
        aria-label="Previous photograph"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-[#f7e7c4] border border-[#b88636]/50 transition-all cursor-pointer z-10"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        aria-label="Next photograph"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-[#f7e7c4] border border-[#b88636]/50 transition-all cursor-pointer z-10"
      >
        <ChevronRight size={24} />
      </button>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════ MAIN GALLERY COMPONENT ═══════════════════════════════════════════════════ */
export const OurJourneyGallery: React.FC<{ data: PelliPandiriData }> = ({ data }) => {
  const { gallery } = data;
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });
  const shouldReduceMotion = useReducedMotion();

  const defaultPhotos: PelliPandiriPhoto[] = [
    { id: "g1", src: "/templates/pelli-pandiri/gallery/photo-1.jpg", alt: "Together at the temple" },
    { id: "g2", src: "/templates/pelli-pandiri/gallery/photo-2.jpg", alt: "First meeting" },
    { id: "g3", src: "/templates/pelli-pandiri/gallery/photo-3.jpg", alt: "Sunset walk" },
    { id: "g4", src: "/templates/pelli-pandiri/gallery/photo-4.jpg", alt: "Festival celebration" },
    { id: "g5", src: "/templates/pelli-pandiri/gallery/photo-5.jpg", alt: "Garden moment" },
  ];

  const photos = gallery.photos && gallery.photos.length > 0 ? gallery.photos : defaultPhotos;
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Desktop: Auto-switch focus photograph every 4.5 seconds
  useEffect(() => {
    if (photos.length === 0) return;
    const timer = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % photos.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [photos.length]);

  const featuredPhoto = photos[featuredIndex] || photos[0];
  const supportingPhotos = photos.map((p, idx) => ({ ...p, originalIndex: idx }));

  // Mobile: Seamless looped photos array
  const loopedPhotos = [...photos, ...photos];

  const openLightbox = (index: number) => {
    setLightboxIndex(index % photos.length);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  return (
    <section
      ref={sectionRef}
      id="photo-gallery"
      aria-label="Moments We Treasure"
      className="relative w-full overflow-hidden py-10 sm:py-16 md:py-24 bg-transparent"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* 
          1. FLOATING SECTION HEADING (Identical to D:\invite-2)
          "MOMENTS WE TREASURE"
          "Every picture tells a part of our story."
        */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 px-4 relative z-30 flex flex-col items-center"
        >
          {/* Subtle gold crest */}
          <div className="flex items-center justify-center gap-2 mb-2 select-none">
            <span className="w-8 sm:w-14 h-px bg-gradient-to-r from-transparent to-[#b88636]" />
            <span className="text-[#b88636] text-xs">✦</span>
            <span className="font-cinzel text-[10.5px] sm:text-xs font-bold tracking-[0.26em] text-[#805527] uppercase">
              OUR WEDDING ALBUM
            </span>
            <span className="text-[#b88636] text-xs">✦</span>
            <span className="w-8 sm:w-14 h-px bg-gradient-to-l from-transparent to-[#b88636]" />
          </div>

          <h2 className="font-cinzel text-xl sm:text-3xl md:text-5xl font-extrabold tracking-wide sm:tracking-[0.16em] text-[#42100b] uppercase leading-tight px-2">
            {gallery.heading || "MOMENTS WE TREASURE"}
          </h2>

          <p className="font-cormorant text-base sm:text-lg md:text-xl italic text-[#744c2c] font-semibold mt-1.5">
            {gallery.subheading || "Every picture tells a part of our story."}
          </p>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#b88636] to-transparent mt-2.5" />
        </motion.div>

        {/* 
          2. DESKTOP: BALANCED EDITORIAL SHOWCASE (3-column layout)
          Featured hero photograph in the center with auto-focus switching;
          Flanked by clean vertical portrait supporting cards (object-top to preserve subjects).
        */}
        <div className="hidden lg:grid grid-cols-12 gap-6 items-center max-w-5xl mx-auto my-6">
          {/* LEFT SUPPORTING COLUMN (2 images, clean portrait layout) */}
          <div className="col-span-3 flex flex-col gap-6 justify-center items-end">
            {supportingPhotos.slice(1, 3).map((photo) => {
              const isSelected = photo.originalIndex === featuredIndex;
              return (
                <motion.div
                  key={photo.id}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
                  onClick={() => setFeaturedIndex(photo.originalIndex)}
                  className={`relative group cursor-pointer transition-all duration-300 rounded-xl overflow-hidden shadow-[0_8px_20px_rgba(80,45,20,0.16)] w-[190px] xl:w-[210px] aspect-[3/4] ${
                    isSelected
                      ? "border-2 border-[#ffd700] ring-2 ring-[#ffd700]/50 scale-102"
                      : "border border-[#b88636]/70 hover:border-[#ffd700]"
                  }`}
                >
                  {/* Thin inner gold rim */}
                  <div className="absolute inset-1 rounded-lg border border-[#ffd700]/30 pointer-events-none z-10" />

                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="220px"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />

                  {/* Caption Bar on Hover */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2.5 z-10">
                    <p className="font-cormorant text-xs italic text-[#fffdf8] font-medium truncate">
                      {photo.alt}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CENTER FEATURED HERO PHOTOGRAPH */}
          <div className="col-span-6 flex flex-col items-center">
            <motion.div
              key={`featured-${featuredPhoto?.id || 0}`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative w-full max-w-[420px] aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(80,45,20,0.26)] border-2 border-[#b88636] group cursor-pointer"
              onClick={() => openLightbox(featuredIndex)}
            >
              {/* Gold Ornamental Corner Brackets */}
              <span className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[#d4af37] z-20 pointer-events-none" />
              <span className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-[#d4af37] z-20 pointer-events-none" />
              <span className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-[#d4af37] z-20 pointer-events-none" />
              <span className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[#d4af37] z-20 pointer-events-none" />

              {/* Main Image */}
              {featuredPhoto && (
                <Image
                  src={featuredPhoto.src}
                  alt={featuredPhoto.alt}
                  fill
                  sizes="420px"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-104"
                  priority
                  unoptimized
                />
              )}

              {/* Bottom Caption Vignette */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-end justify-between p-4 z-10">
                <p className="font-cormorant text-base text-[#fffdf8] italic font-medium drop-shadow-sm">
                  {featuredPhoto?.alt}
                </p>
                <button
                  type="button"
                  aria-label="View full-screen photograph"
                  className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-[#ffd700] border border-[#d4af37]/40 backdrop-blur-sm transition-colors cursor-pointer"
                >
                  <Maximize2 size={16} />
                </button>
              </div>
            </motion.div>

            <p className="font-cinzel text-[11px] font-semibold tracking-widest text-[#805527] uppercase mt-3 select-none">
              Click photograph to view full-screen
            </p>
          </div>

          {/* RIGHT SUPPORTING COLUMN (2 images, clean portrait layout) */}
          <div className="col-span-3 flex flex-col gap-6 justify-center items-start">
            {supportingPhotos.slice(3, 5).map((photo) => {
              const isSelected = photo.originalIndex === featuredIndex;
              return (
                <motion.div
                  key={photo.id}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
                  onClick={() => setFeaturedIndex(photo.originalIndex)}
                  className={`relative group cursor-pointer transition-all duration-300 rounded-xl overflow-hidden shadow-[0_8px_20px_rgba(80,45,20,0.16)] w-[190px] xl:w-[210px] aspect-[3/4] ${
                    isSelected
                      ? "border-2 border-[#ffd700] ring-2 ring-[#ffd700]/50 scale-102"
                      : "border border-[#b88636]/70 hover:border-[#ffd700]"
                  }`}
                >
                  {/* Thin inner gold rim */}
                  <div className="absolute inset-1 rounded-lg border border-[#ffd700]/30 pointer-events-none z-10" />

                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="220px"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />

                  {/* Caption Bar on Hover */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2.5 z-10">
                    <p className="font-cormorant text-xs italic text-[#fffdf8] font-medium truncate">
                      {photo.alt}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 
          3. MOBILE: CONTINUOUS AUTOMATIC SCROLLING LOOP
          Seamless looping marquee of photographs with touch interaction to open lightbox
        */}
        <div className="lg:hidden w-full overflow-hidden my-3">
          <motion.div
            className="flex items-center gap-3.5 py-3 w-max"
            animate={
              shouldReduceMotion
                ? {}
                : {
                    x: ["0%", "-50%"],
                  }
            }
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 22,
                ease: "linear",
              },
            }}
          >
            {loopedPhotos.map((photo, index) => (
              <div
                key={`${photo.id}-${index}`}
                onClick={() => openLightbox(index % photos.length)}
                className="relative w-[210px] sm:w-[250px] aspect-[3/4] rounded-xl overflow-hidden shrink-0 shadow-[0_8px_22px_rgba(80,45,20,0.2)] border border-[#b88636]/80 cursor-pointer active:scale-98 transition-transform"
              >
                {/* Thin inner gold rim */}
                <div className="absolute inset-1 rounded-lg border border-[#ffd700]/30 pointer-events-none z-10" />

                {/* Image */}
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="250px"
                  className="object-cover object-top"
                  loading="eager"
                  unoptimized
                />

                {/* Caption bar */}
                <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-between p-2.5 z-10">
                  <span className="font-cormorant text-xs italic text-[#fffdf8] font-medium truncate">
                    {photo.alt}
                  </span>
                  <Maximize2 size={12} className="text-white shrink-0 ml-1" />
                </div>
              </div>
            ))}
          </motion.div>

          <div className="flex items-center justify-center gap-1.5 mt-2 select-none">
            <span className="font-cinzel text-[10px] font-semibold text-[#805527] uppercase tracking-wider">
              Auto-scrolling moments • Tap to enlarge
            </span>
          </div>
        </div>
      </div>

      {/* 4. LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={photos}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onNavigate={(newIndex) => setLightboxIndex(newIndex)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
