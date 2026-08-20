"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Play, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

// Subtle Gold Sparkle Dust Particles
function GoldDustParticles() {
  const shouldReduceMotion = useReducedMotion();
  
  if (shouldReduceMotion) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: "100vh", opacity: 0 }}
          animate={{ y: "-10vh", opacity: [0, 0.7, 0] }}
          transition={{
            duration: 12 + (i % 4) * 2,
            repeat: Infinity,
            delay: (i % 6) * 1.8,
            ease: "linear"
          }}
          className="absolute w-1.5 h-1.5 rounded-full bg-[#D4AF37]/50 blur-[0.3px]"
          style={{ left: `${(i * 8.5) % 96}%` }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  const [user, setUser] = useState<any>(null);
  const shouldReduceMotion = useReducedMotion();
  const supabase = createClient();

  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 60]);
  const cardYScroll = useTransform(scrollY, [0, 500], [0, -25]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  return (
    <section className="relative isolate min-h-[92vh] pt-32 pb-20 overflow-hidden bg-[#FAF9F6] select-none">
      
      {/* Warm Ambient Radial Background Glow */}
      <motion.div 
        style={shouldReduceMotion ? {} : { y: backgroundY }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-[radial-gradient(circle_at_center,#FFF4D4_0%,transparent_70%)] opacity-80 pointer-events-none" 
      />
      <div className="absolute top-[25%] right-[-5%] w-[420px] h-[420px] bg-amber-100/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[380px] h-[380px] bg-yellow-100/20 rounded-full blur-[100px] pointer-events-none" />
      
      <GoldDustParticles />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-20">
        
        {/* Left Column - Content */}
        <div className="lg:col-span-6 text-left space-y-6">
          
          {/* 1. Small Luxury Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-white/80 px-4 py-1.5 backdrop-blur-md shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#C49B27]" />
            <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#C49B27]">
              Luxury Digital Invitations
            </span>
          </motion.div>

          {/* 2. Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-normal uppercase tracking-[0.5px] leading-[1.15] text-[#241E1C] font-cinzel"
          >
            Celebrate Every <br />
            <span className="text-[#C49B27]">Moment In Style</span>
          </motion.h1>

          {/* 3. Supporting Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xs sm:text-sm text-[#241E1C]/65 leading-relaxed font-semibold max-w-lg"
          >
            Bespoke premium digital invitations for birthdays, weddings, engagements, baby showers, and every celebration with customized music, traditional deity graphics, interactive RSVPs, and dynamic live links.
          </motion.p>

          {/* 4. Primary & Secondary CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            {/* Primary CTA */}
            <motion.div
              whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Link 
                href="/contact" 
                className="px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#C49B27] text-white rounded-xl text-[10px] font-bold uppercase tracking-[2px] shadow-lg shadow-[#C49B27]/20 block text-center"
              >
                Get Custom Invitation
              </Link>
            </motion.div>

            {/* Secondary CTA */}
            <motion.div
              whileHover={shouldReduceMotion ? {} : { y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Link 
                href="/demo" 
                className="px-8 py-3.5 bg-white/90 border border-zinc-200/80 text-[#241E1C]/80 rounded-xl text-[10px] font-bold uppercase tracking-[2px] shadow-xs hover:border-[#C49B27] hover:text-[#C49B27] transition-colors flex items-center gap-2"
              >
                Preview Demo <Play size={10} className="fill-current" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Column - Premium Invitation Mockup with Hero Image */}
        <div className="lg:col-span-6 flex items-center justify-center relative">
          
          {/* Ambient Warm Golden Glow behind Mockup */}
          <motion.div 
            animate={shouldReduceMotion ? {} : { scale: [1, 1.08, 1], opacity: [0.6, 0.85, 0.6] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[480px] h-[480px] bg-[radial-gradient(circle,#FFE8A3_0%,#FFF8E7_40%,transparent_70%)] opacity-70 blur-3xl pointer-events-none" 
          />

          <motion.div
            style={shouldReduceMotion ? {} : { y: cardYScroll }}
            initial={{ opacity: 0, x: 50, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg"
          >
            {/* Multi-layered Levitation Motion Animation */}
            <motion.div
              animate={shouldReduceMotion ? {} : { 
                y: [0, -14, 0],
                rotate: [0, 0.6, 0, -0.6, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={shouldReduceMotion ? {} : { scale: 1.025, y: -8 }}
              className="relative group cursor-pointer"
            >
              {/* Premium Template Floating Badge */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -top-3.5 right-6 z-30 inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/50 bg-white/95 px-4 py-1.5 text-[9px] font-bold uppercase tracking-[1.5px] text-[#C49B27] shadow-[0_8px_20px_rgba(196,155,39,0.2)] backdrop-blur-md"
              >
                <Sparkles size={11} className="text-[#C49B27] animate-spin" style={{ animationDuration: "8s" }} />
                <span>Featured Live Experience</span>
              </motion.div>

              {/* Glowing Frame Wrapper */}
              <div className="relative rounded-3xl border border-amber-200/60 bg-gradient-to-b from-white/90 via-white/70 to-amber-50/50 p-3 sm:p-4 backdrop-blur-xl shadow-[0_25px_60px_rgba(196,155,39,0.12),0_10px_25px_rgba(0,0,0,0.06)] transition-all duration-500 group-hover:shadow-[0_35px_80px_rgba(196,155,39,0.2),0_15px_35px_rgba(0,0,0,0.08)] group-hover:border-amber-400/80">
                <Link href="/demo" className="block relative rounded-2xl overflow-hidden shadow-inner">
                  {/* Hero Invitation Image */}
                  <img
                    src="/images/hero-invitation.png"
                    alt="Ahvaanam Luxury Digital Invitation"
                    className="w-full h-auto object-contain rounded-2xl transform transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Gentle Gradient Shimmer on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#241E1C]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <span className="px-5 py-2 rounded-full bg-white/95 text-[#241E1C] font-bold text-[10px] uppercase tracking-[2px] shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <Play size={10} className="fill-current text-[#C49B27]" /> View Live Invitation
                    </span>
                  </div>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}