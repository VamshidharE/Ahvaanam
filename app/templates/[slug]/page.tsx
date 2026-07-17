"use client";

import React, { use, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Check, Send, ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../../components/home/Navbar";
import Footer from "../../../components/home/Footer";
import { createClient } from "@/utils/supabase/client";

const templatesList = [
  {
    slug: "royal-temple",
    title: "Royal Temple Layout",
    category: "Wedding",
    type: "Traditional",
    desc: "A majestic traditional design inspired by grand temple architecture, featuring brass hanging bells, glowing oil diyas, and warm stone carving backgrounds.",
    image: "/images/themes/royal-temple.jpg",
    features: [
      "Traditional Ganesha & Deity motifs",
      "Hanging brass bells decoration",
      "Glowing oil diyas lighting effect",
      "Traditional background music auto-play",
      "Complete multi-page ceremony timeline",
      "Google Maps venue location navigation"
    ]
  },
  {
    slug: "floral-garden",
    title: "Floral Garden Layout",
    category: "Wedding",
    type: "Elegant",
    desc: "A soft, premium aesthetic decorated with dreamy rose gardens, jasmine blooms, glassmorphic cards, and delicate falling rose petals.",
    image: "/images/themes/floral-garden.jpg",
    features: [
      "Water-color floral corner frames",
      "Drifting rose petal animation physics",
      "Premium glassmorphism cards layout",
      "Direct WhatsApp RSVP integration",
      "Interactive guests guestbook board",
      "High-res gallery slideshow carousel"
    ]
  },
  {
    slug: "south-indian",
    title: "South Indian Traditional",
    category: "Wedding",
    type: "Traditional",
    desc: "Cultural motifs featuring banana leaf backdrops, sacred Kolam patterns, brass samayis (lamps), and mango leaf torans.",
    image: "/images/themes/south-indian.jpg",
    features: [
      "Traditional banana leaf backdrop frame",
      "Sacred Kolam floor art illustrations",
      "Animated glowing brass samayis lamps",
      "Auspicious marigold floral garlands",
      "Direct phone RSVP helper buttons",
      "Google Maps coordinates directions"
    ]
  },
  {
    slug: "palace-luxury",
    title: "Palace Luxury Layout",
    category: "Wedding",
    type: "Royal",
    desc: "A grand design showcasing palace gates, royal red velvet overlays, shimmering chandeliers, and golden dust showers.",
    image: "/images/themes/palace-luxury.jpg",
    features: [
      "Grand palace entrance gate visuals",
      "Opening velvet curtain entrance reveal",
      "Twinkling chandelier light overlays",
      "Golden dust shower particles physics",
      "Complete RSVP dashboard management",
      "Custom audio registry autoplay support"
    ]
  },
  {
    slug: "lotus-serenity",
    title: "Lotus Serenity Layout",
    category: "Wedding",
    type: "Spiritual",
    desc: "A calming morning ambiance featuring holy lotus ponds, floating petals, flying birds, and gentle water ripples.",
    image: "/images/themes/lotus-serenity.jpg",
    features: [
      "Sacred pink lotus flowers ornament",
      "Water ripples animations overlay",
      "Flying morning birds outline physics",
      "Soft peach sunrise gradient theme",
      "Deity symbol customizer select panel",
      "Interactive wedding schedule cards"
    ]
  },
  {
    slug: "marigold",
    title: "Marigold Celebration",
    category: "Wedding",
    type: "Festive",
    desc: "A joyous celebration with dense orange and yellow marigold garlands, light sparklers, and celebratory golden confetti.",
    image: "/images/themes/marigold.jpg",
    features: [
      "Hanging marigold floral garlands",
      "Celebration sparklers glow effect",
      "Twinkling wedding countdown boxes",
      "Responsive photo grid gallery block",
      "Google Maps venue location links",
      "WhatsApp response RSVP direct form"
    ]
  },
  {
    slug: "peacock",
    title: "Peacock Royal Layout",
    category: "Wedding",
    type: "Royal",
    desc: "Opulent peacock motifs, glowing feathers, gemstone teal gradients, and sapphire sparkles.",
    image: "/images/themes/peacock.jpg",
    features: [
      "Opulent peacock feather overlays",
      "Gemstone teal background gradients",
      "Twinkling sapphire sparkle particles",
      "Premium royal serif calligraphy",
      "Interactive event location maps link",
      "Direct coordinator RSVP whatsapp list"
    ]
  },
  {
    slug: "heritage",
    title: "Heritage Haveli Layout",
    category: "Wedding",
    type: "Heritage",
    desc: "Traditional Rajasthani haveli sandstone arches, vintage textures, Jharokha screens, and warm rays of sunlight.",
    image: "/images/themes/heritage.jpg",
    features: [
      "Rajasthani haveli stone arches screen",
      "Jharokha window lattice filters",
      "Warm sun rays light leak animation",
      "Vintage terracotta textured backdrop",
      "Complete multi-venue coordinate maps",
      "Response sheets guest coordinator links"
    ]
  },
  {
    slug: "moonlight",
    title: "Moonlight Wedding Layout",
    category: "Wedding",
    type: "Modern",
    desc: "A mystical starry night sky backdrop featuring a glowing crescent moon, floating lanterns, and twinkling fireflies.",
    image: "/images/themes/moonlight.jpg",
    features: [
      "Mystical starry night sky overlay",
      "Glowing crescent moon decoration",
      "Animated floating sky lanterns",
      "Twinkling fireflies glow physics",
      "Google Calendar event sync helper",
      "WhatsApp RSVP coordinator helpline"
    ]
  },
  {
    slug: "grand-mandap",
    title: "Grand Mandap Layout",
    category: "Wedding",
    type: "Traditional",
    desc: "A royal mandap stage setting with thick flower canopies, brass ornaments, sacred fire, and smoke rises.",
    image: "/images/themes/grand-mandap.jpg",
    features: [
      "Sacred mandap fire animation rises",
      "Thick traditional flower canopy outline",
      "Hanging brass bells ornaments overlay",
      "Touch-ready horizontal gallery slider",
      "Google Maps location pins check",
      "WhatsApp & Phone direct RSVPs list"
    ]
  }
];

export default function TemplateDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const template = templatesList.find((t) => t.slug === slug);
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  if (!template) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#241E1C] font-sans relative overflow-x-hidden pt-28">
      <Navbar />

      <div className="absolute top-[8%] left-[-12%] w-[450px] h-[450px] bg-amber-100/30 rounded-full blur-[110px] pointer-events-none" />

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10 space-y-16">
        
        {/* Back Link */}
        <Link 
          href="/templates" 
          className="inline-flex items-center gap-1.5 text-xs text-[#241E1C]/60 hover:text-[#241E1C] transition-colors font-bold uppercase tracking-[1.5px]"
        >
          <ArrowLeft size={14} /> Back to Collection
        </Link>

        {/* Content Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-6">
          
          {/* Left Column: Image Card */}
          <div className="lg:col-span-6 rounded-[36px] border border-white bg-white/70 p-6 shadow-xl backdrop-blur-md flex items-center justify-center select-none">
            <div className="w-full aspect-[16/10] bg-[#FAF9F6] border border-zinc-100 rounded-[24px] shadow-lg overflow-hidden flex items-center justify-center">
              <img
                src={template.image}
                alt={template.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column: Spec Sheet */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase font-bold text-[#C49B27] tracking-[2.5px]">{template.type} Layout</span>
                <ChevronRight size={12} className="text-[#241E1C]/30" />
                <span className="text-[10px] uppercase font-bold bg-amber-50 border border-amber-200/50 text-[#C49B27] px-2.5 py-0.5 rounded-full">{template.category}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-normal uppercase tracking-[0.5px] font-cinzel leading-tight text-slate-800">{template.title} Style</h1>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">{template.desc}</p>
            </div>

            <div className="w-full h-[1px] bg-amber-100" />

            {/* Features Bullet List */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-[2px] text-[#C49B27] flex items-center gap-2">
                <Sparkles size={16} /> Included Customizations
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-slate-600 font-semibold font-mono">
                {template.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-[#C49B27] shrink-0">
                      <Check size={12} />
                    </div>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full h-[1px] bg-amber-100" />

            {/* CTA action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/demo"
                className="flex-1 text-center border border-zinc-200 hover:border-amber-400 py-4 rounded-xl text-xs font-bold uppercase tracking-[1px] text-slate-700 hover:text-amber-600 transition-all bg-white"
              >
                Launch Live Demo
              </Link>
              
              <Link
                href={user ? `/create?theme=${template.slug}` : `/login?redirect=${encodeURIComponent(`/create?theme=${template.slug}`)}`}
                className="flex-1 text-center bg-gradient-to-r from-amber-500 to-yellow-500 text-white py-4 rounded-xl text-xs font-bold uppercase tracking-[1px] shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Request Customization
                <Send size={12} />
              </Link>
            </div>

            <p className="text-[10px] text-center sm:text-left text-slate-400 font-medium">
              * Our design team will coordinate color palettes, deity symbols, background soundtracks, and content translations with you.
            </p>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
