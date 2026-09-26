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
  ChevronDown, ChevronLeft, ChevronRight, GripVertical, BarChart2
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { isAdminUser } from "@/lib/auth/isAdmin";

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
  accept?: string;
}

function FileUploader({
  onUploadSuccess,
  label = "Upload Image",
  className = "",
  accept = "image/*"
}: FileUploaderProps) {
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
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`flex flex-col gap-1 w-full sm:w-auto ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="flex items-center justify-center gap-1.5 bg-[#FAF9F6] border border-zinc-200 hover:border-zinc-300 text-[#241E1C]/80 rounded-xl px-4 py-2.5 text-xs font-bold transition-all disabled:opacity-50 w-full sm:w-auto cursor-pointer"
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

function AdminPortalContent({ clientId }: { clientId: string }) {
  const { invitationData, loading, error, updateInvitationData, saveConfig } = useInvitationData();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // Admin access guard
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user || !isAdminUser(user.email)) {
        window.location.href = "/dashboard";
      } else {
        setIsAdmin(true);
      }
    });
  }, []);
  
  // Responsive layout tab & accordion control states
  const [activeTab, setActiveTab] = useState<string>("general");
  const [expandedSection, setExpandedSection] = useState<string | null>("general");
  const [showProperties, setShowProperties] = useState(true);
  
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [triggerConfetti, setTriggerConfetti] = useState(false);
  const [draggedGalleryIdx, setDraggedGalleryIdx] = useState<number | null>(null);
  const [dragOverGalleryIdx, setDragOverGalleryIdx] = useState<number | null>(null);

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
            {error && (
              <p className="text-red-500/80 text-[10px] font-mono bg-red-50/50 border border-red-500/10 p-2 rounded-lg max-w-xs mx-auto break-all">
                {error}
              </p>
            )}
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
    story: "Our Story",
    events: "Ceremony Timelines",
    venues: "Venues & Maps Settings",
    rsvp: "RSVP Registry",
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
      if (sectionId === "couple" || sectionId === "groom" || sectionId === "bride") return renderCoupleSettings();
      if (sectionId === "events") return renderEventsSettings();
      if (sectionId === "countdown") return renderCountdownSettings();
      if (sectionId === "story") return renderStorySettings();
      if (sectionId === "gallery") return renderGallerySettings();
      if (sectionId === "families") return renderFamiliesSettings();
      if (sectionId === "venue") return renderVenuesSettings();
      if (sectionId === "rsvp") return renderRsvpSettings();
      if (sectionId === "footer") return renderFooterSettings();
      if (sectionId === "faq" || sectionId === "dressCode") return null;
      if (sectionId === "hero") return null;
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
                    <div className="flex flex-col gap-0.5">
                      <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Gallery Photo List</label>
                      <span className="text-[9px] text-[#241E1C]/45 font-medium italic">Hold &amp; drag to rearrange</span>
                    </div>
                    <FileUploader
                      onUploadSuccess={(url) => {
                        updateConfigMetadataValue("gallery.images", [...galleryImages, url]);
                      }}
                      label="Add Photo"
                    />
                  </div>
                  {galleryImages.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 border border-zinc-100 rounded-xl p-3 bg-[#FAF9F6]">
                      {galleryImages.map((img: string, idx: number) => (
                        <div
                          key={idx}
                          draggable={true}
                          onDragStart={(e) => {
                            setDraggedGalleryIdx(idx);
                            e.dataTransfer.effectAllowed = "move";
                            e.dataTransfer.setData("text/plain", idx.toString());
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = "move";
                            if (dragOverGalleryIdx !== idx) {
                              setDragOverGalleryIdx(idx);
                            }
                          }}
                          onDragEnd={() => {
                            setDraggedGalleryIdx(null);
                            setDragOverGalleryIdx(null);
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (draggedGalleryIdx !== null && draggedGalleryIdx !== idx) {
                              const newImgs = [...galleryImages];
                              const [moved] = newImgs.splice(draggedGalleryIdx, 1);
                              newImgs.splice(idx, 0, moved);
                              updateConfigMetadataValue("gallery.images", newImgs);
                            }
                            setDraggedGalleryIdx(null);
                            setDragOverGalleryIdx(null);
                          }}
                          className={`relative aspect-square rounded-xl overflow-hidden border transition-all duration-200 cursor-grab active:cursor-grabbing group bg-white shadow-xs select-none ${
                            draggedGalleryIdx === idx
                              ? "opacity-35 scale-95 border-dashed border-[#C49B27]"
                              : dragOverGalleryIdx === idx
                              ? "scale-105 border-[#C49B27] ring-2 ring-[#C49B27] shadow-md z-20"
                              : "border-zinc-200/80 hover:border-[#C49B27]/60"
                          }`}
                        >
                          <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover pointer-events-none" />

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextList = galleryImages.filter((_: any, i: number) => i !== idx);
                              updateConfigMetadataValue("gallery.images", nextList);
                            }}
                            className="absolute top-1.5 right-1.5 p-1 bg-red-600/90 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer z-10"
                            title="Remove photo"
                          >
                            <Trash2 size={11} />
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
    const rawSectionOrder = data.sectionOrder || [];
    const sectionOrder = rawSectionOrder.filter((sId: string) => sId !== "faq" && sId !== "faqs" && sId !== "dressCode");
    const clientEmailVal = (invitationData as any).clientEmail || data.clientEmail || "";

    return (
      <div className="space-y-6 text-left animate-fadeIn">
        <div className="card-minimal p-4 md:p-5 space-y-4 md:space-y-5">
          <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/50 border-b border-zinc-100 pb-2">Client Assignment & Theme</h3>
          
          {/* Assigned Client Email */}
          <div className="flex flex-col gap-1.5 w-full bg-[#FAF9F6] p-3.5 border border-zinc-200/60 rounded-xl">
            <div className="flex items-center justify-between">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/60 tracking-[1.5px]">Assigned Client Email</label>
              <span className="text-[9px] text-[#C49B27] font-semibold">Links to Client Dashboard</span>
            </div>
            <input
              type="email"
              placeholder="e.g. client@example.com"
              value={clientEmailVal}
              onChange={(e) => {
                const val = e.target.value;
                updateInvitationData((prev: any) => {
                  const next = { ...prev, clientEmail: val };
                  if (next.config) {
                    next.config.clientEmail = val;
                  }
                  return next;
                });
              }}
              className="bg-white border border-zinc-200 rounded-xl px-4 py-2 text-xs text-[#241E1C] outline-none font-medium focus:border-[#C49B27] w-full"
            />
            <p className="text-[9px] text-zinc-400 mt-0.5">
              The user registered with this email will automatically see this invitation in their personal dashboard.
            </p>
          </div>

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

          {/* Background Audio Upload & Controls */}
          <div className="flex flex-col gap-2 w-full bg-[#FAF9F6] p-3.5 border border-zinc-200/60 rounded-xl">
            <div className="flex items-center justify-between">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/60 tracking-[1px]">Background Music</label>
              <span className="text-[9px] text-[#C49B27] font-semibold">MP3, WAV, M4A, OGG</span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <FileUploader
                accept="audio/*,.mp3,.wav,.m4a,.ogg,.aac"
                label="Upload Audio Track"
                onUploadSuccess={(url) => {
                  updateInvitationData((prev: any) => {
                    const next = { ...prev };
                    const target = next.config || next;
                    if (!target.music) target.music = { enabled: true, file: url };
                    else target.music = { ...target.music, file: url, enabled: true };
                    return next;
                  });
                }}
                className="w-full sm:w-auto shrink-0"
              />
              <input
                type="text"
                placeholder="Or paste audio URL..."
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
                className="bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
              />
            </div>

            {musicFile && (
              <div className="mt-1">
                <audio controls src={musicFile} className="w-full h-8" preload="none" />
              </div>
            )}
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

  // --- BRIDE & GROOM SINGLE SETTINGS PANEL ---
  const renderCoupleSettings = () => {
    const currentSide = invitationData?.couple?.primarySide || (invitationData as any)?.primarySide || "groom";
    const isBride = currentSide === "bride";

    const groomData = invitationData.couple?.groom || { name: "", parents: "", image: "" };
    const groomFamily = Array.isArray(invitationData.families?.groomFamily)
      ? invitationData.families.groomFamily
      : Array.isArray(groomData.family)
        ? groomData.family
        : [];

    const brideData = invitationData.couple?.bride || { name: "", parents: "", image: "" };
    const brideFamily = Array.isArray(invitationData.families?.brideFamily)
      ? invitationData.families.brideFamily
      : Array.isArray(brideData.family)
        ? brideData.family
        : [];

    return (
      <div className="space-y-6 text-left animate-fadeIn">
        {/* --- AUSPICIOUS MANTRA & BLESSING CONFIG --- */}
        <div className="card-minimal p-4 md:p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/60">Auspicious Mantra / Header Text</h3>
            <span className="text-[10px] text-[#C49B27] font-semibold">Top Blessing</span>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Opening Mantra / Devotional Text</label>
            <input
              type="text"
              value={invitationData.hero?.welcomeMessage || invitationData.hero?.mantra || invitationData.mantra || ""}
              onChange={(e) => updateInvitationData((prev: any) => {
                const next = {
                  ...prev,
                  hero: {
                    ...prev.hero,
                    welcomeMessage: e.target.value,
                    mantra: e.target.value
                  },
                  mantra: e.target.value
                };
                if (next.config) {
                  next.config.hero = { ...(next.config.hero || {}), welcomeMessage: e.target.value, mantra: e.target.value };
                  next.config.mantra = e.target.value;
                }
                return next;
              })}
              placeholder="e.g. ॐ श्री गणेशाय नमः ||"
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full font-semibold"
            />
            <p className="text-[9px] text-zinc-500 mt-0.5">
              Displays on the opening envelope card and header (e.g. ॐ श्री गणेशाय नमः ||, || श्री विघ्नेश्वराय नमः ||, Subhamasthu, etc.).
            </p>
          </div>
        </div>

        {/* --- INVITATION SIDE & PRIMARY ORDER SWITCHER --- */}
        <div className="card-minimal p-4 md:p-5 space-y-3 bg-amber-500/5 border-amber-500/20">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase font-bold text-[#241E1C]/80 tracking-[1.5px]">
              Invitation Side &amp; Primary Order
            </label>
            <span className="text-[9px] text-[#C49B27] font-semibold">Whose Name &amp; Family Appears First</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                updateInvitationData((prev: any) => ({
                  ...prev,
                  couple: { ...prev.couple, primarySide: "groom" },
                  config: prev.config ? { ...prev.config, couple: { ...prev.config?.couple, primarySide: "groom" } } : undefined
                }));
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                !isBride
                  ? "bg-[#C49B27] text-white shadow-sm font-extrabold"
                  : "bg-white text-[#241E1C]/60 hover:bg-amber-50/50 border border-zinc-200"
              }`}
            >
              🤵 Groom First (Groom's Side)
            </button>
            <button
              type="button"
              onClick={() => {
                updateInvitationData((prev: any) => ({
                  ...prev,
                  couple: { ...prev.couple, primarySide: "bride" },
                  config: prev.config ? { ...prev.config, couple: { ...prev.config?.couple, primarySide: "bride" } } : undefined
                }));
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isBride
                  ? "bg-[#C49B27] text-white shadow-sm font-extrabold"
                  : "bg-white text-[#241E1C]/60 hover:bg-amber-50/50 border border-zinc-200"
              }`}
            >
              👰 Bride First (Bride's Side)
            </button>
          </div>
          <p className="text-[9px] text-zinc-500">
            {!isBride 
              ? "Groom's name and family will appear first in the hero header, couple section, family greetings card, and wedding story."
              : "Bride's name and family will appear first in the hero header, couple section, family greetings card, and wedding story."}
          </p>
        </div>

        {/* --- GROOM CARD & FAMILY --- */}
        <div className="card-minimal p-4 md:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/60">Groom Information &amp; Family</h3>
            <span className="text-[10px] text-[#C49B27] font-semibold">The Groom</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <div className="flex flex-col gap-1 w-full">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Groom's Name</label>
              <input
                type="text"
                value={groomData.name || ""}
                onChange={(e) => updateInvitationData((prev: any) => {
                  const next = {
                    ...prev,
                    couple: {
                      ...prev.couple,
                      groom: { ...prev.couple?.groom, name: e.target.value }
                    }
                  };
                  if (next.config) {
                    next.config.couple = { ...(next.config.couple || {}), groom: { ...(next.config.couple?.groom || {}), name: e.target.value } };
                  }
                  return next;
                })}
                placeholder="e.g. Aarav"
                className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full font-semibold"
              />
            </div>

            {/* Groom's Family Name / Surname */}
            <div className="flex flex-col gap-1 w-full">
              <div className="flex items-center justify-between">
                <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Groom's Family Name / Surname</label>
                <span className="text-[9px] text-[#C49B27] font-semibold">Surname</span>
              </div>
              <input
                type="text"
                value={groomData.surname || invitationData.hero?.surname || ""}
                onChange={(e) => updateInvitationData((prev: any) => {
                  const next = {
                    ...prev,
                    couple: {
                      ...prev.couple,
                      groom: { ...prev.couple?.groom, surname: e.target.value }
                    },
                    hero: {
                      ...prev.hero,
                      surname: e.target.value
                    }
                  };
                  if (next.config) {
                    next.config.couple = { ...(next.config.couple || {}), groom: { ...(next.config.couple?.groom || {}), surname: e.target.value } };
                    next.config.hero = { ...(next.config.hero || {}), surname: e.target.value };
                  }
                  return next;
                })}
                placeholder="e.g. Ryagalla / Sharma"
                className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full font-semibold"
              />
            </div>
          </div>

          {/* Groom's Family Card Title */}
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center justify-between">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Family Card Heading</label>
              <span className="text-[9px] text-[#C49B27] font-semibold">Custom Title</span>
            </div>
            <input
              type="text"
              value={groomData.familyTitle || invitationData.families?.groomFamilyTitle || ""}
              onChange={(e) => updateInvitationData((prev: any) => {
                const next = {
                  ...prev,
                  couple: {
                    ...prev.couple,
                    groom: { ...prev.couple?.groom, familyTitle: e.target.value }
                  },
                  families: {
                    ...prev.families,
                    groomFamilyTitle: e.target.value
                  }
                };
                if (next.config) {
                  next.config.couple = { ...(next.config.couple || {}), groom: { ...(next.config.couple?.groom || {}), familyTitle: e.target.value } };
                  next.config.families = { ...(next.config.families || {}), groomFamilyTitle: e.target.value };
                }
                return next;
              })}
              placeholder={`e.g. ${groomData.name || "Aarav"}'s Family`}
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full font-semibold"
            />
          </div>

          {/* Groom Portrait Image */}
          <div className="flex flex-col gap-1.5 border-t border-zinc-100 pt-3 w-full">
            <div className="flex items-center justify-between">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Groom's Portrait Image</label>
              <span className="text-[9px] text-[#C49B27] font-semibold">Upload Photo</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              {groomData.image && (
                <div className="w-12 h-12 rounded-full overflow-hidden border border-amber-500/30 shrink-0 bg-zinc-100 shadow-xs">
                  <img src={groomData.image} alt="Groom Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <input
                type="text"
                value={groomData.image || ""}
                onChange={(e) => updateInvitationData((prev: any) => {
                  const next = {
                    ...prev,
                    couple: {
                      ...prev.couple,
                      groom: { ...prev.couple?.groom, image: e.target.value }
                    },
                    families: {
                      ...prev.families,
                      groomPortrait: e.target.value
                    }
                  };
                  if (next.config) {
                    next.config.couple = { ...(next.config.couple || {}), groom: { ...(next.config.couple?.groom || {}), image: e.target.value } };
                    next.config.families = { ...(next.config.families || {}), groomPortrait: e.target.value };
                  }
                  return next;
                })}
                placeholder="Image URL or upload below..."
                className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] flex-1 font-mono"
              />
              <FileUploader
                onUploadSuccess={(url) => updateInvitationData((prev: any) => {
                  const next = {
                    ...prev,
                    couple: {
                      ...prev.couple,
                      groom: { ...prev.couple?.groom, image: url }
                    },
                    families: {
                      ...prev.families,
                      groomPortrait: url
                    }
                  };
                  if (next.config) {
                    next.config.couple = { ...(next.config.couple || {}), groom: { ...(next.config.couple?.groom || {}), image: url } };
                    next.config.families = { ...(next.config.families || {}), groomPortrait: url };
                  }
                  return next;
                })}
                className="w-full sm:w-auto"
              />
            </div>
          </div>

          {/* Groom's Family Members list */}
          <div className="flex flex-col gap-2 w-full border-t border-zinc-100 pt-3">
            <div className="flex items-center justify-between">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Family Members / Greetings</label>
              <button
                type="button"
                onClick={() => {
                  const currentList = Array.isArray(groomData.family) ? [...groomData.family] : [];
                  currentList.push({ relation: "", name: "" });
                  updateInvitationData((prev: any) => {
                    const next = {
                      ...prev,
                      couple: {
                        ...prev.couple,
                        groom: { ...prev.couple?.groom, family: currentList }
                      },
                      families: {
                        ...prev.families,
                        groomFamily: currentList
                      }
                    };
                    if (next.config) {
                      next.config.couple = { ...(next.config.couple || {}), groom: { ...(next.config.couple?.groom || {}), family: currentList } };
                      next.config.families = { ...(next.config.families || {}), groomFamily: currentList };
                    }
                    return next;
                  });
                }}
                className="text-[9px] font-bold text-[#C49B27] uppercase tracking-[1px] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus size={10} /> Add Member
              </button>
            </div>
            
            {Array.isArray(groomData.family) && groomData.family.length > 0 ? (
              <div className="space-y-2">
                {groomData.family.map((member: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 bg-[#FAF9F6] p-2 rounded-xl border border-zinc-200/70">
                    <input
                      type="text"
                      placeholder="Relation (e.g. Father, Mother)"
                      value={member.relation || ""}
                      onChange={(e) => {
                        const currentList = Array.isArray(groomData.family) ? [...groomData.family] : [];
                        currentList[idx] = { ...currentList[idx], relation: e.target.value };
                        updateInvitationData((prev: any) => {
                          const next = {
                            ...prev,
                            couple: {
                              ...prev.couple,
                              groom: { ...prev.couple?.groom, family: currentList }
                            },
                            families: {
                              ...prev.families,
                              groomFamily: currentList
                            }
                          };
                          if (next.config) {
                            next.config.couple = { ...(next.config.couple || {}), groom: { ...(next.config.couple?.groom || {}), family: currentList } };
                            next.config.families = { ...(next.config.families || {}), groomFamily: currentList };
                          }
                          return next;
                        });
                      }}
                      className="bg-white border border-zinc-200 rounded-lg px-2.5 py-1 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-1/3"
                    />
                    <input
                      type="text"
                      placeholder="Name (e.g. Sri Rajesh Sharma)"
                      value={member.name || ""}
                      onChange={(e) => {
                        const currentList = Array.isArray(groomData.family) ? [...groomData.family] : [];
                        currentList[idx] = { ...currentList[idx], name: e.target.value };
                        updateInvitationData((prev: any) => {
                          const next = {
                            ...prev,
                            couple: {
                              ...prev.couple,
                              groom: { ...prev.couple?.groom, family: currentList }
                            },
                            families: {
                              ...prev.families,
                              groomFamily: currentList
                            }
                          };
                          if (next.config) {
                            next.config.couple = { ...(next.config.couple || {}), groom: { ...(next.config.couple?.groom || {}), family: currentList } };
                            next.config.families = { ...(next.config.families || {}), groomFamily: currentList };
                          }
                          return next;
                        });
                      }}
                      className="bg-white border border-zinc-200 rounded-lg px-2.5 py-1 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] flex-1 font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const list = Array.isArray(groomData.family) ? groomData.family : [];
                        const currentList = list.filter((_: any, i: number) => i !== idx);
                        updateInvitationData((prev: any) => {
                          const next = {
                            ...prev,
                            couple: {
                              ...prev.couple,
                              groom: { ...prev.couple?.groom, family: currentList }
                            },
                            families: {
                              ...prev.families,
                              groomFamily: currentList
                            }
                          };
                          if (next.config) {
                            next.config.couple = { ...(next.config.couple || {}), groom: { ...(next.config.couple?.groom || {}), family: currentList } };
                            next.config.families = { ...(next.config.families || {}), groomFamily: currentList };
                          }
                          return next;
                        });
                      }}
                      className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[9px] text-[#241E1C]/40 italic">No individual family members added. Parents line will be used.</p>
            )}
          </div>
        </div>

        {/* --- BRIDE CARD & FAMILY --- */}
        <div className="card-minimal p-4 md:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/60">Bride Information &amp; Family</h3>
            <span className="text-[10px] text-[#C49B27] font-semibold">The Bride</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <div className="flex flex-col gap-1 w-full">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Bride's Name</label>
              <input
                type="text"
                value={brideData.name || ""}
                onChange={(e) => updateInvitationData((prev: any) => {
                  const next = {
                    ...prev,
                    couple: {
                      ...prev.couple,
                      bride: { ...prev.couple?.bride, name: e.target.value }
                    }
                  };
                  if (next.config) {
                    next.config.couple = { ...(next.config.couple || {}), bride: { ...(next.config.couple?.bride || {}), name: e.target.value } };
                  }
                  return next;
                })}
                placeholder="e.g. Ananya"
                className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full font-semibold"
              />
            </div>

            {/* Bride's Family Name / Surname */}
            <div className="flex flex-col gap-1 w-full">
              <div className="flex items-center justify-between">
                <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Bride's Family Name / Surname</label>
                <span className="text-[9px] text-[#C49B27] font-semibold">Surname</span>
              </div>
              <input
                type="text"
                value={brideData.surname || ""}
                onChange={(e) => updateInvitationData((prev: any) => {
                  const next = {
                    ...prev,
                    couple: {
                      ...prev.couple,
                      bride: { ...prev.couple?.bride, surname: e.target.value }
                    }
                  };
                  if (next.config) {
                    next.config.couple = { ...(next.config.couple || {}), bride: { ...(next.config.couple?.bride || {}), surname: e.target.value } };
                  }
                  return next;
                })}
                placeholder="e.g. Patel / Kothari"
                className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full font-semibold"
              />
            </div>
          </div>

          {/* Bride's Family Card Title */}
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center justify-between">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Family Card Heading</label>
              <span className="text-[9px] text-[#C49B27] font-semibold">Custom Title</span>
            </div>
            <input
              type="text"
              value={brideData.familyTitle || invitationData.families?.brideFamilyTitle || ""}
              onChange={(e) => updateInvitationData((prev: any) => {
                const next = {
                  ...prev,
                  couple: {
                    ...prev.couple,
                    bride: { ...prev.couple?.bride, familyTitle: e.target.value }
                  },
                  families: {
                    ...prev.families,
                    brideFamilyTitle: e.target.value
                  }
                };
                if (next.config) {
                  next.config.couple = { ...(next.config.couple || {}), bride: { ...(next.config.couple?.bride || {}), familyTitle: e.target.value } };
                  next.config.families = { ...(next.config.families || {}), brideFamilyTitle: e.target.value };
                }
                return next;
              })}
              placeholder={`e.g. ${brideData.name || "Ananya"}'s Family`}
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full font-semibold"
            />
          </div>

          {/* Bride Portrait Image */}
          <div className="flex flex-col gap-1.5 border-t border-zinc-100 pt-3 w-full">
            <div className="flex items-center justify-between">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Bride's Portrait Image</label>
              <span className="text-[9px] text-[#C49B27] font-semibold">Upload Photo</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              {brideData.image && (
                <div className="w-12 h-12 rounded-full overflow-hidden border border-amber-500/30 shrink-0 bg-zinc-100 shadow-xs">
                  <img src={brideData.image} alt="Bride Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <input
                type="text"
                value={brideData.image || ""}
                onChange={(e) => updateInvitationData((prev: any) => {
                  const next = {
                    ...prev,
                    couple: {
                      ...prev.couple,
                      bride: { ...prev.couple?.bride, image: e.target.value }
                    },
                    families: {
                      ...prev.families,
                      bridePortrait: e.target.value
                    }
                  };
                  if (next.config) {
                    next.config.couple = { ...(next.config.couple || {}), bride: { ...(next.config.couple?.bride || {}), image: e.target.value } };
                    next.config.families = { ...(next.config.families || {}), bridePortrait: e.target.value };
                  }
                  return next;
                })}
                placeholder="Image URL or upload below..."
                className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] flex-1 font-mono"
              />
              <FileUploader
                onUploadSuccess={(url) => updateInvitationData((prev: any) => {
                  const next = {
                    ...prev,
                    couple: {
                      ...prev.couple,
                      bride: { ...prev.couple?.bride, image: url }
                    },
                    families: {
                      ...prev.families,
                      bridePortrait: url
                    }
                  };
                  if (next.config) {
                    next.config.couple = { ...(next.config.couple || {}), bride: { ...(next.config.couple?.bride || {}), image: url } };
                    next.config.families = { ...(next.config.families || {}), bridePortrait: url };
                  }
                  return next;
                })}
                className="w-full sm:w-auto"
              />
            </div>
          </div>

          {/* Bride's Family Details & Extra Members List */}
          <div className="border-t border-zinc-100 pt-3 space-y-3">
            <div className="flex justify-between items-center w-full">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#241E1C]/60 tracking-[1px]">Bride's Family Members</label>
                <p className="text-[9px] text-zinc-400">Add parents, siblings, grandparents, and relatives</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newMember = { relation: "Parents", name: "" };
                  updateInvitationData((prev: any) => {
                    const currentList = Array.isArray(prev.families?.brideFamily)
                      ? [...prev.families.brideFamily]
                      : Array.isArray(prev.couple?.bride?.family)
                        ? [...prev.couple.bride.family]
                        : [];
                    const updated = [...currentList, newMember];
                    const next = {
                      ...prev,
                      families: { ...prev.families, brideFamily: updated },
                      couple: { ...prev.couple, bride: { ...prev.couple?.bride, family: updated } }
                    };
                    if (next.config) {
                      next.config.families = { ...(next.config.families || {}), brideFamily: updated };
                      next.config.couple = { ...(next.config.couple || {}), bride: { ...(next.config.couple?.bride || {}), family: updated } };
                    }
                    return next;
                  });
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#C49B27] hover:bg-[#B0871B] text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.5px] transition-colors cursor-pointer shadow-xs"
              >
                <Plus size={12} /> Add Member
              </button>
            </div>

            <div className="space-y-2">
              {brideFamily.map((member: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2 bg-[#FAF9F6] p-2.5 rounded-xl border border-zinc-200/70">
                  <input
                    type="text"
                    placeholder="Relation (e.g. Mother, Sister)"
                    value={member.relation || ""}
                    onChange={(e) => {
                      updateInvitationData((prev: any) => {
                        const currentList = [...(prev.families?.brideFamily || prev.couple?.bride?.family || [])];
                        currentList[idx] = { ...currentList[idx], relation: e.target.value };
                        const next = {
                          ...prev,
                          families: { ...prev.families, brideFamily: currentList },
                          couple: { ...prev.couple, bride: { ...prev.couple?.bride, family: currentList } }
                        };
                        if (next.config) {
                          next.config.families = { ...(next.config.families || {}), brideFamily: currentList };
                          next.config.couple = { ...(next.config.couple || {}), bride: { ...(next.config.couple?.bride || {}), family: currentList } };
                        }
                        return next;
                      });
                    }}
                    className="bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-[#241E1C] outline-none w-1/3 font-medium focus:border-[#C49B27]"
                  />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={member.name || ""}
                    onChange={(e) => {
                      updateInvitationData((prev: any) => {
                        const currentList = [...(prev.families?.brideFamily || prev.couple?.bride?.family || [])];
                        currentList[idx] = { ...currentList[idx], name: e.target.value };
                        const next = {
                          ...prev,
                          families: { ...prev.families, brideFamily: currentList },
                          couple: { ...prev.couple, bride: { ...prev.couple?.bride, family: currentList } }
                        };
                        if (next.config) {
                          next.config.families = { ...(next.config.families || {}), brideFamily: currentList };
                          next.config.couple = { ...(next.config.couple || {}), bride: { ...(next.config.couple?.bride || {}), family: currentList } };
                        }
                        return next;
                      });
                    }}
                    className="bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-[#241E1C] outline-none flex-1 font-semibold focus:border-[#C49B27]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      updateInvitationData((prev: any) => {
                        const currentList = [...(prev.families?.brideFamily || prev.couple?.bride?.family || [])];
                        currentList.splice(idx, 1);
                        const next = {
                          ...prev,
                          families: { ...prev.families, brideFamily: currentList },
                          couple: { ...prev.couple, bride: { ...prev.couple?.bride, family: currentList } }
                        };
                        if (next.config) {
                          next.config.families = { ...(next.config.families || {}), brideFamily: currentList };
                          next.config.couple = { ...(next.config.couple || {}), bride: { ...(next.config.couple?.bride || {}), family: currentList } };
                        }
                        return next;
                      });
                    }}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove Member"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              {brideFamily.length === 0 && (
                <p className="text-[10px] text-zinc-400 italic text-center py-2 bg-[#FAF9F6] rounded-xl border border-dashed border-zinc-200">
                  No extra family members added yet. Click &quot;+ Add Member&quot; to add family members.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <div className="flex flex-col gap-1 w-full">
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
                placeholder="e.g. Akshintalu / Haldi / Wedding"
                className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] font-bold w-full"
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Ceremony Icon / Theme</label>
              <select
                value={
                  evt.image?.includes("akshintalu") ? "/wedding/events/akshintalu.png" :
                  evt.image?.includes("haldi") ? "/wedding/events/haldi.png" :
                  evt.image?.includes("mehendi") ? "/wedding/events/mehendi.png" :
                  evt.image?.includes("sangeeth") ? "/wedding/events/sangeeth.png" :
                  evt.image?.includes("reception") ? "/wedding/events/reception.png" :
                  evt.image?.includes("wedding") ? "/wedding/events/wedding.png" :
                  evt.image ? "custom" : "auto"
                }
                onChange={(e) => {
                  const val = e.target.value;
                  updateInvitationData((prev) => {
                    const list = [...prev.events];
                    list[index] = {
                      ...list[index],
                      image: val === "auto" ? "" : val === "custom" ? list[index].image || "" : val
                    };
                    return { ...prev, events: list };
                  });
                }}
                className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] font-medium w-full"
              >
                <option value="auto">✨ Auto Detect from Title</option>
                <option value="/wedding/events/akshintalu.png">🌾 Akshintalu / Talambralu</option>
                <option value="/wedding/events/haldi.png">💛 Haldi Ceremony</option>
                <option value="/wedding/events/mehendi.png">🌿 Mehendi Celebration</option>
                <option value="/wedding/events/sangeeth.png">🎶 Sangeeth Night</option>
                <option value="/wedding/events/wedding.png">💍 Wedding / Muhurtham</option>
                <option value="/wedding/events/reception.png">🥂 Reception</option>
              </select>
            </div>
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

  const renderStorySettings = () => {
    const storyDesc = invitationData.story?.timeline?.[0]?.description || invitationData.story?.subtitle || "";
    const storyImg = invitationData.story?.timeline?.[0]?.image || (invitationData.story as any)?.couplePhoto || "";

    return (
      <div className="space-y-6 text-left animate-fadeIn">
        <div className="flex justify-between items-center border-b border-zinc-200/50 pb-2 w-full">
          <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/60">OUR STORY</h3>
        </div>

        <div className="card-minimal p-4 md:p-5 space-y-4 w-full">
          <div className="flex flex-col gap-1 w-full">
            <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Section Heading</label>
            <input
              type="text"
              value={invitationData.story.title || ""}
              onChange={(e) => updateInvitationData((prev) => ({
                ...prev,
                story: { ...prev.story, title: e.target.value }
              }))}
              placeholder="e.g. Our Story"
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] font-semibold w-full"
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Story Description / Narrative</label>
            <textarea
              value={storyDesc}
              onChange={(e) => {
                const val = e.target.value;
                updateInvitationData((prev) => {
                  const currentTimeline = [...(prev.story?.timeline || [])];
                  if (currentTimeline.length === 0) {
                    currentTimeline.push({ date: "", title: "", description: val, image: storyImg });
                  } else {
                    currentTimeline[0] = { ...currentTimeline[0], description: val };
                  }
                  return {
                    ...prev,
                    story: {
                      ...prev.story,
                      subtitle: val,
                      timeline: currentTimeline
                    }
                  };
                });
              }}
              rows={4}
              placeholder="Two hearts, two families and one beautiful journey..."
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] resize-none w-full"
            />
          </div>

          {/* Couple Story Image */}
          <div className="flex flex-col gap-1.5 w-full border-t border-zinc-100 pt-3">
            <div className="flex items-center justify-between">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Couple Story Photo</label>
              <span className="text-[9px] text-[#C49B27] font-semibold">Upload Photo</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              {storyImg && (
                <div className="w-12 h-12 rounded-full overflow-hidden border border-amber-500/30 shrink-0 bg-zinc-100 shadow-xs">
                  <img src={storyImg} alt="Story Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <input
                type="text"
                value={storyImg}
                onChange={(e) => {
                  const val = e.target.value;
                  updateInvitationData((prev) => {
                    const currentTimeline = [...(prev.story?.timeline || [])];
                    if (currentTimeline.length === 0) {
                      currentTimeline.push({ date: "", title: "", description: storyDesc, image: val });
                    } else {
                      currentTimeline[0] = { ...currentTimeline[0], image: val };
                    }
                    return {
                      ...prev,
                      story: {
                        ...prev.story,
                        couplePhoto: val,
                        timeline: currentTimeline
                      } as any
                    };
                  });
                }}
                placeholder="Image URL or upload below..."
                className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] flex-1 font-mono"
              />
              <FileUploader
                onUploadSuccess={(url) => {
                  updateInvitationData((prev) => {
                    const currentTimeline = [...(prev.story?.timeline || [])];
                    if (currentTimeline.length === 0) {
                      currentTimeline.push({ date: "", title: "", description: storyDesc, image: url });
                    } else {
                      currentTimeline[0] = { ...currentTimeline[0], image: url };
                    }
                    return {
                      ...prev,
                      story: {
                        ...prev.story,
                        couplePhoto: url,
                        timeline: currentTimeline
                      } as any
                    };
                  });
                }}
                className="w-full sm:w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCountdownSettings = () => {
    const countdown = invitationData.countdown || { title: "", targetDate: "2026-09-20T10:15:00" };
    const currentDate = countdown.targetDate ? countdown.targetDate.split("T")[0] : "2026-09-20";
    const currentTime = countdown.targetDate && countdown.targetDate.split("T")[1]
      ? countdown.targetDate.split("T")[1].substring(0, 5)
      : "10:15";

    return (
      <div className="space-y-6 text-left animate-fadeIn">
        <div className="card-minimal p-4 md:p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-2 w-full">
            <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/50">Muhurtham Countdown Timer</h3>
            <div className="flex items-center gap-2">
              <label htmlFor="countdown-enabled" className="text-[9px] uppercase font-bold text-[#241E1C]/60 cursor-pointer">Enabled</label>
              <input
                type="checkbox"
                id="countdown-enabled"
                checked={countdown.enabled !== false}
                onChange={(e) => updateInvitationData((prev: any) => ({
                  ...prev,
                  countdown: { ...prev.countdown, enabled: e.target.checked }
                }))}
                className="w-3.5 h-3.5 rounded text-[#C49B27] accent-[#C49B27]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Section Title</label>
            <input
              type="text"
              placeholder="Counting The Moments"
              value={countdown.title || ""}
              onChange={(e) => updateInvitationData((prev: any) => ({
                ...prev,
                countdown: { ...prev.countdown, title: e.target.value }
              }))}
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="flex flex-col gap-1 w-full">
              <span className="text-[8px] uppercase font-semibold text-[#241E1C]/40">Target Date</span>
              <input
                type="date"
                value={currentDate}
                onChange={(e) => {
                  const datePart = e.target.value || "2026-09-20";
                  updateInvitationData((prev: any) => ({
                    ...prev,
                    countdown: { ...prev.countdown, targetDate: `${datePart}T${currentTime}:00` }
                  }));
                }}
                className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
              />
            </div>
            
            <div className="flex flex-col gap-1 w-full">
              <span className="text-[8px] uppercase font-semibold text-[#241E1C]/40">Target Time</span>
              <input
                type="time"
                value={currentTime}
                onChange={(e) => {
                  const timePart = e.target.value || "10:15";
                  updateInvitationData((prev: any) => ({
                    ...prev,
                    countdown: { ...prev.countdown, targetDate: `${currentDate}T${timePart}:00` }
                  }));
                }}
                className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
              />
            </div>
          </div>
          <span className="text-[8px] text-[#241E1C]/40 font-mono">Current Target: {countdown.targetDate}</span>
        </div>
      </div>
    );
  };

  const renderGallerySettings = () => {
    const gallery = invitationData.gallery || { title: "", images: [] };
    const galleryImages = gallery.images || [];

    return (
      <div className="space-y-6 text-left animate-fadeIn">
        <div className="card-minimal p-4 md:p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-2 w-full">
            <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/50">Photo Gallery</h3>
            <div className="flex items-center gap-2">
              <label htmlFor="gallery-enabled" className="text-[9px] uppercase font-bold text-[#241E1C]/60 cursor-pointer">Enabled</label>
              <input
                type="checkbox"
                id="gallery-enabled"
                checked={gallery.enabled !== false}
                onChange={(e) => updateInvitationData((prev: any) => ({
                  ...prev,
                  gallery: { ...prev.gallery, enabled: e.target.checked }
                }))}
                className="w-3.5 h-3.5 rounded text-[#C49B27] accent-[#C49B27]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Gallery Section Title</label>
            <input
              type="text"
              placeholder="Our Memories"
              value={gallery.title || ""}
              onChange={(e) => updateInvitationData((prev: any) => ({
                ...prev,
                gallery: { ...prev.gallery, title: e.target.value }
              }))}
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
            />
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-0.5">
                <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Uploaded Photos</label>
                <span className="text-[9px] text-[#241E1C]/45 font-medium italic">Hold &amp; drag to rearrange</span>
              </div>
              <FileUploader
                onUploadSuccess={(url) => {
                  updateInvitationData((prev: any) => ({
                    ...prev,
                    gallery: {
                      ...prev.gallery,
                      images: [...(prev.gallery?.images || []), url]
                    }
                  }));
                }}
                label="Add Photo"
              />
            </div>

            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 border border-zinc-100 rounded-xl p-3 bg-[#FAF9F6]">
                {galleryImages.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    draggable={true}
                    onDragStart={(e) => {
                      setDraggedGalleryIdx(idx);
                      e.dataTransfer.effectAllowed = "move";
                      e.dataTransfer.setData("text/plain", idx.toString());
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                      if (dragOverGalleryIdx !== idx) {
                        setDragOverGalleryIdx(idx);
                      }
                    }}
                    onDragEnd={() => {
                      setDraggedGalleryIdx(null);
                      setDragOverGalleryIdx(null);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedGalleryIdx !== null && draggedGalleryIdx !== idx) {
                        updateInvitationData((prev: any) => {
                          const newImgs = [...(prev.gallery?.images || [])];
                          const [moved] = newImgs.splice(draggedGalleryIdx, 1);
                          newImgs.splice(idx, 0, moved);
                          return {
                            ...prev,
                            gallery: { ...prev.gallery, images: newImgs }
                          };
                        });
                      }
                      setDraggedGalleryIdx(null);
                      setDragOverGalleryIdx(null);
                    }}
                    className={`relative aspect-square rounded-xl overflow-hidden border transition-all duration-200 cursor-grab active:cursor-grabbing group bg-white shadow-xs select-none ${
                      draggedGalleryIdx === idx
                        ? "opacity-35 scale-95 border-dashed border-[#C49B27]"
                        : dragOverGalleryIdx === idx
                        ? "scale-105 border-[#C49B27] ring-2 ring-[#C49B27] shadow-md z-20"
                        : "border-zinc-200/80 hover:border-[#C49B27]/60"
                    }`}
                  >
                    <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover pointer-events-none" />

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateInvitationData((prev: any) => {
                          const nextList = (prev.gallery?.images || []).filter((_: any, i: number) => i !== idx);
                          return {
                            ...prev,
                            gallery: { ...prev.gallery, images: nextList }
                          };
                        });
                      }}
                      className="absolute top-1.5 right-1.5 p-1 bg-red-600/90 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer z-10"
                      title="Remove image"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[9px] text-[#241E1C]/40 uppercase tracking-[0.5px] font-semibold italic text-center py-4 bg-[#FAF9F6] border border-zinc-200/50 rounded-xl">No gallery images uploaded.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderFamiliesSettings = () => {
    const families = invitationData.families || { title: "", groomFamily: [], brideFamily: [] };
    const groomFamily = families.groomFamily || [];
    const brideFamily = families.brideFamily || [];

    return (
      <div className="space-y-6 text-left animate-fadeIn">
        <div className="card-minimal p-4 md:p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-2 w-full">
            <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/50">Our Families</h3>
            <div className="flex items-center gap-2">
              <label htmlFor="families-enabled" className="text-[9px] uppercase font-bold text-[#241E1C]/60 cursor-pointer">Enabled</label>
              <input
                type="checkbox"
                id="families-enabled"
                checked={families.enabled !== false}
                onChange={(e) => updateInvitationData((prev: any) => ({
                  ...prev,
                  families: { ...prev.families, enabled: e.target.checked }
                }))}
                className="w-3.5 h-3.5 rounded text-[#C49B27] accent-[#C49B27]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Section Title</label>
            <input
              type="text"
              placeholder="Our Families"
              value={families.title || ""}
              onChange={(e) => updateInvitationData((prev: any) => ({
                ...prev,
                families: { ...prev.families, title: e.target.value }
              }))}
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
            />
          </div>
        </div>

        {/* Groom Family */}
        <div className="card-minimal p-4 md:p-5 space-y-3">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-2 w-full">
            <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/50">Groom&apos;s Family</h3>
            <button
              type="button"
              onClick={() => {
                updateInvitationData((prev: any) => ({
                  ...prev,
                  families: {
                    ...prev.families,
                    groomFamily: [...(prev.families?.groomFamily || []), { relation: "Parents", name: "Mr. & Mrs. Groom Family" }]
                  }
                }));
              }}
              className="flex items-center gap-1 px-2.5 py-1 border border-zinc-200 hover:border-[#C49B27]/40 rounded-xl text-[8px] font-bold uppercase tracking-[1px] bg-white transition-colors cursor-pointer"
            >
              <Plus size={10} /> Add Member
            </button>
          </div>

          {groomFamily.map((member: any, idx: number) => (
            <div key={idx} className="flex items-center gap-2 bg-[#FAF9F6] p-2.5 rounded-xl border border-zinc-200/60">
              <input
                type="text"
                placeholder="Relation"
                value={member.relation || ""}
                onChange={(e) => {
                  updateInvitationData((prev: any) => {
                    const list = [...(prev.families?.groomFamily || [])];
                    list[idx] = { ...list[idx], relation: e.target.value };
                    return { ...prev, families: { ...prev.families, groomFamily: list } };
                  });
                }}
                className="bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-[#241E1C] outline-none w-1/3"
              />
              <input
                type="text"
                placeholder="Names"
                value={member.name || ""}
                onChange={(e) => {
                  updateInvitationData((prev: any) => {
                    const list = [...(prev.families?.groomFamily || [])];
                    list[idx] = { ...list[idx], name: e.target.value };
                    return { ...prev, families: { ...prev.families, groomFamily: list } };
                  });
                }}
                className="bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-[#241E1C] outline-none flex-1"
              />
              <button
                type="button"
                onClick={() => {
                  updateInvitationData((prev: any) => {
                    const list = (prev.families?.groomFamily || []).filter((_: any, i: number) => i !== idx);
                    return { ...prev, families: { ...prev.families, groomFamily: list } };
                  });
                }}
                className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>

        {/* Bride Family */}
        <div className="card-minimal p-4 md:p-5 space-y-3">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-2 w-full">
            <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/50">Bride&apos;s Family</h3>
            <button
              type="button"
              onClick={() => {
                updateInvitationData((prev: any) => ({
                  ...prev,
                  families: {
                    ...prev.families,
                    brideFamily: [...(prev.families?.brideFamily || []), { relation: "Parents", name: "Mr. & Mrs. Bride Family" }]
                  }
                }));
              }}
              className="flex items-center gap-1 px-2.5 py-1 border border-zinc-200 hover:border-[#C49B27]/40 rounded-xl text-[8px] font-bold uppercase tracking-[1px] bg-white transition-colors cursor-pointer"
            >
              <Plus size={10} /> Add Member
            </button>
          </div>

          {brideFamily.map((member: any, idx: number) => (
            <div key={idx} className="flex items-center gap-2 bg-[#FAF9F6] p-2.5 rounded-xl border border-zinc-200/60">
              <input
                type="text"
                placeholder="Relation"
                value={member.relation || ""}
                onChange={(e) => {
                  updateInvitationData((prev: any) => {
                    const list = [...(prev.families?.brideFamily || [])];
                    list[idx] = { ...list[idx], relation: e.target.value };
                    return { ...prev, families: { ...prev.families, brideFamily: list } };
                  });
                }}
                className="bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-[#241E1C] outline-none w-1/3"
              />
              <input
                type="text"
                placeholder="Names"
                value={member.name || ""}
                onChange={(e) => {
                  updateInvitationData((prev: any) => {
                    const list = [...(prev.families?.brideFamily || [])];
                    list[idx] = { ...list[idx], name: e.target.value };
                    return { ...prev, families: { ...prev.families, brideFamily: list } };
                  });
                }}
                className="bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-[#241E1C] outline-none flex-1"
              />
              <button
                type="button"
                onClick={() => {
                  updateInvitationData((prev: any) => {
                    const list = (prev.families?.brideFamily || []).filter((_: any, i: number) => i !== idx);
                    return { ...prev, families: { ...prev.families, brideFamily: list } };
                  });
                }}
                className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderVenuesSettings = () => {
    const venues = invitationData.venue?.venues || [];
    const mainVenue = venues[0] || {
      venueName: typeof invitationData.venue === "string" ? invitationData.venue : "",
      city: "",
      address: "",
      mapsUrl: "",
      embedUrl: ""
    };

    const receptionVenue = venues[1] || {
      id: "venue-2",
      title: "Reception Venue",
      venueName: "",
      city: "",
      address: "",
      date: "",
      time: "",
      mapsUrl: "",
      embedUrl: "",
      enabled: false
    };

    const updateMainVenue = (field: string, val: any) => {
      updateInvitationData((prev: any) => {
        const list = [...(prev.venue?.venues || [])];
        if (list.length === 0) {
          list.push({
            id: "venue-1",
            title: "The Wedding Venue",
            venueName: "",
            city: "",
            address: "",
            mapsUrl: "",
            embedUrl: ""
          });
        }
        list[0] = { ...list[0], [field]: val };
        return {
          ...prev,
          venue: {
            ...prev.venue,
            enabled: prev.venue?.enabled ?? true,
            venues: list
          }
        };
      });
    };

    const updateReceptionVenue = (field: string, val: any) => {
      updateInvitationData((prev: any) => {
        const list = [...(prev.venue?.venues || [])];
        if (list.length === 0) {
          list.push({
            id: "venue-1",
            title: "The Wedding Venue",
            venueName: "",
            city: "",
            address: "",
            mapsUrl: "",
            embedUrl: ""
          });
        }
        if (list.length === 1) {
          list.push({
            id: "venue-2",
            title: "Reception Venue",
            venueName: "",
            city: "",
            address: "",
            date: "",
            time: "",
            mapsUrl: "",
            embedUrl: "",
            enabled: true
          });
        }
        list[1] = { ...list[1], [field]: val };
        return {
          ...prev,
          venue: {
            ...prev.venue,
            enabled: prev.venue?.enabled ?? true,
            venues: list
          }
        };
      });
    };

    return (
      <div className="space-y-6 text-left animate-fadeIn">
        {/* --- 1. WEDDING VENUE --- */}
        <div className="card-minimal p-4 md:p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-2 w-full">
            <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/50">The Wedding Venue Location</h3>
            <div className="flex items-center gap-2">
              <label htmlFor="venue-enabled" className="text-[9px] uppercase font-bold text-[#241E1C]/60 cursor-pointer">Enabled</label>
              <input
                type="checkbox"
                id="venue-enabled"
                checked={invitationData.venue?.enabled !== false}
                onChange={(e) => updateInvitationData((prev: any) => ({
                  ...prev,
                  venue: { ...prev.venue, enabled: e.target.checked }
                }))}
                className="w-3.5 h-3.5 rounded text-[#C49B27] accent-[#C49B27]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Venue Name</label>
            <input
              type="text"
              placeholder="e.g. The Leela Palace"
              value={mainVenue.venueName || ""}
              onChange={(e) => updateMainVenue("venueName", e.target.value)}
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <div className="flex flex-col gap-1 w-full">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">City</label>
              <input
                type="text"
                placeholder="e.g. Hyderabad"
                value={mainVenue.city || ""}
                onChange={(e) => updateMainVenue("city", e.target.value)}
                className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Address</label>
              <input
                type="text"
                placeholder="e.g. Old Airport Road, Kodihalli"
                value={mainVenue.address || ""}
                onChange={(e) => updateMainVenue("address", e.target.value)}
                className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Google Maps Directions Link</label>
            <input
              type="text"
              placeholder="https://maps.google.com/?q=..."
              value={mainVenue.mapsUrl || ""}
              onChange={(e) => updateMainVenue("mapsUrl", e.target.value)}
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full font-mono text-[11px]"
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Google Maps Embed Iframe URL (Optional)</label>
            <input
              type="text"
              placeholder="https://www.google.com/maps/embed?pb=..."
              value={mainVenue.embedUrl || ""}
              onChange={(e) => updateMainVenue("embedUrl", e.target.value)}
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full font-mono text-[11px]"
            />
          </div>
        </div>

        {/* --- 2. RECEPTION VENUE --- */}
        <div className="card-minimal p-4 md:p-5 space-y-4 border-t-2 border-[#C49B27]/30">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-2 w-full">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#C49B27]">Reception Venue Location</h3>
              <span className="text-[9px] text-zinc-400 font-medium">(Appears below wedding venue)</span>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="reception-venue-enabled" className="text-[9px] uppercase font-bold text-[#241E1C]/60 cursor-pointer">Enable Reception</label>
              <input
                type="checkbox"
                id="reception-venue-enabled"
                checked={receptionVenue.enabled !== false && Boolean(receptionVenue.venueName || receptionVenue.enabled === true)}
                onChange={(e) => updateReceptionVenue("enabled", e.target.checked)}
                className="w-3.5 h-3.5 rounded text-[#C49B27] accent-[#C49B27]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <div className="flex flex-col gap-1 w-full">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Section Title</label>
              <input
                type="text"
                placeholder="Reception Venue"
                value={receptionVenue.title || "Reception Venue"}
                onChange={(e) => updateReceptionVenue("title", e.target.value)}
                className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full font-semibold"
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Reception Venue Name</label>
              <input
                type="text"
                placeholder="e.g. Grand Ballroom, The Leela Palace"
                value={receptionVenue.venueName || ""}
                onChange={(e) => {
                  updateReceptionVenue("venueName", e.target.value);
                  if (receptionVenue.enabled === undefined) {
                    updateReceptionVenue("enabled", true);
                  }
                }}
                className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <div className="flex flex-col gap-1 w-full">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">City</label>
              <input
                type="text"
                placeholder="e.g. Hyderabad"
                value={receptionVenue.city || ""}
                onChange={(e) => updateReceptionVenue("city", e.target.value)}
                className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Address</label>
              <input
                type="text"
                placeholder="e.g. Old Airport Road, Kodihalli"
                value={receptionVenue.address || ""}
                onChange={(e) => updateReceptionVenue("address", e.target.value)}
                className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <div className="flex flex-col gap-1 w-full">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Reception Date (Optional)</label>
              <input
                type="text"
                placeholder="e.g. 20 September 2026"
                value={receptionVenue.date || ""}
                onChange={(e) => updateReceptionVenue("date", e.target.value)}
                className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Reception Time (Optional)</label>
              <input
                type="text"
                placeholder="e.g. 7:00 PM Onwards"
                value={receptionVenue.time || ""}
                onChange={(e) => updateReceptionVenue("time", e.target.value)}
                className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Google Maps Directions Link</label>
            <input
              type="text"
              placeholder="https://maps.google.com/?q=..."
              value={receptionVenue.mapsUrl || ""}
              onChange={(e) => updateReceptionVenue("mapsUrl", e.target.value)}
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full font-mono text-[11px]"
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Google Maps Embed Iframe URL (Optional)</label>
            <input
              type="text"
              placeholder="https://www.google.com/maps/embed?pb=..."
              value={receptionVenue.embedUrl || ""}
              onChange={(e) => updateReceptionVenue("embedUrl", e.target.value)}
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full font-mono text-[11px]"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderRsvpSettings = () => {
    const rsvp = invitationData.rsvp || { title: "", subtitle: "", contacts: [] };
    const contacts = rsvp.contacts || [];

    return (
      <div className="space-y-6 text-left animate-fadeIn">
        <div className="card-minimal p-4 md:p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-2 w-full">
            <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/50">RSVP Configuration</h3>
            <div className="flex items-center gap-2">
              <label htmlFor="rsvp-enabled" className="text-[9px] uppercase font-bold text-[#241E1C]/60 cursor-pointer">Enabled</label>
              <input
                type="checkbox"
                id="rsvp-enabled"
                checked={rsvp.enabled !== false}
                onChange={(e) => updateInvitationData((prev: any) => ({
                  ...prev,
                  rsvp: { ...prev.rsvp, enabled: e.target.checked }
                }))}
                className="w-3.5 h-3.5 rounded text-[#C49B27] accent-[#C49B27]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">RSVP Section Title</label>
            <input
              type="text"
              placeholder="We Would Love To Celebrate With You"
              value={rsvp.title || ""}
              onChange={(e) => updateInvitationData((prev: any) => ({
                ...prev,
                rsvp: { ...prev.rsvp, title: e.target.value }
              }))}
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">RSVP Subtitle / Message</label>
            <textarea
              rows={2}
              placeholder="Your presence and blessings will make our celebration even more special."
              value={rsvp.subtitle || ""}
              onChange={(e) => updateInvitationData((prev: any) => ({
                ...prev,
                rsvp: { ...prev.rsvp, subtitle: e.target.value }
              }))}
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full resize-none"
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Submit Button Label</label>
            <input
              type="text"
              placeholder="RSVP"
              value={invitationData.hero?.ctaText || ""}
              onChange={(e) => updateInvitationData((prev: any) => ({
                ...prev,
                hero: { ...prev.hero, ctaText: e.target.value }
              }))}
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
            />
          </div>
        </div>

        {/* RSVP Contacts List */}
        <div className="card-minimal p-4 md:p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-2 w-full">
            <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/50">RSVP Contacts</h3>
            <button
              type="button"
              onClick={() => {
                const newContact: RSVPContact = { type: "phone", label: "Coordinator", value: "+91 9866767100" };
                updateInvitationData((prev: any) => ({
                  ...prev,
                  rsvp: {
                    ...prev.rsvp,
                    contacts: [...(prev.rsvp?.contacts || []), newContact]
                  }
                }));
              }}
              className="flex items-center gap-1 px-3 py-1.5 border border-zinc-200 hover:border-[#C49B27]/40 rounded-xl text-[8px] font-bold uppercase tracking-[1px] bg-white transition-colors shadow-xs cursor-pointer"
            >
              <Plus size={10} /> Add Contact
            </button>
          </div>

          {contacts.map((contact: any, index: number) => (
            <div key={index} className="bg-[#FAF9F6] border border-zinc-200/60 p-3.5 rounded-xl relative space-y-2 group w-full">
              <button
                type="button"
                onClick={() => {
                  updateInvitationData((prev: any) => {
                    const list = [...(prev.rsvp?.contacts || [])];
                    list.splice(index, 1);
                    return { ...prev, rsvp: { ...prev.rsvp, contacts: list } };
                  });
                }}
                className="absolute top-3 right-3 p-1.5 bg-red-500/5 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
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
                      updateInvitationData((prev: any) => {
                        const list = [...(prev.rsvp?.contacts || [])];
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
                    value={contact.label || ""}
                    onChange={(e) => {
                      updateInvitationData((prev: any) => {
                        const list = [...(prev.rsvp?.contacts || [])];
                        list[index] = { ...list[index], label: e.target.value };
                        return { ...prev, rsvp: { ...prev.rsvp, contacts: list } };
                      });
                    }}
                    className="bg-white border border-zinc-200 rounded-xl px-3 py-1.5 text-xs text-[#241E1C] outline-none w-full"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1 w-full">
                <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Phone / Number / Link</label>
                <input
                  type="text"
                  value={contact.value || ""}
                  onChange={(e) => {
                    updateInvitationData((prev: any) => {
                      const list = [...(prev.rsvp?.contacts || [])];
                      list[index] = { ...list[index], value: e.target.value };
                      return { ...prev, rsvp: { ...prev.rsvp, contacts: list } };
                    });
                  }}
                  className="bg-white border border-zinc-200 rounded-xl px-3 py-1.5 text-xs text-[#241E1C] outline-none font-mono w-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFooterSettings = () => {
    const footer = invitationData.footer || {
      salutation: "",
      designer: "",
      creditText: "",
      location: "",
      contact: ""
    };

    return (
      <div className="space-y-6 text-left animate-fadeIn">
        <div className="card-minimal p-4 md:p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-2 w-full">
            <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/50">Footer & Credits</h3>
            <div className="flex items-center gap-2">
              <label htmlFor="footer-enabled" className="text-[9px] uppercase font-bold text-[#241E1C]/60 cursor-pointer">Enabled</label>
              <input
                type="checkbox"
                id="footer-enabled"
                checked={footer.enabled !== false}
                onChange={(e) => updateInvitationData((prev: any) => ({
                  ...prev,
                  footer: { ...prev.footer, enabled: e.target.checked }
                }))}
                className="w-3.5 h-3.5 rounded text-[#C49B27] accent-[#C49B27]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Closing Quote / Salutation</label>
            <textarea
              rows={2}
              placeholder="A beautiful beginning starts with a beautiful invitation."
              value={footer.salutation || ""}
              onChange={(e) => updateInvitationData((prev: any) => ({
                ...prev,
                footer: { ...prev.footer, salutation: e.target.value }
              }))}
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <div className="flex flex-col gap-1 w-full">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Designer Brand Name</label>
              <input
                type="text"
                placeholder="Ahvaanam"
                value={footer.designer || footer.title || ""}
                onChange={(e) => updateInvitationData((prev: any) => ({
                  ...prev,
                  footer: { ...prev.footer, designer: e.target.value, title: e.target.value }
                }))}
                className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Service Subtitle</label>
              <input
                type="text"
                placeholder="Digital Wedding Invitations & Card Services"
                value={footer.creditText || ""}
                onChange={(e) => updateInvitationData((prev: any) => ({
                  ...prev,
                  footer: { ...prev.footer, creditText: e.target.value }
                }))}
                className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Location / Address</label>
            <input
              type="text"
              placeholder="Tirumala Printers, Metpally, Dist. Jagtial, Telangana"
              value={footer.location || ""}
              onChange={(e) => updateInvitationData((prev: any) => ({
                ...prev,
                footer: { ...prev.footer, location: e.target.value }
              }))}
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full"
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1px]">Contact Phone / WhatsApp</label>
            <input
              type="text"
              placeholder="+91 9866767100"
              value={footer.contact || ""}
              onChange={(e) => updateInvitationData((prev: any) => ({
                ...prev,
                footer: { ...prev.footer, contact: e.target.value }
              }))}
              className="bg-[#FAF9F6] border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#241E1C] outline-none focus:border-[#C49B27] w-full font-mono text-[11px]"
            />
          </div>
        </div>
      </div>
    );
  };

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
          <img src="/images/logo.png" alt="Ahvaanam" className="h-8 md:h-9 w-auto object-contain translate-y-0 drop-shadow-sm" />
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <a
            href="/dashboard"
            className="flex items-center gap-1 px-3 py-1.5 md:px-4 md:py-2 border border-zinc-200 rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-[1px] hover:bg-zinc-50 transition-all text-[#241E1C]/80 shadow-xs"
          >
            <ArrowLeft size={11} /> <span className="hidden md:inline">Dashboard</span>
          </a>
          <a
            href={`/dashboard/analytics/${clientId}`}
            className="flex items-center gap-1 px-3 py-1.5 md:px-4 md:py-2 border border-zinc-200 hover:border-[#C49B27]/40 rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-[1px] hover:bg-zinc-50 transition-all text-[#241E1C]/80 shadow-xs"
          >
            <BarChart2 size={11} className="text-[#C49B27]" /> <span className="hidden md:inline">Analytics</span>
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
