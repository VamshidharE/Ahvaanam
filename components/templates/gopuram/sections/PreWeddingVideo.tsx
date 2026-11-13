"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { useGopuram } from "../context";

const HangingTempleBell: React.FC<{ side: "left" | "right" }> = ({ side }) => {
  return (
    <motion.div
      animate={{ rotate: side === "left" ? [-2.5, 2.5, -2.5] : [2.5, -2.5, 2.5] }}
      transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      className={`absolute top-0 pointer-events-none select-none z-20 flex flex-col items-center ${
        side === "left" ? "left-4 sm:left-8 lg:left-12" : "right-4 sm:right-8 lg:right-12"
      }`}
      style={{ transformOrigin: "top center" }}
    >
      <div className="relative w-8 sm:w-10 md:w-12 h-20 sm:h-26 md:h-30">
        <Image
          src="/templates/gopuram/events/hanging-temple-bell.png"
          alt="Traditional Brass Temple Bell"
          fill
          className="object-contain filter drop-shadow-[0_4px_10px_rgba(80,40,15,0.3)]"
          priority
          unoptimized
        />
      </div>
    </motion.div>
  );
};

export const PreWeddingVideo: React.FC = () => {
  const { data } = useGopuram();
  const { video } = data;
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });
  const shouldReduceMotion = useReducedMotion();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
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

  if (!video.videoSrc) return null;

  return (
    <section
      ref={sectionRef}
      id="pre-wedding-video"
      aria-label="Pre-Wedding Film"
      className="relative w-full overflow-hidden pt-6 pb-3 sm:pt-8 sm:pb-4 md:pt-10 md:pb-5 bg-transparent text-[#42100b] select-none"
    >
      {/* Decorative Artwork */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute -top-10 -left-10 w-48 sm:w-64 h-48 sm:h-64 opacity-[0.18]">
          <Image
            src="/templates/gopuram/decoration/Lotus-Mandala.png"
            alt=""
            fill
            className="object-contain filter sepia"
            unoptimized
          />
        </div>

        <div className="absolute -top-10 -right-10 w-48 sm:w-64 h-48 sm:h-64 opacity-[0.18]">
          <Image
            src="/templates/gopuram/decoration/Lotus-Mandala.png"
            alt=""
            fill
            className="object-contain filter sepia"
            unoptimized
          />
        </div>

        <div className="absolute bottom-6 left-2 sm:left-6 w-20 sm:w-28 h-20 sm:h-28 opacity-[0.22]">
          <Image
            src="/templates/gopuram/events/lotus-corner.png"
            alt=""
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      </div>

      {/* Swaying Temple Bells */}
      <HangingTempleBell side="left" />
      <HangingTempleBell side="right" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-7 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fbf2e3] border border-[#d4af37]/70 shadow-2xs mb-2.5">
            <span className="text-[#b88636] text-[10px]">✦</span>
            <span className="font-cinzel text-[10px] sm:text-xs font-bold tracking-[0.22em] text-[#742719] uppercase">
              Cinematic Glimpse
            </span>
            <span className="text-[#b88636] text-[10px]">✦</span>
          </div>

          <div className="relative inline-flex items-center justify-center px-5 sm:px-8 py-1.5 sm:py-2 rounded-2xl bg-gradient-to-r from-[#5a1012] via-[#7e181e] to-[#5a1012] border-2 border-[#d4af37] shadow-[0_6px_20px_rgba(90,20,10,0.22)]">
            <div className="absolute top-1 left-1.5 w-2.5 h-2.5 border-t border-l border-[#ffd700]/70 pointer-events-none" />
            <div className="absolute top-1 right-1.5 w-2.5 h-2.5 border-t border-r border-[#ffd700]/70 pointer-events-none" />
            <div className="absolute bottom-1 left-1.5 w-2.5 h-2.5 border-b border-l border-[#ffd700]/70 pointer-events-none" />
            <div className="absolute bottom-1 right-1.5 w-2.5 h-2.5 border-b border-r border-[#ffd700]/70 pointer-events-none" />

            <span className="hidden sm:inline-block w-6 sm:w-10 h-px bg-gradient-to-r from-transparent via-[#ffd700] to-transparent mr-2.5" />

            <h2 className="font-cinzel text-lg sm:text-xl md:text-2xl lg:text-[1.75rem] font-black tracking-[0.18em] sm:tracking-[0.22em] text-[#fffdf8] uppercase leading-tight [text-shadow:_0_1px_3px_rgba(0,0,0,0.6),_0_0_12px_rgba(255,215,0,0.35)]">
              {video.heading || "A Glimpse of Our Journey"}
            </h2>

            <span className="hidden sm:inline-block w-6 sm:w-10 h-px bg-gradient-to-r from-transparent via-[#ffd700] to-transparent ml-2.5" />
          </div>

          <p className="font-cormorant italic text-sm sm:text-base md:text-lg text-[#6e3a1f] font-bold tracking-wide mt-2 max-w-xl">
            &ldquo;{video.subheading || "Moments that made our story special"}&rdquo;
          </p>
        </motion.div>

        {/* Video Player */}
        <div className="relative w-full max-w-2xl sm:max-w-3xl lg:max-w-3xl xl:max-w-4xl mx-auto">
          <div
            className="absolute -inset-2.5 sm:-inset-4 rounded-3xl sm:rounded-[2rem] pointer-events-none -z-10"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255,225,130,0.4) 0%, rgba(212,175,55,0.15) 60%, transparent 80%)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="relative rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 bg-gradient-to-b from-[#ffd700] via-[#c99f58] to-[#8a5822] shadow-[0_16px_48px_rgba(80,45,20,0.22)]"
          >
            <div className="absolute top-2 left-2 z-20 w-3 h-3 rounded-full bg-[#ffd700] shadow-[0_0_8px_#ffd700]" />
            <div className="absolute top-2 right-2 z-20 w-3 h-3 rounded-full bg-[#ffd700] shadow-[0_0_8px_#ffd700]" />
            <div className="absolute bottom-2 left-2 z-20 w-3 h-3 rounded-full bg-[#ffd700] shadow-[0_0_8px_#ffd700]" />
            <div className="absolute bottom-2 right-2 z-20 w-3 h-3 rounded-full bg-[#ffd700] shadow-[0_0_8px_#ffd700]" />

            <div
              className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-black cursor-pointer group"
              onClick={togglePlay}
            >
              <video
                ref={videoRef}
                src={video.videoSrc}
                poster={video.posterSrc}
                playsInline
                loop
                preload="metadata"
                className="w-full h-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Center Golden Play Button */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-2xs transition-opacity duration-300">
                  <motion.div
                    whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                    className="w-13 sm:w-15 md:w-16 h-13 sm:h-15 md:h-16 rounded-full bg-gradient-to-br from-[#ffd700] via-[#cca038] to-[#8a5822] p-1 shadow-[0_0_24px_rgba(255,215,0,0.55)] flex items-center justify-center"
                  >
                    <div className="w-full h-full rounded-full bg-[#541c15] flex items-center justify-center pl-0.5">
                      <Play className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-[#ffd700] fill-[#ffd700]" />
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Bottom Control Bar */}
              <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black/85 via-black/45 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/35 text-white transition-colors"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} className="fill-white" />}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/35 text-white transition-colors"
                  >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>

                  <button
                    type="button"
                    onClick={handleFullscreen}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/35 text-white transition-colors"
                  >
                    <Maximize2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
