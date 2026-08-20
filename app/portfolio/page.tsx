"use client";

import React from "react";
import { Heart, Calendar, ArrowLeft, ExternalLink } from "lucide-react";

export default function PublicPortfolioPage() {
  return (
    <div className="min-h-screen bg-[#06030C] text-white flex flex-col font-sans relative overflow-x-hidden p-6 md:p-12">
      {/* Background orbs */}
      <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-yellow-500/[0.02] rounded-full blur-[100px]" />

      <header className="max-w-5xl mx-auto w-full mb-12">
        <a 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to Landing
        </a>
      </header>

      <main className="max-w-5xl mx-auto w-full flex-1 flex flex-col items-center justify-center gap-12 z-10">
        <div className="text-center space-y-3">
          <img src="/images/logo.png" alt="Ahvaanam" className="h-8 md:h-9 w-auto object-contain mx-auto" />
          <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-[1px] [font-family:var(--cinzel),serif]">Our Portfolio</h1>
          <p className="text-xs text-white/50 max-w-sm mx-auto uppercase tracking-[2px] font-bold">Showcase of premium wedding invites</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Item 1 */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col justify-between h-[200px] backdrop-blur-md hover:border-yellow-500/30 transition-all">
            <div>
              <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-[2px]">Royal Theme</span>
              <h3 className="text-xl font-bold mt-1">Kalyan & Vasudha</h3>
              <p className="text-xs text-white/50 flex items-center gap-1.5 mt-2">
                <Calendar size={13} /> June 29, 2026
              </p>
              <p className="text-xs text-white/40 mt-3">Classic South Indian traditional temple aesthetics, gold accents, floating particles.</p>
            </div>
            <a 
              href="/invites/kalyan-vasudha" 
              target="_blank"
              className="text-xs text-yellow-500 hover:text-yellow-400 font-bold flex items-center gap-1 border-t border-white/5 pt-3 mt-4"
            >
              Open Live Invitation <ExternalLink size={12} />
            </a>
          </div>

          {/* Item 2 */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col justify-between h-[200px] backdrop-blur-md opacity-60">
            <div>
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-[2px]">Moonlight Theme</span>
              <h3 className="text-xl font-bold mt-1">Rahul & Priya</h3>
              <p className="text-xs text-white/50 flex items-center gap-1.5 mt-2">
                <Calendar size={13} /> December 31, 2026
              </p>
              <p className="text-xs text-white/40 mt-3">Purple rose-gold stellar patterns, night theme, luxury overlays, dynamic countdown.</p>
            </div>
            <span 
              className="text-xs text-white/30 font-bold flex items-center gap-1 border-t border-white/5 pt-3 mt-4"
            >
              Demo Coming Soon
            </span>
          </div>
        </div>
      </main>

      <footer className="max-w-5xl mx-auto w-full text-center text-white/30 text-[10px] mt-16 pt-6 border-t border-white/5 uppercase tracking-[1px]">
        Ahvaanam Design. All rights reserved.
      </footer>
    </div>
  );
}
