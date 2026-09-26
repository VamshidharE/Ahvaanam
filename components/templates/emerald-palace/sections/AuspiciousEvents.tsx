"use client";

import React from "react";
import { motion } from "framer-motion";
import { RoyalDivider } from "../assets/Ornaments";
import { useEmeraldPalace } from "../context";

export function AuspiciousEvents() {
  const data = useEmeraldPalace();
  const enabledEvents = data.events.filter((e) => e.enabled !== false);

  const handleAddToCalendar = (event: typeof enabledEvents[0]) => {
    const title = encodeURIComponent(`${event.title} — ${data.couple.bride} & ${data.couple.groom}`);
    const details = encodeURIComponent(`${event.description}\nVenue: ${event.venue}\nDress Code: ${event.dressCode || "Traditional"}`);
    const location = encodeURIComponent(`${event.venue}, ${data.wedding.city}`);
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(url, "_blank");
  };

  return (
    <section className="ep-section" id="events">
      <div className="text-center mb-6">
        <span className="ep-section-tag">Auspicious Celebrations</span>
        <h2 className="ep-section-title ep-gold-text">Wedding Itinerary</h2>
        <p className="ep-section-subtitle">
          Join us as we celebrate each joyous milestone with music, royal feasting, and heartfelt traditions.
        </p>
        <RoyalDivider className="my-3 scale-90" />
      </div>

      <div className="ep-events-grid">
        {enabledEvents.map((ev, index) => (
          <motion.div
            key={ev.id || index}
            className="ep-event-card"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: index * 0.12 }}
          >
            <div className="flex items-center justify-between">
              <span className="ep-event-icon-badge">{ev.icon || "🪔"}</span>
              {ev.auspiciousTime && (
                <span className="text-[0.7rem] uppercase tracking-wider text-[#8B1E2F] font-bold bg-[#8B1E2F]/10 px-3 py-1 rounded-full border border-[#8B1E2F]/20">
                  {ev.auspiciousTime}
                </span>
              )}
            </div>

            <h3 className="ep-event-title">{ev.title}</h3>
            {ev.subtitle && <p className="ep-event-subtitle">{ev.subtitle}</p>}

            <div className="ep-event-meta">
              <div className="ep-event-meta-row">
                <span className="text-[#9C7723]">📅</span>
                <span className="font-semibold">{ev.date}</span>
              </div>
              <div className="ep-event-meta-row">
                <span className="text-[#9C7723]">⏰</span>
                <span>{ev.time}</span>
              </div>
              <div className="ep-event-meta-row">
                <span className="text-[#9C7723]">📍</span>
                <span className="italic">{ev.venue}</span>
              </div>
            </div>

            <p className="ep-event-desc">{ev.description}</p>

            <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-[#DFB759]/20">
              {ev.dressCode && (
                <span className="ep-event-dresscode">
                  Attire: {ev.dressCode}
                </span>
              )}
              <button
                onClick={() => handleAddToCalendar(ev)}
                className="text-xs uppercase tracking-wider text-[#0C2B22] font-cinzel font-bold hover:text-[#9C7723] transition-colors inline-flex items-center gap-1"
                aria-label={`Add ${ev.title} to calendar`}
              >
                <span>+ Add to Calendar</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
export default AuspiciousEvents;
