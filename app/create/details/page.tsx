"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, AlertCircle, Loader } from "lucide-react";
import { useInvitationData } from "../../../components/context/InvitationDataContext";
import { CATEGORIES } from "../../../data/categories/categories";
import { getTemplate } from "@/lib/templates";
import { getCategoryFields } from "@/lib/categories/utils";

export default function DetailsInputPage() {
  const router = useRouter();
  const { selectedCategory, selectedTheme } = useInvitationData();

  // Dynamic form state
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

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

  const isFormValid = () => {
    return fields.every((field) => !field.required || (formData[field.key] && formData[field.key].trim() !== ""));
  };

  // Route guard: Redirect back to /create if no category or theme is selected
  useEffect(() => {
    if (!selectedCategory || !selectedTheme) {
      router.push("/create");
    }
  }, [selectedCategory, selectedTheme, router]);

  // Find selected category and theme names
  const categoryDetails = CATEGORIES.find((cat) => cat.id === selectedCategory);
  const template = selectedTheme ? getTemplate(selectedTheme) : undefined;
  const themeDetails = template ? {
    id: template.id,
    categoryId: template.category,
    slug: template.id,
    name: template.name,
    description: template.description,
    coverImage: template.previewImage,
    enabled: true,
    displayOrder: 1
  } : undefined;

  // Dynamic values extracted for slug and backwards-compatible payload
  const groomVal = formData["groom.name"] || formData["celebrant.name"] || formData["hosts"] || formData["baby.name"] || formData["mother.name"] || formData["company"] || formData["festivalName"] || "";
  const brideVal = formData["bride.name"] || formData["father.name"] || formData["eventTitle"] || "";

  // Auto-generate URL slug when names change
  useEffect(() => {
    let slugBase = "";
    if (groomVal && brideVal) {
      slugBase = `${groomVal.trim()}-${brideVal.trim()}`;
    } else if (groomVal) {
      slugBase = groomVal.trim();
    }

    if (slugBase) {
      const generated = slugBase
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-");
      setSlug(generated);
    } else {
      setSlug("");
    }
  }, [groomVal, brideVal]);

  const handleBuild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid() || !slug) {
      setError("Please fill out all required fields.");
      return;
    }

    setCreating(true);
    setError(null);

    const isRoseMandap = selectedTheme === "rose-mandap";
    const groomPayload = groomVal.trim().length >= 2 ? groomVal.trim() : (isRoseMandap ? "Aarav" : "Host");
    const bridePayload = brideVal.trim().length >= 2 ? brideVal.trim() : (isRoseMandap ? "Ananya" : "Guest");

    // Step 5: Collect and preserve dynamic metadata in local storage
    const tempCollectedData = {
      category: selectedCategory,
      themeId: selectedTheme,
      formData: formData,
    };
    localStorage.setItem("pending_invitation_metadata", JSON.stringify(tempCollectedData));

    try {
      const res = await fetch("/api/invitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: slug, 
          groom: groomPayload, 
          bride: bridePayload,
          surname: "",
          themeId: selectedTheme 
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.details && Array.isArray(data.details)) {
          const detailMsgs = data.details.map((d: any) => d.message).join(" ");
          throw new Error(detailMsgs || data.error);
        }
        throw new Error(data.error || "Failed to create profile");
      }

      // Redirect to editor
      window.location.href = `/admin/${data.id}`;
    } catch (err: any) {
      setError(err.message || "Failed to create invitation. Try again.");
      setCreating(false);
    }
  };

  if (!selectedCategory || !selectedTheme) return null;

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
          onClick={() => router.push("/create/theme")}
          className="flex items-center gap-1.5 text-xs text-[#241E1C]/60 hover:text-[#241E1C] transition-colors font-bold uppercase tracking-[1px]"
        >
          <ArrowLeft size={14} /> Back to Themes
        </button>
      </header>

      {/* --- MAIN PAGE CONTENT --- */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 md:px-12 py-10 z-10 flex flex-col gap-10">
        
        {/* --- STEP TIMELINE INDICATOR --- */}
        <div className="max-w-xl mx-auto w-full flex items-center justify-between relative px-2 select-none">
          {/* Connector Line */}
          <div className="absolute top-[18px] left-[15%] right-[15%] h-[1.5px] bg-zinc-200 z-0" />
          
          {/* Step 1 */}
          <div className="flex flex-col items-center gap-2 z-10">
            <div className="w-9 h-9 rounded-full bg-white text-[#C49B27] border border-[#C49B27]/40 flex items-center justify-center text-xs font-semibold">
              1
            </div>
            <span className="text-[10px] uppercase font-bold tracking-[1.5px] text-[#C49B27]/60">Category</span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center gap-2 z-10">
            <div className="w-9 h-9 rounded-full bg-white text-[#C49B27] border border-[#C49B27]/40 flex items-center justify-center text-xs font-semibold">
              2
            </div>
            <span className="text-[10px] uppercase font-bold tracking-[1.5px] text-[#C49B27]/60">Choose Theme</span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center gap-2 z-10">
            <div className="w-9 h-9 rounded-full bg-[#C49B27] text-white border border-[#C49B27] flex items-center justify-center text-xs font-bold shadow-sm">
              3
            </div>
            <span className="text-[10px] uppercase font-bold tracking-[1.5px] text-[#C49B27]">Details Form</span>
          </div>
        </div>

        {/* --- SCREEN INTRO HEADER --- */}
        <div className="text-center space-y-3 max-w-xl mx-auto text-left md:text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-600/15 bg-white text-[#C49B27] text-[9px] uppercase tracking-[2px] font-bold shadow-sm">
            <Sparkles size={11} /> Step Three: Details & Build <Sparkles size={11} />
          </div>
          <h1 className="text-3xl font-normal uppercase tracking-[0.5px] [font-family:var(--cinzel),serif] text-[#241E1C]">
            Configure Ceremony Details
          </h1>
          <p className="text-xs text-[#241E1C]/50 leading-relaxed">
            Enter the couple's details to generate a custom URL link and activate the <strong className="text-[#C49B27]">{themeDetails?.name}</strong> template.
          </p>
        </div>

        {/* --- FORM PANEL --- */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-amber-500/10 rounded-3xl p-8 max-w-lg mx-auto w-full shadow-sm"
        >
          <form onSubmit={handleBuild} className="space-y-6 text-left">
            
            {/* Dynamic Fields */}
            {fields.map((field) => {
              const isTextarea = field.type === "textarea";

              return (
                <div key={field.key} className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1.5px]">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {isTextarea ? (
                    <textarea
                      placeholder={field.placeholder}
                      value={formData[field.key] || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                      required={field.required}
                      disabled={creating}
                      className="bg-[#FAF9F6] border border-zinc-200 focus:border-[#C49B27] outline-none rounded-xl px-4 py-3 text-xs text-[#241E1C] w-full transition-colors disabled:opacity-50 min-h-[90px] resize-y"
                    />
                  ) : (
                    <input
                      type={field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "time" ? "time" : "text"}
                      placeholder={field.placeholder}
                      value={formData[field.key] || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                      required={field.required}
                      disabled={creating}
                      className="bg-[#FAF9F6] border border-zinc-200 focus:border-[#C49B27] outline-none rounded-xl px-4 py-3 text-xs text-[#241E1C] w-full transition-colors disabled:opacity-50"
                    />
                  )}
                </div>
              );
            })}

            {/* URL Slug (with real-time generation preview) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1.5px]">
                <span>Invitation URL Link</span>
                <span className="text-[#C49B27] font-mono text-[8px] font-bold">Editable URL Slug</span>
              </div>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="e.g. karthik-anusha"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  required
                  disabled={creating}
                  className="bg-[#FAF9F6] border border-zinc-200 focus:border-[#C49B27] outline-none rounded-xl pl-4 pr-16 py-3 text-xs text-[#241E1C] w-full transition-colors disabled:opacity-50 font-mono"
                />
                <div className="absolute right-4 text-[9px] font-mono text-[#241E1C]/35 font-bold uppercase select-none">
                  .json
                </div>
              </div>
              <p className="text-[10px] text-[#241E1C]/40 italic font-semibold">
                Preview: <span className="text-[#C49B27] font-mono text-[9px]">/invites/{slug || "invitation"}</span>
              </p>
            </div>

            {/* Error Message Box */}
            {error && (
              <div className="bg-red-500/5 border border-red-500/20 text-red-600 p-4 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push("/create/theme")}
                disabled={creating}
                className="w-1/2 py-3 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:bg-[#FAF9F6] text-[#241E1C]/75 text-xs font-bold uppercase tracking-[1.5px] transition-all disabled:opacity-50 shadow-sm"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={creating || !isFormValid() || !slug}
                className="w-1/2 bg-[#C49B27] hover:bg-[#B0871B] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-[1.5px] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none hover:scale-[1.02] active:scale-[0.98]"
              >
                {creating ? (
                  <>
                    <Loader className="animate-spin" size={12} /> Building...
                  </>
                ) : (
                  <>
                    Build Invitation
                  </>
                )}
              </button>
            </div>

          </form>
        </motion.div>

      </main>

      {/* --- FOOTER BRANDING --- */}
      <footer className="bg-white border-t border-zinc-200/60 py-6 text-center text-[9px] text-[#241E1C]/35 uppercase tracking-[1px] mt-10">
        © {new Date().getFullYear()} AHVAANAM CLIENT WIZARD. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}
