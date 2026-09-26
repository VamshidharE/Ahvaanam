"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Smartphone, Tablet, Monitor, MessageSquare, Link as LinkIcon, QrCode, FileText } from "lucide-react";

export default function DevicePreview() {
  const devices: Array<"mobile" | "tablet" | "desktop"> = ["mobile", "tablet", "desktop"];
  const [activeDevice, setActiveDevice] = useState<"mobile" | "tablet" | "desktop">("mobile");
  const shouldReduceMotion = useReducedMotion();

  // Auto-toggle device switching every 2 seconds
  useEffect(() => {
    if (shouldReduceMotion) return;

    const timer = setInterval(() => {
      setActiveDevice((current) => {
        const nextIdx = (devices.indexOf(current) + 1) % devices.length;
        return devices[nextIdx];
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [shouldReduceMotion]);

  const distributionCards = [
    {
      id: "whatsapp",
      title: "WhatsApp Share",
      desc: "Send your invitation directly to family and friends.",
      icon: MessageSquare,
      bg: "bg-emerald-50",
      border: "border-emerald-200/60",
      text: "text-emerald-600"
    },
    {
      id: "url",
      title: "Invitation Link",
      desc: "Share one simple link anywhere.",
      icon: LinkIcon,
      bg: "bg-blue-50",
      border: "border-blue-200/60",
      text: "text-blue-600"
    },
    {
      id: "qr",
      title: "Instant QR Code",
      desc: "Let guests scan and open instantly.",
      icon: QrCode,
      bg: "bg-amber-50",
      border: "border-amber-200/70",
      text: "text-[#C49B27]"
    },
    {
      id: "card",
      title: "Digital Card & PDF",
      desc: "Download and share a high-resolution invitation.",
      icon: FileText,
      bg: "bg-purple-50",
      border: "border-purple-200/60",
      text: "text-purple-600"
    }
  ];

  return (
    <section className="py-20 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center z-30 relative select-none">
      
      {/* Soft Radial Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[450px] h-[320px] bg-[radial-gradient(circle,#FFF5DB_0%,transparent_70%)] opacity-50 blur-3xl pointer-events-none" />

      {/* Left Column: Multi-Device Showcase with Static Mockup */}
      <div className="lg:col-span-6 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-2 w-full"
        >
          <span className="text-xs font-bold uppercase tracking-[3.5px] text-[#C49B27] block">
            MULTI-DEVICE READY
          </span>
          <h2 className="text-3xl md:text-5xl font-normal uppercase tracking-[0.5px] font-cinzel text-[#241E1C]">
            PREVIEW ON ANY DEVICE
          </h2>
          <p className="text-xs text-zinc-500 font-semibold max-w-md mx-auto lg:mx-0">
            Optimized to display beautifully on mobile, tablet, and desktop screens.
          </p>
        </motion.div>

        {/* Device Switcher Tab Controls (Sliding Pill Highlighter) */}
        <div className="inline-flex p-1.5 rounded-full bg-white border border-amber-200/80 shadow-xs gap-1 relative">
          {[
            { id: "mobile", label: "MOBILE", icon: Smartphone },
            { id: "tablet", label: "TABLET", icon: Tablet },
            { id: "desktop", label: "DESKTOP", icon: Monitor },
          ].map((device) => {
            const Icon = device.icon;
            const isActive = activeDevice === device.id;
            return (
              <button
                key={device.id}
                onClick={() => setActiveDevice(device.id as any)}
                className={`px-4 py-2 rounded-full text-[10px] font-bold tracking-[1.5px] transition-colors duration-200 flex items-center gap-1.5 cursor-pointer relative z-10 ${
                  isActive ? "text-white" : "text-zinc-600 hover:text-[#C49B27]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeDeviceHighlighter"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-[#C49B27] rounded-full shadow-xs -z-10"
                  />
                )}
                <Icon size={12} className="relative z-10" />
                <span className="relative z-10">{device.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Adaptive Device Container (Smooth Spring Morphing) */}
        <div className="w-full flex items-center justify-center min-h-[420px] sm:min-h-[460px] py-4 relative">
          
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className={`relative bg-[#1c1714] border border-[#C49B27]/30 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.25)] overflow-hidden ${
              activeDevice === "mobile"
                ? "w-[240px] sm:w-[260px] h-[450px] sm:h-[480px] rounded-[36px] p-[8px]"
                : activeDevice === "tablet"
                ? "w-[340px] sm:w-[440px] h-[400px] sm:h-[440px] rounded-[26px] p-[10px]"
                : "w-full max-w-[540px] sm:max-w-[600px] h-[340px] sm:h-[380px] rounded-[16px] p-0"
            }`}
          >
            {/* MOBILE CHASSIS NOTCH */}
            {activeDevice === "mobile" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-2 left-1/2 -translate-x-1/2 z-40 w-16 h-3 bg-black rounded-full shadow-xs pointer-events-none"
              />
            )}

            {/* TABLET CHASSIS CAMERA DOT */}
            {activeDevice === "tablet" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-2 left-1/2 -translate-x-1/2 z-40 w-2 h-2 rounded-full bg-black pointer-events-none"
              />
            )}

            {/* DESKTOP BROWSER BAR */}
            {activeDevice === "desktop" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full bg-[#26201b] border-b border-[#C49B27]/20 px-3 py-2 flex items-center justify-between z-40"
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 max-w-xs mx-3 bg-[#181310] px-3 py-0.5 rounded text-[9px] font-mono text-amber-200/70 truncate text-center border border-amber-900/30">
                  ahvaanam.com/invite/arjun-ananya
                </div>
                <div className="text-[8.5px] text-zinc-500 uppercase font-bold">Preview</div>
              </motion.div>
            )}

            {/* INNER SCREEN CONTAINER - ELEGANT STATIC INVITATION CARD */}
            <div className={`relative w-full h-full bg-[#FAF9F6] overflow-hidden flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${
              activeDevice === "mobile"
                ? "rounded-[28px]"
                : activeDevice === "tablet"
                ? "rounded-[18px]"
                : "rounded-b-[14px] h-[calc(100%-32px)]"
            }`}>

              {/* Static Digital Invitation Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDevice}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="w-full h-full rounded-2xl bg-gradient-to-b from-[#FFFDF8] via-[#FAF6ED] to-[#F5EEDC] border border-[#D4AF37]/35 p-5 sm:p-6 flex flex-col justify-center items-center text-center shadow-inner relative overflow-hidden select-none"
                >
                  {/* Subtle Corner Filigree Line Art */}
                  <div className="absolute top-2 left-2 text-[#C49B27]/40 text-xs pointer-events-none">⚜</div>
                  <div className="absolute top-2 right-2 text-[#C49B27]/40 text-xs pointer-events-none">⚜</div>
                  <div className="absolute bottom-2 left-2 text-[#C49B27]/40 text-xs pointer-events-none">⚜</div>
                  <div className="absolute bottom-2 right-2 text-[#C49B27]/40 text-xs pointer-events-none">⚜</div>

                  {/* Inner Card Content */}
                  <div className="space-y-3 max-w-xs mx-auto my-auto">
                    
                    {/* Top Motif */}
                    <div className="text-[#C49B27] text-lg font-serif tracking-widest">
                      ✦
                    </div>

                    {/* Couple Names */}
                    <h3 className="text-2xl sm:text-3xl font-normal font-cinzel text-[#241E1C] uppercase tracking-[1px] leading-tight">
                      Arjun <span className="text-[#C49B27] font-serif font-normal">&amp;</span> Ananya
                    </h3>

                    {/* Subtitle */}
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-[3px] text-[#C49B27] font-bold">
                      Wedding Invitation
                    </p>

                    {/* Divider Line */}
                    <div className="flex items-center justify-center gap-2 py-0.5">
                      <div className="w-10 h-[1px] bg-[#D4AF37]/50" />
                      <span className="text-[#C49B27] text-[9px]">❖</span>
                      <div className="w-10 h-[1px] bg-[#D4AF37]/50" />
                    </div>

                    {/* Date & Venue */}
                    <div className="space-y-0.5 text-zinc-700">
                      <p className="text-[11px] sm:text-xs font-bold tracking-[1.5px] uppercase font-cinzel">
                        24 October 2026
                      </p>
                      <p className="text-[9.5px] uppercase tracking-[2px] text-zinc-500 font-semibold">
                        Hyderabad
                      </p>
                    </div>

                    {/* Divider Line */}
                    <div className="flex items-center justify-center gap-2 py-0.5">
                      <div className="w-10 h-[1px] bg-[#D4AF37]/50" />
                    </div>

                    {/* Family Greeting */}
                    <p className="text-[10px] italic font-serif text-zinc-600">
                      With Love, Our Families
                    </p>

                  </div>

                </motion.div>
              </AnimatePresence>

              {/* Bottom Home Indicator Bar (Mobile / Tablet) */}
              {(activeDevice === "mobile" || activeDevice === "tablet") && (
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-zinc-800/20 rounded-full pointer-events-none z-30" />
              )}

            </div>

          </motion.div>

        </div>

      </div>

      {/* Right Column: Send Your Invitation In Seconds */}
      <div className="lg:col-span-6 space-y-6 text-left">
        <div>
          <span className="text-xs font-bold uppercase tracking-[3.5px] text-[#C49B27] block">
            FAST DISTRIBUTION
          </span>
          <h2 className="text-3xl md:text-5xl font-normal uppercase tracking-[0.5px] font-cinzel text-[#241E1C]">
            SEND YOUR INVITATION IN SECONDS
          </h2>
          <p className="text-xs text-zinc-500 font-semibold mt-2 leading-relaxed">
            Share your digital invitation with guests effortlessly across any channel.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {distributionCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                whileHover={shouldReduceMotion ? {} : { y: -3 }}
                transition={{ duration: 0.2 }}
                className="p-5 rounded-2xl bg-white border border-amber-200/80 shadow-xs hover:shadow-md hover:border-[#C49B27] transition-all space-y-2.5 group cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-xl ${card.bg} border ${card.border} flex items-center justify-center ${card.text} group-hover:scale-105 transition-transform`}>
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-cinzel text-[#241E1C] group-hover:text-[#C49B27] transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-[11px] text-zinc-500 font-medium leading-relaxed mt-1">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
