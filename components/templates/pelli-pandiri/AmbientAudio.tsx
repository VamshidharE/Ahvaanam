"use client";

import React, { useState, useEffect, useRef } from "react";
import { Music, VolumeX, Volume2 } from "lucide-react";
import { usePelliPandiri } from "./context";

export const AmbientAudio: React.FC = () => {
  const { data } = usePelliPandiri();
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isEnabled = data.music?.enabled ?? true;
  const audioSrc = data.music?.themeMusic || "/templates/pelli-pandiri/audio/ambient.mp3";

  useEffect(() => {
    if (!isEnabled) {
      if (audioRef.current && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }

    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    // Autoplay attempt on mount (enabled by default)
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {
      // Browser requires user interaction before autoplay
      setIsPlaying(false);
    });

    const handleFirstInteraction = () => {
      if (audioRef.current && isEnabled) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {});
      }
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("scroll", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };

    window.addEventListener("click", handleFirstInteraction, { passive: true });
    window.addEventListener("scroll", handleFirstInteraction, { passive: true });
    window.addEventListener("touchstart", handleFirstInteraction, { passive: true });
    window.addEventListener("keydown", handleFirstInteraction, { passive: true });

    return () => {
      audio.pause();
      audioRef.current = null;
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("scroll", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, [audioSrc, isEnabled]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn("Audio playback failed:", err);
      });
    }
  };

  if (!isEnabled) return null;

  return (
    <button
      onClick={toggleMusic}
      aria-label={isPlaying ? "Mute Background Music" : "Play Background Music"}
      title={isPlaying ? "Mute Music" : "Play Music"}
      className="fixed bottom-6 right-6 z-50 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-black/30 hover:bg-black/50 backdrop-blur-md border border-white/20 hover:border-white/40 shadow-lg transition-all duration-300 cursor-pointer group select-none"
    >
      {isPlaying ? (
        <Volume2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white/70 group-hover:text-white transition-colors" />
      ) : (
        <VolumeX className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white/45 group-hover:text-white/75 transition-colors" />
      )}
    </button>
  );
};
