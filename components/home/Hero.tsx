"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Play, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import MobileShowcase from "./MobileShowcase";

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

        {/* Right Column - Mobile Phone Mockup showcasing live scrolling Demo Invitation */}
        <div className="lg:col-span-6 flex items-center justify-center relative">
          <MobileShowcase />
        </div>

      </div>
    </section>
  );
}