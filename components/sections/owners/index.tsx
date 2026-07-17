"use client";

import React from "react";
import LayoutWrapper from "@/components/layouts/LayoutWrapper";
import MotionWrapper from "@/components/motion/MotionWrapper";

interface OwnersProps {
  bindings: {
    title?: string;
    owner1Name?: string;
    owner1Bio?: string;
    owner2Name?: string;
    owner2Bio?: string;
    introText?: string;
  };
  layoutId?: string;
  motionId?: string;
}

export default function OwnersSection({ bindings, layoutId, motionId }: OwnersProps) {
  const {
    title = "Home Owners",
    owner1Name = "Sri Venkateswara Rao",
    owner1Bio = "Excited to welcome you all to our dream nest built with love and hard work.",
    owner2Name = "Smt. Lakshmi Prasanna",
    owner2Bio = "Grateful for the support of family and friends as we begin this new chapter.",
    introText = "Welcome to our new home!"
  } = bindings;

  return (
    <MotionWrapper 
      motionId={motionId} 
      defaultMotionId="luxury-motion" 
      type="reveal" 
      className="w-full"
    >
      <LayoutWrapper
        layoutId={layoutId}
        defaultLayoutId="story-stack"
        className="py-24 px-6 max-w-5xl mx-auto border-b border-white/5 text-center select-none"
        style={{ 
          fontFamily: "var(--theme-font-body)", 
          color: "var(--theme-text)" 
        }}
      >
        <div className="max-w-2xl mx-auto space-y-3 mb-12">
          <h2 
            className="text-xs uppercase tracking-[3px] font-bold" 
            style={{ color: "var(--theme-accent)" }}
          >
            {title}
          </h2>
          <p 
            className="text-3xl md:text-4xl font-extrabold uppercase tracking-[0.5px]" 
            style={{ fontFamily: "var(--theme-font-heading)" }}
          >
            Meet the Owners
          </p>
          <p className="text-xs max-w-md mx-auto leading-relaxed opacity-70">
            {introText}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div 
            className="border border-white/5 p-8 space-y-4"
            style={{ 
              backgroundColor: "var(--theme-card-bg)",
              borderRadius: "var(--theme-radius-card)",
              borderColor: "var(--theme-border)",
              boxShadow: "var(--theme-shadow-card)"
            }}
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-orange-600 flex items-center justify-center text-3xl shadow-md">
              🏡
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold">{owner1Name}</h3>
              <p className="text-[10px] uppercase tracking-[1.5px] font-bold opacity-60">Home Owner</p>
            </div>
            <p 
              className="text-xs leading-relaxed font-sans font-medium" 
              style={{ color: "var(--theme-secondary-text)" }}
            >
              {owner1Bio}
            </p>
          </div>

          {owner2Name && (
            <div 
              className="border border-white/5 p-8 space-y-4"
              style={{ 
                backgroundColor: "var(--theme-card-bg)",
                borderRadius: "var(--theme-radius-card)",
                borderColor: "var(--theme-border)",
                boxShadow: "var(--theme-shadow-card)"
              }}
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-orange-600 flex items-center justify-center text-3xl shadow-md">
                🏡
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold">{owner2Name}</h3>
                <p className="text-[10px] uppercase tracking-[1.5px] font-bold opacity-60">Home Owner</p>
              </div>
              <p 
                className="text-xs leading-relaxed font-sans font-medium" 
                style={{ color: "var(--theme-secondary-text)" }}
              >
                {owner2Bio}
              </p>
            </div>
          )}
        </div>
      </LayoutWrapper>
    </MotionWrapper>
  );
}
