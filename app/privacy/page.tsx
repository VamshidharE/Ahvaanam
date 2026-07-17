"use client";

import React from "react";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#241E1C] font-sans relative overflow-x-hidden pt-28">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12 relative z-10 space-y-8 text-left select-text">
        <h1 className="text-3xl md:text-5xl font-normal uppercase tracking-[0.5px] font-cinzel text-slate-800 border-b border-amber-100 pb-4">Privacy Policy</h1>
        
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-[1px]">Last Updated: June 30, 2026</p>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed font-semibold">
          <p>
            At Ahvaanam Studio, accessible from ahvaanam.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Ahvaanam and how we use it.
          </p>

          <h3 className="text-lg font-bold font-cinzel text-slate-800">Information We Collect</h3>
          <p>
            The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
          </p>
          <p>
            If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
          </p>

          <h3 className="text-lg font-bold font-cinzel text-slate-800">How We Use Your Information</h3>
          <p>We use the information we collect in various ways, including to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, operate, and maintain our website</li>
            <li>Improve, personalize, and expand our website</li>
            <li>Understand and analyze how you use our website</li>
            <li>Develop new products, services, features, and functionality</li>
            <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
            <li>Send you emails</li>
            <li>Find and prevent fraud</li>
          </ul>

          <h3 className="text-lg font-bold font-cinzel text-slate-800">Contact Us</h3>
          <p>
            If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at hello@ahvaanam.com.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
