"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { PelliPandiriData } from "../adapter";

export const PreWeddingVideo: React.FC<{ data: PelliPandiriData }> = ({ data }) => {
  const { video } = data;
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
      setHasStarted(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <section
      ref={sectionRef}
      id="story"
      aria-label="Pre-Wedding Film"
      className="relative w-full overflow-hidden py-14 sm:py-18 md:py-24 bg-transparent"
    >
      {/* Floating Section Heading */}
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 sm:mb-12 px-4 relative z-30 flex flex-col items-center"
      >
        <div className="flex items-center justify-center gap-2 mb-2 select-none">
          <span className="w-8 sm:w-14 h-px bg-gradient-to-r from-transparent to-[#b88636]" />
          <span className="text-[#b88636] text-xs">❦</span>
          <span className="font-cinzel text-[10.5px] sm:text-xs font-bold tracking-[0.26em] text-[#805527] uppercase">
            A CINEMATIC MEMORY
          </span>
          <span className="text-[#b88636] text-xs">❦</span>
          <span className="w-8 sm:w-14 h-px bg-gradient-to-l from-transparent to-[#b88636]" />
        </div>

        <h2 className="font-cinzel text-xl sm:text-3xl md:text-5xl font-extrabold tracking-wide sm:tracking-[0.16em] text-[#42100b] uppercase leading-tight px-2">
          {video.heading || "A GLIMPSE OF US"}
        </h2>

        <p className="font-cormorant text-base sm:text-lg md:text-xl italic text-[#744c2c] font-semibold mt-1.5">
          {video.subheading || "Our story, captured in beautiful moments."}
        </p>

        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#b88636] to-transparent mt-2.5" />
      </motion.div>

      {/* Cinematic 16:9 Video Container */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 md:px-8 z-20">
        <motion.div
          initial={false}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(80,45,20,0.25)] border-2 border-[#b88636]/80 bg-[#16100c] group cursor-pointer"
          onClick={togglePlay}
        >
          <div className="absolute inset-1 rounded-xl sm:rounded-2xl border border-[#ffd700]/30 pointer-events-none z-20" />

          <div className="relative aspect-[16/9] w-full bg-[#0d0a07]">
            <video
              ref={videoRef}
              src={video.videoSrc}
              poster={video.posterSrc}
              playsInline
              preload="metadata"
              onEnded={() => setIsPlaying(false)}
              className="w-full h-full object-cover filter brightness-[0.98] contrast-[1.02]"
            />

            {/* Play Button Overlay */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-[2px] transition-all duration-300 group-hover:bg-black/25 z-15">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#8e3622] via-[#b87d46] to-[#ffd700] p-0.5 shadow-[0_10px_30px_rgba(142,54,34,0.5)] flex items-center justify-center"
                >
                  <div className="w-full h-full rounded-full bg-[#42100b]/90 flex items-center justify-center text-[#ffd700] pl-1">
                    <Play size={28} className="fill-current" />
                  </div>
                </motion.div>
              </div>
            )}

            {/* Floating Controls Bar */}
            {hasStarted && (
              <div
                className="absolute bottom-3 inset-x-3 sm:bottom-4 sm:inset-x-4 flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-25 text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="p-1 hover:text-[#ffd700] transition-colors"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="p-1 hover:text-[#ffd700] transition-colors"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                </div>
                <button
                  onClick={handleFullscreen}
                  className="p-1 hover:text-[#ffd700] transition-colors"
                  aria-label="Fullscreen"
                >
                  <Maximize2 size={16} />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
