"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Calendar, Clock, MapPin, Navigation } from "lucide-react";
import { PelliPandiriData, PelliPandiriEvent } from "../adapter";

interface EventMarkerProps {
  event: PelliPandiriEvent;
  isActive: boolean;
  onClick: () => void;
}

const EventMarker: React.FC<EventMarkerProps> = ({ event, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={`Select ${event.name} celebration`}
    aria-current={isActive ? "step" : undefined}
    className={`group relative flex flex-col items-center justify-between cursor-pointer transition-all duration-300 focus:outline-none shrink-0 ${
      isActive
        ? "scale-105 z-10"
        : "opacity-75 hover:opacity-100 hover:scale-102"
    }`}
  >
    <div
      className={`relative w-[64px] h-[82px] xs:w-[72px] xs:h-[90px] sm:w-20 sm:h-24 md:w-24 md:h-28 flex flex-col items-center justify-between p-1 sm:p-2 transition-all duration-300 ${
        isActive
          ? "bg-[#fffdf8] shadow-[0_8px_22px_rgba(138,90,50,0.22)] border-2 border-[#b87d46]"
          : "bg-[#fcf6ea]/90 hover:bg-[#fffdf8] border border-[#e4d4bf]"
      }`}
      style={{
        borderRadius: "1.75rem 1.75rem 0.5rem 0.5rem",
      }}
    >
      {isActive && (
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#ffd700] to-transparent rounded-t-full" />
      )}

      {/* Mini illustration */}
      <div className="relative w-7 h-7 xs:w-8 xs:h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 mt-0.5">
        <Image
          src={event.illustration}
          alt={event.name}
          fill
          sizes="60px"
          className="object-contain"
          unoptimized
        />
      </div>

      {/* Label and compact date */}
      <div className="flex flex-col items-center text-center pb-0.5 leading-none w-full px-0.5">
        <span
          className={`font-cinzel text-[9.5px] xs:text-[10.5px] sm:text-xs md:text-[13px] tracking-tight sm:tracking-wide font-bold transition-colors truncate w-full ${
            isActive ? "text-[#742719]" : "text-[#5e4332]"
          }`}
        >
          {event.navLabel}
        </span>
        <span className="font-cormorant text-[8px] xs:text-[9px] sm:text-[10px] text-[#8c6b50] mt-0.5 font-medium truncate w-full">
          {event.shortDate || event.date.split(",")[0] || event.date}
        </span>
      </div>
    </div>

    {/* Active Dot with Connector Track */}
    <div className="flex items-center justify-center mt-1.5 sm:mt-2.5">
      {isActive ? (
        <span className="w-2.5 h-2.5 rounded-full bg-[#8e3622] ring-2 ring-[#ffd700]/70 shadow-xs" />
      ) : (
        <span className="w-1.5 h-1.5 rounded-full bg-[#c9a06c]/50 group-hover:bg-[#c9a06c]" />
      )}
    </div>
  </button>
);

const loadedMapsSessionSet = new Set<string>();

interface EventMapPreviewProps {
  activeEventId: string;
  events: PelliPandiriEvent[];
}

const EventMapPreview: React.FC<EventMapPreviewProps> = ({ activeEventId, events }) => {
  const [loadedIds, setLoadedIds] = useState<Set<string>>(() => new Set(loadedMapsSessionSet));

  const handleMapLoad = (id: string) => {
    loadedMapsSessionSet.add(id);
    setLoadedIds((prev) => new Set(prev).add(id));
  };

  const isCurrentLoaded = loadedIds.has(activeEventId);

  return (
    <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[16/8] max-h-[170px] sm:max-h-none rounded-xl overflow-hidden border border-[#c99f58]/80 shadow-[0_6px_18px_rgba(80,45,20,0.14)] bg-[#f8f1e4]">
      <div className="absolute inset-0 rounded-xl border border-[#ffd700]/30 pointer-events-none z-20" />

      {!isCurrentLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#faf1e0] text-[#744c2c] text-xs font-cinzel font-semibold z-15">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8e3622] animate-ping" />
            <span>Loading Venue Map...</span>
          </div>
        </div>
      )}

      {events.map((e) => {
        const isCurrent = e.id === activeEventId;
        const q = e.mapQuery || `${e.venue}, ${e.address || ""}`;
        const embedUrl = e.mapsEmbedUrl && e.mapsEmbedUrl.trim()
          ? e.mapsEmbedUrl.trim()
          : `https://maps.google.com/maps?q=${encodeURIComponent(q)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

        return (
          <iframe
            key={e.id}
            title={`Google Maps venue location for ${e.venue}`}
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="eager"
            allowFullScreen={false}
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => handleMapLoad(e.id)}
            className={`absolute inset-0 w-full h-full filter saturate-[0.9] contrast-[1.02] transition-opacity duration-300 ${
              isCurrent ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
            }`}
          />
        );
      })}
    </div>
  );
};

interface EventShowcaseProps {
  event: PelliPandiriEvent;
  events: PelliPandiriEvent[];
}

const EventShowcase: React.FC<EventShowcaseProps> = ({ event, events }) => {
  const queryText = event.mapQuery || `${event.venue}, ${event.address || ""}`;
  const googleMapsUrl = event.mapsLink && event.mapsLink.trim()
    ? event.mapsLink.trim()
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryText)}`;
  const showMap = event.showMap !== false;
  const showDirections = event.showDirections !== false;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-12 xl:gap-14">
        {/* Mobile header */}
        <div className="lg:hidden w-full text-center mb-1">
          <span className="inline-block px-3 py-0.5 rounded-full bg-[#fbf2e3] border border-[#d4ba9b]/60 font-cinzel text-[11px] font-bold tracking-[0.22em] text-[#742719] uppercase mb-1">
            CELEBRATION DETAILS
          </span>
          <h3 className="font-cinzel text-2xl font-black tracking-wide text-[#42100b] uppercase">
            {event.name}
          </h3>
          {event.subTitle && (
            <p className="font-cormorant text-base italic text-[#744c2c] font-semibold mt-0.5">
              {event.subTitle}
            </p>
          )}
        </div>

        {/* Left Column: Visual Illustration */}
        <motion.div
          key={`illustration-${event.id}`}
          initial={false}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative w-full max-w-[240px] sm:max-w-[280px] lg:w-[45%] lg:max-w-[400px] aspect-[1/1] sm:aspect-[4/5] shrink-0 flex items-center justify-center mx-auto my-0.5 sm:my-1"
        >
          <div
            className="absolute inset-0 rounded-full opacity-35 blur-xl sm:blur-2xl pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${event.accentColor || "#d4af37"} 0%, transparent 70%)`,
            }}
          />

          <div className="relative w-full h-full">
            <Image
              src={event.illustration}
              alt={event.name}
              fill
              sizes="(max-width: 640px) 250px, (max-width: 1024px) 280px, 400px"
              className="object-contain drop-shadow-[0_10px_24px_rgba(80,45,20,0.22)]"
              unoptimized
              priority
            />
          </div>
        </motion.div>

        {/* Right Column: Details & Map */}
        <motion.div
          key={`details-${event.id}`}
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex-1 w-full max-w-lg flex flex-col justify-start text-left pt-1"
        >
          {/* Desktop Title & Description */}
          <div className="hidden lg:block mb-4">
            <span className="inline-block px-3 py-0.5 rounded-full bg-[#fbf2e3] border border-[#d4ba9b]/60 font-cinzel text-[11px] font-bold tracking-[0.24em] text-[#742719] uppercase mb-1.5">
              CEREMONY DETAILS
            </span>
            <h3 className="font-cinzel text-2xl lg:text-3xl font-extrabold tracking-wide text-[#42100b] uppercase leading-tight">
              {event.name}
            </h3>
            {event.subTitle && (
              <p className="font-cormorant text-base lg:text-lg italic text-[#744c2c] font-semibold mt-1">
                {event.subTitle}
              </p>
            )}
          </div>

          {/* Date & Time */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-6 mb-2.5 sm:mb-4 pb-2.5 sm:pb-3.5 border-b border-[#d9ba9b]/40">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#fffdf8] text-[#742719] shrink-0 border border-[#d9ba9b]/70 flex items-center justify-center shadow-2xs mt-0.5">
                <Calendar size={14} />
              </div>
              <div>
                <span className="font-cinzel text-xs sm:text-sm font-bold text-[#42100b] block leading-snug">
                  {event.date}
                </span>
                {event.dayOfWeek && (
                  <span className="text-[11px] sm:text-xs text-[#705846] font-cormorant italic font-semibold block">
                    {event.dayOfWeek}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#fffdf8] text-[#742719] shrink-0 border border-[#d9ba9b]/70 flex items-center justify-center shadow-2xs mt-0.5">
                <Clock size={14} />
              </div>
              <div>
                <span className="font-cinzel text-xs sm:text-sm font-bold text-[#42100b] block leading-snug">
                  {event.startTime}
                  {event.endTime ? ` – ${event.endTime}` : " Onwards"}
                </span>
                {event.muhurthamTime && (
                  <span className="text-[11px] sm:text-xs text-[#8e3622] font-cinzel font-semibold block mt-0.5">
                    {event.muhurthamTime}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Venue */}
          <div className="flex items-start gap-2.5 mb-2.5 sm:mb-4">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#fffdf8] text-[#742719] shrink-0 border border-[#d9ba9b]/70 flex items-center justify-center shadow-2xs mt-0.5">
              <MapPin size={14} />
            </div>
            <div>
              <span className="font-cinzel text-xs sm:text-sm font-bold text-[#42100b] block leading-snug">
                {event.venue}
              </span>
              {event.address && (
                <span className="text-[11px] sm:text-xs text-[#744c2c] font-sans block mt-0.5 leading-snug">
                  {event.address}
                </span>
              )}
            </div>
          </div>

          {/* Interactive Google Maps Preview */}
          {showMap && (
            <div className="w-full mb-3 sm:mb-4">
              <EventMapPreview activeEventId={event.id} events={events} />
            </div>
          )}

          {/* Directions Button */}
          {showDirections && (
            <div className="flex items-center justify-start">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 py-2 px-5 sm:py-2.5 sm:px-7 rounded-full bg-gradient-to-r from-[#63140d] via-[#7e1d13] to-[#63140d] text-[#fffcf5] border border-[#d4af37]/80 shadow-md hover:shadow-lg text-xs sm:text-sm font-cinzel font-bold tracking-wider uppercase transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                <Navigation size={13} className="text-[#ffd700]" />
                <span>Get Directions</span>
                <span className="text-xs transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export const WeddingCelebrationsSection: React.FC<{ data: PelliPandiriData }> = ({ data }) => {
  const events = data.events.filter((e) => e.enabled);
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const startAutoCycle = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (events.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % events.length);
    }, 6000);
  }, [events.length]);

  useEffect(() => {
    startAutoCycle();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startAutoCycle]);

  if (events.length === 0) return null;

  const currentEvent = events[activeIndex] || events[0];

  return (
    <section
      id="events"
      aria-label="Wedding Celebrations"
      className="relative w-full overflow-hidden py-14 sm:py-18 md:py-24 bg-transparent text-[#542D25]"
    >
      {/* 
        SACRED ROTATING LOTUS MANDALA AT START OF WEDDING CELEBRATIONS
        Top half sits gracefully above, bottom half rotates continuously behind heading & event markers
      */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center">
        <motion.div
          animate={shouldReduceMotion ? {} : { rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="relative w-[380px] h-[380px] sm:w-[520px] sm:h-[520px] md:w-[640px] md:h-[640px] opacity-80 sm:opacity-85 drop-shadow-[0_4px_28px_rgba(212,175,55,0.25)]"
        >
          <Image
            src={data.assets.lotusMandala || "/templates/pelli-pandiri/decoration/Lotus-Mandala.png"}
            alt="Sacred Lotus Mandala"
            fill
            sizes="(max-width: 640px) 380px, (max-width: 768px) 520px, 640px"
            className="object-contain"
            priority
            unoptimized
          />
        </motion.div>
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 px-4 flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 mb-2 select-none">
            <span className="w-8 sm:w-16 h-px bg-gradient-to-r from-transparent to-[#b88636]" />
            <span className="text-[#b88636] text-xs">❦</span>
            <span className="font-cinzel text-[10.5px] sm:text-xs font-bold tracking-[0.28em] text-[#805527] uppercase">
              AUSPICIOUS CEREMONIES
            </span>
            <span className="text-[#b88636] text-xs">❦</span>
            <span className="w-8 sm:w-16 h-px bg-gradient-to-l from-transparent to-[#b88636]" />
          </div>

          <h2 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-[0.14em] text-[#42100b] uppercase leading-tight">
            Wedding Celebrations
          </h2>

          <p className="font-cormorant text-base sm:text-lg md:text-xl italic text-[#744c2c] font-semibold mt-1">
            Join us for these sacred moments of love and tradition
          </p>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#b88636] to-transparent mt-2" />
        </div>

        {/* Horizontal Event Nav Rail */}
        <div className="w-full flex items-center justify-center mb-6 sm:mb-10 px-1 sm:px-4">
          <div className="flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-4 md:gap-6 overflow-x-hidden sm:overflow-visible py-1 sm:py-2 px-1 max-w-full scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {events.map((evt, idx) => (
              <EventMarker
                key={evt.id}
                event={evt}
                isActive={idx === activeIndex}
                onClick={() => {
                  setActiveIndex(idx);
                  if (timerRef.current) clearInterval(timerRef.current);
                }}
              />
            ))}
          </div>
        </div>

        {/* Selected Event Details & Map */}
        <EventShowcase event={currentEvent} events={events} />
      </div>
    </section>
  );
};
