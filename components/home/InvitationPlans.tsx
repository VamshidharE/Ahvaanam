"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function InvitationPlans() {
  const shouldReduceMotion = useReducedMotion();

  const plans = [
    {
      id: "simple",
      name: "SIMPLE INVITE",
      description: "A beautiful digital invitation with everything you need to share your celebration.",
      price: "Contact for pricing",
      badge: null,
      isPopular: false,
      features: [
        "Beautiful digital invitation",
        "Couple names & event details",
        "Date, time & venue",
        "Shareable invitation link",
        "WhatsApp sharing",
        "Mobile-friendly design",
        "RSVP details"
      ],
      cta: "CHOOSE SIMPLE INVITE",
      href: "/contact?plan=simple"
    },
    {
      id: "premium",
      name: "PREMIUM INVITE",
      description: "An interactive invitation with beautiful details, photos, music and more.",
      price: "Contact for pricing",
      badge: "MOST POPULAR",
      isPopular: true,
      features: [
        "Everything in Simple Invite",
        "Personalized music",
        "Photo gallery",
        "Event timeline",
        "Venue map",
        "Online RSVP",
        "QR code",
        "Multiple invitation sections",
        "Interactive animations",
        "Enhanced invitation design"
      ],
      cta: "CHOOSE PREMIUM INVITE",
      href: "/contact?plan=premium"
    },
    {
      id: "custom",
      name: "CUSTOM INVITE",
      description: "A completely personalized invitation designed around your celebration.",
      price: "Contact for pricing",
      badge: null,
      isPopular: false,
      features: [
        "Everything in Premium Invite",
        "Custom colors",
        "Custom layout",
        "Personalized visual design",
        "Custom animations",
        "Personalized family sections",
        "Advanced media integration",
        "Custom event sections",
        "High-resolution export",
        "Special design requirements"
      ],
      cta: "CREATE CUSTOM INVITE",
      href: "/contact?plan=custom"
    }
  ];

  return (
    <section className="py-24 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 space-y-14 z-30 relative select-none">
      
      {/* Soft Background Radial Light */}
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-[radial-gradient(circle,#FFF5DB_0%,transparent_70%)] opacity-40 blur-3xl pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-3 relative z-10"
      >
        <span className="text-xs font-bold uppercase tracking-[3.5px] text-[#C49B27] block">
          INVITATION PACKAGES
        </span>
        <h2 className="text-3xl md:text-5xl font-normal uppercase tracking-[0.5px] font-cinzel text-[#241E1C]">
          CHOOSE YOUR INVITATION
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 max-w-xl mx-auto font-semibold leading-relaxed">
          From a simple digital invite to a completely customized wedding experience.
        </p>

        {/* Decorative Gold Filigree Divider */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
          <span className="text-[#C49B27] text-xs">❖</span>
          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
        </div>
      </motion.div>

      {/* 3 Pricing / Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto relative z-10">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={shouldReduceMotion ? {} : { y: -6 }}
            className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
              plan.isPopular
                ? "bg-gradient-to-b from-white via-[#FFFDF8] to-[#FAF5E6] border-2 border-[#D4AF37] shadow-[0_15px_40px_rgba(196,155,39,0.18)]"
                : "bg-white/95 border border-amber-200/80 shadow-sm hover:border-[#D4AF37]/60 hover:shadow-md"
            }`}
          >
            {/* Most Popular Badge */}
            {plan.badge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C49B27] text-white text-[9.5px] font-bold uppercase tracking-[1.5px] shadow-md">
                <Sparkles size={11} />
                <span>{plan.badge}</span>
              </div>
            )}

            <div className="space-y-5">
              {/* Package Title & Description */}
              <div className="space-y-2 text-center border-b border-amber-200/50 pb-5">
                <h3 className="text-xl font-normal font-cinzel tracking-[1px] text-[#241E1C] uppercase">
                  {plan.name}
                </h3>
                <p className="text-[11px] text-zinc-500 font-medium leading-relaxed min-h-[36px]">
                  {plan.description}
                </p>
                <div className="pt-2 text-xs font-bold uppercase tracking-[1.5px] text-[#C49B27]">
                  {plan.price}
                </div>
              </div>

              {/* Feature List */}
              <ul className="space-y-2.5 text-xs text-zinc-700 font-medium">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2.5 leading-snug">
                    <span className="w-4 h-4 rounded-full bg-amber-100/80 border border-amber-300 text-[#C49B27] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-[11.5px]">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <div className="pt-8 mt-auto">
              <Link
                href={plan.href}
                className={`w-full py-3 px-4 rounded-full text-center text-[10.5px] font-bold uppercase tracking-[1.5px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                  plan.isPopular
                    ? "bg-gradient-to-r from-[#D4AF37] to-[#C49B27] text-white hover:shadow-md hover:brightness-105"
                    : "bg-white border border-[#C49B27] text-[#241E1C] hover:bg-[#C49B27] hover:text-white"
                }`}
              >
                <span>{plan.cta}</span>
                <ArrowRight size={13} />
              </Link>
            </div>

          </motion.div>
        ))}
      </div>

    </section>
  );
}
