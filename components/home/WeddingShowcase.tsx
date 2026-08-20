"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { 
  Crown, Music, CheckSquare, Calendar, MapPin, ArrowRight, ShieldCheck, 
  Sparkles, Smartphone, Share2, Headphones 
} from "lucide-react";

const WEDDING_DESIGNS = [
  {
    id: "royal-temple",
    title: "Royal Temple Layout",
    desc: "Ornate golden pillars, sacred mandap arches, and traditional gold leaf detailing.",
    image: "/images/themes/royal-temple.jpg"
  },
  {
    id: "palace-luxury",
    title: "Palace Luxury Layout",
    desc: "Grand palace gates, royal red velvet overlays, and intricate golden borders.",
    image: "/images/themes/palace-luxury.jpg"
  },
  {
    id: "grand-mandap",
    title: "Grand Mandap Layout",
    desc: "Luxurious floral mandap stages with traditional hanging lanterns.",
    image: "/images/themes/grand-mandap.jpg"
  },
  {
    id: "azure-serenity",
    title: "Azure Serenity Layout",
    desc: "Cinematic watercolor mist, drifting petals, and royal floating typography.",
    image: "/images/themes/azure-serenity.jpg"
  },
  {
    id: "rose-mandap",
    title: "Rose Mandap Layout",
    desc: "Royal mandap architecture, hanging brass bells, couple artwork, and live procession animation.",
    image: "/images/themes/rose-mandap.jpg"
  }
];

export default function WeddingShowcase() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const currentDesign = WEDDING_DESIGNS[activeSlideIndex];

  // Feature Icons list
  const features = [
    { icon: Music, label: "Music", desc: "Devotional Audio" },
    { icon: CheckSquare, label: "RSVP", desc: "Guest Tracker" },
    { icon: Calendar, label: "Events", desc: "Multi-Day Timeline" },
    { icon: MapPin, label: "Maps", desc: "GPS Navigation" }
  ];

  // Bottom feature strip items
  const bottomStrip = [
    { icon: ShieldCheck, text: "100% Secure" },
    { icon: Sparkles, text: "Easy Customization" },
    { icon: Smartphone, text: "Mobile Friendly" },
    { icon: Share2, text: "Instant Sharing" },
    { icon: Headphones, text: "24/7 Support" }
  ];

  return (
    <section className="py-24 max-w-7xl mx-auto w-full px-6 md:px-12 space-y-12 z-30 relative select-none">
      
      {/* Soft Ambient Background Glow */}
      <div className="absolute top-[15%] right-1/4 w-[600px] h-[350px] bg-[radial-gradient(circle_at_center,#FFF4D4_0%,transparent_70%)] opacity-70 blur-3xl pointer-events-none" />

      {/* 1. Header Block */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-3 relative z-10"
      >
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[4px] text-[#C49B27]">
          <Crown size={14} className="text-[#C49B27]" />
          <span>PERFECT FOR YOUR BIG DAY</span>
        </div>

        {/* Main Heading */}
        <h2 className="text-3xl md:text-5xl font-normal uppercase tracking-[0.5px] font-cinzel text-[#241E1C] leading-tight">
          ELEGANT CUSTOM <br />
          <span className="text-[#C49B27]">WEDDING DESIGNS</span>
        </h2>

        {/* Gold Floral Divider */}
        <div className="flex items-center justify-center gap-3 my-3">
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
          <span className="text-[#C49B27] text-xs">❦</span>
          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
        </div>

        {/* Supporting Text */}
        <p className="text-xs sm:text-sm text-zinc-500 max-w-xl mx-auto font-semibold leading-relaxed">
          Crafting timeless digital wedding cards with traditional music, calendars, RSVPs, maps, and bespoke love stories.
        </p>
      </motion.div>

      {/* 2. Main Showcase Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="max-w-6xl mx-auto rounded-[36px] border border-white/90 bg-[#FFFDF9]/95 p-8 md:p-12 shadow-2xl shadow-amber-900/5 backdrop-blur-md relative z-10 overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* LEFT CONTENT COLUMN */}
          <div className="lg:col-span-6 text-left space-y-6">
            
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <span className="px-3.5 py-1 rounded-full bg-[#C49B27]/10 border border-[#C49B27]/25 text-[8.5px] font-bold uppercase tracking-[1.5px] text-[#C49B27] inline-block">
                TRADITION MEETS MODERN DESIGN
              </span>
            </motion.div>

            {/* Sub-heading */}
            <motion.h3
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-3xl sm:text-4xl font-normal font-cinzel text-[#241E1C] uppercase leading-tight"
            >
              Designs that tell <br />
              <span className="text-[#C49B27]">your story</span>
            </motion.h3>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-semibold"
            >
              Ahvaanam creates beautifully crafted invitations with timeless wedding graphics, custom background instrumentals, interactive itineraries, and elegant RSVP coordination.
            </motion.p>

            {/* 4 Feature Badges with sequential stagger */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {features.map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <motion.div
                    key={feat.label}
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.45 + i * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-zinc-200/80 shadow-xs hover:border-[#C49B27]/40 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#C49B27]/10 flex items-center justify-center text-[#C49B27] shrink-0">
                      <Icon size={14} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-[1px] text-[#241E1C]">{feat.label}</h4>
                      <p className="text-[8px] text-zinc-400 font-semibold">{feat.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>

          {/* RIGHT VISUAL COLUMN */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
            
            {/* Soft Warm Lighting Glow behind image */}
            <div className="absolute w-[360px] h-[360px] bg-[radial-gradient(circle,#FFF3D1_0%,transparent_70%)] opacity-80 blur-2xl pointer-events-none" />

            {/* Animated Invitation Mockup */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 70, scale: 0.94, rotate: 2 }}
              whileInView={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
              className="relative w-full max-w-md"
            >
              {/* Floating Animation Loop */}
              <motion.div
                animate={shouldReduceMotion ? {} : { y: [0, -6, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileHover={shouldReduceMotion ? {} : { scale: 1.015 }}
                className="relative rounded-3xl border border-white/90 bg-white p-3 shadow-2xl shadow-amber-900/10"
              >
                <div className="w-full aspect-[4/3] relative rounded-2xl overflow-hidden shadow-inner bg-amber-50">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentDesign.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.45 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={currentDesign.image}
                        alt={currentDesign.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 500px"
                        priority
                        className="object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Inner subtle gold border overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/5 pointer-events-none" />
                </div>
              </motion.div>
            </motion.div>

            {/* Mini Carousel Collection Indicator dots */}
            <div className="flex items-center gap-2 mt-6 z-20">
              {WEDDING_DESIGNS.map((design, idx) => (
                <button
                  key={design.id}
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    activeSlideIndex === idx ? "w-6 bg-[#C49B27]" : "w-1.5 bg-zinc-300 hover:bg-[#C49B27]/50"
                  }`}
                  aria-label={`Select ${design.title}`}
                />
              ))}
            </div>
            
            {/* Active design title */}
            <span className="text-[9px] uppercase font-bold tracking-[1.5px] text-[#C49B27] mt-1">
              {currentDesign.title}
            </span>

          </div>

        </div>
      </motion.div>

      {/* 3. Bottom Supporting Feature Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="max-w-5xl mx-auto pt-4"
      >
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 py-4 px-6 rounded-2xl bg-white/70 border border-white shadow-sm backdrop-blur-sm text-center">
          {bottomStrip.map((item, idx) => {
            const Icon = item.icon;
            return (
              <React.Fragment key={item.text}>
                {idx > 0 && <span className="hidden sm:inline text-zinc-300 text-xs">|</span>}
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[1.5px] text-zinc-700">
                  <Icon size={14} className="text-[#C49B27]" />
                  <span>{item.text}</span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </motion.div>

    </section>
  );
}
