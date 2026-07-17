"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Heart, Award, ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#241E1C] font-sans relative overflow-x-hidden pt-28">
      <Navbar />

      <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-amber-100/30 rounded-full blur-[100px] pointer-events-none" />

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10 space-y-16">
        
        {/* Title */}
        <div className="text-center space-y-4">
          <span className="text-sm font-bold uppercase tracking-[4px] text-[#C49B27] block">Our Story</span>
          <h1 className="text-4xl md:text-6xl font-normal uppercase tracking-[0.5px] [font-family:var(--cinzel),serif]">Ahvaanam Studio</h1>
          <p className="text-xs text-[#241E1C]/50 max-w-sm mx-auto uppercase tracking-[2px] font-bold">Luxury digital invitation designers</p>
        </div>

        {/* Narrative columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          
          {/* Mockup image frame */}
          <div className="rounded-[40px] border border-white bg-white/70 p-6 shadow-xl backdrop-blur-xl">
            <div className="aspect-[4/3] rounded-3xl bg-stone-100 flex items-center justify-center overflow-hidden">
              <img
                src="/images/hero-invitation.png"
                alt="Studio Designing"
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Copy description */}
          <div className="space-y-6 text-left">
            <h3 className="text-2xl md:text-3xl font-normal uppercase tracking-[0.5px] font-cinzel text-slate-800">Crafting Visual Milestones</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-semibold">
              Founded in Hyderabad, Ahvaanam is a boutique digital invitation design studio. We reject the self-service model in favor of custom craftsmanship, collaborating closely with families to capture the cultural essence of their milestone celebrations.
            </p>
            <p className="text-sm text-slate-500 leading-relaxed font-semibold">
              Every detail is meticulously refined by our layout designers—from gold vectors and customized soundtrack loops to multi-lingual translations and responsive display parameters.
            </p>

            <div className="flex gap-4 pt-2">
              <Link 
                href="/templates" 
                className="text-xs font-bold uppercase tracking-[1px] text-[#C49B27] hover:underline flex items-center gap-1"
              >
                View Portfolio <ArrowRight size={13} />
              </Link>
            </div>
          </div>

        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto border-t border-amber-100 pt-16 mt-16">
          {[
            {
              icon: Sparkles,
              title: "Luxury Aesthetics",
              desc: "Curated typography, gold leaf accents, and smooth physics-based animations."
            },
            {
              icon: Heart,
              title: "Cultural Respect",
              desc: "Deity symbols, traditional color schemes, and seamless native script translations."
            },
            {
              icon: Award,
              title: "Bespoke Consulting",
              desc: "Direct communication with a human designer and coordinator at every milestone step."
            }
          ].map((col, idx) => {
            const Icon = col.icon;
            return (
              <div key={idx} className="space-y-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#C49B27]">
                  <Icon size={18} />
                </div>
                <h4 className="text-lg font-bold font-cinzel text-slate-800">{col.title}</h4>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">{col.desc}</p>
              </div>
            );
          })}
        </div>

      </main>

      <Footer />
    </div>
  );
}
