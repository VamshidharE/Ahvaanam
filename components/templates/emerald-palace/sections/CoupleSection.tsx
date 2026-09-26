"use client";

import React from "react";
import { motion } from "framer-motion";
import { RoyalDivider } from "../assets/Ornaments";
import { useEmeraldPalace } from "../context";

export function CoupleSection() {
  const data = useEmeraldPalace();
  const isBrideFirst = data.couple.primarySide === "bride";

  const brideContent = (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, x: isBrideFirst ? -25 : 25 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="ep-portrait-frame">
        <img
          src={data.couple.brideImage || "/images/couple.jpg"}
          alt={data.couple.bride}
          className="ep-portrait-img"
        />
      </div>
      <h3 className="ep-couple-name">{data.couple.bride}</h3>
      <span className="ep-couple-role">The Radiant Bride</span>
      <p className="text-xs uppercase tracking-[0.15em] text-[#9C7723] mb-3 font-cinzel">
        {data.family.brideParents}
      </p>
      <p className="ep-couple-bio max-w-sm">
        {data.couple.brideBio}
      </p>
    </motion.div>
  );

  const groomContent = (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, x: isBrideFirst ? 25 : -25 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="ep-portrait-frame">
        <img
          src={data.couple.groomImage || "/images/couple.jpg"}
          alt={data.couple.groom}
          className="ep-portrait-img"
        />
      </div>
      <h3 className="ep-couple-name">{data.couple.groom}</h3>
      <span className="ep-couple-role">The Noble Groom</span>
      <p className="text-xs uppercase tracking-[0.15em] text-[#9C7723] mb-3 font-cinzel">
        {data.family.groomParents}
      </p>
      <p className="ep-couple-bio max-w-sm">
        {data.couple.groomBio}
      </p>
    </motion.div>
  );

  return (
    <section className="ep-section" id="couple">
      <div className="text-center mb-6">
        <span className="ep-section-tag">Destined in Stars</span>
        <h2 className="ep-section-title ep-gold-text">The Royal Couple</h2>
        <RoyalDivider className="my-3 scale-90" />
      </div>

      <div className="ep-couple-grid">
        {isBrideFirst ? (
          <>
            {brideContent}
            {groomContent}
          </>
        ) : (
          <>
            {groomContent}
            {brideContent}
          </>
        )}
      </div>
    </section>
  );
}
export default CoupleSection;
