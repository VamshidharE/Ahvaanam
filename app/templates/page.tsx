"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Eye, ArrowRight, X, Sparkles } from "lucide-react";
import Link from "next/link";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import { createClient } from "@/utils/supabase/client";

const templatesList = [
  {
    slug: "royal-temple",
    title: "Royal Temple Layout",
    category: "wedding",
    type: "Traditional",
    desc: "Ornate golden pillars, traditional arches, and gold leaf detailing.",
    image: "/images/themes/royal-temple.jpg",
  },
  {
    slug: "floral-garden",
    title: "Floral Garden Layout",
    category: "wedding",
    type: "Elegant",
    desc: "Rose gold accents, blooming borders, and pastel overlays.",
    image: "/images/themes/floral-garden.jpg",
  },
  {
    slug: "south-indian",
    title: "South Indian Traditional",
    category: "wedding",
    type: "Traditional",
    desc: "Muted copper tones, banana leaf frames, and sacred marigolds.",
    image: "/images/themes/south-indian.jpg",
  },
  {
    slug: "palace-luxury",
    title: "Palace Luxury Layout",
    category: "wedding",
    type: "Royal",
    desc: "Grand palace gates, royal red velvet overlays, and gold borders.",
    image: "/images/themes/palace-luxury.jpg",
  },
  {
    slug: "lotus-serenity",
    title: "Lotus Serenity Layout",
    category: "wedding",
    type: "Spiritual",
    desc: "Sacred pink lotus blossoms and glowing golden spiritual overlays.",
    image: "/images/themes/lotus-serenity.jpg",
  },
  {
    slug: "marigold",
    title: "Marigold Celebration",
    category: "wedding",
    type: "Festive",
    desc: "Vibrant orange and yellow marigold garlands with festive backgrounds.",
    image: "/images/themes/marigold.jpg",
  },
  {
    slug: "peacock",
    title: "Peacock Royal Layout",
    category: "wedding",
    type: "Royal",
    desc: "Majestic peacock feather overlays and deep royal blue gradients.",
    image: "/images/themes/peacock.jpg",
  },
  {
    slug: "heritage",
    title: "Heritage Haveli Layout",
    category: "wedding",
    type: "Heritage",
    desc: "Terracotta textures, vintage stone arches, and heritage designs.",
    image: "/images/themes/heritage.jpg",
  },
  {
    slug: "moonlight",
    title: "Moonlight Wedding Layout",
    category: "wedding",
    type: "Modern",
    desc: "Midnight skies, glowing lanterns, and starry overlays.",
    image: "/images/themes/moonlight.jpg",
  },
  {
    slug: "grand-mandap",
    title: "Grand Mandap Layout",
    category: "wedding",
    type: "Traditional",
    desc: "Luxurious floral mandap stages with traditional hanging lights.",
    image: "/images/themes/grand-mandap.jpg",
  }
];

function TemplatesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<typeof templatesList[0] | null>(null);
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  // Sync with search parameter on load
  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  const categories = [
    { id: "all", name: "All Designs" },
    { id: "wedding", name: "Wedding Only" }
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

        {/* Grid List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
          <AnimatePresence mode="popLayout">
            {filteredTemplates.map((tpl) => (
                <motion.div
                  key={tpl.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="group relative overflow-hidden rounded-[30px] border border-zinc-200/60 bg-white p-4 shadow-sm hover:shadow-[0_20px_50px_rgba(196,155,39,0.12)] hover:-translate-y-2 hover:border-[#C49B27]/40 transition-all duration-300 flex flex-col justify-between select-none"
                >
                  {/* Gold Premium Shine Overlay */}
                  <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[600px] transition-transform duration-1000 ease-out pointer-events-none z-10" />

                  <div>
                    {/* Landscape 16:9 Thumbnail preview container */}
                    <div className="relative w-full aspect-[16/10] bg-stone-50 border border-zinc-100 rounded-2xl overflow-hidden shrink-0 shadow-xs">
                      <img
                        src={tpl.image}
                        alt={tpl.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                  <div className="mt-5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase font-bold text-[#C49B27] tracking-[2px]">{tpl.type} Style</span>
                      <span className="text-[8px] uppercase font-bold bg-amber-50 border border-amber-200/50 text-[#C49B27] px-2.5 py-0.5 rounded-full">{tpl.category}</span>
                    </div>
                    <h3 className="text-xl font-bold uppercase font-cinzel text-slate-800 tracking-[0.5px] group-hover:text-[#C49B27] transition-colors">{tpl.title}</h3>
                    <p className="text-xs text-[#241E1C]/55 leading-relaxed line-clamp-1 font-semibold">{tpl.desc}</p>
                  </div>
                </div>

                <div className="border-t border-zinc-100 pt-4 mt-6">
                  <Link 
                    href={user ? `/create?theme=${tpl.slug}` : `/login?redirect=${encodeURIComponent(`/create?theme=${tpl.slug}`)}`}
                    className="w-full py-3 bg-[#C49B27] hover:bg-[#B0871B] text-white rounded-xl text-[10px] font-bold uppercase tracking-[1.5px] transition-all flex items-center justify-center gap-1.5 shadow-sm group-hover:shadow-md"
                  >
                    Request This Design
                    <ArrowRight size={12} className="transform group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <p className="text-base font-semibold text-slate-500">No template designs found matching your filters.</p>
            <button 
              onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}
              className="text-xs text-[#C49B27] font-bold uppercase tracking-[1px] hover:underline"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </main>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-[32px] overflow-hidden p-6 md:p-8 shadow-2xl border border-amber-200/30 flex flex-col gap-6"
            >
              <button
                onClick={() => setPreviewTemplate(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 text-slate-500 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
              >
                <X size={16} />
              </button>

              <div className="rounded-2xl overflow-hidden bg-stone-50 border border-zinc-100 flex items-center justify-center">
                <img
                  src={previewTemplate.image}
                  alt={previewTemplate.title}
                  className="w-full h-auto object-cover max-h-[320px]"
                />
              </div>

              <div className="space-y-3">
                <span className="text-[9px] uppercase font-bold text-[#C49B27] tracking-[2px]">{previewTemplate.type} Layout</span>
                <h3 className="text-2xl font-bold font-cinzel text-[#241E1C]">{previewTemplate.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{previewTemplate.desc}</p>
              </div>

              <div className="flex gap-4 border-t border-zinc-100 pt-6">
                <Link
                  href={`/templates/${previewTemplate.slug}`}
                  onClick={() => setPreviewTemplate(null)}
                  className="flex-1 text-center border border-zinc-200 hover:border-amber-400 py-3.5 rounded-xl text-xs font-bold uppercase tracking-[1px] text-slate-700 hover:text-amber-600 transition-all"
                >
                  View Details
                </Link>
                 <Link
                  href={user ? `/create?theme=${previewTemplate.slug}` : `/login?redirect=${encodeURIComponent(`/create?theme=${previewTemplate.slug}`)}`}
                  onClick={() => setPreviewTemplate(null)}
                  className="flex-1 text-center bg-gradient-to-r from-amber-500 to-yellow-500 text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-[1px] shadow-md hover:shadow-lg transition-shadow active:scale-[0.98]"
                >
                  Request Style
                </Link>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default function PremiumTemplatesPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#FAF9F6] text-[#241E1C] flex items-center justify-center font-cinzel text-xs uppercase tracking-[2px]">Loading Collection...</div>}>
      <TemplatesContent />
    </React.Suspense>
  );
}
