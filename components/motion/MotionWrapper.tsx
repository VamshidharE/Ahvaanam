"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getMotionPack } from "@/lib/motion/registry";

interface MotionWrapperProps {
  motionId?: string;
  defaultMotionId: string;
  type: "reveal" | "hover" | "tap";
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function MotionWrapper({ 
  motionId, 
  defaultMotionId, 
  type, 
  children, 
  className, 
  style 
}: MotionWrapperProps) {
  const activeId = motionId || defaultMotionId;
  const pack = getMotionPack(activeId);
  const shouldReduce = useReducedMotion();

  if (!pack) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  // Handle prefers-reduced-motion fallbacks gracefully to prevent layout shifts
  if (shouldReduce) {
    if (type === "reveal") {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
          className={className}
          style={style}
        >
          {children}
        </motion.div>
      );
    }
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  const preset = pack.presets[type];
  if (!preset) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  if (type === "reveal") {
    return (
      <motion.div
        initial={preset.initial}
        whileInView={preset.whileInView}
        viewport={preset.viewport || { once: true, margin: "-100px" }}
        transition={preset.transition}
        className={className}
        style={style}
      >
        {children}
      </motion.div>
    );
  }

  if (type === "hover") {
    return (
      <motion.div
        whileHover={preset}
        className={className}
        style={style}
      >
        {children}
      </motion.div>
    );
  }

  if (type === "tap") {
    return (
      <motion.div
        whileTap={preset}
        className={className}
        style={style}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
