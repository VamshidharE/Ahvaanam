"use client";

import React, { useState } from "react";
import { 
  Heart, Sparkles, ArrowRight, ChevronLeft, ChevronRight,
  Send, Link as LinkIcon, QrCode, Image as ImageIcon, Sparkle
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Hero from "../components/home/Hero";
import CategoryShowcase from "../components/home/CategoryShowcase";
import WeddingShowcase from "../components/home/WeddingShowcase";
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";

const templatesList: Array<{
  slug: string;
  title: string;
  category: string;
  type: string;
  desc: string;
  image: string;
}> = [];

export default function RecreatedHomepage() {
  const [selectedCategory, setSelectedCategory] = useState("Wedding");
  const [activeDevice, setActiveDevice] = useState<"mobile" | "tablet" | "desktop">("mobile");

  return (
    <div className="bg-[#FAF9F6] text-[#241E1C] font-sans relative overflow-x-hidden min-h-screen">

      {/* --- HEADER --- */}
      <Navbar />

      {/* =========================================================
          SECTION 1: HERO
          ========================================================= */}
      <Hero />

      {/* =========================================================
          SECTION 2: EVENT CATEGORIES SHOWCASE
          ========================================================= */}
      {/* =========================================================
          SECTION 2: EVENT CATEGORIES SHOWCASE
          ========================================================= */}
      <CategoryShowcase />

      {/* =========================================================
          SECTION 3: WEDDING DESIGNS SHOWCASE
          ========================================================= */}
      <WeddingShowcase />

      {/* =========================================================
          SECTION 4: HANDCRAFTED & BESPOKE CUSTOMIZER
          ========================================================= */}
      <section id="customizer" className="py-20 max-w-7xl mx-auto w-full px-6 md:px-12 space-y-12 z-30 relative select-none">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-[3px] text-[#C49B27] block">HANDCRAFTED &amp; BESPOKE</span>
          <h2 className="text-3xl md:text-5xl font-normal uppercase tracking-[0.5px] font-cinzel text-[#241E1C]">
            Every Invitation Is <span className="text-[#C49B27]">Customized For You</span>
          </h2>
          <p className="text-xs text-zinc-500 max-w-md mx-auto font-semibold">
            Our team updates your invitation details, music, and photos with precision so every detail is flawless.
          </p>
        </div>

        {/* Interactive Editor Canvas Mockup with Floating Pins */}
        <div className="relative max-w-5xl mx-auto rounded-3xl border border-white/80 bg-white/70 p-8 shadow-2xl backdrop-blur-md">
          
          {/* Editor Image Mockup in Center */}
          <div className="w-full aspect-[16/9] rounded-2xl bg-gradient-to-b from-[#FFFDF8] to-[#FAF5E6] border border-amber-200/50 p-6 flex flex-col justify-between items-center shadow-inner relative overflow-hidden">
            <div className="w-full flex justify-between items-center text-[9px] uppercase font-bold text-zinc-400 border-b border-amber-200/40 pb-2">
              <span>Studio Live Canvas</span>
              <span className="text-[#C49B27]">Ahvaanam Studio</span>
            </div>

            <div className="text-center space-y-2 my-auto">
              <span className="text-2xl text-[#C49B27]">ॐ</span>
              <h3 className="text-3xl font-bold font-cinzel text-[#241E1C] uppercase">Rahul &amp; Priya</h3>
              <p className="text-xs font-bold text-[#C49B27] tracking-[2px] uppercase">Custom Studio Design</p>
            </div>

            <div className="w-full flex justify-center gap-4 text-[9px] uppercase font-bold text-zinc-500">
              <span>Music: On</span> • <span>RSVP: Active</span> • <span>Maps: Linked</span>
            </div>
          </div>

          {/* Floating Feature Pins */}
          <div className="absolute top-4 left-4 rounded-full bg-white px-3 py-1.5 shadow-lg border border-amber-200 text-[9px] font-bold text-[#C49B27] flex items-center gap-1.5">
            <span>🔱 Deity / Symbol</span>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 left-4 rounded-full bg-white px-3 py-1.5 shadow-lg border border-amber-200 text-[9px] font-bold text-[#C49B27] flex items-center gap-1.5">
            <span>📷 Couple Photos</span>
          </div>
          <div className="absolute bottom-4 left-4 rounded-full bg-white px-3 py-1.5 shadow-lg border border-amber-200 text-[9px] font-bold text-[#C49B27] flex items-center gap-1.5">
            <span>🎵 Custom Music</span>
          </div>

          <div className="absolute top-4 right-4 rounded-full bg-white px-3 py-1.5 shadow-lg border border-amber-200 text-[9px] font-bold text-[#C49B27] flex items-center gap-1.5">
            <span>🎼 Devotional Audio</span>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-4 rounded-full bg-white px-3 py-1.5 shadow-lg border border-amber-200 text-[9px] font-bold text-[#C49B27] flex items-center gap-1.5">
            <span>📍 Venue Map</span>
          </div>
          <div className="absolute bottom-4 right-4 rounded-full bg-white px-3 py-1.5 shadow-lg border border-amber-200 text-[9px] font-bold text-[#C49B27] flex items-center gap-1.5">
            <span>💌 Online RSVP</span>
          </div>
        </div>

        {/* Feature Pills Row */}
        <div className="flex flex-wrap justify-center gap-2.5 max-w-4xl mx-auto">
          {[
            "Personalized Music", "Auspicious Gods", "Online RSVPs", "Interactive Timeline",
            "Guest List & Registry", "Multiple Pages", "QR Codes", "High-Res Export"
          ].map((pill) => (
            <span key={pill} className="px-4 py-2 rounded-full bg-white border border-zinc-200/80 text-[9px] font-bold uppercase tracking-[1px] text-zinc-700 shadow-xs">
              ✓ {pill}
            </span>
          ))}
        </div>
      </section>

      {/* =========================================================
          SECTION 5: MULTI-DEVICE PREVIEW & DISTRIBUTION
          ========================================================= */}
      <section className="py-20 max-w-7xl mx-auto w-full px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-30 relative select-none">
        
        {/* Left: Device Preview */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div>
            <span className="text-xs font-bold uppercase tracking-[3px] text-[#C49B27] block">MULTI-DEVICE READY</span>
            <h2 className="text-3xl md:text-5xl font-normal uppercase tracking-[0.5px] font-cinzel text-[#241E1C]">
              PREVIEW ON ANY DEVICE
            </h2>
            <p className="text-xs text-zinc-500 font-semibold mt-2">Optimized for mobile, tablet, and desktop screens.</p>
          </div>

          {/* Phone Frame Mockup */}
          <div className="w-[240px] aspect-[9/18] rounded-[36px] border-4 border-zinc-800 bg-[#0A251B] p-4 shadow-2xl flex flex-col justify-between items-center text-center text-white relative mx-auto lg:mx-0">
            <div className="w-16 h-3 rounded-full bg-zinc-800 mb-2" />
            <div className="space-y-2 my-auto">
              <span className="text-lg text-[#C49B27]">ॐ</span>
              <h4 className="text-lg font-bold font-cinzel uppercase text-white">Rahul &amp; Priya</h4>
              <p className="text-[8px] uppercase tracking-[1.5px] text-[#C49B27]">Wedding Invitation</p>
            </div>
            <div className="w-10 h-1 rounded-full bg-white/20" />
          </div>

          {/* Selector buttons */}
          <div className="flex gap-2 justify-center lg:justify-start">
            {["Mobile", "Tablet", "Desktop"].map((device) => (
              <button
                key={device}
                onClick={() => setActiveDevice(device.toLowerCase() as any)}
                className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[1px] transition-all ${
                  activeDevice === device.toLowerCase() 
                    ? "bg-[#C49B27] text-white" 
                    : "bg-white border border-zinc-200 text-zinc-600"
                }`}
              >
                {device}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Fast Distribution */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div>
            <span className="text-xs font-bold uppercase tracking-[3px] text-[#C49B27] block">FAST DISTRIBUTION</span>
            <h2 className="text-3xl md:text-5xl font-normal uppercase tracking-[0.5px] font-cinzel text-[#241E1C]">
              SEND YOUR INVITATION IN SECONDS
            </h2>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-md space-y-2">
              <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center text-green-600 font-bold">
                💬
              </div>
              <h4 className="text-sm font-bold font-cinzel text-[#241E1C]">WhatsApp</h4>
              <p className="text-[10px] text-zinc-500 font-semibold">Share via WhatsApp</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-md space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                🔗
              </div>
              <h4 className="text-sm font-bold font-cinzel text-[#241E1C]">URL Link</h4>
              <p className="text-[10px] text-zinc-500 font-semibold">www.ahvaanam.com/invite/demo</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-md space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-[#C49B27] font-bold">
                📱
              </div>
              <h4 className="text-sm font-bold font-cinzel text-[#241E1C]">QR Code</h4>
              <p className="text-[10px] text-zinc-500 font-semibold">Instantly Scan</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-md space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                🖼️
              </div>
              <h4 className="text-sm font-bold font-cinzel text-[#241E1C]">Digital Card</h4>
              <p className="text-[10px] text-zinc-500 font-semibold">Image &amp; PDF</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <Footer />

    </div>
  );
}