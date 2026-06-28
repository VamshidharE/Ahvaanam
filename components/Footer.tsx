"use client";

import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#d4af37]/20 bg-[#0f0a12] py-8">
      <div className="mx-auto max-w-6xl px-6 text-center">

        <div className="mb-3 flex items-center justify-center gap-3">
          <div className="h-px w-16 bg-[#d4af37]/40" />
          <span className="text-[#d4af37]">✦ ✦ ✦</span>
          <div className="h-px w-16 bg-[#d4af37]/40" />
        </div>

        <h3 className="text-xl text-[#f6e7b8]">
          Designed by
        </h3>

        <p className="mt-2 text-2xl font-semibold text-[#d4af37]">
          Tirumala Flex Printers
        </p>

        <div className="mt-5 flex flex-col items-center gap-2 text-sm text-yellow-100/70 md:flex-row md:justify-center md:gap-8">

          <div className="flex items-center gap-2">
            <MapPin size={16} />
            Metpally, Jagtial, Telangana
            </div>
          
          <div className="flex items-center gap-2">
            <Mail size={16} />
            topmtpl@gmail.com
          </div>

          <div className="flex items-center gap-2">
            <Phone size={16} />
            +91 86881 78323
          </div>

        </div>

        <p className="mt-6 text-xs text-yellow-100/40">
          © {new Date().getFullYear()} InviteCraft. All Rights Reserved.
        </p>

      </div>
    </footer>
  );
}