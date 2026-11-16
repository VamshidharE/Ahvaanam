"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { RoyalDivider, TraditionalJasmineCreeper, TraditionalBotanicalVine, TraditionalCornerKolam, TraditionalSikkuKolam } from "../assets/Ornaments";
import { useEmeraldPalace } from "../context";
import { emitAnalyticsInteraction } from "@/lib/analytics/useInvitationTracker";

export function RoyalGallery() {
  const data = useEmeraldPalace();
  const photos =
    data.gallery && data.gallery.length > 0
      ? data.gallery
      : [
          { src: "/templates/emerald-palace/couple-portrait-large.jpg", alt: "Royal Portrait" },
          { src: "/templates/emerald-palace/story-candid.jpg", alt: "Sunset Moments" },
          { src: "/templates/emerald-palace/gallery-bride.jpg", alt: "Bridal Portrait" },
          { src: "/templates/emerald-palace/gallery-groom.jpg", alt: "Groom Portrait" },
          { src: "/templates/emerald-palace/story-hands.jpg", alt: "Sacred Hands" },
          { src: "/templates/emerald-palace/event-muhurtam.jpg", alt: "Kalyana Mandapam" },
          { src: "/templates/emerald-palace/event-haldi.jpg", alt: "Haldi Moments" },
          { src: "/templates/emerald-palace/event-sangeeth.jpg", alt: "Sangeeth Celebrations" },
        ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Monitor visibility of the gallery section so animations & timers pause off-screen
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: "100px 0px", threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto switch images into the bigger pane every 4.5 seconds ONLY when visible and lightbox closed
  useEffect(() => {
    if (photos.length <= 1 || !isInView || lightboxIndex !== null) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % photos.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [photos.length, isInView, lightboxIndex]);

  // Preload adjacent images into memory to completely eliminate decoding delay and blank frames
  useEffect(() => {
    if (!photos.length || typeof window === "undefined") return;
    const nextIdx = (activeIndex + 1) % photos.length;
    const prevIdx = (activeIndex - 1 + photos.length) % photos.length;
    [nextIdx, prevIdx].forEach((idx) => {
      if (photos[idx]?.src) {
        const img = new Image();
        img.src = photos[idx].src;
      }
    });
  }, [activeIndex, photos]);

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

  // Lock body scroll and set class to hide floating buttons while lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      document.body.classList.add("ep-lightbox-open");
      return () => {
        document.body.style.overflow = prevOverflow;
        document.body.classList.remove("ep-lightbox-open");
      };
    }
  }, [lightboxIndex]);

  // Touch swipe support for mobile gallery carousel (distinguishes horizontal swipe vs vertical scroll)
  const touchRef = useRef<{ startX: number; startY: number } | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchRef.current = {
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
    };
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = touchRef.current.startX - endX;
    const deltaY = touchRef.current.startY - endY;
    touchRef.current = null;

    // Only trigger slide transition if horizontal swipe is intentional and exceeds vertical scroll
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
      if (deltaX > 0) nextSlide();
      else if (deltaX < 0) prevSlide();
    }
  };

  // Touch swipe support for full-screen lightbox
  const lightboxTouchRef = useRef<{ startX: number; startY: number } | null>(null);
  const handleLightboxTouchStart = (e: React.TouchEvent) => {
    lightboxTouchRef.current = {
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
    };
  };
  const handleLightboxTouchEnd = (e: React.TouchEvent) => {
    if (!lightboxTouchRef.current || lightboxIndex === null) return;
    const endX = e.changedTouches[0].clientX;
    const deltaX = lightboxTouchRef.current.startX - endX;
    lightboxTouchRef.current = null;
    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        setLightboxIndex((prev) => (prev === null ? 0 : (prev + 1) % photos.length));
      } else {
        setLightboxIndex((prev) => (prev === null ? 0 : (prev - 1 + photos.length) % photos.length));
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-14 sm:py-20 px-4 sm:px-6 scroll-mt-16 ep-bg-gallery-fineart overflow-hidden border-b border-[#D6AD63]/30"
      id="gallery"
    >
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
        <h2 className="ep-section-heading mt-1">
          {data.galleryMeta?.title || (data.gallery as any)?.title || "Our Moments"}
        </h2>
        <RoyalDivider className="my-3 scale-90" />
        <p className="font-serif text-sm text-[#7E5B58] italic">
          {data.galleryMeta?.subheading || (data.gallery as any)?.subheading || "Glimpses of joyous laughter, timeless traditions, and tender celebrations."}
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Desktop Asymmetric Photographic Mosaic with Seamless Cross-Fading */}
        <div className="hidden lg:grid grid-cols-12 gap-5 items-stretch">
          {/* Main Large Featured Photograph (7 cols) - Persistent Stacking to avoid blank frames */}
          <div
            className="col-span-7 relative group cursor-pointer overflow-hidden rounded-3xl shadow-2xl border-2 border-[#D6AD63]/50 bg-[#FFFDF9]"
            onClick={() => {
              setLightboxIndex(activeIndex);
              emitAnalyticsInteraction("gallery_open", "gallery");
              emitAnalyticsInteraction("gallery_image_view", "gallery", { src: photos[activeIndex]?.src, index: activeIndex });
            }}
          >
            <div className="aspect-[4/3] w-full h-full relative overflow-hidden bg-[#F7E8D0]/30">
              {photos.map((p, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <div
                    key={p.src || idx}
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                      isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                    }`}
                    style={{ willChange: "opacity" }}
                  >
                    <img
                      src={p.src}
                      alt={p.alt || "Featured Moment"}
                      className="w-full h-full object-cover"
                      loading={idx === 0 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  </div>
                );
              })}

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

              <div className="absolute bottom-4 right-4 pointer-events-none z-20">
                <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-[#DFB759]/70 flex items-center justify-center text-xs text-white shadow-md">
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
                  emitAnalyticsInteraction("gallery_image_view", "gallery", { src: p.src, index: idx });
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
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile / Tablet Interactive Photographic Carousel */}
        <div
          className="lg:hidden relative flex flex-col items-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: "pan-y" }}
        >
          {/* Featured Large Mobile Card with Persistent Cross-Fade Layers */}
          <div
            className="relative w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D6AD63]/60 cursor-pointer bg-[#FFFDF9]"
            onClick={() => {
              setLightboxIndex(activeIndex);
              emitAnalyticsInteraction("gallery_open", "gallery");
              emitAnalyticsInteraction("gallery_image_view", "gallery", { src: photos[activeIndex]?.src, index: activeIndex });
            }}
          >
            <div className="relative w-full h-full overflow-hidden bg-[#F7E8D0]/30">
              {photos.map((p, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <div
                    key={p.src || idx}
                    className={`absolute inset-0 transition-opacity duration-400 ease-in-out ${
                      isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                    }`}
                    style={{ willChange: "opacity" }}
                  >
                    <img
                      src={p.src}
                      alt={p.alt || "Wedding Moment"}
                      className="w-full h-full object-cover"
                      loading={idx === 0 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  </div>
                );
              })}

              {/* Subtle Zoom indicator */}
              <div className="absolute bottom-3 right-3 pointer-events-none z-20">
                <span className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-[#DFB759]/70 flex items-center justify-center text-xs text-white">
                  🔍
                </span>
              </div>

              {/* Left / Right Chevron Controls */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm border border-white/30 text-lg z-20"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm border border-white/30 text-lg z-20"
                aria-label="Next image"
              >
                ›
              </button>
            </div>
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

      {/* Lightbox Modal with Full-Screen Swipe, Portal to Body & Scroll Lock */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {lightboxIndex !== null && (
              <motion.div
                className="fixed inset-0 z-[9999] bg-black/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none"
                style={{ width: "100vw", height: "100dvh" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setLightboxIndex(null)}
                onTouchStart={handleLightboxTouchStart}
                onTouchEnd={handleLightboxTouchEnd}
              >
                {/* Top Bar with Counter & Close Button */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30 pointer-events-none">
                  <span className="font-cinzel text-xs tracking-widest text-[#DFB759] font-bold bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10 pointer-events-auto">
                    {lightboxIndex + 1} / {photos.length}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(null);
                    }}
                    className="w-10 h-10 rounded-full bg-black/60 hover:bg-[#781D36] text-white text-lg flex items-center justify-center transition-colors pointer-events-auto border border-white/20 shadow-lg"
                    aria-label="Close Lightbox"
                  >
                    ✕
                  </button>
                </div>

                {/* Previous Photo Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => (prev === null ? 0 : (prev - 1 + photos.length) % photos.length));
                  }}
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-[#781D36] text-white text-xl sm:text-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 transition-colors z-30 shadow-lg"
                  aria-label="Previous photo"
                >
                  ‹
                </button>

                {/* Next Photo Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => (prev === null ? 0 : (prev + 1) % photos.length));
                  }}
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-[#781D36] text-white text-xl sm:text-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 transition-colors z-30 shadow-lg"
                  aria-label="Next photo"
                >
                  ›
                </button>

                {/* Main Lightbox Image Viewport */}
                <div
                  className="relative max-w-4xl max-h-[82vh] w-full flex flex-col items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    key={lightboxIndex}
                    src={photos[lightboxIndex]?.src}
                    alt={photos[lightboxIndex]?.alt || "Lightbox View"}
                    className="max-h-[72vh] max-w-full w-auto object-contain rounded-2xl shadow-2xl border border-[#D6AD63]/30"
                    decoding="async"
                  />
                  <p className="font-serif italic text-white/90 text-xs sm:text-sm mt-3 text-center px-4">
                    {photos[lightboxIndex]?.caption || photos[lightboxIndex]?.alt}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}

export default RoyalGallery;
