"use client";

import React, { useState, useEffect } from "react";
import { Lock, Mail, AlertCircle, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectPath, setRedirectPath] = useState("/dashboard");

  const supabase = createClient();

  // Read the redirect query parameter and any auth callback errors from the URL if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect");
      const urlError = params.get("error_description") || params.get("error");
      const message = params.get("message");

      if (redirect) {
        setRedirectPath(redirect);
      }
      if (urlError) {
        setError(decodeURIComponent(urlError));
      } else if (message) {
        setError(decodeURIComponent(message));
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (signInError) {
        throw new Error(signInError.message);
      }

      // Successful login, redirect to the dashboard or original destination
      window.location.href = redirectPath;
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#241E1C] flex items-center justify-center p-4 relative font-sans overflow-hidden">
      {/* Background radial glowing orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-yellow-600/[0.01] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-amber-500/[0.01] blur-[120px] pointer-events-none" />

      {/* --- LOGIN CARD --- */}
      <div className="w-full max-w-md bg-white border border-amber-500/10 backdrop-blur-xl p-8 rounded-3xl shadow-sm relative z-10 space-y-6">
        <div className="text-center flex flex-col items-center gap-2">
          <img src="/images/logo.png" alt="Ahvaanam" className="h-8 md:h-9 w-auto object-contain mb-2" />
          <p className="text-[9px] text-[#241E1C]/45 uppercase tracking-[2.5px] font-bold">
            Secure Client Control Center
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {error && (
            <div className="bg-red-500/5 border border-red-500/20 text-red-600 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {/* Email input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1.5px]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#241E1C]/35" size={16} />
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full bg-[#FAF9F6] border border-zinc-200 focus:border-[#C49B27] outline-none rounded-xl pl-11 pr-4 py-3 text-xs text-[#241E1C] transition-colors"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1.5px]">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#241E1C]/35" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full bg-[#FAF9F6] border border-zinc-200 focus:border-[#C49B27] outline-none rounded-xl pl-11 pr-11 py-3 text-xs text-[#241E1C] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#241E1C]/35 hover:text-[#241E1C]/65 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C49B27] hover:bg-[#B0871B] text-white font-bold py-3.5 rounded-xl text-xs transition-all tracking-[1.5px] disabled:opacity-50 mt-4 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 shadow-sm"
          >
            {loading ? "Authenticating..." : "Sign In to Control Center"}
          </button>

          {/* Extra Auth Options */}
          <div className="flex flex-col gap-2.5 text-center mt-6 pt-2 border-t border-zinc-100">
            <Link
              href="/forgot-password"
              className="text-[9px] text-[#C49B27] hover:underline font-bold uppercase tracking-[1px]"
            >
              Forgot Password?
            </Link>
            <p className="text-[10px] text-[#241E1C]/50 tracking-[0.5px]">
              Don't have an account?{" "}
              <Link href="/signup" className="text-[#C49B27] hover:underline font-bold">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

