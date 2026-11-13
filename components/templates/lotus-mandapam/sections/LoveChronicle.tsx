"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ButterflyFlourish, StoryWaveTop, StoryWaveBottom } from "../assets/Ornaments";
import { useEmeraldPalace } from "../context";

export function LoveChronicle() {
  const data = useEmeraldPalace();
  const sectionRef = useRef<HTMLDivElement>(null);

  const photo1 = data.story.couplePhoto || "/templates/emerald-palace/story-candid.jpg";
  const photo2 = data.story.couplePhoto2 || "/templates/emerald-palace/story-hands.jpg";

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const photo1Rotate = useTransform(scrollYProgress, [0, 1], [-4, 2]);
  const photo2Rotate = useTransform(scrollYProgress, [0, 1], [6, -2]);
  const photoParallaxY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <div className="relative w-full scroll-mt-16" id="story" ref={sectionRef}>
      {/* Top Organic Wave Curve */}
      <StoryWaveTop />

      {/* Main Burgundy Brocade Editorial Section */}
      <section className="relative w-full ep-bg-burgundy-brocade text-[#FFF6E9] py-16 sm:py-24 px-4 sm:px-8 overflow-hidden">
        {/* Subtle decorative background watermark */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#D6AD63_1px,transparent_1px)] [background-size:28px_28px]" />

        {/* Subtle Floral Corner Overlays */}
        <img
          src="/templates/emerald-palace/garland-corner.png"
          alt=""
          className="absolute -top-10 -left-10 w-44 sm:w-60 pointer-events-none opacity-20 filter invert brightness-150 select-none"
          aria-hidden="true"
        />
        <img
          src="/templates/emerald-palace/garland-corner.png"
          alt=""
          className="absolute -bottom-10 -right-10 w-44 sm:w-60 pointer-events-none opacity-20 filter invert brightness-150 scale-[-1] select-none"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Editorial Story Text Column */}
          <motion.div
            className="flex-1 text-center lg:text-left max-w-xl"
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.85 }}
          >
            <div className="flex items-center justify-center lg:justify-start gap-2.5 mb-3">
              <ButterflyFlourish />
              <span className="font-cinzel text-xs uppercase tracking-[0.25em] text-[#DFB759] font-bold">
                A Tale of Two Hearts
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#FFF6E9] mb-4 font-bold tracking-tight">
              {data.story.title || "Our Story"}
            </h2>

            <div className="w-16 h-[2px] bg-gradient-to-r from-[#D6AD63] to-transparent mx-auto lg:mx-0 mb-6" />

            <p className="font-serif text-base sm:text-lg text-[#FFF6E9]/95 leading-relaxed italic mb-8">
              "{data.story.text}"
            </p>

            {/* Editorial Milestones Grid */}
            {data.story.milestones && data.story.milestones.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#DFB759]/25">
                {data.story.milestones.map((m, i) => (
                  <div key={i} className="text-center lg:text-left">
                    <span className="font-cinzel text-xs font-bold text-[#DFB759] tracking-widest block mb-0.5">
                      {m.yearOrDate}
                    </span>
                    <h4 className="font-cinzel text-xs font-semibold text-[#FFF6E9] tracking-wide mb-1">
                      {m.title}
                    </h4>
                    <p className="font-serif text-[11px] text-[#FFF6E9]/75 leading-tight">
                      {m.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Overlapping Editorial Photographic Panels */}
          <motion.div
            className="relative flex items-center justify-center w-full max-w-md lg:max-w-lg py-6"
            style={{ y: photoParallaxY }}
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            {/* Primary Large Candid Photo (Tilted Left) */}
            <motion.div
              className="relative w-56 sm:w-64 md:w-72 aspect-[3/4] bg-[#FFFDF9] p-3 pb-7 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-[#D6AD63]/50 z-10"
              style={{ rotate: photo1Rotate }}
              whileHover={{ scale: 1.04, rotate: 0, zIndex: 30 }}
              transition={{ duration: 0.4 }}
            >
              <div className="w-full h-full overflow-hidden rounded-xl">
                <img
                  src={photo1}
                  alt="Our Story Outdoor Candid"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="mt-2 text-center">
                <span className="font-serif text-xs italic text-[#542D2A] font-semibold">
                  Where Our Journey Began
                </span>
              </div>
            </motion.div>

            {/* Secondary Fine-Art Hands/Rings Photo (Tilted Right, Overlapping) */}
            <motion.div
              className="relative w-44 sm:w-52 md:w-60 aspect-[4/3] bg-[#FFFDF9] p-2.5 pb-6 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.55)] border border-[#D6AD63]/60 -ml-16 sm:-ml-20 -mb-20 sm:-mb-24 z-20"
              style={{ rotate: photo2Rotate }}
              whileHover={{ scale: 1.06, rotate: 0, zIndex: 30 }}
              transition={{ duration: 0.4 }}
            >
              <div className="w-full h-full overflow-hidden rounded-xl">
                <img
                  src={photo2}
                  alt="Our Story Clasped Hands & Mehendi"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="mt-1.5 text-center">
                <span className="font-cinzel text-[10px] tracking-wider uppercase font-bold text-[#781D36]">
                  A Lifetime of Promises
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Bottom Organic Wave Curve */}
      <StoryWaveBottom />
    </div>
  );
}
export default LoveChronicle;
