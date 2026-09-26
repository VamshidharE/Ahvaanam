"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { InvitationData } from "@/lib/template-engine/types";

export default function Couple({ data }: { data: InvitationData }) {
  const shouldReduceMotion = useReducedMotion();

  const fadeIn = shouldReduceMotion
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true } }
    : { initial: { opacity: 0, y: 25 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

  const { groom, bride } = data.couple;

  return (
    <section className="relative py-16 px-4 flex justify-center bg-[#FAF6EE]">
      <div className="max-w-4xl w-full">
        
        {/* Section Heading */}
        <div className="text-center mb-10">
          <p className="text-[10px] uppercase tracking-[3px] font-bold text-[#8C6B12] font-serif">
            Auspicious Match
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#68121A] font-serif mt-1">
            The Bride & Groom
          </h2>
          <div className="rt-divider">
            <span className="rt-divider-line" />
            <span className="rt-divider-icon">❦</span>
            <span className="rt-divider-line" />
          </div>
        </div>

        {/* Couple Presentation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Groom Card */}
          <motion.div {...fadeIn} className="rt-card p-6 sm:p-8 flex flex-col items-center text-center justify-between">
            <div className="flex flex-col items-center w-full">
              {/* Photo Frame */}
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-2 border-2 border-[#C59B27] shadow-lg mb-6 bg-white">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={groom.image || "/wedding/couple/groom.png"}
                    alt={groom.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#68121A] text-[#FFF8EB] text-[9px] uppercase font-bold tracking-[2px] px-4 py-1 rounded-full border border-[#C59B27]">
                  Groom
                </span>
              </div>

              <h3 className="text-2xl font-bold text-[#68121A] font-serif mt-2">
                {groom.name}
              </h3>

              {groom.surname && (
                <p className="text-xs uppercase tracking-[2px] text-[#8C6B12] font-semibold mt-0.5">
                  {groom.surname}
                </p>
              )}

              <p className="text-xs text-[#5C4838] mt-3 italic font-serif">
                {groom.parents || "Son of Beloved Parents"}
              </p>

              {groom.bio && (
                <p className="text-xs text-[#6E5C4F] mt-4 leading-relaxed max-w-xs">
                  {groom.bio}
                </p>
              )}
            </div>
          </motion.div>

          {/* Bride Card */}
          <motion.div {...fadeIn} transition={{ delay: 0.15 }} className="rt-card p-6 sm:p-8 flex flex-col items-center text-center justify-between">
            <div className="flex flex-col items-center w-full">
              {/* Photo Frame */}
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-2 border-2 border-[#C59B27] shadow-lg mb-6 bg-white">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={bride.image || "/wedding/couple/bride.png"}
                    alt={bride.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#68121A] text-[#FFF8EB] text-[9px] uppercase font-bold tracking-[2px] px-4 py-1 rounded-full border border-[#C59B27]">
                  Bride
                </span>
              </div>

              <h3 className="text-2xl font-bold text-[#68121A] font-serif mt-2">
                {bride.name}
              </h3>

              {bride.surname && (
                <p className="text-xs uppercase tracking-[2px] text-[#8C6B12] font-semibold mt-0.5">
                  {bride.surname}
                </p>
              )}

              <p className="text-xs text-[#5C4838] mt-3 italic font-serif">
                {bride.parents || "Daughter of Beloved Parents"}
              </p>

              {bride.bio && (
                <p className="text-xs text-[#6E5C4F] mt-4 leading-relaxed max-w-xs">
                  {bride.bio}
                </p>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
