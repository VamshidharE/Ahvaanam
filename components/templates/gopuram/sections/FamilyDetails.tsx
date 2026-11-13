"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { MapPin } from "lucide-react";
import { useGopuram } from "../context";
import { GopuramFamilySide } from "../adapter";

export const FamilyDetails: React.FC = () => {
  const { data } = useGopuram();
  const { families, couple } = data;
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const primarySide = couple.primarySide || "groom";

  const renderFamilyCard = (side: GopuramFamilySide, isLeft: boolean) => {
    const parentNames = side.members && side.members.length > 0
      ? side.members.map((m) => m.name).filter(Boolean).join(" & ")
      : "";

    return (
      <motion.div
        key={side.title}
        initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -20 : 20 }}
        transition={{ duration: 0.65, delay: isLeft ? 0.15 : 0.25 }}
        className="w-full max-w-[240px] sm:max-w-[270px] md:max-w-[290px] lg:max-w-[310px] flex flex-col items-center text-center group"
      >
        {/* Arched Temple Frame with Gold Moulding */}
        <div
          className="relative w-full aspect-[4/5] p-2 sm:p-2.5 rounded-t-[6.5rem] sm:rounded-t-[7.5rem] md:rounded-t-[8.5rem] rounded-b-xl shadow-[0_12px_28px_rgba(80,45,25,0.22)] transition-transform duration-500 group-hover:scale-[1.02]"
          style={{
            background: "linear-gradient(180deg, #f7e7c4 0%, #d4af37 25%, #996f2d 65%, #c99f58 100%)",
          }}
        >
          {/* Inner Inset Rim */}
          <div className="relative w-full h-full rounded-t-[6rem] sm:rounded-t-[7rem] md:rounded-t-[8rem] rounded-b-lg overflow-hidden bg-[#241711] ring-1 ring-[#ffd700]/70">
            <Image
              src={side.portrait}
              alt={side.portraitAlt || side.title}
              fill
              sizes="(max-width: 640px) 240px, (max-width: 1024px) 290px, 310px"
              className="object-cover object-[center_20%] transition-transform duration-700 ease-out group-hover:scale-105"
              priority
              unoptimized
            />
            {/* Subtle vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Deep Maroon Cartouche Plaque Badge */}
        <div className="-mt-3.5 relative z-20 px-4 sm:px-5 py-1 rounded-full bg-gradient-to-r from-[#63140d] via-[#7e1d13] to-[#63140d] text-[#fffcf5] border border-[#d4af37] shadow-sm">
          <span className="font-cinzel text-[11px] sm:text-xs font-bold tracking-[0.18em] uppercase text-[#ffd700]">
            {side.title}
          </span>
        </div>

        {/* Parents' Names */}
        {parentNames && (
          <h3 className="font-cinzel text-sm sm:text-base md:text-lg font-bold text-[#42100b] tracking-wide mt-2.5 leading-snug">
            {parentNames}
          </h3>
        )}

        {/* Additional Family Members (if > 2 members) */}
        {side.members && side.members.length > 2 && (
          <div className="mt-1 flex flex-col items-center gap-0.5">
            {side.members.slice(2).map((m, idx) => (
              <p key={idx} className="font-cinzel text-xs sm:text-[13px] text-[#42100b]/80 tracking-wide">
                {m.role ? <span className="font-cormorant italic text-xs text-[#8e3622] mr-1">{m.role}:</span> : null}
                {m.name}
              </p>
            ))}
          </div>
        )}

        {/* Location with Pin */}
        {side.location && (
          <div className="inline-flex items-center gap-1.5 mt-1 text-[#744c2c]">
            <MapPin size={13} className="text-[#8e3622] shrink-0" />
            <span className="font-cormorant text-xs sm:text-sm font-semibold tracking-wide">
              {side.location}
            </span>
          </div>
        )}
      </motion.div>
    );
  };

  const leftSide = primarySide === "bride" ? families.bride : families.groom;
  const rightSide = primarySide === "bride" ? families.groom : families.bride;

  return (
    <section
      ref={sectionRef}
      id="our-families"
      aria-label="Our Families Section"
      className="relative w-full overflow-hidden bg-transparent pt-6 pb-2 sm:pt-8 sm:pb-3 md:pt-10 md:pb-4 text-[#42100b] select-none"
    >
      {/* ─────────────────────────────────────────────────────────────
       * BACKGROUND DECORATIVE ARTWORK (Kolam & Sacred Lotus Embellishments)
       * ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        {/* Sacred Lotus Mandala Kolam on Left */}
        <div className="absolute -top-12 -left-10 w-52 sm:w-72 h-52 sm:h-72 opacity-[0.18]">
          <Image
            src="/templates/gopuram/decoration/Lotus-Mandala.png"
            alt=""
            fill
            className="object-contain filter sepia"
            unoptimized
          />
        </div>

        {/* Sacred Lotus Mandala Kolam on Right */}
        <div className="absolute -top-12 -right-10 w-52 sm:w-72 h-52 sm:h-72 opacity-[0.18]">
          <Image
            src="/templates/gopuram/decoration/Lotus-Mandala.png"
            alt=""
            fill
            className="object-contain filter sepia"
            unoptimized
          />
        </div>

        {/* Blooming Pink & Gold Lotus Accent */}
        <div className="absolute bottom-4 right-4 sm:right-10 w-22 sm:w-28 h-22 sm:h-28 opacity-[0.22] scale-x-[-1]">
          <Image
            src="/templates/gopuram/events/lotus-corner.png"
            alt=""
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─────────────────────────────────────────────────────────────
         * 1. SECTION HEADER (Attractive Royal Architectural Cartouche Plaque)
         * ───────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-8 md:mb-9 flex flex-col items-center"
        >
          {/* Royal Architectural Cartouche Heading Plaque */}
          <div className="relative inline-flex items-center justify-center px-5 sm:px-8 py-1.5 sm:py-2 rounded-2xl bg-gradient-to-r from-[#5a1012] via-[#7e181e] to-[#5a1012] border-2 border-[#d4af37] shadow-[0_6px_20px_rgba(90,20,10,0.22)]">
            {/* Corner Filigree Brackets */}
            <div className="absolute top-1 left-1.5 w-2.5 h-2.5 border-t border-l border-[#ffd700]/70 pointer-events-none" />
            <div className="absolute top-1 right-1.5 w-2.5 h-2.5 border-t border-r border-[#ffd700]/70 pointer-events-none" />
            <div className="absolute bottom-1 left-1.5 w-2.5 h-2.5 border-b border-l border-[#ffd700]/70 pointer-events-none" />
            <div className="absolute bottom-1 right-1.5 w-2.5 h-2.5 border-b border-r border-[#ffd700]/70 pointer-events-none" />

            {/* Left Gold Wing Flourish */}
            <span className="hidden sm:inline-block w-6 sm:w-10 h-px bg-gradient-to-r from-transparent via-[#ffd700] to-transparent mr-2.5" />

            {/* Main Title Heading */}
            <h2 className="font-cinzel text-lg sm:text-xl md:text-2xl lg:text-[1.75rem] font-black tracking-[0.18em] sm:tracking-[0.22em] text-[#fffdf8] uppercase leading-tight [text-shadow:_0_1px_3px_rgba(0,0,0,0.6),_0_0_12px_rgba(255,215,0,0.35)]">
              {families.heading || "Our Families"}
            </h2>

            {/* Right Gold Wing Flourish */}
            <span className="hidden sm:inline-block w-6 sm:w-10 h-px bg-gradient-to-r from-transparent via-[#ffd700] to-transparent ml-2.5" />
          </div>

          {/* Subtitle in Distinct Italic Serif */}
          <p className="font-cormorant italic text-sm sm:text-base md:text-lg text-[#6e3a1f] font-bold tracking-wide mt-2 max-w-xl">
            &ldquo;{families.subheading || "The families that made this union possible"}&rdquo;
          </p>
        </motion.div>

        {/* ─────────────────────────────────────────────────────────────
         * 2. FAMILIES SHOWCASE (Proportioned Elegant Portraits)
         * ───────────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-14">
          {renderFamilyCard(leftSide, true)}
          {renderFamilyCard(rightSide, false)}
        </div>
      </div>
    </section>
  );
};
