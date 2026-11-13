"use client";

import React from "react";
import { Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="relative overflow-hidden bg-[#FAF9F6] border-t border-[#E5A93C]/15">
            {/* Subtle Warm Glow */}
            <div className="absolute left-1/2 top-0 h-32 w-80 -translate-x-1/2 rounded-full bg-amber-200/20 blur-3xl pointer-events-none" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Main Compact Row: Logo on Left, Text in Centre, Contact on Right */}
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 py-6 md:py-7">
                    {/* Left: Ahvaanam Logo */}
                    <div className="order-1 flex justify-center md:justify-start items-center">
                        <Link href="/" className="inline-block transition-transform hover:scale-105">
                            <img
                                src="/images/logo.png"
                                alt="Ahvaanam"
                                className="h-8 md:h-9 w-auto object-contain"
                            />
                        </Link>
                    </div>

                    {/* Centre: Tagline */}
                    <div className="order-2 text-center">
                        <p className="text-xs md:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
                            Craft beautiful digital invitations for weddings, birthdays, engagements and every celebration.
                        </p>
                    </div>

                    {/* Right: Contact Info */}
                    <div className="order-3 flex flex-col sm:flex-row items-center justify-center md:justify-end gap-4 sm:gap-6 text-xs md:text-sm text-slate-600">
                        <a
                            href="mailto:topmtpl@gmail.com"
                            className="flex items-center gap-2 hover:text-[#C49B27] transition-colors"
                        >
                            <span className="w-7 h-7 rounded-full bg-amber-500/10 flex items-center justify-center text-[#C49B27] shrink-0">
                                <Mail size={14} />
                            </span>
                            <span>topmtpl@gmail.com</span>
                        </a>

                        <a
                            href="tel:+918688178323"
                            className="flex items-center gap-2 hover:text-[#C49B27] transition-colors whitespace-nowrap"
                        >
                            <span className="w-7 h-7 rounded-full bg-amber-500/10 flex items-center justify-center text-[#C49B27] shrink-0">
                                <Phone size={14} />
                            </span>
                            <span>+91 8688178323</span>
                        </a>
                    </div>
                </div>

                {/* Bottom Bar: Copyright & Compact Navigation Links */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E5A93C]/15 py-4 text-xs text-slate-500">
                    <p>
                        © {new Date().getFullYear()} Ahvaanam. All rights reserved.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                        <Link href="/about" className="transition hover:text-[#C49B27]">
                            About Us
                        </Link>
                        <Link href="/privacy" className="transition hover:text-[#C49B27]">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="transition hover:text-[#C49B27]">
                            Terms
                        </Link>
                        <Link href="/contact" className="transition hover:text-[#C49B27]">
                            Support
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
