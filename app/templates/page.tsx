"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Eye, ArrowRight, X, Sparkles, FolderOpen } from "lucide-react";
import Link from "next/link";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import { createClient } from "@/utils/supabase/client";

const templatesList: Array<{
  slug: string;
  title: string;
  category: string;
  type: string;
  desc: string;
  image: string;
}> = [];

function TemplatesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  const categories = [
    { id: "all", name: "All Designs" }
  ];

  const filteredTemplates = templatesList.filter((tpl) => {
    const matchesCategory = activeCategory === "all" || tpl.category === activeCategory;
    const matchesQuery = tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tpl.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tpl.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#241E1C] font-sans relative overflow-x-hidden pt-28">
      <Navbar />

      <div className="absolute top-[10%] left-[-10%] w-[450px] h-[450px] bg-amber-100/30 rounded-full blur-[100px] pointer-events-none" />

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10 space-y-16">
        
        {/* Title */}
        <div className="text-center space-y-4">
          <span className="text-sm font-bold uppercase tracking-[4px] text-[#C49B27] block">Portfolio Collection</span>
          <h1 className="text-4xl md:text-6xl font-normal uppercase tracking-[0.5px] [font-family:var(--cinzel),serif]">Handcrafted Designs</h1>
          <p className="text-xs text-[#241E1C]/50 max-w-sm mx-auto uppercase tracking-[2px] font-bold">Select a design style to request customization</p>
        </div>

        {/* Controls: Search + Categories */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/70 border border-white p-4 rounded-3xl shadow-lg backdrop-blur-md">
          
          {/* Categories Tab list */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[1.5px] transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "bg-[#C49B27] text-white shadow-md"
                    : "bg-stone-100 hover:bg-stone-200 text-[#241E1C]/75"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search design styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-100 border border-zinc-200 rounded-full px-5 py-3 pl-11 text-xs text-[#241E1C] outline-none focus:border-[#C49B27]"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#241E1C]/40" size={16} />
          </div>

        </div>

        {/* Grid List or Empty State */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
            {filteredTemplates.map((tpl) => (
              <div key={tpl.slug} className="rounded-[30px] border border-zinc-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold uppercase font-cinzel">{tpl.title}</h3>
                <p className="text-xs text-zinc-500 mt-2">{tpl.desc}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-xl mx-auto rounded-3xl border border-white bg-white/80 p-12 text-center shadow-xl backdrop-blur-md space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-100/50 flex items-center justify-center text-[#C49B27] mx-auto">
              <FolderOpen size={28} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold uppercase font-cinzel text-[#241E1C]">No Active Templates</h3>
              <p className="text-xs text-zinc-500 font-semibold leading-relaxed">
                All previous templates have been removed. Collaborate with our studio to request a bespoke custom design built for your celebration.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#C49B27] text-white rounded-xl text-[10px] font-bold uppercase tracking-[2px] shadow-md hover:scale-105 transition-all"
            >
              Contact Studio <ArrowRight size={14} />
            </Link>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#FAF9F6] pt-28 text-center text-xs font-bold uppercase tracking-[2px] text-[#C49B27]">Loading Templates...</div>}>
      <TemplatesContent />
    </React.Suspense>
  );
}
