"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { InvitationData } from "@/lib/template-engine/types";

export default function Countdown({ data }: { data: InvitationData }) {
  const shouldReduceMotion = useReducedMotion();
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  const targetDateStr = data.wedding.countdownTarget || "2026-09-20T10:15:00";

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDateStr) - +new Date();
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

  const fadeIn = shouldReduceMotion
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true } }
    : { initial: { opacity: 0, y: 25 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

  return (
    <section className="relative py-16 px-4 flex justify-center bg-[#FAF6EE]">
      <div className="max-w-2xl w-full text-center">
        
        <motion.div {...fadeIn} className="rt-card p-8 sm:p-12">
          <p className="text-[10px] uppercase tracking-[3px] font-bold text-[#8C6B12] font-serif">
            Auspicious Muhurtham
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#68121A] font-serif mt-1 mb-2">
            Counting Down To The Sacred Vows
          </h2>
          
          <div className="rt-divider mb-8">
            <span className="rt-divider-line" />
            <span className="rt-divider-icon">𑁍</span>
            <span className="rt-divider-line" />
          </div>

          <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-lg mx-auto">
            
            <div className="bg-white/80 border border-[#C59B27]/40 rounded-xl p-3 sm:p-4 shadow-sm">
              <span className="text-2xl sm:text-4xl font-bold text-[#68121A] font-serif block">
                {timeLeft ? String(timeLeft.days).padStart(2, "0") : "--"}
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[1.5px] font-bold text-[#8C6B12] mt-1 block">
                Days
              </span>
            </div>

            <div className="bg-white/80 border border-[#C59B27]/40 rounded-xl p-3 sm:p-4 shadow-sm">
              <span className="text-2xl sm:text-4xl font-bold text-[#68121A] font-serif block">
                {timeLeft ? String(timeLeft.hours).padStart(2, "0") : "--"}
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[1.5px] font-bold text-[#8C6B12] mt-1 block">
                Hours
              </span>
            </div>

            <div className="bg-white/80 border border-[#C59B27]/40 rounded-xl p-3 sm:p-4 shadow-sm">
              <span className="text-2xl sm:text-4xl font-bold text-[#68121A] font-serif block">
                {timeLeft ? String(timeLeft.minutes).padStart(2, "0") : "--"}
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[1.5px] font-bold text-[#8C6B12] mt-1 block">
                Mins
              </span>
            </div>

            <div className="bg-white/80 border border-[#C59B27]/40 rounded-xl p-3 sm:p-4 shadow-sm">
              <span className="text-2xl sm:text-4xl font-bold text-[#68121A] font-serif block">
                {timeLeft ? String(timeLeft.seconds).padStart(2, "0") : "--"}
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[1.5px] font-bold text-[#8C6B12] mt-1 block">
                Secs
              </span>
            </div>

          </div>

          <p className="text-xs italic font-serif text-[#5C4838] mt-6">
            {data.wedding.date} at {data.wedding.time}
          </p>

        </motion.div>

      </div>
    </section>
  );
}
