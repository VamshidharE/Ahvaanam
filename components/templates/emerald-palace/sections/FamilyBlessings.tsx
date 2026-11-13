"use client";

import React from "react";
import { motion } from "framer-motion";
import { TraditionalCornerKolam, TraditionalSikkuKolam } from "../assets/Ornaments";
import { useEmeraldPalace } from "../context";

export function FamilyBlessings() {
  const data = useEmeraldPalace();
  const isBrideFirst = data.couple.primarySide === "bride";

  const groomImg =
    data.family.groomFamilyImage || "/templates/emerald-palace/family-groom.jpg";
  const brideImg =
    data.family.brideFamilyImage || "/templates/emerald-palace/family-bride.jpg";

  const groomFocal = data.family.groomFamilyFocalPoint || "center 20%";
  const brideFocal = data.family.brideFamilyFocalPoint || "center 20%";

  const groomTitle = data.family.groomFamilyTitle || "The Gupta Family";
  const brideTitle = data.family.brideFamilyTitle || "The Rao Family";

  const groomParents =
    data.family.groomParents || "Sri Ramesh Gupta & Smt. Lalitha Gupta";
  const brideParents =
    data.family.brideParents || "Sri Prabhakar Rao & Smt. Sushma Rao";

  const blessingMessage =
    data.family.blessingQuote ||
    "Together, our families welcome you to celebrate this beautiful union.";

  const groomBlock = (
    <motion.div
      className="flex-1 flex flex-col w-full max-w-xl mx-auto lg:max-w-none"
      initial={{ opacity: 0, x: -35 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Editorial Photographic Frame */}
      <div className="relative group overflow-hidden rounded-3xl bg-[#FFFDF9] p-3 sm:p-4 border border-[#D6AD63]/60 shadow-[0_20px_50px_rgba(84,45,42,0.12)]">
        {/* High-Resolution Family Photograph */}
        <div className="relative overflow-hidden rounded-2xl aspect-[4/3] w-full bg-[#F7E8D0]/40 shadow-inner">
          <img
            src={groomImg}
            alt={`${groomTitle} Portrait`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            style={{ objectPosition: groomFocal }}
            loading="lazy"
          />
          {/* Subtle Warm Photographic Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-85 pointer-events-none" />

          {/* Integrated Identification Badge */}
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 pointer-events-none">
            <span className="font-cinzel text-[10px] sm:text-xs uppercase tracking-[0.22em] text-[#FFF6E9] font-bold drop-shadow-md bg-black/45 backdrop-blur-md px-3 py-1 rounded-full border border-white/25">
              Groom&apos;s Family
            </span>
          </div>
        </div>

        {/* Family Typography Suite */}
        <motion.div
          className="pt-5 pb-3 px-2 text-center"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="font-cinzel text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#B88A3B] font-bold block mb-1">
            Groom&apos;s Family
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#781D36] tracking-tight mb-2.5">
            {groomTitle}
          </h3>
          <div className="inline-block bg-[#FFF6E9]/90 border border-[#D6AD63]/40 rounded-full py-1.5 px-4 sm:px-6 shadow-sm">
            <span className="font-cinzel text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#781D36] font-bold mr-2">
              Parents
            </span>
            <span className="font-serif text-xs sm:text-sm md:text-base font-semibold text-[#542D2A]">
              {groomParents}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  const brideBlock = (
    <motion.div
      className="flex-1 flex flex-col w-full max-w-xl mx-auto lg:max-w-none"
      initial={{ opacity: 0, x: 35 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Editorial Photographic Frame */}
      <div className="relative group overflow-hidden rounded-3xl bg-[#FFFDF9] p-3 sm:p-4 border border-[#D6AD63]/60 shadow-[0_20px_50px_rgba(84,45,42,0.12)]">
        {/* High-Resolution Family Photograph */}
        <div className="relative overflow-hidden rounded-2xl aspect-[4/3] w-full bg-[#F7E8D0]/40 shadow-inner">
          <img
            src={brideImg}
            alt={`${brideTitle} Portrait`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            style={{ objectPosition: brideFocal }}
            loading="lazy"
          />
          {/* Subtle Warm Photographic Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-85 pointer-events-none" />

          {/* Integrated Identification Badge */}
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 pointer-events-none">
            <span className="font-cinzel text-[10px] sm:text-xs uppercase tracking-[0.22em] text-[#FFF6E9] font-bold drop-shadow-md bg-black/45 backdrop-blur-md px-3 py-1 rounded-full border border-white/25">
              Bride&apos;s Family
            </span>
          </div>
        </div>

        {/* Family Typography Suite */}
        <motion.div
          className="pt-5 pb-3 px-2 text-center"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="font-cinzel text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#B88A3B] font-bold block mb-1">
            Bride&apos;s Family
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#781D36] tracking-tight mb-2.5">
            {brideTitle}
          </h3>
          <div className="inline-block bg-[#FFF6E9]/90 border border-[#D6AD63]/40 rounded-full py-1.5 px-4 sm:px-6 shadow-sm">
            <span className="font-cinzel text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#781D36] font-bold mr-2">
              Parents
            </span>
            <span className="font-serif text-xs sm:text-sm md:text-base font-semibold text-[#542D2A]">
              {brideParents}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <section
      className="relative py-14 sm:py-20 px-4 sm:px-6 scroll-mt-16 ep-bg-family-embossed overflow-hidden border-b border-[#D6AD63]/30"
      id="family"
    >
      {/* Authentic South Indian Kolam Artwork in Section Corners */}
      <div className="absolute -top-6 -left-6 w-36 sm:w-52 pointer-events-none opacity-40 z-0">
        <TraditionalCornerKolam className="w-full h-auto" />
      </div>
      <div className="absolute -top-6 -right-6 w-36 sm:w-52 pointer-events-none opacity-40 z-0 scale-x-[-1]">
        <TraditionalCornerKolam className="w-full h-auto" />
      </div>
      <div className="hidden lg:block absolute -bottom-12 -left-12 w-48 xl:w-60 pointer-events-none opacity-25 z-0 ep-kolam-breathe">
        <TraditionalSikkuKolam className="w-full h-auto" />
      </div>
      <div className="hidden lg:block absolute -bottom-12 -right-12 w-48 xl:w-60 pointer-events-none opacity-25 z-0 ep-kolam-breathe">
        <TraditionalSikkuKolam className="w-full h-auto" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-2 sm:px-4">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto px-4">
          <span className="font-cinzel text-xs sm:text-sm uppercase tracking-[0.28em] text-[#B88A3B] font-bold block mb-2">
            THE UNION OF TWO FAMILIES
          </span>
          <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold text-[#781D36] tracking-tight uppercase">
            WITH THE BLESSINGS OF OUR FAMILIES
          </h2>
          {/* Refined Gold Hairline Divider */}
          <div className="flex items-center justify-center gap-3 my-3">
            <div className="w-12 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-[#D6AD63]" />
            <span className="text-[#D6AD63] text-xs">✦</span>
            <div className="w-12 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-[#D6AD63]" />
          </div>
        </div>

        {/* Desktop Horizontal Editorial Composition / Mobile Stacked */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-8 relative">
          {isBrideFirst ? (
            <>
              {brideBlock}
              {/* Elegant Central Divider (Desktop) */}
              <div className="hidden lg:flex flex-col items-center justify-center px-1 self-stretch">
                <div className="w-[1px] flex-1 bg-gradient-to-b from-transparent via-[#D6AD63]/60 to-[#D6AD63]" />
                <div className="w-8 h-8 rounded-full border border-[#D6AD63] bg-[#FFFDF9] flex items-center justify-center shadow-sm my-3 text-[#781D36]">
                  <span className="font-serif text-sm text-[#D6AD63]">✦</span>
                </div>
                <div className="w-[1px] flex-1 bg-gradient-to-b from-[#D6AD63] via-[#D6AD63]/60 to-transparent" />
              </div>
              {/* Transition Divider (Mobile) */}
              <div className="flex lg:hidden items-center justify-center my-2 gap-3 w-full max-w-xs mx-auto">
                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#D6AD63]/60" />
                <span className="text-[#D6AD63] text-xs">✦</span>
                <span className="font-cinzel text-[10px] uppercase tracking-[0.2em] text-[#781D36] font-bold">
                  &amp;
                </span>
                <span className="text-[#D6AD63] text-xs">✦</span>
                <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#D6AD63]/60" />
              </div>
              {groomBlock}
            </>
          ) : (
            <>
              {groomBlock}
              {/* Elegant Central Divider (Desktop) */}
              <div className="hidden lg:flex flex-col items-center justify-center px-1 self-stretch">
                <div className="w-[1px] flex-1 bg-gradient-to-b from-transparent via-[#D6AD63]/60 to-[#D6AD63]" />
                <div className="w-8 h-8 rounded-full border border-[#D6AD63] bg-[#FFFDF9] flex items-center justify-center shadow-sm my-3 text-[#781D36]">
                  <span className="font-serif text-sm text-[#D6AD63]">✦</span>
                </div>
                <div className="w-[1px] flex-1 bg-gradient-to-b from-[#D6AD63] via-[#D6AD63]/60 to-transparent" />
              </div>
              {/* Transition Divider (Mobile) */}
              <div className="flex lg:hidden items-center justify-center my-2 gap-3 w-full max-w-xs mx-auto">
                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#D6AD63]/60" />
                <span className="text-[#D6AD63] text-xs">✦</span>
                <span className="font-cinzel text-[10px] uppercase tracking-[0.2em] text-[#781D36] font-bold">
                  &amp;
                </span>
                <span className="text-[#D6AD63] text-xs">✦</span>
                <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#D6AD63]/60" />
              </div>
              {brideBlock}
            </>
          )}
        </div>

        {/* Short Combined Blessing Message */}
        <motion.div
          className="mt-12 sm:mt-16 text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="bg-[#FFFDF9]/95 border border-[#D6AD63]/40 rounded-full py-3 px-6 sm:px-10 shadow-sm inline-block">
            <p className="font-serif italic text-sm sm:text-base text-[#781D36] leading-relaxed">
              &ldquo;{blessingMessage}&rdquo;
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default FamilyBlessings;
