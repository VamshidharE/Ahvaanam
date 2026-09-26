"use client";

import React from "react";
import Hero from "../components/home/Hero";
import CategoryShowcase from "../components/home/CategoryShowcase";
import WeddingShowcase from "../components/home/WeddingShowcase";
import DevicePreview from "../components/home/DevicePreview";
import InvitationPlans from "../components/home/InvitationPlans";
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";

export default function RecreatedHomepage() {
  return (
    <div className="bg-[#FAF9F6] text-[#241E1C] font-sans relative overflow-x-hidden min-h-screen">

      {/* --- HEADER --- */}
      <Navbar />

      {/* SECTION 1: HERO */}
      <Hero />

      {/* SECTION 2: EVENT CATEGORIES SHOWCASE */}
      <CategoryShowcase />

      {/* SECTION 3: WEDDING DESIGNS SHOWCASE */}
      <WeddingShowcase />

      {/* SECTION 4: MULTI-DEVICE PREVIEW & FAST DISTRIBUTION */}
      <DevicePreview />

      {/* SECTION 5: CHOOSE YOUR INVITATION (PACKAGES) */}
      <InvitationPlans />

      {/* --- FOOTER --- */}
      <Footer />

    </div>
  );
}