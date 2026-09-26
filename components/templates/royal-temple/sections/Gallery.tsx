"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { InvitationData } from "@/lib/template-engine/types";

export default function Gallery({ data }: { data: InvitationData }) {
  const shouldReduceMotion = useReducedMotion();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const images = data.gallery.images || [];
  if (!data.gallery.enabled || images.length === 0) return null;

  const fadeIn = shouldReduceMotion
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true } }
    : { initial: { opacity: 0, y: 25 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

  return (
    <section className="relative py-16 px-4 flex justify-center bg-[#FAF6EE]">
      <div className="max-w-4xl w-full">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <p className="text-[10px] uppercase tracking-[3px] font-bold text-[#8C6B12] font-serif">
            Precious Memories
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#68121A] font-serif mt-1">
            {data.gallery.title || "Moments of Joy"}
          </h2>
          <div className="rt-divider">
            <span className="rt-divider-line" />
            <span className="rt-divider-icon">𑁍</span>
            <span className="rt-divider-line" />
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              {...fadeIn}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedIdx(idx)}
              className="relative aspect-square rounded-xl overflow-hidden border border-[#C59B27]/40 shadow-sm cursor-pointer hover:scale-[1.02] transition-transform group bg-white"
            >
              <Image
                src={img.src}
                alt={img.alt || `Memory ${idx + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3A080A]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                <span className="text-[10px] text-[#FFF8EB] uppercase tracking-[1.5px] font-bold truncate">
                  {img.caption || `Moment ${idx + 1}`}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedIdx !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center p-4"
              onClick={() => setSelectedIdx(null)}
            >
              <button
                onClick={() => setSelectedIdx(null)}
                className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full bg-white/10"
              >
                <X size={24} />
              </button>

              <div
                className="relative max-w-2xl w-full max-h-[85vh] aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#C59B27]"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={images[selectedIdx].src}
                  alt={images[selectedIdx].alt || "Photo"}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Prev / Next Controls */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIdx((selectedIdx - 1 + images.length) % images.length);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIdx((selectedIdx + 1) % images.length);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
