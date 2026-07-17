"use client";

import React, { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import { InvitationDataProvider, useInvitationData } from "../../../components/context/InvitationDataContext";
import { WeddingInvitationConfig, WeddingEvent, StoryTimelineEntry, FAQEntry, RSVPContact } from "../../../components/types/invitation";
import { motion, AnimatePresence } from "framer-motion";
import { getCategory, getCategoryFields, getCategoryGroups } from "@/lib/categories/utils";
import { getTemplatesByCategory } from "@/lib/templates";
import { getManifest } from "@/lib/template-manifests";
import { 
  Palette, Sliders, Heart, Calendar, Clock, MapPin, 
  Phone, HelpCircle, Shirt, Save, ArrowLeft, Plus, 
  Trash2, ArrowUp, ArrowDown, Upload, CheckCircle2, AlertCircle, Eye, Smartphone, Monitor, Tablet,
  ChevronDown
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

    const colors = ["#C49B27", "#8C6A1A", "#E5A93C", "#C88E9B", "#F7E4C2"];
    const particles = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      r: Math.random() * 4 + 2,
      d: Math.random() * height,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 8 - 4,
      tiltAngleIncremental: Math.random() * 0.05 + 0.02,
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
        p.y += (Math.cos(p.d) + 2 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - idx / 3) * 10;

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
      if (frameCount < 200) {
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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onUploadSuccess(data.url);
    } catch (err: any) {
      setError(err.message || "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`flex flex-col gap-1 w-full sm:w-auto ${className}`}>
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
        className="flex items-center justify-center gap-1.5 bg-[#FAF9F6] border border-zinc-200 hover:border-zinc-300 text-[#241E1C]/80 rounded-xl px-4 py-2.5 text-xs font-bold transition-all disabled:opacity-50 w-full sm:w-auto"
      >
        <Upload size={13} className={uploading ? "animate-spin" : ""} />
        {uploading ? "Uploading..." : label}
      </button>
      {error && <span className="text-[9px] text-red-500 font-semibold text-center sm:text-left">{error}</span>}
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

// --- MAIN PORTAL INTERFACE ---
function AdminPortalContent({ clientId }: { clientId: string }) {
  const { invitationData, loading, error, updateInvitationData, saveConfig } = useInvitationData();
  
  // Responsive layout tab & accordion control states
  const [activeTab, setActiveTab] = useState<string>("general");
  const [expandedSection, setExpandedSection] = useState<string | null>("general");
  const [showProperties, setShowProperties] = useState(true);
  
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
    { id: "general", label: "General Config", icon: "Sliders" },
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

  // Device layout controls
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "tablet" | "desktop">("mobile");
  const [zoomScale, setZoomScale] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Floating button reveal on mobile scrolling
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToPreview = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Push updates to preview frame in real-time
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow && invitationData) {
      iframeRef.current.contentWindow.postMessage({
        type: "UPDATE_CONFIG",
        config: invitationData
      }, "*");
    }
  }, [invitationData]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-[#241E1C] flex flex-col items-center justify-center p-6 text-center relative select-none font-sans overflow-hidden">
        {/* Background radial glowing orbs */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-yellow-600/[0.01] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-amber-500/[0.01] blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md bg-white border border-amber-500/10 p-8 rounded-3xl shadow-sm relative z-10 flex flex-col items-center space-y-6">
          <div className="w-12 h-12 bg-red-500/5 border border-red-500/10 text-red-600/80 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-[2px] text-[#241E1C]">Access Restricted</h2>
            <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto">
              You do not have permission to manage this invitation, or the requested URL does not exist.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="w-full bg-[#C49B27] hover:bg-[#B0871B] text-white font-bold py-3.5 rounded-xl text-xs transition-all tracking-[1.5px] block text-center shadow-sm"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (loading || !invitationData) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-[#C49B27] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-[#C49B27]/80 text-[10px] uppercase tracking-[2px] font-bold">Loading Customizer...</p>
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
      showToast("Invitation details saved successfully!", "success");
      setTriggerConfetti(true);
      setTimeout(() => setTriggerConfetti(false), 5000);
      
      // Refresh preview frame to read fresh data
      if (iframeRef.current) {
        iframeRef.current.src = iframeRef.current.src;
      }
    } else {
      showToast(result.error || "Failed to save configuration.", "error");
    }
  };

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

  const sectionLabels: Record<string, string> = {
    hero: "Hero Panel",
    couple: "Basics Details",
    story: "Story Gallery",
    events: "Ceremony Timelines",
    venues: "Venues & Maps Settings",
    rsvp: "RSVP Registry",
    faqs: "FAQs accordion",
    dressCode: "Dress Code Details",
    footer: "Footer Copyrights",
    celebrant: "Celebrant Details",
    hosts: "Hosts Details",
    venue: "Event Venues"
  };

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
      <div key={sectionId} className="card-minimal p-4 md:p-5 space-y-4 text-left animate-fadeIn">
        <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/50 border-b border-zinc-100 pb-2">
          {section.title}
        </h3>
        {section.description && (
          <p className="text-[9px] text-[#241E1C]/40 font-semibold tracking-[0.5px] uppercase mt-0.5">{section.description}</p>
        )}

        <div className="space-y-4">
          {section.editableFields.map((fieldKey: string) => {
            // Check for complex custom sub-editors:
            if (fieldKey === "events") {
              const events = getConfigMetadataValue("events") || [];
              return (
                <div key={fieldKey} className="space-y-4">
                  <div className="flex justify-between items-center pb-2 w-full">
                    <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Party Events</label>
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
                      className="flex items-center gap-1 px-2.5 py-1 border border-zinc-200 hover:border-[#C49B27]/40 rounded-xl text-[8px] font-bold uppercase tracking-[1px] bg-white transition-colors"
                    >
                      <Plus size={10} /> Add Event
                    </button>
                  </div>
                  {events.map((evt: any, index: number) => (
                    <div key={evt.id || index} className="p-4 bg-[#FAF9F6] border border-zinc-200/60 rounded-xl space-y-3 relative group w-full">
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
                        <label className="text-[9px] uppercase font-bold text-[#241E1C]/40">Event Title</label>
                        <input
                          type="text"
                          value={evt.title || ""}
                          onChange={(e) => {
                            const list = [...events];
                            list[index] = { ...list[index], title: e.target.value };
                            updateConfigMetadataValue("events", list);
                          }}
                          className="bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-[#241E1C] outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2 w-full">
                        <div className="flex flex-col gap-1 w-full">
                          <label className="text-[9px] uppercase font-bold text-[#241E1C]/40">Date</label>
                          <input
                            type="text"
                            value={evt.date || ""}
                            onChange={(e) => {
                              const list = [...events];
                              list[index] = { ...list[index], date: e.target.value };
                              updateConfigMetadataValue("events", list);
                            }}
                            className="bg-white border border-zinc-200 rounded-lg px-2 py-1.5 text-xs text-[#241E1C] outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                          <label className="text-[9px] uppercase font-bold text-[#241E1C]/40">Time</label>
                          <input
                            type="text"
                            value={evt.time || ""}
                            onChange={(e) => {
                              const list = [...events];
                              list[index] = { ...list[index], time: e.target.value };
                              updateConfigMetadataValue("events", list);
                            }}
                            className="bg-white border border-zinc-200 rounded-lg px-2 py-1.5 text-xs text-[#241E1C] outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                          <label className="text-[9px] uppercase font-bold text-[#241E1C]/40">Icon Emoji</label>
                          <input
                            type="text"
                            value={evt.icon || "🎉"}
                            onChange={(e) => {
                              const list = [...events];
                              list[index] = { ...list[index], icon: e.target.value };
                              updateConfigMetadataValue("events", list);
                            }}
                            className="bg-white border border-zinc-200 rounded-lg px-2 py-1.5 text-xs text-[#241E1C] outline-none text-center"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 w-full">
                        <label className="text-[9px] uppercase font-bold text-[#241E1C]/40">Venue Address</label>
                        <input
                          type="text"
                          value={evt.venue || ""}
                          onChange={(e) => {
                            const list = [...events];
                            list[index] = { ...list[index], venue: e.target.value };
                            updateConfigMetadataValue("events", list);
                          }}
                          className="bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-[#241E1C] outline-none"
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
                    <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Gallery Photo List</label>
                    <FileUploader
                      onUploadSuccess={(url) => {
                        updateConfigMetadataValue("gallery.images", [...galleryImages, url]);
                      }}
                      label="Add Photo"
                    />
                  </div>
                  {galleryImages.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2 border border-zinc-100 rounded-xl p-3 bg-[#FAF9F6]">
                      {galleryImages.map((img: string, idx: number) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-200/50 group">
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
                    <p className="text-[9px] text-[#241E1C]/40 uppercase tracking-[0.5px] font-semibold italic text-center py-4 bg-[#FAF9F6] border border-zinc-200/50 rounded-xl">No gallery images uploaded.</p>
                  )}
                </div>
              );
            }

            if (fieldKey === "rsvp.contacts") {
              const contacts = getConfigMetadataValue("rsvp.contacts") || [];
              return (
                <div key={fieldKey} className="space-y-4 animate-fadeIn">
                  <div className="flex justify-between items-center pb-2 w-full">
                    <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1.5px]">RSVP Contact Options</label>
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
                      className="flex items-center gap-1 px-2.5 py-1 border border-zinc-200 hover:border-[#C49B27]/40 rounded-xl text-[8px] font-bold uppercase tracking-[1px] bg-white transition-colors"
                    >
                      <Plus size={10} /> Add RSVP
                    </button>
                  </div>
                  {contacts.map((contact: any, index: number) => (
                    <div key={index} className="p-4 bg-[#FAF9F6] border border-zinc-200/60 rounded-xl space-y-3 relative group w-full">
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
                          <label className="text-[9px] uppercase font-bold text-[#241E1C]/40">Type</label>
                          <select
                            value={contact.type}
                            onChange={(e) => {
                              const list = [...contacts];
                              list[index] = { ...list[index], type: e.target.value };
                              updateConfigMetadataValue("rsvp.contacts", list);
                            }}
                            className="bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-[#241E1C] outline-none font-bold"
                          >
                            <option value="whatsapp">WhatsApp</option>
                            <option value="phone">Phone Call</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                          <label className="text-[9px] uppercase font-bold text-[#241E1C]/40">Display Label</label>
                          <input
                            type="text"
                            value={contact.label}
                            onChange={(e) => {
                              const list = [...contacts];
                              list[index] = { ...list[index], label: e.target.value };
                              updateConfigMetadataValue("rsvp.contacts", list);
                            }}
                            className="bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-[#241E1C] outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 w-full">
                        <label className="text-[9px] uppercase font-bold text-[#241E1C]/40">Number / Link Value</label>
                        <input
                          type="text"
                          value={contact.value}
                          onChange={(e) => {
                            const list = [...contacts];
                            list[index] = { ...list[index], value: e.target.value };
                            updateConfigMetadataValue("rsvp.contacts", list);
                          }}
                          className="bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-[#241E1C] outline-none font-medium"
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
                    <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Party Q&As / Guidelines</label>
                    <button
                      type="button"
                      onClick={() => {
                        const newFaq = {
                          question: "New Question?",
                          answer: "Add description details here."
                        };
                        updateConfigMetadataValue("faq.entries", [...faqs, newFaq]);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 border border-zinc-200 hover:border-[#C49B27]/40 rounded-xl text-[8px] font-bold uppercase tracking-[1px] bg-white transition-colors"
                    >
                      <Plus size={10} /> Add FAQ
                    </button>
                  </div>
                  {faqs.map((faq: any, index: number) => (
                    <div key={index} className="p-4 bg-[#FAF9F6] border border-zinc-200/60 rounded-xl space-y-3 relative group w-full">
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
                        <label className="text-[9px] uppercase font-bold text-[#241E1C]/40">Question</label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => {
                            const list = [...faqs];
                            list[index] = { ...list[index], question: e.target.value };
                            updateConfigMetadataValue("faq.entries", list);
                          }}
                          className="bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-[#241E1C] outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1 w-full">
                        <label className="text-[9px] uppercase font-bold text-[#241E1C]/40">Answer Details</label>
                        <textarea
                          value={faq.answer}
                          onChange={(e) => {
                            const list = [...faqs];
                            list[index] = { ...list[index], answer: e.target.value };
                            updateConfigMetadataValue("faq.entries", list);
                          }}
                          rows={2}
                          className="bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-[#241E1C] outline-none resize-none"
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
              <div key={fieldKey} className="flex flex-col gap-1.5 w-full animate-fadeIn">
                <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1.5px]">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                {isTextarea ? (
                  <textarea
                    value={val}
                    onChange={(e) => updateConfigMetadataValue(fieldKey, e.target.value)}
                    rows={3}
                    className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2.5 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] resize-none w-full"
                    placeholder={placeholder}
                    required={required}
                  />
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <input
                      type={inputType === "number" ? "number" : inputType === "date" ? "date" : inputType === "time" ? "time" : "text"}
                      value={val}
                      onChange={(e) => updateConfigMetadataValue(fieldKey, e.target.value)}
                      className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2.5 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] flex-1 w-full"
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

  // --- SUB SETTINGS TAB RENDER LOGIC ---
  const renderGeneralSettings = () => {
    const data = isWrapped ? (invitationData as any).config : invitationData;
    if (!data) return null;

    const themeIdVal = invitationData.themeId || data.themeId || "royal-temple";
    const musicFile = data.music?.file || "";
    const musicEnabled = data.music?.enabled ?? false;
    const sectionOrder = data.sectionOrder || [];

    return (
      <div className="space-y-6 text-left animate-fadeIn">
        <div className="card-minimal p-4 md:p-5 space-y-4 md:space-y-5">
          <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/50 border-b border-zinc-100 pb-2">Layout & Audio</h3>
          
          {/* Select Theme */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1.5px]">Select Layout Theme</label>
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
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-[#241E1C] outline-none font-bold focus:border-[#C49B27] w-full"
            >
              {getTemplatesByCategory(selectedCategory).map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Audio path */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Audio File Path</label>
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
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
            />
          </div>

          {/* Audio enabled toggle */}
          <div className="flex items-center justify-between bg-[#FAF9F6] p-3 border border-zinc-200/50 rounded-xl w-full">
            <label htmlFor="music-enabled" className="text-xs font-semibold text-[#241E1C]/80 cursor-pointer">Enable Background Music</label>
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
              className="w-4 h-4 rounded text-[#C49B27] accent-[#C49B27] cursor-pointer"
            />
          </div>
        </div>

        {/* Reorder sections widget */}
        {sectionOrder.length > 0 && (
          <div className="card-minimal p-4 md:p-5 space-y-4">
            <div className="border-b border-zinc-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/50">Reorder Sections</h3>
              <p className="text-[9px] text-[#241E1C]/40 font-semibold tracking-[0.5px] uppercase mt-0.5">Toggle visibility and reorder items</p>
            </div>

            <div className="space-y-2 w-full">
              {sectionOrder.map((sectionId: string, idx: number) => {
                const section = data[sectionId];
                const isEnabled = section?.enabled ?? true;
                return (
                  <div key={sectionId} className="flex items-center justify-between p-3 bg-[#FAF9F6] border border-zinc-200/60 rounded-xl w-full">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        disabled={sectionId === "hero" || sectionId === "footer" || sectionId === "couple" || sectionId === "celebrant" || sectionId === "hosts"}
                        onChange={() => toggleSectionEnabled(sectionId)}
                        className="w-4 h-4 rounded text-[#C49B27] accent-[#C49B27] cursor-pointer"
                      />
                      <span className={`text-[10px] font-bold uppercase tracking-[0.5px] ${isEnabled ? "text-[#241E1C]" : "text-[#241E1C]/35 line-through"}`}>
                        {sectionLabels[sectionId] || sectionId}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveSection(idx, "up")}
                        className="p-1 hover:bg-zinc-200 rounded disabled:opacity-20 text-[#241E1C]/60"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === sectionOrder.length - 1}
                        onClick={() => moveSection(idx, "down")}
                        className="p-1 hover:bg-zinc-200 rounded disabled:opacity-20 text-[#241E1C]/60"
                      >
                        <ArrowDown size={12} />
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
  };

  const renderDynamicGroupFields = (groupId: string) => {
    if (!selectedCategory) return null;
    const categoryFields = getCategoryFields(selectedCategory).filter(f => f.group === groupId);

    return (
      <div className="space-y-4 text-left animate-fadeIn">
        <div className="card-minimal p-4 md:p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/50 border-b border-zinc-100 pb-2">
            {getGroupSectionHeader(groupId, selectedCategory, catDef?.supportsCouple ?? false)}
          </h3>

          {categoryFields.map((field) => {
            const isTextarea = field.type === "textarea";
            const val = getConfigMetadataValue(field.key);

            return (
              <div key={field.key} className="flex flex-col gap-1 w-full animate-fadeIn">
                <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1.5px]">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {isTextarea ? (
                  <textarea
                    value={val}
                    onChange={(e) => updateConfigMetadataValue(field.key, e.target.value)}
                    rows={3}
                    className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2.5 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] resize-none w-full"
                    placeholder={field.placeholder}
                    required={field.required}
                  />
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <input
                      type={field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "time" ? "time" : "text"}
                      value={val}
                      onChange={(e) => updateConfigMetadataValue(field.key, e.target.value)}
                      className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2.5 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] flex-1 w-full"
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
                  <span className="text-[9px] text-[#241E1C]/40 font-semibold mt-0.5">{field.description}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCoupleSettings = () => (
    <div className="space-y-6 text-left animate-fadeIn">
      {/* Hero Header parameters */}
      <div className="card-minimal p-4 md:p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/50 border-b border-zinc-100 pb-2">Hero Welcome Settings</h3>
        <div className="flex flex-col gap-1 w-full">
          <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Welcome Tagline</label>
          <input
            type="text"
            value={invitationData.hero.welcomeMessage}
            onChange={(e) => updateInvitationData((prev) => ({
              ...prev,
              hero: { ...prev.hero, welcomeMessage: e.target.value }
            }))}
            className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Title Invitation Text</label>
          <input
            type="text"
            value={invitationData.hero.title}
            onChange={(e) => updateInvitationData((prev) => ({
              ...prev,
              hero: { ...prev.hero, title: e.target.value }
            }))}
            className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Subtitle / Details Note</label>
          <textarea
            value={invitationData.hero.subtitle}
            onChange={(e) => updateInvitationData((prev) => ({
              ...prev,
              hero: { ...prev.hero, subtitle: e.target.value }
            }))}
            rows={3}
            className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] resize-none w-full"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">CTA Button Text</label>
          <input
            type="text"
            value={invitationData.hero.ctaText}
            onChange={(e) => updateInvitationData((prev) => ({
              ...prev,
              hero: { ...prev.hero, ctaText: e.target.value }
            }))}
            className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
          />
        </div>
        
        {/* Hero Image upload */}
        <div className="flex flex-col gap-1.5 border-t border-zinc-100 pt-3 w-full">
          <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Hero Background Cover Image</label>
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <input
              type="text"
              value={invitationData.hero.heroImage}
              onChange={(e) => updateInvitationData((prev) => ({
                ...prev,
                hero: { ...prev.hero, heroImage: e.target.value }
              }))}
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] flex-1 w-full"
            />
            <FileUploader
              onUploadSuccess={(url) => updateInvitationData((prev) => ({
                ...prev,
                hero: { ...prev.hero, heroImage: url }
              }))}
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </div>

      {/* Family Surname & Traditional Symbols Panel */}
      <div className="card-minimal p-4 md:p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/50 border-b border-zinc-100 pb-2">Surname & Deity Symbols</h3>
        
        {/* Toggle show surname */}
        <div className="flex items-center justify-between bg-[#FAF9F6] p-3 border border-zinc-200/50 rounded-xl w-full">
          <label htmlFor="showSurnameHeading" className="text-xs font-semibold text-[#241E1C]/80 cursor-pointer">Show Family Surname</label>
          <input
            type="checkbox"
            id="showSurnameHeading"
            checked={invitationData.hero.showSurnameHeading ?? true}
            onChange={(e) => updateInvitationData((prev) => ({
              ...prev,
              hero: { ...prev.hero, showSurnameHeading: e.target.checked }
            }))}
            className="w-4 h-4 rounded text-[#C49B27] accent-[#C49B27] cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          <div className="flex flex-col gap-1 w-full">
            <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Surname Text</label>
            <input
              type="text"
              value={invitationData.hero.surname || ""}
              onChange={(e) => updateInvitationData((prev) => ({
                ...prev,
                hero: { ...prev.hero, surname: e.target.value }
              }))}
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Sub Text</label>
            <input
              type="text"
              value={invitationData.hero.subText || ""}
              onChange={(e) => updateInvitationData((prev) => ({
                ...prev,
                hero: { ...prev.hero, subText: e.target.value }
              }))}
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Font Family</label>
            <select
              value={invitationData.hero.surnameFont || "cinzel"}
              onChange={(e) => updateInvitationData((prev) => ({
                ...prev,
                hero: { ...prev.hero, surnameFont: e.target.value }
              }))}
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] h-[34px] w-full"
            >
              <option value="cinzel">Cinzel (Luxury Serif)</option>
              <option value="playfair">Playfair (Elegant Serif)</option>
              <option value="great-vibes">Great Vibes (Script)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Surname Color</label>
            <div className="flex gap-1.5 items-center w-full">
              <input
                type="color"
                value={invitationData.hero.surnameColor || "#C59B27"}
                onChange={(e) => updateInvitationData((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, surnameColor: e.target.value }
                }))}
                className="w-8 h-8 rounded border border-zinc-200 cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={invitationData.hero.surnameColor || "#C59B27"}
                onChange={(e) => updateInvitationData((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, surnameColor: e.target.value }
                }))}
                className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-2 py-1.5 text-xs text-[#241E1C] w-full outline-none"
              />
            </div>
          </div>
        </div>

        {/* Toggle Header symbol */}
        <div className="flex items-center justify-between bg-[#FAF9F6] p-3 border border-zinc-200/50 rounded-xl w-full">
          <label htmlFor="enableHeaderMedia" className="text-xs font-semibold text-[#241E1C]/80 cursor-pointer">Enable Header Deity/Symbol</label>
          <input
            type="checkbox"
            id="enableHeaderMedia"
            checked={invitationData.hero.enableHeaderMedia ?? true}
            onChange={(e) => updateInvitationData((prev) => ({
              ...prev,
              hero: { ...prev.hero, enableHeaderMedia: e.target.checked }
            }))}
            className="w-4 h-4 rounded text-[#C49B27] accent-[#C49B27] cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          <div className="flex flex-col gap-1 w-full">
            <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Symbol Class</label>
            <select
              value={invitationData.hero.headerMediaType || "god"}
              onChange={(e) => updateInvitationData((prev) => ({
                ...prev,
                hero: { ...prev.hero, headerMediaType: e.target.value as any }
              }))}
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] h-[34px] w-full"
            >
              <option value="god">Gold Deity (PNG)</option>
              <option value="symbol">Traditional (Vector)</option>
            </select>
          </div>

          {invitationData.hero.headerMediaType === "symbol" ? (
            <div className="flex flex-col gap-1 w-full">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Select Vector Symbol</label>
              <select
                value={invitationData.hero.selectedSymbol || "om"}
                onChange={(e) => updateInvitationData((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, selectedSymbol: e.target.value as any }
                }))}
                className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] h-[34px] w-full"
              >
                <option value="om">Om (ॐ)</option>
                <option value="swastik">Swastik</option>
                <option value="shree">Shree (श्री)</option>
                <option value="kalash">Kalash</option>
                <option value="nandi">Nandi</option>
              </select>
            </div>
          ) : (
            <div className="flex flex-col gap-1 w-full">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Select Gold Deity</label>
              <select
                value={invitationData.hero.selectedGod || "ganesha"}
                onChange={(e) => updateInvitationData((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, selectedGod: e.target.value as any }
                }))}
                className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] h-[34px] w-full"
              >
                <option value="ganesha">Lord Ganesha</option>
                <option value="venkateswara">Lord Venkateswara</option>
                <option value="lakshmi">Goddess Lakshmi</option>
                <option value="shiva">Lord Shiva</option>
                <option value="krishna">Lord Krishna</option>
              </select>
            </div>
          )}
        </div>

        {/* Size and Spacing Sliders */}
        <div className="space-y-3 pt-2 w-full">
          <div className="flex flex-col gap-1 w-full">
            <div className="flex justify-between items-center text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">
              <span>Icon Size</span>
              <span className="text-[#C49B27] font-mono">{invitationData.hero.headerMediaSize || 80}px</span>
            </div>
            <input
              type="range"
              min="40"
              max="180"
              value={invitationData.hero.headerMediaSize || 80}
              onChange={(e) => updateInvitationData((prev) => ({
                ...prev,
                hero: { ...prev.hero, headerMediaSize: parseInt(e.target.value) }
              }))}
              className="w-full accent-[#C49B27] bg-[#FAF9F6] h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <div className="flex justify-between items-center text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">
              <span>Top Padding Spacing</span>
              <span className="text-[#C49B27] font-mono">{invitationData.hero.headerMediaSpacing || 30}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={invitationData.hero.headerMediaSpacing || 30}
              onChange={(e) => updateInvitationData((prev) => ({
                ...prev,
                hero: { ...prev.hero, headerMediaSpacing: parseInt(e.target.value) }
              }))}
              className="w-full accent-[#C49B27] bg-[#FAF9F6] h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Groom Info */}
      <div className="card-minimal p-4 md:p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/50 border-b border-zinc-100 pb-2">The Groom</h3>
        <div className="flex flex-col gap-1 w-full">
          <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Groom's Name</label>
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
            className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Groom's Parents</label>
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
            className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
          />
        </div>
        
        {/* Groom Image upload */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Groom's Portrait Image</label>
          <div className="flex flex-col sm:flex-row gap-2 w-full">
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
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] flex-1 w-full"
            />
            <FileUploader
              onUploadSuccess={(url) => updateInvitationData((prev) => ({
                ...prev,
                couple: {
                  ...prev.couple,
                  groom: { ...prev.couple.groom, image: url }
                }
              }))}
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </div>

      {/* Bride Info */}
      <div className="card-minimal p-4 md:p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/50 border-b border-zinc-100 pb-2">The Bride</h3>
        <div className="flex flex-col gap-1 w-full">
          <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Bride's Name</label>
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
            className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Bride's Parents</label>
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
            className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
          />
        </div>
        
        {/* Bride Image upload */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Bride's Portrait Image</label>
          <div className="flex flex-col sm:flex-row gap-2 w-full">
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
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] flex-1 w-full"
            />
            <FileUploader
              onUploadSuccess={(url) => updateInvitationData((prev) => ({
                ...prev,
                couple: {
                  ...prev.couple,
                  bride: { ...prev.couple.bride, image: url }
                }
              }))}
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderEventsSettings = () => (
    <div className="space-y-6 text-left animate-fadeIn">
      <div className="flex justify-between items-center border-b border-zinc-200/50 pb-2 w-full">
        <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/50">Wedding Timelines</h3>
        <button
          onClick={() => {
            updateInvitationData((prev) => {
              const newEvent: WeddingEvent = {
                id: `event-${Date.now()}`,
                enabled: true,
                title: "New Event Ceremony",
                date: "2026-12-14",
                time: "10:30 AM",
                venue: "Venue Palace Hall, Bangalore",
                description: "Join us for a celebratory ritual.",
                icon: "Heart"
              };
              return { ...prev, events: [...prev.events, newEvent] };
            });
          }}
          className="flex items-center gap-1 px-3 py-1.5 border border-zinc-200 hover:border-[#C49B27]/40 rounded-xl text-[9px] font-bold uppercase tracking-[1px] bg-white transition-colors shadow-xs"
        >
          <Plus size={11} /> Add Ceremony
        </button>
      </div>

      {invitationData.events.map((evt, index) => (
        <div key={evt.id || index} className="card-minimal p-4 md:p-5 space-y-3 relative group w-full">
          <button
            type="button"
            onClick={() => {
              updateInvitationData((prev) => {
                const list = [...prev.events];
                list.splice(index, 1);
                return { ...prev, events: list };
              });
            }}
            className="absolute top-4 right-4 p-1.5 bg-red-500/5 border border-red-500/10 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
            title="Remove Event"
          >
            <Trash2 size={12} />
          </button>

          <div className="flex flex-col gap-1 pr-6 w-full">
            <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Event Title</label>
            <input
              type="text"
              value={evt.title}
              onChange={(e) => {
                updateInvitationData((prev) => {
                  const list = [...prev.events];
                  list[index] = { ...list[index], title: e.target.value };
                  return { ...prev, events: list };
                });
              }}
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] font-bold w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="flex flex-col gap-1 w-full">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Date</label>
              <input
                type="text"
                value={evt.date}
                onChange={(e) => {
                  updateInvitationData((prev) => {
                    const list = [...prev.events];
                    list[index] = { ...list[index], date: e.target.value };
                    return { ...prev, events: list };
                  });
                }}
                className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Time</label>
              <input
                type="text"
                value={evt.time}
                onChange={(e) => {
                  updateInvitationData((prev) => {
                    const list = [...prev.events];
                    list[index] = { ...list[index], time: e.target.value };
                    return { ...prev, events: list };
                  });
                }}
                className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Venue Name & Address</label>
            <input
              type="text"
              value={evt.venue}
              onChange={(e) => {
                updateInvitationData((prev) => {
                  const list = [...prev.events];
                  list[index] = { ...list[index], venue: e.target.value };
                  return { ...prev, events: list };
                });
              }}
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Event Description</label>
            <input
              type="text"
              value={evt.description}
              onChange={(e) => {
                updateInvitationData((prev) => {
                  const list = [...prev.events];
                  list[index] = { ...list[index], description: e.target.value };
                  return { ...prev, events: list };
                });
              }}
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderStorySettings = () => (
    <div className="space-y-6 text-left animate-fadeIn">
      <div className="flex justify-between items-center border-b border-zinc-200/50 pb-2 w-full">
        <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/50">Love Story Gallery</h3>
        <button
          onClick={() => {
            updateInvitationData((prev) => {
              const newTimeline: StoryTimelineEntry = {
                date: "2026",
                title: "Our First Meeting",
                description: "How we crossed paths...",
                image: ""
              };
              return {
                ...prev,
                story: {
                  ...prev.story,
                  timeline: [...prev.story.timeline, newTimeline]
                }
              };
            });
          }}
          className="flex items-center gap-1 px-3 py-1.5 border border-zinc-200 hover:border-[#C49B27]/40 rounded-xl text-[9px] font-bold uppercase tracking-[1px] bg-white transition-colors shadow-xs"
        >
          <Plus size={11} /> Add Entry
        </button>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Section Main Heading</label>
        <input
          type="text"
          value={invitationData.story.title}
          onChange={(e) => updateInvitationData((prev) => ({
            ...prev,
            story: { ...prev.story, title: e.target.value }
          }))}
          className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
        />
      </div>

      {invitationData.story.timeline.map((entry, index) => (
        <div key={index} className="card-minimal p-4 md:p-5 space-y-3 relative group w-full">
          <button
            type="button"
            onClick={() => {
              updateInvitationData((prev) => {
                const list = [...prev.story.timeline];
                list.splice(index, 1);
                return {
                  ...prev,
                  story: { ...prev.story, timeline: list }
                };
              });
            }}
            className="absolute top-4 right-4 p-1.5 bg-red-500/5 border border-red-500/10 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
            title="Remove Entry"
          >
            <Trash2 size={12} />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-6 w-full">
            <div className="flex flex-col gap-1 w-full">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Date / Year</label>
              <input
                type="text"
                value={entry.date}
                onChange={(e) => {
                  updateInvitationData((prev) => {
                    const list = [...prev.story.timeline];
                    list[index] = { ...list[index], date: e.target.value };
                    return { ...prev, story: { ...prev.story, timeline: list } };
                  });
                }}
                className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] text-center w-full"
              />
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2 w-full">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Title</label>
              <input
                type="text"
                value={entry.title}
                onChange={(e) => {
                  updateInvitationData((prev) => {
                    const list = [...prev.story.timeline];
                    list[index] = { ...list[index], title: e.target.value };
                    return { ...prev, story: { ...prev.story, timeline: list } };
                  });
                }}
                className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Description</label>
            <textarea
              value={entry.description}
              onChange={(e) => {
                updateInvitationData((prev) => {
                  const list = [...prev.story.timeline];
                  list[index] = { ...list[index], description: e.target.value };
                  return { ...prev, story: { ...prev.story, timeline: list } };
                });
              }}
              rows={2}
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] resize-none w-full"
            />
          </div>

          {/* Image uploader */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Portrait Image URL</label>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <input
                type="text"
                value={entry.image || ""}
                onChange={(e) => {
                  updateInvitationData((prev) => {
                    const list = [...prev.story.timeline];
                    list[index] = { ...list[index], image: e.target.value };
                    return { ...prev, story: { ...prev.story, timeline: list } };
                  });
                }}
                className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] flex-1 w-full"
              />
              <FileUploader
                onUploadSuccess={(url) => {
                  updateInvitationData((prev) => {
                    const list = [...prev.story.timeline];
                    list[index] = { ...list[index], image: url };
                    return { ...prev, story: { ...prev.story, timeline: list } };
                  });
                }}
                className="w-full sm:w-auto"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderVenuesSettings = () => (
    <div className="space-y-6 text-left animate-fadeIn">
      {/* RSVP Settings */}
      <div className="card-minimal p-4 md:p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-zinc-100 pb-2 w-full">
          <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/50">RSVP Contacts</h3>
          <button
            type="button"
            onClick={() => {
              updateInvitationData((prev) => {
                const newContact: RSVPContact = { type: "phone", label: "Helpline", value: "+91 99999-99999" };
                return {
                  ...prev,
                  rsvp: {
                    ...prev.rsvp,
                    contacts: [...prev.rsvp.contacts, newContact]
                  }
                };
              });
            }}
            className="flex items-center gap-1 px-3 py-1.5 border border-zinc-200 hover:border-[#C49B27]/40 rounded-xl text-[8px] font-bold uppercase tracking-[1px] bg-white transition-colors shadow-xs"
          >
            <Plus size={10} /> Add Contact
          </button>
        </div>

        {invitationData.rsvp.contacts.map((contact, index) => (
          <div key={index} className="bg-[#FAF9F6] border border-zinc-200/60 p-4 rounded-xl relative space-y-2 group w-full">
            <button
              type="button"
              onClick={() => {
                updateInvitationData((prev) => {
                  const list = [...prev.rsvp.contacts];
                  list.splice(index, 1);
                  return { ...prev, rsvp: { ...prev.rsvp, contacts: list } };
                });
              }}
              className="absolute top-3 right-3 p-1.5 bg-red-500/5 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
              title="Remove Contact"
            >
              <Trash2 size={10} />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-6 w-full">
              <div className="flex flex-col gap-1 w-full">
                <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Contact Type</label>
                <select
                  value={contact.type}
                  onChange={(e) => {
                    updateInvitationData((prev) => {
                      const list = [...prev.rsvp.contacts];
                      list[index] = { ...list[index], type: e.target.value as any };
                      return { ...prev, rsvp: { ...prev.rsvp, contacts: list } };
                    });
                  }}
                  className="bg-white border border-zinc-200 rounded-xl px-2.5 py-1.5 text-xs text-[#241E1C] outline-none h-[34px] w-full"
                >
                  <option value="phone">Phone Call</option>
                  <option value="whatsapp">WhatsApp Message</option>
                  <option value="email">Email Address</option>
                  <option value="form">RSVP Form</option>
                </select>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Label / Name</label>
                <input
                  type="text"
                  value={contact.label}
                  onChange={(e) => {
                    updateInvitationData((prev) => {
                      const list = [...prev.rsvp.contacts];
                      list[index] = { ...list[index], label: e.target.value };
                      return { ...prev, rsvp: { ...prev.rsvp, contacts: list } };
                    });
                  }}
                  className="bg-white border border-zinc-200 rounded-xl px-3 py-1.5 text-xs text-[#241E1C] outline-none w-full"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Phone/Email Value</label>
              <input
                type="text"
                value={contact.value}
                onChange={(e) => {
                  updateInvitationData((prev) => {
                    const list = [...prev.rsvp.contacts];
                    list[index] = { ...list[index], value: e.target.value };
                    return { ...prev, rsvp: { ...prev.rsvp, contacts: list } };
                  });
                }}
                className="bg-white border border-zinc-200 rounded-xl px-3 py-1.5 text-xs text-[#241E1C] outline-none font-mono w-full"
              />
            </div>
          </div>
        ))}

        <div className="flex flex-col gap-2 pt-2 w-full">
          <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Target Countdown Date & Time</label>
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="flex flex-col gap-1 w-full">
              <span className="text-[8px] uppercase font-semibold text-[#241E1C]/40">Select Date</span>
              <input
                type="date"
                value={invitationData.countdown.targetDate ? invitationData.countdown.targetDate.split("T")[0] : ""}
                onChange={(e) => {
                  const datePart = e.target.value || "2026-12-14";
                  const currentFull = invitationData.countdown.targetDate || "2026-12-14T10:30:00";
                  const timePart = currentFull.split("T")[1] || "10:30:00";
                  updateInvitationData((prev) => ({
                    ...prev,
                    countdown: { ...prev.countdown, targetDate: `${datePart}T${timePart}` }
                  }));
                }}
                className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
              />
            </div>
            
            <div className="flex flex-col gap-1 w-full">
              <span className="text-[8px] uppercase font-semibold text-[#241E1C]/40">Select Time</span>
              <input
                type="time"
                value={
                  invitationData.countdown.targetDate && invitationData.countdown.targetDate.split("T")[1]
                    ? invitationData.countdown.targetDate.split("T")[1].substring(0, 5)
                    : "10:30"
                }
                onChange={(e) => {
                  const timePart = e.target.value || "10:30";
                  const currentFull = invitationData.countdown.targetDate || "2026-12-14T10:30:00";
                  const datePart = currentFull.split("T")[0] || "2026-12-14";
                  updateInvitationData((prev) => ({
                    ...prev,
                    countdown: { ...prev.countdown, targetDate: `${datePart}T${timePart}:00` }
                  }));
                }}
                className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
              />
            </div>
          </div>
          <span className="text-[8px] text-[#241E1C]/40 font-mono mt-1">Current Target: {invitationData.countdown.targetDate}</span>
        </div>
      </div>
    </div>
  );

  const renderDetailsSettings = () => (
    <div className="space-y-6 text-left animate-fadeIn">
      {/* FAQs Schedule */}
      <div className="card-minimal p-4 md:p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-zinc-100 pb-2 w-full">
          <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/50">Dress Code Details</h3>
          <button
            onClick={() => {
              updateInvitationData((prev) => {
                const newFaq: FAQEntry = { question: "Is there a specific dress code?", answer: "Yes, traditional Indian attire is requested." };
                const entries = prev.faq?.entries || [];
                return {
                  ...prev,
                  faq: {
                    id: prev.faq?.id || "faqs",
                    enabled: prev.faq?.enabled ?? true,
                    title: prev.faq?.title ?? "Frequently Asked Questions",
                    entries: [...entries, newFaq]
                  }
                };
              });
            }}
            className="flex items-center gap-1 px-3 py-1.5 border border-zinc-200 hover:border-[#C49B27]/40 rounded-xl text-[8px] font-bold uppercase tracking-[1px] bg-white transition-colors shadow-xs"
          >
            <Plus size={10} /> Add FAQ
          </button>
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Dress Code Details</label>
          <input
            type="text"
            value={invitationData.dressCode?.description || ""}
            onChange={(e) => updateInvitationData((prev) => ({
              ...prev,
              dressCode: {
                id: prev.dressCode?.id || "dressCode",
                enabled: prev.dressCode?.enabled ?? true,
                title: prev.dressCode?.title ?? "Dress Code",
                code: prev.dressCode?.code || "Traditional Attire",
                description: e.target.value
              }
            }))}
            className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
          />
        </div>

        {(invitationData.faq?.entries || []).map((faq, index) => (
          <div key={index} className="bg-[#FAF9F6] border border-zinc-200/60 p-4 rounded-xl relative space-y-2 group w-full">
            <button
              type="button"
              onClick={() => {
                updateInvitationData((prev) => {
                  const entries = [...(prev.faq?.entries || [])];
                  entries.splice(index, 1);
                  return { ...prev, faq: { id: prev.faq?.id || "faqs", enabled: prev.faq?.enabled ?? true, title: prev.faq?.title ?? "FAQs", entries } };
                });
              }}
              className="absolute top-3 right-3 p-1.5 bg-red-500/5 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
              title="Remove FAQ"
            >
              <Trash2 size={10} />
            </button>

            <div className="flex flex-col gap-1 pr-6 w-full">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Question</label>
              <input
                type="text"
                value={faq.question}
                onChange={(e) => {
                  updateInvitationData((prev) => {
                    const entries = [...(prev.faq?.entries || [])];
                    entries[index] = { ...entries[index], question: e.target.value };
                    return { ...prev, faq: { id: prev.faq?.id || "faqs", enabled: prev.faq?.enabled ?? true, title: prev.faq?.title ?? "FAQs", entries } };
                  });
                }}
                className="bg-white border border-zinc-200 rounded-xl px-3 py-1.5 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Answer</label>
              <input
                type="text"
                value={faq.answer}
                onChange={(e) => {
                  updateInvitationData((prev) => {
                    const entries = [...(prev.faq?.entries || [])];
                    entries[index] = { ...entries[index], answer: e.target.value };
                    return { ...prev, faq: { id: prev.faq?.id || "faqs", enabled: prev.faq?.enabled ?? true, title: prev.faq?.title ?? "FAQs", entries } };
                  });
                }}
                className="bg-white border border-zinc-200 rounded-xl px-3 py-1.5 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-[#FAF9F6] text-[#241E1C] flex flex-col font-sans relative select-none overflow-x-hidden">
      <ConfettiCanvas active={triggerConfetti} />

      {/* --- HEADER --- */}
      <header className="bg-white border-b border-zinc-200/50 backdrop-blur-md px-4 md:px-6 h-16 flex items-center justify-between shrink-0 shadow-sm relative z-40">
        <div className="flex items-center gap-3">
          <img src="/images/logo.png" alt="Ahvaanam" className="h-26 w-auto object-contain translate-y-0 drop-shadow-sm" />
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <a
            href="/dashboard"
            className="flex items-center gap-1 px-3 py-1.5 md:px-4 md:py-2 border border-zinc-200 rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-[1px] hover:bg-zinc-50 transition-all text-[#241E1C]/80 shadow-xs"
          >
            <ArrowLeft size={11} /> <span className="hidden md:inline">Dashboard</span>
          </a>
          <a
            href={`/invites/${clientId}`}
            target="_blank"
            className="flex items-center gap-1 px-3 py-1.5 md:px-4 md:py-2 border border-amber-500/20 bg-amber-500/5 hover:bg-[#C49B27]/10 text-[#C49B27] rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-[1px] transition-all shadow-xs"
          >
            <Eye size={11} /> <span className="hidden md:inline">Open Guest Link</span>
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 bg-[#C49B27] hover:bg-[#B0871B] text-white px-3 py-1.5 md:px-5 md:py-2 rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-[1px] transition-all disabled:opacity-50 shadow-sm"
          >
            <Save size={11} />
            <span>{saving ? "Saving..." : "Save"}</span>
          </button>
          
          {/* Properties Toggle for Tablet */}
          <button
            onClick={() => setShowProperties(!showProperties)}
            className="hidden md:flex lg:hidden items-center justify-center p-2 border border-zinc-200 rounded-xl hover:bg-zinc-50 text-slate-700"
            title="Toggle Settings Panel"
          >
            <Sliders size={14} />
          </button>
        </div>
      </header>

      {/* --- WORKSPACE BODY CONTAINER --- */}
      <div className="flex-1 flex flex-col md:flex-row md:h-[calc(100vh-65px)] md:overflow-hidden relative">
        
        <div className="hidden lg:flex w-20 shrink-0 bg-[#FAF9F6] border-r border-zinc-200/60 flex-col items-center py-6 gap-5 z-30 select-none">
          {tabsList.map((tab) => {
            const Icon = IconLookup[tab.icon] || HelpCircle;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setExpandedSection(tab.id); // Synchronize accordion expansion
                }}
                className={`flex flex-col items-center gap-1.5 w-16 py-3 rounded-xl border text-[8px] font-bold uppercase tracking-[0.5px] transition-all ${
                  isActive 
                    ? "bg-[#C49B27]/5 border-amber-500/25 text-[#C49B27] shadow-xs" 
                    : "text-[#241E1C]/60 hover:text-[#241E1C] border-transparent hover:bg-zinc-100/50"
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* MIDDLE PREVIEW AREA (Full width on Mobile, flex-1 on Tablet/Desktop) */}
        <div className="w-full md:flex-1 bg-[#F3F0E8] flex flex-col md:h-full overflow-hidden relative border-r border-zinc-200/50">
          
          {/* Controls Bar for devices and zoom (Desktop/Tablet) */}
          <div className="bg-white border-b border-zinc-200 px-4 py-3 flex items-center justify-between shrink-0 select-none">
            <span className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#241E1C]/50 flex items-center gap-1.5">
              <Eye size={12} className="text-[#C49B27]" /> Live Sandbox
            </span>
            
            <div className="flex items-center gap-4">
              {/* Zoom slider */}
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold uppercase text-[#241E1C]/40">Zoom: {Math.round(zoomScale * 100)}%</span>
                <input
                  type="range"
                  min="0.5"
                  max="1.2"
                  step="0.05"
                  value={zoomScale}
                  onChange={(e) => setZoomScale(parseFloat(e.target.value))}
                  className="w-16 md:w-24 h-1 accent-[#C49B27] cursor-pointer"
                />
              </div>

              {/* Viewport Toggles */}
              <div className="flex items-center gap-1 bg-[#FAF9F6] p-1 border border-zinc-200 rounded-lg">
                {[
                  { id: "mobile", icon: Smartphone, label: "Mobile" },
                  { id: "tablet", icon: Tablet, label: "Tablet" },
                  { id: "desktop", icon: Monitor, label: "Desktop" }
                ].map((dev) => {
                  const Icon = dev.icon;
                  return (
                    <button
                      key={dev.id}
                      onClick={() => setPreviewDevice(dev.id as any)}
                      className={`p-1.5 rounded transition-all text-[#241E1C]/60 hover:text-[#241E1C] ${
                        previewDevice === dev.id 
                          ? "bg-white border border-zinc-200 text-[#C49B27] shadow-sm" 
                          : "border border-transparent"
                      }`}
                      title={dev.label}
                    >
                      <Icon size={12} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Centered screen preview frame */}
          <div className="flex-1 overflow-auto p-4 md:p-8 flex items-center justify-center relative min-h-[440px] md:min-h-0 md:h-full">
            
            {/* Device Canvas Frame */}
            <div 
              className="transition-all duration-300 relative rounded-[32px] overflow-hidden border-[6px] border-zinc-800 bg-[#FAF9F6] shadow-xl flex flex-col w-full max-w-full"
              style={{
                width: previewDevice === "mobile" ? "320px" : previewDevice === "tablet" ? "520px" : "100%",
                aspectRatio: previewDevice === "desktop" ? "auto" : "9/16",
                height: previewDevice === "desktop" ? "100%" : "auto",
                minHeight: previewDevice === "desktop" ? "500px" : "480px",
                transform: `scale(${zoomScale})`,
                transformOrigin: "center center"
              }}
            >
              <div className="flex-1 h-full w-full relative">
                <iframe
                  ref={iframeRef}
                  src={`/invites/${clientId}`}
                  className="absolute inset-0 w-full h-full border-0"
                  title="Ahvaanam Live Template Sandbox"
                />
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT PANEL: Properties/Forms configurations */}
        <div className={`
          ${showProperties ? "flex" : "hidden"} 
          w-full md:w-[380px] lg:w-[450px] shrink-0 bg-white flex flex-col relative z-20 
          md:h-full md:border-l border-zinc-200/60
        `}>
          
          {/* Scrollable container for Forms or Accordions */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            
            <div className="space-y-3">
              {tabsList.map((sect) => {
                const Icon = IconLookup[sect.icon] || HelpCircle;
                const isExpanded = expandedSection === sect.id;
                
                return (
                  <div 
                    key={sect.id}
                    className="border border-zinc-200/80 rounded-2xl overflow-hidden bg-white shadow-xs"
                  >
                    {/* Accordion Trigger Header */}
                    <button
                      onClick={() => {
                        setExpandedSection(isExpanded ? null : sect.id);
                        setActiveTab(sect.id as any);
                      }}
                      className="w-full flex items-center justify-between px-5 py-4 text-left bg-zinc-50/50 hover:bg-zinc-50 transition-colors select-none"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={14} className="text-[#C49B27]" />
                        <span className="text-xs font-bold uppercase tracking-[1px] text-slate-800">{sect.label}</span>
                      </div>
                      <ChevronDown 
                        size={14 
                        } 
                        className={`text-slate-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} 
                      />
                    </button>
 
                    {/* Accordion Content Body */}
                    <div className={`
                      transition-all duration-300 overflow-hidden 
                      ${isExpanded ? "max-h-[4000px] border-t border-zinc-100 p-4 md:p-5 space-y-5" : "max-h-0"}
                    `}>
                      {sect.id === "general" ? renderGeneralSettings() : (() => {
                        const currentNav = visibleNavigationItems.find(n => n.id === sect.id);
                        if (!currentNav) return null;
                        return (
                          <div className="space-y-6">
                            {currentNav.sections.map(sectionId => {
                              if (!isSectionSupported(sectionId, manifest?.features)) return null;
                              return renderManifestSection(sectionId);
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
            
          </div>
        </div>

      </div>

      {/* Floating scroll top preview button for Mobile/Tablet */}
      {showScrollTop && (
        <button
          onClick={scrollToPreview}
          className="fixed bottom-6 right-6 z-50 lg:hidden flex items-center gap-1.5 px-4.5 py-3 bg-[#C49B27] text-white rounded-full font-bold uppercase tracking-[1.5px] text-[10px] shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          <Eye size={12} /> Preview
        </button>
      )}

    </div>
  );
}

export default function AdminPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <InvitationDataProvider clientId={id} isEditor={true}>
      <AdminPortalContent clientId={id} />
    </InvitationDataProvider>
  );
}
