"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { HeroWeddingCrest } from "../assets/Ornaments";
import { useEmeraldPalace } from "../context";

export function EmeraldHero() {
  const data = useEmeraldPalace();
  const heroRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const isBrideFirst = data.couple.primarySide === "bride";
  const rawFirstName = isBrideFirst ? data.couple.bride : data.couple.groom;
  const rawSecondName = isBrideFirst ? data.couple.groom : data.couple.bride;
  const firstName = (rawFirstName || "Arjun").trim();
  const secondName = (rawSecondName || "Divya").trim();

  // Sacred Ganesh Mantra and Family Surnames
  const ganeshMantra = (data.hero as any)?.welcomeMessage || "॥ श्री गणेशाय नमः ॥";
  const groomSurname = typeof (data.couple?.groom as any) === "object" ? (data.couple.groom as any)?.surname : "Gupta";
  const brideSurname = typeof (data.couple?.bride as any) === "object" ? (data.couple.bride as any)?.surname : "Rao";
  const familySurnameText =
    groomSurname && brideSurname
      ? `${groomSurname} & ${brideSurname} Families`
      : "Gupta & Rao Families";

  const scrollToInvite = () => {
    const el = document.getElementById("couple");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Parallax layers linked to scroll
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", shouldReduceMotion ? "0%" : "12%"]);
  const coupleY = useTransform(scrollYProgress, [0, 1], ["0%", shouldReduceMotion ? "0%" : "5%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", shouldReduceMotion ? "0%" : "-8%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.75], [1, shouldReduceMotion ? 1 : 0]);

  // Couple image sources (WebP with PNG fallback)
  const coupleImg = data.hero?.coupleImage || "/templates/emerald-palace/couple-hero.png";
  const coupleWebp = coupleImg.endsWith(".png")
    ? coupleImg.replace(/\.png$/, ".webp")
    : coupleImg;

  return (
    <section className="ep-hero-section" id="hero" ref={heroRef}>
      {/* 1. Layer 1 (Background): Temple Gopuram at Sunset with Parallax */}
      <motion.div
        className="ep-hero-bg-container"
        style={{ y: bgY }}
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <img
          src={data.hero?.bgImage || "/templates/emerald-palace/hero-temple-sunset.jpg"}
          alt="Temple Gopuram Sunset Scenery"
          className="ep-hero-bg-img"
          loading="eager"
        />
        {/* Crisp atmospheric gradient preserving sunset sky, temple gopuram, and pond reflections */}
        <div className="ep-hero-overlay" />
      </motion.div>

      {/* 2. Cinematic Content Composition: Desktop Asymmetric / Mobile Dedicated Portrait */}
      <div className="ep-hero-content-wrapper">
        {/* Left Column (Desktop) / Bottom (Mobile): Grand Regal Couple Cutout attached to bottom */}
        <motion.div
          className="ep-hero-couple-col"
          style={{ y: coupleY }}
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="ep-hero-couple-stage">
            {/* Soft warm aura glow separating couple from backdrop temple */}
            <div className="ep-hero-couple-aura" aria-hidden="true" />

            {/* Grounding contact shadow at the feet */}
            <div className="ep-hero-couple-ground-shadow" aria-hidden="true" />

            {/* Couple photograph cutout */}
            <picture className="ep-hero-couple-pic">
              <source srcSet={coupleWebp} type="image/webp" />
              <img
                src={coupleImg}
                alt={`${firstName} and ${secondName}`}
                className="ep-hero-couple-img"
                loading="eager"
              />
            </picture>
          </div>
        </motion.div>

        {/* Right Column (Desktop) / Top Section (Mobile): Bold, Prestigious Wedding Typography */}
        <motion.div
          className="ep-hero-typography-col"
          style={{ y: textY, opacity: textOpacity }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.3, ease: "easeOut" }}
        >
          {/* Royal Arched Invitation Card Frame */}
          <div className="ep-hero-arch-card">
            {/* Top decorative arch finial / pinnacle */}
            <div className="ep-hero-arch-finial" aria-hidden="true">
              <svg viewBox="0 0 24 16" className="w-5 h-3.5 text-[#C99A38]" fill="currentColor">
                <path d="M12 0L14.5 5.5L20 7L15 11L16 16L12 13L8 16L9 11L4 7L9.5 5.5L12 0Z" />
              </svg>
            </div>

            {/* Sacred Ganesh Mantra - Auspicious Kumkum Crimson */}
            <motion.div
              className="ep-hero-mantra"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
            >
              {ganeshMantra}
            </motion.div>

            {/* Subtle Gold Lotus Crest - Visible on tablet/desktop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="hidden sm:block"
            >
              <HeroWeddingCrest className="mx-auto my-0.5 text-[#C99A38] w-5 h-5 opacity-90" />
            </motion.div>

            {/* Family Lineage / Surnames - Burnished Antique Gold */}
            <motion.div
              className="ep-hero-family-surname"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
            >
              <span className="ep-hero-flourish-line" />
              <span className="text-[#C99A38] text-[9px]">✦</span>
              <span>{familySurnameText}</span>
              <span className="text-[#C99A38] text-[9px]">✦</span>
              <span className="ep-hero-flourish-line-rev" />
            </motion.div>

            {/* Small letter-spaced heading - Royal Wine */}
            <motion.span
              className="ep-hero-title-eyebrow"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
            >
              {data.hero?.eyebrow || data.introduction.eyebrow || "The Wedding of"}
            </motion.span>

            {/* Simple, Professional, Stacked (One on One) Couple Names in Imperial Wine & 24k Gold */}
            <motion.h1
              className="ep-hero-couple-names"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.75, duration: 0.7 }}
            >
              <span className="ep-hero-name-part">{firstName}</span>
              <span className="ep-hero-amp">&amp;</span>
              <span className="ep-hero-name-part">{secondName}</span>
            </motion.h1>

            {/* Elegant Date Line - Antique Bronze & Gold */}
            <motion.div
              className="ep-hero-date-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85, duration: 0.7 }}
            >
              <div className="ep-hero-date-line" />
              <span className="text-[#C99A38] text-[9px]">✦</span>
              <span className="ep-hero-date">{data.wedding.date}</span>
              <span className="text-[#C99A38] text-[9px]">✦</span>
              <div className="ep-hero-date-line-rev" />
            </motion.div>

            {/* Supporting Invitation Line - Visible on tablet/desktop */}
            {data.introduction?.message && (
              <motion.p
                className="ep-hero-supporting-text hidden sm:block"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 0.95, y: 0 }}
                transition={{ delay: 0.95, duration: 0.7 }}
              >
                Together with our families, we joyfully invite you to celebrate our special day.
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>

      {/* 5. Subtle "Scroll to Explore" Indicator */}
      <motion.button
        onClick={scrollToInvite}
        className="ep-hero-scroll-indicator"
        aria-label="Scroll to explore invitation"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.8 }}
      >
        <span className="font-cinzel text-[10px] tracking-[0.28em] text-[#781D36] uppercase font-bold">
          Scroll to Explore
        </span>
        <motion.div
          className="w-5 h-5 flex items-center justify-center text-[#781D36]"
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 stroke-[#781D36]"
            fill="none"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.div>
      </motion.button>
    </section>
  );
}
export default EmeraldHero;
