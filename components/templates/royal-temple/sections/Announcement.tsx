"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { InvitationData } from "@/lib/template-engine/types";

export default function Announcement({ data }: { data: InvitationData }) {
  const shouldReduceMotion = useReducedMotion();

  const fadeIn = shouldReduceMotion
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true } }
    : { initial: { opacity: 0, y: 25 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

  return (
    <section className="relative py-16 px-4 flex justify-center bg-[#FCF8F0]">
      <div className="max-w-xl w-full">
        <motion.div {...fadeIn} className="rt-card p-8 sm:p-12 text-center">
          
          {/* Sacred Symbol */}
          <div className="text-3xl text-[#C59B27] mb-2 font-serif">
            𑁍
          </div>

          <p className="text-xs uppercase tracking-[3px] font-bold text-[#8C6B12] mb-3 font-serif">
            {data.introduction.familyTitle || "Wedding Invitation"}
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold text-[#68121A] font-serif mb-4">
            A Sacred Union
          </h2>

          <div className="rt-divider">
            <span className="rt-divider-line" />
            <span className="rt-divider-icon">✦</span>
            <span className="rt-divider-line" />
          </div>

          <p className="text-sm sm:text-base text-[#4A3B32] leading-relaxed max-w-md mx-auto my-4 font-serif italic">
            "{data.introduction.message || "We request the honor of your presence and heartfelt blessings as our families unite in the sacred celebration of love, tradition, and devotion."}"
          </p>

          <div className="mt-6 pt-6 border-t border-[#C59B27]/20 flex flex-col items-center">
            <p className="text-[10px] uppercase tracking-[2px] font-bold text-[#8C6B12]">
              Under the Auspices of the Almighty
            </p>
            <p className="text-xs text-[#68121A] font-semibold mt-1">
              {data.wedding.venue}, {data.wedding.city}
            </p>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
