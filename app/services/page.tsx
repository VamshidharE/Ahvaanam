"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Heart, 
  Sparkles, 
  Award, 
  ArrowRight, 
  Cake, 
  Home, 
  Baby, 
  Briefcase, 
  Gift, 
  Map 
} from "lucide-react";
import Link from "next/link";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";

const services = [
  {
    icon: Heart,
    title: "Wedding Invitations",
    desc: "Luxury multi-page digital wedding cards with traditional background music, calendars, RSVPs, maps, and cultural deity symbols."
  },
  {
    icon: Sparkles,
    title: "Engagement Invitations",
    desc: "Timeless layouts, animations, and photos tailored for modern ring ceremonies, ring highlights, and Roka events."
  },
  {
    icon: Cake,
    title: "Birthday Invitations",
    desc: "Playful milestones grids, custom countdown timer modules, and animated guest lists for kids and adults birthdays."
  },
  {
    icon: Home,
    title: "Housewarming Invitations",
    desc: "Blessing templates with auspicious elements like marigold garlands, mango leaf banners, and simple directions."
  },
  {
    icon: Baby,
    title: "Baby Shower Invitations",
    desc: "Warm pastel templates featuring clouds, stars, floating bubbles, and integrated registry gift option buttons."
  },
  {
    icon: Briefcase,
    title: "Corporate Invitations",
    desc: "Geometric gold outline accents, deep luxury background styles, speaker bios, and formal downloadable event schedules."
  },
  {
    icon: Award,
    title: "Traditional Invitations",
    desc: "Cultural heritage designs mimicking silk scrolls, temple gates, sandstoneHaveli arches, and sacred scripts."
  },
  {
    icon: Map,
    title: "Premium Custom Invitations",
    desc: "Bespoke design consulting from scratch. Our creative team develops custom graphics, vector layout assets, and soundtracks."
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#241E1C] font-sans relative overflow-x-hidden pt-28">
      <Navbar />

      <div className="absolute top-[10%] right-[-10%] w-[400px] h-[400px] bg-yellow-100/30 rounded-full blur-[100px] pointer-events-none" />

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10 space-y-16">
        
        {/* Title Section */}
        <div className="text-center space-y-4">
          <span className="text-sm font-bold uppercase tracking-[4px] text-[#C49B27] block">Studio Services</span>
          <h1 className="text-4xl md:text-6xl font-normal uppercase tracking-[0.5px] [font-family:var(--cinzel),serif]">What We Design</h1>
          <p className="text-xs text-[#241E1C]/50 max-w-sm mx-auto uppercase tracking-[2px] font-bold">Personalized design solutions for your celebrations</p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc, index) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="group relative overflow-hidden rounded-[32px] border border-white bg-white/80 p-8 shadow-xl backdrop-blur-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100/50 flex items-center justify-center text-[#C49B27]">
                    <Icon size={22} />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold uppercase font-cinzel text-slate-800">{svc.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">{svc.desc}</p>
                  </div>
                </div>

                <div className="border-t border-zinc-100 pt-4 mt-8 flex items-center justify-end">
                  <Link 
                    href="/contact"
                    className="text-xs text-[#C49B27] hover:text-[#B0871B] font-bold flex items-center gap-1.5 transition-colors"
                  >
                    Enquire Now <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>

              </motion.div>
            );
          })}
        </div>

      </main>

      <Footer />
    </div>
  );
}
