"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle, 
  ArrowLeft, 
  MessageCircle, 
  ChevronDown, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";

const FAQs = [
  {
    question: "What is your typical turnaround time?",
    answer: "Our standard turnaround time is 3 to 5 business days for draft review. Once you approve the details, the final live link and downloadable assets are delivered within 24 hours."
  },
  {
    question: "Can I request changes after the invitation is live?",
    answer: "Yes. We offer structured revision rounds during the design phase, and complimentary updates after the invitation is launched for any date, timing, or venue changes."
  },
  {
    question: "Do you support custom background music?",
    answer: "Yes, you can share any track (MP3 or YouTube link) and we will crop and optimize it as the background theme music for your digital invitation."
  },
  {
    question: "Is there a limit to the number of guests I can share with?",
    answer: "No, there are no guest limits. Once your invitation is ready, you can share it with thousands of guests via WhatsApp, email, or social networks at no extra cost."
  }
];

export default function PremiumContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const formattedMessage = encodeURIComponent(
      `*New Ahvaanam Custom Invitation Enquiry*\n\n` +
      `👤 *Name:* ${name}\n` +
      `📧 *Email:* ${email}\n` +
      `📱 *Phone:* ${phone}\n\n` +
      `📝 *Event Requirements & Details:*\n${message}`
    );

    const whatsappUrl = `https://wa.me/918688178323?text=${formattedMessage}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    setTimeout(() => {
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#241E1C] font-sans relative overflow-x-hidden pt-28">
      <Navbar />

      <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-yellow-200/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[50%] right-[-10%] w-[500px] h-[500px] bg-amber-200/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10 space-y-24">
        
        {/* Hero Title */}
        <div className="text-center space-y-4">
          <span className="text-sm font-bold uppercase tracking-[4px] text-[#C49B27] block">Enquire Now</span>
          <h1 className="text-4xl md:text-6xl font-normal uppercase tracking-[0.5px] [font-family:var(--cinzel),serif]">Let's Create Your Story</h1>
          <p className="text-xs text-[#241E1C]/50 max-w-sm mx-auto uppercase tracking-[2px] font-bold">Collaborate with our premium design studio</p>
        </div>

        {/* Contact details & form block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Details Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            <div className="rounded-3xl border border-white bg-white/70 p-8 shadow-xl backdrop-blur-md space-y-6">
              <h3 className="text-xl font-bold uppercase tracking-[1px] font-cinzel">Studio Info</h3>
              
              <div className="space-y-5 text-sm">
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-[#C49B27] shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#241E1C]/40">Email Studio</p>
                    <a href="mailto:topmtpl@gmail.com" className="font-semibold hover:text-[#C49B27] transition-colors">topmtpl@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-[#C49B27] shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#241E1C]/40">Contact</p>
                    <a href="tel:+918688178323" className="font-semibold hover:text-[#C49B27] transition-colors">+91 8688178323</a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-[#C49B27] shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#241E1C]/40">Typical Response Time</p>
                    <p className="font-semibold text-green-600">Within 12 Hours</p>
                  </div>
                </div>

              </div>

              <div className="w-full h-[1px] bg-amber-100" />

              <a 
                href="https://wa.me/918688178323" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl bg-[#25D366] text-white font-bold text-xs uppercase tracking-[1px] shadow-[0_12px_24px_rgba(37,211,102,0.25)] hover:-translate-y-0.5 transition-transform"
              >
                <MessageCircle size={18} />
                Connect On WhatsApp
              </a>

            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white bg-white/70 p-8 md:p-12 shadow-xl backdrop-blur-md">
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center py-16 space-y-4 text-amber-600">
                  <CheckCircle size={44} className="text-[#C49B27]" />
                  <h4 className="text-xl font-bold uppercase font-cinzel">Enquiry Received</h4>
                  <p className="text-xs text-[#241E1C]/50 max-w-sm leading-relaxed">Thank you. One of our design coordinators will review your event requirements and connect with you via email or phone shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-xl font-bold uppercase tracking-[1px] font-cinzel">Enquiry Form</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase font-bold text-[#241E1C]/55 tracking-[1px]">Your Name</label>
                      <input 
                        type="text" 
                        required 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-white/80 border border-zinc-200 focus:border-[#C49B27] outline-none rounded-xl px-4 py-3 text-xs text-[#241E1C]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase font-bold text-[#241E1C]/55 tracking-[1px]">Email Address</label>
                      <input 
                        type="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/80 border border-zinc-200 focus:border-[#C49B27] outline-none rounded-xl px-4 py-3 text-xs text-[#241E1C]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-[9px] uppercase font-bold text-[#241E1C]/55 tracking-[1px]">Phone / WhatsApp Number</label>
                      <input 
                        type="tel" 
                        required 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-white/80 border border-zinc-200 focus:border-[#C49B27] outline-none rounded-xl px-4 py-3 text-xs text-[#241E1C]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-[9px] uppercase font-bold text-[#241E1C]/55 tracking-[1px]">Event Requirements & details</label>
                      <textarea 
                        required 
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="bg-white/80 border border-zinc-200 focus:border-[#C49B27] outline-none rounded-xl px-4 py-3 text-xs text-[#241E1C] resize-none"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-[1.5px] shadow-[0_12px_30px_rgba(234,179,8,0.3)] hover:-translate-y-0.5 transition-transform"
                  >
                    Submit Custom request
                    <ArrowRight size={14} />
                  </button>

                </form>
              )}
            </div>
          </div>

        </div>

        {/* FAQs */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-2xl md:text-4xl font-normal uppercase tracking-[0.5px] font-cinzel">Frequently Asked</h3>
            <p className="text-xs text-[#241E1C]/50 uppercase tracking-[2px] font-bold">Have some questions about custom invitations?</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {FAQs.map((faq, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="border border-zinc-200 rounded-2xl bg-white/70 backdrop-blur-sm px-6 py-4 cursor-pointer hover:border-amber-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-4 select-none">
                  <span className="font-semibold text-slate-800 text-sm">{faq.question}</span>
                  <ChevronDown className={`transition-transform text-[#C49B27] ${activeFaq === idx ? "rotate-180" : ""}`} size={16} />
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${activeFaq === idx ? "max-h-[200px] mt-3" : "max-h-0"}`}>
                  <p className="text-xs leading-relaxed text-slate-500 border-t border-amber-100 pt-3">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
