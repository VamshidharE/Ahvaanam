"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import PremiumHinduWeddingHero from "@/components/hero/PremiumHinduWeddingHero";

export default function DemoInvitationPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 120, hours: 14, minutes: 30, seconds: 45 });

  const [rsvpName, setRsvpName] = useState("");
  const [rsvpGuests, setRsvpGuests] = useState("1");
  const [submitted, setSubmitted] = useState(false);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRsvpName("");
      setRsvpGuests("1");
    }, 3000);
  };

  useEffect(() => {
    // Set wedding date countdown
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + 4);

    const timer = setInterval(() => {
      const difference = targetDate.getTime() - new Date().getTime();
      if (difference <= 0) {
        clearInterval(timer);
        return;
      }
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    // Audio setup
    const sound = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
    sound.loop = true;
    setAudio(sound);

    return () => {
      clearInterval(timer);
      sound.pause();
    };
  }, []);

  const toggleMusic = () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  // Pause audio when tab is minimized or switched to another app, and resume when returning
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!audio) return;

      if (document.hidden) {
        if (!audio.paused) {
          audio.pause();
        }
      } else {
        if (isPlaying) {
          audio.play().catch(() => {});
        }
      }
    };

    const handlePageHide = () => {
      if (audio && !audio.paused) audio.pause();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("blur", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("blur", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, [audio, isPlaying]);

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2D2621] font-sans relative select-none overflow-x-hidden">
      
      {/* Floating control bar */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        <button 
          onClick={toggleMusic}
          className="w-10 h-10 rounded-full bg-white/90 border border-[#D4AF37]/45 text-[#C49B27] flex items-center justify-center shadow-lg backdrop-blur-xl hover:scale-105 active:scale-95 transition-transform"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
        </button>
        <Link 
          href="/templates"
          className="px-4 py-2 text-[10px] font-bold uppercase tracking-[1.5px] rounded-full bg-white/95 border border-[#D4AF37]/45 text-[#2D2621] shadow-lg backdrop-blur-xl hover:text-[#C49B27] transition-all"
        >
          Back To Gallery
        </Link>
      </div>

      {/* Flagship Premium Hindu Wedding Hero Component */}
      <PremiumHinduWeddingHero />


      {/* Main card box */}
      <main className="w-full max-w-xl bg-white/60 border border-[#D4AF37]/25 rounded-[30px] p-8 md:p-14 text-center shadow-[0_20px_50px_rgba(0,0,0,0.04)] backdrop-blur-xl z-10 my-10 space-y-10 relative overflow-hidden">
        
        {/* Shine banner */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,246,221,0.55),transparent_70%)] pointer-events-none" />

        <div className="space-y-4">
          <p className="uppercase tracking-[0.4em] text-[10px] text-slate-500 font-bold">
            The Wedding Celebration Of
          </p>

          <h1 className="text-4xl md:text-5xl font-normal tracking-[0.5px] uppercase [font-family:var(--cinzel),serif] text-[#2D2621] leading-tight">
            Aarav &amp; Ananya
          </h1>
        </div>

        <div className="w-12 h-[1px] bg-[#D4AF37]/40 mx-auto" />

        {/* Date and Venue cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          
          <div className="p-5 rounded-2xl bg-white/90 border border-amber-200/40 shadow-sm flex items-start gap-4">
            <Calendar className="text-[#C49B27] shrink-0 mt-0.5" size={20} />
            <div className="space-y-1">
              <h4 className="text-xs uppercase font-bold text-[#C49B27] tracking-[1px]">The Ceremony</h4>
              <p className="text-sm font-semibold">Sunday, December 20, 2026</p>
              <p className="text-xs text-slate-500">Muhurtham: 10:15 AM</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/90 border border-amber-200/40 shadow-sm flex items-start gap-4">
            <MapPin className="text-[#C49B27] shrink-0 mt-0.5" size={20} />
            <div className="space-y-1">
              <h4 className="text-xs uppercase font-bold text-[#C49B27] tracking-[1px]">The Venue</h4>
              <p className="text-sm font-semibold">The Leela Palace</p>
              <p className="text-xs text-slate-500">Banjara Hills, Hyderabad</p>
            </div>
          </div>

        </div>

        {/* Countdown */}
        <div className="space-y-4">
          <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-[2px]">Counting Down To The Big Day</h4>
          <div className="flex justify-center items-center gap-6">
            {[
              { label: "Days", val: timeLeft.days },
              { label: "Hours", val: timeLeft.hours },
              { label: "Mins", val: timeLeft.minutes },
              { label: "Secs", val: timeLeft.seconds },
            ].map((unit) => (
              <div key={unit.label} className="text-center w-14">
                <span className="text-2xl md:text-3xl font-bold font-mono text-[#C49B27]">{unit.val.toString().padStart(2, "0")}</span>
                <p className="text-[9px] uppercase font-bold text-slate-400 mt-1">{unit.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RSVP Section */}
        <div className="border-t border-[#D4AF37]/25 pt-8 space-y-6">
          <h3 className="text-xl font-normal uppercase [font-family:var(--cinzel),serif] text-[#2D2621]">Kindly Respond</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">Please let us know if you can join our celebration before November 30.</p>

          {submitted ? (
            <div className="p-6 bg-amber-50 rounded-2xl text-[#C49B27] font-semibold text-sm">
              ✨ Thank you for responding! We look forward to seeing you.
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="space-y-4 max-w-sm mx-auto">
              <input 
                type="text" 
                placeholder="Your Name" 
                required
                value={rsvpName}
                onChange={(e) => setRsvpName(e.target.value)}
                className="w-full bg-white/80 border border-amber-200/50 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#C49B27] text-slate-800"
              />
              <div className="flex gap-3">
                <select 
                  value={rsvpGuests}
                  onChange={(e) => setRsvpGuests(e.target.value)}
                  className="bg-white/80 border border-amber-200/50 rounded-xl px-3 py-3 text-xs outline-none focus:border-[#C49B27] text-slate-800 shrink-0"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4+ Guests</option>
                </select>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold py-3 rounded-xl text-xs hover:shadow-lg transition-shadow active:scale-[0.98]"
                >
                  Confirm Attendance
                </button>
              </div>
            </form>
          )}
        </div>

      </main>

      {/* Footer credits */}
      <footer className="w-full max-w-lg text-center mb-8 z-10 text-[9px] uppercase tracking-[2px] text-slate-400 font-semibold flex flex-col items-center gap-1.5">
        <span>Designed &amp; Developed by Ahvaanam Studio</span>
        <Link href="/contact" className="text-[#C49B27] hover:underline">Request A Custom Design Like This</Link>
      </footer>

    </div>
  );
}
