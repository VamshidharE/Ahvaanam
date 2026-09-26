"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import TempleArch from "./TempleArch";
import TemplePillars from "./TemplePillars";
import TempleDiyas from "./TempleDiyas";
import TempleFloor from "./TempleFloor";
import { InvitationData } from "@/lib/template-engine/types";

interface RoyalTempleHeroProps {
  data: InvitationData;
}

export default function RoyalTempleHero({ data }: RoyalTempleHeroProps) {
  const shouldReduceMotion = useReducedMotion();

  const firstName = data.couple.primarySide === "bride" ? data.couple.bride.name : data.couple.groom.name;
  const secondName = data.couple.primarySide === "bride" ? data.couple.groom.name : data.couple.bride.name;

  const fadeIn = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.4 } }
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 } };

  return (
    <section className="relative w-full min-h-[100svh] flex flex-col items-center justify-between overflow-hidden bg-[#FAF6EE] text-center px-4 py-8 select-none">
      
      {/* 1. Backdrop Vista: Temple Complex & Golden Sunrise */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/templates/royal-temple/backgrounds/temple_backdrop.jpg"
          alt="Temple Gopuram and Golden Sunrise"
          fill
          priority
          className="object-cover object-center opacity-85"
        />
        {/* Soft Golden Ambient Light Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FDF8EE]/50 via-transparent to-[#FDF8EE]/70 pointer-events-none" />
      </div>

      {/* 2. Layered Temple Architecture Frame */}
      <TempleArch />
      <TemplePillars />
      <TempleDiyas />
      <TempleFloor />

      {/* 3. Central Ceremonial Typography & Information */}
      <div className="relative z-15 max-w-[420px] sm:max-w-[480px] w-full flex flex-col items-center justify-center my-auto pt-16 pb-20 px-6 sm:px-8">
        <motion.div {...fadeIn} className="flex flex-col items-center space-y-3 sm:space-y-4">
          
          {/* Sacred Ganesha / Motif */}
          <div className="flex flex-col items-center">
            <span className="text-[#C59B27] text-2xl sm:text-3xl leading-none">ॐ</span>
            {/* Mantra */}
            <p className="text-[9px] sm:text-[10px] uppercase tracking-[3px] font-bold text-[#8C6B12] mt-1 font-serif">
              {data.introduction.mantra || "|| SHREE GANESHAYA NAMAH ||"}
            </p>
          </div>

          {/* Invitation Eyebrow */}
          <p className="text-[8.5px] sm:text-[10px] uppercase tracking-[1.5px] text-[#5C4838] font-semibold max-w-[320px] leading-relaxed">
            {data.introduction.eyebrow || "TOGETHER WITH THEIR FAMILIES WE CORDIALLY INVITE YOU TO THE WEDDING CEREMONY OF"}
          </p>

          {/* Couple Names in Deep Royal Maroon Calligraphy */}
          <div className="py-1">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif text-[#68121A] tracking-normal leading-tight">
              {firstName}
            </h1>
            <div className="flex items-center justify-center gap-3 my-1">
              <span className="h-[1px] w-10 bg-gradient-to-r from-transparent to-[#C59B27]" />
              <span className="text-xl sm:text-2xl text-[#C59B27] font-serif italic">&</span>
              <span className="h-[1px] w-10 bg-gradient-to-l from-transparent to-[#C59B27]" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif text-[#68121A] tracking-normal leading-tight">
              {secondName}
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-[8px] sm:text-[9px] uppercase tracking-[2px] text-[#8C6B12] font-semibold">
            TWO HEARTS ✦ ONE SOUL ✦ A LIFETIME TOGETHER
          </p>

          {/* Lotus / Floral Divider */}
          <div className="text-[#C59B27] text-sm leading-none my-1">
            𑁍
          </div>

          {/* Date & Time Block */}
          <div className="bg-white/80 backdrop-blur-sm border border-[#C59B27]/40 rounded-xl px-5 py-2.5 shadow-sm text-center">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-[2px] font-bold text-[#8C6B12] mb-0.5">
              WEDDING CEREMONY
            </p>
            <p className="text-base sm:text-lg font-bold text-[#68121A] font-serif">
              {data.wedding.date}
            </p>
            <p className="text-[9px] sm:text-[10px] uppercase tracking-[1.5px] text-[#5C4838] font-semibold mt-0.5">
              AT {data.wedding.time}
            </p>
          </div>

          {/* Sacred Temple Venue */}
          <div className="space-y-0.5 text-center">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[1.5px] text-[#68121A] font-serif">
              {data.wedding.venue}
            </p>
            <p className="text-[8.5px] sm:text-[9.5px] uppercase tracking-[1px] text-[#5C4838]">
              {data.wedding.city}
            </p>
          </div>

          {/* Closing Blessing */}
          <p className="text-[10px] sm:text-xs italic font-serif text-[#8C6B12] pt-1">
            With best wishes & blessings
          </p>

        </motion.div>
      </div>

      {/* 4. Scroll Down Hint */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="relative z-20 flex flex-col items-center text-[#8C6B12] pb-2 cursor-pointer"
      >
        <span className="text-[7.5px] uppercase tracking-[2px] font-bold mb-1">Scroll to Explore</span>
        <ChevronDown size={14} className="text-[#C59B27]" />
      </motion.div>

    </section>
  );
}
