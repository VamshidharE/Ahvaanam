"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { InvitationData } from "@/lib/template-engine/types";

export default function Family({ data }: { data: InvitationData }) {
  const shouldReduceMotion = useReducedMotion();

  const fadeIn = shouldReduceMotion
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true } }
    : { initial: { opacity: 0, y: 25 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

  const { family } = data;
  const hasGroomFamily = family.groomFamily && family.groomFamily.length > 0;
  const hasBrideFamily = family.brideFamily && family.brideFamily.length > 0;

  if (!hasGroomFamily && !hasBrideFamily && !family.groomParents && !family.brideParents) {
    return null;
  }

  return (
    <section className="relative py-16 px-4 flex justify-center bg-[#FCF8F0]">
      <div className="max-w-4xl w-full">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <p className="text-[10px] uppercase tracking-[3px] font-bold text-[#8C6B12] font-serif">
            With Blessings & Affection
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#68121A] font-serif mt-1">
            {family.title || "Our Beloved Families"}
          </h2>
          <div className="rt-divider">
            <span className="rt-divider-line" />
            <span className="rt-divider-icon">𑁍</span>
            <span className="rt-divider-line" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Groom Family */}
          <motion.div {...fadeIn} className="rt-card p-6 sm:p-8 text-center flex flex-col justify-between">
            <div>
              <div className="text-2xl text-[#C59B27] mb-2 font-serif">❧</div>
              <h3 className="text-xl font-bold text-[#68121A] font-serif mb-1">
                {family.groomFamilyTitle || "Groom's Family"}
              </h3>
              <p className="text-xs text-[#8C6B12] font-medium mb-4">
                {family.groomParents}
              </p>

              {hasGroomFamily && (
                <div className="mt-4 pt-4 border-t border-[#C59B27]/20 space-y-2">
                  {family.groomFamily.map((member, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs px-4 py-1.5 rounded-lg bg-white/50 border border-[#C59B27]/15">
                      <span className="font-semibold text-[#68121A]">{member.name}</span>
                      <span className="text-[#8C6B12] italic">{member.relation}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Bride Family */}
          <motion.div {...fadeIn} transition={{ delay: 0.15 }} className="rt-card p-6 sm:p-8 text-center flex flex-col justify-between">
            <div>
              <div className="text-2xl text-[#C59B27] mb-2 font-serif">☙</div>
              <h3 className="text-xl font-bold text-[#68121A] font-serif mb-1">
                {family.brideFamilyTitle || "Bride's Family"}
              </h3>
              <p className="text-xs text-[#8C6B12] font-medium mb-4">
                {family.brideParents}
              </p>

              {hasBrideFamily && (
                <div className="mt-4 pt-4 border-t border-[#C59B27]/20 space-y-2">
                  {family.brideFamily.map((member, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs px-4 py-1.5 rounded-lg bg-white/50 border border-[#C59B27]/15">
                      <span className="font-semibold text-[#68121A]">{member.name}</span>
                      <span className="text-[#8C6B12] italic">{member.relation}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
