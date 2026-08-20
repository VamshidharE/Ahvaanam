"use client";

import React from "react";
import { CheckCircle, ArrowLeft } from "lucide-react";

export default function PublicPricingPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#241E1C] flex flex-col font-sans relative overflow-x-hidden p-6 md:p-12">
      {/* Background orbs */}
      <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-yellow-600/[0.01] rounded-full blur-[100px]" />
      
      <header className="max-w-5xl mx-auto w-full mb-12 text-left">
        <a 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs text-[#241E1C]/60 hover:text-[#241E1C] transition-colors font-bold uppercase tracking-[1px]"
        >
          <ArrowLeft size={14} /> Back to Landing
        </a>
      </header>

      <main className="max-w-5xl mx-auto w-full flex-1 flex flex-col items-center justify-center gap-12 z-10 select-none">
        <div className="text-center space-y-3">
          <img src="/images/logo.png" alt="Ahvaanam" className="h-8 md:h-9 w-auto object-contain mx-auto" />
          <h1 className="text-3xl md:text-5xl font-normal uppercase tracking-[0.5px] [font-family:var(--cinzel),serif] text-[#241E1C]">Ahvaanam Pricing</h1>
          <p className="text-xs text-[#241E1C]/50 max-w-sm mx-auto uppercase tracking-[2px] font-bold">Transparent plans for couples & agencies</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left">
          {/* Card 1 */}
          <div className="card-minimal p-8 flex flex-col justify-between h-[360px]">
            <div className="space-y-4">
              <span className="text-[9px] uppercase font-bold tracking-[2px] text-[#241E1C]/40">Standard</span>
              <h3 className="text-lg font-bold text-[#241E1C]">Couple Single</h3>
              <div className="text-2xl font-bold font-mono text-[#241E1C]">₹1,999</div>
              <ul className="space-y-2 text-xs text-[#241E1C]/60 font-semibold">
                <li className="flex items-center gap-2"><CheckCircle size={12} className="text-[#C49B27]" /> Choose any 1 Theme</li>
                <li className="flex items-center gap-2"><CheckCircle size={12} className="text-[#C49B27]" /> Map Coordinates & RSVPs</li>
                <li className="flex items-center gap-2"><CheckCircle size={12} className="text-[#C49B27]" /> Live for 6 Months</li>
              </ul>
            </div>
            <a href="/#contact" className="w-full bg-[#FAF9F6] border border-zinc-200 text-[#241E1C]/80 font-bold py-2.5 rounded-xl text-[10px] uppercase tracking-[1px] text-center hover:border-[#C49B27]/40 transition-all shadow-sm">Buy Now</a>
          </div>

          {/* Card 2 */}
          <div className="card-minimal p-8 border-[#C49B27] flex flex-col justify-between h-[360px] shadow-[0_10px_30px_rgba(196,155,39,0.06)]">
            <div className="space-y-4">
              <span className="text-[9px] uppercase font-bold tracking-[2px] text-[#C49B27]">Popular</span>
              <h3 className="text-lg font-bold text-[#C49B27]">Creator Unlimited</h3>
              <div className="text-2xl font-bold font-mono text-[#C49B27]">₹4,999</div>
              <ul className="space-y-2 text-xs text-[#241E1C]/70 font-semibold">
                <li className="flex items-center gap-2"><CheckCircle size={12} className="text-[#C49B27]" /> Unlimited Wedding Invites</li>
                <li className="flex items-center gap-2"><CheckCircle size={12} className="text-[#C49B27]" /> Swap Themes Anytime</li>
                <li className="flex items-center gap-2"><CheckCircle size={12} className="text-[#C49B27]" /> Generate QR Codes for Print</li>
              </ul>
            </div>
            <a href="/dashboard" className="w-full bg-[#C49B27] hover:bg-[#B0871B] text-white font-bold py-2.5 rounded-xl text-[10px] uppercase tracking-[1px] text-center transition-all shadow-sm">Open Control Center</a>
          </div>

          {/* Card 3 */}
          <div className="card-minimal p-8 flex flex-col justify-between h-[360px]">
            <div className="space-y-4">
              <span className="text-[9px] uppercase font-bold tracking-[2px] text-[#241E1C]/40">Resellers</span>
              <h3 className="text-lg font-bold text-[#241E1C]">Print Studio</h3>
              <div className="text-2xl font-bold font-mono text-[#241E1C]">₹9,999</div>
              <ul className="space-y-2 text-xs text-[#241E1C]/60 font-semibold">
                <li className="flex items-center gap-2"><CheckCircle size={12} className="text-[#C49B27]" /> Whitelabel custom Domain</li>
                <li className="flex items-center gap-2"><CheckCircle size={12} className="text-[#C49B27]" /> Priority 24/7 Support</li>
              </ul>
            </div>
            <a href="/#contact" className="w-full bg-[#FAF9F6] border border-zinc-200 text-[#241E1C]/80 font-bold py-2.5 rounded-xl text-[10px] uppercase tracking-[1px] text-center hover:border-[#C49B27]/40 transition-all shadow-sm">Contact Us</a>
          </div>
        </div>
      </main>

      <footer className="max-w-5xl mx-auto w-full text-center text-[#241E1C]/30 text-[9px] mt-16 pt-6 border-t border-zinc-200/55 uppercase tracking-[1px]">
        © {new Date().getFullYear()} AHVAANAM DESIGN. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}
