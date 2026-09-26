"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";
import { InvitationData } from "@/lib/template-engine/types";

export default function Events({ data }: { data: InvitationData }) {
  const shouldReduceMotion = useReducedMotion();

  const fadeIn = shouldReduceMotion
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true } }
    : { initial: { opacity: 0, y: 25 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

  const activeEvents = data.events.filter((e) => e.enabled !== false);
  if (activeEvents.length === 0) return null;

  return (
    <section className="relative py-16 px-4 flex justify-center bg-[#FAF6EE]">
      <div className="max-w-4xl w-full">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <p className="text-[10px] uppercase tracking-[3px] font-bold text-[#8C6B12] font-serif">
            Sacred Auspicious Timings
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#68121A] font-serif mt-1">
            Ceremony Itinerary
          </h2>
          <div className="rt-divider">
            <span className="rt-divider-line" />
            <span className="rt-divider-icon">𑁍</span>
            <span className="rt-divider-line" />
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeEvents.map((event, idx) => (
            <motion.div
              key={event.id || idx}
              {...fadeIn}
              transition={{ delay: idx * 0.1 }}
              className="rt-event-card flex flex-col justify-between"
            >
              <div>
                {/* Event Icon / Diya */}
                <div className="flex items-center justify-between border-b border-[#C59B27]/25 pb-3 mb-4">
                  <span className="text-2xl">{event.icon || "✨"}</span>
                  <span className="text-[9px] uppercase tracking-[2px] font-bold px-3 py-1 rounded-full bg-[#FCF8F0] border border-[#C59B27]/40 text-[#8C6B12]">
                    Event {idx + 1}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#68121A] font-serif mb-3">
                  {event.title}
                </h3>

                {/* Timing Info */}
                <div className="space-y-2 mb-4 text-xs text-[#5C4838]">
                  <div className="flex items-center gap-2 font-medium">
                    <Calendar size={14} className="text-[#C59B27] shrink-0" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <Clock size={14} className="text-[#C59B27] shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <MapPin size={14} className="text-[#C59B27] shrink-0" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                </div>

                {event.description && (
                  <p className="text-xs text-[#6E5C4F] leading-relaxed italic font-serif">
                    "{event.description}"
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
