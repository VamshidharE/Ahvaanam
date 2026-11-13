"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RoyalDivider, TraditionalFloralCluster, TraditionalCornerKolam, TraditionalPulliKolam } from "../assets/Ornaments";
import { useEmeraldPalace } from "../context";

export function AuspiciousEvents() {
  const data = useEmeraldPalace();
  const enabledEvents = data.events.filter((e) => e.enabled !== false);

  // Default to Muhurtam or first event
  const defaultIndex = Math.max(
    0,
    enabledEvents.findIndex(
      (e) =>
        e.icon === "muhurtam" ||
        e.title.toLowerCase().includes("muhurtam") ||
        e.title.toLowerCase().includes("wedding")
    )
  );

  const [activeIndex, setActiveIndex] = useState(defaultIndex >= 0 ? defaultIndex : 0);
  const activeEvent = enabledEvents[activeIndex] || enabledEvents[0];

  // Auto switch events every 5.5 seconds
  useEffect(() => {
    if (enabledEvents.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % enabledEvents.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [enabledEvents.length]);

  const nextEvent = () => {
    setActiveIndex((prev) => (prev + 1) % enabledEvents.length);
  };

  const prevEvent = () => {
    setActiveIndex((prev) => (prev - 1 + enabledEvents.length) % enabledEvents.length);
  };

  const mapsQuery = encodeURIComponent(
    `${activeEvent.venue}, ${activeEvent.address || data.wedding.city}`
  );

  return (
    <section className="relative py-14 sm:py-20 px-4 sm:px-6 scroll-mt-16 ep-bg-celebrations-courtyard overflow-hidden border-b border-[#D6AD63]/30" id="events">
      {/* Authentic South Indian Kolam Artwork in Section Background */}
      <div className="absolute -top-8 -left-8 w-36 sm:w-52 pointer-events-none opacity-30 z-0">
        <TraditionalCornerKolam className="w-full h-auto" />
      </div>
      <div className="absolute -top-8 -right-8 w-36 sm:w-52 pointer-events-none opacity-30 z-0 scale-x-[-1]">
        <TraditionalCornerKolam className="w-full h-auto" />
      </div>
      <div className="hidden lg:block absolute -bottom-10 -right-10 w-44 xl:w-56 pointer-events-none opacity-25 z-0 ep-kolam-breathe">
        <TraditionalPulliKolam className="w-full h-auto" />
      </div>
      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-10 max-w-xl mx-auto px-4 relative z-10">
        <div className="w-12 h-12 mx-auto mb-2 opacity-80 pointer-events-none">
          <TraditionalFloralCluster className="w-full h-full object-contain" />
        </div>
        <span className="font-cinzel text-xs uppercase tracking-[0.25em] text-[#781D36] font-bold">
          Sacred Itinerary
        </span>
        <h2 className="ep-section-heading mt-1">Wedding Celebrations</h2>
        <RoyalDivider className="my-3 scale-90" />
        <p className="font-serif text-sm text-[#7E5B58] italic">
          Select each sacred ceremony below to view its celebrations, venue, and timings.
        </p>
      </div>

      {/* Main Interactive Photographic Showcase Container */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        {/* Mobile View (< sm): 4-Column Icons Grid with zero scroll */}
        <div className="grid grid-cols-4 gap-2 w-full max-w-sm mx-auto px-1 mb-6 sm:hidden">
          {enabledEvents.map((ev, idx) => {
            const isSelected = activeIndex === idx;
            const eventImg =
              ev.image ||
              (idx === 0
                ? "/templates/emerald-palace/event-haldi.jpg"
                : idx === 1
                ? "/templates/emerald-palace/event-sangeeth.jpg"
                : idx === 2
                ? "/templates/emerald-palace/event-muhurtam.jpg"
                : "/templates/emerald-palace/event-reception.jpg");

            return (
              <button
                key={ev.id || idx}
                onClick={() => setActiveIndex(idx)}
                className="flex flex-col items-center gap-1.5 transition-all text-center"
                aria-label={`Select ${ev.title}`}
              >
                <div
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all duration-300 shadow-md ${
                    isSelected
                      ? "border-[#DFB759] ring-2 ring-[#781D36] scale-105"
                      : "border-[#D6AD63]/50 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={eventImg}
                    alt={ev.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span
                  className={`font-cinzel text-[10px] font-bold text-center leading-tight line-clamp-1 ${
                    isSelected ? "text-[#781D36]" : "text-[#7E5B58]"
                  }`}
                >
                  {ev.title.split("(")[0].trim().split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Desktop View (>= sm): Horizontal Event Selector with Photographic Thumbnails */}
        <div className="hidden sm:flex items-center justify-center gap-3 sm:gap-4 pb-4 pt-1 px-2 mb-8 sm:mb-10">
          {enabledEvents.map((ev, idx) => {
            const isSelected = activeIndex === idx;
            const eventImg =
              ev.image ||
              (idx === 0
                ? "/templates/emerald-palace/event-haldi.jpg"
                : idx === 1
                ? "/templates/emerald-palace/event-sangeeth.jpg"
                : idx === 2
                ? "/templates/emerald-palace/event-muhurtam.jpg"
                : "/templates/emerald-palace/event-reception.jpg");

            return (
              <button
                key={ev.id || idx}
                onClick={() => setActiveIndex(idx)}
                className={`flex-shrink-0 flex items-center gap-3 p-1.5 pr-4 rounded-full transition-all duration-300 text-left border ${
                  isSelected
                    ? "bg-[#781D36] text-[#FFF6E9] border-[#DFB759] shadow-lg scale-105"
                    : "bg-[#FFFDF9] text-[#542D2A] border-[#D6AD63]/40 hover:border-[#D6AD63] hover:bg-[#F7E8D0]/60"
                }`}
                aria-label={`Select ${ev.title}`}
              >
                {/* Mini Photographic Thumbnail */}
                <div className="w-11 h-11 rounded-full overflow-hidden border border-[#D6AD63] flex-shrink-0 shadow-sm">
                  <img
                    src={eventImg}
                    alt={ev.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Event Name & Date */}
                <div className="flex flex-col">
                  <span
                    className={`font-cinzel text-xs font-bold tracking-wide leading-tight ${
                      isSelected ? "text-[#FFF6E9]" : "text-[#781D36]"
                    }`}
                  >
                    {ev.title.split("(")[0].trim()}
                  </span>
                  <span
                    className={`font-serif text-[11px] ${
                      isSelected ? "text-[#FDEAB2]" : "text-[#7E5B58]"
                    }`}
                  >
                    {ev.date.split(" ")[0]} {ev.date.split(" ")[1]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Featured Event Card: 2-Column Desktop / Stacked Mobile */}
        <div className="relative bg-[#FFFDF9] rounded-3xl p-4 sm:p-8 shadow-[0_20px_50px_rgba(120,29,54,0.12)] border border-[#D6AD63]/50 overflow-hidden">
          {/* Authentic Corner Kolam Linework on Event Card */}
          <div className="absolute top-2 left-2 w-8 h-8 opacity-45 pointer-events-none">
            <TraditionalCornerKolam className="w-full h-auto" />
          </div>
          <div className="absolute top-2 right-2 w-8 h-8 opacity-45 pointer-events-none scale-x-[-1]">
            <TraditionalCornerKolam className="w-full h-auto" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeEvent.id || activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center"
            >
              {/* Left Column: Large Featured Photograph (7 cols on desktop) */}
              <div className="lg:col-span-7 relative">
                <div className="relative overflow-hidden rounded-2xl aspect-[16/10] sm:aspect-[16/10] w-full shadow-xl border border-[#D6AD63]/40 group">
                  <img
                    src={
                      activeEvent.image ||
                      (activeIndex === 0
                        ? "/templates/emerald-palace/event-haldi.jpg"
                        : activeIndex === 1
                        ? "/templates/emerald-palace/event-sangeeth.jpg"
                        : activeIndex === 2
                        ? "/templates/emerald-palace/event-muhurtam.jpg"
                        : "/templates/emerald-palace/event-reception.jpg")
                    }
                    alt={activeEvent.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Atmospheric gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                  {/* Navigation Chevrons inside image */}
                  <button
                    onClick={prevEvent}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-[#781D36] text-white flex items-center justify-center backdrop-blur-sm border border-white/30 transition-colors z-20"
                    aria-label="Previous event"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextEvent}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-[#781D36] text-white flex items-center justify-center backdrop-blur-sm border border-white/30 transition-colors z-20"
                    aria-label="Next event"
                  >
                    ›
                  </button>
                </div>
              </div>

              {/* Right Column: Detailed Event Information (5 cols on desktop) */}
              <div className="lg:col-span-5 flex flex-col justify-center text-left">
                {/* Event Order Pill */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-cinzel text-[10px] uppercase font-bold tracking-[0.2em] px-2.5 py-0.5 rounded-full bg-[#781D36] text-[#FFF6E9]">
                    Ceremony 0{activeIndex + 1} / 0{enabledEvents.length}
                  </span>
                  {activeEvent.auspiciousTime && (
                    <span className="font-serif text-xs italic text-[#B88A3B] font-semibold">
                      ✦ {activeEvent.auspiciousTime}
                    </span>
                  )}
                </div>

                {/* Event Title */}
                <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#781D36] tracking-tight mb-2">
                  {activeEvent.title}
                </h3>

                {activeEvent.subtitle && (
                  <p className="font-serif text-sm text-[#542D2A] italic mb-3">
                    {activeEvent.subtitle}
                  </p>
                )}

                {/* Event Date & Timing Cards */}
                <div className="grid grid-cols-2 gap-2.5 my-2">
                  {/* Date Card */}
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FFF6E9] border border-[#D6AD63]/30">
                    <span className="text-base text-[#781D36]">📅</span>
                    <div>
                      <span className="font-cinzel text-[9px] uppercase tracking-wider text-[#7E5B58] block font-bold">
                        Date
                      </span>
                      <span className="font-serif text-xs sm:text-sm font-semibold text-[#542D2A]">
                        {activeEvent.date}
                      </span>
                    </div>
                  </div>

                  {/* Time Card */}
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FFF6E9] border border-[#D6AD63]/30">
                    <span className="text-base text-[#781D36]">⏰</span>
                    <div>
                      <span className="font-cinzel text-[9px] uppercase tracking-wider text-[#7E5B58] block font-bold">
                        Time
                      </span>
                      <span className="font-serif text-xs sm:text-sm font-semibold text-[#542D2A]">
                        {activeEvent.time}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Venue Location Card with Map Preview & Get Directions */}
                <div className="p-3 rounded-2xl bg-[#FFF6E9] border border-[#D6AD63]/40 space-y-2.5 my-2">
                  <div className="flex items-start gap-2.5">
                    <span className="text-base text-[#781D36]">📍</span>
                    <div className="flex-1">
                      <span className="font-cinzel text-[10px] uppercase tracking-wider text-[#7E5B58] block font-bold">
                        Venue Location
                      </span>
                      <span className="font-serif text-sm sm:text-base font-bold text-[#542D2A] block leading-snug">
                        {activeEvent.venue}
                      </span>
                      {activeEvent.address && (
                        <span className="font-serif text-xs text-[#7E5B58] block mt-0.5">
                          {activeEvent.address}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Map Preview Below the Address */}
                  <div className="relative w-full h-28 sm:h-32 rounded-xl overflow-hidden border border-[#D6AD63]/30 shadow-inner bg-[#F7E8D0]/50">
                    <iframe
                      title={`${activeEvent.venue} Map Preview`}
                      src={`https://maps.google.com/maps?q=${mapsQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                      className="w-full h-full border-0 pointer-events-none"
                      loading="lazy"
                    />
                  </div>

                  {/* Get Directions Button Below Map Preview */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ep-btn-burgundy text-xs py-2 px-4 w-full flex items-center justify-center gap-1.5 text-center font-bold"
                    aria-label="Get Directions on Google Maps"
                  >
                    <span>📍 Get Directions</span>
                    <span>↗</span>
                  </a>
                </div>

                {/* Event Description */}
                {activeEvent.description && (
                  <p className="font-serif text-xs text-[#7E5B58] leading-relaxed my-1.5 italic">
                    &ldquo;{activeEvent.description}&rdquo;
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default AuspiciousEvents;
