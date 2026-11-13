"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Globe,
  EyeOff,
  Eye,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { DemoShowcaseItem } from "@/lib/demo/demoService";

export default function DemoShowcaseSection() {
  const [demos, setDemos] = useState<DemoShowcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingSlug, setUpdatingSlug] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchDemos = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await fetch("/api/admin/demos");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load demo showcases");
      setDemos(data.demos || []);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load demo showcases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemos();
  }, []);

  const handleTogglePublish = async (slug: string, currentStatus: boolean) => {
    try {
      setUpdatingSlug(slug);
      setErrorMsg(null);
      const res = await fetch("/api/admin/demos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          is_published: !currentStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update demo status");

      setDemos((prev) =>
        prev.map((item) =>
          item.slug === slug ? { ...item, is_published: !currentStatus } : item
        )
      );
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update demo publication status");
    } finally {
      setUpdatingSlug(null);
    }
  };

  const handleCopyUrl = (slug: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const fullUrl = `${origin}/demo/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="bg-white border border-amber-500/15 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-lg bg-[#C49B27]/10 flex items-center justify-center text-[#C49B27]">
              <Sparkles size={14} />
            </span>
            <h3 className="text-base font-bold font-cinzel text-[#241E1C] uppercase tracking-[0.5px]">
              Demo Showcase
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[#C49B27] text-[9.5px] font-bold uppercase tracking-[1px]">
              4 Templates
            </span>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed max-w-2xl font-sans">
            Manage public read-only showcase demos for the four official wedding invitation templates.
            Publish or unpublish each demo independently and distribute shareable preview URLs.
          </p>
        </div>

        <button
          onClick={fetchDemos}
          disabled={loading}
          className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 text-zinc-600 hover:text-black hover:border-zinc-300 text-[10px] font-bold uppercase tracking-[1px] transition-colors cursor-pointer"
          title="Refresh demo statuses"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
          {errorMsg}
        </div>
      )}

      {/* Grid of 4 Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {demos.map((demo) => {
          const isUpdating = updatingSlug === demo.slug;
          const isCopied = copiedSlug === demo.slug;

          return (
            <div
              key={demo.slug}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 ${
                demo.is_published
                  ? "bg-amber-50/20 border-amber-500/20 shadow-xs"
                  : "bg-zinc-50/70 border-zinc-200 opacity-80"
              }`}
            >
              <div className="space-y-3">
                {/* Top Status Pill */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-[0.8px] border ${
                      demo.is_published
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-zinc-100 text-zinc-500 border-zinc-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        demo.is_published ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"
                      }`}
                    />
                    {demo.is_published ? "Published" : "Unpublished"}
                  </span>

                  <span className="text-[10px] text-zinc-400 font-mono">
                    /{demo.slug}
                  </span>
                </div>

                {/* Template Name & Info */}
                <div>
                  <h4 className="font-bold text-sm text-[#241E1C] font-cinzel">
                    {demo.name}
                  </h4>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-snug line-clamp-3">
                    {demo.description}
                  </p>
                </div>

                {/* Public URL badge */}
                <div className="bg-white/80 border border-zinc-200/80 rounded-xl px-2.5 py-1.5 text-[10px] font-mono text-zinc-600 truncate flex items-center justify-between">
                  <span className="truncate">/demo/{demo.slug}</span>
                  <button
                    onClick={() => handleCopyUrl(demo.slug)}
                    className="ml-2 text-zinc-400 hover:text-[#C49B27] transition-colors p-1"
                    title="Copy Public URL"
                  >
                    {isCopied ? (
                      <Check size={12} className="text-emerald-600" />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-zinc-200/60 flex items-center gap-2">
                {/* Toggle Publish / Unpublish */}
                <button
                  onClick={() => handleTogglePublish(demo.slug, demo.is_published)}
                  disabled={isUpdating}
                  className={`flex-1 py-2 px-3 rounded-xl text-[10px] font-bold uppercase tracking-[1px] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                    demo.is_published
                      ? "bg-zinc-100 hover:bg-red-50 text-zinc-700 hover:text-red-600 border border-zinc-200 hover:border-red-200"
                      : "bg-[#C49B27] hover:bg-[#B0871B] text-white"
                  }`}
                  title={demo.is_published ? "Disable public access (returns 404)" : "Enable public access"}
                >
                  {isUpdating ? (
                    <RefreshCw size={11} className="animate-spin" />
                  ) : demo.is_published ? (
                    <>
                      <EyeOff size={11} />
                      <span>Unpublish</span>
                    </>
                  ) : (
                    <>
                      <Eye size={11} />
                      <span>Publish</span>
                    </>
                  )}
                </button>

                {/* Preview Button */}
                <a
                  href={`/demo/${demo.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl border border-zinc-200 bg-white hover:bg-amber-50 text-zinc-600 hover:text-[#C49B27] transition-colors flex items-center justify-center"
                  title="Preview Demo in New Tab"
                >
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security & Sandbox Footer Callout */}
      <div className="flex items-center gap-2.5 bg-amber-50/50 border border-amber-200/50 rounded-2xl p-3 text-[11px] text-amber-900/80">
        <ShieldCheck size={16} className="text-[#C49B27] shrink-0" />
        <span className="font-sans">
          <strong>Read-Only Sandbox:</strong> Public demo showcase routes are served with safe mock data and strict server-side read-only boundaries. Visitors cannot open the editor or overwrite template records.
        </span>
      </div>
    </div>
  );
}
