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

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      onUploadSuccess(data.url);
    } catch (err: any) {
      setError("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
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
        className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg px-4 py-2 text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
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

function AdminPortalContent({ clientId }: { clientId: string }) {
  const { invitationData, loading, updateInvitationData, saveConfig } = useInvitationData();
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
        {/* --- INVITATION SIDE & PRIMARY ORDER SWITCHER --- */}
        <div className="bg-white/5 border border-yellow-500/20 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase font-bold text-yellow-500 tracking-[1.5px]">
              Invitation Side &amp; Primary Order
            </label>
            <span className="text-[10px] text-white/50 font-semibold">Whose Name &amp; Family Appears First</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                updateInvitationData((prev: any) => ({
                  ...prev,
                  couple: { ...prev.couple, primarySide: "groom" },
                  config: prev.config ? { ...prev.config, couple: { ...prev.config?.couple, primarySide: "groom" } } : undefined
                }));
              }}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                !isBride
                  ? "bg-yellow-500 text-black shadow-md font-extrabold"
                  : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
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
              className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isBride
                  ? "bg-yellow-500 text-black shadow-md font-extrabold"
                  : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
              }`}
            >
              👰 Bride First (Bride's Side)
            </button>
          </div>
          <p className="text-[10px] text-white/50">
            {!isBride 
              ? "Groom's name and family will appear first in the hero header, couple section, family greetings card, and wedding story."
              : "Bride's name and family will appear first in the hero header, couple section, family greetings card, and wedding story."}
          </p>
        </div>

        {/* --- GROOM CARD & FAMILY --- */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-base font-bold tracking-[0.5px]">Groom Information &amp; Family</h3>
            <span className="text-xs text-yellow-500 font-bold">The Groom</span>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1.5px]">Groom's Name</label>
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
                className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-yellow-500 outline-none font-bold"
              />
            </div>

            {/* Groom Portrait Image */}
            <div className="flex flex-col gap-1.5 col-span-2 border-t border-white/5 pt-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1.5px]">Groom's Portrait Image</label>
                <span className="text-[10px] text-yellow-500 font-semibold">Upload Photo</span>
              </div>
              <div className="flex items-center gap-3">
                {groomData.image && (
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-yellow-500/40 shrink-0 bg-black/40 shadow-sm">
                    <img src={groomData.image} alt="Groom Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <input
                  type="text"
                  value={groomData.image || ""}
                  placeholder="Image URL or upload below"
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
                  className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-yellow-500 outline-none flex-1 font-mono text-[10px]"
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
                />
              </div>
            </div>
          </div>

          {/* Groom's Family Details & Extra Members List */}
          <div className="border-t border-white/10 pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <label className="text-xs font-bold text-white tracking-[0.5px]">Groom's Family Members</label>
                <p className="text-[10px] text-white/40">Add parents, siblings, grandparents, and relatives</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newMember = { relation: "Parents", name: "" };
                  updateInvitationData((prev: any) => {
                    const currentList = Array.isArray(prev.families?.groomFamily)
                      ? [...prev.families.groomFamily]
                      : Array.isArray(prev.couple?.groom?.family)
                        ? [...prev.couple.groom.family]
                        : [];
                    const updated = [...currentList, newMember];
                    const next = {
                      ...prev,
                      families: { ...prev.families, groomFamily: updated },
                      couple: { ...prev.couple, groom: { ...prev.couple?.groom, family: updated } }
                    };
                    if (next.config) {
                      next.config.families = { ...(next.config.families || {}), groomFamily: updated };
                      next.config.couple = { ...(next.config.couple || {}), groom: { ...(next.config.couple?.groom || {}), family: updated } };
                    }
                    return next;
                  });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                <Plus size={14} /> Add Member
              </button>
            </div>

            <div className="space-y-2">
              {groomFamily.map((member: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2 bg-black/20 p-2.5 rounded-xl border border-white/5">
                  <input
                    type="text"
                    placeholder="Relation (e.g. Grandfather, Brother)"
                    value={member.relation || ""}
                    onChange={(e) => {
                      updateInvitationData((prev: any) => {
                        const currentList = [...(prev.families?.groomFamily || prev.couple?.groom?.family || [])];
                        currentList[idx] = { ...currentList[idx], relation: e.target.value };
                        const next = {
                          ...prev,
                          families: { ...prev.families, groomFamily: currentList },
                          couple: { ...prev.couple, groom: { ...prev.couple?.groom, family: currentList } }
                        };
                        if (next.config) {
                          next.config.families = { ...(next.config.families || {}), groomFamily: currentList };
                          next.config.couple = { ...(next.config.couple || {}), groom: { ...(next.config.couple?.groom || {}), family: currentList } };
                        }
                        return next;
                      });
                    }}
                    className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none w-1/3 font-medium focus:border-yellow-500"
                  />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={member.name || ""}
                    onChange={(e) => {
                      updateInvitationData((prev: any) => {
                        const currentList = [...(prev.families?.groomFamily || prev.couple?.groom?.family || [])];
                        currentList[idx] = { ...currentList[idx], name: e.target.value };
                        const next = {
                          ...prev,
                          families: { ...prev.families, groomFamily: currentList },
                          couple: { ...prev.couple, groom: { ...prev.couple?.groom, family: currentList } }
                        };
                        if (next.config) {
                          next.config.families = { ...(next.config.families || {}), groomFamily: currentList };
                          next.config.couple = { ...(next.config.couple || {}), groom: { ...(next.config.couple?.groom || {}), family: currentList } };
                        }
                        return next;
                      });
                    }}
                    className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none flex-1 font-semibold focus:border-yellow-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      updateInvitationData((prev: any) => {
                        const currentList = [...(prev.families?.groomFamily || prev.couple?.groom?.family || [])];
                        currentList.splice(idx, 1);
                        const next = {
                          ...prev,
                          families: { ...prev.families, groomFamily: currentList },
                          couple: { ...prev.couple, groom: { ...prev.couple?.groom, family: currentList } }
                        };
                        if (next.config) {
                          next.config.families = { ...(next.config.families || {}), groomFamily: currentList };
                          next.config.couple = { ...(next.config.couple || {}), groom: { ...(next.config.couple?.groom || {}), family: currentList } };
                        }
                        return next;
                      });
                    }}
                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Remove Member"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              {groomFamily.length === 0 && (
                <p className="text-xs text-white/40 italic text-center py-2.5 bg-black/10 rounded-xl border border-dashed border-white/10">
                  No extra family members added yet. Click &quot;+ Add Member&quot; to add family members.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* --- BRIDE CARD & FAMILY --- */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-base font-bold tracking-[0.5px]">Bride Information &amp; Family</h3>
            <span className="text-xs text-yellow-500 font-bold">The Bride</span>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1.5px]">Bride's Name</label>
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
                className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-yellow-500 outline-none font-bold"
              />
            </div>

            {/* Bride Portrait Image */}
            <div className="flex flex-col gap-1.5 col-span-2 border-t border-white/5 pt-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1.5px]">Bride's Portrait Image</label>
                <span className="text-[10px] text-yellow-500 font-semibold">Upload Photo</span>
              </div>
              <div className="flex items-center gap-3">
                {brideData.image && (
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-yellow-500/40 shrink-0 bg-black/40 shadow-sm">
                    <img src={brideData.image} alt="Bride Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <input
                  type="text"
                  value={brideData.image || ""}
                  placeholder="Image URL or upload below"
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
                  className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-yellow-500 outline-none flex-1 font-mono text-[10px]"
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
                />
              </div>
            </div>
          </div>

          {/* Bride's Family Details & Extra Members List */}
          <div className="border-t border-white/10 pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <label className="text-xs font-bold text-white tracking-[0.5px]">Bride's Family Members</label>
                <p className="text-[10px] text-white/40">Add parents, siblings, grandparents, and relatives</p>
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
                className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                <Plus size={14} /> Add Member
              </button>
            </div>

            <div className="space-y-2">
              {brideFamily.map((member: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2 bg-black/20 p-2.5 rounded-xl border border-white/5">
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
                    className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none w-1/3 font-medium focus:border-yellow-500"
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
                    className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none flex-1 font-semibold focus:border-yellow-500"
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
                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Remove Member"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              {brideFamily.length === 0 && (
                <p className="text-xs text-white/40 italic text-center py-2.5 bg-black/10 rounded-xl border border-dashed border-white/10">
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
            <h3 className="text-base font-bold tracking-[0.5px]">OUR STORY</h3>
          </div>
          <button
            type="button"
            onClick={() => updateInvitationData((prev) => {
              const newMilestone: StoryTimelineEntry = {
                title: "New Story Node",
                date: "",
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
            className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-4 py-2 rounded-xl text-xs font-bold hover:bg-yellow-500 hover:text-black transition-all cursor-pointer"
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
                className="absolute top-4 right-4 text-red-400/60 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                title="Delete Milestone"
              >
                <Trash2 size={15} />
              </button>

              <div className="flex flex-col gap-1.5 pr-8">
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
                  className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none font-bold w-full"
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
          ))}
        </div>
      </div>
    </div>
  );

  const renderCountdownSettings = () => {
    const countdown = invitationData.countdown || { title: "", targetDate: "2026-09-20T10:15:00" };
    const currentDate = countdown.targetDate ? countdown.targetDate.split("T")[0] : "2026-09-20";
    const currentTime = countdown.targetDate && countdown.targetDate.split("T")[1]
      ? countdown.targetDate.split("T")[1].substring(0, 5)
      : "10:15";

    return (
      <div className="space-y-8 animate-fadeIn">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="text-base font-bold tracking-[0.5px]">Muhurtham Countdown Timer</h3>
            <div className="flex items-center gap-2">
              <label htmlFor="client-countdown-enabled" className="text-xs text-white/70 font-semibold cursor-pointer">Enabled</label>
              <input
                type="checkbox"
                id="client-countdown-enabled"
                checked={countdown.enabled !== false}
                onChange={(e) => updateInvitationData((prev: any) => ({
                  ...prev,
                  countdown: { ...prev.countdown, enabled: e.target.checked }
                }))}
                className="w-4 h-4 rounded text-yellow-500 accent-yellow-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Section Title</label>
            <input
              type="text"
              placeholder="Counting The Moments"
              value={countdown.title || ""}
              onChange={(e) => updateInvitationData((prev: any) => ({
                ...prev,
                countdown: { ...prev.countdown, title: e.target.value }
              }))}
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Target Date</span>
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
                className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Target Time</span>
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
                className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none"
              />
            </div>
          </div>
          <span className="text-[10px] text-white/40 font-mono">Current Target: {countdown.targetDate}</span>
        </div>
      </div>
    );
  };

  const renderGallerySettings = () => {
    const gallery = invitationData.gallery || { title: "", images: [] };
    const galleryImages = gallery.images || [];

    return (
      <div className="space-y-8 animate-fadeIn">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="text-base font-bold tracking-[0.5px]">Photo Gallery</h3>
            <div className="flex items-center gap-2">
              <label htmlFor="client-gallery-enabled" className="text-xs text-white/70 font-semibold cursor-pointer">Enabled</label>
              <input
                type="checkbox"
                id="client-gallery-enabled"
                checked={gallery.enabled !== false}
                onChange={(e) => updateInvitationData((prev: any) => ({
                  ...prev,
                  gallery: { ...prev.gallery, enabled: e.target.checked }
                }))}
                className="w-4 h-4 rounded text-yellow-500 accent-yellow-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Gallery Section Title</label>
            <input
              type="text"
              placeholder="Our Memories"
              value={gallery.title || ""}
              onChange={(e) => updateInvitationData((prev: any) => ({
                ...prev,
                gallery: { ...prev.gallery, title: e.target.value }
              }))}
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Uploaded Photos</label>
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
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 border border-white/10 rounded-xl p-4 bg-black/20">
                {galleryImages.map((img: string, idx: number) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group bg-black/40">
                    <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        updateInvitationData((prev: any) => {
                          const nextList = (prev.gallery?.images || []).filter((_: any, i: number) => i !== idx);
                          return {
                            ...prev,
                            gallery: { ...prev.gallery, images: nextList }
                          };
                        });
                      }}
                      className="absolute top-1.5 right-1.5 p-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-white/40 italic text-center py-6 bg-black/20 border border-white/10 rounded-xl">No gallery images uploaded yet.</p>
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
      <div className="space-y-8 animate-fadeIn">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="text-base font-bold tracking-[0.5px]">Our Families</h3>
            <div className="flex items-center gap-2">
              <label htmlFor="client-families-enabled" className="text-xs text-white/70 font-semibold cursor-pointer">Enabled</label>
              <input
                type="checkbox"
                id="client-families-enabled"
                checked={families.enabled !== false}
                onChange={(e) => updateInvitationData((prev: any) => ({
                  ...prev,
                  families: { ...prev.families, enabled: e.target.checked }
                }))}
                className="w-4 h-4 rounded text-yellow-500 accent-yellow-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Section Title</label>
            <input
              type="text"
              placeholder="Our Families"
              value={families.title || ""}
              onChange={(e) => updateInvitationData((prev: any) => ({
                ...prev,
                families: { ...prev.families, title: e.target.value }
              }))}
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none"
            />
          </div>
        </div>

        {/* Groom Family */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="text-base font-bold tracking-[0.5px]">Groom&apos;s Family</h3>
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
              className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-yellow-500 hover:text-black transition-all cursor-pointer"
            >
              <Plus size={12} /> Add Member
            </button>
          </div>

          {groomFamily.map((member: any, idx: number) => (
            <div key={idx} className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
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
                className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none w-1/3"
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
                className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none flex-1"
              />
              <button
                type="button"
                onClick={() => {
                  updateInvitationData((prev: any) => {
                    const list = (prev.families?.groomFamily || []).filter((_: any, i: number) => i !== idx);
                    return { ...prev, families: { ...prev.families, groomFamily: list } };
                  });
                }}
                className="text-red-400 hover:text-red-300 p-1.5 cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Bride Family */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="text-base font-bold tracking-[0.5px]">Bride&apos;s Family</h3>
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
              className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-yellow-500 hover:text-black transition-all cursor-pointer"
            >
              <Plus size={12} /> Add Member
            </button>
          </div>

          {brideFamily.map((member: any, idx: number) => (
            <div key={idx} className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
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
                className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none w-1/3"
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
                className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none flex-1"
              />
              <button
                type="button"
                onClick={() => {
                  updateInvitationData((prev: any) => {
                    const list = (prev.families?.brideFamily || []).filter((_: any, i: number) => i !== idx);
                    return { ...prev, families: { ...prev.families, brideFamily: list } };
                  });
                }}
                className="text-red-400 hover:text-red-300 p-1.5 cursor-pointer"
              >
                <Trash2 size={14} />
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

    const updateMainVenue = (field: string, val: string) => {
      updateInvitationData((prev: any) => {
        const list = [...(prev.venue?.venues || [])];
        if (list.length === 0) {
          list.push({
            id: "venue-1",
            title: "Wedding Venue",
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

    return (
      <div className="space-y-8 animate-fadeIn">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="text-base font-bold tracking-[0.5px]">Wedding Venue Location</h3>
            <div className="flex items-center gap-2">
              <label htmlFor="client-venue-enabled" className="text-xs text-white/70 font-semibold cursor-pointer">Enabled</label>
              <input
                type="checkbox"
                id="client-venue-enabled"
                checked={invitationData.venue?.enabled !== false}
                onChange={(e) => updateInvitationData((prev: any) => ({
                  ...prev,
                  venue: { ...prev.venue, enabled: e.target.checked }
                }))}
                className="w-4 h-4 rounded text-yellow-500 accent-yellow-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Venue Name</label>
            <input
              type="text"
              placeholder="e.g. The Leela Palace"
              value={mainVenue.venueName || ""}
              onChange={(e) => updateMainVenue("venueName", e.target.value)}
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">City</label>
              <input
                type="text"
                placeholder="e.g. Hyderabad"
                value={mainVenue.city || ""}
                onChange={(e) => updateMainVenue("city", e.target.value)}
                className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Address</label>
              <input
                type="text"
                placeholder="e.g. Old Airport Road, Kodihalli"
                value={mainVenue.address || ""}
                onChange={(e) => updateMainVenue("address", e.target.value)}
                className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Google Maps Directions Link</label>
            <input
              type="text"
              placeholder="https://maps.google.com/?q=..."
              value={mainVenue.mapsUrl || ""}
              onChange={(e) => updateMainVenue("mapsUrl", e.target.value)}
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none font-mono text-[11px]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Google Maps Embed Iframe URL (Optional)</label>
            <input
              type="text"
              placeholder="https://www.google.com/maps/embed?pb=..."
              value={mainVenue.embedUrl || ""}
              onChange={(e) => updateMainVenue("embedUrl", e.target.value)}
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none font-mono text-[11px]"
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
      <div className="space-y-8 animate-fadeIn">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="text-base font-bold tracking-[0.5px]">RSVP Configuration</h3>
            <div className="flex items-center gap-2">
              <label htmlFor="client-rsvp-enabled" className="text-xs text-white/70 font-semibold cursor-pointer">Enabled</label>
              <input
                type="checkbox"
                id="client-rsvp-enabled"
                checked={rsvp.enabled !== false}
                onChange={(e) => updateInvitationData((prev: any) => ({
                  ...prev,
                  rsvp: { ...prev.rsvp, enabled: e.target.checked }
                }))}
                className="w-4 h-4 rounded text-yellow-500 accent-yellow-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">RSVP Section Title</label>
            <input
              type="text"
              placeholder="We Would Love To Celebrate With You"
              value={rsvp.title || ""}
              onChange={(e) => updateInvitationData((prev: any) => ({
                ...prev,
                rsvp: { ...prev.rsvp, title: e.target.value }
              }))}
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">RSVP Subtitle / Message</label>
            <textarea
              rows={2}
              placeholder="Your presence and blessings will make our celebration even more special."
              value={rsvp.subtitle || ""}
              onChange={(e) => updateInvitationData((prev: any) => ({
                ...prev,
                rsvp: { ...prev.rsvp, subtitle: e.target.value }
              }))}
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Submit Button Label</label>
            <input
              type="text"
              placeholder="RSVP"
              value={invitationData.hero?.ctaText || ""}
              onChange={(e) => updateInvitationData((prev: any) => ({
                ...prev,
                hero: { ...prev.hero, ctaText: e.target.value }
              }))}
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none"
            />
          </div>
        </div>

        {/* RSVP Contacts List */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="text-base font-bold tracking-[0.5px]">RSVP Contacts</h3>
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
              className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-yellow-500 hover:text-black transition-all cursor-pointer"
            >
              <Plus size={12} /> Add Contact
            </button>
          </div>

          {contacts.map((contact: any, index: number) => (
            <div key={index} className="bg-black/20 border border-white/5 p-4 rounded-xl relative space-y-3">
              <button
                type="button"
                onClick={() => {
                  updateInvitationData((prev: any) => {
                    const list = [...(prev.rsvp?.contacts || [])];
                    list.splice(index, 1);
                    return { ...prev, rsvp: { ...prev.rsvp, contacts: list } };
                  });
                }}
                className="absolute top-3.5 right-3.5 text-red-400 hover:text-red-300 p-1 cursor-pointer"
                title="Remove Contact"
              >
                <Trash2 size={14} />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-6">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Contact Type</label>
                  <select
                    value={contact.type}
                    onChange={(e) => {
                      updateInvitationData((prev: any) => {
                        const list = [...(prev.rsvp?.contacts || [])];
                        list[index] = { ...list[index], type: e.target.value as any };
                        return { ...prev, rsvp: { ...prev.rsvp, contacts: list } };
                      });
                    }}
                    className="bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none h-[36px]"
                  >
                    <option value="phone">Phone Call</option>
                    <option value="whatsapp">WhatsApp Message</option>
                    <option value="email">Email Address</option>
                    <option value="form">RSVP Form</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Label / Name</label>
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
                    className="bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Phone / Number / Link</label>
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
                  className="bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
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
      <div className="space-y-8 animate-fadeIn">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="text-base font-bold tracking-[0.5px]">Footer & Credits</h3>
            <div className="flex items-center gap-2">
              <label htmlFor="client-footer-enabled" className="text-xs text-white/70 font-semibold cursor-pointer">Enabled</label>
              <input
                type="checkbox"
                id="client-footer-enabled"
                checked={footer.enabled !== false}
                onChange={(e) => updateInvitationData((prev: any) => ({
                  ...prev,
                  footer: { ...prev.footer, enabled: e.target.checked }
                }))}
                className="w-4 h-4 rounded text-yellow-500 accent-yellow-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Closing Quote / Salutation</label>
            <textarea
              rows={2}
              placeholder="A beautiful beginning starts with a beautiful invitation."
              value={footer.salutation || ""}
              onChange={(e) => updateInvitationData((prev: any) => ({
                ...prev,
                footer: { ...prev.footer, salutation: e.target.value }
              }))}
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Designer Brand Name</label>
              <input
                type="text"
                placeholder="Ahvaanam"
                value={footer.designer || footer.title || ""}
                onChange={(e) => updateInvitationData((prev: any) => ({
                  ...prev,
                  footer: { ...prev.footer, designer: e.target.value, title: e.target.value }
                }))}
                className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Service Subtitle</label>
              <input
                type="text"
                placeholder="Digital Wedding Invitations & Card Services"
                value={footer.creditText || ""}
                onChange={(e) => updateInvitationData((prev: any) => ({
                  ...prev,
                  footer: { ...prev.footer, creditText: e.target.value }
                }))}
                className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Location / Address</label>
            <input
              type="text"
              placeholder="Tirumala Printers, Metpally, Dist. Jagtial, Telangana"
              value={footer.location || ""}
              onChange={(e) => updateInvitationData((prev: any) => ({
                ...prev,
                footer: { ...prev.footer, location: e.target.value }
              }))}
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-semibold text-white/50 tracking-[1px]">Contact Phone / WhatsApp</label>
            <input
              type="text"
              placeholder="+91 9866767100"
              value={footer.contact || ""}
              onChange={(e) => updateInvitationData((prev: any) => ({
                ...prev,
                footer: { ...prev.footer, contact: e.target.value }
              }))}
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none font-mono text-[11px]"
            />
          </div>
        </div>
      </div>
    );
  };

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
            const rawSectionOrder = data.sectionOrder || [];
            const sectionOrder = rawSectionOrder.filter((sId: string) => sId !== "faq" && sId !== "faqs" && sId !== "dressCode");
            const clientEmailVal = (invitationData as any).clientEmail || data.clientEmail || "";

            return (
              <div className="space-y-8 animate-fadeIn">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-base font-bold mb-4 tracking-[0.5px]">Configure Global Settings</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Assigned Client Email */}
                    <div className="flex flex-col gap-2 col-span-2 bg-black/20 p-4 border border-white/10 rounded-xl">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] uppercase font-semibold text-white/70 tracking-[1.5px]">Assigned Client Email</label>
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
                        className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none font-medium"
                      />
                      <p className="text-[9px] text-white/40">
                        The user with this email address will be able to see this invitation in their dashboard.
                      </p>
                    </div>

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

                    <div className="flex flex-col gap-2 bg-black/20 p-3.5 border border-white/10 rounded-xl">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] uppercase font-semibold text-white/60 tracking-[1px]">Background Music</label>
                        <span className="text-[9px] text-yellow-500 font-semibold">MP3, WAV, M4A, OGG</span>
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
                          className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none w-full"
                        />
                      </div>

                      {musicFile && (
                        <div className="mt-1">
                          <audio controls src={musicFile} className="w-full h-8" preload="none" />
                        </div>
                      )}
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
