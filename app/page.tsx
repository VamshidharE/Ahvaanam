"use client";

import React, { useState, useEffect } from "react";
import {
  Palette, Heart, Sparkles, CheckCircle, Mail, MapPin,
  Phone, Music, ArrowRight, ArrowLeft, QrCode, Image as ImageIcon,
  Calendar, Gift, Smile, Plus, Eye, Smartphone, Monitor, Tablet,
  Share2, ChevronLeft, ChevronRight, Zap, RefreshCw, Send, Download, ExternalLink,
  ChevronDown, HelpCircle, Check, Play, Pause, User, Award, Layers, Star,
  Clock, HeartHandshake, Map, Globe, MessageCircle
} from "lucide-react";
import Link from "next/link";
import { ParallaxProvider } from "react-scroll-parallax";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "../components/home/Hero";
import EventCategories from "../components/home/EventCategories";
import TemplateGallery from "../components/home/TemplateGallery";
import BuilderShowcase from "../components/home/BuilderShowcase";
import Sharing from "../components/home/Sharing";
import Footer from "../components/home/Footer";
import Navbar from "../components/home/Navbar";
import SectionReveal from "../components/home/SectionReveal";
import SmoothScroll from "../components/home/SmoothScroll";
import BackgroundBlobs from "../components/home/BackgroundBlobs";
import FloatingElements from "../components/home/FloatingElements";

// --- FLOWING GOLD SPARKLES PARTICLES ---
function GoldParticles({ count = 25 }: { count?: number }) {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; top: number; size: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    const items = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 8
    }));
    setParticles(items);
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes driftGold {
          0% { transform: translateY(100vh) rotate(0deg) scale(1); opacity: 0; }
          10% { opacity: 0.9; }
          90% { opacity: 0.9; }
          100% { transform: translateY(-20vh) translateX(60px) rotate(180deg) scale(0.6); opacity: 0; }
        }
        .gold-sparkle {
          animation: driftGold 14s linear infinite;
        }
      `}} />
      {particles.map((p) => (
        <div
          key={p.id}
          className="gold-sparkle absolute rounded-full bg-[#D4AF37]/50 blur-[0.4px]"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            top: `${p.top}vh`
          }}
        />
      ))}
    </div>
  );
}

// --- DRIFTING CHERRY BLOSSOMS ---
function CherryBlossoms() {
  const [petals, setPetals] = useState<Array<{ id: number; left: number; delay: number; duration: number; type: number }>>([]);

  useEffect(() => {
    const items = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 6,
      duration: 11 + Math.random() * 9,
      type: (i % 3) + 1
    }));
    setPetals(items);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {petals.map((p) => (
        <div
          key={p.id}
          className={`absolute top-[-30px] w-3 h-3 rounded-full bg-rose-200/50 blur-[0.3px] ${p.type === 1 ? "animate-petal-1" : p.type === 2 ? "animate-petal-2" : "animate-petal-3"
            }`}
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`
          }}
        />
      ))}
    </div>
  );
}

const shareItems = [
    {
        icon: MessageCircle,
        title: "WhatsApp",
        desc: "Share instantly",
        href: "https://api.whatsapp.com/send?text=Check%20out%20our%20premium%20invitation%20demo%20at%20http%3A%2F%2Flocalhost%3A3000%2Fdemo",
        isExternal: true
    },
    {
        icon: Globe,
        title: "Website",
        desc: "Personal invitation URL",
        href: "/demo",
        isExternal: false
    },
    {
        icon: QrCode,
        title: "QR Code",
        desc: "Quick access",
        href: "/demo",
        isExternal: false
    },
    {
        icon: Download,
        title: "Download",
        desc: "Image & PDF",
        href: "/sample-invitation.pdf",
        isExternal: true,
        download: true
    },
];

export default function RecreatedHomepage() {
  // Global Invitation state synced across sections
  const [coupleName, setCoupleName] = useState("RAHUL & PRIYA");
  const [selectedFont, setSelectedFont] = useState("Cinzel");
  const [selectedColor, setSelectedColor] = useState("#C49B27"); // Ornate Gold
  const [selectedBg, setSelectedBg] = useState("traditional-ivory");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Active states for sections
  const [selectedCategory, setSelectedCategory] = useState("Wedding");
  const [activeGallerySlide, setActiveGallerySlide] = useState(2); // Royal Jade in center
  const [activeDevice, setActiveDevice] = useState<"desktop" | "mobile" | "tablet">("mobile");

  // Testimonials state
  const [activeTestimonial, setActiveTestimonial] = useState(1);

  // Personalization Auto-Play Showcase state
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  // Helper arrays matching the reference concept
  const categories = [
    { name: "Wedding", icon: Heart },
    { name: "Engagement", icon: Sparkles },
    { name: "Birthday", icon: Gift },
    { name: "Housewarming", icon: MapPin },
    { name: "Baby Shower", icon: Smile },
    { name: "Upanayanam", icon: Award },
    { name: "Half Saree", icon: Layers },
    { name: "Corporate", icon: Monitor },
    { name: "Festivals", icon: Calendar },
    { name: "More", icon: Plus }
  ];

  const templates = [
    { id: 0, name: "Traditional Ivory", bg: "bg-[#FFFDF8]", border: "border-[#D4AF37]/35", accent: "#D4AF37", dark: false, symbol: "ॐ" },
    { id: 1, name: "Rose Garden", bg: "bg-[#FFEBEF]", border: "border-rose-300/30", accent: "#C88E9B", dark: false, symbol: "❀" },
    { id: 2, name: "Royal Emerald", bg: "bg-[#0A251B]", border: "border-emerald-500/20", accent: "#C49B27", dark: true, symbol: "🔱" },
    { id: 3, name: "Golden Aura", bg: "bg-[#FCF9F2]", border: "border-amber-600/15", accent: "#AA7C11", dark: false, symbol: "ॐ" },
    { id: 4, name: "Midnight Sapphire", bg: "bg-[#0C1E36]", border: "border-blue-500/20", accent: "#C49B27", dark: true, symbol: "ॐ" },
    { id: 5, name: "Heritage Gold", bg: "bg-[#FAF5E6]", border: "border-amber-500/25", accent: "#B0871B", dark: false, symbol: "ॐ" }
  ];

  const handlePrev = () => {
    setActiveGallerySlide((prev) => (prev === 0 ? templates.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveGallerySlide((prev) => (prev === templates.length - 1 ? 0 : prev + 1));
  };

  const personalizationFeatures = [
    { name: "Surname", label: "Family Surname Title", details: "E.g. 'The Mehtas' or 'The Sharmas'", visual: "THE MEHTAS FAMILY" },
    { name: "God", label: "Traditional Deities Icons", details: "Gold Ganesh, Venkateswara or Om emblem", visual: "🔱 Lord Ganesha" },
    { name: "Family", label: "Parent & Relatives Lists", details: "Add parents' blessings and siblings names", visual: "Blessings: Mr. & Mrs. Mehta" },
    { name: "Gallery", label: "Couple Image Slider", details: "Slide show of couple portraits", visual: "[ Couple Portrait Frame ]" },
    { name: "Music", label: "Devotional Audio Player", details: "Choose background instrumentals", visual: "♫ Sacred Flute Symphony" },
    { name: "Countdown", label: "Target Ceremony Timer", details: "Animate days, hours, and minutes remaining", visual: "30 Days : 12 Hours : 45 Mins" },
    { name: "Venue", label: "GPS Coordinates Map", details: "One-click navigation routes for guests", visual: "The Grand Palace, Hyderabad (GPS)" },
    { name: "QR", label: "Scan & Direct Share Link", details: "Let guests scan print outs to open URL", visual: "[ Mock QR Code Canvas ]" },
    { name: "RSVP", label: "Helpline Contact Form", details: "Guest RSVP table updates dynamically", visual: "Attend Status: Going (Verified)" }
  ];

  const testimonials = [
    { id: 0, name: "Ananya & Karthik", text: "Ahvaanam made our wedding invitation so special and beautiful. Our family and friends loved it!", role: "Wedding Clients" },
    { id: 1, name: "Sneha & Rohit", text: "Super easy to use and the templates are stunning. We found the perfect layout for our ring ceremony!", role: "Engagement Clients" },
    { id: 2, name: "Priyanka", text: "The music, gallery, and countdown features made our digital card look premium. Highly recommended!", role: "Anniversary Client" }
  ];

  // Auto-play the personalization showcase loop every 4.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeatureIndex((prev) => (prev + 1) % personalizationFeatures.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleCategoryHover = (catName: string) => {
    setSelectedCategory(catName);
    if (catName === "Birthday") {
      setCoupleName("AARAV'S BIRTHDAY");
    } else if (catName === "Engagement") {
      setCoupleName("ROHIT & SNEHA");
    } else {
      setCoupleName("RAHUL & PRIYA");
    }
  };

  return (
    <ParallaxProvider>
      <div className="bg-[#FAF9F6] text-[#241E1C] font-sans relative overflow-x-hidden min-h-screen">
      <SmoothScroll />
      <BackgroundBlobs />
      <FloatingElements />
      <Navbar />

      {/* =========================================================
          SECTION 1: HERO
          ========================================================= */}
      <SectionReveal>
        <Hero />
      </SectionReveal>

      {/* =========================================================
          SECTION 2: EVENT CATEGORIES (IMPROVED: Premium glass cards, Hover updates invitation preview)
          ========================================================= */}
      <SectionReveal>
        <EventCategories />
      </SectionReveal>

      {/* =========================================================
          SECTION 3: TEMPLATE GALLERY
          ========================================================= */}
      <SectionReveal>
        <TemplateGallery />
      </SectionReveal>

      {/* =========================================================
          SECTION 4: INVITATION BUILDER
          ========================================================= */}
      <SectionReveal>
        <BuilderShowcase />
      </SectionReveal>

      {/* =========================================================
          SECTIONS 6 & 7: DEVICE PREVIEW & SHARING SIDE BY SIDE
          ========================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#FFF9F2] py-24">
        <div className="max-w-7xl mx-auto w-full px-8 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Preview on Any Device */}
          <div className="space-y-12 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="space-y-3 w-full">
              <h2 className="text-[10px] uppercase font-bold text-[#C49B27] tracking-[3px]">Multi-Device Preview</h2>
              <h3 className="text-3xl md:text-5xl font-normal uppercase tracking-[0.5px] font-cinzel text-slate-800">Preview on Any Device</h3>
              <p className="text-xs text-[#241E1C]/50 font-semibold">See how your invitation looks on every screen.</p>
            </div>

            {/* Morphing single screen canvas frame */}
            <div className="flex flex-col items-center justify-center gap-8 relative select-none w-full">
              <div className="w-full flex items-center justify-center min-h-[440px] relative">
                <motion.div
                  layout
                  animate={{
                    width: activeDevice === "desktop" ? "380px" : activeDevice === "tablet" ? "280px" : "210px",
                    height: activeDevice === "desktop" ? "245px" : activeDevice === "tablet" ? "330px" : "400px",
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="bg-zinc-800 rounded-3xl border-[6px] border-zinc-700 shadow-2xl flex flex-col overflow-hidden relative"
                >
                  {/* Camera Notch for mobile/tablet screen mockups */}
                  {(activeDevice === "mobile" || activeDevice === "tablet") && (
                    <div className="w-16 h-3 bg-zinc-700 rounded-full mx-auto mt-2 absolute top-0 left-1/2 -translate-x-1/2 z-30" />
                  )}

                  <div className="flex-1 w-full bg-[#0A251B] p-6 flex flex-col justify-between items-center text-center text-white relative">
                    <span className="text-[10px] text-[#D4AF37] font-bold mt-2 z-10">ॐ</span>

                    <div className="space-y-2 z-10">
                      <h4 className="text-base font-bold font-cinzel uppercase tracking-[0.5px]">{coupleName}</h4>
                      <p className="text-[6.5px] text-zinc-400 font-mono tracking-[1.5px] uppercase">Wedding Rituals</p>
                    </div>

                    <span className="text-[6.5px] text-[#D4AF37] font-mono tracking-[0.5px] mb-2 uppercase z-10">Live Preview Sandbox</span>
                  </div>

                  {activeDevice === "desktop" && (
                    <div className="h-4 bg-zinc-800 w-full flex justify-center items-center"><div className="w-12 h-1.5 bg-zinc-600 rounded-full" /></div>
                  )}
                </motion.div>
              </div>

              {/* Toggle buttons */}
              <div className="flex items-center gap-1.5 bg-white p-1.5 border border-zinc-200 rounded-xl shadow-sm z-30">
                {[
                  { id: "desktop", label: "Desktop", icon: Monitor },
                  { id: "mobile", label: "Mobile", icon: Smartphone },
                  { id: "tablet", icon: Tablet, label: "Tablet" }
                ].map((dev) => (
                  <button
                    key={dev.id}
                    onClick={() => setActiveDevice(dev.id as any)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[9.5px] font-bold uppercase tracking-[1px] transition-all ${activeDevice === dev.id
                        ? "bg-[#C49B27] text-white shadow-sm"
                        : "text-[#241E1C]/65 hover:bg-zinc-100"
                      }`}
                  >
                    <dev.icon size={11} />
                    {dev.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Send Your Invitation In Seconds */}
          <div className="space-y-12 text-center lg:text-left">
            <div className="space-y-3 w-full">
              <p className="uppercase tracking-[0.35em] text-[10px] font-bold text-amber-500">
                Share Anywhere
              </p>
              <h2 className="text-3xl md:text-5xl font-normal uppercase tracking-[0.5px] font-cinzel text-slate-800 leading-tight">
                Send Your Invitation
                <br />
                In Seconds
              </h2>
            </div>
            
            {/* Sharing Cards list */}
            <div className="space-y-5">
              {shareItems.map((item, index) => {
                const Icon = item.icon;
                const cardContent = (
                  <motion.div
                    whileHover={{
                      x: 8,
                      scale: 1.02,
                    }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-5 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur-xl cursor-pointer w-full text-left"
                  >
                    <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 p-4 text-white">
                      <Icon size={24} />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-800">
                        {item.title}
                      </h3>
                      <p className="text-slate-500 text-sm font-semibold mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                );

                return item.isExternal ? (
                  <a key={item.title} href={item.href} target="_blank" rel="noopener noreferrer" download={item.download} className="block w-full">
                    {cardContent}
                  </a>
                ) : (
                  <Link key={item.title} href={item.href} className="block w-full">
                    {cardContent}
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          SECTION 9: FOOTER
          ========================================================= */}
      <SectionReveal>
        <Footer />
      </SectionReveal>
      </div>
    </ParallaxProvider>
  );
}