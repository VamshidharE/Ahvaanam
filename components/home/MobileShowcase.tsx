"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Play, Sparkles, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function MobileShowcase() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let animationFrameId: number;
    let currentScroll = 0;
    let direction = 1; // 1 = scrolling down, -1 = scrolling up
    let speed = 3.6; // Increased smooth scrolling speed
    let pauseFrames = 20; // Shorter initial pause

    const autoScrollLoop = () => {
      try {
        const win = iframe.contentWindow;
        const doc = iframe.contentDocument || win?.document;

        if (win && doc && doc.documentElement) {
          const maxScroll = doc.documentElement.scrollHeight - win.innerHeight;

          if (maxScroll > 10) {
            if (pauseFrames > 0) {
              pauseFrames--;
            } else {
              currentScroll += direction * speed;

              if (currentScroll >= maxScroll) {
                currentScroll = maxScroll;
                direction = -1;
                speed = 8.5; // Rapid smooth rewind to top
                pauseFrames = 35; // Brief pause at bottom
              } else if (currentScroll <= 0) {
                currentScroll = 0;
                direction = 1;
                speed = 3.6; // Increased reading speed downwards
                pauseFrames = 25; // Brief pause at top
              }

              win.scrollTo({ top: currentScroll, behavior: "auto" });
            }
          }
        }
      } catch {
        // Fallback gracefully if cross-origin or restricted
      }

      animationFrameId = requestAnimationFrame(autoScrollLoop);
    };

    const timer = setTimeout(() => {
      animationFrameId = requestAnimationFrame(autoScrollLoop);
    }, 300);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrameId);
    };
  }, [iframeLoaded]);

  return (
    <div className="relative flex items-center justify-center">
      
      {/* Ambient Pulsing Golden Glow behind phone */}
      <motion.div
        animate={shouldReduceMotion ? {} : { scale: [1, 1.08, 1], opacity: [0.45, 0.7, 0.45] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[320px] h-[440px] bg-[radial-gradient(circle,#FFE8A3_0%,#FFF8E7_45%,transparent_75%)] opacity-70 blur-3xl pointer-events-none"
      />

      {/* Floating Levitation Container */}
      <motion.div
        animate={shouldReduceMotion ? {} : { 
          y: [0, -8, 0],
          rotate: [0, 0.35, 0, -0.35, 0]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative group z-20"
      >
        {/* Luxury Top Floating Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="absolute -top-3.5 right-3 z-30 inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/50 bg-white/95 px-3 py-1 text-[8.5px] font-bold uppercase tracking-[1.5px] text-[#C49B27] shadow-[0_8px_20px_rgba(196,155,39,0.2)] backdrop-blur-md"
        >
          <Sparkles size={10} className="text-[#C49B27] animate-spin" style={{ animationDuration: "8s" }} />
          <span>Live Demo Experience</span>
        </motion.div>

        {/* --- SMARTPHONE CHASSIS (Compact Scaled Profile) --- */}
        <div className="relative w-[215px] sm:w-[235px] md:w-[250px] h-[435px] sm:h-[475px] md:h-[505px] bg-gradient-to-b from-[#2e261e] via-[#1c1815] to-[#120f0d] rounded-[42px] p-[7px] sm:p-[8px] shadow-[0_22px_50px_rgba(0,0,0,0.35),0_10px_20px_rgba(196,155,39,0.2),inset_0_0_2px_1px_rgba(212,175,55,0.4)] border border-[#C49B27]/40">
          
          {/* Side volume & power button accents */}
          <div className="absolute -left-[3px] top-[80px] w-[3px] h-[18px] bg-[#9e7d23] rounded-l-sm" />
          <div className="absolute -left-[3px] top-[105px] w-[3px] h-[18px] bg-[#9e7d23] rounded-l-sm" />
          <div className="absolute -right-[3px] top-[90px] w-[3px] h-[28px] bg-[#9e7d23] rounded-r-sm" />

          {/* Inner Glossy Screen Container */}
          <div className="relative w-full h-full bg-[#FAF9F6] rounded-[34px] overflow-hidden border border-black/40 shadow-inner flex flex-col">
            
            {/* Top Dynamic Island / Notch */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 z-40 flex items-center justify-between px-2 w-[82px] h-[16px] bg-black rounded-full shadow-md pointer-events-none">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center">
                <div className="w-0.5 h-0.5 rounded-full bg-[#0a3866]" />
              </div>
              <div className="w-6 h-0.5 rounded-full bg-[#222]" />
            </div>

            {/* Live Scrolling Invitation Preview iframe without procession */}
            <iframe
              ref={iframeRef}
              src="/demo?embed=1&preview=1&noProcession=1"
              title="Ahvaanam Live Invitation Demo"
              onLoad={() => setIframeLoaded(true)}
              className="w-full h-full border-0 select-none pointer-events-none"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            />

            {/* Bottom Home Indicator Bar */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-20 h-0.5 bg-[#241E1C]/25 rounded-full pointer-events-none z-30" />

            {/* Hover Action Overlay */}
            <Link
              href="/demo"
              className="absolute inset-0 bg-black/30 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 flex flex-col items-center justify-center p-3 text-center text-white"
            >
              <motion.div
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                className="px-3.5 py-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C49B27] text-white font-bold text-[10px] uppercase tracking-[1.5px] shadow-xl flex items-center gap-1.5"
              >
                <Play size={11} className="fill-current" />
                <span>Open Fullscreen</span>
                <ExternalLink size={10} className="ml-0.5" />
              </motion.div>
              <p className="mt-2 text-[8.5px] font-semibold text-white/90 uppercase tracking-[0.5px]">
                Interactive Audio &amp; Animations
              </p>
            </Link>

          </div>
        </div>

      </motion.div>

    </div>
  );
}
