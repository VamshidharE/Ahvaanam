"use client";

import React from "react";
import { motion } from "framer-motion";
import { RoyalDivider } from "../assets/Ornaments";
import { useEmeraldPalace } from "../context";

export function FamilyLineage() {
  const data = useEmeraldPalace();
  const isBrideFirst = data.couple.primarySide === "bride";

  const brideFamilyBlock = (
    <motion.div
      className="bg-white/80 border border-[#DFB759]/40 rounded-2xl p-6 shadow-md text-left"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🌸</span>
        <h3 className="font-cinzel text-lg font-bold text-[#0C2B22] tracking-wider">
          {data.family.brideFamilyTitle || `${data.couple.bride}'s Family`}
        </h3>
      </div>
      <div className="text-sm font-cinzel text-[#9C7723] uppercase tracking-wider mb-4">
        Parents: {data.family.brideParents}
      </div>

      <div className="space-y-3 pt-3 border-t border-[#DFB759]/25">
        {data.family.brideFamily.map((member, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-sm">
            <span className="font-serif italic text-[#6B5C50]">{member.relation}</span>
            <span className="font-medium text-[#241D17]">{member.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const groomFamilyBlock = (
    <motion.div
      className="bg-white/80 border border-[#DFB759]/40 rounded-2xl p-6 shadow-md text-left"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🪔</span>
        <h3 className="font-cinzel text-lg font-bold text-[#0C2B22] tracking-wider">
          {data.family.groomFamilyTitle || `${data.couple.groom}'s Family`}
        </h3>
      </div>
      <div className="text-sm font-cinzel text-[#9C7723] uppercase tracking-wider mb-4">
        Parents: {data.family.groomParents}
      </div>

      <div className="space-y-3 pt-3 border-t border-[#DFB759]/25">
        {data.family.groomFamily.map((member, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-sm">
            <span className="font-serif italic text-[#6B5C50]">{member.relation}</span>
            <span className="font-medium text-[#241D17]">{member.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <section className="ep-section" id="family">
      <div className="text-center mb-6">
        <span className="ep-section-tag">Royal Heritage &amp; Lineage</span>
        <h2 className="ep-section-title ep-gold-text">{data.family.title}</h2>
        <p className="ep-section-subtitle">
          {data.family.blessingQuote || "Blessed by elders and surrounded by beloved kin."}
        </p>
        <RoyalDivider className="my-3 scale-90" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {isBrideFirst ? (
          <>
            {brideFamilyBlock}
            {groomFamilyBlock}
          </>
        ) : (
          <>
            {groomFamilyBlock}
            {brideFamilyBlock}
          </>
        )}
      </div>
    </section>
  );
}
export default FamilyLineage;
