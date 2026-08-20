"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Mail,
    Phone,
    MapPin,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function Footer() {
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });
    }, []);

    return (
        <footer className="relative overflow-hidden bg-[#FCFAF6] pt-28">

            {/* Background Glow */}

            <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-amber-200/20 blur-[120px]" />

            <div className="relative mx-auto max-w-7xl px-6">

                {/* Footer Content */}

                <div className="grid gap-14 py-20 md:grid-cols-2 lg:grid-cols-4">

                    {/* Brand */}

                    <div>

                        <img src="/images/logo.png" alt="Ahvaanam" className="h-8 md:h-9 w-auto object-contain" />

                        <p className="mt-5 leading-8 text-slate-500">
                            Craft beautiful digital invitations for weddings,
                            birthdays, engagements and every celebration.
                        </p>

                        <div className="mt-8 flex gap-4">


                        </div>

                    </div>

                    {/* Product */}

                    <div>

                        <h4 className="text-xl font-semibold">
                            Product
                        </h4>

                        <div className="mt-6 flex flex-col gap-4 text-slate-500">

                            <Link href="/dashboard" className="hover:text-amber-500 transition-colors">My Dashboard</Link>
                            <Link href="/demo" className="hover:text-amber-500 transition-colors">Preview Demo</Link>
                            <Link href="/services" className="hover:text-amber-500 transition-colors">Services</Link>
                            <Link href="/how-it-works" className="hover:text-amber-500 transition-colors">How It Works</Link>

                        </div>

                    </div>

                    {/* Company */}

                    <div>

                        <h4 className="text-xl font-semibold">
                            Company
                        </h4>

                        <div className="mt-6 flex flex-col gap-4 text-slate-500">

                            <Link href="/about" className="hover:text-amber-500 transition-colors">About Us</Link>
                            <Link href="/contact" className="hover:text-amber-500 transition-colors">Contact</Link>
                            <Link href="/privacy" className="hover:text-amber-500 transition-colors">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-amber-500 transition-colors">Terms of Service</Link>

                        </div>

                    </div>

                    {/* Contact */}

                    <div>

                        <h4 className="text-xl font-semibold">
                            Contact
                        </h4>

                        <div className="mt-6 space-y-5">

                            <div className="flex items-center gap-3">

                                <Mail
                                    size={18}
                                    className="text-amber-500"
                                />

                                <a href="mailto:topmtpl@gmail.com" className="text-slate-500 hover:text-amber-600 transition-colors">
                                    topmtpl@gmail.com
                                </a>

                            </div>

                            <div className="flex items-center gap-3">

                                <Phone
                                    size={18}
                                    className="text-amber-500"
                                />

                                <a href="tel:+918688178323" className="text-slate-500 hover:text-amber-600 transition-colors">
                                    +91 8688178323
                                </a>

                            </div>

                        </div>

                    </div>

                </div>
                {/* Bottom Bar */}

                <div className="flex flex-col items-center justify-between gap-6 border-t border-amber-100 py-8 md:flex-row">

                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} Ahvaanam. All rights reserved.
                    </p>

                    <div className="flex items-center gap-6 text-sm text-slate-500">
                        <Link href="/privacy" className="transition hover:text-amber-600">
                            Privacy Policy
                        </Link>

                        <Link href="/terms" className="transition hover:text-amber-600">
                            Terms
                        </Link>

                        <Link href="/contact" className="transition hover:text-amber-600">
                            Support
                        </Link>
                    </div>

                </div>

            </div>

        </footer>

    );
}