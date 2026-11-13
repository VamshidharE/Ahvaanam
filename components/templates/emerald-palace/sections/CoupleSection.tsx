"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  RoyalDivider,
  TraditionalBotanicalVine,
  TraditionalPaisleyMango,
  TraditionalCornerKolam,
  TraditionalPulliKolam,
  TraditionalSikkuKolam,
} from "../assets/Ornaments";
import { useEmeraldPalace } from "../context";

export function CoupleSection() {
  const data = useEmeraldPalace();
  const isBrideFirst = data.couple.primarySide === "bride";

  const largePortrait =
    data.couple.portraitImage ||
    data.family.groomPortrait ||
    "/templates/emerald-palace/couple-portrait-large.jpg";

  const groomName = data.couple.groom;
  const brideName = data.couple.bride;

  const groomParents = data.family.groomParents.startsWith("S/o")
    ? data.family.groomParents
    : `S/o ${data.family.groomParents}`;

  const brideParents = data.family.brideParents.startsWith("D/o")
    ? data.family.brideParents
    : `D/o ${data.family.brideParents}`;

  const firstPerson = isBrideFirst
    ? { name: brideName, relation: brideParents, title: "The Bride", bio: data.couple.brideBio }
    : { name: groomName, relation: groomParents, title: "The Groom", bio: data.couple.groomBio };

  const secondPerson = isBrideFirst
    ? { name: groomName, relation: groomParents, title: "The Groom", bio: data.couple.groomBio }
    : { name: brideName, relation: brideParents, title: "The Bride", bio: data.couple.brideBio };

  return (
    <section className="relative py-14 sm:py-20 px-4 sm:px-6 scroll-mt-16 ep-bg-couple-sandstone overflow-hidden border-b border-[#D6AD63]/30" id="couple">
      {/* Authentic South Indian Kolam Artwork in Corners & Flanks */}
      <div className="absolute -top-8 -left-8 w-36 sm:w-52 pointer-events-none opacity-35 z-0">
        <TraditionalCornerKolam className="w-full h-auto" />
      </div>
      <div className="absolute -top-8 -right-8 w-36 sm:w-52 pointer-events-none opacity-35 z-0 scale-x-[-1]">
        <TraditionalCornerKolam className="w-full h-auto" />
      </div>
      <div className="hidden lg:block absolute -left-10 top-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-30 w-36 xl:w-48 ep-kolam-breathe">
        <TraditionalSikkuKolam className="w-full h-auto" />
      </div>
      <div className="hidden lg:block absolute -right-10 top-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-30 w-36 xl:w-48 ep-kolam-breathe">
        <TraditionalPulliKolam className="w-full h-auto" />
      </div>

      {/* Centered Sacred Union Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 px-4 relative z-10">
        <span className="font-cinzel text-xs uppercase tracking-[0.25em] text-[#781D36] font-bold">
          Sacred Union
        </span>
        <h2 className="font-serif text-xl sm:text-2xl text-[#542D2A] mt-2 mb-3 leading-relaxed italic">
          "With the blessings of our families,
          <br className="hidden sm:inline" /> we joyfully invite you to celebrate the wedding of"
        </h2>
        <RoyalDivider className="my-3 scale-90" />
      </div>

      {/* Large Photographic Showcase with Royal Typography */}
      <div className="max-w-5xl mx-auto px-4">
        {/* Desktop 3-Column Editorial Grid / Mobile Stacked Composition */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-10">
          {/* Column 1: First Person Details (Desktop Left) */}
          <motion.div
            className="flex-1 text-center lg:text-right max-w-sm order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block font-cinzel text-[11px] uppercase tracking-[0.25em] text-[#B88A3B] font-bold mb-1 pb-1 border-b border-[#D6AD63]/40">
              {firstPerson.title}
            </span>
            <h3 className="font-script text-4xl sm:text-5xl lg:text-6xl text-[#781D36] my-1 leading-tight">
              {firstPerson.name}
            </h3>
            <p className="font-cinzel text-xs sm:text-sm font-semibold text-[#542D2A] leading-relaxed mt-1">
              {firstPerson.relation}
            </p>
            {firstPerson.bio && (
              <p className="font-serif text-xs text-[#7E5B58] mt-3 italic leading-relaxed hidden sm:block">
                "{firstPerson.bio}"
              </p>
            )}
          </motion.div>

          {/* Center Column: Grand High-Resolution Couple Portrait */}
          <motion.div
            className="relative flex-shrink-0 w-full max-w-md sm:max-w-lg lg:max-w-md order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Elegant Outer Multi-Layer Frame with Gold Foil Corners */}
            <div className="relative p-2.5 sm:p-3.5 bg-gradient-to-b from-[#FFFDF9] to-[#F7E8D0] rounded-3xl shadow-[0_20px_50px_rgba(120,29,54,0.18)] border border-[#D6AD63]/50">
              {/* Corner Ornaments */}
              <div className="absolute top-2 left-2 w-6 h-6 opacity-60 pointer-events-none">
                <TraditionalCornerKolam className="w-full h-full" />
              </div>
              <div className="absolute top-2 right-2 w-6 h-6 opacity-60 pointer-events-none scale-x-[-1]">
                <TraditionalCornerKolam className="w-full h-full" />
              </div>
              <div className="absolute bottom-2 left-2 w-6 h-6 opacity-60 pointer-events-none scale-y-[-1]">
                <TraditionalCornerKolam className="w-full h-full" />
              </div>
              <div className="absolute bottom-2 right-2 w-6 h-6 opacity-60 pointer-events-none scale-[-1]">
                <TraditionalCornerKolam className="w-full h-full" />
              </div>

              {/* Main Photograph */}
              <div className="relative overflow-hidden rounded-2xl aspect-[3/4] w-full">
                <img
                  src={largePortrait}
                  alt={`${groomName} & ${brideName} Wedding Portrait`}
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                {/* Subtle warm sunset gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />

                {/* Floating Monogram Pill at Bottom of Photo */}
                <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none">
                  <div className="bg-[#FFF6E9]/90 backdrop-blur-md px-5 py-1.5 rounded-full border border-[#D6AD63] shadow-lg flex items-center gap-2">
                    <span className="font-cinzel text-xs font-bold tracking-widest text-[#781D36]">
                      {data.couple.monogram || `${groomName.charAt(0)} & ${brideName.charAt(0)}`}
                    </span>
                    <span className="text-[#D6AD63] text-xs">✦</span>
                    <span className="font-serif text-xs italic text-[#542D2A]">Forever Together</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Column 3: Second Person Details (Desktop Right) */}
          <motion.div
            className="flex-1 text-center lg:text-left max-w-sm order-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <span className="inline-block font-cinzel text-[11px] uppercase tracking-[0.25em] text-[#B88A3B] font-bold mb-1 pb-1 border-b border-[#D6AD63]/40">
              {secondPerson.title}
            </span>
            <h3 className="font-script text-4xl sm:text-5xl lg:text-6xl text-[#781D36] my-1 leading-tight">
              {secondPerson.name}
            </h3>
            <p className="font-cinzel text-xs sm:text-sm font-semibold text-[#542D2A] leading-relaxed mt-1">
              {secondPerson.relation}
            </p>
            {secondPerson.bio && (
              <p className="font-serif text-xs text-[#7E5B58] mt-3 italic leading-relaxed hidden sm:block">
                "{secondPerson.bio}"
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
export default CoupleSection;
