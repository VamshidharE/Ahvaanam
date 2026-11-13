"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useGopuram } from "../context";
import { GopuramPhoto } from "../adapter";

/* ─────────────────────────────────────────────────────────────
 * LIGHTBOX FULL-SCREEN VIEWER (Exact Gopuram Implementation)
 * ───────────────────────────────────────────────────────────── */
interface LightboxProps {
  photos: GopuramPhoto[];
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
        className="relative max-w-4xl max-h-[82vh] w-full aspect-[4/5] sm:aspect-[4/3] flex items-center justify-center"
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
      {currentPhoto.alt && (
        <div
          className="absolute bottom-6 inset-x-4 text-center pointer-events-none"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="font-cormorant text-base sm:text-lg italic text-[#f7e7c4] drop-shadow-md">
            {currentPhoto.alt}
          </p>
        </div>
      )}

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

/* ─────────────────────────────────────────────────────────────
 * MAIN OUR JOURNEY GALLERY COMPONENT (EXACT GOPURAM IMPLEMENTATION)
 * Features:
 * - Auto-scrolling 3D Coverflow Carousel (pauses on hover/interaction)
 * - Attractive Architectural Royal Cartouche Plaque Title
 * - Traditional Kolam Mandalas & Sacred Lotus Background Accents
 * ───────────────────────────────────────────────────────────── */
export const OurJourneyGallery: React.FC = () => {
  const { data } = useGopuram();
  const { gallery } = data;
  const photos = gallery.photos;
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });
  const shouldReduceMotion = useReducedMotion();

  // Active center index
  const [activeIndex, setActiveIndex] = useState<number>(() => Math.min(2, Math.max(0, photos.length - 1)));
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const handlePrev = useCallback(() => {
    if (photos.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const handleNext = useCallback(() => {
    if (photos.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  // Auto-scroll loop every 3.8 seconds
  useEffect(() => {
    if (isPaused || lightboxIndex !== null || shouldReduceMotion || !isInView || photos.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % photos.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [isPaused, lightboxIndex, shouldReduceMotion, isInView, photos.length]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  if (!photos || photos.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="our-gallery"
      aria-label="Our Photo Gallery"
      className="relative w-full overflow-hidden bg-transparent pt-6 pb-6 sm:pt-8 sm:pb-8 text-[#42100b] select-none"
    >
      {/* ─────────────────────────────────────────────────────────────
       * BACKGROUND DECORATIVE ARTWORK (Kolam & Sacred Lotus Embellishments)
       * ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        {/* Sacred Lotus Mandala Kolam on Left */}
        <div className="absolute -top-12 -left-10 w-52 sm:w-72 h-52 sm:h-72 opacity-[0.18]">
          <Image
            src="/templates/gopuram/decoration/Lotus-Mandala.png"
            alt=""
            fill
            className="object-contain filter sepia"
            unoptimized
          />
        </div>

        {/* Sacred Lotus Mandala Kolam on Right */}
        <div className="absolute -top-12 -right-10 w-52 sm:w-72 h-52 sm:h-72 opacity-[0.18]">
          <Image
            src="/templates/gopuram/decoration/Lotus-Mandala.png"
            alt=""
            fill
            className="object-contain filter sepia"
            unoptimized
          />
        </div>

        {/* Blooming Pink & Gold Lotus Accent near stage on Left */}
        <div className="absolute top-1/2 -left-4 w-20 sm:w-28 h-20 sm:h-28 opacity-[0.22]">
          <Image
            src="/templates/gopuram/events/lotus-corner.png"
            alt=""
            fill
            className="object-contain"
            unoptimized
          />
        </div>

        {/* Blooming Pink & Gold Lotus Accent near stage on Right */}
        <div className="absolute top-1/2 -right-4 w-20 sm:w-28 h-20 sm:h-28 opacity-[0.22] scale-x-[-1]">
          <Image
            src="/templates/gopuram/events/lotus-corner.png"
            alt=""
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* ─────────────────────────────────────────────────────────────
         * 1. SECTION HEADER (Attractive Architectural Royal Plaque)
         * ───────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-5 sm:mb-7 flex flex-col items-center"
        >
          {/* Auspicious Pill Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fbf2e3] border border-[#d4af37]/70 shadow-2xs mb-2.5">
            <span className="text-[#b88636] text-[10px]">✦</span>
            <span className="font-cinzel text-[10px] sm:text-xs font-bold tracking-[0.22em] text-[#742719] uppercase">
              Visual Memories
            </span>
            <span className="text-[#b88636] text-[10px]">✦</span>
          </div>

          {/* Royal Architectural Cartouche Heading Plaque */}
          <div className="relative inline-flex items-center justify-center px-5 sm:px-8 py-1.5 sm:py-2 rounded-2xl bg-gradient-to-r from-[#5a1012] via-[#7e181e] to-[#5a1012] border-2 border-[#d4af37] shadow-[0_6px_20px_rgba(90,20,10,0.22)]">
            {/* Corner Filigree Brackets */}
            <div className="absolute top-1 left-1.5 w-2.5 h-2.5 border-t border-l border-[#ffd700]/70 pointer-events-none" />
            <div className="absolute top-1 right-1.5 w-2.5 h-2.5 border-t border-r border-[#ffd700]/70 pointer-events-none" />
            <div className="absolute bottom-1 left-1.5 w-2.5 h-2.5 border-b border-l border-[#ffd700]/70 pointer-events-none" />
            <div className="absolute bottom-1 right-1.5 w-2.5 h-2.5 border-b border-r border-[#ffd700]/70 pointer-events-none" />

            {/* Left Gold Wing Flourish */}
            <span className="hidden sm:inline-block w-6 sm:w-10 h-px bg-gradient-to-r from-transparent via-[#ffd700] to-transparent mr-2.5" />

            {/* Main Title Heading */}
            <h2 className="font-cinzel text-lg sm:text-xl md:text-2xl lg:text-[1.75rem] font-black tracking-[0.18em] sm:tracking-[0.22em] text-[#fffdf8] uppercase leading-tight [text-shadow:_0_1px_3px_rgba(0,0,0,0.6),_0_0_12px_rgba(255,215,0,0.35)]">
              {gallery.heading || "Our Gallery"}
            </h2>

            {/* Right Gold Wing Flourish */}
            <span className="hidden sm:inline-block w-6 sm:w-10 h-px bg-gradient-to-r from-transparent via-[#ffd700] to-transparent ml-2.5" />
          </div>

          {/* Subtitle in Distinct Italic Serif */}
          <p className="font-cormorant italic text-sm sm:text-base md:text-lg text-[#6e3a1f] font-bold tracking-wide mt-2 max-w-xl">
            &ldquo;{gallery.subheading || "Captured with love and cherished forever"}&rdquo;
          </p>
        </motion.div>

        {/* ─────────────────────────────────────────────────────────────
         * 2. AUTO-SCROLLING 3D COVERFLOW CAROUSEL
         * ───────────────────────────────────────────────────────────── */}
        <div
          className="relative w-full py-2 sm:py-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => {
            // Resume after 4 seconds of touch inactivity
            setTimeout(() => setIsPaused(false), 4000);
          }}
        >
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous photo"
            className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-[#fdfaf3]/95 hover:bg-[#fffdf8] border-2 border-[#d4af37] text-[#541c15] shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next photo"
            className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-[#fdfaf3]/95 hover:bg-[#fffdf8] border-2 border-[#d4af37] text-[#541c15] shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>

          {/* 3D Perspective Stage Container */}
          <div
            className="relative w-full h-[280px] sm:h-[340px] md:h-[400px] lg:h-[440px] flex items-center justify-center overflow-hidden"
            style={{ perspective: "1200px" }}
          >
            {photos.map((photo, index) => {
              // Calculate signed offset from activeIndex: -2, -1, 0, 1, 2
              let offset = index - activeIndex;
              const total = photos.length;
              if (offset > total / 2) offset -= total;
              if (offset < -total / 2) offset += total;

              const isCenter = offset === 0;
              const isVisible = Math.abs(offset) <= 2;

              if (!isVisible) return null;

              // 3D positioning styles based on offset
              let rotateY = 0;
              let scale = 1;
              let xTranslate = "0%";
              let zIndex = 10;
              let opacity = 1;

              if (isCenter) {
                rotateY = 0;
                scale = 1.1;
                xTranslate = "0%";
                zIndex = 30;
                opacity = 1;
              } else if (offset === -1) {
                rotateY = 16;
                scale = 0.94;
                xTranslate = "-66%";
                zIndex = 20;
                opacity = 0.92;
              } else if (offset === 1) {
                rotateY = -16;
                scale = 0.94;
                xTranslate = "66%";
                zIndex = 20;
                opacity = 0.92;
              } else if (offset === -2) {
                rotateY = 26;
                scale = 0.80;
                xTranslate = "-125%";
                zIndex = 10;
                opacity = 0.72;
              } else if (offset === 2) {
                rotateY = -26;
                scale = 0.80;
                xTranslate = "125%";
                zIndex = 10;
                opacity = 0.72;
              }

              return (
                <motion.div
                  key={photo.id}
                  onClick={() => {
                    if (isCenter) {
                      openLightbox(index);
                    } else {
                      setActiveIndex(index);
                    }
                  }}
                  animate={
                    shouldReduceMotion
                      ? { opacity }
                      : {
                          rotateY,
                          scale,
                          x: xTranslate,
                          opacity,
                        }
                  }
                  transition={{
                    duration: 0.55,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                  style={{
                    zIndex,
                    transformStyle: "preserve-3d",
                  }}
                  className={`absolute w-[180px] sm:w-[220px] md:w-[250px] lg:w-[280px] aspect-[3/4] cursor-pointer rounded-2xl p-1.5 sm:p-2 transition-shadow duration-300 ${
                    isCenter
                      ? "bg-gradient-to-br from-[#ffd700] via-[#c99f58] to-[#8a5822] shadow-[0_16px_40px_rgba(80,35,15,0.38)] ring-2 ring-[#ffd700]"
                      : "bg-gradient-to-br from-[#e4c590] via-[#b88636] to-[#8a5822] shadow-[0_10px_22px_rgba(80,35,15,0.2)] hover:opacity-100"
                  }`}
                >
                  {/* Photo Canvas Container inside the frame */}
                  <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#241711]">
                    {/* Inner gold hairline rim */}
                    <div className="absolute inset-0 rounded-xl border border-[#ffd700]/50 pointer-events-none z-10" />

                    {/* Corner Accent Dots on Center */}
                    {isCenter && (
                      <>
                        <div className="absolute top-2 left-2 z-20 w-2.5 h-2.5 rounded-full bg-[#ffd700] shadow-[0_0_8px_#ffd700]" />
                        <div className="absolute top-2 right-2 z-20 w-2.5 h-2.5 rounded-full bg-[#ffd700] shadow-[0_0_8px_#ffd700]" />
                        <div className="absolute bottom-2 left-2 z-20 w-2.5 h-2.5 rounded-full bg-[#ffd700] shadow-[0_0_8px_#ffd700]" />
                        <div className="absolute bottom-2 right-2 z-20 w-2.5 h-2.5 rounded-full bg-[#ffd700] shadow-[0_0_8px_#ffd700]" />
                      </>
                    )}

                    {/* Image Preview */}
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 640px) 260px, (max-width: 1024px) 340px, 440px"
                      className="object-cover object-top transition-transform duration-500 hover:scale-105"
                      priority={isCenter}
                      unoptimized
                    />

                    {/* Subtle warm vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Bottom Caption Pill on Center */}
                    {isCenter && (
                      <div className="absolute inset-x-2 bottom-3 z-20 flex items-center justify-between px-3 py-1.5 rounded-lg bg-black/55 backdrop-blur-xs text-[#fffcf5]">
                        <span className="font-cormorant text-xs sm:text-sm md:text-base italic font-semibold truncate">
                          {photo.alt}
                        </span>
                        <Maximize2 size={13} className="text-[#ffd700] shrink-0 ml-1.5 opacity-90" />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ─────────────────────────────────────────────────────────────
           * 3. PAGINATION DOTS & FULLSCREEN HINT
           * ───────────────────────────────────────────────────────────── */}
          <div className="flex flex-col items-center justify-center mt-6 sm:mt-8 gap-2">
            {/* 5 Dots Indicator */}
            <div className="flex items-center justify-center gap-2.5">
              {photos.map((_, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Jump to photo ${idx + 1}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      isActive
                        ? "w-3.5 h-3.5 bg-[#541c15] ring-2 ring-[#ffd700] shadow-sm scale-110"
                        : "w-2.5 h-2.5 bg-[#b88636]/60 hover:bg-[#b88636]"
                    }`}
                  />
                );
              })}
            </div>

            {/* Helper Text */}
            <span className="font-cinzel text-[10px] sm:text-[11px] font-semibold text-[#805527] uppercase tracking-wider mt-1">
              Auto-scrolling moments • Click to view full-screen
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
