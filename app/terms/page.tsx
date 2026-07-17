"use client";

import React from "react";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#241E1C] font-sans relative overflow-x-hidden pt-28">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12 relative z-10 space-y-8 text-left select-text">
        <h1 className="text-3xl md:text-5xl font-normal uppercase tracking-[0.5px] font-cinzel text-slate-800 border-b border-amber-100 pb-4">Terms of Service</h1>
        
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-[1px]">Last Updated: June 30, 2026</p>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed font-semibold">
          <p>
            Welcome to Ahvaanam. These terms and conditions outline the rules and regulations for the use of Ahvaanam's Website, located at ahvaanam.com.
          </p>
          <p>
            By accessing this website, we assume you accept these terms and conditions. Do not continue to use Ahvaanam if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h3 className="text-lg font-bold font-cinzel text-slate-800">License &amp; Ownership</h3>
          <p>
            Unless otherwise stated, Ahvaanam and/or its licensors own the intellectual property rights for all material on Ahvaanam. All intellectual property rights are reserved. You may access this from Ahvaanam for your own personal use subjected to restrictions set in these terms and conditions.
          </p>
          <p>You must not:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Republish material from Ahvaanam</li>
            <li>Sell, rent or sub-license material from Ahvaanam</li>
            <li>Reproduce, duplicate or copy material from Ahvaanam</li>
            <li>Redistribute content from Ahvaanam</li>
          </ul>

          <h3 className="text-lg font-bold font-cinzel text-slate-800">User Content</h3>
          <p>
            Parts of this website offer an opportunity for users to submit text details, event specifications, maps, and music files for custom design service coordination. Ahvaanam does not filter, edit, publish or review these media files prior to their presence on the website.
          </p>

          <h3 className="text-lg font-bold font-cinzel text-slate-800">Limitation of Liability</h3>
          <p>
            In no event shall Ahvaanam, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this website whether such liability is under contract. Ahvaanam, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this website.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
