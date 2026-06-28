"use client";

import { useRef, useState } from "react";
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
    } else {
      audioRef.current.play();
    }

    setPlaying(!playing);
  };

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