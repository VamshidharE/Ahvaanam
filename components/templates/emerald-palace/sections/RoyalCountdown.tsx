"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RoyalDivider, RoyalCornerOrnament } from "../assets/Ornaments";
import { useEmeraldPalace } from "../context";

export function RoyalCountdown() {
  const data = useEmeraldPalace();
  const targetDateStr = data.wedding.countdownTarget || "2026-11-28T10:30:00";

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const targetTime = new Date(targetDateStr).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDateStr]);

  return (
    <section className="ep-section text-center" id="countdown">
      <motion.div
        className="ep-royal-card-dark max-w-xl mx-auto"
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="ep-card-inner-border" />
        <RoyalCornerOrnament position="tl" className="absolute top-2 left-2 opacity-60" />
        <RoyalCornerOrnament position="tr" className="absolute top-2 right-2 opacity-60" />
        <RoyalCornerOrnament position="bl" className="absolute bottom-2 left-2 opacity-60" />
        <RoyalCornerOrnament position="br" className="absolute bottom-2 right-2 opacity-60" />

        <div className="relative z-10 px-2 sm:px-4">
          <span className="text-[0.72rem] uppercase tracking-[0.25em] text-[#DFB759]/90 font-cinzel font-medium">
            Sumuhurtham Timepiece
          </span>
          <h2 className="ep-section-title-dark ep-gold-shimmer">
            Counting Down to Forever
          </h2>

          <RoyalDivider goldVariant="light" className="my-3 scale-90" />

          <p className="ep-section-subtitle-dark text-sm sm:text-base mb-2">
            {data.wedding.muhurtham || "Auspicious wedding ceremony begins in"}
          </p>

          <div className="ep-countdown-grid">
            <div className="ep-countdown-box">
              <div className="ep-countdown-num">{String(timeLeft.days).padStart(2, "0")}</div>
              <div className="ep-countdown-label">Days</div>
            </div>
            <div className="ep-countdown-box">
              <div className="ep-countdown-num">{String(timeLeft.hours).padStart(2, "0")}</div>
              <div className="ep-countdown-label">Hours</div>
            </div>
            <div className="ep-countdown-box">
              <div className="ep-countdown-num">{String(timeLeft.minutes).padStart(2, "0")}</div>
              <div className="ep-countdown-label">Mins</div>
            </div>
            <div className="ep-countdown-box">
              <div className="ep-countdown-num">{String(timeLeft.seconds).padStart(2, "0")}</div>
              <div className="ep-countdown-label">Secs</div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
export default RoyalCountdown;
