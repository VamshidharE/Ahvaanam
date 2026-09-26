"use client";

import React from "react";
import { motion } from "framer-motion";
import { RoyalDivider } from "../assets/Ornaments";
import { useEmeraldPalace } from "../context";

export function VenueConcierge() {
  const data = useEmeraldPalace();

  return (
    <section className="ep-section" id="venue">
      <div className="text-center mb-6">
        <span className="ep-section-tag">Royal Destinations</span>
        <h2 className="ep-section-title ep-gold-text">Venue &amp; Hospitality</h2>
        <p className="ep-section-subtitle">
          We look forward to welcoming you to the heritage city of lakes and royal palaces.
        </p>
        <RoyalDivider className="my-3 scale-90" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Main Wedding Venue Card */}
        <motion.div
          className="ep-royal-card flex flex-col justify-between"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🏰</span>
              <span className="text-xs uppercase tracking-[0.2em] text-[#9C7723] font-cinzel font-bold">
                Wedding Venue
              </span>
            </div>
            <h3 className="font-cinzel text-xl font-bold text-[#0C2B22] mb-1">
              {data.wedding.venue}
            </h3>
            <p className="font-serif text-sm text-[#6B5C50] mb-4">
              {data.wedding.address || data.wedding.city}
            </p>

            <div className="rounded-xl overflow-hidden border border-[#DFB759]/40 h-44 mb-4">
              <iframe
                title="Wedding Venue Map"
                src={data.wedding.mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <a
            href={data.wedding.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="ep-btn-emerald w-full text-center text-xs"
          >
            <span>🧭 Open in Google Maps</span>
          </a>
        </motion.div>

        {/* Reception Venue Card (or Hospitality Card) */}
        {data.reception?.enabled ? (
          <motion.div
            className="ep-royal-card flex flex-col justify-between"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">👑</span>
                <span className="text-xs uppercase tracking-[0.2em] text-[#9C7723] font-cinzel font-bold">
                  Reception Venue
                </span>
              </div>
              <h3 className="font-cinzel text-xl font-bold text-[#0C2B22] mb-1">
                {data.reception.venue}
              </h3>
              <p className="font-serif text-sm text-[#6B5C50] mb-4">
                {data.reception.address || data.reception.city}
              </p>

              <div className="rounded-xl overflow-hidden border border-[#DFB759]/40 h-44 mb-4">
                <iframe
                  title="Reception Venue Map"
                  src={data.reception.mapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <a
              href={data.reception.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ep-btn-emerald w-full text-center text-xs"
            >
              <span>🧭 Open in Google Maps</span>
            </a>
          </motion.div>
        ) : (
          <motion.div
            className="ep-royal-card flex flex-col justify-between"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🛎️</span>
                <span className="text-xs uppercase tracking-[0.2em] text-[#9C7723] font-cinzel font-bold">
                  Royal Hospitality &amp; Travel
                </span>
              </div>
              <h3 className="font-cinzel text-xl font-bold text-[#0C2B22] mb-3">
                Guest Assistance
              </h3>
              <p className="font-serif text-sm text-[#6B5C50] leading-relaxed mb-4">
                Airport &amp; railway transfers will be arranged for outstation guests. Please share your flight or train arrival details with our hospitality concierge desk in advance.
              </p>
              <div className="bg-[#FAF5EB] p-4 rounded-xl border border-[#DFB759]/30 text-xs font-cinzel space-y-2">
                <div className="text-[#0C2B22] font-semibold">📍 Nearest Airport: Maharana Pratap Airport (UDR)</div>
                <div className="text-[#0C2B22] font-semibold">🚆 Nearest Railway: Udaipur City Station</div>
              </div>
            </div>

            <a
              href={data.wedding.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ep-btn-emerald w-full text-center text-xs mt-4"
            >
              <span>🧭 Open in Google Maps</span>
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
export default VenueConcierge;
