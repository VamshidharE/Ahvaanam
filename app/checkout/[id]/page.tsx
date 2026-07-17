"use client";

import React, { useState, useEffect, use } from "react";
import { 
  ArrowLeft, CreditCard, ShieldCheck, Heart, Palette, Sparkles, AlertCircle, Loader, CheckCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Checkout details
  const [inviteData, setInviteData] = useState<{ groom: string; bride: string; theme: string } | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>("Pending");

  const supabase = createClient();

  useEffect(() => {
    // 1. Authenticate user session
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push(`/login?redirect=/checkout/${id}`);
      } else {
        loadInvitationDetails();
      }
    });
  }, [id]);

  const loadInvitationDetails = async () => {
    try {
      const res = await fetch(`/api/invitation/${id}`);
      
      if (res.status === 404) {
        setError("Invitation profile not found.");
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (res.ok) {
        setInviteData({
          groom: data.couple?.groom?.name || "Groom",
          bride: data.couple?.bride?.name || "Bride",
          theme: data.themeId || "royal-temple",
        });
        const isPaid = data._payment_status === "paid" || data._status === "published";
        setPaymentStatus(isPaid ? "Paid" : "Pending");
      } else {
        setError(data.error || "Failed to load checkout details.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    setError(null);

    try {
      const res = await fetch(`/api/invitation/${id}/pay`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Payment simulation failed");
      }

      // Successful simulated payment
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Simulated payment processing failed. Try again.");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-[#241E1C] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader className="text-[#C49B27] animate-spin" size={32} />
          <p className="text-[10px] text-[#241E1C]/40 font-bold uppercase tracking-[1.5px]">Preparing Secure Checkout...</p>
        </div>
      </div>
    );
  }

  if (error || !inviteData) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-[#241E1C] flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-white border border-red-500/10 p-8 rounded-3xl shadow-sm text-center space-y-6">
          <AlertCircle className="text-red-500 mx-auto" size={48} />
          <h3 className="text-base font-bold text-[#241E1C] uppercase tracking-[0.5px]">Checkout Error</h3>
          <p className="text-xs text-[#241E1C]/60 leading-relaxed">
            {error || "We could not retrieve the details for this invitation."}
          </p>
          <Link
            href="/dashboard"
            className="w-full bg-[#C49B27] hover:bg-[#B0871B] text-white font-bold py-3 rounded-xl text-xs transition-all tracking-[1px] block"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#241E1C] flex flex-col font-sans relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-yellow-600/[0.01] blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] rounded-full bg-amber-500/[0.01] blur-[130px] pointer-events-none" />

      {/* --- HEADER --- */}
      <header className="bg-white border-b border-zinc-200/50 px-8 h-16 flex items-center shadow-sm relative z-20">
        <Link href="/dashboard" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[1.5px] text-[#241E1C]/60 hover:text-[#241E1C] transition-colors">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </header>

      {/* --- MAIN PAGE CONTENT --- */}
      <main className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-white border border-amber-500/10 rounded-[32px] overflow-hidden shadow-sm">
          
          {/* LEFT PANEL: INVITATION SUMMARY */}
          <div className="p-8 md:p-12 space-y-6 flex flex-col justify-between bg-[#FAF9F6]/40 border-r border-zinc-100">
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[9px] text-[#C49B27] font-bold uppercase tracking-[2px] flex items-center gap-1.5">
                  <Sparkles size={10} /> Client Invitation Portal
                </span>
                <h2 className="text-2xl font-bold tracking-[0.5px] [font-family:var(--cinzel),serif] text-[#241E1C]">
                  {inviteData.groom} & {inviteData.bride}
                </h2>
                <p className="text-[10px] text-[#241E1C]/40 font-mono">ID: /{id}</p>
              </div>

              {/* Detail list */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white border border-[#C49B27]/10 rounded-xl text-[#C49B27]">
                    <Palette size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold text-[#241E1C]/40 tracking-[1px]">Template Theme</p>
                    <p className="text-xs font-bold text-[#241E1C] uppercase tracking-[0.5px]">{inviteData.theme.replace(/-/g, ' ')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white border border-[#C49B27]/10 rounded-xl text-[#C49B27]">
                    <Heart size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold text-[#241E1C]/40 tracking-[1px]">Hosting Service</p>
                    <p className="text-xs font-bold text-[#241E1C]">Premium Live Wedding Invitation</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Assurance */}
            <div className="pt-6 border-t border-zinc-200/50 flex items-center gap-2.5 text-[#241E1C]/50 text-[10px]">
              <ShieldCheck size={18} className="text-[#C49B27] shrink-0" />
              <span className="leading-normal">Secure server-side processing. Your digital invitation is activated immediately post checkout.</span>
            </div>
          </div>

          {/* RIGHT PANEL: PRICING & PAYMENT */}
          <div className="p-8 md:p-12 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#241E1C]/50">Pricing Details</h3>
              
              {/* Billing Breakdowns */}
              <div className="space-y-3.5 text-xs text-[#241E1C]/80 font-medium">
                <div className="flex justify-between">
                  <span>Standard Theme License</span>
                  <span>$49.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Premium Cloud Hosting (Lifetime)</span>
                  <span>$20.00</span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>Agency Launch Discount</span>
                  <span>-$30.00</span>
                </div>
                <div className="flex justify-between">
                  <span>GST / Processing Fee</span>
                  <span>$0.00</span>
                </div>
                
                <div className="border-t border-zinc-100 pt-3.5 mt-2 flex justify-between text-sm font-bold text-[#241E1C]">
                  <span className="uppercase tracking-[0.5px]">Amount Due</span>
                  <span className="text-[#C49B27] font-extrabold text-base">$39.00</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              {paymentStatus === "Paid" ? (
                <div className="bg-emerald-500/5 border border-emerald-500/20 text-emerald-700 text-xs px-4 py-4 rounded-xl flex items-center justify-center gap-2 font-bold uppercase tracking-[0.5px]">
                  <CheckCircle size={14} /> Already Paid
                </div>
              ) : (
                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full bg-[#C49B27] hover:bg-[#B0871B] text-white font-bold py-4 rounded-xl text-xs transition-all tracking-[1.5px] disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] shadow-md cursor-pointer"
                >
                  {processing ? (
                    <>
                      <Loader className="animate-spin" size={14} /> Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard size={14} /> Complete Simulated Payment
                    </>
                  )}
                </button>
              )}

              <p className="text-[9px] text-[#241E1C]/40 text-center leading-normal">
                By clicking, you trigger a simulated checkout webhook that updates the database flag without executing real bank transactions.
              </p>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
