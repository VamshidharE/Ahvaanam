"use client";

import React, { useState, useEffect } from "react";
import { MotionValue } from "framer-motion";

interface ProgressHudProps {
  progressValue: MotionValue<number>;
  scrollToProgress: (targetProgress: number) => void;
  showProgressHud?: boolean;
}

export const ProgressHud: React.FC<ProgressHudProps> = ({
  progressValue,
  scrollToProgress,
  showProgressHud = false,
}) => {
  const [progress, setProgress] = useState(() => progressValue.get() || 0);
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    setProgress(progressValue.get() || 0);
    const unsubscribe = progressValue.on("change", (latest) => {
      setProgress(latest);
    });
    return () => unsubscribe();
  }, [progressValue]);

  if (!showProgressHud) return null;

  const checkpoints = [
    { label: "0%", val: 0.0, desc: "Opening Scene" },
    { label: "12%", val: 0.12, desc: "Head Reveal Starts" },
    { label: "30%", val: 0.30, desc: "Mid Reveal" },
    { label: "50%", val: 0.50, desc: "Upper Body" },
    { label: "65%", val: 0.65, desc: "Fully Revealed" },
    { label: "100%", val: 1.0, desc: "Wedding Events Transition" },
  ];

  const coupleRevealStart = 0.08;
  const coupleRevealComplete = 1.0;
  const revealProgress =
    progress < coupleRevealStart
      ? 0
      : progress >= coupleRevealComplete
      ? 100
      : Math.round(
          ((progress - coupleRevealStart) /
            (coupleRevealComplete - coupleRevealStart)) *
            100
        );

  const statusLabel =
    progress < coupleRevealStart
      ? "Concealed (0%)"
      : progress >= coupleRevealComplete
      ? "Fully Visible (100%)"
      : `${revealProgress}% (Physical Rise)`;

  return (
    <aside
      aria-label="Animation Inspection Controller"
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 font-mono text-xs select-none"
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="px-3 py-1.5 rounded-lg bg-black/85 border border-[#d4af37]/60 text-[#f5ecd4] shadow-2xl backdrop-blur-md hover:bg-[#d4af37]/20 transition-colors flex items-center gap-2 cursor-pointer"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold">
          Gopuram: {(progress * 100).toFixed(1)}%
        </span>
        <span className="text-[10px] text-[#edd99e] opacity-75">
          {collapsed ? "▲ Expand" : "▼ Hide"}
        </span>
      </button>

      {!collapsed && (
        <div className="w-80 p-3.5 rounded-xl bg-black/90 border border-[#d4af37]/50 text-[#edd99e] shadow-2xl backdrop-blur-md flex flex-col gap-2.5">
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
            <span className="font-bold text-[#fff2cc] tracking-wide text-xs">
              Physical Reveal Inspector
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
              Live Link
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] bg-white/5 p-2 rounded">
            <div>
              <span className="text-gray-400 block text-[9px]">GOPURAM PROGRESS</span>
              <span className="font-bold text-white">{(progress * 100).toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[9px]">PHYSICAL REVEAL</span>
              <span
                className={`font-bold ${
                  revealProgress === 100
                    ? "text-emerald-400"
                    : revealProgress > 0
                    ? "text-amber-300"
                    : "text-gray-400"
                }`}
              >
                {statusLabel}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1 pt-1">
            <span className="text-[10px] text-gray-400">Jump to Checkpoint:</span>
            <div className="grid grid-cols-3 gap-1">
              {checkpoints.map((cp) => (
                <button
                  key={cp.val}
                  onClick={() => scrollToProgress(cp.val)}
                  className="px-1.5 py-1 rounded bg-white/10 hover:bg-[#d4af37]/30 text-[10px] text-left transition-colors truncate"
                  title={cp.desc}
                >
                  <span className="font-bold text-[#ffd700]">{cp.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
