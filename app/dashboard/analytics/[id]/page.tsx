"use client";

import React, { useState, useEffect, use } from "react";
import { 
  Eye, Users, CheckCircle, XCircle, Calendar, 
  ArrowLeft, AlertCircle, TrendingUp, Sparkles, Loader2
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface AnalyticsStats {
  totalViews: number;
  uniqueVisitors: number;
  totalRsvps: number;
  acceptedRsvps: number;
  declinedRsvps: number;
  totalGuestsAttending: number;
  lastViewed: string | null;
  lastRsvp: string | null;
}

interface ViewOverTime {
  date: string;
  views: number;
}

export default function AnalyticsDashboard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [chartData, setChartData] = useState<ViewOverTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserEmail(user.email || null);
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
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while fetching analytics.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const maxViews = Math.max(...chartData.map(d => d.views), 1);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#241E1C] flex flex-col font-sans relative overflow-hidden">
      
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-zinc-200/50 backdrop-blur-md sticky top-0 z-40 px-8 h-16 flex items-center justify-between shadow-sm">
        <div 
          className="flex items-center cursor-pointer select-none" 
          onClick={() => window.location.href = "/"}
        >
          <img src="/images/logo.png" alt="Ahvaanam" className="h-26 w-auto object-contain" />
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
            {/* Stats Dashboard Grid */}
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
                      <CheckCircle size={14} className="text-emerald-500" /> Accepted RSVPs
                    </span>
                    <span className="text-sm font-bold text-emerald-600 font-mono">{stats.acceptedRsvps}</span>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
                    <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                      <XCircle size={14} className="text-red-500" /> Declined RSVPs
                    </span>
                    <span className="text-sm font-bold text-red-500 font-mono">{stats.declinedRsvps}</span>
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
              <div className="lg:col-span-2 bg-white border border-amber-500/10 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/60 border-b border-zinc-100 pb-3 mb-6">
                    Page Views Over Time
                  </h3>
                  
                  {chartData.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center border border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50 text-center p-4">
                      <Eye size={28} className="text-zinc-300 mb-2 animate-pulse" />
                      <h4 className="text-xs font-bold text-[#241E1C]/60 uppercase tracking-[0.5px]">No Views Logged</h4>
                      <p className="text-[10px] text-slate-450 mt-1 max-w-[200px]">
                        Views over time aggregates daily traffic. Share your public link to trigger activity graphs!
                      </p>
                    </div>
                  ) : (
                    <div className="h-64 flex items-end gap-1.5 pt-6 border-b border-l border-zinc-200/80 pb-2 px-2 overflow-x-auto min-h-[220px]">
                      {chartData.map((d, idx) => {
                        const heightPct = (d.views / maxViews) * 100;
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center min-w-[40px] group relative cursor-default">
                            {/* Hover tooltip */}
                            <div className="absolute bottom-full mb-2 bg-[#241E1C] text-white text-[9px] font-bold py-1 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-10">
                              {d.views} views • {new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </div>
                            {/* Bar segment */}
                            <div 
                              className="w-full bg-[#C49B27] hover:bg-[#B0871B] rounded-t-md transition-all duration-300 shadow-sm"
                              style={{ height: `${heightPct}%`, minHeight: '4px' }}
                            />
                            {/* Date label */}
                            <span className="text-[8px] font-semibold text-slate-400 mt-2 rotate-45 origin-left translate-x-1 whitespace-nowrap pb-4">
                              {new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}

      </main>
    </div>
  );
}
