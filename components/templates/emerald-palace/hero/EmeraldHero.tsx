"use client";

import React from "react";
import { motion } from "framer-motion";
import { RoyalJharokhaArch, VedicGaneshaCrest, RoyalDivider } from "../assets/Ornaments";
import { useEmeraldPalace } from "../context";
import HangingLamps from "./HangingLamps";

export function EmeraldHero() {
  const data = useEmeraldPalace();

  const isBrideFirst = data.couple.primarySide === "bride";
  const firstName = isBrideFirst ? data.couple.bride : data.couple.groom;
  const secondName = isBrideFirst ? data.couple.groom : data.couple.bride;

  return (
    <section className="ep-hero-section">
      <HangingLamps />

      <div className="w-full max-w-2xl relative z-10 flex flex-col items-center">
        {/* Top Jharokha Decorative Arch Header */}
        <div className="w-full max-w-lg mb-2 opacity-90">
          <RoyalJharokhaArch />
        </div>

        {/* Central Jharokha Glass Frame */}
        <motion.div
          className="ep-hero-jharokha-frame"
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Sacred Ganesha Emblem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mb-2"
          >
            <VedicGaneshaCrest />
          </motion.div>

          {/* Devanagari Sanskrit Mantra */}
          <motion.p
            className="ep-hero-mantra"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            {data.introduction.mantra}
          </motion.p>

          {/* Invitation Greeting / Eyebrow */}
          <motion.p
            className="ep-hero-eyebrow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.7 }}
          >
            {data.introduction.eyebrow}
          </motion.p>

          {/* Couple Names */}
          <motion.div
            className="ep-hero-couple-names flex flex-wrap items-center justify-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <span className="ep-gold-text">{firstName}</span>
            <span className="ep-hero-ampersand">&amp;</span>
            <span className="ep-gold-text">{secondName}</span>
          </motion.div>

          {/* Medallion Divider */}
          <RoyalDivider goldVariant="light" className="my-3 scale-90" />

          {/* Wedding Date & Venue Details */}
          <motion.div
            className="ep-hero-date-box"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
          >
            <span className="ep-hero-date-text">{data.wedding.date}</span>
            <span className="ep-hero-venue-text">
              {data.wedding.venue} • {data.wedding.city}
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="ep-scroll-down">
        <span>Scroll</span>
        <div className="ep-scroll-line" />
      </div>
    </section>
  );
}
export default EmeraldHero;
