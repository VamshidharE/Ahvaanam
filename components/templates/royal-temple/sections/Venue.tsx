"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin, Navigation, Calendar, Clock } from "lucide-react";
import { InvitationData } from "@/lib/template-engine/types";

export default function Venue({ data }: { data: InvitationData }) {
  const shouldReduceMotion = useReducedMotion();

  const fadeIn = shouldReduceMotion
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true } }
    : { initial: { opacity: 0, y: 25 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

  const { wedding, reception } = data;

  return (
    <section className="relative py-16 px-4 flex justify-center bg-[#FCF8F0]">
      <div className="max-w-4xl w-full">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <p className="text-[10px] uppercase tracking-[3px] font-bold text-[#8C6B12] font-serif">
            Sacred Destinations
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#68121A] font-serif mt-1">
            Ceremony Venues
          </h2>
          <div className="rt-divider">
            <span className="rt-divider-line" />
            <span className="rt-divider-icon">𑁍</span>
            <span className="rt-divider-line" />
          </div>
        </div>

        <div className={`grid grid-cols-1 ${reception?.enabled ? "md:grid-cols-2" : "max-w-xl mx-auto"} gap-8`}>
          
          {/* Wedding Venue Card */}
          <motion.div {...fadeIn} className="rt-card p-6 sm:p-8 flex flex-col justify-between text-center">
            <div>
              <div className="text-2xl text-[#C59B27] mb-2 font-serif">𑁍</div>
              <span className="text-[9px] uppercase tracking-[2px] font-bold px-3 py-1 rounded-full bg-white border border-[#C59B27]/40 text-[#8C6B12]">
                Auspicious Muhurtham
              </span>

              <h3 className="text-2xl font-bold text-[#68121A] font-serif mt-4 mb-2">
                {wedding.venue}
              </h3>

              <p className="text-xs text-[#5C4838] font-medium mb-4 flex items-center justify-center gap-1.5">
                <MapPin size={14} className="text-[#C59B27] shrink-0" />
                <span>{wedding.city}</span>
              </p>

              <div className="my-4 py-3 border-y border-[#C59B27]/20 space-y-1.5 text-xs text-[#4A3B32]">
                <div className="flex items-center justify-center gap-2">
                  <Calendar size={13} className="text-[#C59B27]" />
                  <span className="font-semibold">{wedding.date}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock size={13} className="text-[#C59B27]" />
                  <span className="font-semibold">{wedding.time}</span>
                </div>
              </div>
            </div>

            {wedding.mapsLink && (
              <a
                href={wedding.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="rt-btn text-xs mt-2 w-full"
              >
                <Navigation size={14} /> Get Directions
              </a>
            )}
          </motion.div>

          {/* Reception Venue Card (if enabled) */}
          {reception?.enabled && (
            <motion.div {...fadeIn} transition={{ delay: 0.15 }} className="rt-card p-6 sm:p-8 flex flex-col justify-between text-center">
              <div>
                <div className="text-2xl text-[#C59B27] mb-2 font-serif">❦</div>
                <span className="text-[9px] uppercase tracking-[2px] font-bold px-3 py-1 rounded-full bg-white border border-[#C59B27]/40 text-[#8C6B12]">
                  Grand Reception
                </span>

                <h3 className="text-2xl font-bold text-[#68121A] font-serif mt-4 mb-2">
                  {reception.venue}
                </h3>

                <p className="text-xs text-[#5C4838] font-medium mb-4 flex items-center justify-center gap-1.5">
                  <MapPin size={14} className="text-[#C59B27] shrink-0" />
                  <span>{reception.city}</span>
                </p>

                <div className="my-4 py-3 border-y border-[#C59B27]/20 space-y-1.5 text-xs text-[#4A3B32]">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar size={13} className="text-[#C59B27]" />
                    <span className="font-semibold">{reception.date}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Clock size={13} className="text-[#C59B27]" />
                    <span className="font-semibold">{reception.time}</span>
                  </div>
                </div>
              </div>

              {reception.mapsLink && (
                <a
                  href={reception.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rt-btn text-xs mt-2 w-full"
                >
                  <Navigation size={14} /> Get Directions
                </a>
              )}
            </motion.div>
          )}

        </div>
      </div>
    </section>
  );
}
