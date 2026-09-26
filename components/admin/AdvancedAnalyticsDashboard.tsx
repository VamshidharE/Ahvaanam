"use client";

import React, { useState, useEffect } from "react";
import {
  Eye,
  Users,
  Clock,
  ArrowDown,
  TrendingDown,
  Sparkles,
  Music,
  Image as ImageIcon,
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Share2,
  Smartphone,
  Monitor,
  Tablet,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Sliders,
  Layers,
  BarChart3,
  Percent,
} from "lucide-react";
import { AdvancedAnalyticsResponse } from "@/lib/analytics/types";

interface AdvancedAnalyticsDashboardProps {
  invitationId: string;
}

export default function AdvancedAnalyticsDashboard({
  invitationId,
}: AdvancedAnalyticsDashboardProps) {
  const [data, setData] = useState<AdvancedAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "funnel" | "sections" | "interactions">(
    "overview"
  );

  const fetchDetailedAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/invitation/${invitationId}/analytics/detailed`);
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to load detailed engagement analytics.");
      }

      setData(result);
    } catch (err: any) {
      setError(err.message || "Failed to retrieve engagement analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetailedAnalytics();
  }, [invitationId]);

  const formatDuration = (seconds: number): string => {
    if (!seconds || seconds <= 0) return "0s";
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const remainingSecs = seconds % 60;
    return remainingSecs > 0 ? `${mins}m ${remainingSecs}s` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white border border-zinc-200/60 rounded-3xl shadow-sm">
        <Loader2 size={32} className="text-[#C49B27] animate-spin mb-3" />
        <p className="text-[#241E1C]/50 text-xs font-bold uppercase tracking-[1px]">
          Computing Detailed Engagement Analytics...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 bg-red-50/5 border border-red-500/10 rounded-3xl text-center flex flex-col items-center justify-center max-w-md mx-auto space-y-4 shadow-sm">
        <AlertTriangle size={36} className="text-red-500" />
        <div>
          <h4 className="font-bold text-[#241E1C]">Failed to Load Engagement Metrics</h4>
          <p className="text-xs text-slate-500 mt-1">{error || "No data available."}</p>
        </div>
        <button
          onClick={fetchDetailedAnalytics}
          className="px-5 py-2 bg-[#C49B27] hover:bg-[#B0871B] text-white font-bold text-xs uppercase tracking-[1px] rounded-xl transition-all cursor-pointer shadow-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  const { overview, funnel, sections, interactions, devices, highestDropOffSection } = data;
  const totalDeviceVisits = devices.mobile + devices.desktop + devices.tablet || 1;

  return (
    <div className="space-y-8 animate-fadeIn text-left">
      {/* Header with Title and Tab Navigation */}
      <div className="bg-white border border-amber-500/10 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] uppercase tracking-[1.5px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#C49B27]">
              Admin Only Analytics
            </span>
            <span className="text-[9px] uppercase tracking-[1.5px] font-mono text-slate-400">
              /{invitationId}
            </span>
          </div>
          <h3 className="text-lg font-bold [font-family:var(--cinzel),serif] text-[#241E1C] mt-1.5 flex items-center gap-2">
            Invitation Engagement &amp; Drop-off Analytics <Sparkles className="text-[#C49B27]" size={16} />
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-2xl mt-0.5">
            Deep visitor journey metrics, scroll funnel progression, dynamic section drop-off points, and interactive engagement logs.
          </p>
        </div>

        {/* Tab Switcher & Refresh Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-[#FAF9F6] border border-zinc-200/80 p-1 rounded-2xl">
            {(
              [
                { id: "overview", label: "Overview", icon: BarChart3 },
                { id: "funnel", label: "Funnel", icon: TrendingDown },
                { id: "sections", label: "Sections", icon: Layers },
                { id: "interactions", label: "Interactions", icon: Sliders },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.5px] transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#C49B27] text-white shadow-xs"
                      : "text-slate-500 hover:text-[#241E1C] hover:bg-zinc-100"
                  }`}
                >
                  <Icon size={12} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={fetchDetailedAnalytics}
            className="p-2 border border-zinc-200 hover:border-[#C49B27]/40 text-[#241E1C]/70 hover:text-[#C49B27] bg-[#FAF9F6] hover:bg-white rounded-xl transition-all cursor-pointer"
            title="Refresh engagement data"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* --- TAB 1: OVERVIEW METRICS GRID --- */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-fadeIn">
          {overview.uniqueSessions === 0 && (
            <div className="bg-amber-50/60 border border-amber-500/20 p-4 rounded-2xl flex items-center gap-3">
              <Sparkles className="text-[#C49B27] shrink-0" size={18} />
              <p className="text-xs text-amber-900 leading-relaxed">
                <strong>Live Session Tracking Active:</strong> Engagement dwell times, scroll reach milestones, section funnel, and interaction counts will update live in real-time as visitors open and scroll through this invitation.
              </p>
            </div>
          )}

          {/* Top Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Views */}
            <div className="bg-white border border-amber-500/10 p-5 rounded-3xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] uppercase tracking-[1.5px] font-bold text-slate-400">
                  Total Views
                </span>
                <div className="p-2 bg-amber-500/5 text-[#C49B27] rounded-xl border border-amber-500/10">
                  <Eye size={16} />
                </div>
              </div>
              <div className="text-2xl font-bold font-mono text-[#241E1C]">{overview.totalViews}</div>
              <span className="text-[9px] text-slate-400 font-medium mt-1 block">
                Total page loads recorded
              </span>
            </div>

            {/* Unique Sessions */}
            <div className="bg-white border border-amber-500/10 p-5 rounded-3xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] uppercase tracking-[1.5px] font-bold text-slate-400">
                  Unique Sessions
                </span>
                <div className="p-2 bg-indigo-500/5 text-indigo-500 rounded-xl border border-indigo-500/10">
                  <Users size={16} />
                </div>
              </div>
              <div className="text-2xl font-bold font-mono text-[#241E1C]">
                {overview.uniqueSessions}
              </div>
              <span className="text-[9px] text-slate-400 font-medium mt-1 block">
                Distinct visitor browser sessions
              </span>
            </div>

            {/* Engaged Visits */}
            <div className="bg-white border border-amber-500/10 p-5 rounded-3xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] uppercase tracking-[1.5px] font-bold text-slate-400">
                  Engaged Visits
                </span>
                <div className="p-2 bg-emerald-500/5 text-emerald-600 rounded-xl border border-emerald-500/10">
                  <Sparkles size={16} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-emerald-600">
                  {overview.engagedVisits}
                </span>
                <span className="text-xs font-bold text-emerald-600 font-mono">
                  ({overview.engagementRate}%)
                </span>
              </div>
              <span className="text-[9px] text-slate-400 font-medium mt-1 block">
                &ge; 10s active &amp; &ge; 25% scroll reach
              </span>
            </div>

            {/* Avg Engagement Time */}
            <div className="bg-white border border-amber-500/10 p-5 rounded-3xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] uppercase tracking-[1.5px] font-bold text-slate-400">
                  Avg Time Spent
                </span>
                <div className="p-2 bg-sky-500/5 text-sky-600 rounded-xl border border-sky-500/10">
                  <Clock size={16} />
                </div>
              </div>
              <div className="text-2xl font-bold font-mono text-[#241E1C]">
                {formatDuration(overview.averageEngagementTime)}
              </div>
              <span className="text-[9px] text-slate-400 font-medium mt-1 block">
                Mean active dwell duration
              </span>
            </div>
          </div>

          {/* Secondary KPIs: Scroll Reach & Completion */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Scroll Reach Milestones Summary */}
            <div className="lg:col-span-2 bg-white border border-amber-500/10 p-6 rounded-3xl shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h4 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C] flex items-center gap-2">
                  <Percent size={14} className="text-[#C49B27]" /> Scroll Depth Distribution
                </h4>
                <span className="text-[9px] font-mono font-bold text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded-md">
                  Avg Depth: {overview.averageScrollDepth}%
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                {[
                  { label: "25% Reach", count: overview.scrollReach.reach25, pct: 25 },
                  { label: "50% Reach", count: overview.scrollReach.reach50, pct: 50 },
                  { label: "75% Reach", count: overview.scrollReach.reach75, pct: 75 },
                  { label: "90% Reach", count: overview.scrollReach.reach90, pct: 90 },
                  { label: "100% Bottom", count: overview.scrollReach.reach100, pct: 100 },
                ].map((m) => {
                  const reachPct = Number(
                    ((m.count / Math.max(overview.uniqueSessions, 1)) * 100).toFixed(0)
                  );
                  return (
                    <div
                      key={m.label}
                      className="bg-[#FAF9F6] border border-zinc-200/70 p-3.5 rounded-2xl text-center space-y-1.5"
                    >
                      <span className="text-[9px] font-bold uppercase tracking-[1px] text-slate-400 block">
                        {m.label}
                      </span>
                      <div className="text-base font-bold font-mono text-[#241E1C]">{m.count}</div>
                      <div className="w-full bg-zinc-200/80 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#C49B27] h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, reachPct)}%` }}
                        />
                      </div>
                      <span className="text-[8.5px] font-bold text-[#C49B27] font-mono block">
                        {reachPct}% of visitors
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Devices & Completion Card */}
            <div className="bg-white border border-amber-500/10 p-6 rounded-3xl shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C] border-b border-zinc-100 pb-3 flex items-center justify-between">
                  <span>Device Breakdown</span>
                  <span className="text-[9px] font-mono text-emerald-600 font-bold">
                    {overview.completionRate}% Completed
                  </span>
                </h4>

                <div className="space-y-3 mt-4">
                  {/* Mobile */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-slate-600 font-medium">
                      <Smartphone size={14} className="text-[#C49B27]" /> Mobile
                    </span>
                    <span className="font-mono font-bold text-[#241E1C]">
                      {devices.mobile}{" "}
                      <span className="text-[9px] text-slate-400 font-normal">
                        ({((devices.mobile / totalDeviceVisits) * 100).toFixed(0)}%)
                      </span>
                    </span>
                  </div>

                  {/* Desktop */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-slate-600 font-medium">
                      <Monitor size={14} className="text-indigo-500" /> Desktop
                    </span>
                    <span className="font-mono font-bold text-[#241E1C]">
                      {devices.desktop}{" "}
                      <span className="text-[9px] text-slate-400 font-normal">
                        ({((devices.desktop / totalDeviceVisits) * 100).toFixed(0)}%)
                      </span>
                    </span>
                  </div>

                  {/* Tablet */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-slate-600 font-medium">
                      <Tablet size={14} className="text-sky-500" /> Tablet
                    </span>
                    <span className="font-mono font-bold text-[#241E1C]">
                      {devices.tablet}{" "}
                      <span className="text-[9px] text-slate-400 font-normal">
                        ({((devices.tablet / totalDeviceVisits) * 100).toFixed(0)}%)
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {highestDropOffSection && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-2.5">
                  <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-[10px] text-amber-900 leading-tight">
                    <strong className="block font-bold">Largest Drop-off Area:</strong>
                    Visitors drop off most at{" "}
                    <span className="font-bold underline">{highestDropOffSection.label}</span> (-
                    {highestDropOffSection.dropOffFromPrevious} visitors).
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: VISITOR ENGAGEMENT FUNNEL --- */}
      {activeTab === "funnel" && (
        <div className="bg-white border border-amber-500/10 p-6 md:p-8 rounded-3xl shadow-sm space-y-6 animate-fadeIn">
          <div className="border-b border-zinc-100 pb-4">
            <h4 className="text-sm font-bold uppercase tracking-[1.5px] text-[#241E1C] flex items-center gap-2">
              <TrendingDown size={16} className="text-[#C49B27]" />
              Visitor Engagement Funnel
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Step-by-step conversion and drop-off rate as guests scroll from the hero banner down to the invitation bottom.
            </p>
          </div>

          {/* Visual Funnel Step Cards */}
          <div className="space-y-3 max-w-3xl mx-auto">
            {funnel.map((step, idx) => {
              const isLast = idx === funnel.length - 1;
              return (
                <div key={step.milestone} className="space-y-2">
                  <div className="bg-[#FAF9F6] border border-zinc-200/80 p-4 rounded-2xl shadow-xs transition-all hover:border-[#C49B27]/40">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#C49B27] text-white flex items-center justify-center text-[10px] font-bold font-mono">
                          {idx + 1}
                        </span>
                        <div>
                          <h5 className="text-xs font-bold text-[#241E1C] uppercase tracking-[0.5px]">
                            {step.label}
                          </h5>
                          <span className="text-[9px] text-slate-400 font-mono">
                            Milestone: {step.percent}%
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-bold font-mono text-[#241E1C]">
                          {step.count}
                        </span>
                        <span className="text-[10px] font-bold text-[#C49B27] font-mono ml-2">
                          ({step.conversionRate}%)
                        </span>
                        {idx > 0 && step.dropOffRate > 0 && (
                          <span className="text-[9px] text-red-500 font-semibold block font-mono">
                            -{step.dropOffRate}% drop-off
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-zinc-200/80 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#B0871B] to-[#C49B27] h-full rounded-full transition-all duration-700"
                        style={{ width: `${Math.max(2, step.conversionRate)}%` }}
                      />
                    </div>
                  </div>

                  {!isLast && (
                    <div className="flex justify-center my-0.5">
                      <ArrowDown size={14} className="text-[#C49B27]/60" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- TAB 3: DYNAMIC SECTION ENGAGEMENT --- */}
      {activeTab === "sections" && (
        <div className="bg-white border border-amber-500/10 p-6 md:p-8 rounded-3xl shadow-sm space-y-6 animate-fadeIn">
          <div className="border-b border-zinc-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-[1.5px] text-[#241E1C] flex items-center gap-2">
                <Layers size={16} className="text-[#C49B27]" />
                Dynamic Section-Level Engagement
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Visitor reach across individual template sections, automatically discovered from invitation structure.
              </p>
            </div>

            {highestDropOffSection && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1.5 self-start sm:self-auto">
                <AlertTriangle size={13} className="text-rose-600" />
                <span>Largest Drop-off: {highestDropOffSection.label}</span>
              </div>
            )}
          </div>

          {/* Section Progress Rows */}
          <div className="space-y-4">
            {sections.map((sec, idx) => (
              <div
                key={sec.sectionId}
                className={`p-4 rounded-2xl border transition-all ${
                  sec.isHighestDropOff
                    ? "bg-amber-50/50 border-amber-400/60 ring-1 ring-amber-400/30"
                    : "bg-[#FAF9F6] border-zinc-200/70 hover:border-zinc-300"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center text-[9px] font-bold font-mono">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-[#241E1C] [font-family:var(--cinzel),serif]">
                        {sec.label}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono ml-2">
                        #{sec.sectionId}
                      </span>
                    </div>

                    {sec.isHighestDropOff && (
                      <span className="text-[8.5px] uppercase font-bold tracking-[0.5px] bg-red-500 text-white px-2 py-0.5 rounded-full">
                        Peak Drop-off
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-xs font-bold font-mono text-[#241E1C]">
                        {sec.viewCount} visitors
                      </span>
                      <span className="text-[10px] font-bold font-mono text-[#C49B27] ml-1.5">
                        ({sec.percentage}%)
                      </span>
                    </div>
                    {idx > 0 && (
                      <div className="text-[9px] font-mono text-slate-400 min-w-[70px]">
                        {sec.dropOffFromPrevious > 0 ? (
                          <span className="text-red-500 font-semibold">
                            -{sec.dropOffFromPrevious} visitors
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-semibold">No drop</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-zinc-200/80 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      sec.isHighestDropOff
                        ? "bg-amber-600"
                        : "bg-gradient-to-r from-[#C49B27] to-[#D4AF37]"
                    }`}
                    style={{ width: `${Math.max(2, sec.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 4: INTERACTION ANALYTICS MATRIX --- */}
      {activeTab === "interactions" && (
        <div className="bg-white border border-amber-500/10 p-6 md:p-8 rounded-3xl shadow-sm space-y-6 animate-fadeIn">
          <div className="border-b border-zinc-100 pb-4">
            <h4 className="text-sm font-bold uppercase tracking-[1.5px] text-[#241E1C] flex items-center gap-2">
              <Sliders size={16} className="text-[#C49B27]" />
              Invitation Interaction Heatmap
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Meaningful actions taken by visitors without modifying public invitation behavior.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Music Played */}
            <div className="bg-[#FAF9F6] border border-zinc-200/70 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-[#C49B27]">
                <Music size={16} />
                <span className="text-[10px] font-bold uppercase tracking-[1px] text-slate-500">
                  Music Played
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-[#241E1C]">
                {interactions.musicPlayed}
              </div>
              <span className="text-[8.5px] text-slate-400">Theme audio play triggers</span>
            </div>

            {/* Gallery Opened */}
            <div className="bg-[#FAF9F6] border border-zinc-200/70 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-indigo-500">
                <ImageIcon size={16} />
                <span className="text-[10px] font-bold uppercase tracking-[1px] text-slate-500">
                  Gallery Lightbox
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-[#241E1C]">
                {interactions.galleryOpened}
              </div>
              <span className="text-[8.5px] text-slate-400">Photo lightbox openings</span>
            </div>

            {/* Gallery Images Viewed */}
            <div className="bg-[#FAF9F6] border border-zinc-200/70 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-indigo-500">
                <Eye size={16} />
                <span className="text-[10px] font-bold uppercase tracking-[1px] text-slate-500">
                  Photos Inspected
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-[#241E1C]">
                {interactions.galleryImagesViewed}
              </div>
              <span className="text-[8.5px] text-slate-400">Individual photos clicked</span>
            </div>

            {/* Map / Venue Clicked */}
            <div className="bg-[#FAF9F6] border border-zinc-200/70 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-rose-500">
                <MapPin size={16} />
                <span className="text-[10px] font-bold uppercase tracking-[1px] text-slate-500">
                  Venue &amp; Maps
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-[#241E1C]">
                {interactions.mapClicked}
              </div>
              <span className="text-[8.5px] text-slate-400">Google Maps navigation clicks</span>
            </div>

            {/* WhatsApp Clicked */}
            <div className="bg-[#FAF9F6] border border-zinc-200/70 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-[#25D366]">
                <MessageCircle size={16} />
                <span className="text-[10px] font-bold uppercase tracking-[1px] text-slate-500">
                  WhatsApp Clicks
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-[#241E1C]">
                {interactions.whatsappClicked}
              </div>
              <span className="text-[8.5px] text-slate-400">Direct WhatsApp messenger taps</span>
            </div>

            {/* Phone / Contact Clicked */}
            <div className="bg-[#FAF9F6] border border-zinc-200/70 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-sky-500">
                <Phone size={16} />
                <span className="text-[10px] font-bold uppercase tracking-[1px] text-slate-500">
                  Phone / Contacts
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-[#241E1C]">
                {interactions.contactClicked}
              </div>
              <span className="text-[8.5px] text-slate-400">Telephone calls initiated</span>
            </div>

            {/* RSVP Opened */}
            <div className="bg-[#FAF9F6] border border-zinc-200/70 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-amber-600">
                <Mail size={16} />
                <span className="text-[10px] font-bold uppercase tracking-[1px] text-slate-500">
                  RSVP Started
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-[#241E1C]">
                {interactions.rsvpOpened}
              </div>
              <span className="text-[8.5px] text-slate-400">Initial RSVP button taps</span>
            </div>

            {/* RSVP Submitted */}
            <div className="bg-[#FAF9F6] border border-zinc-200/70 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 size={16} />
                <span className="text-[10px] font-bold uppercase tracking-[1px] text-slate-500">
                  RSVP Confirmed
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-600">
                {interactions.rsvpSubmitted}
              </div>
              <span className="text-[8.5px] text-slate-400">Attendance confirmations</span>
            </div>

            {/* Share Clicked */}
            <div className="bg-[#FAF9F6] border border-zinc-200/70 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-purple-500">
                <Share2 size={16} />
                <span className="text-[10px] font-bold uppercase tracking-[1px] text-slate-500">
                  Share Links
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-[#241E1C]">
                {interactions.shareClicked}
              </div>
              <span className="text-[8.5px] text-slate-400">Social share link triggers</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
