"use client";

import React, { useState, useEffect, use } from "react";
import { 
  Eye, Users, CheckCircle, XCircle, Calendar, 
  ArrowLeft, AlertCircle, TrendingUp, Sparkles, Loader2, Star, MessageSquare
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { isAdminUser } from "@/lib/auth/isAdmin";
import AdvancedAnalyticsDashboard from "@/components/admin/AdvancedAnalyticsDashboard";

interface FeedbackItem {
  id: string;
  rating: number;
  feedback: string;
  guestName: string;
  phone?: string;
  created_at: string;
}

interface AnalyticsStats {
  totalViews: number;
  uniqueVisitors: number;
  totalRsvps: number;
  acceptedRsvps: number;
  declinedRsvps: number;
  totalGuestsAttending: number;
  lastViewed: string | null;
  lastRsvp: string | null;
  totalRatings?: number;
  averageRating?: number;
}

interface ViewOverTime {
  date: string;
  views: number;
}

export default function AnalyticsDashboard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [chartData, setChartData] = useState<ViewOverTime[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserEmail(user.email || null);
        setIsAdmin(isAdminUser(user.email));
      }
    });

    fetchAnalytics();
  }, [id]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/invitation/${id}/analytics`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to load analytics statistics.");
      }

      setStats(data.statistics);
      setChartData(data.viewsOverTime || []);
      setFeedbacks(data.feedbacks || []);
      if (typeof data.isAdmin === "boolean") {
        setIsAdmin(data.isAdmin);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while fetching analytics.");
    } finally {
      setLoading(false);
    }
  };

  const [timeRange, setTimeRange] = useState<"7d" | "14d" | "30d" | "all">("14d");
  const [hoveredData, setHoveredData] = useState<{ date: string; views: number; index: number } | null>(null);

  const parseDateLabel = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split("-").map(Number);
      const dt = new Date(y, m - 1, d);
      return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const parseFullDateLabel = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split("-").map(Number);
      const dt = new Date(y, m - 1, d);
      return dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const getFilteredChartData = () => {
    if (!chartData || chartData.length === 0) return [];
    if (timeRange === "7d") return chartData.slice(-7);
    if (timeRange === "14d") return chartData.slice(-14);
    if (timeRange === "30d") return chartData.slice(-30);
    return chartData;
  };

  const currentChartData = getFilteredChartData();
  const totalPeriodViews = currentChartData.reduce((acc, d) => acc + (d.views || 0), 0);
  const peakDay = currentChartData.reduce((max, d) => (d.views > max.views ? d : max), { date: "", views: 0 });
  const maxViewsValue = Math.max(...currentChartData.map(d => d.views), 4);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#241E1C] flex flex-col font-sans relative overflow-hidden">
      
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-zinc-200/50 backdrop-blur-md sticky top-0 z-40 px-8 h-16 flex items-center justify-between shadow-sm">
        <div 
          className="flex items-center cursor-pointer select-none" 
          onClick={() => window.location.href = "/"}
        >
          <img src="/images/logo.png" alt="Ahvaanam" className="h-8 md:h-9 w-auto object-contain" />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => window.location.href = "/dashboard"}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#FAF9F6] hover:bg-zinc-100 border border-zinc-200 text-[#241E1C] text-[10px] font-bold uppercase tracking-[1px] rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft size={12} /> Dashboard
          </button>
        </div>
      </header>

      {/* --- MAIN PAGE CONTENT --- */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full z-10 space-y-8">
        
        {/* Navigation Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200/50 pb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-[0.5px] [font-family:var(--cinzel),serif] text-[#241E1C] flex items-center gap-2">
              Privacy-First Analytics <Sparkles className="text-[#C49B27]" size={20} />
            </h2>
            <p className="text-xs text-[#241E1C]/60 mt-1 font-mono uppercase tracking-[1px]">
              ID: /{id}
            </p>
          </div>
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="px-4 py-2 border border-[#C49B27]/30 text-[#C49B27] hover:bg-[#C49B27]/5 rounded-xl text-[10px] font-bold uppercase tracking-[1px] transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            {loading ? <Loader2 size={12} className="animate-spin" /> : null}
            Refresh Stats
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white border border-zinc-200/60 rounded-3xl shadow-sm">
            <Loader2 size={32} className="text-[#C49B27] animate-spin mb-3" />
            <p className="text-[#241E1C]/50 text-xs font-bold uppercase tracking-[1px]">Loading Analytics Metrics...</p>
          </div>
        ) : error ? (
          <div className="p-8 bg-red-50/5 border border-red-500/10 rounded-3xl text-center flex flex-col items-center justify-center max-w-md mx-auto space-y-4 shadow-sm">
            <AlertCircle size={36} className="text-red-500" />
            <div>
              <h4 className="font-bold text-[#241E1C]">Failed to Load Analytics</h4>
              <p className="text-xs text-slate-500 mt-1">{error}</p>
            </div>
            <button
              onClick={fetchAnalytics}
              className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-[1px] rounded-xl transition-all"
            >
              Retry
            </button>
          </div>
        ) : stats ? (
          <div className="space-y-8 animate-fadeIn">
            {/* Admin-Only Advanced Engagement Analytics (Funnel, Drop-offs, Sections, Interactions) */}
            {isAdmin && (
              <AdvancedAnalyticsDashboard invitationId={id} />
            )}

            {/* Stats Dashboard Grid (Client-Facing & Basic Analytics) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Total Views */}
              <div className="bg-white border border-amber-500/10 p-6 rounded-3xl shadow-sm flex items-center gap-4">
                <div className="p-3 bg-amber-500/5 text-[#C49B27] rounded-2xl border border-amber-500/10">
                  <Eye size={20} />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-[1px] font-bold text-slate-400 block mb-0.5">Total Views</span>
                  <span className="text-2xl font-bold text-[#241E1C] font-mono">{stats.totalViews}</span>
                </div>
              </div>

              {/* Unique Visitors */}
              <div className="bg-white border border-amber-500/10 p-6 rounded-3xl shadow-sm flex items-center gap-4">
                <div className="p-3 bg-indigo-500/5 text-indigo-500 rounded-2xl border border-indigo-500/10">
                  <Users size={20} />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-[1px] font-bold text-slate-400 block mb-0.5">Unique Visitors</span>
                  <span className="text-2xl font-bold text-[#241E1C] font-mono">{stats.uniqueVisitors}</span>
                </div>
              </div>

              {/* Total RSVPs */}
              <div className="bg-white border border-amber-500/10 p-6 rounded-3xl shadow-sm flex items-center gap-4">
                <div className="p-3 bg-sky-500/5 text-sky-500 rounded-2xl border border-sky-500/10">
                  <Users size={20} />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-[1px] font-bold text-slate-400 block mb-0.5">Total RSVPs</span>
                  <span className="text-2xl font-bold text-[#241E1C] font-mono">{stats.totalRsvps}</span>
                </div>
              </div>

              {/* Attending Guests */}
              <div className="bg-white border border-amber-500/10 p-6 rounded-3xl shadow-sm flex items-center gap-4">
                <div className="p-3 bg-emerald-500/5 text-emerald-600 rounded-2xl border border-emerald-500/10">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-[1px] font-bold text-slate-400 block mb-0.5">Attending Guests</span>
                  <span className="text-2xl font-bold text-[#241E1C] font-mono">{stats.totalGuestsAttending}</span>
                </div>
              </div>
            </div>

            {/* Split row: Secondary stats card & Chart */}
            <div className="grid lg:grid-cols-3 gap-6">
              
              {/* Secondary Stats */}
              <div className="bg-white border border-amber-500/10 p-6 rounded-3xl shadow-sm flex flex-col justify-between space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/60 border-b border-zinc-100 pb-3">Response Breakdown</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
                    <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                      <CheckCircle size={14} className="text-emerald-500" /> Attending Guests
                    </span>
                    <span className="text-sm font-bold text-emerald-600 font-mono">{stats.totalGuestsAttending || stats.acceptedRsvps}</span>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
                    <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                      <Users size={14} className="text-sky-500" /> Confirmed Responses
                    </span>
                    <span className="text-sm font-bold text-sky-600 font-mono">{stats.acceptedRsvps || stats.totalRsvps}</span>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
                    <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                      <Calendar size={14} className="text-amber-500" /> Last Viewed
                    </span>
                    <span className="text-[10px] font-bold text-slate-700 font-mono">{formatDate(stats.lastViewed)}</span>
                  </div>

                  <div className="flex justify-between items-center pb-1">
                    <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                      <Calendar size={14} className="text-[#C49B27]" /> Last RSVP Received
                    </span>
                    <span className="text-[10px] font-bold text-slate-700 font-mono">{formatDate(stats.lastRsvp)}</span>
                  </div>
                </div>

                <div className="text-[9px] text-[#241E1C]/40 bg-[#FAF9F6] border border-zinc-200/50 p-3 rounded-2xl font-sans italic leading-relaxed text-center">
                  ⚠️ Ahvaanam does not track IP addresses, browser features, operating systems, referrers, or locations to guarantee guest privacy.
                </div>
              </div>

              {/* Custom SVG line/bar chart for Views Over Time */}
              <div className="lg:col-span-2 bg-white border border-amber-500/10 p-6 rounded-3xl shadow-sm flex flex-col justify-between space-y-6">
                <div>
                  {/* Chart Header with Title and Range Selectors */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4 mb-5">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C] flex items-center gap-2">
                        <TrendingUp size={15} className="text-[#C49B27]" />
                        Page Views Activity
                      </h3>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                        Daily visitor traffic progression over time
                      </p>
                    </div>

                    {/* Time Range Filter Pills */}
                    <div className="flex items-center gap-1 bg-[#FAF9F6] p-1 rounded-xl border border-zinc-200/60 self-start sm:self-auto">
                      {(["7d", "14d", "30d", "all"] as const).map((r) => (
                        <button
                          key={r}
                          onClick={() => setTimeRange(r)}
                          className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.5px] rounded-lg transition-all cursor-pointer ${
                            timeRange === r
                              ? "bg-[#C49B27] text-white shadow-xs"
                              : "text-slate-500 hover:text-[#241E1C] hover:bg-zinc-100"
                          }`}
                        >
                          {r === "7d" ? "7 Days" : r === "14d" ? "14 Days" : r === "30d" ? "30 Days" : "All Time"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary Metric Badges */}
                  <div className="grid grid-cols-3 gap-3 mb-6 bg-[#FAF9F6] p-3 rounded-2xl border border-zinc-200/50">
                    <div className="text-center sm:text-left">
                      <span className="text-[8.5px] uppercase font-bold text-slate-400 block tracking-[0.5px]">Period Views</span>
                      <span className="text-sm sm:text-base font-bold text-[#241E1C] font-mono">
                        {currentChartData.reduce((acc, d) => acc + (d.views || 0), 0)}
                      </span>
                    </div>
                    <div className="text-center sm:text-left border-x border-zinc-200/60 px-2">
                      <span className="text-[8.5px] uppercase font-bold text-slate-400 block tracking-[0.5px]">Daily Average</span>
                      <span className="text-sm sm:text-base font-bold text-[#C49B27] font-mono">
                        {currentChartData.length > 0 
                          ? (currentChartData.reduce((acc, d) => acc + (d.views || 0), 0) / currentChartData.length).toFixed(1)
                          : "0.0"}
                        <span className="text-[9px] font-normal text-slate-400 font-sans ml-1">/day</span>
                      </span>
                    </div>
                    <div className="text-center sm:text-left">
                      <span className="text-[8.5px] uppercase font-bold text-slate-400 block tracking-[0.5px]">Peak Day</span>
                      <span className="text-sm sm:text-base font-bold text-[#241E1C] font-mono">
                        {peakDay.views > 0 ? (
                          <>
                            {peakDay.views} <span className="text-[9px] font-normal text-slate-400 font-sans">({parseDateLabel(peakDay.date)})</span>
                          </>
                        ) : (
                          "0"
                        )}
                      </span>
                    </div>
                  </div>

                  {currentChartData.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center border border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50 text-center p-4">
                      <Eye size={28} className="text-zinc-300 mb-2 animate-pulse" />
                      <h4 className="text-xs font-bold text-[#241E1C]/60 uppercase tracking-[0.5px]">No Views Logged</h4>
                      <p className="text-[10px] text-slate-400 mt-1 max-w-[200px]">
                        Views over time aggregates daily traffic. Share your public link to trigger activity graphs!
                      </p>
                    </div>
                  ) : (
                    <div className="relative pt-2">
                      {/* Plotting Box with Y-Axis */}
                      <div className="flex gap-2.5">
                        
                        {/* Y-Axis scale marks */}
                        <div className="flex flex-col justify-between h-56 text-[8.5px] font-mono text-slate-400 text-right w-6 py-0.5 select-none shrink-0">
                          <span>{maxViewsValue}</span>
                          <span>{Math.round(maxViewsValue * 0.75)}</span>
                          <span>{Math.round(maxViewsValue * 0.5)}</span>
                          <span>{Math.round(maxViewsValue * 0.25)}</span>
                          <span>0</span>
                        </div>

                        {/* Chart Canvas Area */}
                        <div className="relative flex-1 h-56 border-b border-l border-zinc-200/80">
                          
                          {/* Horizontal Gridlines */}
                          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                            <div className="w-full border-b border-dashed border-zinc-200/60" />
                            <div className="w-full border-b border-dashed border-zinc-200/60" />
                            <div className="w-full border-b border-dashed border-zinc-200/60" />
                            <div className="w-full border-b border-dashed border-zinc-200/60" />
                            <div className="w-full border-b border-zinc-200/80" />
                          </div>

                          {/* SVG Area & Trend Line Layer */}
                          {currentChartData.length > 1 && (
                            <svg
                              className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                              viewBox="0 0 100 100"
                              preserveAspectRatio="none"
                            >
                              <defs>
                                <linearGradient id="goldAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#C49B27" stopOpacity="0.28" />
                                  <stop offset="100%" stopColor="#C49B27" stopOpacity="0.0" />
                                </linearGradient>
                              </defs>

                              {/* Filled Gradient Area */}
                              <polygon
                                points={`0,100 ${currentChartData.map((d, i) => {
                                  const x = (i / (currentChartData.length - 1)) * 100;
                                  const y = 100 - (d.views / maxViewsValue) * 92 - 4;
                                  return `${x},${y}`;
                                }).join(" ")} 100,100`}
                                fill="url(#goldAreaGrad)"
                              />

                              {/* Smooth Trend Line */}
                              <polyline
                                points={currentChartData.map((d, i) => {
                                  const x = (i / (currentChartData.length - 1)) * 100;
                                  const y = 100 - (d.views / maxViewsValue) * 92 - 4;
                                  return `${x},${y}`;
                                }).join(" ")}
                                fill="none"
                                stroke="#C49B27"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="opacity-75"
                              />
                            </svg>
                          )}

                          {/* Interactive Vertical Dynamic Bars */}
                          <div className="absolute inset-0 flex items-end justify-between px-1 gap-1 sm:gap-1.5 z-10">
                            {currentChartData.map((d, idx) => {
                              const heightPct = Math.max((d.views / maxViewsValue) * 100, d.views > 0 ? 8 : 2);
                              const isHovered = hoveredData?.index === idx;

                              return (
                                <div
                                  key={idx}
                                  onMouseEnter={() => setHoveredData({ date: d.date, views: d.views, index: idx })}
                                  onMouseLeave={() => setHoveredData(null)}
                                  className="h-full flex-1 flex flex-col justify-end items-center relative group cursor-pointer"
                                >
                                  {/* Hover Column Glow Backdrop */}
                                  <div className={`absolute inset-y-0 inset-x-[-2px] rounded-lg transition-colors pointer-events-none ${
                                    isHovered ? "bg-[#C49B27]/10" : "group-hover:bg-[#C49B27]/5"
                                  }`} />

                                  {/* Floating Rich Tooltip */}
                                  <div className={`absolute bottom-full mb-3 z-30 pointer-events-none transition-all duration-200 bg-[#241E1C] text-white p-2.5 rounded-xl shadow-xl border border-white/10 min-w-[120px] text-center ${
                                    isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
                                  }`}>
                                    <span className="text-[12px] font-bold text-[#F3CF65] font-mono flex items-center justify-center gap-1">
                                      <Eye size={12} className="text-[#C49B27]" /> {d.views} {d.views === 1 ? "view" : "views"}
                                    </span>
                                    <span className="text-[9px] text-slate-300 block mt-0.5">
                                      {parseFullDateLabel(d.date)}
                                    </span>
                                    {totalPeriodViews > 0 && (
                                      <span className="text-[8px] text-[#C49B27] font-semibold block mt-0.5 border-t border-white/10 pt-1">
                                        {((d.views / totalPeriodViews) * 100).toFixed(0)}% of traffic
                                      </span>
                                    )}
                                  </div>

                                  {/* Visual Bar Segment */}
                                  <div
                                    className={`w-full max-w-[28px] rounded-t-md transition-all duration-300 shadow-xs relative ${
                                      d.views > 0
                                        ? isHovered
                                          ? "bg-gradient-to-t from-[#B0871B] via-[#C49B27] to-[#FFD700] ring-2 ring-[#C49B27]/60 shadow-[0_0_12px_rgba(196,155,39,0.5)]"
                                          : "bg-gradient-to-t from-[#C49B27] via-[#D4AF37] to-[#F3CF65] hover:brightness-110"
                                        : "bg-zinc-200/80 group-hover:bg-zinc-300"
                                    }`}
                                    style={{
                                      height: `${heightPct}%`,
                                      minHeight: d.views > 0 ? "10px" : "3px",
                                    }}
                                  >
                                    {/* Glowing top cap on active bars */}
                                    {d.views > 0 && (
                                      <div className="absolute top-0 inset-x-0 h-1 bg-white/40 rounded-t-md" />
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                        </div>
                      </div>

                      {/* X-Axis Date Labels */}
                      <div className="flex justify-between pl-8.5 pr-1 mt-3 overflow-hidden select-none">
                        {currentChartData.map((d, idx) => {
                          // Show label at reasonable intervals based on length
                          const step = currentChartData.length > 20 ? 4 : currentChartData.length > 10 ? 2 : 1;
                          const showLabel = idx % step === 0 || idx === currentChartData.length - 1;

                          return (
                            <div key={idx} className="flex-1 text-center min-w-0">
                              {showLabel ? (
                                <span className="text-[8.5px] font-semibold text-slate-400 block truncate">
                                  {parseDateLabel(d.date)}
                                </span>
                              ) : (
                                <span className="text-[8px] text-zinc-300 block">·</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* --- GUEST RATINGS & FEEDBACK SECTION (ADMIN ONLY) --- */}
            {isAdmin && (
              <div className="bg-white border border-amber-500/10 p-6 rounded-3xl shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-500/10 text-[#C49B27] rounded-2xl border border-amber-500/20">
                      <Star size={20} fill="#C49B27" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-[1.5px] text-[#241E1C]">Guest Ratings &amp; Feedback</h3>
                      <p className="text-[10px] text-slate-400 font-medium">Ratings and wishes submitted by guests via the invitation footer</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-amber-500/5 px-4 py-2.5 rounded-2xl border border-amber-500/15">
                    <div className="text-right">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Average Rating</span>
                      <span className="text-lg font-bold text-[#C49B27] font-mono">{stats.averageRating || 5.0} / 5.0</span>
                    </div>
                    <div className="flex text-[#C49B27]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={16}
                          fill={s <= Math.round(stats.averageRating || 5) ? "#C49B27" : "transparent"}
                          color="#C49B27"
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold font-mono">({stats.totalRatings || feedbacks.length} total)</span>
                  </div>
                </div>

                {feedbacks.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center border border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50 text-center p-6">
                    <MessageSquare size={28} className="text-zinc-300 mb-2 animate-pulse" />
                    <h4 className="text-xs font-bold text-[#241E1C]/60 uppercase tracking-[0.5px]">No Feedback Submitted Yet</h4>
                    <p className="text-[10px] text-slate-450 mt-1 max-w-[260px]">
                      When guests view your invitation and submit star ratings or written messages in the footer, they will appear here in real-time.
                    </p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {feedbacks.map((fb) => (
                      <div key={fb.id} className="bg-[#FAF9F6] border border-zinc-200/70 p-4 rounded-2xl space-y-2.5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs font-bold text-[#241E1C] block">{fb.guestName || "Anonymous Guest"}</span>
                              {fb.phone && (
                                <span className="text-[10px] text-slate-400 font-mono block">{fb.phone}</span>
                              )}
                            </div>
                            <div className="flex text-[#C49B27]">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  size={12}
                                  fill={s <= fb.rating ? "#C49B27" : "transparent"}
                                  color="#C49B27"
                                />
                              ))}
                            </div>
                          </div>
                          {fb.feedback && (
                            <p className="text-xs text-[#241E1C]/80 mt-2 font-serif italic bg-white p-2.5 rounded-xl border border-zinc-200/50">
                              &ldquo;{fb.feedback}&rdquo;
                            </p>
                          )}
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono self-end">
                          {new Date(fb.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null}

      </main>
    </div>
  );
}
