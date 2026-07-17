"use client";

import React from "react";
import LayoutWrapper from "@/components/layouts/LayoutWrapper";
import MotionWrapper from "@/components/motion/MotionWrapper";

interface HouseDetailsProps {
  bindings: {
    title?: string;
    houseName?: string;
    description?: string;
  };
  layoutId?: string;
  motionId?: string;
}

export default function HouseDetailsSection({ bindings, layoutId, motionId }: HouseDetailsProps) {
  const {
    title = "Our New Nest",
    houseName = "Shree Nilayam",
    description = "A home built with love, dreams, and blessings. We welcome you to join our housewarming celebration."
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
        <div className="max-w-2xl mx-auto space-y-3">
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
            Introducing Our New Home
          </p>
        </div>

        <div 
          className="border border-white/5 p-8 md:p-12 max-w-xl mx-auto space-y-6 w-full"
          style={{ 
            backgroundColor: "var(--theme-card-bg)",
            borderRadius: "var(--theme-radius-card)",
            borderColor: "var(--theme-border)",
            boxShadow: "var(--theme-shadow-card)"
          }}
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-orange-600 flex items-center justify-center text-3xl shadow-md">
            🏠
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">{houseName}</h3>
            <p 
              className="text-xs uppercase tracking-[2px] font-bold"
              style={{ color: "var(--theme-accent)" }}
            >
              Griha Pravesham
            </p>
          </div>
          <p 
            className="text-xs max-w-md mx-auto leading-relaxed font-sans font-medium"
            style={{ color: "var(--theme-secondary-text)" }}
          >
            {description}
          </p>
        </div>
      </LayoutWrapper>
    </MotionWrapper>
  );
}
