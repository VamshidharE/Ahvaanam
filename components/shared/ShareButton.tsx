"use client";

import { Share2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ShareButton() {
  async function share() {
    if (navigator.share) {
      await navigator.share({
        title: "Wedding Invitation",
        text: "You're invited!",
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Invitation link copied!");
    }
  }

  return (
    <motion.button
      onClick={share}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="
      fixed
      right-6
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
      <Share2 size={20} />
    </motion.button>
  );
}