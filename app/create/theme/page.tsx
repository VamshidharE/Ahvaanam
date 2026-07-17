"use client";

export const dynamic = "force-dynamic";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { useInvitationData } from "../../../components/context/InvitationDataContext";
import { CATEGORIES } from "../../../data/categories/categories";
import { getTemplatesByCategory } from "@/lib/templates";
import ThemeCard from "../../../components/shared/theme-card";

export default function ThemeSelectionPage() {
  const router = useRouter();
  const { selectedCategory, selectedTheme, setSelectedTheme } = useInvitationData();

  // Route guard: Redirect back to /create if no category is selected
  useEffect(() => {
    if (!selectedCategory) {
      router.push("/create");
    }
  }, [selectedCategory, router]);

  // Find active category details
  const activeCategory = CATEGORIES.find((cat) => cat.id === selectedCategory);

  // Filter themes linked to selected category
  const filteredThemes = selectedCategory ? getTemplatesByCategory(selectedCategory).map(template => ({
    id: template.id,
    categoryId: template.category,
    slug: template.id,
    name: template.name,
    description: template.description,
    coverImage: template.previewImage,
    enabled: true,
    displayOrder: 1
  })) : [];

  const handleContinue = () => {
    if (!selectedTheme) return;
    router.push("/create/details");
  };

  if (!selectedCategory) return null;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#241E1C] flex flex-col font-sans relative overflow-x-hidden">
      
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-[10%] left-[-15%] w-[600px] h-[600px] bg-yellow-600/[0.01] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-15%] w-[600px] h-[600px] bg-amber-500/[0.01] rounded-full blur-[150px] pointer-events-none" />

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-40 bg-[#FAF9F6]/80 border-b border-zinc-200/50 backdrop-blur-md px-8 h-16 flex items-center justify-between">
        <div className="flex items-center relative z-10">
          <img src="/images/logo.png" alt="Ahvaanam" className="h-26 w-auto object-contain translate-y-0 drop-shadow-sm" />
        </div>

        <button
          onClick={() => router.push("/create")}
          className="flex items-center gap-1.5 text-xs text-[#241E1C]/60 hover:text-[#241E1C] transition-colors font-bold uppercase tracking-[1px]"
        >
          <ArrowLeft size={14} /> Back to Category
        </button>
      </header>

      {/* --- MAIN PAGE CONTENT --- */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 py-10 z-10 flex flex-col gap-10">
        
        {/* --- STEP TIMELINE INDICATOR --- */}
        <div className="max-w-xl mx-auto w-full flex items-center justify-between relative px-2 select-none">
          {/* Connector Line */}
          <div className="absolute top-[18px] left-[15%] right-[15%] h-[1.5px] bg-zinc-200 z-0" />
          
          {/* Step 1 */}
          <div className="flex flex-col items-center gap-2 z-10">
            <div className="w-9 h-9 rounded-full bg-white text-[#C49B27] border border-[#C49B27]/40 flex items-center justify-center text-xs font-bold shadow-sm">
              1
            </div>
            <span className="text-[10px] uppercase font-bold tracking-[1.5px] text-[#C49B27]/60">Category</span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center gap-2 z-10">
            <div className="w-9 h-9 rounded-full bg-[#C49B27] text-white border border-[#C49B27] flex items-center justify-center text-xs font-bold shadow-sm">
              2
            </div>
            <span className="text-[10px] uppercase font-bold tracking-[1.5px] text-[#C49B27]">Choose Theme</span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center gap-2 z-10">
            <div className="w-9 h-9 rounded-full bg-white text-zinc-400 border border-zinc-200 flex items-center justify-center text-xs font-bold shadow-sm">
              3
            </div>
            <span className="text-[10px] uppercase font-bold tracking-[1.5px] text-zinc-400">Details Form</span>
          </div>
        </div>

        {/* --- SCREEN INTRO HEADER --- */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-600/15 bg-white text-[#C49B27] text-[9px] uppercase tracking-[2px] font-bold shadow-sm">
            <Sparkles size={11} /> Step Two: Choose Visual Layout <Sparkles size={11} />
          </div>
          <h1 className="text-3xl md:text-4xl font-normal uppercase tracking-[0.5px] [font-family:var(--cinzel),serif] text-[#241E1C]">
            Select {activeCategory?.name} Theme
          </h1>
          <p className="text-xs md:text-sm text-[#241E1C]/50 leading-relaxed max-w-md mx-auto">
            Choose from the dynamic themes designed specifically for your <strong className="text-[#C49B27]">{activeCategory?.name}</strong> ceremony.
          </p>
        </div>

        {/* --- DYNAMIC RESPONSIVE THEMES GRID --- */}
        {filteredThemes.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredThemes.map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                selected={selectedTheme === theme.id}
                onSelect={() => setSelectedTheme(theme.id)}
              />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 border border-dashed border-zinc-200 rounded-3xl bg-white/50 shadow-sm">
            <p className="text-[#241E1C]/40 text-xs font-semibold uppercase tracking-[1.5px]">No themes available for this category yet.</p>
          </div>
        )}

        {/* --- FOOTER WIZARD ACTIONS --- */}
        <div className="flex justify-between items-center border-t border-zinc-200/60 pt-8 mt-4">
          <button
            onClick={() => router.push("/create")}
            className="flex items-center gap-2 border border-zinc-200 hover:border-[#C49B27]/40 hover:bg-white text-[#241E1C]/70 hover:text-[#241E1C] px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-[1.5px] transition-all shadow-sm"
          >
            <ArrowLeft size={14} /> Back
          </button>

          <button
            onClick={handleContinue}
            disabled={!selectedTheme}
            className="flex items-center gap-2 bg-[#C49B27] hover:bg-[#B0871B] disabled:bg-zinc-200/50 text-white disabled:text-[#241E1C]/30 px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-[1.5px] transition-all disabled:shadow-none enabled:hover:scale-105 enabled:active:scale-95 disabled:cursor-not-allowed shadow-sm"
          >
            Continue <ArrowRight size={14} />
          </button>
        </div>

      </main>

      {/* --- FOOTER BRANDING --- */}
      <footer className="bg-white border-t border-zinc-200/60 py-6 text-center text-[9px] text-[#241E1C]/35 uppercase tracking-[1px] mt-10">
        © {new Date().getFullYear()} AHVAANAM CLIENT WIZARD. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}
