"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#241E1C] font-sans flex flex-col justify-between pt-28">
      <Navbar />

      <main className="max-w-md mx-auto w-full px-6 flex-1 flex flex-col items-center justify-center text-center space-y-8 z-10 select-none">
        
        <div className="space-y-3">
          <span className="text-8xl font-bold font-cinzel text-[#C49B27] tracking-wider block">404</span>
          <span className="text-sm font-bold uppercase tracking-[3px] text-slate-400">Design Not Found</span>
        </div>

        <div className="w-12 h-[1.5px] bg-[#D4AF37]/45" />

        <p className="text-xs text-slate-500 leading-relaxed font-semibold max-w-xs mx-auto">
          The custom layout or page you are looking for does not exist or has been relocated by our coordinators.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 border border-zinc-200 hover:border-amber-400 py-3.5 rounded-xl text-xs font-bold uppercase tracking-[1px] text-slate-700 hover:text-amber-600 transition-all bg-white"
          >
            <ArrowLeft size={14} /> Return Home
          </Link>
          <Link
            href="/contact"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-[1px] shadow-md hover:shadow-lg transition-shadow active:scale-[0.98]"
          >
            Contact Studio
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
