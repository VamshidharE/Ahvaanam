"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, Loader, AlertCircle } from "lucide-react";
import { useInvitationData } from "../../components/context/InvitationDataContext";
import { CATEGORIES } from "../../data/categories/categories";
import { getTemplatesByCategory } from "@/lib/templates";
import { getCategoryFields } from "@/lib/categories/utils";
import CategoryCard from "../../components/shared/category-card";
import ThemeCard from "../../components/shared/theme-card";

export default function CategorySelectionPage() {
  const router = useRouter();
  const { 
    selectedCategory, 
    setSelectedCategory, 
    selectedTheme, 
    setSelectedTheme,
    invitationData,
    updateInvitationData,
    saveConfig
  } = useInvitationData();

  // Local state for dynamic form inputs and creation loader
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [creating, setCreating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Retrieve field definitions dynamically based on selected category, excluding venue, date, time, and address
  const fields = selectedCategory 
    ? getCategoryFields(selectedCategory).filter(f => !["venue", "date", "time", "address"].includes(f.key)) 
    : [];

  // Reset form inputs when selected category changes
  useEffect(() => {
    if (selectedCategory) {
      const initialForm: Record<string, string> = {};
      const categoryFields = getCategoryFields(selectedCategory).filter(f => !["venue", "date", "time", "address"].includes(f.key));
      categoryFields.forEach((field) => {
        initialForm[field.key] = "";
      });
      setFormData(initialForm);
    }
  }, [selectedCategory]);

  const handleFieldChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const isFormValid = () => {
    return fields.every((field) => !field.required || (formData[field.key] && formData[field.key].trim() !== ""));
  };

  // Filter enabled categories and sort by displayOrder
  const enabledCategories = CATEGORIES
    .filter((cat) => cat.enabled)
    .sort((a, b) => a.displayOrder - b.displayOrder);

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

  // Find active category details
  const activeCategory = CATEGORIES.find((cat) => cat.id === selectedCategory);

  const handleCreateInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      setError("Please fill out all required fields.");
      return;
    }

    setCreating(true);
    setError(null);
    setLoadingStep(0);

    // Sequence progress indicator messages every 600ms
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % 3);
    }, 600);

    // Dynamic slug generation based on filled names
    const groomVal = formData["groom.name"] || formData["celebrant.name"] || formData["hosts"] || formData["baby.name"] || formData["mother.name"] || formData["company"] || formData["festivalName"] || "";
    const brideVal = formData["bride.name"] || formData["father.name"] || formData["eventTitle"] || "";

    let slugBase = "";
    if (groomVal && brideVal) {
      slugBase = `${groomVal.trim()}-${brideVal.trim()}`;
    } else if (groomVal) {
      slugBase = groomVal.trim();
    } else {
      slugBase = "invitation";
    }

    let slug = slugBase
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");
    if (!slug) slug = "invitation-" + Math.floor(1000 + Math.random() * 9000);

    // Backwards-compatible payload values ensuring API Zod schema passes
    const groomPayload = groomVal.trim().length >= 2 ? groomVal.trim() : "Host";
    const bridePayload = brideVal.trim().length >= 2 ? brideVal.trim() : "Guest";

    // Step 5: Collect and preserve dynamic metadata in local storage
    const tempCollectedData = {
      category: selectedCategory,
      themeId: selectedTheme,
      formData: formData,
    };
    localStorage.setItem("pending_invitation_metadata", JSON.stringify(tempCollectedData));

    const requestPayload = !selectedCategory || selectedCategory === "wedding"
      ? { 
          id: slug, 
          groom: groomPayload, 
          bride: bridePayload,
          surname: "",
          themeId: selectedTheme 
        }
      : {
          id: slug,
          category: selectedCategory,
          themeId: selectedTheme,
          metadata: formData
        };

    const minWaitTime = new Promise((resolve) => setTimeout(resolve, 1800));

    try {
      let res = await fetch("/api/invitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });

      let data = await res.json();

      // Auto-retry with random suffix if slug exists
      if (!res.ok && data.error?.toLowerCase().includes("already exists")) {
        slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
        const retryPayload = { ...requestPayload, id: slug };
        
        res = await fetch("/api/invitation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(retryPayload),
        });
        data = await res.json();
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate invitation profile");
      }

      // Complete min loader duration for visual polish
      await minWaitTime;

      clearInterval(stepInterval);
      window.location.href = `/admin/${data.id}`;
    } catch (err: any) {
      clearInterval(stepInterval);
      setError(err.message || "Failed to generate invitation. Try again.");
      setCreating(false);
    }
  };

  // Determine current active visual wizard step
  let currentStep = 1;
  if (selectedCategory && selectedTheme) {
    currentStep = 3;
  } else if (selectedCategory) {
    currentStep = 2;
  }

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
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-1.5 text-xs text-[#241E1C]/60 hover:text-[#241E1C] transition-colors font-bold uppercase tracking-[1px]"
        >
          <ArrowLeft size={14} /> Back to Dashboard
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
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shadow-sm transition-colors duration-300 border ${
              currentStep >= 1 ? "bg-[#C49B27] text-white border-[#C49B27]" : "bg-white text-zinc-400 border-zinc-200"
            }`}>
              1
            </div>
            <span className={`text-[10px] uppercase font-bold tracking-[1.5px] transition-colors ${
              currentStep >= 1 ? "text-[#C49B27]" : "text-zinc-400"
            }`}>Category</span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center gap-2 z-10">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shadow-sm transition-colors duration-300 border ${
              currentStep >= 2 ? "bg-[#C49B27] text-white border-[#C49B27]" : "bg-white text-zinc-400 border-zinc-200"
            }`}>
              2
            </div>
            <span className={`text-[10px] uppercase font-bold tracking-[1.5px] transition-colors ${
              currentStep >= 2 ? "text-[#C49B27]" : "text-zinc-400"
            }`}>Choose Theme</span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center gap-2 z-10">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shadow-sm transition-colors duration-300 border ${
              currentStep >= 3 ? "bg-[#C49B27] text-white border-[#C49B27]" : "bg-white text-zinc-400 border-zinc-200"
            }`}>
              3
            </div>
            <span className={`text-[10px] uppercase font-bold tracking-[1.5px] transition-colors ${
              currentStep >= 3 ? "text-[#C49B27]" : "text-zinc-400"
            }`}>Details Form</span>
          </div>
        </div>

        {/* --- SCREEN INTRO HEADER --- */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-600/15 bg-white text-[#C49B27] text-[9px] uppercase tracking-[2px] font-bold shadow-sm">
            <Sparkles size={11} /> Ahvaanam Client Studio <Sparkles size={11} />
          </div>
          <h1 className="text-3xl md:text-4xl font-normal uppercase tracking-[0.5px] [font-family:var(--cinzel),serif] text-[#241E1C]">
            Create Ceremony Invitation
          </h1>
          <p className="text-xs md:text-sm text-[#241E1C]/50 leading-relaxed max-w-md mx-auto">
            Choose an event category and theme to prefill details for your personalized live digital invitation.
          </p>
        </div>

        {/* --- DYNAMIC TRANSITIONING SELECTION SPLIT VIEW --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CATEGORIES COL */}
          <div className={`transition-all duration-500 ${selectedCategory ? "lg:col-span-5" : "lg:col-span-12"}`}>
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/50 text-left">
                Select Event Category
              </h3>
              <div className={`grid gap-4 ${selectedCategory ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"}`}>
                {enabledCategories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    selected={selectedCategory === category.id}
                    templateCount={getTemplatesByCategory(category.id).length}
                    onSelect={() => {
                      setSelectedCategory(category.id);
                      setSelectedTheme(null); // Reset theme when switching category
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* THEMES & DETAILS COL */}
          <div className={`lg:col-span-7 transition-all ${selectedCategory ? "block" : "hidden"}`}>
            <AnimatePresence>
              {selectedCategory && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {/* Theme header */}
                  <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/50 text-left">
                    Select {activeCategory?.name} Theme Layout
                  </h3>

                  {/* Themes list */}
                  {filteredThemes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredThemes.map((theme) => (
                        <ThemeCard
                          key={theme.id}
                          theme={theme}
                          selected={selectedTheme === theme.id}
                          onSelect={() => setSelectedTheme(theme.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 border border-dashed border-zinc-200 rounded-3xl bg-white/50 shadow-sm">
                      <p className="text-[#241E1C]/40 text-xs font-semibold uppercase tracking-[1.5px]">No themes available yet.</p>
                    </div>
                  )}

                  {/* Details Form (Revealed under selected theme) */}
                  <AnimatePresence>
                    {selectedTheme && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white border border-amber-500/10 rounded-[28px] p-6 md:p-8 shadow-sm space-y-5 text-left mt-6"
                      >
                        <div className="border-b border-zinc-100 pb-3 flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase tracking-[1.5px] text-[#C49B27] flex items-center gap-1.5">
                            <Sparkles size={14} /> Configure {activeCategory?.name || "Ceremony"} Details
                          </h4>
                          <span className="text-[9px] uppercase font-bold text-slate-400">Step 3 of 3</span>
                        </div>

                        <form onSubmit={handleCreateInvitation} className="space-y-5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {fields.map((field) => {
                              const isTextarea = field.type === "textarea";
                              const colSpanClass = isTextarea ? "sm:col-span-2" : "";

                              return (
                                <div key={field.key} className={`flex flex-col gap-1.5 ${colSpanClass}`}>
                                  <label className="text-[9px] uppercase font-bold text-[#241E1C]/55 tracking-[1.5px]">
                                    {field.label} {field.required && <span className="text-red-500">*</span>}
                                  </label>
                                  {isTextarea ? (
                                    <textarea
                                      placeholder={field.placeholder}
                                      value={formData[field.key] || ""}
                                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                                      className="bg-[#FAF9F6] border border-zinc-200 focus:border-[#C49B27] outline-none rounded-xl px-4 py-2.5 text-xs text-[#241E1C] w-full transition-colors font-medium min-h-[80px] resize-y"
                                      required={field.required}
                                      disabled={creating}
                                    />
                                  ) : (
                                    <input
                                      type={field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "time" ? "time" : "text"}
                                      placeholder={field.placeholder}
                                      value={formData[field.key] || ""}
                                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                                      className="bg-[#FAF9F6] border border-zinc-200 focus:border-[#C49B27] outline-none rounded-xl px-4 py-2.5 text-xs text-[#241E1C] w-full transition-colors font-medium"
                                      required={field.required}
                                      disabled={creating}
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {error && (
                            <div className="bg-red-500/5 border border-red-500/20 text-red-600 p-4 rounded-xl text-xs flex items-center gap-2">
                              <AlertCircle size={14} className="shrink-0" />
                              <span className="font-semibold">{error}</span>
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={creating || !isFormValid()}
                            className="w-full flex items-center justify-center gap-2 bg-[#C49B27] hover:bg-[#B0871B] disabled:bg-zinc-200/50 text-white disabled:text-[#241E1C]/30 py-3.5 rounded-xl text-xs font-bold uppercase tracking-[1.5px] transition-all disabled:shadow-none hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed shadow-sm"
                          >
                            ✨ Create Invitation
                          </button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </main>

      {/* --- PREMIUM STAGED LOADING MODAL OVERLAY --- */}
      <AnimatePresence>
        {creating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#FAF9F6]/95 flex flex-col items-center justify-center text-center space-y-6 select-none"
          >
            <div className="relative">
              <div className="w-16 h-16 border-2 border-[#C49B27] border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="text-[#C49B27] animate-pulse" size={20} />
              </div>
            </div>
            <div className="h-10 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={loadingStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs font-bold uppercase tracking-[2px] text-[#C49B27] [font-family:var(--cinzel),serif]"
                >
                  {loadingStep === 0 && "Creating Invitation..."}
                  {loadingStep === 1 && "Applying Selected Theme..."}
                  {loadingStep === 2 && "Preparing Live Preview..."}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FOOTER BRANDING --- */}
      <footer className="bg-white border-t border-zinc-200/60 py-6 text-center text-[9px] text-[#241E1C]/35 uppercase tracking-[1px] mt-10">
        © {new Date().getFullYear()} AHVAANAM CLIENT WIZARD. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}
