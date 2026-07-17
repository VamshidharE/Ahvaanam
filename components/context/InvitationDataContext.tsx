"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { WeddingInvitationConfig } from "../types/invitation";

interface InvitationDataContextProps {
  invitationData: WeddingInvitationConfig | null;
  loading: boolean;
  error: string | null;
  updateInvitationData: (updater: (prev: WeddingInvitationConfig) => WeddingInvitationConfig) => void;
  saveConfig: () => Promise<{ success: boolean; error?: string }>;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedTheme: string | null;
  setSelectedTheme: (theme: string | null) => void;
}

const InvitationDataContext = createContext<InvitationDataContextProps | undefined>(undefined);

export function InvitationDataProvider({ children, clientId, isEditor = false }: { children: React.ReactNode; clientId?: string; isEditor?: boolean }) {
  const [invitationData, setInvitationData] = useState<WeddingInvitationConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  // Fetch invitation data on mount or when clientId changes
  useEffect(() => {
    if (!clientId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const fetchUrl = isEditor ? `/api/invitation/${clientId}/edit` : `/api/invitation/${clientId}`;
    fetch(fetchUrl)
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to fetch invitation config");
        }
        return res.json();
      })
      .then((data) => {
        setInvitationData(data);
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err.message || "Failed to load invitation.");
        setLoading(false);
      });
  }, [clientId]);

  // Listen for live editor preview updates from parents
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === "UPDATE_CONFIG") {
        setInvitationData(e.data.config);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const updateInvitationData = (updater: (prev: WeddingInvitationConfig) => WeddingInvitationConfig) => {
    setInvitationData((prev) => {
      if (!prev) return null;
      return updater(prev);
    });
  };

  const saveConfig = async () => {
    if (!invitationData || !clientId) return { success: false, error: "No configuration or client ID loaded" };

    try {
      const res = await fetch(`/api/invitation/${clientId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invitationData),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (errData.details && Array.isArray(errData.details)) {
          const detailMsgs = errData.details.map((d: any) => d.message).join(" ");
          throw new Error(detailMsgs || errData.error);
        }
        throw new Error(errData.error || "Failed to save configuration");
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return (
    <InvitationDataContext.Provider value={{ 
      invitationData, 
      loading, 
      error,
      updateInvitationData,
      saveConfig,
      selectedCategory,
      setSelectedCategory,
      selectedTheme,
      setSelectedTheme
    }}>
      {children}
    </InvitationDataContext.Provider>
  );
}

export function useInvitationData() {
  const context = useContext(InvitationDataContext);
  if (context === undefined) {
    throw new Error("useInvitationData must be used within an InvitationDataProvider");
  }
  return context;
}
