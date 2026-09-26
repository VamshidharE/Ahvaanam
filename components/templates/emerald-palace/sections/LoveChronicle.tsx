"use client";

import React from "react";
import { motion } from "framer-motion";
import { RoyalDivider } from "../assets/Ornaments";
import { useEmeraldPalace } from "../context";

export function LoveChronicle() {
  const data = useEmeraldPalace();

  return (
    <section className="ep-section" id="story">
      <div className="text-center mb-6">
        <span className="ep-section-tag">A Tale of Eternal Love</span>
        <h2 className="ep-section-title ep-gold-text">{data.story.title}</h2>
        <RoyalDivider className="my-3 scale-90" />
      </div>

      <motion.div
        className="ep-royal-card max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.8 }}
      >
        <p className="font-serif text-base sm:text-lg text-[#4A3B32] leading-relaxed italic text-center mb-8">
          "{data.story.text}"
        </p>

        {data.story.milestones && data.story.milestones.length > 0 && (
          <div className="relative border-l-2 border-[#DFB759]/50 pl-6 ml-4 sm:ml-8 space-y-6">
            {data.story.milestones.map((m, idx) => (
              <motion.div
                key={idx}
                className="relative"
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
              >
                {/* Golden Milestone Node */}
                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#DFB759] border-2 border-[#FAF5EB] shadow" />
                <span className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#9C7723]">
                  {m.yearOrDate}
                </span>
                <h4 className="font-cinzel text-base font-semibold text-[#0C2B22] mt-0.5">
                  {m.title}
                </h4>
                <p className="font-serif text-sm text-[#6B5C50] mt-1">
                  {m.desc}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
export default LoveChronicle;
