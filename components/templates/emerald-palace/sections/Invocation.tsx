"use client";

import React from "react";
import { motion } from "framer-motion";
import { RoyalDivider, RoyalCornerOrnament } from "../assets/Ornaments";
import { useEmeraldPalace } from "../context";

export function Invocation() {
  const data = useEmeraldPalace();

  return (
    <section className="ep-section text-center" id="announcement">
      <motion.div
        className="ep-royal-card max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="ep-card-inner-border" />
        <RoyalCornerOrnament position="tl" className="absolute top-2 left-2 opacity-70" />
        <RoyalCornerOrnament position="tr" className="absolute top-2 right-2 opacity-70" />
        <RoyalCornerOrnament position="bl" className="absolute bottom-2 left-2 opacity-70" />
        <RoyalCornerOrnament position="br" className="absolute bottom-2 right-2 opacity-70" />

        <div className="relative z-10 px-2 sm:px-6">
          <span className="ep-section-tag">Royal Invitation Farman</span>
          <h2 className="ep-section-title ep-gold-text">
            {data.introduction.familyTitle}
          </h2>

          <RoyalDivider className="my-4" />

          <p className="font-serif text-lg sm:text-xl text-[#4A3B32] leading-relaxed italic mb-6">
            "{data.introduction.message}"
          </p>

          <div className="bg-[#FAF5EB] border border-[#DFB759]/40 rounded-xl p-4 sm:p-5 mt-4">
            <p className="font-serif text-sm sm:text-base text-[#6B5C50] leading-relaxed">
              We seek your auspicious presence, warm wishes, and heartfelt blessings as we unite two souls in holy matrimony and celebrate a glorious new chapter of love and companionship.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
export default Invocation;
