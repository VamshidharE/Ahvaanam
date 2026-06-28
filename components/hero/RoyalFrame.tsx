"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface RoyalFrameProps {
  src: string;
  alt: string;
}

export default function RoyalFrame({
  src,
  alt,
}: RoyalFrameProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
      whileHover={{
        y: -8,
        rotate: -1,
        scale: 1.02,
      }}
      className="relative"
    >
      {/* Golden Aura */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.35, 0.6, 0.35],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
        absolute
        left-1/2
        top-1/2
        h-[500px]
        w-[500px]
        -translate-x-1/2
        -translate-y-1/2
        rounded-full
        bg-yellow-400/20
        blur-[130px]
        "
      />

      {/* Decorative Outer Border */}
      <div
        className="
        relative
        rounded-[60px]
        border
        border-yellow-500/70
        bg-gradient-to-b
        from-[#3a2811]
        to-[#181117]
        p-3
        shadow-[0_25px_80px_rgba(0,0,0,.45)]
        "
      >
        {/* Gold Trim */}
        <div
          className="
          rounded-[50px]
          border
          border-yellow-300/70
          p-2
          "
        >
          {/* Cream Frame */}
          <div
            className="
            rounded-[42px]
            bg-[#f5e6c8]
            p-3
            "
          >
            <div className="overflow-hidden rounded-[34px]">
              <Image
                src={src}
                alt={alt}
                width={500}
                height={650}

                className="
                h-[540px]
                w-[370px]
                object-cover
                transition
                duration-700
                hover:scale-105
                "
              />
            </div>
          </div>
        </div>
      </div>

      {/* Corner Sparkles */}
      <motion.div
        animate={{
          opacity: [0.4, 1, 0.4],
          rotate: [0, 20, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
        className="absolute -left-5 top-10 text-2xl text-yellow-300"
      >
        ✦
      </motion.div>

      <motion.div
        animate={{
          opacity: [1, 0.4, 1],
          rotate: [0, -20, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
        className="absolute -right-5 bottom-10 text-2xl text-yellow-300"
      >
        ✦
      </motion.div>
    </motion.div>
  );
}