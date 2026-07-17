"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Templates", path: "/templates" },
    { name: "Services", path: "/services" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "Contact", path: "/contact" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAF9F6]/85 border-b border-[#E5A93C]/10 backdrop-blur-md px-8 md:px-16 h-16 flex items-center justify-between select-none">
      <Link href="/" className="flex items-center hover:opacity-85 transition-opacity relative z-10">
        <img src="/images/logo.png" alt="Ahvaanam" className="h-26 w-auto object-contain translate-y-0 drop-shadow-sm" />
      </Link>

      <nav className="hidden lg:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[2px]">
        {navLinks.map((link) => {
          const isActive = pathname === link.path;
          return (
            <Link key={link.name} href={link.path} className="relative py-1.5 text-[#241E1C]/65 hover:text-[#C49B27] transition-colors">
              {link.name}
              {isActive && (
                <motion.div
                  layoutId="activeNavLine"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C49B27]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Auth Actions block */}
      <div className="flex items-center gap-5">
        {user ? (
          <>
            <Link 
              href="/dashboard"
              className="text-[10px] text-[#241E1C]/75 hover:text-[#C49B27] uppercase tracking-[1.5px] font-bold transition-colors"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="text-[10px] text-red-600 hover:text-red-700 uppercase tracking-[1.5px] font-bold transition-colors cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              href="/login"
              className="text-[10px] text-[#241E1C]/75 hover:text-[#C49B27] uppercase tracking-[1.5px] font-bold transition-colors"
            >
              Login
            </Link>
            <Link 
              href="/signup"
              className="bg-[#C49B27] hover:bg-[#B0871B] text-white px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[1.5px] transition-all shadow-sm hover:scale-105 active:scale-95"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
