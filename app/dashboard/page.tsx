"use client";

import React, { useState, useEffect } from "react";
import { 
  Palette, Heart, Calendar, Plus, Trash2, Edit3, 
  ExternalLink, Sparkles, CheckCircle, AlertCircle, Share2, Download, Copy, LogOut, Users, BarChart2, MessageCircle, Image as ImageIcon, Star
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { isAdminUser } from "@/lib/auth/isAdmin";

interface ClientProfile {
  id: string;
  groom: string;
  bride: string;
  date: string;
  theme: string;
  enabled: boolean;
  status: string;
  payment_status: string;
  updatedAt: string;
  acceptedCount?: number;
  declinedCount?: number;
  pendingCount?: number;
  guestCount?: number;
  viewsCount?: number;
  ratingCount?: number;
  avgRating?: number;
  feedbacks?: any[];
}

export default function ClientDashboard() {
  const [profiles, setProfiles] = useState<ClientProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareProfile, setShareProfile] = useState<ClientProfile | null>(null);
  const [ratingsProfile, setRatingsProfile] = useState<ClientProfile | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  // RSVP states
  const [rsvpProfile, setRsvpProfile] = useState<ClientProfile | null>(null);
  const [rsvpsList, setRsvpsList] = useState<any[]>([]);
  const [loadingRsvps, setLoadingRsvps] = useState(false);
  const [rsvpError, setRsvpError] = useState<string | null>(null);

  // Share states
  const [customDomain, setCustomDomain] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [downloadingQR, setDownloadingQR] = useState(false);
  const [qrImageCopied, setQrImageCopied] = useState(false);
  const [downloadingSVG, setDownloadingSVG] = useState(false);
  const [generatingCard, setGeneratingCard] = useState(false);

  const supabase = createClient();

  const handleCopyQRImage = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob
        })
      ]);
      setQrImageCopied(true);
      setTimeout(() => setQrImageCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy QR code image:", err);
      alert("Failed to copy QR code. Try opening in a secure context (HTTPS) or another browser.");
    }
  };

  const handleDownloadSVG = async (url: string, id: string) => {
    setDownloadingSVG(true);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${id}-wedding-qr.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Failed to download SVG QR:", err);
      alert("Failed to download SVG QR code.");
    } finally {
      setDownloadingSVG(false);
    }
  };

  const handleDownloadCard = async (profile: ClientProfile) => {
    setGeneratingCard(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 1200;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context is not available.");

      // 1. Draw premium cream background
      ctx.fillStyle = "#FAF9F6";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw gold double borders
      ctx.strokeStyle = "#C49B27";
      ctx.lineWidth = 14;
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

      ctx.strokeStyle = "#C49B27";
      ctx.lineWidth = 2;
      ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);

      // Decorative corner designs
      ctx.fillStyle = "#C49B27";
      // Top left corner decoration
      ctx.fillRect(48, 48, 30, 6);
      ctx.fillRect(48, 48, 6, 30);
      // Top right corner
      ctx.fillRect(canvas.width - 78, 48, 30, 6);
      ctx.fillRect(canvas.width - 54, 48, 6, 30);
      // Bottom left corner
      ctx.fillRect(48, canvas.height - 54, 30, 6);
      ctx.fillRect(48, canvas.height - 78, 6, 30);
      // Bottom right corner
      ctx.fillRect(canvas.width - 78, canvas.height - 54, 30, 6);
      ctx.fillRect(canvas.width - 54, canvas.height - 78, 6, 30);

      // 3. Draw Header Title
      ctx.fillStyle = "#241E1C";
      ctx.textAlign = "center";
      ctx.font = "italic 28px Georgia, serif";
      ctx.fillText("WEDDING INVITATION", canvas.width / 2, 130);

      // 4. Draw Bride & Groom Names
      ctx.font = "bold 44px Georgia, serif";
      ctx.fillStyle = "#C49B27";
      ctx.fillText(`${profile.groom} & ${profile.bride}`, canvas.width / 2, 210);

      // 5. Draw Date
      ctx.font = "bold 18px Helvetica, sans-serif";
      ctx.fillStyle = "#241E1C";
      const weddingDate = profile.date 
        ? new Date(profile.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) 
        : "SAVE THE DATE";
      ctx.fillText(weddingDate.toUpperCase(), canvas.width / 2, 275);

      // Divider line
      ctx.strokeStyle = "#C49B27";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(280, 320);
      ctx.lineTo(520, 320);
      ctx.stroke();

      // Scan instruction
      ctx.font = "14px Helvetica, sans-serif";
      ctx.fillStyle = "#241E1C";
      ctx.fillText("SCAN THE QR CODE BELOW TO VIEW", canvas.width / 2, 400);

      // 6. Draw QR Code Image
      const qrImg = new Image();
      qrImg.crossOrigin = "anonymous";
      
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(getShareUrl(profile.id))}`;
      
      await new Promise((resolve, reject) => {
        qrImg.onload = resolve;
        qrImg.onerror = reject;
        qrImg.src = qrUrl;
      });

      // Gold frame for QR
      ctx.fillStyle = "#FFFFFF";
      ctx.strokeRect(198, 458, 404, 404);
      ctx.drawImage(qrImg, 200, 460, 400, 400);

      // Gold divider below QR
      ctx.strokeStyle = "#C49B27";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(280, 920);
      ctx.lineTo(520, 920);
      ctx.stroke();

      // 7. Write Link and footer text
      ctx.fillStyle = "#C49B27";
      ctx.font = "bold 20px Helvetica, sans-serif";
      ctx.fillText(getShareUrl(profile.id), canvas.width / 2, 970);

      ctx.fillStyle = "#241E1C";
      ctx.font = "italic 16px Georgia, serif";
      ctx.fillText("Join us in our celebrations", canvas.width / 2, 1020);

      ctx.font = "bold 12px Helvetica, sans-serif";
      ctx.fillText("MADE WITH AHVAANAM.COM", canvas.width / 2, 1080);

      // Export canvas to blob
      canvas.toBlob((blob) => {
        if (!blob) throw new Error("Failed to export image blob");
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `${profile.groom}-${profile.bride}-share-card.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, "image/png");

    } catch (err: any) {
      console.error("Failed to generate save-the-date card:", err);
      alert("Failed to compile sharing card. Try again.");
    } finally {
      setGeneratingCard(false);
    }
  };

  const handleNativeShare = async (profile: ClientProfile) => {
    const url = getShareUrl(profile.id);
    const title = `${profile.groom} & ${profile.bride}'s Wedding Invitation`;
    const text = `You're warmly invited to our wedding ❤️`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url
        });
      } catch (err) {
        console.error("Native share cancelled or failed:", err);
      }
    } else {
      // Fallback
      navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const handleOpenRsvps = async (profile: ClientProfile) => {
    setRsvpProfile(profile);
    setLoadingRsvps(true);
    setRsvpError(null);
    setRsvpsList([]);

    try {
      const res = await fetch(`/api/invitation/${profile.id}/rsvp`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load RSVPs");
      setRsvpsList(data.rsvps || []);
    } catch (err: any) {
      setRsvpError(err.message || "Failed to retrieve guest RSVPs.");
    } finally {
      setLoadingRsvps(false);
    }
  };

  const handleExportCSV = (profileId: string, rsvps: any[]) => {
    if (!rsvps || rsvps.length === 0) return;
    const headers = ["Guest Name", "Phone", "Email", "Attending", "Guest Count", "Message", "Submitted Time"];
    const rows = rsvps.map(r => [
      `"${r.guest_name.replace(/"/g, '""')}"`,
      `"${r.phone}"`,
      `"${(r.email || '').replace(/"/g, '""')}"`,
      r.attending ? "Yes" : "No",
      r.guest_count || 0,
      `"${(r.message || '').replace(/"/g, '""')}"`,
      new Date(r.created_at).toLocaleString()
    ]);
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${profileId}-rsvps.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  };

  useEffect(() => {
    // Retrieve authenticated user details
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserEmail(user.email || null);
        setIsAdmin(isAdminUser(user.email));
      }
    });

    fetchProfiles();
    
    if (typeof window !== "undefined") {
      setCustomDomain(window.location.origin);
    }
  }, []);

  const fetchProfiles = async () => {
    try {
      const res = await fetch("/api/invitation");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProfiles(data);
    } catch (err) {
      console.error("Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to permanently delete your wedding invitation "${id}"?`)) return;

    try {
      const res = await fetch(`/api/invitation/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProfiles(prev => prev.filter(p => p.id !== id));
      } else {
        alert("Failed to delete the invitation profile.");
      }
    } catch (err) {
      alert("Error deleting invitation profile.");
    }
  };

  const handlePublish = async (id: string) => {
    setPublishingId(id);
    try {
      const res = await fetch(`/api/invitation/${id}/publish`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to publish invitation");
      }
      fetchProfiles();
    } catch (err: any) {
      alert(err.message || "Failed to publish. Try again.");
    } finally {
      setPublishingId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const getShareUrl = (id: string) => {
    const base = customDomain.replace(/\/$/, "");
    return `${base}/invites/${id}`;
  };

  const handleCopyLink = (id: string) => {
    const url = getShareUrl(id);
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleDownloadQR = async (id: string) => {
    setDownloadingQR(true);
    const url = getShareUrl(id);
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(url)}`;
    
    try {
      const response = await fetch(qrApiUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${id}-wedding-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Failed to download QR code", err);
      alert("Failed to download QR code image.");
    } finally {
      setDownloadingQR(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#241E1C] flex flex-col font-sans relative overflow-hidden">
      
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-zinc-200/50 backdrop-blur-md sticky top-0 z-40 px-8 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center cursor-pointer select-none relative z-10" onClick={() => window.location.href = "/"}>
          <img src="/images/logo.png" alt="Ahvaanam" className="h-8 md:h-9 w-auto object-contain translate-y-0 drop-shadow-sm" />
        </div>

        <div className="flex items-center gap-4">
          <a
            href="/"
            className="text-[10px] text-[#241E1C]/60 hover:text-[#241E1C] transition-colors uppercase tracking-[1.5px] font-bold mr-2"
          >
            Public Site
          </a>

          {isAdmin && (
            <a
              href="/create"
              className="flex items-center gap-2 bg-[#C49B27] hover:bg-[#B0871B] text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[1.5px] transition-all shadow-sm hover:scale-105 active:scale-95 text-center"
            >
              <Plus size={14} /> Create Wedding Invitation
            </a>
          )}
          
          <button
            onClick={handleLogout}
            className="flex items-center justify-center p-2.5 bg-white border border-zinc-200 hover:bg-red-500/5 hover:border-red-500/20 text-[#241E1C]/80 hover:text-red-600 rounded-xl transition-all"
            title="Log Out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </header>

      {/* --- MAIN PAGE CONTENT --- */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full z-10 space-y-8">
        
        {/* Welcome Section */}
        <div className="bg-white border border-amber-500/10 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-[0.5px] mb-1.5 flex items-center gap-2 [font-family:var(--cinzel),serif] text-[#241E1C]">
              Welcome back {userEmail ? `, ${userEmail}` : ""} <Sparkles className="text-[#C49B27] animate-pulse" size={18} />
            </h2>
            <p className="text-xs text-[#241E1C]/60 leading-relaxed max-w-xl">
              {isAdmin 
                ? "Design, customize, and publish client wedding invitations. Complete drafts, manage RSVP data, and configure live portals."
                : "Manage and monitor your digital wedding invitation, view live guest RSVPs, track page views, and download your QR share materials."}
            </p>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className={`grid grid-cols-2 ${isAdmin ? "md:grid-cols-5" : "md:grid-cols-4"} gap-4 animate-fadeIn`}>
          <div className="bg-white border border-amber-500/10 p-5 rounded-3xl shadow-sm text-center">
            <span className="text-[9px] uppercase tracking-[1.5px] font-bold text-slate-400 block mb-1">
              {isAdmin ? "Total Invites" : "Your Invites"}
            </span>
            <span className="text-xl font-bold text-[#241E1C] font-mono">{profiles.length}</span>
          </div>
          <div className="bg-white border border-amber-500/10 p-5 rounded-3xl shadow-sm text-center">
            <span className="text-[9px] uppercase tracking-[1.5px] font-bold text-slate-400 block mb-1">Confirmed RSVPs</span>
            <span className="text-xl font-bold text-[#241E1C] font-mono">
              {profiles.reduce((acc, p) => acc + (p.acceptedCount || 0), 0)}
            </span>
          </div>
          <div className="bg-white border border-amber-500/10 p-5 rounded-3xl shadow-sm text-center">
            <span className="text-[9px] uppercase tracking-[1.5px] font-bold text-slate-400 block mb-1">Attending Guests</span>
            <span className="text-xl font-bold text-emerald-600 font-mono">
              {profiles.reduce((acc, p) => acc + (p.guestCount || p.acceptedCount || 0), 0)}
            </span>
          </div>
          <div className="bg-white border border-amber-500/10 p-5 rounded-3xl shadow-sm text-center col-span-2 md:col-span-1">
            <span className="text-[9px] uppercase tracking-[1.5px] font-bold text-slate-400 block mb-1">Total Views</span>
            <span className="text-xl font-bold text-[#C49B27] font-mono">
              {profiles.reduce((acc, p) => acc + (p.viewsCount || 0), 0)}
            </span>
          </div>
          {isAdmin && (
            <div className="bg-white border border-amber-500/10 p-5 rounded-3xl shadow-sm text-center col-span-2 md:col-span-1">
              <span className="text-[9px] uppercase tracking-[1.5px] font-bold text-slate-400 block mb-1">Avg Rating</span>
              <span className="text-xl font-bold text-amber-600 font-mono flex items-center justify-center gap-1">
                <Star size={15} fill="#C49B27" className="text-[#C49B27]" />
                {(() => {
                  const rated = profiles.filter(p => (p.ratingCount || 0) > 0);
                  if (rated.length === 0) return "0.0";
                  const sum = rated.reduce((acc, p) => acc + (p.avgRating || 0), 0);
                  return (sum / rated.length).toFixed(1);
                })()}
              </span>
            </div>
          )}
        </div>

        {/* Active Projects Grid */}
        <div className="space-y-4 text-left w-full animate-fadeIn">
          <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/50">
            {isAdmin ? `All Client Invitations (${profiles.length})` : `Your Invitations (${profiles.length})`}
          </h3>
          
          {loading ? (
            <div className="flex flex-col items-center py-16 bg-white border border-zinc-200/60 rounded-3xl shadow-sm">
              <div className="w-8 h-8 border-2 border-[#C49B27] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-[#241E1C]/40 text-[10px] font-bold uppercase tracking-[1px]">Loading Invitations...</p>
            </div>
          ) : profiles.length === 0 ? (
            <div className="border border-dashed border-[#C49B27]/20 bg-white rounded-3xl py-20 text-center flex flex-col items-center justify-center shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-[#FAF9F6]/10 blur-[100px] pointer-events-none" />
              <Heart className="text-[#C49B27]/30 mb-4 animate-pulse" size={48} />
              <h4 className="text-lg font-bold text-[#241E1C] [font-family:var(--cinzel),serif] tracking-[0.5px]">
                {isAdmin ? "No Client Invitations Created" : "No Invitations Assigned"}
              </h4>
              <p className="text-xs text-[#241E1C]/60 max-w-sm mt-2 leading-relaxed px-4">
                {isAdmin 
                  ? "Create and launch your first digital wedding invitation for a client."
                  : "Your customized wedding invitation will appear here once configured by the Ahvaanam team."}
              </p>
              {isAdmin && (
                <a
                  href="/create"
                  className="mt-6 flex items-center gap-2 bg-[#C49B27] hover:bg-[#B0871B] text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-[1.5px] transition-all shadow-md hover:scale-105 active:scale-95"
                >
                  <Plus size={14} /> Create New Invite
                </a>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((profile) => (
                <div 
                  key={profile.id}
                  className="p-6 flex flex-col justify-between min-h-[220px] bg-white border border-amber-500/10 rounded-3xl shadow-sm relative overflow-hidden hover:shadow-md transition-all duration-300"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-1.5">
                        <span className={`text-[8px] font-bold uppercase tracking-[0.5px] px-2 py-0.5 rounded-full border ${
                          profile.status === 'published' 
                            ? "bg-green-500/5 border-green-500/10 text-green-600" 
                            : "bg-amber-500/5 border-amber-500/10 text-amber-600"
                        }`}>
                          {profile.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <span className="text-[9px] text-[#241E1C]/40 font-mono">/{profile.id}</span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold truncate tracking-[0.5px] text-[#241E1C] [font-family:var(--cinzel),serif]">
                        {profile.groom} & {profile.bride}
                      </h4>
                      <p className="text-[10px] text-[#241E1C]/50 flex items-center gap-1.5 mt-1 font-semibold">
                        <Palette size={12} className="text-[#C49B27]/80" /> Theme: <span className="text-[#241E1C] font-bold uppercase tracking-[0.5px]">{profile.theme.replace(/-/g, ' ')}</span>
                      </p>
                      {profile.updatedAt && (
                        <p className="text-[9px] text-[#241E1C]/40 flex items-center gap-1.5 mt-0.5 font-medium font-mono">
                          Last Updated: {new Date(profile.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      )}

                      {isAdmin && (profile as any).clientEmail && (
                        <p className="text-[9px] text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded-md inline-block mt-1 font-mono">
                          👤 Client: {(profile as any).clientEmail}
                        </p>
                      )}

                      {/* RSVP, Views & Rating Stats on Card */}
                      <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-3 bg-zinc-50 border border-zinc-200/50 p-2.5 rounded-xl text-[9px] text-[#241E1C]/70 font-semibold font-sans">
                        <div>
                          <span className="text-[#C49B27] font-bold uppercase tracking-[0.5px]">👁 Views:</span> {profile.viewsCount || 0}
                        </div>
                        <div>
                          <span className="text-slate-550 font-bold uppercase tracking-[0.5px]">📝 RSVPs:</span> {(profile.acceptedCount || 0) + (profile.declinedCount || 0)}
                        </div>
                        <div>
                          <span className="text-emerald-600 font-bold uppercase tracking-[0.5px]">Attending:</span> {profile.acceptedCount || 0}
                        </div>
                        <div>
                          <span className="text-red-500 font-bold uppercase tracking-[0.5px]">Declined:</span> {profile.declinedCount || 0}
                        </div>
                        {isAdmin && (
                          <div>
                            <span className="text-amber-600 font-bold uppercase tracking-[0.5px]">⭐ Rating:</span> {profile.avgRating ? `${profile.avgRating}★ (${profile.ratingCount || 0})` : "0★ (0)"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-100 pt-4 mt-4">
                    <div className="flex gap-1.5">
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(profile.id)}
                          className="p-2 bg-red-500/5 border border-red-500/10 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-all cursor-pointer"
                          title="Delete Invitation"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenRsvps(profile)}
                        className="p-2 bg-zinc-50 border border-zinc-200 text-zinc-600 hover:bg-zinc-100 rounded-lg transition-all cursor-pointer"
                        title="View RSVPs"
                      >
                        <Users size={12} />
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => setRatingsProfile(profile)}
                          className="p-2 bg-amber-500/5 border border-amber-500/20 text-[#C49B27] hover:bg-[#C49B27] hover:text-white rounded-lg transition-all cursor-pointer"
                          title="View Ratings & Reviews"
                        >
                          <Star size={12} fill="#C49B27" />
                        </button>
                      )}
                      <button
                        onClick={() => window.location.href = `/dashboard/analytics/${profile.id}`}
                        className="p-2 bg-zinc-50 border border-zinc-200 text-[#C49B27] hover:bg-[#C49B27] hover:text-white rounded-lg transition-all cursor-pointer"
                        title="View Analytics"
                      >
                        <BarChart2 size={12} />
                      </button>
                      {profile.status === "published" && (
                        <button
                          onClick={() => setShareProfile(profile)}
                          className="p-2 bg-amber-500/5 border border-amber-500/10 text-[#C49B27] hover:bg-[#C49B27] hover:text-white rounded-lg transition-all cursor-pointer"
                          title="Generate QR & Share Link"
                        >
                          <Share2 size={12} />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={`/invites/${profile.id}`}
                        target="_blank"
                        className="p-2 bg-zinc-50 border border-zinc-200 text-zinc-600 hover:bg-zinc-100 rounded-lg transition-all cursor-pointer"
                        title="Preview Public Link"
                      >
                        <ExternalLink size={12} />
                      </a>
                      {isAdmin && (
                        <a
                          href={`/admin/${profile.id}`}
                          className="px-2.5 py-1.5 bg-amber-500/5 border border-amber-500/10 text-[#C49B27] hover:bg-[#C49B27] hover:text-white rounded-lg text-[9px] font-bold uppercase tracking-[0.5px] transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 size={10} /> Edit
                        </a>
                      )}
                      {profile.status !== 'published' ? (
                        <button
                          onClick={() => handlePublish(profile.id)}
                          disabled={publishingId === profile.id}
                          className="px-2.5 py-1.5 bg-[#C49B27] hover:bg-[#B0871B] text-white rounded-lg text-[9px] font-bold uppercase tracking-[0.5px] transition-all flex items-center gap-1 shadow-sm cursor-pointer disabled:opacity-50"
                        >
                          {publishingId === profile.id ? "Publishing..." : "Publish"}
                        </button>
                      ) : (
                        <span className="px-2.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-lg text-[9px] font-bold uppercase tracking-[0.5px] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Live
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* --- SHARE & QR MODAL --- */}
      {shareProfile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 w-full max-w-2xl rounded-3xl overflow-hidden shadow-xl relative text-left flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2 text-[#241E1C] uppercase tracking-[0.5px]">
                  <Share2 className="text-[#C49B27]" size={16} /> Sharing Center
                </h3>
                <p className="text-[9px] text-[#241E1C]/45 uppercase tracking-[1.5px] font-bold mt-1 font-mono">
                  Export tools for /{shareProfile.id}
                </p>
              </div>
              <button
                onClick={() => setShareProfile(null)}
                className="text-[#241E1C]/40 hover:text-[#241E1C] text-sm cursor-pointer p-1 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 grid md:grid-cols-2 gap-8">
              {/* Left Column: QR Code & Actions */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="bg-[#FAF9F6] border border-zinc-200/80 p-6 rounded-3xl flex flex-col items-center gap-2 shadow-sm">
                  <div className="bg-white p-3 rounded-2xl border border-zinc-100 shadow-inner">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(getShareUrl(shareProfile.id))}`}
                      alt="Wedding QR Code"
                      className="w-48 h-48"
                    />
                  </div>
                  <span className="text-[9px] text-[#C49B27] font-bold uppercase tracking-[1.5px] mt-1">
                    Scan to Open Invitation
                  </span>
                </div>

                {/* QR Code Action Grid */}
                <div className="w-full grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleDownloadQR(shareProfile.id)}
                    disabled={downloadingQR}
                    className="flex flex-col items-center justify-center gap-1.5 p-2 bg-[#FAF9F6] hover:bg-zinc-150 border border-zinc-200 rounded-xl text-[8px] font-bold uppercase tracking-[0.5px] transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Download size={14} className="text-[#C49B27]" />
                    {downloadingQR ? "PNG..." : "PNG QR"}
                  </button>
                  <button
                    onClick={() => handleDownloadSVG(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&format=svg&data=${encodeURIComponent(getShareUrl(shareProfile.id))}`, shareProfile.id)}
                    disabled={downloadingSVG}
                    className="flex flex-col items-center justify-center gap-1.5 p-2 bg-[#FAF9F6] hover:bg-zinc-150 border border-zinc-200 rounded-xl text-[8px] font-bold uppercase tracking-[0.5px] transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Download size={14} className="text-sky-600" />
                    {downloadingSVG ? "SVG..." : "SVG QR"}
                  </button>
                  <button
                    onClick={() => handleCopyQRImage(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&format=png&data=${encodeURIComponent(getShareUrl(shareProfile.id))}`)}
                    className={`flex flex-col items-center justify-center gap-1.5 p-2 border rounded-xl text-[8px] font-bold uppercase tracking-[0.5px] transition-all cursor-pointer ${
                      qrImageCopied 
                        ? "bg-green-600 border-green-600 text-white" 
                        : "bg-[#FAF9F6] border-zinc-200 text-zinc-650 hover:bg-zinc-150"
                    }`}
                  >
                    <Copy size={14} />
                    {qrImageCopied ? "Copied!" : "Copy QR"}
                  </button>
                </div>
              </div>

              {/* Right Column: Sharing Links */}
              <div className="flex flex-col justify-between space-y-6">
                
                {/* Domain & URL preview */}
                <div className="space-y-4">
                  <div className="w-full flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1.5px]">Production Domain Prefix</label>
                    <input
                      type="text"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      placeholder="e.g. https://myweddinginvite.com"
                      className="bg-[#FAF9F6] border border-zinc-200 focus:border-[#C49B27] outline-none rounded-xl px-4 py-2.5 text-xs text-[#241E1C]"
                    />
                  </div>

                  <div className="w-full bg-[#FAF9F6] border border-zinc-200 p-3 rounded-2xl font-mono text-[9px] text-[#241E1C]/60 truncate flex items-center justify-between">
                    <span className="truncate mr-2">{getShareUrl(shareProfile.id)}</span>
                    <a 
                      href={getShareUrl(shareProfile.id)} 
                      target="_blank" 
                      className="text-[#C49B27] hover:underline flex items-center gap-0.5 shrink-0 font-bold uppercase"
                    >
                      Open <ExternalLink size={9} />
                    </a>
                  </div>
                </div>

                {/* Core Link Sharing Actions */}
                <div className="space-y-3">
                  {/* WhatsApp Share Button */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `You're warmly invited to our wedding ❤️\n\nView our invitation here:\n${getShareUrl(shareProfile.id)}\n\nWith love,\n${shareProfile.groom} & ${shareProfile.bride}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl text-[10px] uppercase tracking-[1.5px] transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <MessageCircle size={15} /> Share on WhatsApp
                  </a>

                  {/* Copy Link Button */}
                  <button
                    onClick={() => handleCopyLink(shareProfile.id)}
                    className={`w-full py-3 font-bold rounded-xl text-[10px] uppercase tracking-[1.5px] transition-all border flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                      linkCopied 
                        ? "bg-green-600 border-green-600 text-white" 
                        : "bg-white border-zinc-200 text-[#241E1C] hover:bg-zinc-50"
                    }`}
                  >
                    <Copy size={14} /> {linkCopied ? "Link Copied!" : "Copy Invitation Link"}
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Native Share button */}
                    <button
                      onClick={() => handleNativeShare(shareProfile)}
                      className="py-3 font-bold bg-[#FAF9F6] border border-zinc-200 hover:bg-zinc-150 text-[#241E1C] rounded-xl text-[10px] uppercase tracking-[1px] transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Share2 size={13} className="text-[#C49B27]" /> Native Share
                    </button>

                    {/* Download Card button */}
                    <button
                      onClick={() => handleDownloadCard(shareProfile)}
                      disabled={generatingCard}
                      className="py-3 font-bold bg-[#C49B27] hover:bg-[#B0871B] text-white rounded-xl text-[10px] uppercase tracking-[1px] transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      <ImageIcon size={13} /> {generatingCard ? "Creating..." : "Save Card"}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
      {/* --- RSVP DASHBOARD MODAL --- */}
      {rsvpProfile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 w-full max-w-4xl rounded-3xl overflow-hidden shadow-xl relative text-left flex flex-col max-h-[85vh] animate-fadeIn">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2 text-[#241E1C] uppercase tracking-[0.5px]">
                  <Users className="text-[#C49B27]" size={16} /> RSVP Dashboard
                </h3>
                <p className="text-[9px] text-[#241E1C]/45 uppercase tracking-[1.5px] font-bold mt-1 font-mono">
                  Managing responses for /{rsvpProfile.id}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {rsvpsList.length > 0 && (
                  <button
                    onClick={() => handleExportCSV(rsvpProfile.id, rsvpsList)}
                    className="flex items-center gap-1.5 bg-[#C49B27] hover:bg-[#B0871B] text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[1px] transition-all shadow-sm cursor-pointer"
                  >
                    <Download size={12} /> Export CSV
                  </button>
                )}
                <button
                  onClick={() => setRsvpProfile(null)}
                  className="text-[#241E1C]/40 hover:text-[#241E1C] text-sm cursor-pointer p-1 font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {loadingRsvps ? (
                <div className="flex flex-col items-center py-20">
                  <div className="w-8 h-8 border-2 border-[#C49B27] border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-[#241E1C]/40 text-[10px] font-bold uppercase tracking-[1px]">Loading Responses...</p>
                </div>
              ) : rsvpError ? (
                <div className="p-4 bg-red-50/5 border border-red-500/10 rounded-2xl flex items-start gap-3 text-red-600 text-xs">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <p>{rsvpError}</p>
                </div>
              ) : rsvpsList.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center justify-center border border-dashed border-zinc-200 rounded-3xl bg-zinc-50/50">
                  <Users className="text-zinc-300 mb-3" size={36} />
                  <h4 className="text-sm font-bold text-[#241E1C] uppercase tracking-[0.5px]">No RSVPs Submitted</h4>
                  <p className="text-xs text-[#241E1C]/45 max-w-xs mt-1 leading-relaxed">
                    Once your guests respond using the online form on your published invitation, their responses will automatically display here.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Local analytics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#FAF9F6] border border-zinc-200/50 p-4 rounded-2xl text-center">
                      <span className="text-[8px] uppercase tracking-[1px] font-bold text-slate-400 block mb-0.5">Total Responses</span>
                      <span className="text-base font-bold text-[#241E1C] font-mono">{rsvpsList.length}</span>
                    </div>
                    <div className="bg-[#FAF9F6] border border-zinc-200/50 p-4 rounded-2xl text-center">
                      <span className="text-[8px] uppercase tracking-[1px] font-bold text-slate-400 block mb-0.5">Attending</span>
                      <span className="text-base font-bold text-emerald-600 font-mono">
                        {rsvpsList.filter(r => r.attending).length}
                      </span>
                    </div>
                    <div className="bg-[#FAF9F6] border border-zinc-200/50 p-4 rounded-2xl text-center">
                      <span className="text-[8px] uppercase tracking-[1px] font-bold text-slate-400 block mb-0.5">Declined</span>
                      <span className="text-base font-bold text-red-500 font-mono">
                        {rsvpsList.filter(r => !r.attending).length}
                      </span>
                    </div>
                    <div className="bg-[#FAF9F6] border border-zinc-200/50 p-4 rounded-2xl text-center">
                      <span className="text-[8px] uppercase tracking-[1px] font-bold text-slate-400 block mb-0.5">Guests Attending</span>
                      <span className="text-base font-bold text-[#C49B27] font-mono">
                        {rsvpsList.reduce((acc, r) => acc + (r.attending ? (r.guest_count || 1) : 0), 0)}
                      </span>
                    </div>
                  </div>

                  {/* Desktop Table View */}
                  <div className="border border-zinc-200/80 rounded-2xl overflow-hidden bg-white shadow-sm overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="bg-[#FAF9F6] border-b border-zinc-200/80 text-[9px] uppercase tracking-[1px] font-bold text-[#241E1C]/65">
                          <th className="px-5 py-3.5">Guest Name</th>
                          <th className="px-5 py-3.5">Phone</th>
                          <th className="px-5 py-3.5">Email</th>
                          <th className="px-5 py-3.5 text-center">Attending</th>
                          <th className="px-5 py-3.5 text-center">Guest Count</th>
                          <th className="px-5 py-3.5">Message</th>
                          <th className="px-5 py-3.5">Submitted Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 text-xs">
                        {rsvpsList.map((rsvp, idx) => (
                          <tr key={idx} className="hover:bg-zinc-50/50 transition-colors">
                            <td className="px-5 py-3.5 font-semibold text-[#241E1C]">{rsvp.guest_name}</td>
                            <td className="px-5 py-3.5 text-slate-500 font-mono">{rsvp.phone}</td>
                            <td className="px-5 py-3.5 text-slate-450">{rsvp.email || "-"}</td>
                            <td className="px-5 py-3.5 text-center">
                              <span className={`text-[8px] font-bold uppercase tracking-[0.5px] px-2 py-0.5 rounded-full border inline-block ${
                                rsvp.attending 
                                  ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-600" 
                                  : "bg-red-500/5 border-red-500/10 text-red-600"
                              }`}>
                                {rsvp.attending ? "Yes" : "No"}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-center font-bold text-slate-600">{rsvp.attending ? rsvp.guest_count : 0}</td>
                            <td className="px-5 py-3.5 max-w-[200px] truncate text-slate-500" title={rsvp.message || undefined}>
                              {rsvp.message || <span className="text-slate-300 italic">No message</span>}
                            </td>
                            <td className="px-5 py-3.5 text-slate-450 font-mono text-[10px]">
                              {new Date(rsvp.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- RATINGS & REVIEWS MODAL (ADMIN ONLY) --- */}
      {isAdmin && ratingsProfile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 w-full max-w-3xl rounded-3xl overflow-hidden shadow-xl relative text-left flex flex-col max-h-[85vh] animate-fadeIn">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2 text-[#241E1C] uppercase tracking-[0.5px]">
                  <Star className="text-[#C49B27]" size={16} fill="#C49B27" /> Guest Ratings &amp; Reviews
                </h3>
                <p className="text-[9px] text-[#241E1C]/45 uppercase tracking-[1.5px] font-bold mt-1 font-mono">
                  Feedback for {ratingsProfile.groom} &amp; {ratingsProfile.bride} (/{ratingsProfile.id})
                </p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={`/dashboard/analytics/${ratingsProfile.id}`}
                  className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-[#C49B27] px-3.5 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-[1px] transition-all cursor-pointer"
                >
                  <BarChart2 size={12} /> Full Analytics
                </a>
                <button
                  onClick={() => setRatingsProfile(null)}
                  className="text-[#241E1C]/40 hover:text-[#241E1C] text-sm cursor-pointer p-1 font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Top Metric Header */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-[#FAF9F6] border border-amber-500/15 p-4 rounded-2xl text-center">
                  <span className="text-[8px] uppercase tracking-[1px] font-bold text-slate-400 block mb-0.5">Average Rating</span>
                  <div className="flex items-center justify-center gap-1 text-xl font-bold text-[#C49B27] font-mono">
                    <Star size={18} fill="#C49B27" />
                    <span>{ratingsProfile.avgRating || "0.0"}</span>
                    <span className="text-xs text-slate-400 font-sans">/ 5.0</span>
                  </div>
                </div>
                <div className="bg-[#FAF9F6] border border-zinc-200/50 p-4 rounded-2xl text-center">
                  <span className="text-[8px] uppercase tracking-[1px] font-bold text-slate-400 block mb-0.5">Total Ratings</span>
                  <span className="text-xl font-bold text-[#241E1C] font-mono">{ratingsProfile.ratingCount || ratingsProfile.feedbacks?.length || 0}</span>
                </div>
                <div className="bg-[#FAF9F6] border border-zinc-200/50 p-4 rounded-2xl text-center col-span-2 md:col-span-1">
                  <span className="text-[8px] uppercase tracking-[1px] font-bold text-slate-400 block mb-0.5">Reviews with Message</span>
                  <span className="text-xl font-bold text-emerald-600 font-mono">
                    {(ratingsProfile.feedbacks || []).filter((f: any) => f.feedback && f.feedback.trim()).length}
                  </span>
                </div>
              </div>

              {/* Feedback List */}
              {!ratingsProfile.feedbacks || ratingsProfile.feedbacks.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center justify-center border border-dashed border-zinc-200 rounded-3xl bg-zinc-50/50">
                  <Star className="text-zinc-300 mb-3" size={36} />
                  <h4 className="text-sm font-bold text-[#241E1C] uppercase tracking-[0.5px]">No Ratings Submitted Yet</h4>
                  <p className="text-xs text-[#241E1C]/45 max-w-xs mt-1 leading-relaxed">
                    When guests rate your invitation and leave wishes, their feedback and ratings will appear here in real-time.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#241E1C]/60">
                    All Feedback &amp; Guest Reviews ({ratingsProfile.feedbacks.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {ratingsProfile.feedbacks.map((fb: any, idx: number) => (
                      <div key={idx} className="p-4 bg-white border border-amber-500/10 hover:border-amber-500/30 rounded-2xl shadow-xs space-y-2.5 transition-all">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                          <span className="text-xs font-bold text-[#241E1C] truncate">{fb.guestName || "Guest"}</span>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={12}
                                fill={(fb.rating || 5) >= s ? "#C49B27" : "transparent"}
                                className={(fb.rating || 5) >= s ? "text-[#C49B27]" : "text-zinc-200"}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-[#241E1C]/80 italic leading-relaxed">
                          {fb.feedback ? `“${fb.feedback}”` : <span className="text-zinc-300 not-italic text-[11px]">★ Rated {fb.rating || 5} stars without written comment.</span>}
                        </p>
                        {fb.created_at && (
                          <p className="text-[9px] text-[#241E1C]/40 font-mono text-right">
                            {new Date(fb.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
