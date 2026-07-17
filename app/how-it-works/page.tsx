"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Share2, 
  Palette, 
  RotateCw, 
  CheckCircle,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";

const steps = [
  {
    icon: Mail,
    title: "1. Contact Our Studio",
    subtitle: "Initiate Consultation",
    desc: "Submit your basic details and celebration theme preferences. One of our design coordinators will connect with you to align on design styles."
  },
  {
    icon: Share2,
    title: "2. Share Event Details",
    subtitle: "Provide Specifications",
    desc: "Send us your text details, itineraries, photos, location coordinates, and custom background music choices. We organize it into a design blueprint."
  },
  {
    icon: Palette,
    title: "3. Studio Designing",
    subtitle: "Handcrafted Draft",
    desc: "Our creative designers craft your customized invitation, fine-tuning the transitions, animations, typography hierarchy, and luxury layouts."
  },
  {
    icon: RotateCw,
    title: "4. Unlimited Revisions",
    subtitle: "Iterative Refinements",
    desc: "Review the live sandbox draft. We offer unlimited review loops to adjust color tones, margins, scripts, or images until it feels absolutely perfect."
  },
  {
    icon: CheckCircle,
    title: "5. Final Delivery",
    subtitle: "Invitation Goes Live",
    desc: "We deploy your high-fidelity invitation to a dedicated premium link, set up RSVP coordination, and deliver high-res offline assets (image & PDF)."
  }
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#241E1C] font-sans relative overflow-x-hidden pt-28">
      <Navbar />

      <div className="absolute top-[12%] left-[-10%] w-[450px] h-[450px] bg-yellow-100/30 rounded-full blur-[100px] pointer-events-none" />

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10 space-y-16">
        
        {/* Title */}
        <div className="text-center space-y-4">
          <span className="text-sm font-bold uppercase tracking-[4px] text-[#C49B27] block">Design Workflow</span>
          <h1 className="text-4xl md:text-6xl font-normal uppercase tracking-[0.5px] [font-family:var(--cinzel),serif]">How It Works</h1>
          <p className="text-xs text-[#241E1C]/50 max-w-sm mx-auto uppercase tracking-[2px] font-bold">Seamless collaborative design from draft to launch</p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto py-12">
          
          {/* Vertical gold center line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-[#C49B27]/10 via-[#C49B27] to-[#C49B27]/10 -translate-x-1/2" />

          {/* Timeline Steps loop */}
          <div className="space-y-12">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isEven = idx % 2 === 0;

              return (
                <div key={idx} className="relative flex flex-col md:flex-row items-start md:items-center">
                  
                  {/* Left Column (empty on odd steps) */}
                  <div className={`w-full md:w-1/2 pr-0 md:pr-12 text-left md:text-right hidden md:block ${isEven ? "" : "invisible"}`}>
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold text-[#C49B27] tracking-[2px]">{step.subtitle}</span>
                      <h3 className="text-xl font-bold uppercase font-cinzel text-slate-800">{step.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-semibold">{step.desc}</p>
                    </div>
                  </div>

                  {/* Bullet Node */}
                  <div className="absolute left-8 md:left-1/2 w-14 h-14 rounded-full bg-white border-2 border-[#D4AF37] shadow-lg flex items-center justify-center -translate-x-1/2 z-20 text-[#C49B27]">
                    <Icon size={20} />
                  </div>

                  {/* Mobile & Right Column (renders contents on right for even steps, left for odd steps) */}
                  <div className={`w-full pl-20 md:pl-12 md:w-1/2 text-left ${isEven ? "md:invisible" : ""}`}>
                    <div className="space-y-2 max-w-md">
                      <span className="text-[10px] uppercase font-bold text-[#C49B27] tracking-[2px]">{step.subtitle}</span>
                      <h3 className="text-xl font-bold uppercase font-cinzel text-slate-800">{step.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-semibold">{step.desc}</p>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom Callout */}
        <div className="text-center py-12">
          <div className="inline-flex flex-col items-center gap-4 bg-white/70 border border-white p-8 rounded-[36px] shadow-xl backdrop-blur-md max-w-lg mx-auto">
            <h3 className="text-xl font-bold uppercase tracking-[1px] font-cinzel">Ready To Start Your Project?</h3>
            <p className="text-xs text-slate-500 max-w-xs font-semibold leading-relaxed">Work directly with our design consultants to create a digital invitation that reflects your unique vision.</p>
            <Link 
              href="/contact"
              className="mt-3 group inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold px-8 py-3.5 rounded-xl text-xs uppercase tracking-[1px] hover:-translate-y-0.5 transition-all shadow-md"
            >
              Get Your Custom Invitation
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
