"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RoyalDivider } from "../assets/Ornaments";
import { useEmeraldPalace } from "../context";

export function RoyalGallery() {
  const data = useEmeraldPalace();
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  if (!data.gallery || data.gallery.length === 0) return null;

  return (
    <section className="ep-section" id="gallery">
      <div className="text-center mb-6">
        <span className="ep-section-tag">Captured Memories</span>
        <h2 className="ep-section-title ep-gold-text">Royal Moments</h2>
        <p className="ep-section-subtitle">
          Glimpses of love, laughter, and timeless celebrations.
        </p>
        <RoyalDivider className="my-3 scale-90" />
      </div>

      <div className="ep-gallery-grid max-w-5xl mx-auto">
        {data.gallery.map((img, index) => (
          <motion.div
            key={index}
            className="ep-gallery-item"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => setActivePhoto(img.src)}
          >
            <img src={img.src} alt={img.alt || "Royal Moment"} className="ep-gallery-img" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-3">
              <span className="text-xs text-white font-cinzel tracking-wider">
                {img.caption || img.alt}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            className="ep-lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhoto(null)}
          >
            <motion.div
              className="ep-lightbox-content"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activePhoto}
                alt="Enlarged Royal Moment"
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center text-lg border border-[#DFB759] hover:bg-[#8B1E2F] transition-colors"
                aria-label="Close photo preview"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
export default RoyalGallery;
