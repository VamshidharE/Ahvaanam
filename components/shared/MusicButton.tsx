"use client";

import React, { useRef, useState } from "react";
import { Music, Pause } from "lucide-react";
import { motion } from "framer-motion";
import { invitation } from "../data/invitation";

export default function MusicButton() {
    if (!invitation.music.enabled) return null;

  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  // Pause audio when tab is minimized or switched to another app, and resume when returning
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (document.hidden) {
        if (!audio.paused) {
          audio.pause();
        }
      } else {
        if (playing) {
          audio.play().catch(() => {});
        }
      }
    };

    const handlePageHide = () => {
      const audio = audioRef.current;
      if (audio && !audio.paused) audio.pause();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("blur", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("blur", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, [playing]);

  return (
    <>
      <audio ref={audioRef} loop>
        <source src={invitation.music.file} type="audio/mpeg" />
      </audio>

      <motion.button
        onClick={toggleMusic}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.08 }}
        className="
        fixed
        left-6
        top-6
        z-50
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-full
        border
        border-yellow-400/30
        bg-[#1b151f]/70
        backdrop-blur-xl
        text-yellow-300
        "
      >
        {playing ? <Pause size={22} /> : <Music size={22} />}
      </motion.button>
    </>
  );
}