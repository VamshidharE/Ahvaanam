"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RoyalDivider, TraditionalCornerKolam } from "../assets/Ornaments";
import { useEmeraldPalace } from "../context";

export function WeddingFilm() {
  const data = useEmeraldPalace();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoConfig = data.video || {
    enabled: true,
    title: "Our Wedding Film",
    subtitle: "Relive the timeless moments, laughter, and sacred vows captured in cinematic motion.",
    url: "/wedding/procession/procession.mp4",
    poster: "/templates/emerald-palace/couple-portrait-large.jpg",
  };

  if (videoConfig.enabled === false) return null;

  const videoUrl = videoConfig.url || "/wedding/procession/procession.mp4";
  const posterUrl = videoConfig.poster || "/templates/emerald-palace/couple-portrait-large.jpg";

  const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
  const isVimeo = videoUrl.includes("vimeo.com");

  const getEmbedUrl = (url: string) => {
    if (isYouTube) {
      const idMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      return idMatch ? `https://www.youtube.com/embed/${idMatch[1]}?autoplay=1&rel=0` : url;
    }
    if (isVimeo) {
      const idMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
      return idMatch ? `https://player.vimeo.com/video/${idMatch[1]}?autoplay=1` : url;
    }
    return url;
  };

  const handleStartPlay = () => {
    setIsPlaying(true);
    if (!isYouTube && !isVimeo && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <section className="relative w-full ep-bg-film-silk text-[#FFF6E9] py-14 sm:py-20 px-4 sm:px-8 overflow-hidden scroll-mt-16 border-y-2 border-[#D6AD63]/50" id="film">
      {/* Authentic South Indian Corner Kolam Artwork in Gold Accent */}
      <div className="absolute top-2 left-2 w-28 sm:w-40 opacity-35 pointer-events-none brightness-150 filter drop-shadow-[0_2px_8px_rgba(223,183,89,0.3)]">
        <TraditionalCornerKolam className="w-full h-auto" />
      </div>
      <div className="absolute top-2 right-2 w-28 sm:w-40 opacity-35 pointer-events-none scale-x-[-1] brightness-150 filter drop-shadow-[0_2px_8px_rgba(223,183,89,0.3)]">
        <TraditionalCornerKolam className="w-full h-auto" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Header */}
        <span className="font-cinzel text-xs uppercase tracking-[0.25em] text-[#DFB759] font-bold">
          Cinematic Highlights
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#FFF6E9] mt-2 mb-3 font-bold tracking-tight">
          {videoConfig.title || "Our Wedding Film"}
        </h2>
        <RoyalDivider className="my-3 scale-90" goldVariant="light" />
        <p className="font-serif text-sm sm:text-base text-[#FFF6E9]/85 max-w-xl mx-auto italic mb-8 sm:mb-12">
          {videoConfig.subtitle || "Relive the timeless moments, laughter, and sacred vows captured in cinematic motion."}
        </p>

        {/* Large Cinematic Video Container */}
        <motion.div
          className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.65)] border-2 border-[#DFB759]/60 aspect-video bg-black group"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.85 }}
        >
          {/* If video hasn't started playing, show high-res poster and glowing play button */}
          {!isPlaying ? (
            <div className="relative w-full h-full cursor-pointer" onClick={handleStartPlay}>
              <img
                src={posterUrl}
                alt="Wedding Film Poster"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

              {/* Glowing Grand Play Button */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#DFB759] text-[#781D36] flex items-center justify-center shadow-[0_0_50px_rgba(223,183,89,0.75)] border-2 border-[#FFF6E9] transition-transform duration-300 group-hover:scale-110"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg viewBox="0 0 24 24" className="w-8 h-8 sm:w-10 sm:h-10 fill-current translate-x-0.5">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </motion.div>
                <span className="font-cinzel text-xs font-bold uppercase tracking-[0.25em] text-[#FFF6E9] mt-4 drop-shadow-md">
                  Watch Wedding Film
                </span>
              </div>

              {/* Bottom Film Ribbon */}
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-[#FFF6E9]/90 pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#DFB759] animate-ping" />
                  <span className="font-cinzel text-xs tracking-wider uppercase font-semibold">
                    Ahvaanam Cinema
                  </span>
                </div>
                <span className="font-serif text-xs italic">Full HD 4K</span>
              </div>
            </div>
          ) : (
            /* Active Video Playback */
            <div className="relative w-full h-full">
              {isYouTube || isVimeo ? (
                <iframe
                  src={getEmbedUrl(videoUrl)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Wedding Video"
                />
              ) : (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
export default WeddingFilm;
