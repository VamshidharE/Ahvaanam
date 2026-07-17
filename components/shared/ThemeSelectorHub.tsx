"use client";

import { motion } from "framer-motion";
import { themes } from "../data/themes";
import { useTheme } from "../context/ThemeContext";
import { Sparkles, Calendar, Heart } from "lucide-react";

export default function ThemeSelectorHub() {
  const { setTheme } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } },
  };

  return (
    <div className="min-h-screen bg-radial from-[#1A0C2E] via-[#0E061E] to-[#05020B] text-white px-6 py-16 flex flex-col items-center justify-center font-sans overflow-hidden relative">
      {/* Decorative top gold frame element */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
      
      {/* Abstract light aura */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[150px] pointer-events-none" />

      {/* Floating Sparkles */}
      <div className="absolute top-10 left-10 text-yellow-500/20 text-4xl animate-pulse">✦</div>
      <div className="absolute bottom-10 right-10 text-yellow-500/20 text-4xl animate-pulse delay-700">✦</div>

      <div className="max-w-6xl w-full z-10">
        <header className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-300 text-xs uppercase tracking-[4px] mb-6"
          >
            <Sparkles size={14} /> Traditional Invitation Hub <Sparkles size={14} />
          </motion.div>
          
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold bg-gradient-to-b from-[#fbf8ee] via-[#f7e4c2] to-[#c59b27] bg-clip-text text-transparent [font-family:var(--cinzel),serif]"
          >
            Ahvaanam
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-yellow-100/60 max-w-xl mx-auto mt-4 text-base md:text-lg"
          >
            A collection of 10 handcrafted, premium traditional Indian wedding templates. Choose a style to preview your invitation.
          </motion.p>
        </header>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {themes.map((theme, index) => (
            <motion.div
              key={theme.id}
              variants={cardVariants}
              whileHover={{ 
                y: -10, 
                boxShadow: "0 20px 40px rgba(197, 155, 39, 0.15)",
                borderColor: "rgba(197, 155, 39, 0.6)"
              }}
              onClick={() => setTheme(theme.id)}
              className="group cursor-pointer bg-gradient-to-b from-[#1b122f]/85 to-[#0b0616]/95 border-2 border-yellow-500/20 rounded-[28px] p-8 flex flex-col justify-between transition-all duration-300 backdrop-blur-xl relative overflow-hidden h-[300px]"
            >
              {/* Card Ornament Corner Detail */}
              <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
                <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-yellow-300 w-full h-full">
                  <path d="M100 0 L100 100 L0 100" strokeWidth="2" />
                  <circle cx="85" cy="85" r="5" fill="currentColor" />
                </svg>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span 
                    className="text-xs uppercase tracking-[3px] text-yellow-300 font-semibold"
                  >
                    Template {index + 1}
                  </span>
                  {/* Theme color pill */}
                  <span 
                    className="w-4 h-4 rounded-full border border-white/20 shadow-md"
                    style={{ backgroundColor: theme.colorHex }}
                  />
                </div>

                <h3 className="text-2xl font-semibold text-white group-hover:text-yellow-200 transition-colors [font-family:var(--cinzel),serif] mb-2">
                  {theme.name}
                </h3>
                <p className="text-yellow-400/80 text-sm italic tracking-[1px] mb-4">
                  {theme.tagline}
                </p>
                <p className="text-yellow-100/50 text-sm leading-relaxed group-hover:text-yellow-100/70 transition-colors line-clamp-3">
                  {theme.description}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-yellow-500/10 pt-4">
                <span className="text-yellow-300/80 text-sm group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-1.5 font-medium">
                  Launch Preview <Heart size={14} className="fill-yellow-300 text-yellow-300" />
                </span>
                <span className="w-8 h-8 rounded-full border border-yellow-500/20 bg-yellow-500/5 flex items-center justify-center text-yellow-300 group-hover:bg-yellow-500 group-hover:text-[#0b0616] transition-all">
                  →
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <footer className="text-center mt-20 text-yellow-100/30 text-xs tracking-[2px] border-t border-yellow-500/10 pt-8">
          © {new Date().getFullYear()} AHVAANAM. ALL RIGHTS RESERVED.
        </footer>
      </div>
    </div>
  );
}
