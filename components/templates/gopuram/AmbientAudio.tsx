"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useGopuram } from "./context";

export const AmbientAudio: React.FC = () => {
  const { data } = useGopuram();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const wasPlayingBeforeHideRef = useRef(false);

  const isEnabled = data.music?.enabled ?? true;
  const audioSrc = data.music?.themeMusic || "";

  // Synthesized Tanpura Sound Generator
  const startTanpuraSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 2.5);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // Authentic Pa - Sa - Sa - Sa tanpura harmonic frequencies (C# / Panchama drone ~ 138.59 Hz)
      const freqs = [
        138.59, // Sa (Root)
        207.65, // Pa (Fifth)
        277.18, // High Sa
        278.20, // Gentle microtonal shimmer beat
      ];

      oscillatorsRef.current = freqs.map((freq) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const subGain = ctx.createGain();
        subGain.gain.setValueAtTime(0.3, ctx.currentTime);

        osc.connect(subGain);
        subGain.connect(masterGain);
        osc.start();
        return osc;
      });

      setIsPlaying(true);
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  };

  const stopTanpuraSound = () => {
    if (audioCtxRef.current && masterGainRef.current) {
      masterGainRef.current.gain.exponentialRampToValueAtTime(
        0.0001,
        audioCtxRef.current.currentTime + 1.2
      );
      setTimeout(() => {
        oscillatorsRef.current.forEach((osc) => {
          try {
            osc.stop();
          } catch {}
        });
        audioCtxRef.current?.close();
        audioCtxRef.current = null;
        setIsPlaying(false);
      }, 1300);
    } else {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (!isEnabled) {
      if (audioRef.current && isPlaying) {
        audioRef.current.pause();
      }
      stopTanpuraSound();
      setIsPlaying(false);
      return;
    }

    if (audioSrc) {
      const audio = new Audio(audioSrc);
      audio.loop = true;
      audio.volume = 0.5;
      audioRef.current = audio;

      audio.currentTime = 0;
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });

      const handleFirstInteraction = () => {
        if (audioRef.current && isEnabled) {
          audioRef.current.currentTime = 0;
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
    } else {
      // Default ambient tanpura drone on user gesture
      const handleGestureForDrone = () => {
        if (isEnabled && !audioCtxRef.current) {
          startTanpuraSound();
        }
        window.removeEventListener("click", handleGestureForDrone);
        window.removeEventListener("scroll", handleGestureForDrone);
        window.removeEventListener("touchstart", handleGestureForDrone);
      };

      window.addEventListener("click", handleGestureForDrone, { passive: true });
      window.addEventListener("scroll", handleGestureForDrone, { passive: true });
      window.addEventListener("touchstart", handleGestureForDrone, { passive: true });

      return () => {
        window.removeEventListener("click", handleGestureForDrone);
        window.removeEventListener("scroll", handleGestureForDrone);
        window.removeEventListener("touchstart", handleGestureForDrone);
        stopTanpuraSound();
      };
    }
  }, [audioSrc, isEnabled]);

  // Tab visibility handling
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isPlaying) {
          wasPlayingBeforeHideRef.current = true;
          if (audioRef.current) audioRef.current.pause();
          if (audioCtxRef.current) stopTanpuraSound();
          setIsPlaying(false);
        }
      } else {
        if (wasPlayingBeforeHideRef.current && isEnabled) {
          wasPlayingBeforeHideRef.current = false;
          if (audioRef.current) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
          } else {
            startTanpuraSound();
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isEnabled, isPlaying]);

  const toggleAudio = () => {
    if (isPlaying) {
      wasPlayingBeforeHideRef.current = false;
      if (audioRef.current) audioRef.current.pause();
      stopTanpuraSound();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        startTanpuraSound();
      }
    }
  };

  return (
    <button
      onClick={toggleAudio}
      title={isPlaying ? "Mute sacred ambient audio" : "Play sacred ambient audio"}
      className="fixed top-5 right-5 z-40 p-2.5 rounded-full bg-black/60 border border-[#d4af37]/40 text-[#f5ecd4] shadow-xl backdrop-blur-md hover:bg-[#d4af37]/20 transition-all flex items-center justify-center cursor-pointer group"
    >
      {isPlaying ? (
        <Volume2 className="w-4 h-4 text-[#e8c766] group-hover:scale-110 transition-transform" />
      ) : (
        <VolumeX className="w-4 h-4 text-[#e8c766]/60 group-hover:scale-110 transition-transform" />
      )}
    </button>
  );
};
