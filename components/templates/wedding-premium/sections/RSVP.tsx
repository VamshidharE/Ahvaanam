"use client";

import React from "react";
import { MessageSquare, PhoneCall } from "lucide-react";
import { GoldDivider } from "../decorations";

interface Contact {
  type?: string;
  value?: string;
  label?: string;
}

interface RSVPProps {
  data: {
    title?: string;
    subtitle?: string;
    contacts?: Contact[];
  };
}

export default function RSVP({ data }: RSVPProps) {
  const titleVal = data?.title || "RSVP";
  const subtitleVal = data?.subtitle || "Please respond by July 15, 2026";
  const contactsVal = data?.contacts || [];

  return (
    <div className="py-8 text-center space-y-6 select-none">
      <h2 className="text-xl font-bold uppercase tracking-[2.5px] text-[#E6A817] font-serif">{titleVal}</h2>
      <GoldDivider />

      <p className="text-[#FFF7E6]/75 text-[10px] tracking-[1.5px] uppercase font-semibold max-w-xs mx-auto mb-2 font-sans">
        {subtitleVal}
      </p>

      {contactsVal.length > 0 && (
        <div className="space-y-4 pt-2">
          {contactsVal.map((contact, idx) => {
            const isWhatsapp = contact.type === "whatsapp";
            const linkHref = isWhatsapp 
              ? `https://wa.me/${contact.value}` 
              : `tel:${contact.value}`;

            return (
              <a
                key={idx}
                href={linkHref}
                target={isWhatsapp ? "_blank" : undefined}
                rel={isWhatsapp ? "noopener noreferrer" : undefined}
                className={`flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer text-center w-full max-w-[320px] mx-auto ${
                  isWhatsapp 
                    ? "bg-[#25D366] hover:bg-[#20ba5a] text-white border border-[#25D366]/20 shadow-[0_4px_12px_rgba(37,211,102,0.3)]" 
                    : "border border-[#E6A817]/40 bg-[#E6A817]/10 hover:bg-[#E6A817]/15 text-[#E6A817]"
                }`}
              >
                {isWhatsapp ? <MessageSquare size={14} /> : <PhoneCall size={14} />}
                <span>{contact.label}</span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
