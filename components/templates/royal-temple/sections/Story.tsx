"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { InvitationData } from "@/lib/template-engine/types";

export default function Story({ data }: { data: InvitationData }) {
  const shouldReduceMotion = useReducedMotion();

  const fadeIn = shouldReduceMotion
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true } }
    : { initial: { opacity: 0, y: 25 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

  if (!data.story.enabled || !data.story.text) return null;

  return (
    <section className="relative py-16 px-4 flex justify-center bg-[#FCF8F0]">
      <div className="max-w-3xl w-full">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <p className="text-[10px] uppercase tracking-[3px] font-bold text-[#8C6B12] font-serif">
            Destined by the Heavens
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#68121A] font-serif mt-1">
            {data.story.title || "Our Journey Together"}
          </h2>
          <div className="rt-divider">
            <span className="rt-divider-line" />
            <span className="rt-divider-icon">❦</span>
            <span className="rt-divider-line" />
          </div>
        </div>

        <motion.div {...fadeIn} className="rt-card p-6 sm:p-10 flex flex-col md:flex-row items-center gap-8">
          {data.story.couplePhoto && (
            <div className="relative w-44 h-56 sm:w-52 sm:h-64 shrink-0 rounded-2xl overflow-hidden border-2 border-[#C59B27] shadow-md">
              <Image
                src={data.story.couplePhoto}
                alt="Couple Moment"
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex flex-col text-center md:text-left justify-center">
            <p className="text-sm sm:text-base text-[#4A3B32] leading-relaxed font-serif italic mb-4">
              "{data.story.text}"
            </p>
            <p className="text-[10px] uppercase tracking-[2px] font-bold text-[#8C6B12]">
              Two Souls Bound by Devotion
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
