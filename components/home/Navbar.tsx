"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Menu, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "SERVICES", href: "/services" },
    { name: "HOW IT WORKS", href: "/how-it-works" },
    { name: "CONTACT", href: "/contact" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-[#FAF9F6]/95 backdrop-blur-md shadow-md py-1.5 md:py-2 border-b border-[#E5A93C]/15" 
        : "bg-[#FAF9F6]/90 backdrop-blur-sm py-2.5 md:py-3.5 border-b border-[#E5A93C]/10"
    }`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center -ml-3 sm:-ml-4 lg:-ml-5 group">
          <img 
            src="/images/logo.png" 
            alt="Ahvaanam" 
            className="h-8 md:h-9 w-auto object-contain transition-transform group-hover:scale-105" 
          />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-9">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[10px] font-bold uppercase tracking-[2px] transition-colors relative py-1 ${
                  isActive ? "text-[#C49B27]" : "text-[#241E1C]/70 hover:text-[#C49B27]"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C49B27] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions (Dashboard & Logout / Login) */}
        <div className="hidden lg:flex items-center gap-5 text-[10px] font-bold uppercase tracking-[1.5px]">
          {user ? (
            <>
              <Link href="/dashboard" className="text-[#241E1C]/70 hover:text-[#C49B27] transition-colors">
                Dashboard
              </Link>
              <Link href="/logout" className="text-red-500 hover:text-red-600 transition-colors">
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="text-[#241E1C]/70 hover:text-[#C49B27] transition-colors">
                Dashboard
              </Link>
              <Link href="/login" className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C49B27] text-white shadow-sm hover:scale-105 transition-all">
                Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-[#241E1C] p-2"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF9F6] border-b border-[#E5A93C]/15 px-6 py-6 space-y-4 text-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-bold uppercase tracking-[2px] text-[#241E1C] hover:text-[#C49B27]"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-zinc-200 flex justify-center gap-6 text-xs font-bold uppercase">
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-[#C49B27]">Dashboard</Link>
            {user ? (
              <Link href="/logout" onClick={() => setMobileMenuOpen(false)} className="text-red-500">Logout</Link>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-[#241E1C]">Login</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}