"use client";

import React, { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    const performLogout = async () => {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch (error) {
        console.error("Failed to call logout API", error);
      } finally {
        // Redirect to login page in all cases
        window.location.href = "/login";
      }
    };

    performLogout();
  }, []);

  return (
    <div className="min-h-screen bg-[#06030C] text-white flex items-center justify-center text-center">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-[#C59B27] text-xs uppercase tracking-[2px] font-bold animate-pulse">Signing out...</h2>
      </div>
    </div>
  );
}
