"use client";

import { motion } from "framer-motion";

export default function SectionDivider() {
  return (
    <div className="relative flex justify-center py-10">

      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: 260 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
      />

      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: .4 }}
        className="
          absolute
          top-1/2
          -translate-y-1/2
          rounded-full
          border
          border-yellow-400
          bg-[#09070D]
          px-3
          py-1
          text-yellow-300
        "
      >
        ✦
      </motion.div>

    </div>
  );
}