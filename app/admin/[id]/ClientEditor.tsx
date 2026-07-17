"use client";

import React, { useState, useEffect, useRef, use } from "react";
import { InvitationDataProvider, useInvitationData } from "../../../components/context/InvitationDataContext";
import { WeddingInvitationConfig, WeddingEvent, StoryTimelineEntry, VenueDetail, RSVPContact, FAQEntry } from "../../../components/types/invitation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getCategory, getCategoryFields, getCategoryGroups } from "@/lib/categories/utils";
import { getTemplatesByCategory } from "@/lib/templates";
import { getManifest } from "@/lib/template-manifests";
import { 
  Palette, Sliders, Heart, Calendar, Clock, MapPin, 
  Phone, HelpCircle, Shirt, Save, ArrowLeft, Plus, 
  Trash2, ArrowUp, ArrowDown, Upload, CheckCircle2, AlertCircle
} from "lucide-react";

// --- CONFETTI CANVAS EFFECT ---
function ConfettiCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const colors = ["#FFD700", "#FF8C00", "#FF4500", "#FFC0CB", "#00FF88", "#00F5FF"];
    const particles = Array.from({ length: 120 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      r: Math.random() * 5 + 3,
      d: Math.random() * height,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.07 + 0.02,
      tiltAngle: 0,
    }));

    function resize() {
      if (canvas) {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
      }
    }
    window.addEventListener("resize", resize);

    let animationFrameId: number;
    let frameCount = 0;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, idx) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - idx / 3) * 12;

        if (p.y > height) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });

      frameCount++;
      if (frameCount < 250) {
        animationFrameId = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    }

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-50" />;
}

// --- FILE UPLOADER BUTTON ---
interface FileUploaderProps {
  onUploadSuccess: (url: string) => void;
  label?: string;
  className?: string;
}

function FileUploader({ onUploadSuccess, label = "Upload Image", className = "" }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      onUploadSuccess(data.url);
    } catch (err: any) {
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg px-4 py-2 text-xs font-semibold transition-all disabled:opacity-50"
      >
        <Upload size={14} className={uploading ? "animate-spin" : ""} />
        {uploading ? "Uploading..." : label}
      </button>
      {error && <span className="text-[10px] text-red-400 font-semibold">{error}</span>}
    </div>
  );
}

const IconLookup: Record<string, React.ComponentType<any>> = {
  Sliders: Sliders,
  Heart: Heart,
  Calendar: Calendar,
  Palette: Palette,
  MapPin: MapPin,
  Shirt: Shirt,
  Clock: Clock,
  Phone: Phone,
  HelpCircle: HelpCircle,
  Plus: Plus,
  Trash2: Trash2,
  ArrowUp: ArrowUp,
  ArrowDown: ArrowDown
};

// --- EDITOR CONTAINER ---
function AdminPortalContent({ clientId }: { clientId: string }) {
  const { invitationData, loading, updateInvitationData, saveConfig } = useInvitationData();
  const [activeTab, setActiveTab] = useState<string>("general");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [triggerConfetti, setTriggerConfetti] = useState(false);

  // Wrapper resolution logic
  const isWrapped = invitationData && "category" in invitationData && "config" in invitationData;
  const selectedCategory = isWrapped ? (invitationData as any).category : "wedding";
  const catDef = getCategory(selectedCategory);
  const metadataGroups = selectedCategory !== "wedding" ? getCategoryGroups(selectedCategory) : [];

  const data = isWrapped ? (invitationData as any).config : invitationData;
  const themeIdVal = invitationData?.themeId || data?.themeId || "royal-temple";
  const manifest = getManifest(themeIdVal);

  const isSectionSupported = (sectionId: string, features: any): boolean => {
    if (!features) return true;
    if (sectionId === "gallery") return !!features.supportsGallery;
    if (sectionId === "countdown") return !!features.supportsCountdown;
    if (sectionId === "story") return !!features.supportsStory;
    if (sectionId === "rsvp") return !!features.supportsRSVP;
    if (sectionId === "events") return !!features.supportsSchedule;
    if (sectionId === "venue") return !!features.supportsMaps;
    if (sectionId === "families") return !!features.supportsFamily;
    if (sectionId === "footer") return !!features.supportsBranding;
    return true;
  };

  const visibleNavigationItems = manifest
    ? manifest.editor.navigation
        .map(nav => ({
          ...nav,
          sections: nav.sections.filter(sId => isSectionSupported(sId, manifest.features))
        }))
        .filter(nav => nav.sections.length > 0)
    : [];

  const tabsList = [
    { id: "general", label: "General & Reorder", icon: "Sliders" },
    ...visibleNavigationItems.filter(nav => nav.id !== "general").map(nav => ({
      id: nav.id,
      label: nav.label,
      icon: nav.icon
    }))
  ];

  const getConfigMetadataValue = (key: string): any => {
    if (!invitationData) return "";
    const targetConfig = isWrapped ? (invitationData as any).config : invitationData;
    if (!targetConfig) return "";
    const parts = key.split(".");
    let current = targetConfig;
    for (const part of parts) {
      if (current && typeof current === "object" && part in current) {
        current = current[part];
      } else {
        return "";
      }
    }
    return current ?? "";
  };

  const updateConfigMetadataValue = (key: string, value: any) => {
    updateInvitationData((prev: any) => {
      const next = { ...prev };
      const targetConfig = isWrapped ? next.config : next;
      if (targetConfig) {
        const parts = key.split(".");
        let current = targetConfig;
        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i];
          if (!(part in current)) {
            current[part] = {};
          }
          current[part] = { ...current[part] };
          current = current[part];
        }
        current[parts[parts.length - 1]] = value;
      }
      return next;
    });
  };

  const getGroupSectionHeader = (group: string, categoryId: string, supportsCouple: boolean): string => {
    const cat = categoryId.toLowerCase();
    if (group === "basics") {
      if (supportsCouple) return "People";
      if (cat === "birthday") return "Celebrant";
      if (cat === "retirement") return "Honoree";
      if (cat === "halfsaree") return "Celebrant";
      if (cat === "babyshower") return "Parents";
      if (cat === "namingceremony") return "Baby";
      if (cat === "corporate") return "Company";
      if (cat === "festival") return "Festival";
      return "Basics";
    }
    if (group === "hosts") return "Hosts";
    if (group === "event_details") {
      if (cat === "housewarming") return "Address";
      if (cat === "corporate" || cat === "festival") return "Venue";
      return "Event Details";
    }
    if (group === "additional") return "Additional";
    return group.charAt(0).toUpperCase() + group.slice(1);
  };

  if (loading || !invitationData) {
    return (
      <div className="min-h-screen bg-[#090614] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-yellow-500/80 text-xs uppercase tracking-[2px] font-bold">Hydrating Admin Center...</p>
        </div>
      </div>
    );
  }

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await saveConfig();
    setSaving(false);
    
    if (result.success) {
      showToast("All wedding configuration details saved successfully!", "success");
      setTriggerConfetti(true);
      setTimeout(() => setTriggerConfetti(false), 5000);
    } else {
      showToast(result.error || "Failed to save details.", "error");
    }
  };

  // Up/Down reordering handlers
  const moveSection = (index: number, direction: "up" | "down") => {
    updateInvitationData((prev: any) => {
      const target = prev.config || prev;
      if (!target || !target.sectionOrder) return prev;

      const order = [...target.sectionOrder];
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex >= 0 && targetIndex < order.length) {
        const temp = order[index];
        order[index] = order[targetIndex];
        order[targetIndex] = temp;
      }

      if (prev.config) {
        return {
          ...prev,
          config: {
            ...prev.config,
            sectionOrder: order
          }
        };
      }
      return { ...prev, sectionOrder: order };
    });
  };

  // Section toggle handler
  const toggleSectionEnabled = (sectionId: string) => {
    updateInvitationData((prev: any) => {
      const target = prev.config || prev;
      if (!target) return prev;

      const section = target[sectionId];
      if (section && typeof section === "object") {
        const updatedSection = {
          ...section,
          enabled: !section.enabled,
        };

        if (prev.config) {
          return {
            ...prev,
            config: {
              ...prev.config,
              [sectionId]: updatedSection
            }
          };
        }
        return {
          ...prev,
          [sectionId]: updatedSection
        };
      }
      return prev;
    });
  };

  const renderDynamicGroupFields = (groupId: string) => {
    if (!selectedCategory) return null;
    const categoryFields = getCategoryFields(selectedCategory).filter(f => f.group === groupId);

    return (
      <div className="space-y-8 animate-fadeIn animate-fadeIn">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-base font-bold mb-4 tracking-[0.5px]">
            {getGroupSectionHeader(groupId, selectedCategory, catDef?.supportsCouple ?? false)}
          </h3>

          <div className="space-y-4">
            {categoryFields.map((field) => {
              const isTextarea = field.type === "textarea";
              const val = getConfigMetadataValue(field.key);

              return (
                <div key={field.key} className="flex flex-col gap-2 w-full animate-fadeIn">
                  <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {isTextarea ? (
                    <textarea
                      value={val}
                      onChange={(e) => updateConfigMetadataValue(field.key, e.target.value)}
                      rows={3}
                      className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none resize-none w-full"
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                      <input
                        type={field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "time" ? "time" : "text"}
                        value={val}
                        onChange={(e) => updateConfigMetadataValue(field.key, e.target.value)}
                        className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none flex-1 w-full"
                        placeholder={field.placeholder}
                        required={field.required}
                      />
                      {field.key.includes("image") && (
                        <FileUploader
                          onUploadSuccess={(url) => updateConfigMetadataValue(field.key, url)}
                          className="w-full sm:w-auto"
                        />
                      )}
                    </div>
                  )}
                  {field.description && (
                    <span className="text-[10px] text-white/40 mt-1">{field.description}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderCoupleSettings = () => (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Configuration */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-base font-bold mb-4 tracking-[0.5px]">Hero Welcome Banner</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1.5px]">Welcome Tagline</label>
            <input
              type="text"
              value={invitationData.hero.welcomeMessage}
              onChange={(e) => updateInvitationData((prev) => ({
                ...prev,
                hero: { ...prev.hero, welcomeMessage: e.target.value }
              }))}
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-yellow-500 outline-none font-bold"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1.5px]">CTA Button Text</label>
            <input
              type="text"
              value={invitationData.hero.ctaText}
              onChange={(e) => updateInvitationData((prev) => ({
                ...prev,
                hero: { ...prev.hero, ctaText: e.target.value }
              }))}
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-yellow-500 outline-none font-bold"
            />
          </div>
          <div className="flex flex-col gap-1.5 col-span-2">
            <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1.5px]">Title Invitation Text</label>
            <input
              type="text"
              value={invitationData.hero.title}
              onChange={(e) => updateInvitationData((prev) => ({
                ...prev,
                hero: { ...prev.hero, title: e.target.value }
              }))}
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-yellow-500 outline-none font-bold"
            />
          </div>
          <div className="flex flex-col gap-1.5 col-span-2">
            <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1.5px]">Subtitle Detail</label>
            <textarea
              value={invitationData.hero.subtitle}
              onChange={(e) => updateInvitationData((prev) => ({
                ...prev,
                hero: { ...prev.hero, subtitle: e.target.value }
              }))}
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-yellow-500 outline-none h-20 resize-none font-medium"
            />
          </div>
          <div className="flex flex-col gap-1.5 col-span-2">
            <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1.5px]">Cover Photo URL / File</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={invitationData.hero.heroImage}
                onChange={(e) => updateInvitationData((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, heroImage: e.target.value }
                }))}
                className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-yellow-500 outline-none flex-1 font-medium"
              />
              <FileUploader
                onUploadSuccess={(url) => updateInvitationData((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, heroImage: url }
                }))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Groom Details */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-base font-bold mb-4 tracking-[0.5px]">The Groom details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1.5px]">Groom's Name</label>
            <input
              type="text"
              value={invitationData.couple.groom.name}
              onChange={(e) => updateInvitationData((prev) => ({
                ...prev,
                couple: {
                  ...prev.couple,
                  groom: { ...prev.couple.groom, name: e.target.value }
                }
              }))}
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-yellow-500 outline-none font-bold"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1.5px]">Groom's Parents</label>
            <input
              type="text"
              value={invitationData.couple.groom.parents}
              onChange={(e) => updateInvitationData((prev) => ({
                ...prev,
                couple: {
                  ...prev.couple,
                  groom: { ...prev.couple.groom, parents: e.target.value }
                }
              }))}
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-yellow-500 outline-none font-bold"
            />
          </div>
          <div className="flex flex-col gap-1.5 col-span-2">
            <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1.5px]">Groom's Portrait Image</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={invitationData.couple.groom.image}
                onChange={(e) => updateInvitationData((prev) => ({
                  ...prev,
                  couple: {
                    ...prev.couple,
                    groom: { ...prev.couple.groom, image: e.target.value }
                  }
                }))}
                className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-yellow-500 outline-none flex-1 font-medium"
              />
              <FileUploader
                onUploadSuccess={(url) => updateInvitationData((prev) => ({
                  ...prev,
                  couple: {
                    ...prev.couple,
                    groom: { ...prev.couple.groom, image: url }
                  }
                }))}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 col-span-2">
            <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1.5px]">Biography / Introduction</label>
            <textarea
              value={invitationData.couple.groom.bio}
              onChange={(e) => updateInvitationData((prev) => ({
                ...prev,
                couple: {
                  ...prev.couple,
                  groom: { ...prev.couple.groom, bio: e.target.value }
                }
              }))}
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-yellow-500 outline-none h-20 resize-none font-medium"
            />
          </div>
        </div>
      </div>

      {/* Bride Details */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-base font-bold mb-4 tracking-[0.5px]">The Bride details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1.5px]">Bride's Name</label>
            <input
              type="text"
              value={invitationData.couple.bride.name}
              onChange={(e) => updateInvitationData((prev) => ({
                ...prev,
                couple: {
                  ...prev.couple,
                  bride: { ...prev.couple.bride, name: e.target.value }
                }
              }))}
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-yellow-500 outline-none font-bold"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1.5px]">Bride's Parents</label>
            <input
              type="text"
              value={invitationData.couple.bride.parents}
              onChange={(e) => updateInvitationData((prev) => ({
                ...prev,
                couple: {
                  ...prev.couple,
                  bride: { ...prev.couple.bride, parents: e.target.value }
                }
              }))}
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-yellow-500 outline-none font-bold"
            />
          </div>
          <div className="flex flex-col gap-1.5 col-span-2">
            <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1.5px]">Bride's Portrait Image</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={invitationData.couple.bride.image}
                onChange={(e) => updateInvitationData((prev) => ({
                  ...prev,
                  couple: {
                    ...prev.couple,
                    bride: { ...prev.couple.bride, image: e.target.value }
                  }
                }))}
                className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-yellow-500 outline-none flex-1 font-medium"
              />
              <FileUploader
                onUploadSuccess={(url) => updateInvitationData((prev) => ({
                  ...prev,
                  couple: {
                    ...prev.couple,
                    bride: { ...prev.couple.bride, image: url }
                  }
                }))}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 col-span-2">
            <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1.5px]">Biography / Introduction</label>
            <textarea
              value={invitationData.couple.bride.bio}
              onChange={(e) => updateInvitationData((prev) => ({
                ...prev,
                couple: {
                  ...prev.couple,
                  bride: { ...prev.couple.bride, bio: e.target.value }
                }
              }))}
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-yellow-500 outline-none h-20 resize-none font-medium"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderEventsSettings = () => (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-base font-bold tracking-[0.5px]">Wedding Ceremonies</h3>
            <p className="text-[10px] text-white/40 font-semibold tracking-[0.5px] uppercase mt-1">Configure scheduled sub-events</p>
          </div>
          <button
            type="button"
            onClick={() => updateInvitationData((prev) => {
              const newEvent: WeddingEvent = {
                id: `event_${Date.now()}`,
                enabled: true,
                title: "New Ceremony",
                date: "29 June 2026",
                time: "07:00 PM",
                venue: "Event Hall, Hyderabad",
                description: "Add a short description about this ceremony.",
                icon: "🎉"
              };
              return { ...prev, events: [...prev.events, newEvent] };
            })}
            className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-4 py-2 rounded-xl text-xs font-bold hover:bg-yellow-500 hover:text-black transition-all"
          >
            <Plus size={14} /> Add Event
          </button>
        </div>

        <div className="space-y-6">
          {invitationData.events.map((event, idx) => (
            <div key={event.id} className="p-6 bg-black/20 border border-white/5 rounded-2xl relative space-y-4">
              <button
                type="button"
                onClick={() => updateInvitationData((prev) => ({
                  ...prev,
                  events: prev.events.filter((e) => e.id !== event.id)
                }))}
                className="absolute top-4 right-4 text-red-400/60 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Delete Event"
              >
                <Trash2 size={15} />
              </button>

              <div className="grid grid-cols-6 gap-4">
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Event Title</label>
                  <input
                    type="text"
                    value={event.title}
                    onChange={(e) => updateInvitationData((prev) => {
                      const list = [...prev.events];
                      list[idx].title = e.target.value;
                      return { ...prev, events: list };
                    })}
                    className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none font-bold"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Emoji Icon</label>
                  <input
                    type="text"
                    value={event.icon}
                    onChange={(e) => updateInvitationData((prev) => {
                      const list = [...prev.events];
                      list[idx].icon = e.target.value;
                      return { ...prev, events: list };
                    })}
                    className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-center text-white focus:border-yellow-500 outline-none font-bold"
                  />
                </div>
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Date</label>
                  <input
                    type="text"
                    value={event.date}
                    onChange={(e) => updateInvitationData((prev) => {
                      const list = [...prev.events];
                      list[idx].date = e.target.value;
                      return { ...prev, events: list };
                    })}
                    className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Time</label>
                  <input
                    type="text"
                    value={event.time}
                    onChange={(e) => updateInvitationData((prev) => {
                      const list = [...prev.events];
                      list[idx].time = e.target.value;
                      return { ...prev, events: list };
                    })}
                    className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Venue Name & Address</label>
                <input
                  type="text"
                  value={event.venue}
                  onChange={(e) => updateInvitationData((prev) => {
                    const list = [...prev.events];
                    list[idx].venue = e.target.value;
                    return { ...prev, events: list };
                  })}
                  className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Description Summary</label>
                <textarea
                  value={event.description}
                  onChange={(e) => updateInvitationData((prev) => {
                    const list = [...prev.events];
                    list[idx].description = e.target.value;
                    return { ...prev, events: list };
                  })}
                  rows={2}
                  className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none resize-none font-medium"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStorySettings = () => (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-base font-bold tracking-[0.5px]">Our Love Story Timeline</h3>
            <p className="text-[10px] text-white/40 font-semibold tracking-[0.5px] uppercase mt-1">Configure chronological milestones</p>
          </div>
          <button
            type="button"
            onClick={() => updateInvitationData((prev) => {
              const newMilestone: StoryTimelineEntry = {
                title: "New Story Node",
                date: "December 2025",
                description: "Tell the guests about this romantic milestone."
              };
              return {
                ...prev,
                story: {
                  ...prev.story,
                  timeline: [...prev.story.timeline, newMilestone]
                }
              };
            })}
            className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-4 py-2 rounded-xl text-xs font-bold hover:bg-yellow-500 hover:text-black transition-all"
          >
            <Plus size={14} /> Add Milestone
          </button>
        </div>

        <div className="space-y-6">
          {invitationData.story.timeline.map((milestone, idx) => (
            <div key={idx} className="p-6 bg-black/20 border border-white/5 rounded-2xl relative space-y-4">
              <button
                type="button"
                onClick={() => updateInvitationData((prev) => ({
                  ...prev,
                  story: {
                    ...prev.story,
                    timeline: prev.story.timeline.filter((_, i) => i !== idx)
                  }
                }))}
                className="absolute top-4 right-4 text-red-400/60 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Delete Milestone"
              >
                <Trash2 size={15} />
              </button>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Milestone Title</label>
                  <input
                    type="text"
                    value={milestone.title}
                    onChange={(e) => updateInvitationData((prev) => {
                      const list = [...prev.story.timeline];
                      list[idx].title = e.target.value;
                      return {
                        ...prev,
                        story: { ...prev.story, timeline: list }
                      };
                    })}
                    className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none font-bold"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Date Tag</label>
                  <input
                    type="text"
                    value={milestone.date}
                    onChange={(e) => updateInvitationData((prev) => {
                      const list = [...prev.story.timeline];
                      list[idx].date = e.target.value;
                      return {
                        ...prev,
                        story: { ...prev.story, timeline: list }
                      };
                    })}
                    className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none font-bold"
                  />
                </div>
                <div className="flex flex-col gap-1.5 col-span-3">
                  <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Description Text</label>
                  <textarea
                    value={milestone.description}
                    onChange={(e) => updateInvitationData((prev) => {
                      const list = [...prev.story.timeline];
                      list[idx].description = e.target.value;
                      return {
                        ...prev,
                        story: { ...prev.story, timeline: list }
                      };
                    })}
                    className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none h-20 resize-none font-medium"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderVenuesSettings = () => (
    <div className="space-y-8 animate-fadeIn">
      {/* Map Settings */}
      {invitationData.venue && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold tracking-[0.5px]">Wedding Venue & Map</h3>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Google Maps Address Search Path</label>
              <input
                type="text"
                value={invitationData.venue.venues?.[0]?.mapsUrl || ""}
                onChange={(e) => updateInvitationData((prev) => {
                  const list = [...(prev.venue.venues || [])];
                  if (list[0]) {
                    list[0] = { ...list[0], mapsUrl: e.target.value };
                  }
                  return { ...prev, venue: { ...prev.venue, venues: list } };
                })}
                className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Google Maps iframe src Embed URL</label>
              <input
                type="text"
                value={invitationData.venue.venues?.[0]?.embedUrl || ""}
                onChange={(e) => updateInvitationData((prev) => {
                  const list = [...(prev.venue.venues || [])];
                  if (list[0]) {
                    list[0] = { ...list[0], embedUrl: e.target.value };
                  }
                  return { ...prev, venue: { ...prev.venue, venues: list } };
                })}
                className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* RSVP contacts list */}
      {invitationData.rsvp && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold tracking-[0.5px]">Confirmation RSVP Contacts</h3>
            <button
              type="button"
              onClick={() => updateInvitationData((prev) => {
                const newContact: RSVPContact = {
                  type: "whatsapp",
                  label: "WhatsApp RSVP",
                  value: "919999999999"
                };
                return {
                  ...prev,
                  rsvp: {
                    ...prev.rsvp,
                    contacts: [...prev.rsvp.contacts, newContact]
                  }
                };
              })}
              className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-4 py-2 rounded-xl text-xs font-bold hover:bg-yellow-500 hover:text-black transition-all"
            >
              <Plus size={14} /> Add Contact
            </button>
          </div>

          <div className="space-y-6">
            {invitationData.rsvp.contacts.map((contact, idx) => (
              <div key={idx} className="p-6 bg-black/20 border border-white/5 rounded-2xl relative space-y-4">
                <button
                  type="button"
                  onClick={() => updateInvitationData((prev) => ({
                    ...prev,
                    rsvp: {
                      ...prev.rsvp,
                      contacts: prev.rsvp.contacts.filter((_, i) => i !== idx)
                    }
                  }))}
                  className="absolute top-4 right-4 text-red-400/60 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">RSVP Type</label>
                    <select
                      value={contact.type}
                      onChange={(e) => updateInvitationData((prev) => {
                        const list = [...prev.rsvp.contacts];
                        list[idx] = { ...list[idx], type: e.target.value as any };
                        return {
                          ...prev,
                          rsvp: { ...prev.rsvp, contacts: list }
                        };
                      })}
                      className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-yellow-500 outline-none font-bold h-9"
                    >
                      <option value="whatsapp">WhatsApp Message</option>
                      <option value="phone">Phone Call</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Label Name</label>
                    <input
                      type="text"
                      value={contact.label}
                      onChange={(e) => updateInvitationData((prev) => {
                        const list = [...prev.rsvp.contacts];
                        list[idx].label = e.target.value;
                        return {
                          ...prev,
                          rsvp: { ...prev.rsvp, contacts: list }
                        };
                      })}
                      className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-yellow-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Phone/Contact Value</label>
                  <input
                    type="text"
                    value={contact.value}
                    onChange={(e) => updateInvitationData((prev) => {
                      const list = [...prev.rsvp.contacts];
                      list[idx].value = e.target.value;
                      return {
                        ...prev,
                        rsvp: { ...prev.rsvp, contacts: list }
                      };
                    })}
                    className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-yellow-500 outline-none font-medium"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderDetailsSettings = () => (
    <div className="space-y-8 animate-fadeIn">
      {/* Dress Code Section */}
      {invitationData.dressCode && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-base font-bold mb-4 tracking-[0.5px]">Dress Code & Color Themes</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Dress Style Code</label>
              <input
                type="text"
                value={invitationData.dressCode.code}
                onChange={(e) => updateInvitationData((prev) => ({
                  ...prev,
                  dressCode: { ...prev.dressCode!, code: e.target.value }
                }))}
                className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Details / Advice Description</label>
              <input
                type="text"
                value={invitationData.dressCode.description}
                onChange={(e) => updateInvitationData((prev) => ({
                  ...prev,
                  dressCode: { ...prev.dressCode!, description: e.target.value }
                }))}
                className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* FAQs Editor */}
      {invitationData.faq && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold tracking-[0.5px]">Guest FAQs</h3>
            <button
              type="button"
              onClick={() => updateInvitationData((prev) => {
                const newFAQ: FAQEntry = {
                  question: "Is transport arranged?",
                  answer: "No, guests should handle local transfers. Cabs are readily available."
                };
                return {
                  ...prev,
                  faq: {
                    ...prev.faq!,
                    entries: [...prev.faq!.entries, newFAQ]
                  }
                };
              })}
              className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-4 py-2 rounded-xl text-xs font-bold hover:bg-yellow-500 hover:text-black transition-all"
            >
              <Plus size={14} /> Add FAQ
            </button>
          </div>

          <div className="space-y-6">
            {invitationData.faq.entries.map((faq, idx) => (
              <div key={idx} className="p-6 bg-black/20 border border-white/5 rounded-2xl relative space-y-4">
                <button
                  type="button"
                  onClick={() => updateInvitationData((prev) => ({
                    ...prev,
                    faq: {
                      ...prev.faq!,
                      entries: prev.faq!.entries.filter((_, i) => i !== idx)
                    }
                  }))}
                  className="absolute top-4 right-4 text-red-400/60 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete FAQ"
                >
                  <Trash2 size={15} />
                </button>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1.5px]">Question</label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => updateInvitationData((prev) => {
                      const list = [...prev.faq!.entries];
                      list[idx].question = e.target.value;
                      return { ...prev, faq: { ...prev.faq!, entries: list } };
                    })}
                    className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-yellow-500 outline-none font-bold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1.5px]">Answer Details</label>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => updateInvitationData((prev) => {
                      const list = [...prev.faq!.entries];
                      list[idx].answer = e.target.value;
                      return { ...prev, faq: { ...prev.faq!, entries: list } };
                    })}
                    className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-yellow-500 outline-none h-16 resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderManifestSection = (sectionId: string) => {
    const section = manifest?.editor.sections.find((s: any) => s.id === sectionId);
    if (!section) return null;

    const isLegacyWedding = selectedCategory === "wedding";

    if (isLegacyWedding) {
      if (sectionId === "couple") return renderCoupleSettings();
      if (sectionId === "events") return renderEventsSettings();
      if (sectionId === "story") return renderStorySettings();
      if (sectionId === "venue") return renderVenuesSettings();
      if (sectionId === "rsvp") return null;
      if (sectionId === "faq") return renderDetailsSettings();
      if (sectionId === "dressCode") return null;
      if (sectionId === "hero") return null;
      if (sectionId === "footer") return null;
    }

    // For birthday and other categories, dynamically build sections from manifest fields!
    return (
      <div key={sectionId} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left animate-fadeIn space-y-6">
        <div>
          <h3 className="text-base font-bold tracking-[0.5px]">{section.title}</h3>
          {section.description && (
            <p className="text-[10px] text-white/40 font-semibold tracking-[0.5px] uppercase mt-1">{section.description}</p>
          )}
        </div>

        <div className="space-y-4">
          {section.editableFields.map((fieldKey: string) => {
            // Check for complex custom sub-editors:
            if (fieldKey === "events") {
              const events = getConfigMetadataValue("events") || [];
              return (
                <div key={fieldKey} className="space-y-4">
                  <div className="flex justify-between items-center pb-2 w-full">
                    <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1.5px]">Party Events</label>
                    <button
                      type="button"
                      onClick={() => {
                        const newEvent = {
                          id: `event-${Date.now()}`,
                          enabled: true,
                          title: "New Event",
                          date: "2026-12-14",
                          time: "07:00 PM",
                          venue: "Grand Hall, City",
                          description: "Party description.",
                          icon: "🎉"
                        };
                        updateConfigMetadataValue("events", [...events, newEvent]);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 border border-white/10 hover:bg-white/5 rounded-xl text-[8px] font-bold uppercase tracking-[1px] bg-transparent transition-all"
                    >
                      <Plus size={10} /> Add Event
                    </button>
                  </div>
                  {events.map((evt: any, index: number) => (
                    <div key={evt.id || index} className="p-4 bg-black/30 border border-white/10 rounded-xl space-y-3 relative group w-full">
                      <button
                        type="button"
                        onClick={() => {
                          const list = [...events];
                          list.splice(index, 1);
                          updateConfigMetadataValue("events", list);
                        }}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={12} />
                      </button>
                      <div className="flex flex-col gap-1 w-full">
                        <label className="text-[9px] uppercase font-bold text-white/40">Event Title</label>
                        <input
                          type="text"
                          value={evt.title || ""}
                          onChange={(e) => {
                            const list = [...events];
                            list[index] = { ...list[index], title: e.target.value };
                            updateConfigMetadataValue("events", list);
                          }}
                          className="bg-black/30 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-yellow-500 outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2 w-full">
                        <div className="flex flex-col gap-1 w-full">
                          <label className="text-[9px] uppercase font-bold text-white/40">Date</label>
                          <input
                            type="text"
                            value={evt.date || ""}
                            onChange={(e) => {
                              const list = [...events];
                              list[index] = { ...list[index], date: e.target.value };
                              updateConfigMetadataValue("events", list);
                            }}
                            className="bg-black/30 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-yellow-500 outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                          <label className="text-[9px] uppercase font-bold text-white/40">Time</label>
                          <input
                            type="text"
                            value={evt.time || ""}
                            onChange={(e) => {
                              const list = [...events];
                              list[index] = { ...list[index], time: e.target.value };
                              updateConfigMetadataValue("events", list);
                            }}
                            className="bg-black/30 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-yellow-500 outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                          <label className="text-[9px] uppercase font-bold text-white/40">Icon Emoji</label>
                          <input
                            type="text"
                            value={evt.icon || "🎉"}
                            onChange={(e) => {
                              const list = [...events];
                              list[index] = { ...list[index], icon: e.target.value };
                              updateConfigMetadataValue("events", list);
                            }}
                            className="bg-black/30 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-yellow-500 outline-none text-center"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 w-full">
                        <label className="text-[9px] uppercase font-bold text-white/40">Venue Address</label>
                        <input
                          type="text"
                          value={evt.venue || ""}
                          onChange={(e) => {
                            const list = [...events];
                            list[index] = { ...list[index], venue: e.target.value };
                            updateConfigMetadataValue("events", list);
                          }}
                          className="bg-black/30 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-yellow-500 outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              );
            }

            if (fieldKey === "gallery.images") {
              const galleryImages = getConfigMetadataValue("gallery.images") || [];
              return (
                <div key={fieldKey} className="space-y-2.5 animate-fadeIn">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1.5px]">Gallery Photo List</label>
                    <FileUploader
                      onUploadSuccess={(url) => {
                        updateConfigMetadataValue("gallery.images", [...galleryImages, url]);
                      }}
                      label="Add Photo"
                    />
                  </div>
                  {galleryImages.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2 border border-white/10 rounded-xl p-3 bg-black/20">
                      {galleryImages.map((img: string, idx: number) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group">
                          <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const nextList = galleryImages.filter((_: any, i: number) => i !== idx);
                              updateConfigMetadataValue("gallery.images", nextList);
                            }}
                            className="absolute top-1 right-1 p-1 bg-red-600/90 text-white rounded hover:bg-red-700 transition-colors"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-white/40 uppercase tracking-[0.5px] font-semibold italic text-center py-4 bg-black/20 border border-white/10 rounded-xl">No gallery images uploaded.</p>
                  )}
                </div>
              );
            }

            if (fieldKey === "rsvp.contacts") {
              const contacts = getConfigMetadataValue("rsvp.contacts") || [];
              return (
                <div key={fieldKey} className="space-y-4 animate-fadeIn">
                  <div className="flex justify-between items-center pb-2 w-full">
                    <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1.5px]">RSVP Contact Options</label>
                    <button
                      type="button"
                      onClick={() => {
                        const newContact = {
                          type: "whatsapp",
                          label: "WhatsApp RSVP",
                          value: "919999999999"
                        };
                        updateConfigMetadataValue("rsvp.contacts", [...contacts, newContact]);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 border border-white/10 hover:bg-white/5 rounded-xl text-[8px] font-bold uppercase tracking-[1px] bg-transparent transition-all"
                    >
                      <Plus size={10} /> Add RSVP
                    </button>
                  </div>
                  {contacts.map((contact: any, index: number) => (
                    <div key={index} className="p-4 bg-black/30 border border-white/10 rounded-xl space-y-3 relative group w-full">
                      <button
                        type="button"
                        onClick={() => {
                          const list = [...contacts];
                          list.splice(index, 1);
                          updateConfigMetadataValue("rsvp.contacts", list);
                        }}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={12} />
                      </button>
                      <div className="grid grid-cols-2 gap-2 w-full">
                        <div className="flex flex-col gap-1 w-full">
                          <label className="text-[9px] uppercase font-bold text-white/40">Type</label>
                          <select
                            value={contact.type}
                            onChange={(e) => {
                              const list = [...contacts];
                              list[index] = { ...list[index], type: e.target.value };
                              updateConfigMetadataValue("rsvp.contacts", list);
                            }}
                            className="bg-black/30 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-yellow-500 outline-none font-bold"
                          >
                            <option value="whatsapp">WhatsApp</option>
                            <option value="phone">Phone Call</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                          <label className="text-[9px] uppercase font-bold text-white/40">Display Label</label>
                          <input
                            type="text"
                            value={contact.label}
                            onChange={(e) => {
                              const list = [...contacts];
                              list[index] = { ...list[index], label: e.target.value };
                              updateConfigMetadataValue("rsvp.contacts", list);
                            }}
                            className="bg-black/30 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-yellow-500 outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 w-full">
                        <label className="text-[9px] uppercase font-bold text-white/40">Number / Link Value</label>
                        <input
                          type="text"
                          value={contact.value}
                          onChange={(e) => {
                            const list = [...contacts];
                            list[index] = { ...list[index], value: e.target.value };
                            updateConfigMetadataValue("rsvp.contacts", list);
                          }}
                          className="bg-black/30 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-yellow-500 outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              );
            }

            if (fieldKey === "faq.entries") {
              const faqs = getConfigMetadataValue("faq.entries") || [];
              return (
                <div key={fieldKey} className="space-y-4 animate-fadeIn">
                  <div className="flex justify-between items-center pb-2 w-full">
                    <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1.5px]">Party Q&As / Guidelines</label>
                    <button
                      type="button"
                      onClick={() => {
                        const newFaq = {
                          question: "New Question?",
                          answer: "Add description details here."
                        };
                        updateConfigMetadataValue("faq.entries", [...faqs, newFaq]);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 border border-white/10 hover:bg-white/5 rounded-xl text-[8px] font-bold uppercase tracking-[1px] bg-transparent transition-all"
                    >
                      <Plus size={10} /> Add FAQ
                    </button>
                  </div>
                  {faqs.map((faq: any, index: number) => (
                    <div key={index} className="p-4 bg-black/30 border border-white/10 rounded-xl space-y-3 relative group w-full">
                      <button
                        type="button"
                        onClick={() => {
                          const list = [...faqs];
                          list.splice(index, 1);
                          updateConfigMetadataValue("faq.entries", list);
                        }}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={12} />
                      </button>
                      <div className="flex flex-col gap-1 w-full">
                        <label className="text-[9px] uppercase font-bold text-white/40">Question</label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => {
                            const list = [...faqs];
                            list[index] = { ...list[index], question: e.target.value };
                            updateConfigMetadataValue("faq.entries", list);
                          }}
                          className="bg-black/30 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-yellow-500 outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1 w-full">
                        <label className="text-[9px] uppercase font-bold text-white/40">Answer Details</label>
                        <textarea
                          value={faq.answer}
                          onChange={(e) => {
                            const list = [...faqs];
                            list[index] = { ...list[index], answer: e.target.value };
                            updateConfigMetadataValue("faq.entries", list);
                          }}
                          rows={2}
                          className="bg-black/30 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-yellow-500 outline-none resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              );
            }

            // Normal text, number, date, time, textarea inputs:
            const catField = getCategoryFields(selectedCategory).find(f => f.key === fieldKey);
            const label = catField?.label || fieldKey.split('.').pop()?.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) || fieldKey;
            const placeholder = catField?.placeholder || `Enter ${label.toLowerCase()}`;
            const required = catField?.required ?? false;

            let inputType = "text";
            if (catField?.type) {
              inputType = catField.type;
            } else if (fieldKey.toLowerCase().includes("image")) {
              inputType = "image";
            } else if (fieldKey.toLowerCase().includes("date")) {
              inputType = "date";
            } else if (fieldKey.toLowerCase().includes("time")) {
              inputType = "time";
            } else if (fieldKey.toLowerCase().includes("age") || fieldKey.toLowerCase().includes("number")) {
              inputType = "number";
            } else if (fieldKey.toLowerCase().includes("bio") || fieldKey.toLowerCase().includes("subtitle") || fieldKey.toLowerCase().includes("message") || fieldKey.toLowerCase().includes("description")) {
              inputType = "textarea";
            }

            const val = getConfigMetadataValue(fieldKey);
            const isTextarea = inputType === "textarea";

            return (
              <div key={fieldKey} className="flex flex-col gap-2 w-full animate-fadeIn">
                <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1.5px]">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                {isTextarea ? (
                  <textarea
                    value={val}
                    onChange={(e) => updateConfigMetadataValue(fieldKey, e.target.value)}
                    rows={3}
                    className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none resize-none w-full"
                    placeholder={placeholder}
                    required={required}
                  />
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <input
                      type={inputType === "number" ? "number" : inputType === "date" ? "date" : inputType === "time" ? "time" : "text"}
                      value={val}
                      onChange={(e) => updateConfigMetadataValue(fieldKey, e.target.value)}
                      className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none flex-1 w-full"
                      placeholder={placeholder}
                      required={required}
                    />
                    {inputType === "image" && (
                      <FileUploader
                        onUploadSuccess={(url) => updateConfigMetadataValue(fieldKey, url)}
                        className="w-full sm:w-auto"
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#07050E] text-white flex flex-col font-sans relative overflow-hidden">
      <ConfettiCanvas active={triggerConfetti} />

      {/* --- HEADER --- */}
      <header className="bg-white/5 border-b border-white/10 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <Palette className="text-yellow-500" size={24} />
          <div>
            <h1 className="text-lg font-bold tracking-[1px]">InviteCraft Admin Control Center</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-[1.5px] font-semibold">Editing profile: /{clientId}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            className="flex items-center gap-1.5 px-4 py-2 border border-white/10 rounded-xl text-xs font-semibold hover:bg-white/5 transition-all text-white/80"
          >
            <ArrowLeft size={14} /> Agency Hub
          </a>
          <a
            href={`/invites/${clientId}`}
            target="_blank"
            className="flex items-center gap-1.5 px-4 py-2 border border-yellow-500/20 bg-yellow-500/5 hover:bg-yellow-500/10 text-yellow-500 rounded-xl text-xs font-semibold transition-all"
          >
            View Live
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-black px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(212,175,55,0.25)] hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Save size={14} />
            {saving ? "Saving..." : "Save Configuration"}
          </button>
        </div>
      </header>

      {/* --- TOAST NOTIFICATIONS --- */}
      <div className="fixed bottom-6 left-6 z-50">
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl backdrop-blur-md border ${
                toast.type === "success" 
                  ? "bg-green-500/10 border-green-500/30 text-green-400" 
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}
            >
              {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span className="text-xs font-semibold tracking-[0.5px]">{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* --- SIDE NAVIGATION --- */}
        <aside className="w-full md:w-64 bg-white/[0.02] border-r border-white/5 p-4 flex flex-col gap-2">
          {tabsList.map((tab) => {
            const Icon = IconLookup[tab.icon] || HelpCircle;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === tab.id 
                    ? "bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 shadow-md" 
                    : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </aside>

        {/* --- EDIT FORMS CONTAINER --- */}
        <main className="flex-1 p-8 max-w-4xl overflow-y-auto">
          {/* TAB 1: GENERAL & REORDER */}
          {activeTab === "general" && (() => {
            const data = isWrapped ? (invitationData as any).config : invitationData;
            if (!data) return null;

            const themeIdVal = invitationData.themeId || data.themeId || "royal-temple";
            const musicFile = data.music?.file || "";
            const musicEnabled = data.music?.enabled ?? false;
            const sectionOrder = data.sectionOrder || [];

            return (
              <div className="space-y-8 animate-fadeIn">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-base font-bold mb-4 tracking-[0.5px]">Configure Global Settings</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Theme Layout Selector */}
                    <div className="flex flex-col gap-2 col-span-2">
                      <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1.5px]">Active Visual Theme Layout</label>
                      <select
                        value={themeIdVal}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateInvitationData((prev: any) => {
                            const next = { ...prev, themeId: val };
                            if (next.config) {
                              next.config.themeId = val;
                            }
                            return next;
                          });
                        }}
                        className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none font-bold"
                      >
                        {getTemplatesByCategory(selectedCategory).map((t) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Background Music File Path</label>
                      <input
                        type="text"
                        value={musicFile}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateInvitationData((prev: any) => {
                            const next = { ...prev };
                            const target = next.config || next;
                            if (target.music) {
                              target.music = { ...target.music, file: val };
                            }
                            return next;
                          });
                        }}
                        className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-3 mt-6">
                      <input
                        type="checkbox"
                        id="music-enabled"
                        checked={musicEnabled}
                        onChange={(e) => {
                          const val = e.target.checked;
                          updateInvitationData((prev: any) => {
                            const next = { ...prev };
                            const target = next.config || next;
                            if (target.music) {
                              target.music = { ...target.music, enabled: val };
                            }
                            return next;
                          });
                        }}
                        className="w-4 h-4 rounded text-yellow-500 accent-yellow-500"
                      />
                      <label htmlFor="music-enabled" className="text-xs font-semibold text-white/80 cursor-pointer">Enable Background Music</label>
                    </div>
                  </div>
                </div>

                {/* Section Visibility & Ordering */}
                {sectionOrder.length > 0 && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="mb-4">
                      <h3 className="text-base font-bold tracking-[0.5px]">Reorder & Toggle Page Sections</h3>
                      <p className="text-[10px] text-white/40 font-semibold tracking-[0.5px] uppercase mt-1">Re-arrange layout flow using up/down arrow buttons</p>
                    </div>

                    <div className="space-y-3">
                      {sectionOrder.map((sectionId: string, idx: number) => {
                        const section = data[sectionId];
                        const isEnabled = section?.enabled ?? true;
                        
                        return (
                          <div
                            key={sectionId}
                            className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-xl hover:border-white/10 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={isEnabled}
                                disabled={sectionId === "hero" || sectionId === "footer" || sectionId === "couple" || sectionId === "celebrant" || sectionId === "hosts"} // Core fields cannot be disabled
                                onChange={() => toggleSectionEnabled(sectionId)}
                                className="w-4 h-4 rounded text-yellow-500 accent-yellow-500"
                              />
                              <span className={`text-xs font-bold tracking-[0.5px] uppercase ${isEnabled ? "text-white" : "text-white/30 line-through"}`}>
                                {sectionLabels[sectionId] || sectionId}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => moveSection(idx, "up")}
                                className="p-1.5 hover:bg-white/5 text-white/60 hover:text-white rounded-lg disabled:opacity-20"
                              >
                                <ArrowUp size={14} />
                              </button>
                              <button
                                type="button"
                                disabled={idx === sectionOrder.length - 1}
                                onClick={() => moveSection(idx, "down")}
                                className="p-1.5 hover:bg-white/5 text-white/60 hover:text-white rounded-lg disabled:opacity-20"
                              >
                                <ArrowDown size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {activeTab !== "general" && (() => {
            const currentNav = visibleNavigationItems.find(n => n.id === activeTab);
            if (!currentNav) return null;
            return (
              <div className="space-y-8 animate-fadeIn">
                {currentNav.sections.map(sectionId => {
                  if (!isSectionSupported(sectionId, manifest?.features)) return null;
                  return renderManifestSection(sectionId);
                })}
              </div>
            );
          })()}
        </main>
      </div>
    </div>
  );
}

const sectionLabels: Record<string, string> = {
  hero: "Hero Banner",
  couple: "Basics Details",
  countdown: "Event Countdown Timer",
  story: "Story Timeline",
  events: "Event Schedule",
  gallery: "Photo Gallery moments",
  venue: "Location Venues Map",
  families: "Warm Greetings parents",
  rsvp: "Confirmation RSVP Info",
  faq: "Frequently Asked Questions",
  dressCode: "Dress Code & Theme Colors",
  footer: "Page Credits footer",
  celebrant: "Celebrant Details",
  hosts: "Hosts Details"
};

// --- PAGE WRAPPER ROUTE COMPONENT ---
export default function AdminPageWrapper({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <InvitationDataProvider clientId={id}>
      <AdminPortalContent clientId={id} />
    </InvitationDataProvider>
  );
}
