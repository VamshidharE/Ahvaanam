"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RoyalDivider, TraditionalJasmineCreeper, TraditionalBotanicalVine, TraditionalCornerKolam, TraditionalSikkuKolam } from "../assets/Ornaments";
import { useEmeraldPalace } from "../context";

export function RoyalGallery() {
  const data = useEmeraldPalace();
  const photos =
    data.gallery && data.gallery.length > 0
      ? data.gallery
      : [
          { src: "/templates/emerald-palace/couple-portrait-large.jpg", alt: "Arjun & Divya Royal Portrait", caption: "Eternal Beginning" },
          { src: "/templates/emerald-palace/story-candid.jpg", alt: "Sunset Courtyard Candid", caption: "Joyous Laughter" },
          { src: "/templates/emerald-palace/gallery-bride.jpg", alt: "Divya Bridal Glow", caption: "Bridal Radiance" },
          { src: "/templates/emerald-palace/gallery-groom.jpg", alt: "Arjun Regal Groom", caption: "Royal Heritage" },
          { src: "/templates/emerald-palace/story-hands.jpg", alt: "Sacred Clasped Hands", caption: "Sacred Bond" },
          { src: "/templates/emerald-palace/event-muhurtam.jpg", alt: "Sacred Kalyana Mandapam", caption: "Divine Blessings" },
          { src: "/templates/emerald-palace/event-haldi.jpg", alt: "Golden Haldi Moments", caption: "Turmeric Blessings" },
          { src: "/templates/emerald-palace/event-sangeeth.jpg", alt: "Sangeeth Celebrations", caption: "Festive Joy" },
        ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Auto switch images into the bigger pane every 4.5 seconds
  useEffect(() => {
    if (photos.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % photos.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [photos.length]);

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") setLightboxIndex((prev) => (prev === null ? 0 : (prev + 1) % photos.length));
      if (e.key === "ArrowLeft") setLightboxIndex((prev) => (prev === null ? 0 : (prev - 1 + photos.length) % photos.length));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, photos.length]);

  // Touch swipe support for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) nextSlide();
    else if (diff < -50) prevSlide();
    setTouchStart(null);
  };

  return (
    <section className="relative py-14 sm:py-20 px-4 sm:px-6 scroll-mt-16 ep-bg-gallery-fineart overflow-hidden border-b border-[#D6AD63]/30" id="gallery">
      {/* Authentic South Indian Corner Kolam Artwork in Section Corners */}
      <div className="absolute -top-8 -left-8 w-36 sm:w-52 pointer-events-none opacity-30 z-0">
        <TraditionalCornerKolam className="w-full h-auto" />
      </div>
      <div className="absolute -top-8 -right-8 w-36 sm:w-52 pointer-events-none opacity-30 z-0 scale-x-[-1]">
        <TraditionalCornerKolam className="w-full h-auto" />
      </div>
      <div className="hidden lg:block absolute -bottom-12 -left-12 w-44 xl:w-56 pointer-events-none opacity-20 z-0 ep-kolam-breathe">
        <TraditionalSikkuKolam className="w-full h-auto" />
      </div>
      {/* Traditional Small Botanical Vines along Outer Section Borders */}
      <div className="hidden xl:block absolute -left-8 top-1/3 pointer-events-none z-0 opacity-40 w-28">
        <TraditionalBotanicalVine className="w-full h-auto" />
      </div>
      <div className="hidden xl:block absolute -right-8 top-2/3 pointer-events-none z-0 opacity-40 w-28 scale-x-[-1]">
        <TraditionalJasmineCreeper className="w-full h-auto" />
      </div>

      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-10 max-w-xl mx-auto px-4 relative z-10">
        <span className="font-cinzel text-xs uppercase tracking-[0.25em] text-[#781D36] font-bold">
          Captured Memories
        </span>
        <h2 className="ep-section-heading mt-1">Our Moments</h2>
        <RoyalDivider className="my-3 scale-90" />
        <p className="font-serif text-sm text-[#7E5B58] italic">
          Glimpses of joyous laughter, timeless traditions, and tender celebrations.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Desktop Asymmetric Photographic Mosaic with Auto-Switching */}
        <div className="hidden lg:grid grid-cols-12 gap-5 items-stretch">
          {/* Main Large Featured Photograph (7 cols) - Auto-switches */}
          <div
            className="col-span-7 relative group cursor-pointer overflow-hidden rounded-3xl shadow-2xl border-2 border-[#D6AD63]/50 bg-[#FFFDF9]"
            onClick={() => setLightboxIndex(activeIndex)}
          >
            <div className="aspect-[4/3] w-full h-full relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeIndex}
                  src={photos[activeIndex]?.src}
                  alt={photos[activeIndex]?.alt || "Featured Moment"}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Navigation Chevrons on Main Frame */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-[#781D36] text-white flex items-center justify-center backdrop-blur-sm border border-white/30 transition-colors z-20 text-lg"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-[#781D36] text-white flex items-center justify-center backdrop-blur-sm border border-white/30 transition-colors z-20 text-lg"
                aria-label="Next image"
              >
                ›
              </button>

              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-[#FFF6E9] pointer-events-none">
                <div>
                  <span className="font-cinzel text-xs tracking-widest text-[#DFB759] uppercase block font-semibold">
                    Moment {activeIndex + 1} of {photos.length}
                  </span>
                  <h4 className="font-serif text-lg font-semibold italic text-[#FFF6E9]">
                    {photos[activeIndex]?.caption || photos[activeIndex]?.alt}
                  </h4>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#781D36]/80 backdrop-blur-sm border border-[#DFB759] flex items-center justify-center text-sm shadow-md">
                  🔍
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Multi-Photo Grid (5 cols) - Clean display with NO visible scroller */}
          <div className="col-span-5 ep-gallery-thumbnails-clean grid grid-cols-2 gap-3.5">
            {photos.slice(0, 6).map((p, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setActiveIndex(idx);
                }}
                className={`relative group cursor-pointer overflow-hidden rounded-2xl shadow-md border transition-all duration-300 aspect-[4/3] bg-[#FFFDF9] ${
                  activeIndex === idx
                    ? "border-[#781D36] ring-2 ring-[#DFB759] scale-[1.02]"
                    : "border-[#D6AD63]/40 hover:border-[#D6AD63] opacity-80 hover:opacity-100"
                }`}
              >
                <img
                  src={p.src}
                  alt={p.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                <div className="absolute bottom-1.5 left-2 right-2 truncate">
                  <span className="font-serif text-[10px] text-white/95 drop-shadow-md italic">
                    {p.caption || p.alt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile / Tablet Interactive Photographic Carousel */}
        <div
          className="lg:hidden relative flex flex-col items-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Featured Large Mobile Card */}
          <div
            className="relative w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D6AD63]/60 cursor-pointer bg-[#FFFDF9]"
            onClick={() => setLightboxIndex(activeIndex)}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeIndex}
                src={photos[activeIndex]?.src}
                alt={photos[activeIndex]?.alt || "Wedding Moment"}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
            </AnimatePresence>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none" />

            {/* Caption & Zoom indicator */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white pointer-events-none">
              <div>
                <span className="font-cinzel text-[10px] tracking-widest text-[#DFB759] uppercase block font-bold">
                  {activeIndex + 1} / {photos.length}
                </span>
                <p className="font-serif text-sm italic font-semibold text-white/95">
                  {photos[activeIndex]?.caption || photos[activeIndex]?.alt}
                </p>
              </div>
              <span className="w-8 h-8 rounded-full bg-[#781D36]/80 backdrop-blur-sm border border-[#DFB759] flex items-center justify-center text-xs">
                🔍
              </span>
            </div>

            {/* Left / Right Chevron Controls */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm border border-white/30 text-lg"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm border border-white/30 text-lg"
              aria-label="Next image"
            >
              ›
            </button>
          </div>

          {/* Pagination Thumbnail Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-5 flex-wrap max-w-xs">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === i
                    ? "w-7 bg-[#781D36]"
                    : "w-2 bg-[#D6AD63]/50 hover:bg-[#D6AD63]"
                }`}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl flex items-center justify-center transition-colors"
              aria-label="Close Lightbox"
            >
              ✕
            </button>
            <div
              className="relative max-w-4xl max-h-[85vh] w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={photos[lightboxIndex]?.src}
                alt={photos[lightboxIndex]?.alt || "Lightbox View"}
                className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl border border-white/20"
              />
              <p className="font-serif italic text-white/90 text-sm mt-3 text-center">
                {photos[lightboxIndex]?.caption || photos[lightboxIndex]?.alt}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default RoyalGallery;
